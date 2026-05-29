// ── Per-Property-Type Zod v4 Schemas — Step 3 Validation ──────────────────────
// Zod v4 changes: { invalid_type_error } → { error }, no SafeParseReturnType.
// Each schema validates only the fields relevant to that property type.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";
import type { PropertyType } from "@/types/listing";
import type { ListingDraft } from "@/types/listing-draft";
import type { ValidationErrors } from "@/lib/helpers/add-listing";
import type { Locale } from "@/i18n/types";

// ── Bilingual error messages ──────────────────────────────────────────────────

const MSGS = {
  ar: {
    invalidArea:   "يرجى إدخال مساحة صحيحة",
    positiveArea:  "يجب أن تكون المساحة أكبر من صفر",
    invalidNum:    "يرجى إدخال رقم صحيح",
    nonNegative:   "يجب أن تكون القيمة صفراً أو أكثر",
    positiveVal:   "يجب أن تكون القيمة أكبر من صفر",
    invalidFloor:  "يرجى إدخال رقم الطابق",
    nonNegFloor:   "يجب أن يكون رقم الطابق صفراً أو أكثر",
    propAge:       "يرجى تحديد عمر العقار",
    landUse:       "يرجى تحديد الاستخدام المقرر للأرض",
    waterSource:   "يرجى تحديد مصدر المياه",
    propType:      "يرجى تحديد نوع العقار أولاً",
  },
  en: {
    invalidArea:   "Please enter a valid area",
    positiveArea:  "Area must be greater than zero",
    invalidNum:    "Please enter a valid number",
    nonNegative:   "Value must be zero or more",
    positiveVal:   "Value must be greater than zero",
    invalidFloor:  "Please enter a floor number",
    nonNegFloor:   "Floor number must be zero or more",
    propAge:       "Please select the property age",
    landUse:       "Please specify the intended land use",
    waterSource:   "Please specify the water source",
    propType:      "Please select a property type first",
  },
} as const;

// ── Schema factory ─────────────────────────────────────────────────────────────

/**
 * Build Step-3 validation schemas for the given locale.
 * All error messages are returned in the requested language.
 */
function buildSchemas(locale: Locale) {
  const m = MSGS[locale];

  const positiveArea = z
    .number({ error: m.invalidArea })
    .positive(m.positiveArea);

  const nonNegativeInt = z
    .number({ error: m.invalidNum })
    .int()
    .nonnegative(m.nonNegative);

  const positiveInt = z
    .number({ error: m.invalidNum })
    .int()
    .positive(m.positiveVal);

  const nonNegativeFloor = z
    .number({ error: m.invalidFloor })
    .int()
    .nonnegative(m.nonNegFloor);

  const requiredString = (msg: string) => z.string().min(1, msg);

  return {
    villa: z.object({
      bedrooms:    nonNegativeInt,
      bathrooms:   nonNegativeInt,
      area:        positiveArea,
      landArea:    positiveArea,
      propertyAge: requiredString(m.propAge),
    }),
    apartment: z.object({
      bedrooms:              nonNegativeInt,
      bathrooms:             nonNegativeInt,
      area:                  positiveArea,
      floorNumber:           nonNegativeFloor,
      totalFloorsInBuilding: positiveInt,
    }),
    land: z.object({
      landArea: positiveArea,
      landUse:  requiredString(m.landUse),
    }),
    farm: z.object({
      landArea:    positiveArea,
      waterSource: requiredString(m.waterSource),
    }),
    commercial: z.object({
      area:        positiveArea,
      floorNumber: nonNegativeFloor,
    }),
    office: z.object({
      area:        positiveArea,
      floorNumber: nonNegativeFloor,
    }),
    warehouse: z.object({
      area: positiveArea,
    }),
    building: z.object({
      area:       positiveArea,
      landArea:   positiveArea,
      floors:     positiveInt,
      totalUnits: positiveInt,
    }),
    chalet: z.object({
      bedrooms:  nonNegativeInt,
      bathrooms: nonNegativeInt,
      area:      positiveArea,
    }),
  };
}

// ── Validator entry point ─────────────────────────────────────────────────────

function draftForSchema(draft: ListingDraft): Record<string, unknown> {
  return {
    bedrooms:              draft.bedrooms,
    bathrooms:             draft.bathrooms,
    area:                  draft.area,
    landArea:              draft.landArea,
    propertyAge:           draft.propertyAge,
    floorNumber:           draft.floorNumber,
    totalFloorsInBuilding: draft.totalFloorsInBuilding,
    landUse:               draft.landUse,
    waterSource:           draft.waterSource,
    floors:                draft.floors,
    totalUnits:            draft.totalUnits,
  };
}

// ── Schema field → ValidationErrors key map ───────────────────────────────────

const FIELD_ERROR_KEY: Record<string, string> = {
  bedrooms:              "bedrooms",
  bathrooms:             "bathrooms",
  area:                  "area",
  landArea:              "landArea",
  propertyAge:           "propertyAge",
  floorNumber:           "floorNumber",
  totalFloorsInBuilding: "totalFloorsInBuilding",
  landUse:               "landUse",
  waterSource:           "waterSource",
  floors:                "floors",
  totalUnits:            "totalUnits",
};

function parseErrors(
  result: ReturnType<z.ZodObject<z.ZodRawShape>["safeParse"]>
): ValidationErrors {
  if (result.success) return {};
  const errors: ValidationErrors = {};
  for (const issue of result.error.issues) {
    const pathKey = String(issue.path[0] ?? "");
    const key = FIELD_ERROR_KEY[pathKey] ?? pathKey;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

// ── Map property type → schema ────────────────────────────────────────────────

function getSchemaForType(
  propertyType: PropertyType,
  schemas: ReturnType<typeof buildSchemas>
): z.ZodObject<z.ZodRawShape> {
  switch (propertyType) {
    case "villa":
    case "duplex":
    case "townhouse":
    case "arabic_house":
      return schemas.villa;
    case "apartment":
    case "hotel_apartment":
      return schemas.apartment;
    case "land":
      return schemas.land;
    case "farm":
      return schemas.farm;
    case "commercial":
      return schemas.commercial;
    case "office":
      return schemas.office;
    case "warehouse":
      return schemas.warehouse;
    case "building":
      return schemas.building;
    case "chalet":
      return schemas.chalet;
    default:
      return z.object({});
  }
}

/**
 * Locale-aware Step 3 (property details) validation factory.
 * Returns a `validate(draft)` function whose error messages are in the requested language.
 *
 * Usage:
 *   const { validate } = createListingSchema(locale);
 *   const errors = validate(draft);
 */
export function createListingSchema(locale: Locale) {
  const schemas = buildSchemas(locale);
  const m = MSGS[locale];

  return {
    validate(draft: ListingDraft): ValidationErrors {
      if (!draft.propertyType) {
        return { propertyType: m.propType };
      }
      const schema = getSchemaForType(draft.propertyType, schemas);
      const result = schema.safeParse(draftForSchema(draft));
      return parseErrors(result);
    },
  };
}

/**
 * Validates Step 3 (property details) for the given draft.
 * Returns a ValidationErrors map; empty object means all valid.
 *
 * @deprecated Use createListingSchema(locale).validate(draft) for locale-aware errors.
 */
export function validateDetailsStep(draft: ListingDraft): ValidationErrors {
  return createListingSchema("ar").validate(draft);
}
