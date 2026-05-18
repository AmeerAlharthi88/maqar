-- =============================================================================
-- Migration 041 — market_data Seed: Oman Area Statistics
-- Maqar Phase I · Admin-Managed Market Statistics
-- Run AFTER 040_rls_phase_i.
-- =============================================================================
-- IMPORTANT DISCLAIMER:
--   All values are admin-managed estimates for illustrative/development purposes.
--   These are NOT official government statistics or verified market reports.
--   The data_source column is always set to 'admin_managed' to reflect this.
--   Public pages must display a disclaimer when showing this data.
-- =============================================================================
-- Uses INSERT ... ON CONFLICT DO NOTHING so re-running is safe.
-- No UNIQUE constraint on the table, so we check via a DO block pattern.
-- =============================================================================

DO $$
BEGIN

-- ── Muscat Governorate — Wilayat Bausher ─────────────────────────────────────

-- Bausher wilayat-level (all property types)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'بوشر', NULL, NULL, 75000, 330, 490, 5.3, 88, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Mouj — Bausher (luxury waterfront)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'بوشر', 'الموج', 'apartment', 165000, 680, 1100, 4.9, 95, 'admin_managed'),
  ('مسقط', 'بوشر', 'الموج', 'villa',     420000, 1600, 1350, 4.6, 92, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Medinat Qaboos — Bausher (established premium)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'بوشر', 'مدينة قابوس', 'apartment', 95000, 420, 680, 5.3, 90, 'admin_managed'),
  ('مسقط', 'بوشر', 'مدينة قابوس', 'villa',     280000, 1100, 890, 4.7, 87, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Qurum — Bausher (commercial/residential mix)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'بوشر', 'القرم', 'apartment', 85000, 370, 590, 5.2, 85, 'admin_managed'),
  ('مسقط', 'بوشر', 'القرم', 'commercial', 180000, 950, 1200, 6.3, 80, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Muscat Governorate — Wilayat Seeb ─────────────────────────────────────────

-- Seeb wilayat-level
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', NULL, NULL, 52000, 240, 360, 5.5, 82, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Khoud — Seeb (university area, popular with families)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'الخوض', 'apartment', 48000, 210, 330, 5.3, 78, 'admin_managed'),
  ('مسقط', 'السيب', 'الخوض', 'villa',     145000, 650, 480, 5.4, 75, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Ghubrah — Seeb (mid-range residential)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'الغبرة', 'apartment', 62000, 280, 410, 5.4, 83, 'admin_managed'),
  ('مسقط', 'السيب', 'الغبرة', 'villa',     185000, 780, 560, 5.1, 80, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Mawaleh — Seeb (affordable, growing)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'الموالح', 'apartment', 42000, 185, 295, 5.3, 76, 'admin_managed'),
  ('مسقط', 'السيب', 'الموالح', 'villa',     120000, 530, 400, 5.3, 73, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Khuwair — Seeb (business district, high demand)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'الخوير', 'apartment', 78000, 360, 530, 5.5, 89, 'admin_managed'),
  ('مسقط', 'السيب', 'الخوير', 'commercial', 220000, 1100, 1450, 6.0, 86, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Al Amerat — Seeb (emerging, affordable)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'السيب', 'العامرات', 'apartment', 38000, 165, 265, 5.2, 70, 'admin_managed'),
  ('مسقط', 'السيب', 'العامرات', 'villa',     105000, 460, 360, 5.3, 68, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Muscat Governorate — Wilayat Muttrah ─────────────────────────────────────

-- Muttrah wilayat-level
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'مطرح', NULL, NULL, 68000, 290, 450, 5.1, 74, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Ruwi — Muttrah (commercial hub)
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'مطرح', 'الروي', 'commercial', 195000, 1000, 1300, 6.2, 77, 'admin_managed'),
  ('مسقط', 'مطرح', 'الروي', 'apartment',  55000,   250,  380, 5.5, 72, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Muscat Governorate — Wilayat Muscat (capital wilayat) ────────────────────

-- Muscat wilayat-level
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'مسقط', NULL, NULL, 110000, 480, 740, 5.2, 91, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Old Muscat / Al Alam area
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('مسقط', 'مسقط', 'العلام', 'villa',     350000, 1400, 950, 4.8, 85, 'admin_managed'),
  ('مسقط', 'مسقط', 'العلام', 'apartment', 120000,  520,  800, 5.2, 82, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Dhofar Governorate — Wilayat Salalah ─────────────────────────────────────

-- Dhofar governorate-level
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('ظفار', 'صلالة', NULL, NULL, 42000, 190, 280, 5.4, 72, 'admin_managed')
ON CONFLICT DO NOTHING;

-- Salalah city centre
INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('ظفار', 'صلالة', 'صلالة المدينة', 'apartment', 38000, 175, 260, 5.5, 70, 'admin_managed'),
  ('ظفار', 'صلالة', 'صلالة المدينة', 'villa',     115000, 500, 380, 5.2, 68, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Al Batinah North — Sohar ─────────────────────────────────────────────────

INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('شمال الباطنة', 'صحار', NULL, NULL, 35000, 160, 240, 5.5, 65, 'admin_managed'),
  ('شمال الباطنة', 'صحار', 'صحار المدينة', 'apartment', 32000, 150, 225, 5.6, 63, 'admin_managed'),
  ('شمال الباطنة', 'صحار', 'صحار المدينة', 'villa',     98000,  420, 330, 5.1, 60, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Al Batinah North — Barka ─────────────────────────────────────────────────

INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('شمال الباطنة', 'بركاء', NULL, NULL, 30000, 140, 210, 5.6, 60, 'admin_managed'),
  ('شمال الباطنة', 'بركاء', 'بركاء', 'apartment', 28000, 130, 195, 5.6, 58, 'admin_managed'),
  ('شمال الباطنة', 'بركاء', 'بركاء', 'villa',     88000,  380, 300, 5.2, 55, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Al Dakhliyah — Nizwa ─────────────────────────────────────────────────────

INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('الداخلية', 'نزوى', NULL, NULL, 28000, 125, 200, 5.4, 58, 'admin_managed'),
  ('الداخلية', 'نزوى', 'نزوى المدينة', 'apartment', 25000, 115, 185, 5.5, 56, 'admin_managed'),
  ('الداخلية', 'نزوى', 'نزوى المدينة', 'villa',     80000,  340, 270, 5.1, 53, 'admin_managed')
ON CONFLICT DO NOTHING;

-- ── Al Sharqiyah North — Sur ─────────────────────────────────────────────────

INSERT INTO public.market_data
  (governorate, wilayat, area, property_type, average_sale_price_omr, average_rent_omr, price_per_sqm_omr, rental_yield_percent, demand_score, data_source)
VALUES
  ('شمال الشرقية', 'صور', NULL, NULL, 32000, 145, 220, 5.4, 60, 'admin_managed'),
  ('شمال الشرقية', 'صور', 'صور المدينة', 'apartment', 28000, 130, 200, 5.6, 58, 'admin_managed')
ON CONFLICT DO NOTHING;

END $$;

-- =============================================================================
-- ROLLBACK
-- =============================================================================
-- DELETE FROM public.market_data WHERE data_source = 'admin_managed';
-- =============================================================================
