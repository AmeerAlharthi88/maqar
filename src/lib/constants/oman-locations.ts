import type { Governorate } from "@/types/location";

export const OMAN_GOVERNORATES: Governorate[] = [
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
          { id: "al-khuwair", nameAr: "الخوير", nameEn: "Al Khuwair", wilayatId: "bausher", avgPriceSale: 85000, avgPriceRent: 350 },
          { id: "al-ghubrah", nameAr: "الغبرة", nameEn: "Al Ghubrah", wilayatId: "bausher", avgPriceSale: 95000, avgPriceRent: 400 },
          { id: "al-azaiba", nameAr: "الأزيبة", nameEn: "Al Azaiba", wilayatId: "bausher", avgPriceSale: 90000, avgPriceRent: 380 },
          { id: "madinat-sultan-qaboos", nameAr: "مدينة السلطان قابوس", nameEn: "Madinat Sultan Qaboos", wilayatId: "bausher", avgPriceSale: 150000, avgPriceRent: 700 },
          { id: "al-mawaldah", nameAr: "المولادة", nameEn: "Al Mawaldah", wilayatId: "bausher", avgPriceSale: 70000, avgPriceRent: 280 },
        ],
      },
      {
        id: "seeb",
        nameAr: "السيب",
        nameEn: "Seeb",
        governorateId: "muscat",
        areas: [
          { id: "al-maabilah", nameAr: "المعبيلة", nameEn: "Al Maabilah", wilayatId: "seeb", avgPriceSale: 55000, avgPriceRent: 220 },
          { id: "al-mawleh", nameAr: "الموالح", nameEn: "Al Mawleh", wilayatId: "seeb", avgPriceSale: 60000, avgPriceRent: 240 },
          { id: "al-hail", nameAr: "الحيل", nameEn: "Al Hail", wilayatId: "seeb", avgPriceSale: 65000, avgPriceRent: 260 },
          { id: "al-sidrah", nameAr: "السدرة", nameEn: "Al Sidrah", wilayatId: "seeb", avgPriceSale: 58000, avgPriceRent: 230 },
          { id: "al-maabilah-south", nameAr: "المعبيلة الجنوبية", nameEn: "Al Maabilah South", wilayatId: "seeb", avgPriceSale: 52000, avgPriceRent: 210 },
        ],
      },
      {
        id: "muscat-wilayat",
        nameAr: "مسقط",
        nameEn: "Muscat",
        governorateId: "muscat",
        areas: [
          { id: "al-qurm", nameAr: "القرم", nameEn: "Al Qurm", wilayatId: "muscat-wilayat", avgPriceSale: 130000, avgPriceRent: 600 },
          { id: "al-wattayah", nameAr: "الوطية", nameEn: "Al Wattayah", wilayatId: "muscat-wilayat", avgPriceSale: 110000, avgPriceRent: 500 },
          { id: "ruwi", nameAr: "روي", nameEn: "Ruwi", wilayatId: "muscat-wilayat", avgPriceSale: 80000, avgPriceRent: 330 },
        ],
      },
      {
        id: "muttrah",
        nameAr: "مطرح",
        nameEn: "Muttrah",
        governorateId: "muscat",
        areas: [
          { id: "muttrah-center", nameAr: "مركز مطرح", nameEn: "Muttrah Centre", wilayatId: "muttrah", avgPriceSale: 70000, avgPriceRent: 300 },
          { id: "al-waljat", nameAr: "الوجاجة", nameEn: "Al Waljat", wilayatId: "muttrah", avgPriceSale: 65000, avgPriceRent: 260 },
        ],
      },
      {
        id: "amerat",
        nameAr: "العامرات",
        nameEn: "Amerat",
        governorateId: "muscat",
        areas: [
          { id: "amerat-center", nameAr: "مركز العامرات", nameEn: "Amerat Centre", wilayatId: "amerat", avgPriceSale: 48000, avgPriceRent: 190 },
          { id: "al-nakhil", nameAr: "النخيل", nameEn: "Al Nakhil", wilayatId: "amerat", avgPriceSale: 50000, avgPriceRent: 200 },
        ],
      },
    ],
  },
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
          { id: "al-nahdha", nameAr: "النهضة", nameEn: "Al Nahdha", wilayatId: "salalah", avgPriceSale: 45000, avgPriceRent: 180 },
          { id: "al-wadi-al-kabir", nameAr: "الوادي الكبير", nameEn: "Al Wadi Al Kabir", wilayatId: "salalah", avgPriceSale: 55000, avgPriceRent: 220 },
          { id: "itetin", nameAr: "إيتيتين", nameEn: "Itetin", wilayatId: "salalah", avgPriceSale: 60000, avgPriceRent: 240 },
        ],
      },
    ],
  },
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
          { id: "sohar-center", nameAr: "مركز صحار", nameEn: "Sohar Centre", wilayatId: "sohar", avgPriceSale: 38000, avgPriceRent: 160 },
          { id: "al-falaj", nameAr: "الفلج", nameEn: "Al Falaj", wilayatId: "sohar", avgPriceSale: 35000, avgPriceRent: 140 },
        ],
      },
    ],
  },
];

export const GOVERNORATE_MAP: Record<string, Governorate> = Object.fromEntries(
  OMAN_GOVERNORATES.map((g) => [g.id, g])
);
