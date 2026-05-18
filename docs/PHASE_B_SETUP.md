# Phase B — Listings Setup Guide

**Run AFTER Phase A is complete and all Phase A migrations have been applied.**

---

## Overview

Phase B adds the core listings functionality:

| Migration | File | Purpose |
|-----------|------|---------|
| 006 | `20260516000006_listing_enums.sql` | All listing-related enums |
| 007 | `20260516000007_listings.sql` | Listings table + triggers + indexes |
| 008 | `20260516000008_listing_images.sql` | Listing images table + cover sync trigger |
| 009 | `20260516000009_listing_documents.sql` | Private ownership documents table |
| 010 | `20260516000010_rls_phase_b.sql` | RLS policies for all listing tables + storage |

---

## Step 1 — Run Migrations (in order)

In Supabase Dashboard → **SQL Editor**, run each file in sequence:

```sql
-- 1. Listing enums (must exist before tables that reference them)
-- Paste contents of: supabase/migrations/20260516000006_listing_enums.sql

-- 2. Listings table
-- Paste contents of: supabase/migrations/20260516000007_listings.sql

-- 3. Listing images table
-- Paste contents of: supabase/migrations/20260516000008_listing_images.sql

-- 4. Listing documents table
-- Paste contents of: supabase/migrations/20260516000009_listing_documents.sql

-- 5. RLS policies
-- Paste contents of: supabase/migrations/20260516000010_rls_phase_b.sql
```

> **Tip:** If using Supabase CLI: `supabase db push` will apply all pending migrations automatically.

---

## Step 2 — Create Storage Buckets

> Storage buckets **cannot** be created via SQL. Use the Dashboard.

Go to **Storage** → **New bucket** and create:

### `listing-images` (Public)
- **Name:** `listing-images`
- **Public:** ✅ Yes
- **File size limit:** 8 MB
- **Allowed MIME types:** `image/jpeg, image/png, image/webp`

### `documents` (Private)
- **Name:** `documents`
- **Public:** ❌ No
- **File size limit:** 20 MB
- **Allowed MIME types:** `application/pdf, image/jpeg, image/png`

### `avatars` (Public)
- **Name:** `avatars`
- **Public:** ✅ Yes
- **File size limit:** 2 MB
- **Allowed MIME types:** `image/jpeg, image/png, image/webp`

> The RLS policies for all three buckets are applied automatically in migration 010.
> These policies restrict writes to authenticated owners and their listing folders.

---

## Step 3 — Verify Policies

After running migration 010, confirm policy count:

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
  AND tablename IN ('listings', 'listing_images', 'listing_documents', 'objects')
ORDER BY tablename, policyname;
-- Expected: 5 listings + 5 listing_images + 3 listing_documents + 7 storage = 20 policies
```

---

## Step 4 — Verify Triggers

```sql
-- Check listing triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('listings', 'listing_images');

-- Expected:
--   listing_images_cover_sync  → listing_images  (syncs cover_image_url)
--   listings_status_change     → listings        (sets published_at on activation)
--   listings_updated_at        → listings        (auto-updates updated_at)
```

---

## Step 5 — Test Scenarios

### 5a. Public browse (anon key)
```sql
-- Only active + approved listings should be visible
SELECT id, title_ar, status, review_status
FROM public.listings
WHERE status = 'active' AND review_status = 'approved'
LIMIT 5;
```

### 5b. Owner insert (authenticated user)
Insert a test listing via the app's add-listing flow. Verify:
- `status = 'pending_review'`
- `review_status = 'pending'`
- `is_verified = false`, `is_featured = false`

### 5c. Admin bypass (service role)
Admin routes use `SUPABASE_SERVICE_ROLE_KEY` — bypasses RLS entirely.
Test by calling the admin API directly with service role credentials.

### 5d. Image upload
- Add listing through the wizard
- Attach at least one photo in Step 7 (Photos)
- Submit → verify `listing_images` table has a row
- Verify `listings.cover_image_url` was auto-set by the DB trigger

### 5e. Document upload (private)
- Upload an ownership document in Step 8 (Documents)
- Verify it appears in `listing_documents` table
- Verify the file is in the `documents` storage bucket under `listings/{listing_id}/`
- Verify anon cannot read the file directly (private bucket)

---

## Architecture Notes

### Status Flow
```
Owner submits     → status='pending_review', review_status='pending'
Admin approves    → status='active',         review_status='approved'   (service role)
Admin rejects     → status='rejected',       review_status='rejected'   (service role)
Admin requests    → status='needs_changes',  review_status='needs_changes'
Owner resubmits   → status='pending_review', review_status='pending'
Listing expires   → status='expired'                                     (scheduled job, Phase J)
```

### Image Upload Flow (in-browser)
```
1. createListingClient(draft, userId)   → INSERT listing → get UUID
2. uploadListingImages(listingId, imgs) → Storage upload → INSERT listing_images rows
3. DB trigger sync_listing_cover_image  → auto-sets listings.cover_image_url
```

### Admin Access
Admin routes use the **service role key** (`SUPABASE_SERVICE_ROLE_KEY`) via
`createServiceClient()` from `src/lib/supabase/service.ts`.
The service role bypasses RLS entirely — no separate admin policies needed.

### Mock Fallback (Dev Mode)
When `NEXT_PUBLIC_SUPABASE_URL` is a placeholder (not a real `.supabase.co` URL):
- `searchListingsClient()` returns `[]` → UI falls back to `MOCK_LISTINGS`
- `createListingClient()` returns a fake `dev-{timestamp}` ID → submit flow completes
- `uploadListingImages()` is a no-op → returns `{ success: true }`
- `getListingByIdServer()` returns `null` → page falls back to `getListingById()` (mock)

---

## Files Created in Phase B

### SQL Migrations
- `supabase/migrations/20260516000006_listing_enums.sql`
- `supabase/migrations/20260516000007_listings.sql`
- `supabase/migrations/20260516000008_listing_images.sql`
- `supabase/migrations/20260516000009_listing_documents.sql`
- `supabase/migrations/20260516000010_rls_phase_b.sql`

### Service Layer
- `src/lib/supabase/listings.ts` — search, create, fetch listing functions
- `src/lib/supabase/listing-images.ts` — Storage upload + DB insert for images

### Wired Components
- `src/store/add-listing.store.ts` — `submitListing()` → real Supabase INSERT
- `src/components/search/SearchPageClient.tsx` — Supabase search + mock fallback
- `src/app/listing/[id]/page.tsx` — DB-first listing detail + mock fallback
- `src/app/agent/listings/page.tsx` — agent's own listings from DB + mock fallback

---

## Next: Phase C — Favorites & Recently Viewed

Phase C will add:
- `favorites` table + RLS
- `recently_viewed` table + RLS
- Wire favorites toggle to Supabase
- Wire recently-viewed tracking to Supabase
