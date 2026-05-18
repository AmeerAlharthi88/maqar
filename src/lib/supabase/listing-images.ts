// ── Listing Images Upload Service ─────────────────────────────────────────────
// Handles uploading photos to Supabase Storage (listing-images bucket)
// and inserting metadata rows into the listing_images table.
//
// Storage path convention: listing-images/{listing_id}/{uuid}.{ext}
// The sync_listing_cover_image() DB trigger auto-updates
// listings.cover_image_url when the first is_main=true image is inserted.
//
// Mock mode: when NEXT_PUBLIC_SUPABASE_URL is a placeholder,
// all functions return success immediately (no-op).
// ─────────────────────────────────────────────────────────────────────────────

import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { UploadedFile } from "@/types/listing-draft";

// ── Environment guard ──────────────────────────────────────────────────────────
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && url.includes(".supabase.co");
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function getExtFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  return map[mimeType] ?? "jpg";
}

// ── Upload result ──────────────────────────────────────────────────────────────
export interface UploadImagesResult {
  success: boolean;
  uploadedCount: number;
  failedCount: number;
  error: string | null;
}

/**
 * Upload listing images to Supabase Storage and insert metadata rows.
 *
 * Call AFTER the listing row has been created (so listing_id is known).
 * Images must still have their `previewUrl` blob URLs (same browser session).
 *
 * In dev mode (Supabase not configured) this is a no-op — returns success
 * so the submit flow completes without real credentials.
 */
export async function uploadListingImages(
  listingId: string,
  images: UploadedFile[]
): Promise<UploadImagesResult> {
  if (!isSupabaseConfigured()) {
    return { success: true, uploadedCount: images.length, failedCount: 0, error: null };
  }

  if (images.length === 0) {
    return { success: true, uploadedCount: 0, failedCount: 0, error: null };
  }

  let uploadedCount = 0;
  let failedCount = 0;

  try {
    const supabase = createBrowserClient();

    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      // Images without a blob URL can't be uploaded (happens after page reload
      // when localStorage only has the metadata, not the raw file data).
      if (!img.previewUrl || !img.previewUrl.startsWith("blob:")) {
        failedCount++;
        continue;
      }

      let blob: Blob;
      try {
        const response = await fetch(img.previewUrl);
        if (!response.ok) {
          failedCount++;
          continue;
        }
        blob = await response.blob();
      } catch {
        console.warn(`[ListingImages] Could not fetch blob for ${img.name}`);
        failedCount++;
        continue;
      }

      // Build storage path: {listing_id}/{uuid}.{ext}
      const ext = getExtFromMime(img.mimeType);
      const uuid = crypto.randomUUID();
      const storagePath = `${listingId}/${uuid}.${ext}`;

      // Upload to the listing-images bucket
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(storagePath, blob, {
          contentType: img.mimeType,
          upsert: false,
        });

      if (uploadError) {
        console.error(
          `[ListingImages] Storage upload error for "${img.name}":`,
          uploadError.message
        );
        failedCount++;
        continue;
      }

      // Get the CDN public URL
      const { data: urlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(storagePath);

      const publicUrl = urlData.publicUrl;

      // Insert metadata row — the DB trigger handles cover_image_url sync
      const { error: insertError } = await supabase
        .from("listing_images")
        .insert({
          listing_id:   listingId,
          storage_path: storagePath,
          url:          publicUrl,
          is_main:      img.isMain,
          sort_order:   i,
          size_bytes:   img.size ?? null,
          mime_type:    img.mimeType ?? null,
        });

      if (insertError) {
        console.error(
          `[ListingImages] DB insert error for "${img.name}":`,
          insertError.message
        );
        // Storage upload succeeded but metadata failed — non-fatal, continue
        failedCount++;
        continue;
      }

      uploadedCount++;
    }

    return {
      success: failedCount === 0,
      uploadedCount,
      failedCount,
      error:
        failedCount > 0
          ? `فشل رفع ${failedCount} صورة(ات). تم رفع ${uploadedCount} بنجاح.`
          : null,
    };
  } catch (err) {
    console.error("[ListingImages] uploadListingImages exception:", err);
    return {
      success: false,
      uploadedCount,
      failedCount: images.length - uploadedCount,
      error: "فشل رفع الصور — حاول مرة أخرى",
    };
  }
}

/**
 * Delete a single image from Storage and remove its metadata row.
 * Used from the owner's listing edit flow (Phase C).
 */
export async function deleteListingImage(
  imageId: string,
  storagePath: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: true, error: null };
  }

  try {
    const supabase = createBrowserClient();

    // Remove from Storage
    const { error: storageError } = await supabase.storage
      .from("listing-images")
      .remove([storagePath]);

    if (storageError) {
      console.error("[ListingImages] Storage delete error:", storageError.message);
      // Continue to remove DB row even if Storage delete fails
    }

    // Remove DB row
    const { error: dbError } = await supabase
      .from("listing_images")
      .delete()
      .eq("id", imageId);

    if (dbError) {
      console.error("[ListingImages] DB delete error:", dbError.message);
      return { success: false, error: dbError.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("[ListingImages] deleteListingImage exception:", err);
    return { success: false, error: "فشل حذف الصورة" };
  }
}
