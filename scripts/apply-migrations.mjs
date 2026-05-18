/**
 * Apply pending Supabase migrations directly via PostgreSQL connection.
 * Uses DATABASE_URL from .env.local (node-postgres / pg package).
 *
 * Run: node scripts/apply-migrations.mjs
 */

import { readFileSync } from "fs";
import { resolve }      from "path";
import pg               from "../node_modules/pg/lib/index.js";

const { Client } = pg;

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

const DATABASE_URL = env["DATABASE_URL"];
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

// ── Connect ────────────────────────────────────────────────────────────────────
const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ── Migration list ─────────────────────────────────────────────────────────────
// Apply all migrations in order; IF EXISTS guards make them idempotent.
const migrations = [
  "20260516000025_analytics_enum.sql",
  "20260516000026_listing_analytics.sql",
  "20260516000027_rls_phase_f.sql",
  "20260516000028_subscription_enums.sql",
  "20260516000029_subscriptions.sql",
  "20260516000030_rls_phase_g.sql",
  "20260516000031_ai_feature_enum.sql",
  "20260516000032_ai_usage_logs.sql",
  "20260516000033_rls_phase_h.sql",
];

async function run() {
  console.log("\n══════════════════════════════════════════════════════════");
  console.log("  Applying Supabase migrations (phases F → H)");
  console.log("══════════════════════════════════════════════════════════\n");

  await client.connect();
  console.log("✅ Connected to database\n");

  let applied = 0;
  let skipped = 0;
  let errored = 0;

  for (const file of migrations) {
    const sql = readFileSync(resolve(cwd, "supabase/migrations", file), "utf8");
    process.stdout.write(`  ${file} ... `);
    try {
      await client.query(sql);
      console.log("✅ applied");
      applied++;
    } catch (err) {
      // Idempotency: many errors here are benign (already exists, etc.)
      const msg = err.message ?? "";
      if (
        msg.includes("already exists") ||
        msg.includes("duplicate_object") ||
        msg.includes("DuplicateObject") ||
        msg.includes("relation") && msg.includes("already exists")
      ) {
        console.log("⏭  already applied (skipped)");
        skipped++;
      } else {
        console.log(`\n    ❌ ERROR: ${msg.split("\n")[0]}`);
        errored++;
      }
    }
  }

  await client.end();

  console.log(`\n──────────────────────────────────────────────────────────`);
  console.log(`  Applied: ${applied}  |  Skipped (idempotent): ${skipped}  |  Errors: ${errored}`);
  console.log(`──────────────────────────────────────────────────────────\n`);

  if (errored > 0) {
    console.error("Some migrations failed — check errors above.");
    process.exit(1);
  }
}

run().catch(err => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
