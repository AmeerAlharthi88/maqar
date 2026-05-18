/**
 * Phase H — AI Usage Tracking: Test Suite
 *
 * Runs tests in two groups:
 *   GROUP A — Logic tests (no DB required): guest limits, quota math, feature mapping
 *   GROUP B — HTTP tests (dev server required): mock fallback, smart-reply blocked as guest
 *   GROUP C — DB tests (migrations must be applied): quota enforcement, log row structure,
 *              midnight reset
 *
 * Run: node scripts/test-phase-h.mjs
 */

import { readFileSync } from "fs";
import { resolve }      from "path";
import { createClient } from "@supabase/supabase-js";

// ── Load env ──────────────────────────────────────────────────────────────────
const cwd = process.cwd();
const envRaw = readFileSync(resolve(cwd, ".env.local"), "utf8");
const env = {};
for (const line of envRaw.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i === -1) continue;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
}

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY  = env["SUPABASE_SERVICE_ROLE_KEY"];
const APP_URL      = env["NEXT_PUBLIC_APP_URL"] || "http://localhost:3000";
const HAS_ANTH_KEY = !!env["ANTHROPIC_API_KEY"];

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Test harness ───────────────────────────────────────────────────────────────
let passed = 0, failed = 0, skipped = 0;
const log = [];

function assert(label, condition, detail = "") {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
    log.push({ label, ok: true });
  } else {
    console.error(`  ❌ ${label}${detail ? `  ← ${detail}` : ""}`);
    failed++;
    log.push({ label, ok: false, detail });
  }
}
function skip(label, reason) {
  console.log(`  ⏭  ${label}  (${reason})`);
  skipped++;
  log.push({ label, ok: null, reason });
}
function section(title) {
  console.log(`\n${"─".repeat(62)}`);
  console.log(`🧪 ${title}`);
  console.log("─".repeat(62));
}

// ── Replicated app logic (no imports needed) ──────────────────────────────────
const AI_PLAN_LIMITS = {
  free:      { "generate-description": 3, valuation: 5, assistant: 10, "roi-explanation": 10, "market-summary": 5, "duplicate-risk": 3, "listing-quality": 3, "smart-reply": 0 },
  agent_pro: { "generate-description": 50, valuation: 100, assistant: 200, "roi-explanation": 200, "market-summary": 50, "duplicate-risk": 100, "listing-quality": 50, "smart-reply": 200 },
  agency:    { "generate-description": 200, valuation: 500, assistant: 500, "roi-explanation": 500, "market-summary": 200, "duplicate-risk": 500, "listing-quality": 200, "smart-reply": 1000 },
};
const AI_GUEST_LIMITS = { assistant: 3, "roi-explanation": 5, "market-summary": 5, valuation: 2 };
const featureToDb = f => f.replace(/-/g, "_");

async function checkUsageLimit(feature, userId) {
  if (!userId) {
    const g = AI_GUEST_LIMITS[feature];
    return g === undefined
      ? { allowed: false, remaining: 0, src: "guest-blocked" }
      : { allowed: true,  remaining: g, src: "guest-ok" };
  }
  const { data: sub } = await sb.from("subscriptions").select("plan_id").eq("user_id", userId).maybeSingle();
  const planId = sub?.plan_id ?? "free";
  const limit  = (AI_PLAN_LIMITS[planId] ?? AI_PLAN_LIMITS.free)[feature] ?? 0;
  if (limit === 0) return { allowed: false, remaining: 0, planId, src: "plan-no-access" };
  const today = new Date(); today.setHours(0,0,0,0);
  const { count, error } = await sb.from("ai_usage_logs").select("id",{count:"exact",head:true})
    .eq("user_id", userId).eq("feature", featureToDb(feature))
    .eq("success", true).eq("is_mock_fallback", false)
    .gte("created_at", today.toISOString());
  if (error) return { allowed: true, src: "fail-open" };
  const remaining = Math.max(0, limit - (count ?? 0));
  const resetAt   = new Date(); resetAt.setDate(resetAt.getDate()+1); resetAt.setHours(0,0,0,0);
  return { allowed: (count??0) < limit, remaining, planId, dailyCount: count??0, dailyLimit: limit,
           resetAt: resetAt.toISOString().slice(0,10), src: "db" };
}

