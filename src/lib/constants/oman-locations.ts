// ── Oman Location Data — Single Source of Truth ──────────────────────────────
// Hierarchy: Governorate → Wilayat → Area
// All 11 official Omani governorates included.
// IDs are stable English slugs; changing them breaks listing/filter/route
// references — only add, never rename existing IDs.
// avgPriceSale in OMR; avgPriceRent in OMR/month (estimated/illustrative).
// ─────────────────────────────────────────────────────────────────────────────

import type { Governorate } from "@/types/location";

export const OMAN_GOVERNORATES: Governorate[] = [
  // ── 1. Muscat ──────────────────────────────────────────────────────────────
  {
    id: "muscat",
    nameAr: "محافظة مسقط",
    nameEn: "Muscat Governorate",
    wilayats: [
      {
        id: "bausher",
        nameAr: "بوشر",
        nameEn: "Bausher",
        governorateId: "muscat",
        areas: [
          { id: "al-khuwair",            nameAr: "الخوير",               nameEn: "Al Khuwair",            wilayatId: "bausher", avgPriceSale: 85000,  avgPriceRent: 350 },
          { id: "al-ghubrah",            nameAr: "الغبرة",               nameEn: "Al Ghubrah",            wilayatId: "bausher", avgPriceSale: 95000,  avgPriceRent: 400 },
          { id: "al-azaiba",             nameAr: "الأزيبة",              nameEn: "Al Azaiba",             wilayatId: "bausher", avgPriceSale: 90000,  avgPriceRent: 380 },
          { id: "madinat-sultan-qaboos", nameAr: "مدينة السلطان قابوس", nameEn: "Madinat Sultan Qaboos", wilayatId: "bausher", avgPriceSale: 150000, avgPriceRent: 700 },
          { id: "al-mawaldah",           nameAr: "المولادة",             nameEn: "Al Mawaldah",           wilayatId: "bausher", avgPriceSale: 70000,  avgPriceRent: 280 },
          { id: "al-mouj",               nameAr: "الموج",                nameEn: "Al Mouj",               wilayatId: "bausher", avgPriceSale: 165000, avgPriceRent: 780 },
          { id: "al-ansab",              nameAr: "الأنصب",               nameEn: "Al Ansab",              wilayatId: "bausher", avgPriceSale: 78000,  avgPriceRent: 310 },
          { id: "al-shatei",             nameAr: "الشاطئ",               nameEn: "Al Shatei",             wilayatId: "bausher", avgPriceSale: 165000, avgPriceRent: 750 },
        ],
      },
      {
        id: "seeb",
        nameAr: "السيب",
        nameEn: "Seeb",
        governorateId: "muscat",
        areas: [
          { id: "al-maabilah",       nameAr: "المعبيلة",         nameEn: "Al Maabilah",       wilayatId: "seeb", avgPriceSale: 55000, avgPriceRent: 220 },
          { id: "al-mawleh",         nameAr: "الموالح",           nameEn: "Al Mawleh",         wilayatId: "seeb", avgPriceSale: 60000, avgPriceRent: 240 },
          { id: "al-hail",           nameAr: "الحيل",             nameEn: "Al Hail",           wilayatId: "seeb", avgPriceSale: 65000, avgPriceRent: 260 },
          { id: "al-sidrah",         nameAr: "السدرة",             nameEn: "Al Sidrah",         wilayatId: "seeb", avgPriceSale: 58000, avgPriceRent: 230 },
          { id: "al-maabilah-south", nameAr: "المعبيلة الجنوبية", nameEn: "Al Maabilah South", wilayatId: "seeb", avgPriceSale: 52000, avgPriceRent: 210 },
          { id: "al-khoud",          nameAr: "الخوض",             nameEn: "Al Khoud",          wilayatId: "seeb", avgPriceSale: 62000, avgPriceRent: 250 },
          // NOTE: "mabela" (مبيلة) removed — it was a duplicate of "al-maabilah" (المعبيلة) above.
          { id: "al-mawaleh-north",  nameAr: "الموالح الشمالية",  nameEn: "Al Mawaleh North",  wilayatId: "seeb", avgPriceSale: 62000, avgPriceRent: 245 },
          { id: "al-mawaleh-south",  nameAr: "الموالح الجنوبية",  nameEn: "Al Mawaleh South",  wilayatId: "seeb", avgPriceSale: 58000, avgPriceRent: 235 },
        ],
      },
      {
        id: "muscat-wilayat",
        nameAr: "مسقط",
        nameEn: "Muscat",
        governorateId: "muscat",
        areas: [
          { id: "al-qurm",    nameAr: "القرم",    nameEn: "Al Qurm",    wilayatId: "muscat-wilayat", avgPriceSale: 130000, avgPriceRent: 600 },
          { id: "al-wattayah",nameAr: "الوطية",   nameEn: "Al Wattayah",wilayatId: "muscat-wilayat", avgPriceSale: 110000, avgPriceRent: 500 },
          { id: "ruwi",       nameAr: "روي",       nameEn: "Ruwi",       wilayatId: "muscat-wilayat", avgPriceSale: 80000,  avgPriceRent: 330 },
          { id: "wadi-kabir", nameAr: "وادي كبير", nameEn: "Wadi Kabir", wilayatId: "muscat-wilayat", avgPriceSale: 75000,  avgPriceRent: 300 },
          { id: "al-khairan", nameAr: "الخيران",   nameEn: "Al Khairan", wilayatId: "muscat-wilayat", avgPriceSale: 95000,  avgPriceRent: 400 },
        ],
      },
      {
        id: "muttrah",
        nameAr: "مطرح",
        nameEn: "Muttrah",
        governorateId: "muscat",
        areas: [
          { id: "muttrah-center", nameAr: "مركز مطرح", nameEn: "Muttrah Centre", wilayatId: "muttrah", avgPriceSale: 70000, avgPriceRent: 300 },
          { id: "al-waljat",      nameAr: "الوجاجة",   nameEn: "Al Waljat",      wilayatId: "muttrah", avgPriceSale: 65000, avgPriceRent: 260 },
        ],
      },
      {
        id: "amerat",
        nameAr: "العامرات",
        nameEn: "Amerat",
        governorateId: "muscat",
        areas: [
          { id: "amerat-center", nameAr: "مركز العامرات", nameEn: "Amerat Centre", wilayatId: "amerat", avgPriceSale: 48000, avgPriceRent: 190 },
          { id: "al-nakhil",     nameAr: "النخيل",        nameEn: "Al Nakhil",     wilayatId: "amerat", avgPriceSale: 50000, avgPriceRent: 200 },
        ],
      },
      {
        id: "qurayyat",
        nameAr: "قريات",
        nameEn: "Qurayyat",
        governorateId: "muscat",
        areas: [
          { id: "qurayyat-center", nameAr: "مركز قريات", nameEn: "Qurayyat Centre", wilayatId: "qurayyat", avgPriceSale: 38000, avgPriceRent: 150 },
          { id: "al-hajer",        nameAr: "الحاجر",      nameEn: "Al Hajer",        wilayatId: "qurayyat", avgPriceSale: 32000, avgPriceRent: 130 },
        ],
      },
    ],
  },

  // ── 2. Dhofar ──────────────────────────────────────────────────────────────
  {
    id: "dhofar",
    nameAr: "محافظة ظفار",
    nameEn: "Dhofar Governorate",
    wilayats: [
      {
        id: "salalah",
        nameAr: "صلالة",
        nameEn: "Salalah",
        governorateId: "dhofar",
        areas: [
          { id: "al-nahdha",       nameAr: "النهضة",       nameEn: "Al Nahdha",       wilayatId: "salalah", avgPriceSale: 45000, avgPriceRent: 180 },
          { id: "al-wadi-al-kabir",nameAr: "الوادي الكبير",nameEn: "Al Wadi Al Kabir",wilayatId: "salalah", avgPriceSale: 55000, avgPriceRent: 220 },
          { id: "itetin",          nameAr: "إيتيتين",      nameEn: "Itetin",          wilayatId: "salalah", avgPriceSale: 60000, avgPriceRent: 240 },
          { id: "salalah-city",    nameAr: "مدينة صلالة",  nameEn: "Salalah City",    wilayatId: "salalah", avgPriceSale: 48000, avgPriceRent: 200 },
          { id: "awqad",           nameAr: "عوقد",          nameEn: "Awqad",           wilayatId: "salalah", avgPriceSale: 42000, avgPriceRent: 175 },
          { id: "saadah",          nameAr: "سعادة",         nameEn: "Saadah",          wilayatId: "salalah", avgPriceSale: 40000, avgPriceRent: 165 },
          { id: "dahariz",         nameAr: "دهاريز",        nameEn: "Dahariz",         wilayatId: "salalah", avgPriceSale: 38000, avgPriceRent: 155 },
          { id: "al-haffa",        nameAr: "الحافة",        nameEn: "Al Haffa",        wilayatId: "salalah", avgPriceSale: 44000, avgPriceRent: 180 },
        ],
      },
      {
        id: "taqah",
        nameAr: "طاقة",
        nameEn: "Taqah",
        governorateId: "dhofar",
        areas: [
          { id: "taqah-center", nameAr: "وسط طاقة", nameEn: "Taqah Centre", wilayatId: "taqah", avgPriceSale: 28000, avgPriceRent: 120 },
        ],
      },
      {
        id: "mirbat",
        nameAr: "مرباط",
        nameEn: "Mirbat",
        governorateId: "dhofar",
        areas: [
          { id: "mirbat-center", nameAr: "وسط مرباط", nameEn: "Mirbat Centre", wilayatId: "mirbat", avgPriceSale: 25000, avgPriceRent: 100 },
        ],
      },
      {
        id: "thumrait",
        nameAr: "ثمريت",
        nameEn: "Thumrait",
        governorateId: "dhofar",
        areas: [
          { id: "thumrait-center", nameAr: "وسط ثمريت", nameEn: "Thumrait Centre", wilayatId: "thumrait", avgPriceSale: 22000, avgPriceRent: 90 },
        ],
      },
      {
        id: "sadah",
        nameAr: "سدح",
        nameEn: "Sadah",
        governorateId: "dhofar",
        areas: [
          { id: "sadah-center", nameAr: "وسط سدح", nameEn: "Sadah Centre", wilayatId: "sadah", avgPriceSale: 18000, avgPriceRent: 75 },
        ],
      },
      {
        id: "rakhyut",
        nameAr: "رخيوت",
        nameEn: "Rakhyut",
        governorateId: "dhofar",
        areas: [
          { id: "rakhyut-center", nameAr: "وسط رخيوت", nameEn: "Rakhyut Centre", wilayatId: "rakhyut", avgPriceSale: 16000, avgPriceRent: 65 },
        ],
      },
      {
        id: "dhalkut",
        nameAr: "ضلكوت",
        nameEn: "Dhalkut",
        governorateId: "dhofar",
        areas: [
          { id: "dhalkut-center", nameAr: "وسط ضلكوت", nameEn: "Dhalkut Centre", wilayatId: "dhalkut", avgPriceSale: 15000, avgPriceRent: 60 },
        ],
      },
      {
        id: "muqshin",
        nameAr: "مقشن",
        nameEn: "Muqshin",
        governorateId: "dhofar",
        areas: [
          { id: "muqshin-center", nameAr: "وسط مقشن", nameEn: "Muqshin Centre", wilayatId: "muqshin", avgPriceSale: 14000, avgPriceRent: 55 },
        ],
      },
      {
        id: "shalim-wa-hallaniyat",
        nameAr: "شليم وجزر الحلانيات",
        nameEn: "Shalim wa Hallaniyat",
        governorateId: "dhofar",
        areas: [
          { id: "shalim-center", nameAr: "وسط شليم", nameEn: "Shalim Centre", wilayatId: "shalim-wa-hallaniyat", avgPriceSale: 14000, avgPriceRent: 55 },
        ],
      },
      {
        id: "al-mazyunah",
        nameAr: "المزيونة",
        nameEn: "Al Mazyunah",
        governorateId: "dhofar",
        areas: [
          { id: "al-mazyunah-center", nameAr: "وسط المزيونة", nameEn: "Al Mazyunah Centre", wilayatId: "al-mazyunah", avgPriceSale: 15000, avgPriceRent: 60 },
        ],
      },
    ],
  },

  // ── 3. Musandam ────────────────────────────────────────────────────────────
  {
    id: "musandam",
    nameAr: "محافظة مسندم",
    nameEn: "Musandam Governorate",
    wilayats: [
      {
        id: "khasab",
        nameAr: "خصب",
        nameEn: "Khasab",
        governorateId: "musandam",
        areas: [
          { id: "khasab-center",  nameAr: "وسط خصب",   nameEn: "Khasab Centre",  wilayatId: "khasab", avgPriceSale: 38000, avgPriceRent: 155 },
          { id: "khasab-marina",  nameAr: "مرسى خصب",   nameEn: "Khasab Marina",  wilayatId: "khasab", avgPriceSale: 52000, avgPriceRent: 210 },
        ],
      },
      {
        id: "bukha",
        nameAr: "بخاء",
        nameEn: "Bukha",
        governorateId: "musandam",
        areas: [
          { id: "bukha-center", nameAr: "وسط بخاء", nameEn: "Bukha Centre", wilayatId: "bukha", avgPriceSale: 28000, avgPriceRent: 115 },
        ],
      },
      {
        id: "dibba",
        nameAr: "دبا",
        nameEn: "Dibba",
        governorateId: "musandam",
        areas: [
          { id: "dibba-center", nameAr: "وسط دبا", nameEn: "Dibba Centre", wilayatId: "dibba", avgPriceSale: 30000, avgPriceRent: 125 },
        ],
      },
      {
        id: "madha",
        nameAr: "مدحاء",
        nameEn: "Madha",
        governorateId: "musandam",
        areas: [
          { id: "madha-center", nameAr: "وسط مدحاء", nameEn: "Madha Centre", wilayatId: "madha", avgPriceSale: 22000, avgPriceRent: 90 },
        ],
      },
    ],
  },

  // ── 4. Al Buraimi ──────────────────────────────────────────────────────────
  {
    id: "al-buraimi",
    nameAr: "محافظة البريمي",
    nameEn: "Al Buraimi Governorate",
    wilayats: [
      {
        id: "al-buraimi-wilayat",
        nameAr: "البريمي",
        nameEn: "Al Buraimi",
        governorateId: "al-buraimi",
        areas: [
          { id: "al-buraimi-center",   nameAr: "وسط البريمي",  nameEn: "Al Buraimi Centre",   wilayatId: "al-buraimi-wilayat", avgPriceSale: 32000, avgPriceRent: 130 },
          { id: "al-buraimi-new-city", nameAr: "المدينة الجديدة",nameEn: "New City Al Buraimi", wilayatId: "al-buraimi-wilayat", avgPriceSale: 38000, avgPriceRent: 155 },
        ],
      },
      {
        id: "mahadha",
        nameAr: "محضة",
        nameEn: "Mahadha",
        governorateId: "al-buraimi",
        areas: [
          { id: "mahadha-center", nameAr: "وسط محضة", nameEn: "Mahadha Centre", wilayatId: "mahadha", avgPriceSale: 22000, avgPriceRent: 90 },
        ],
      },
      {
        id: "al-sunaynah",
        nameAr: "السنينة",
        nameEn: "Al Sunaynah",
        governorateId: "al-buraimi",
        areas: [
          { id: "al-sunaynah-center", nameAr: "وسط السنينة", nameEn: "Al Sunaynah Centre", wilayatId: "al-sunaynah", avgPriceSale: 24000, avgPriceRent: 95 },
        ],
      },
    ],
  },

  // ── 5. Ad Dakhiliyah ───────────────────────────────────────────────────────
  {
    id: "ad-dakhiliyah",
    nameAr: "محافظة الداخلية",
    nameEn: "Ad Dakhiliyah Governorate",
    wilayats: [
      {
        id: "nizwa",
        nameAr: "نزوى",
        nameEn: "Nizwa",
        governorateId: "ad-dakhiliyah",
        areas: [
          { id: "nizwa-center",    nameAr: "وسط نزوى",      nameEn: "Nizwa Centre",    wilayatId: "nizwa", avgPriceSale: 35000, avgPriceRent: 145 },
          { id: "birkat-al-mouz",  nameAr: "بركة الموز",    nameEn: "Birkat Al Mouz",  wilayatId: "nizwa", avgPriceSale: 28000, avgPriceRent: 115 },
          { id: "nizwa-souk-area", nameAr: "منطقة سوق نزوى",nameEn: "Nizwa Souk Area", wilayatId: "nizwa", avgPriceSale: 32000, avgPriceRent: 130 },
        ],
      },
      {
        id: "bahla",
        nameAr: "بهلاء",
        nameEn: "Bahla",
        governorateId: "ad-dakhiliyah",
        areas: [
          { id: "bahla-center", nameAr: "وسط بهلاء", nameEn: "Bahla Centre", wilayatId: "bahla", avgPriceSale: 25000, avgPriceRent: 100 },
        ],
      },
      {
        id: "adam",
        nameAr: "أدم",
        nameEn: "Adam",
        governorateId: "ad-dakhiliyah",
        areas: [
          { id: "adam-center", nameAr: "وسط أدم", nameEn: "Adam Centre", wilayatId: "adam", avgPriceSale: 22000, avgPriceRent: 88 },
        ],
      },
      {
        id: "manah",
        nameAr: "منح",
        nameEn: "Manah",
        governorateId: "ad-dakhiliyah",
        areas: [
          { id: "manah-center", nameAr: "وسط منح", nameEn: "Manah Centre", wilayatId: "manah", avgPriceSale: 20000, avgPriceRent: 80 },
        ],
      },
      {
        id: "samail",
        nameAr: "سمائل",
        nameEn: "Samail",
        governorateId: "ad-dakhiliyah",
        areas: [
          { id: "samail-center", nameAr: "وسط سمائل", nameEn: "Samail Centre", wilayatId: "samail", avgPriceSale: 28000, avgPriceRent: 115 },
        ],
      },
      {
        id: "izki",
        nameAr: "إزكي",
        nameEn: "Izki",
        governorateId: "ad-dakhiliyah",
        areas: [
          { id: "izki-center", nameAr: "وسط إزكي", nameEn: "Izki Centre", wilayatId: "izki", avgPriceSale: 24000, avgPriceRent: 95 },
        ],
      },
      {
        id: "bidbid",
        nameAr: "بدبد",
        nameEn: "Bidbid",
        governorateId: "ad-dakhiliyah",
        areas: [
          { id: "bidbid-center", nameAr: "وسط بدبد", nameEn: "Bidbid Centre", wilayatId: "bidbid", avgPriceSale: 30000, avgPriceRent: 120 },
        ],
      },
      {
        id: "al-hamra",
        nameAr: "الحمراء",
        nameEn: "Al Hamra",
        governorateId: "ad-dakhiliyah",
        areas: [
          { id: "al-hamra-center", nameAr: "وسط الحمراء", nameEn: "Al Hamra Centre", wilayatId: "al-hamra", avgPriceSale: 22000, avgPriceRent: 88 },
        ],
      },
      {
        id: "jabal-akhdar",
        nameAr: "الجبل الأخضر",
        nameEn: "Jabal Akhdar",
        governorateId: "ad-dakhiliyah",
        areas: [
          { id: "jabal-akhdar-center", nameAr: "وسط الجبل الأخضر", nameEn: "Jabal Akhdar Centre", wilayatId: "jabal-akhdar", avgPriceSale: 35000, avgPriceRent: 140 },
        ],
      },
    ],
  },

  // ── 6. North Al Batinah ────────────────────────────────────────────────────
  {
    id: "north-batinah",
    nameAr: "محافظة شمال الباطنة",
    nameEn: "North Al Batinah Governorate",
    wilayats: [
      {
        id: "sohar",
        nameAr: "صحار",
        nameEn: "Sohar",
        governorateId: "north-batinah",
        areas: [
          { id: "sohar-center",     nameAr: "مركز صحار",     nameEn: "Sohar Centre",     wilayatId: "sohar", avgPriceSale: 38000, avgPriceRent: 160 },
          { id: "al-falaj",         nameAr: "الفلج",          nameEn: "Al Falaj",         wilayatId: "sohar", avgPriceSale: 35000, avgPriceRent: 140 },
          { id: "sohar-industrial", nameAr: "المنطقة الصناعية",nameEn: "Sohar Industrial", wilayatId: "sohar", avgPriceSale: 42000, avgPriceRent: 175 },
          { id: "falaj-al-qabail",  nameAr: "فلج القبائل",    nameEn: "Falaj Al Qabail",  wilayatId: "sohar", avgPriceSale: 34000, avgPriceRent: 138 },
        ],
      },
      {
        id: "shinas",
        nameAr: "شناص",
        nameEn: "Shinas",
        governorateId: "north-batinah",
        areas: [
          { id: "shinas-center", nameAr: "وسط شناص", nameEn: "Shinas Centre", wilayatId: "shinas", avgPriceSale: 29000, avgPriceRent: 118 },
        ],
      },
      {
        id: "liwa",
        nameAr: "ليوا",
        nameEn: "Liwa",
        governorateId: "north-batinah",
        areas: [
          { id: "liwa-center", nameAr: "وسط ليوا", nameEn: "Liwa Centre", wilayatId: "liwa", avgPriceSale: 26000, avgPriceRent: 105 },
        ],
      },
      {
        id: "saham",
        nameAr: "صحم",
        nameEn: "Saham",
        governorateId: "north-batinah",
        areas: [
          { id: "saham-center", nameAr: "وسط صحم", nameEn: "Saham Centre", wilayatId: "saham", avgPriceSale: 28000, avgPriceRent: 112 },
        ],
      },
      {
        id: "al-khabourah",
        nameAr: "الخابورة",
        nameEn: "Al Khabourah",
        governorateId: "north-batinah",
        areas: [
          { id: "al-khabourah-center", nameAr: "وسط الخابورة", nameEn: "Al Khabourah Centre", wilayatId: "al-khabourah", avgPriceSale: 27000, avgPriceRent: 108 },
        ],
      },
      {
        id: "al-suwaiq",
        nameAr: "السويق",
        nameEn: "Al Suwaiq",
        governorateId: "north-batinah",
        areas: [
          { id: "al-suwaiq-center", nameAr: "وسط السويق", nameEn: "Al Suwaiq Centre", wilayatId: "al-suwaiq", avgPriceSale: 30000, avgPriceRent: 120 },
        ],
      },
    ],
  },

  // ── 7. South Al Batinah ────────────────────────────────────────────────────
  {
    id: "south-batinah",
    nameAr: "محافظة جنوب الباطنة",
    nameEn: "South Al Batinah Governorate",
    wilayats: [
      {
        id: "barka",
        nameAr: "بركاء",
        nameEn: "Barka",
        governorateId: "south-batinah",
        areas: [
          { id: "barka-center", nameAr: "وسط بركاء",  nameEn: "Barka Centre", wilayatId: "barka", avgPriceSale: 42000, avgPriceRent: 170 },
          { id: "sawadi",       nameAr: "السوادي",      nameEn: "Al Sawadi",    wilayatId: "barka", avgPriceSale: 55000, avgPriceRent: 220 },
          { id: "al-rumais",    nameAr: "الرميس",       nameEn: "Al Rumais",    wilayatId: "barka", avgPriceSale: 36000, avgPriceRent: 145 },
        ],
      },
      {
        id: "rustaq",
        nameAr: "الرستاق",
        nameEn: "Rustaq",
        governorateId: "south-batinah",
        areas: [
          { id: "rustaq-center", nameAr: "وسط الرستاق", nameEn: "Rustaq Centre", wilayatId: "rustaq", avgPriceSale: 30000, avgPriceRent: 122 },
        ],
      },
      {
        id: "al-awabi",
        nameAr: "العوابي",
        nameEn: "Al Awabi",
        governorateId: "south-batinah",
        areas: [
          { id: "al-awabi-center", nameAr: "وسط العوابي", nameEn: "Al Awabi Centre", wilayatId: "al-awabi", avgPriceSale: 22000, avgPriceRent: 88 },
        ],
      },
      {
        id: "nakhal",
        nameAr: "نخل",
        nameEn: "Nakhal",
        governorateId: "south-batinah",
        areas: [
          { id: "nakhal-center", nameAr: "وسط نخل", nameEn: "Nakhal Centre", wilayatId: "nakhal", avgPriceSale: 20000, avgPriceRent: 80 },
        ],
      },
      {
        id: "wadi-al-maawil",
        nameAr: "وادي المعاول",
        nameEn: "Wadi Al Maawil",
        governorateId: "south-batinah",
        areas: [
          { id: "wadi-al-maawil-center", nameAr: "وسط وادي المعاول", nameEn: "Wadi Al Maawil Centre", wilayatId: "wadi-al-maawil", avgPriceSale: 18000, avgPriceRent: 72 },
        ],
      },
      {
        id: "al-musannah",
        nameAr: "المصنعة",
        nameEn: "Al Musannah",
        governorateId: "south-batinah",
        areas: [
          { id: "al-musannah-center", nameAr: "وسط المصنعة", nameEn: "Al Musannah Centre", wilayatId: "al-musannah", avgPriceSale: 28000, avgPriceRent: 112 },
        ],
      },
    ],
  },

  // ── 8. North Al Sharqiyah ──────────────────────────────────────────────────
  {
    id: "north-sharqiyah",
    nameAr: "محافظة شمال الشرقية",
    nameEn: "North Al Sharqiyah Governorate",
    wilayats: [
      {
        id: "ibra",
        nameAr: "إبراء",
        nameEn: "Ibra",
        governorateId: "north-sharqiyah",
        areas: [
          { id: "ibra-center", nameAr: "وسط إبراء", nameEn: "Ibra Centre", wilayatId: "ibra", avgPriceSale: 30000, avgPriceRent: 120 },
        ],
      },
      {
        id: "al-mudhaibi",
        nameAr: "المضيبي",
        nameEn: "Al Mudhaibi",
        governorateId: "north-sharqiyah",
        areas: [
          { id: "al-mudhaibi-center", nameAr: "وسط المضيبي", nameEn: "Al Mudhaibi Centre", wilayatId: "al-mudhaibi", avgPriceSale: 24000, avgPriceRent: 96 },
        ],
      },
      {
        id: "bidiyah",
        nameAr: "بدية",
        nameEn: "Bidiyah",
        governorateId: "north-sharqiyah",
        areas: [
          { id: "bidiyah-center", nameAr: "وسط بدية", nameEn: "Bidiyah Centre", wilayatId: "bidiyah", avgPriceSale: 22000, avgPriceRent: 88 },
        ],
      },
      {
        id: "al-qabil",
        nameAr: "القابل",
        nameEn: "Al Qabil",
        governorateId: "north-sharqiyah",
        areas: [
          { id: "al-qabil-center", nameAr: "وسط القابل", nameEn: "Al Qabil Centre", wilayatId: "al-qabil", avgPriceSale: 20000, avgPriceRent: 80 },
          // Expanded areas — marked needs-verification in DB (is_verified=false).
          // Wadi Bani Khalid and Al Suwaiq are NOT listed here:
          //   - Wadi Bani Khalid is its own wilayat in this same governorate.
          //   - Al Suwaiq is a wilayat in North Batinah (different governorate).
          { id: "al-mudayrib", nameAr: "المضيرب", nameEn: "Al Mudayrib", wilayatId: "al-qabil", avgPriceSale: 18000, avgPriceRent: 72 },
          { id: "al-iz",       nameAr: "عز",       nameEn: "Iz",          wilayatId: "al-qabil", avgPriceSale: 19000, avgPriceRent: 76 },
          { id: "al-dreez",    nameAr: "الدريز",    nameEn: "Al Dreez",    wilayatId: "al-qabil", avgPriceSale: 17000, avgPriceRent: 68 },
          { id: "al-hawari",   nameAr: "الهواري",   nameEn: "Al Hawari",   wilayatId: "al-qabil", avgPriceSale: 18000, avgPriceRent: 72 },
        ],
      },
      {
        id: "wadi-bani-khalid",
        nameAr: "وادي بني خالد",
        nameEn: "Wadi Bani Khalid",
        governorateId: "north-sharqiyah",
        areas: [
          { id: "wadi-bani-khalid-center", nameAr: "وسط وادي بني خالد", nameEn: "Wadi Bani Khalid Centre", wilayatId: "wadi-bani-khalid", avgPriceSale: 18000, avgPriceRent: 72 },
        ],
      },
      {
        id: "dima-wa-al-tayyin",
        nameAr: "ضماء والطائيين",
        nameEn: "Dima wa Al Tayyin",
        governorateId: "north-sharqiyah",
        areas: [
          { id: "dima-center", nameAr: "وسط ضماء", nameEn: "Dima Centre", wilayatId: "dima-wa-al-tayyin", avgPriceSale: 16000, avgPriceRent: 64 },
        ],
      },
    ],
  },

  // ── 9. South Al Sharqiyah ──────────────────────────────────────────────────
  {
    id: "south-sharqiyah",
    nameAr: "محافظة جنوب الشرقية",
    nameEn: "South Al Sharqiyah Governorate",
    wilayats: [
      {
        id: "sur",
        nameAr: "صور",
        nameEn: "Sur",
        governorateId: "south-sharqiyah",
        areas: [
          { id: "sur-center", nameAr: "وسط صور",  nameEn: "Sur Centre", wilayatId: "sur", avgPriceSale: 32000, avgPriceRent: 130 },
          { id: "al-ayjah",   nameAr: "العيجة",    nameEn: "Al Ayjah",   wilayatId: "sur", avgPriceSale: 38000, avgPriceRent: 155 },
        ],
      },
      {
        id: "jalan-bani-bu-ali",
        nameAr: "جعلان بني بو علي",
        nameEn: "Jalan Bani Bu Ali",
        governorateId: "south-sharqiyah",
        areas: [
          { id: "jalan-center", nameAr: "وسط جعلان", nameEn: "Jalan Centre", wilayatId: "jalan-bani-bu-ali", avgPriceSale: 22000, avgPriceRent: 88 },
        ],
      },
      {
        id: "jalan-bani-bu-hassan",
        nameAr: "جعلان بني بو حسن",
        nameEn: "Jalan Bani Bu Hassan",
        governorateId: "south-sharqiyah",
        areas: [
          { id: "jalan-bu-hassan-center", nameAr: "وسط جعلان بو حسن", nameEn: "Jalan Bu Hassan Centre", wilayatId: "jalan-bani-bu-hassan", avgPriceSale: 20000, avgPriceRent: 80 },
        ],
      },
      {
        id: "al-kamil-wal-wafi",
        nameAr: "الكامل والوافي",
        nameEn: "Al Kamil wal Wafi",
        governorateId: "south-sharqiyah",
        areas: [
          { id: "al-kamil-center", nameAr: "وسط الكامل", nameEn: "Al Kamil Centre", wilayatId: "al-kamil-wal-wafi", avgPriceSale: 19000, avgPriceRent: 76 },
        ],
      },
      {
        id: "masirah",
        nameAr: "مصيرة",
        nameEn: "Masirah",
        governorateId: "south-sharqiyah",
        areas: [
          { id: "masirah-center", nameAr: "وسط مصيرة", nameEn: "Masirah Centre", wilayatId: "masirah", avgPriceSale: 28000, avgPriceRent: 112 },
        ],
      },
    ],
  },

  // ── 10. Al Dhahirah ────────────────────────────────────────────────────────
  {
    id: "al-dhahirah",
    nameAr: "محافظة الظاهرة",
    nameEn: "Al Dhahirah Governorate",
    wilayats: [
      {
        id: "ibri",
        nameAr: "عبري",
        nameEn: "Ibri",
        governorateId: "al-dhahirah",
        areas: [
          { id: "ibri-center",     nameAr: "وسط عبري",            nameEn: "Ibri Centre",      wilayatId: "ibri", avgPriceSale: 30000, avgPriceRent: 120 },
          { id: "ibri-industrial", nameAr: "المنطقة الصناعية عبري",nameEn: "Ibri Industrial",  wilayatId: "ibri", avgPriceSale: 35000, avgPriceRent: 140 },
        ],
      },
      {
        id: "yankul",
        nameAr: "ينقل",
        nameEn: "Yankul",
        governorateId: "al-dhahirah",
        areas: [
          { id: "yankul-center", nameAr: "وسط ينقل", nameEn: "Yankul Centre", wilayatId: "yankul", avgPriceSale: 18000, avgPriceRent: 72 },
        ],
      },
      {
        id: "dhank",
        nameAr: "ضنك",
        nameEn: "Dhank",
        governorateId: "al-dhahirah",
        areas: [
          { id: "dhank-center", nameAr: "وسط ضنك", nameEn: "Dhank Centre", wilayatId: "dhank", avgPriceSale: 16000, avgPriceRent: 64 },
        ],
      },
    ],
  },

  // ── 11. Al Wusta ───────────────────────────────────────────────────────────
  {
    id: "al-wusta",
    nameAr: "محافظة الوسطى",
    nameEn: "Al Wusta Governorate",
    wilayats: [
      {
        id: "duqm",
        nameAr: "الدقم",
        nameEn: "Duqm",
        governorateId: "al-wusta",
        areas: [
          { id: "duqm-center",     nameAr: "وسط الدقم",     nameEn: "Duqm Centre",       wilayatId: "duqm", avgPriceSale: 32000, avgPriceRent: 130 },
          { id: "duqm-industrial", nameAr: "المنطقة الصناعية الدقم",nameEn: "Duqm Industrial", wilayatId: "duqm", avgPriceSale: 40000, avgPriceRent: 160 },
          { id: "duqm-port",       nameAr: "ميناء الدقم",    nameEn: "Duqm Port Area",    wilayatId: "duqm", avgPriceSale: 45000, avgPriceRent: 180 },
        ],
      },
      {
        id: "haima",
        nameAr: "هيماء",
        nameEn: "Haima",
        governorateId: "al-wusta",
        areas: [
          { id: "haima-center", nameAr: "وسط هيماء", nameEn: "Haima Centre", wilayatId: "haima", avgPriceSale: 22000, avgPriceRent: 88 },
        ],
      },
      {
        id: "mahout",
        nameAr: "محوت",
        nameEn: "Mahout",
        governorateId: "al-wusta",
        areas: [
          { id: "mahout-center", nameAr: "وسط محوت", nameEn: "Mahout Centre", wilayatId: "mahout", avgPriceSale: 18000, avgPriceRent: 72 },
        ],
      },
      {
        id: "al-jazer",
        nameAr: "الجازر",
        nameEn: "Al Jazer",
        governorateId: "al-wusta",
        areas: [
          { id: "al-jazer-center", nameAr: "وسط الجازر", nameEn: "Al Jazer Centre", wilayatId: "al-jazer", avgPriceSale: 16000, avgPriceRent: 64 },
        ],
      },
    ],
  },
];

export const GOVERNORATE_MAP: Record<string, Governorate> = Object.fromEntries(
  OMAN_GOVERNORATES.map((g) => [g.id, g])
);

// ── Lookup helpers ────────────────────────────────────────────────────────────

export function getGovernorate(id: string) {
  return GOVERNORATE_MAP[id] ?? null;
}

export function getWilayat(governorateId: string, wilayatId: string) {
  return GOVERNORATE_MAP[governorateId]?.wilayats.find((w) => w.id === wilayatId) ?? null;
}

export function getArea(governorateId: string, wilayatId: string, areaId: string) {
  return getWilayat(governorateId, wilayatId)?.areas.find((a) => a.id === areaId) ?? null;
}
