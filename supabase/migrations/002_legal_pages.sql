-- ============================================================
-- 002_legal_pages.sql
-- Adds terms_and_conditions columns to tenants table
-- ============================================================

ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT,
ADD COLUMN IF NOT EXISTS terms_and_conditions_status TEXT NOT NULL DEFAULT 'Borrador' CHECK (terms_and_conditions_status IN ('Borrador', 'Publicado'));