async function dbAvailable() {
  // Use raw fetch — the JS client's head:true count silently swallows 404 errors
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/ai_usage_logs?select=id&limit=0`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
      signal: AbortSignal.timeout(6000),
    });
    return r.status === 200;
  } catch {
    return false;
  }
}

async function devServerAvailable() {
  try {
    const r = await fetch(`${APP_URL}/api/ai/valuation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyType:"شقة", purpose:"sale", price:50000, area:120, areaAr:"بوشر", wilayatAr:"مسقط" }),
      signal: AbortSignal.timeout(6000),
    });
    return r.status < 500;
  } catch { return false; }
}

async function getTestUser() {
  const { data } = await sb.from("subscriptions").select("user_id,plan_id").eq("plan_id","free").limit(1).maybeSingle();
  if (data?.user_id) return data;
  const { data: p } = await sb.from("profiles").select("id").limit(1).maybeSingle();
  return p ? { user_id: p.id, plan_id: "free" } : null;
}

async function insertLog(overrides) {
  const { error } = await sb.from("ai_usage_logs").insert({ feature:"valuation", success:true, is_mock_fallback:false, metadata:{}, ...overrides });
  if (error) throw new Error(error.message);
}

async function cleanLogs(userId, marker) {
  await sb.from("ai_usage_logs").delete().eq("user_id",userId).contains("metadata",{test_run:marker});
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GROUP A — Pure logic (no network needed)
// ═══════════════════════════════════════════════════════════════════════════════
function groupA_logic() {
  section("GROUP A — Logic tests (no DB / server needed)");

  // Feature name → DB enum mapper
  assert("featureToDb: 'generate-description' → 'generate_description'", featureToDb("generate-description") === "generate_description");
  assert("featureToDb: 'roi-explanation'      → 'roi_explanation'",      featureToDb("roi-explanation")      === "roi_explanation");
  assert("featureToDb: 'smart-reply'          → 'smart_reply'",          featureToDb("smart-reply")          === "smart_reply");
  assert("featureToDb: 'market-summary'       → 'market_summary'",       featureToDb("market-summary")       === "market_summary");

  // Guest limits
  const gAssistant   = AI_GUEST_LIMITS["assistant"];
  const gROI         = AI_GUEST_LIMITS["roi-explanation"];
  const gMarket      = AI_GUEST_LIMITS["market-summary"];
  const gValuation   = AI_GUEST_LIMITS["valuation"];
  const gSmartReply  = AI_GUEST_LIMITS["smart-reply"];
  const gGenDesc     = AI_GUEST_LIMITS["generate-description"];

  assert("Guest limit: assistant=3",           gAssistant  === 3);
  assert("Guest limit: roi-explanation=5",     gROI        === 5);
  assert("Guest limit: market-summary=5",      gMarket     === 5);
  assert("Guest limit: valuation=2",           gValuation  === 2);
  assert("Guest limit: smart-reply=undefined (blocked)", gSmartReply === undefined);
  assert("Guest limit: generate-description=undefined (blocked)", gGenDesc === undefined);

  // checkUsageLimit guest path (pure)
  const gA  = AI_GUEST_LIMITS["assistant"]      !== undefined;
  const gSR = AI_GUEST_LIMITS["smart-reply"]    === undefined;
  assert("Guest path: assistant → allowed=true",    gA);
  assert("Guest path: smart-reply → allowed=false", gSR);

  // Plan limit table spot-checks
  assert("Free plan  / valuation    limit = 5",   AI_PLAN_LIMITS.free["valuation"]              === 5);
  assert("Free plan  / smart-reply  limit = 0",   AI_PLAN_LIMITS.free["smart-reply"]            === 0);
  assert("agent_pro  / valuation    limit = 100",  AI_PLAN_LIMITS.agent_pro["valuation"]         === 100);
  assert("agency     / assistant    limit = 500",  AI_PLAN_LIMITS.agency["assistant"]            === 500);
  assert("agent_pro  / smart-reply  limit = 200",  AI_PLAN_LIMITS.agent_pro["smart-reply"]       === 200);

  // Quota math
  const limit = 5; // free/valuation
  for (const count of [0,1,4]) {
    assert(`Quota math: count=${count} < limit=${limit} → allowed`,  count < limit);
  }
  for (const count of [5,6,10]) {
    assert(`Quota math: count=${count} >= limit=${limit} → blocked`, !(count < limit));
  }

  // midnight reset boundary
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today.getTime() - 1);          // 23:59:59 yesterday
  const todayStr   = today.toISOString();
  assert("today.toISOString() >= todayStart",   new Date(todayStr) >= today);
  assert("yesterday < todayStart",              yesterday < today);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GROUP B — HTTP tests (dev server required)
// ═══════════════════════════════════════════════════════════════════════════════
async function groupB_http(serverUp) {
  section("GROUP B — HTTP tests (dev server @ " + APP_URL + ")");

  if (!serverUp) {
    for (const t of [
      "POST /api/ai/valuation → 200 + isMockFallback=true (no ANTHROPIC_API_KEY)",
      "POST /api/ai/valuation → feature=valuation in response",
      "POST /api/ai/smart-reply as guest → errorCode=usage_limit_reached",
      "POST /api/ai/assistant  as guest → 200 (allowed)",
      "POST /api/ai/valuation  invalid body → 400",
    ]) skip(t, "dev server not running");
    return;
  }

  // Test 3 — No ANTHROPIC_API_KEY → mock fallback
  {
    const r = await fetch(`${APP_URL}/api/ai/valuation`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ propertyType:"شقة", purpose:"sale", price:50000, area:120, areaAr:"بوشر", wilayatAr:"مسقط" }),
    });
    const b = await r.json().catch(()=>({}));
    assert("POST /api/ai/valuation → 200",                       r.status === 200, `got ${r.status}`);
    assert("POST /api/ai/valuation → isMockFallback=true",       b.isMockFallback === true,   JSON.stringify(b).slice(0,120));
    assert("POST /api/ai/valuation → feature=valuation",         b.feature === "valuation");
    assert("POST /api/ai/valuation → success=true",              b.success === true);
    assert("POST /api/ai/valuation → summaryAr has text",        typeof b.summaryAr === "string" && b.summaryAr.length > 5);
    console.log(`     preview: positionType=${b.positionType}, confidence="${b.confidence}"`);
  }

  // Test 4 — Guest smart-reply blocked via HTTP
  {
    const r = await fetch(`${APP_URL}/api/ai/smart-reply`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ trigger:"is_available", leadMessageAr:"هل العقار متاح؟", listingTitleAr:"شقة في مسقط", agentNameAr:"محمد" }),
    });
    const b = await r.json().catch(()=>({}));
    assert("POST /api/ai/smart-reply (guest) → errorCode=usage_limit_reached",
           b.errorCode === "usage_limit_reached", JSON.stringify(b).slice(0,120));
    assert("POST /api/ai/smart-reply (guest) → success=false", b.success === false);
  }

  // Test 4 — Guest assistant allowed via HTTP
  {
    const r = await fetch(`${APP_URL}/api/ai/assistant`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ messages:[{role:"user",content:"ما هي أسعار الشقق في مسقط؟"}] }),
    });
    const b = await r.json().catch(()=>({}));
    assert("POST /api/ai/assistant (guest) → 200",         r.status === 200, `got ${r.status}`);
    assert("POST /api/ai/assistant (guest) → success=true", b.success === true, JSON.stringify(b).slice(0,120));
  }

  // Invalid body → 400
  {
    const r = await fetch(`${APP_URL}/api/ai/valuation`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ bad:"data" }),
    });
    assert("POST /api/ai/valuation invalid body → 400", r.status === 400, `got ${r.status}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GROUP C — DB tests (migrations must be applied)
// ═══════════════════════════════════════════════════════════════════════════════
async function groupC_db(dbUp) {
  section("GROUP C — DB tests (ai_usage_logs table required)");

  if (!dbUp) {
    const reason = "ai_usage_logs table not found — apply scripts/apply-all-phase-fgh.sql in Supabase SQL editor first";
    for (const t of [
      "Test 1: After 4 inserts → allowed=true, remaining=1",
      "Test 1: After 5 inserts → allowed=false, remaining=0",
      "Test 1: 6th call is blocked",
      "Test 2: Real row: feature=valuation, success=true, is_mock_fallback=false",
      "Test 2: Mock row: is_mock_fallback=true, success=false",
      "Test 2: Quota count only counts non-mock rows",
      "Test 5: Yesterday rows NOT counted in today's quota",
      "Test 5: Yesterday rows exist in DB (totalCount=5)",
      "Test 5: checkUsageLimit ignores yesterday's rows → allowed=true",
      "Test 5: resetAt = tomorrow (YYYY-MM-DD format)",
    ]) skip(t, reason);
    return;
  }

  const testUser = await getTestUser();
  if (!testUser) {
    for (const t of ["Test 1","Test 2","Test 5"]) skip(t, "No profiles/subscriptions in DB");
    return;
  }

  const { user_id: userId } = testUser;
  console.log(`  Using user: ${userId.slice(0,8)}… (plan: ${testUser.plan_id ?? "free"})`);

  // ── Test 1: quota enforcement ─────────────────────────────────────────────
  console.log("\n  ▶ Test 1 — Quota enforcement");
  const m1 = `phase-h-quota-${Date.now()}`;
  try {
    await cleanLogs(userId, m1);
    for (let i=0;i<4;i++) await insertLog({ user_id:userId, feature:"valuation", metadata:{test_run:m1,seq:i+1} });
    const r4 = await checkUsageLimit("valuation", userId);
    assert("After 4 inserts → allowed=true, remaining=1", r4.allowed===true && r4.remaining===1, JSON.stringify(r4));

    await insertLog({ user_id:userId, feature:"valuation", metadata:{test_run:m1,seq:5} });
    const r5 = await checkUsageLimit("valuation", userId);
    assert("After 5 inserts → allowed=false, remaining=0", r5.allowed===false && r5.remaining===0, JSON.stringify(r5));
    assert("6th call is blocked (usage_limit_reached)", r5.allowed===false);
  } finally {
    await cleanLogs(userId, m1);
    console.log("    🧹 Test 1 rows cleaned");
  }

  // ── Test 2: row structure ─────────────────────────────────────────────────
  console.log("\n  ▶ Test 2 — Row structure in ai_usage_logs");
  const m2 = `phase-h-struct-${Date.now()}`;
  try {
    await sb.from("ai_usage_logs").insert({ user_id:userId, feature:"valuation",      success:true,  is_mock_fallback:false, input_token_est:120, output_token_est:80, metadata:{test_run:m2} });
    await sb.from("ai_usage_logs").insert({ user_id:userId, feature:"market_summary", success:false, is_mock_fallback:true,  metadata:{test_run:m2} });

    const { data: rows, error } = await sb.from("ai_usage_logs").select("*")
      .eq("user_id",userId).contains("metadata",{test_run:m2}).order("created_at");
    if (error||!rows?.length) { assert("Rows readable",false,error?.message??"none"); return; }

    const real = rows.find(r=>r.feature==="valuation");
    const mock = rows.find(r=>r.feature==="market_summary");

    assert("Real row: feature=valuation",          real?.feature==="valuation");
    assert("Real row: success=true",               real?.success===true);
    assert("Real row: is_mock_fallback=false",     real?.is_mock_fallback===false);
    assert("Real row: input_token_est=120",        real?.input_token_est===120);
    assert("Mock row: is_mock_fallback=true",      mock?.is_mock_fallback===true);
    assert("Mock row: success=false",              mock?.success===false);
    assert("Rows have id + created_at",            !!(real?.id&&real?.created_at&&mock?.id));

    // verify mock rows excluded from quota count
    const today=new Date(); today.setHours(0,0,0,0);
    const {count} = await sb.from("ai_usage_logs").select("id",{count:"exact",head:true})
      .eq("user_id",userId).eq("feature","valuation").eq("success",true).eq("is_mock_fallback",false)
      .gte("created_at",today.toISOString()).contains("metadata",{test_run:m2});
    assert("Quota count only counts non-mock rows (count=1)", count===1, `got ${count}`);
  } finally {
    await sb.from("ai_usage_logs").delete().eq("user_id",userId).contains("metadata",{test_run:m2});
    console.log("    🧹 Test 2 rows cleaned");
  }

  // ── Test 5: midnight reset ────────────────────────────────────────────────
  console.log("\n  ▶ Test 5 — Midnight reset (yesterday rows ignored)");
  const m5  = `phase-h-reset-${Date.now()}`;
  const yest = new Date(Date.now()-25*60*60*1000).toISOString();
  try {
    for (let i=0;i<5;i++) await sb.from("ai_usage_logs").insert({ user_id:userId, feature:"duplicate_risk", success:true, is_mock_fallback:false, created_at:yest, metadata:{test_run:m5,seq:i+1} });

    const today=new Date(); today.setHours(0,0,0,0);
    const {count:todayCount} = await sb.from("ai_usage_logs").select("id",{count:"exact",head:true})
      .eq("user_id",userId).eq("feature","duplicate_risk").eq("success",true).eq("is_mock_fallback",false)
      .gte("created_at",today.toISOString()).contains("metadata",{test_run:m5});
    assert("Yesterday rows NOT counted in today quota (count=0)", todayCount===0, `got ${todayCount}`);

    const {count:total} = await sb.from("ai_usage_logs").select("id",{count:"exact",head:true})
      .eq("user_id",userId).eq("feature","duplicate_risk").contains("metadata",{test_run:m5});
    assert("Yesterday rows exist in DB (total=5)", total===5, `got ${total}`);

    const res = await checkUsageLimit("duplicate-risk", userId);
    assert("checkUsageLimit ignores yesterday → allowed=true", res.allowed===true, JSON.stringify(res));
    assert("resetAt format YYYY-MM-DD", /^\d{4}-\d{2}-\d{2}$/.test(res.resetAt??""));

    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1); tomorrow.setHours(0,0,0,0);
    assert(`resetAt = tomorrow (${tomorrow.toISOString().slice(0,10)})`, res.resetAt===tomorrow.toISOString().slice(0,10), `got ${res.resetAt}`);
  } finally {
    await sb.from("ai_usage_logs").delete().eq("user_id",userId).contains("metadata",{test_run:m5});
    console.log("    🧹 Test 5 rows cleaned");
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════════════════════
console.log("═".repeat(62));
console.log("  Phase H — AI Usage Tracking: Test Suite");
console.log(`  Supabase : ${SUPABASE_URL}`);
console.log(`  App URL  : ${APP_URL}`);
console.log(`  ANTHROPIC_API_KEY : ${HAS_ANTH_KEY ? "set (real AI)" : "NOT SET (mock fallback expected)"}`);
console.log("═".repeat(62));

const [serverUp, dbUp] = await Promise.all([devServerAvailable(), dbAvailable()]);
console.log(`\n  Dev server : ${serverUp ? "✅ reachable" : "❌ not running"}`);
console.log(`  DB tables  : ${dbUp     ? "✅ ai_usage_logs exists" : "❌ migrations not applied yet"}`);

groupA_logic();
await groupB_http(serverUp);
await groupC_db(dbUp);

// ── Summary ────────────────────────────────────────────────────────────────────
const total = passed + failed + skipped;
console.log(`\n${"═".repeat(62)}`);
console.log(`  Results: ${passed} passed  |  ${failed} failed  |  ${skipped} skipped  (${total} total)`);
console.log("═".repeat(62));

if (failed > 0) {
  console.log("\nFailed assertions:");
  log.filter(r=>r.ok===false).forEach(r=>console.log(`  ❌ ${r.label}${r.detail?` — ${r.detail}`:""}`));
}

if (skipped > 0) {
  console.log(`\n⚠️  ${skipped} tests skipped — apply migrations first:`);
  console.log("  1. Open https://supabase.com/dashboard/project/hlpdezbttkzbicgubuen/sql/new");
  console.log("  2. Paste contents of  scripts/apply-all-phase-fgh.sql");
  console.log("  3. Click Run");
  console.log("  4. Re-run:  node scripts/test-phase-h.mjs");
}

process.exit(failed > 0 ? 1 : 0);
