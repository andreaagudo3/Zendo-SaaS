-- ============================================================
-- 003_legal_pages_multilang.sql
-- Adds legal_pages column to tenants table & updates tenant_context view
-- ============================================================

-- 1. Add JSONB column to store all translations and statuses in a structured format
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS legal_pages JSONB NOT NULL DEFAULT '{
  "terms": {
    "es": { "content": "", "status": "Borrador" },
    "en": { "content": "", "status": "Borrador" }
  },
  "privacy": {
    "es": { "content": "", "status": "Borrador" },
    "en": { "content": "", "status": "Borrador" }
  },
  "cookies": {
    "es": { "content": "", "status": "Borrador" },
    "en": { "content": "", "status": "Borrador" }
  }
}';

-- 2. Drop the old terms columns if you wish to clean up, or keep them to avoid errors.
-- We keep them to maintain database compatibility and avoid breaking any existing queries.

-- 3. Recreate the tenant_context view to expose legal_pages and calculate legal_status dynamically
DROP VIEW IF EXISTS public.tenant_context;

CREATE OR REPLACE VIEW public.tenant_context AS
SELECT 
  *,
  -- Features fallback/alias for backward compatibility
  features AS effective_features,
  -- Calculate legal_status on-the-fly depending on whether content is published and not empty
  jsonb_build_object(
    'has_terms', COALESCE(
      (legal_pages->'terms'->'es'->>'status' = 'Publicado' AND legal_pages->'terms'->'es'->>'content' <> '') OR 
      (legal_pages->'terms'->'en'->>'status' = 'Publicado' AND legal_pages->'terms'->'en'->>'content' <> ''), 
      false
    ),
    'has_privacy', COALESCE(
      (legal_pages->'privacy'->'es'->>'status' = 'Publicado' AND legal_pages->'privacy'->'es'->>'content' <> '') OR 
      (legal_pages->'privacy'->'en'->>'status' = 'Publicado' AND legal_pages->'privacy'->'en'->>'content' <> ''), 
      false
    ),
    'has_cookies', COALESCE(
      (legal_pages->'cookies'->'es'->>'status' = 'Publicado' AND legal_pages->'cookies'->'es'->>'content' <> '') OR 
      (legal_pages->'cookies'->'en'->>'status' = 'Publicado' AND legal_pages->'cookies'->'en'->>'content' <> ''), 
      false
    )
  ) AS legal_status
FROM public.tenants;
