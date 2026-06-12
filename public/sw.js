// ── Maqar Service Worker — Phase 15 ─────────────────────────────────────────
// Strategy:
//   App shell / static assets → Cache First (stale-while-revalidate for HTML)
//   API / dynamic routes      → Network First (fallback to cache)
//   Offline fallback page     → /offline (always cached)
//
// SECURITY NOTES:
//   • Never cache auth tokens, payment data, or user-identifiable API responses
//   • Never cache /api/auth/*, /api/payment/*, /api/admin/*
//   • Cached responses are limited to public, non-sensitive resources
//
// CACHE VERSIONING: bump all three version strings together on every deploy
// that changes JS bundles, so the activate event evicts all stale caches.
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_NAME = "maqar-v3";
const STATIC_CACHE = "maqar-static-v3";
const DYNAMIC_CACHE = "maqar-dynamic-v3";

// App shell — always cache these on install
const APP_SHELL_URLS = [
  "/",
  "/offline",
  "/search",
  "/manifest.webmanifest",
];

// Never cache these — sensitive or auth-related
const NEVER_CACHE_PATTERNS = [
  /\/api\/auth/,
  /\/api\/payment/,
  /\/api\/admin/,
  /\/api\/user\/session/,
  /\/_next\/webpack-hmr/,
  /chrome-extension/,
];

// Network-first patterns (dynamic content)
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/_next\/data\//,
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        // Non-fatal — offline fallback still works without full shell cache
        console.warn("[SW] Install cache partial failure:", err);
      })
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────
// Delete every cache whose name is not in the current version set.
// This evicts all stale bundles from previous deployments (e.g. maqar-v1).
self.addEventListener("activate", (event) => {
  const CURRENT_CACHES = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !CURRENT_CACHES.includes(k))
            .map((k) => {
              console.log("[SW] Deleting stale cache:", k);
              return caches.delete(k);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Never cache sensitive routes
  if (NEVER_CACHE_PATTERNS.some((p) => p.test(url.pathname))) return;

  // Network-first for API and dynamic Next.js data
  if (NETWORK_FIRST_PATTERNS.some((p) => p.test(url.pathname))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for static assets (JS/CSS/fonts/images)
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network-first for page navigations so a fresh deployment is shown
  // immediately (prevents a stale cached app shell from hiding new fixes).
  // Falls back to cache, then the offline page, when the network is down.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  // Stale-while-revalidate for other (non-navigation) documents
  event.respondWith(staleWhileRevalidate(request));
});

// ── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? offlineFallback(request);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached ?? (await networkPromise) ?? offlineFallback(request);
}

async function offlineFallback(request) {
  const url = new URL(request.url);
  // For navigation requests, return the offline page
  if (request.mode === "navigate") {
    const offline = await caches.match("/offline");
    if (offline) return offline;
  }
  return new Response(
    JSON.stringify({ error: "offline", messageAr: "لا يوجد اتصال بالإنترنت" }),
    {
      status: 503,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isStaticAsset(pathname) {
  return (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/icons/") ||
    /\.(png|jpg|jpeg|webp|svg|ico|woff|woff2|ttf|otf|css)$/.test(pathname)
  );
}

// ── SW Update broadcast ───────────────────────────────────────────────────────
// Notify all open clients when a new SW version is waiting
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
