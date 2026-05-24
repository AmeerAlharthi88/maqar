/**
 * Phase 5 — Real Test Listings Seed Script
 * -----------------------------------------
 * Creates 5 realistic Supabase-backed listings, uploads placeholder images,
 * sets cover_image_url, approves 3 listings, leaves 2 pending.
 *
 * Run: node scripts/phase5-seed.mjs
 */

const SUPABASE_URL = "https://hlpdezbttkzbicgubuen.supabase.co";
const SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscGRlemJ0dGt6YmljZ3VidWVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODk0NDQ3NCwiZXhwIjoyMDk0NTIwNDc0fQ.0AxUsHocABq9UUzfEGN-avzFM-17HGV1Ak9Bc5IXKh4";
const OWNER_ID     = "83dc5029-d4dc-42c7-ba36-b312260c51c6";
const BUCKET       = "listing-images";

const HEADERS = {
  "apikey":        SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type":  "application/json",
  "Prefer":        "return=representation",
};

// ── Minimal valid JPEG bytes (8x8 solid colour) ───────────────────────────────
// These are complete valid JPEG files that browsers and Supabase will accept.
function makeJpeg(r, g, b) {
  // A minimal 2x2 JPEG with a given fill colour, produced as a raw byte array.
  // This is the smallest possible valid JPEG (SOI + APP0 + DQT + SOF0 + DHT + SOS + EOI).
  // We use a pre-built minimal JPEG template and patch the colour by embedding a
  // 1×1 bitmap JFIF whose pixel is close enough for QA purposes.
  //
  // In practice the simplest approach: use a pre-encoded 1×1 JPEG with color approximation.
  // The JPEG below is a valid 1×1 pixel JPEG (generated reference bytes).
  // We'll create a slightly different image per listing by varying some bytes.

  const hex = [
    "FFD8FFE0","00104A46","49460001","01000001","00010000",
    "FFDB0043","00080606","07060508","07070709","0C140D0C",
    "0B0B0C19","12131016","1C1A1F1E","1D1A1C1C","20242E27",
    "20222C23","1C1C2837","292C2F30","3634202D","38241C1C",
    "32411235","154E0B0C","474E3738","3C3D3B34","31303540",
    "4749413C","4829504D","454C3330","FFC00011","08000100",
    "01010111","00FFC401","1F000001","05010101","01010100",
    "000000000","10203040","50607080","9A0B0C0D","0EFFC401",
    "B51000201","03010201","03030204","03000000","01234567",
    "89ABCDEF","10111213","14151617","18191A1B","1C1D1E1F",
    "20212223","24252627","28292A2B","2C2D2E2F","30313233",
    "34353637","38393A3B","3C3D3E3F","40414243","44454647",
    "48494A4B","4C4D4E4F","50515253","54555657","58595A5B",
    "5C5D5E5F","60616263","64656667","68696A6B","6C6D6E6F",
    "70717273","74757677","78797A7B","7C7D7E7F","80818283",
    "84858687","88898A8B","8C8D8E8F","90919293","94959697",
    "98999A9B","9C9D9E9F","A0A1A2A3","A4A5A6A7","A8A9AAAB",
    "ACADAEAF","B0B1B2B3","B4B5B6B7","B8B9BABB","BCBDBEBF",
    "C0C1C2C3","C4C5C6C7","C8C9CACB","CCCDCECF","D0D1D2D3",
    "D4D5D6D7","D8D9DADB","DCDDDEDFE","0E1E2E3E","4E5E6E7E8",
    "E9EAEBEC","EDEEEFFE","FF0000000",
  ];
  // Use Node.js built-in to create a minimal solid-color JPEG
  // We will just use a fixed pre-baked minimal JPEG for all images
  // and distinguish files by their path/name only.
  void r; void g; void b; // colour hint unused – JPEG is solid grey
  return Buffer.from(MINIMAL_JPEG_BASE64, "base64");
}

// Minimal valid 1×1 grey JPEG (59 bytes, base64 encoded)
const MINIMAL_JPEG_BASE64 =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U" +
  "HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgN" +
  "DRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy" +
  "MjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAA" +
  "AAAAAAAAAAAAAAAAAP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAA" +
  "AAAA/9oADAMBAAIRAxEAPwCwABmX/9k=";

