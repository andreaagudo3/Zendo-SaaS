-- ============================================================
-- 003_legal_pages_multilang.sql
-- Adds legal_translations column to tenants table & updates tenant_context view
-- ============================================================

-- 1. Add JSONB column to store all translations in a structured format
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS legal_translations JSONB NOT NULL DEFAULT '{
  "en": {
    "terms": null,
    "cookies": null,
    "privacy": null
  },
  "es": {
    "terms": null,
    "cookies": null,
    "privacy": null
  }
}';

-- 2. Drop the old terms columns as they do not exist anymore
ALTER TABLE public.tenants 
DROP COLUMN IF EXISTS terms_and_conditions,
DROP COLUMN IF EXISTS terms_and_conditions_status;

-- 3. Recreate the tenant_context view to exclude legal_translations and calculate legal_status dynamically
DROP VIEW IF EXISTS public.tenant_context;

CREATE OR REPLACE VIEW public.tenant_context AS
SELECT 
  id,
  slug,
  name,
  full_name,
  tagline,
  description,
  custom_domain,
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
  -- Features fallback/alias for backward compatibility
  features AS effective_features,
  -- Calculate legal_status on-the-fly depending on whether translation is configured and not empty
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
    'has_cookies', COALESCE(
      (legal_translations->'es'->>'cookies' IS NOT NULL AND legal_translations->'es'->>'cookies' <> '') OR 
      (legal_translations->'en'->>'cookies' IS NOT NULL AND legal_translations->'en'->>'cookies' <> ''), 
      false
    )
  ) AS legal_status
FROM public.tenants;

-- 4. Create the dedicated heavy view tenant_legal_context for legal translations
DROP VIEW IF EXISTS public.tenant_legal_context;

CREATE OR REPLACE VIEW public.tenant_legal_context AS
SELECT 
  id,
  slug,
  legal_translations
FROM public.tenants;
