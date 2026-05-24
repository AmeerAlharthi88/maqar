// ── Location Validator — Development / Test Use Only ─────────────────────────
// Validates that governorateId / wilayatId / areaId are consistent with the
// central source of truth (oman-locations.ts).
//
// Usage:
//   import { validateListingLocation } from "@/lib/helpers/location-validator";
//   const result = validateListingLocation(listing);
//   if (!result.valid) console.warn(result.errors);
//
// This helper is intentionally NOT wired into the production data path.
// Use it in tests or dev-time scripts to catch mis-wired mock data.
// ─────────────────────────────────────────────────────────────────────────────

import { GOVERNORATE_MAP } from "@/lib/constants/oman-locations";

export interface LocationValidationResult {
  valid: boolean;
  errors: string[];
}

interface MinimalListingLocation {
  governorateId: string;
  wilayatId: string;
  areaId?: string;
}

export function validateListingLocation(
  location: MinimalListingLocation
): LocationValidationResult {
  const errors: string[] = [];

  const governorate = GOVERNORATE_MAP[location.governorateId];
  if (!governorate) {
    errors.push(
      `governorateId "${location.governorateId}" not found in OMAN_GOVERNORATES`
    );
    return { valid: false, errors };
  }

  const wilayat = governorate.wilayats.find((w) => w.id === location.wilayatId);
  if (!wilayat) {
    errors.push(
      `wilayatId "${location.wilayatId}" not found under governorate "${location.governorateId}"`
    );
    return { valid: false, errors };
  }

  if (location.areaId) {
    const area = wilayat.areas.find((a) => a.id === location.areaId);
    if (!area) {
      errors.push(
        `areaId "${location.areaId}" not found under wilayat "${location.wilayatId}" in governorate "${location.governorateId}"`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

// ── Batch validation helper ───────────────────────────────────────────────────
// Useful for validating all mock listings at once (e.g. in a test file).

export interface BatchValidationReport {
  totalChecked: number;
  totalValid: number;
  totalInvalid: number;
  failures: Array<{ id: string; errors: string[] }>;
}

export function validateAllListings(
  listings: Array<{ id: string; location: MinimalListingLocation }>
): BatchValidationReport {
  const failures: Array<{ id: string; errors: string[] }> = [];

  for (const listing of listings) {
    const result = validateListingLocation(listing.location);
    if (!result.valid) {
      failures.push({ id: listing.id, errors: result.errors });
    }
  }

  return {
    totalChecked: listings.length,
    totalValid: listings.length - failures.length,
    totalInvalid: failures.length,
    failures,
  };
}
