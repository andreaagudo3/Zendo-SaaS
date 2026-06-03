-- ============================================================
-- 004_custom_domain_verified.sql
-- Adds domain_verified column to tenants table
-- Updates tenant_context view to include the new field
-- ============================================================

-- 1. Add domain_verified column (false by default — must be validated)
ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS domain_verified BOOLEAN NOT NULL DEFAULT false;

-- 2. Recreate the tenant_context view to include domain_verified
DROP VIEW IF EXISTS public.tenant_context;

CREATE OR REPLACE VIEW public.tenant_context AS
SELECT
  id,
  slug,
  name,
  full_name,
  tagline,
  description,
  domain,
  domain_verified,
  is_default,
  primary_color,
  secondary_color,
  theme,
  zone,
  province,
  country,
  address,
  email,
  phones,
  socials,
  features,
  created_at,
  updated_at,
  -- Backward-compat alias
  features AS effective_features,
  -- Legal status computed on the fly
  jsonb_build_object(
    'has_terms', COALESCE(
      (legal_translations->'es'->>'terms' IS NOT NULL AND legal_translations->'es'->>'terms' <> '') OR
      (legal_translations->'en'->>'terms' IS NOT NULL AND legal_translations->'en'->>'terms' <> ''),
      false
    ),
    'has_privacy', COALESCE(
      (legal_translations->'es'->>'privacy' IS NOT NULL AND legal_translations->'es'->>'privacy' <> '') OR
      (legal_translations->'en'->>'privacy' IS NOT NULL AND legal_translations->'en'->>'privacy' <> ''),
      false
    ),
    'has_cookies', true
  ) AS legal_status
FROM public.tenants;