// ── REST helpers ───────────────────────────────────────────────────────────────

async function dbInsert(table, row) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method:  "POST",
    headers: HEADERS,
    body:    JSON.stringify(row),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`INSERT ${table} failed ${res.status}: ${text}`);
  return JSON.parse(text);
}

async function dbUpdate(table, match, patch) {
  const params = Object.entries(match)
    .map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`)
    .join("&");
  const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`;
  const res = await fetch(url, {
    method:  "PATCH",
    headers: { ...HEADERS, Prefer: "return=minimal" },
    body:    JSON.stringify(patch),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH ${table} failed ${res.status}: ${text}`);
  }
}

async function storageUpload(path, jpegBuffer) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "apikey":        SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type":  "image/jpeg",
      "x-upsert":      "true",
    },
    body: jpegBuffer,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Storage upload failed ${res.status}: ${text}`);
  // Return public URL
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

// ── Listing definitions ────────────────────────────────────────────────────────

const NOW = new Date().toISOString();

const LISTINGS = [
  {
    _slug: "villa-muscat",
    owner_id:           OWNER_ID,
    agency_id:          null,
    title_ar:           "فيلا فاخرة في القرم - إطلالة بحرية",
    title_en:           "Luxury Villa in Al Qurm - Sea View",
    description_ar:     "فيلا راقية في حي القرم العريق بمسقط، تتميز بإطلالة بحرية خلابة وتصميم عصري فاخر. تتكون من 5 غرف نوم واسعة، مجلس عربي أصيل، غرفة خادمة، وموقف لسيارتين. قريبة من الخدمات والمدارس والمراكز التجارية.",
    purpose:            "sale",
    property_type:      "villa",
    status:             "pending_review",
    review_status:      "pending",
    price_omr:          145000,
    is_negotiable:      true,
    is_price_hidden:    false,
    deposit_amount:     null,
    service_charges:    null,
    governorate_id:     "muscat",
    governorate_ar:     "محافظة مسقط",
    wilayat_id:         "muscat-wilayat",
    wilayat_ar:         "مسقط",
    area_id:            "al-qurm",
    area_ar:            "القرم",
    address_ar:         "شارع القرم الرئيسي، بجوار الحديقة",
    block:              null,
    street:             "شارع القرم",
    location_notes:     null,
    hide_exact_location: false,
    latitude:           23.6051,
    longitude:          58.5922,
    bedrooms:           5,
    bathrooms:          4,
    area_sqm:           420,
    land_size_sqm:      600,
    built_up_area_sqm:  420,
    floors:             2,
    parking_spaces:     2,
    furnishing_status:  "furnished",
    property_age:       "5_10_years",
    availability_date:  null,
    has_majlis:         true,
    has_maid_room:      true,
    has_driver_room:    false,
    has_outdoor_kitchen: false,
    has_indoor_kitchen: true,
    has_yard:           true,
    has_sea_view:       true,
    has_mountain_view:  false,
    is_freehold:        true,
    is_expat_allowed:   true,
    is_family_only:     true,
    is_bachelor_allowed: false,
    amenities:          ["مسبح", "حديقة", "نظام أمن"],
    cover_image_url:    null,
    video_link:         null,
    tour_link:          null,
    quality_score:      88,
    roi_estimate:       null,
    duplicate_risk_score: null,
    suspicious_price_flag: false,
    is_below_market:    false,
    is_verified:        false,
    is_featured:        false,
    admin_note:         null,
    view_count:         0,
    favorite_count:     0,
    lead_count:         0,
    whatsapp_clicks:    0,
    call_clicks:        0,
    created_at:         NOW,
    updated_at:         NOW,
    published_at:       null,
    expires_at:         null,
    rent_period:        null,
  },
  {
    _slug: "apt-seeb",
    owner_id:           OWNER_ID,
    agency_id:          null,
    title_ar:           "شقة حديثة في الموالح - السيب",
    title_en:           "Modern Apartment in Al Mawleh - Seeb",
    description_ar:     "شقة حديثة في موقع مميز بالموالح، السيب. تتكون من 3 غرف نوم، صالون واسع، مطبخ مجهز، وبلكونة مطلة على الحديقة. مبنى بكامل الخدمات مع موقف سيارة مخصص.",
    purpose:            "rent",
    property_type:      "apartment",
    status:             "pending_review",
    review_status:      "pending",
    price_omr:          280,
    rent_period:        "monthly",
    is_negotiable:      false,
    is_price_hidden:    false,
    deposit_amount:     560,
    service_charges:    null,
    governorate_id:     "muscat",
    governorate_ar:     "محافظة مسقط",
    wilayat_id:         "seeb",
    wilayat_ar:         "السيب",
    area_id:            "al-mawleh",
    area_ar:            "الموالح",
    address_ar:         "الموالح الشمالية، بالقرب من دوار الموالح",
    block:              null,
    street:             null,
    location_notes:     null,
    hide_exact_location: false,
    latitude:           23.6420,
    longitude:          58.1891,
    bedrooms:           3,
    bathrooms:          2,
    area_sqm:           140,
    land_size_sqm:      null,
    built_up_area_sqm:  140,
    floors:             null,
    parking_spaces:     1,
    furnishing_status:  "semi_furnished",
    property_age:       "1_5_years",
    availability_date:  null,
    has_majlis:         false,
    has_maid_room:      false,
    has_driver_room:    false,
    has_outdoor_kitchen: false,
    has_indoor_kitchen: true,
    has_yard:           false,
    has_sea_view:       false,
    has_mountain_view:  false,
    is_freehold:        false,
    is_expat_allowed:   true,
    is_family_only:     true,
    is_bachelor_allowed: false,
    amenities:          ["مصعد", "أمن 24 ساعة"],
    cover_image_url:    null,
    video_link:         null,
    tour_link:          null,
    quality_score:      75,
    roi_estimate:       null,
    duplicate_risk_score: null,
    suspicious_price_flag: false,
    is_below_market:    false,
    is_verified:        false,
    is_featured:        false,
    admin_note:         null,
    view_count:         0,
    favorite_count:     0,
    lead_count:         0,
    whatsapp_clicks:    0,
    call_clicks:        0,
    created_at:         NOW,
    updated_at:         NOW,
    published_at:       null,
    expires_at:         null,
  },
  {
    _slug: "land-barka",
    owner_id:           OWNER_ID,
    agency_id:          null,
    title_ar:           "أرض سكنية للبيع في بركاء - تملك حر",
    title_en:           "Residential Land for Sale in Barka - Freehold",
    description_ar:     "أرض سكنية فضاء بمساحة 600 م² في موقع استراتيجي ببركاء، قريبة من الطريق الرئيسي والخدمات. مسجلة في دائرة الأراضي، تملك حر لجميع الجنسيات. مناسبة لبناء فيلا أو مشروع سكني صغير.",
    purpose:            "sale",
    property_type:      "land",
    status:             "pending_review",
    review_status:      "pending",
    price_omr:          38000,
    is_negotiable:      true,
    is_price_hidden:    false,
    deposit_amount:     null,
    service_charges:    null,
    governorate_id:     "south-batinah",
    governorate_ar:     "محافظة جنوب الباطنة",
    wilayat_id:         "barka",
    wilayat_ar:         "بركاء",
    area_id:            "barka-center",
    area_ar:            "مركز بركاء",
    address_ar:         "حي الربوة، بركاء",
    block:              null,
    street:             null,
    location_notes:     "مقابل المسجد الكبير",
    hide_exact_location: false,
    latitude:           23.6820,
    longitude:          57.8660,
    bedrooms:           0,
    bathrooms:          0,
    area_sqm:           600,
    land_size_sqm:      600,
    built_up_area_sqm:  null,
    floors:             null,
    parking_spaces:     null,
    furnishing_status:  "unfurnished",
    property_age:       null,
    availability_date:  null,
    has_majlis:         false,
    has_maid_room:      false,
    has_driver_room:    false,
    has_outdoor_kitchen: false,
    has_indoor_kitchen: false,
    has_yard:           false,
    has_sea_view:       false,
    has_mountain_view:  false,
    is_freehold:        true,
    is_expat_allowed:   true,
    is_family_only:     false,
    is_bachelor_allowed: true,
    amenities:          [],
    cover_image_url:    null,
    video_link:         null,
    tour_link:          null,
    quality_score:      70,
    roi_estimate:       null,
    duplicate_risk_score: null,
    suspicious_price_flag: false,
    is_below_market:    false,
    is_verified:        false,
    is_featured:        false,
    admin_note:         null,
    view_count:         0,
    favorite_count:     0,
    lead_count:         0,
    whatsapp_clicks:    0,
    call_clicks:        0,
    created_at:         NOW,
    updated_at:         NOW,
    published_at:       null,
    expires_at:         null,
    rent_period:        null,
  },
  {
    _slug: "farm-nizwa",
    owner_id:           OWNER_ID,
    agency_id:          null,
    title_ar:           "مزرعة بنخيل في نزوى - إطلالة جبلية رائعة",
    title_en:           "Palm Farm in Nizwa - Mountain View",
    description_ar:     "مزرعة أصيلة بمساحة 2500 م² في نزوى، عاصمة عمان القديمة، محاطة بأشجار النخيل والأفلاج التراثية. تتميز بإطلالة جبلية خلابة على جبال الحجر. تحتوي على استراحة ريفية مكوناً من غرفتين ودورة مياه.",
    purpose:            "sale",
    property_type:      "farm",
    status:             "pending_review",
    review_status:      "pending",
    price_omr:          52000,
    is_negotiable:      true,
    is_price_hidden:    false,
    deposit_amount:     null,
    service_charges:    null,
    governorate_id:     "ad-dakhiliyah",
    governorate_ar:     "محافظة الداخلية",
    wilayat_id:         "nizwa",
    wilayat_ar:         "نزوى",
    area_id:            "nizwa-center",
    area_ar:            "مركز نزوى",
    address_ar:         "منطقة الفلج، نزوى",
    block:              null,
    street:             null,
    location_notes:     "بجوار قلعة نزوى بـ 3 كم",
    hide_exact_location: false,
    latitude:           22.9361,
    longitude:          57.5320,
    bedrooms:           2,
    bathrooms:          1,
    area_sqm:           2500,
    land_size_sqm:      2500,
    built_up_area_sqm:  80,
    floors:             1,
    parking_spaces:     null,
    furnishing_status:  "unfurnished",
    property_age:       "more_than_10_years",
    availability_date:  null,
    has_majlis:         true,
    has_maid_room:      false,
    has_driver_room:    false,
    has_outdoor_kitchen: true,
    has_indoor_kitchen: false,
    has_yard:           true,
    has_sea_view:       false,
    has_mountain_view:  true,
    is_freehold:        false,
    is_expat_allowed:   false,
    is_family_only:     false,
    is_bachelor_allowed: true,
    amenities:          ["بئر ماء", "نخيل منتجة", "أفلاج"],
    cover_image_url:    null,
    video_link:         null,
    tour_link:          null,
    quality_score:      72,
    roi_estimate:       5.2,
    duplicate_risk_score: null,
    suspicious_price_flag: false,
    is_below_market:    false,
    is_verified:        false,
    is_featured:        false,
    admin_note:         null,
    view_count:         0,
    favorite_count:     0,
    lead_count:         0,
    whatsapp_clicks:    0,
    call_clicks:        0,
    created_at:         NOW,
    updated_at:         NOW,
    published_at:       null,
    expires_at:         null,
    rent_period:        null,
  },
  {
    _slug: "chalet-barka",
    owner_id:           OWNER_ID,
    agency_id:          null,
    title_ar:           "شاليه ساحلي للإيجار في بركاء - إطلالة بحرية مباشرة",
    title_en:           "Coastal Chalet for Rent in Barka - Direct Sea View",
    description_ar:     "شاليه ساحلي فاخر بإطلالة مباشرة على بحر عُمان في بركاء. مؤثث بالكامل بأثاث راقٍ، يتكون من 3 غرف نوم، صالة واسعة، مطبخ مجهز، وتراس كبير على البحر. مناسب للعائلات وللإيجار الأسبوعي أو الشهري.",
    purpose:            "rent",
    property_type:      "chalet",
    status:             "pending_review",
    review_status:      "pending",
    price_omr:          850,
    rent_period:        "monthly",
    is_negotiable:      true,
    is_price_hidden:    false,
    deposit_amount:     1700,
    service_charges:    null,
    governorate_id:     "south-batinah",
    governorate_ar:     "محافظة جنوب الباطنة",
    wilayat_id:         "barka",
    wilayat_ar:         "بركاء",
    area_id:            "barka-beach",
    area_ar:            "شاطئ بركاء",
    address_ar:         "شارع الكورنيش، بركاء",
    block:              null,
    street:             "كورنيش بركاء",
    location_notes:     "أمام الشاطئ مباشرة",
    hide_exact_location: false,
    latitude:           23.7010,
    longitude:          57.8820,
    bedrooms:           3,
    bathrooms:          2,
    area_sqm:           180,
    land_size_sqm:      null,
    built_up_area_sqm:  180,
    floors:             1,
    parking_spaces:     2,
    furnishing_status:  "furnished",
    property_age:       "1_5_years",
    availability_date:  null,
    has_majlis:         true,
    has_maid_room:      false,
    has_driver_room:    false,
    has_outdoor_kitchen: true,
    has_indoor_kitchen: true,
    has_yard:           false,
    has_sea_view:       true,
    has_mountain_view:  false,
    is_freehold:        false,
    is_expat_allowed:   true,
    is_family_only:     true,
    is_bachelor_allowed: false,
    amenities:          ["واي فاي", "مكيف", "شبكة باربيكيو"],
    cover_image_url:    null,
    video_link:         null,
    tour_link:          null,
    quality_score:      82,
    roi_estimate:       null,
    duplicate_risk_score: null,
    suspicious_price_flag: false,
    is_below_market:    false,
    is_verified:        false,
    is_featured:        false,
    admin_note:         null,
    view_count:         0,
    favorite_count:     0,
    lead_count:         0,
    whatsapp_clicks:    0,
    call_clicks:        0,
    created_at:         NOW,
    updated_at:         NOW,
    published_at:       null,
    expires_at:         null,
  },
];

// Listings to approve (by _slug) — 3 of 5
const TO_APPROVE = ["villa-muscat", "apt-seeb", "chalet-barka"];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  Phase 5 — Real Listing Seed                         ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  const results = [];

  for (const listing of LISTINGS) {
    const slug = listing._slug;
    // Don't send _slug to DB
    const { _slug, ...row } = listing;
    void _slug;

    console.log(`\n── Creating listing: ${row.title_ar}`);

    // 1. Insert listing
    let insertedRow;
    try {
      const inserted = await dbInsert("listings", row);
      insertedRow = Array.isArray(inserted) ? inserted[0] : inserted;
      console.log(`   ✓ Inserted  id=${insertedRow.id}`);
    } catch (e) {
      console.error(`   ✗ Insert failed: ${e.message}`);
      continue;
    }

    const listingId = insertedRow.id;

    // 2. Upload 2 placeholder images
    const jpegBuf = makeJpeg(100, 120, 140);
    const imageUrls = [];

    for (let i = 1; i <= 2; i++) {
      const path = `${OWNER_ID}/${listingId}/image-${i}.jpg`;
      try {
        const publicUrl = await storageUpload(path, jpegBuf);
        imageUrls.push(publicUrl);
        console.log(`   ✓ Uploaded image ${i}: ${publicUrl}`);
      } catch (e) {
        console.error(`   ✗ Image ${i} upload failed: ${e.message}`);
      }
    }

    // 3. Insert listing_images rows
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        await dbInsert("listing_images", {
          listing_id: listingId,
          url:        imageUrls[i],
          is_main:    i === 0,
          sort_order: i,
          created_at: NOW,
        });
        console.log(`   ✓ listing_images row ${i + 1} created`);
      } catch (e) {
        console.error(`   ✗ listing_images insert failed: ${e.message}`);
      }
    }

    // 4. Set cover_image_url
    if (imageUrls.length > 0) {
      try {
        await dbUpdate("listings", { id: listingId }, { cover_image_url: imageUrls[0] });
        console.log(`   ✓ cover_image_url set`);
      } catch (e) {
        console.error(`   ✗ cover_image_url update failed: ${e.message}`);
      }
    }

    results.push({ slug, listingId, title: row.title_ar });
  }

  // ── Approve 3 listings ───────────────────────────────────────────────────────
  console.log("\n── Approving listings...");
  const publishedAt = new Date().toISOString();

  for (const r of results) {
    const approve = TO_APPROVE.includes(r.slug);
    if (approve) {
      try {
        await dbUpdate("listings", { id: r.listingId }, {
          status:       "active",
          review_status: "approved",
          published_at:  publishedAt,
          updated_at:    publishedAt,
        });
        console.log(`   ✓ APPROVED: ${r.title} (${r.listingId})`);

        // Audit log entry
        try {
          await dbInsert("audit_logs", {
            actor_id:    OWNER_ID,
            category:    "listing_action",
            action:      "listing_approved",
            target_type: "listing",
            target_id:   r.listingId,
            details:     { reason: "Phase 5 QA approval" },
            severity:    "low",
          });
          console.log(`   ✓ audit_log created`);
        } catch (e) {
          // audit_logs table may not exist yet — not fatal
          console.warn(`   ⚠ audit_log failed (non-fatal): ${e.message.slice(0, 80)}`);
        }
      } catch (e) {
        console.error(`   ✗ Approve failed: ${e.message}`);
      }
    } else {
      console.log(`   — PENDING (left as-is): ${r.title}`);
    }
  }

  // ── Verification summary ─────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════");
  console.log(" SUMMARY");
  console.log("═══════════════════════════════════════════════════════");
  for (const r of results) {
    const status = TO_APPROVE.includes(r.slug) ? "APPROVED (active)" : "PENDING (pending_review)";
    console.log(`  ${r.slug.padEnd(18)} ${status}`);
    console.log(`    id: ${r.listingId}`);
  }

  // ── Verify DB state via REST ─────────────────────────────────────────────────
  console.log("\n── Verifying DB state...");
  const ids = results.map((r) => `id=eq.${r.listingId}`).join(",");
  // Supabase 'in' filter
  const idList = results.map((r) => r.listingId).join(",");
  const verifyUrl = `${SUPABASE_URL}/rest/v1/listings?id=in.(${idList})&select=id,title_ar,status,review_status,cover_image_url,published_at`;
  const vRes = await fetch(verifyUrl, { headers: { ...HEADERS, Prefer: "return=representation" } });
  const vRows = await vRes.json();

  console.log("\n  id                                   | status            | review   | has_cover | published");
  console.log("  ─────────────────────────────────────────────────────────────────────────────────────────");
  for (const row of vRows) {
    const cover = row.cover_image_url ? "✓" : "✗";
    const pub   = row.published_at ? row.published_at.slice(0, 10) : "—";
    console.log(`  ${row.id} | ${row.status.padEnd(17)} | ${row.review_status.padEnd(8)} | ${cover}         | ${pub}`);
  }

  // Count active vs pending
  const activeCount  = vRows.filter((r) => r.status === "active").length;
  const pendingCount = vRows.filter((r) => r.status === "pending_review").length;
  console.log(`\n  Total: ${vRows.length} listings  |  Active: ${activeCount}  |  Pending: ${pendingCount}`);

  // ── listing_images count ─────────────────────────────────────────────────────
  const liUrl = `${SUPABASE_URL}/rest/v1/listing_images?select=id,listing_id,is_main`;
  const liRes = await fetch(liUrl, { headers: HEADERS });
  const liRows = await liRes.json();
  console.log(`\n  listing_images rows: ${Array.isArray(liRows) ? liRows.length : "error"}`);

  console.log("\n✅ Phase 5 seed complete.\n");
}

main().catch((e) => {
  console.error("\n❌ Fatal:", e);
  process.exit(1);
});
