-- ============================================================
-- 001_multi_tenant.sql
-- Multi-tenant SaaS architecture for InmoZen
--
-- Creates:
--   1. tenants          — one row per agency / white-label customer
--   2. property_images  — normalised image table replacing storage-folder scan
-- ============================================================

-- ─── 1. TENANTS ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tenants (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT        NOT NULL UNIQUE,          -- e.g. 'parque-sierra'
  name             TEXT        NOT NULL,                 -- e.g. 'Parque Sierra'
  full_name        TEXT,                                 -- e.g. 'Parque Sierra Real Estate'
  tagline          TEXT,
  description      TEXT,

  -- Routing: resolved from window.location.hostname
  custom_domain    TEXT        UNIQUE,                   -- e.g. 'parque-sierra.com'
  is_default       BOOLEAN     NOT NULL DEFAULT false,   -- used for localhost / dev

  -- Branding
  primary_color    TEXT        NOT NULL DEFAULT '#23c698',
  secondary_color  TEXT        NOT NULL DEFAULT '#64748b',
  theme            TEXT        NOT NULL DEFAULT 'MINIMAL'
                               CHECK (theme IN ('MINIMAL', 'CORPORATE', 'PORTAL')),

  -- Contact info
  zone             TEXT,                                 -- e.g. 'Costa del Sol'
  province         TEXT,
  country          TEXT        DEFAULT 'España',
  address          TEXT,
  email            TEXT,
  phones           JSONB       NOT NULL DEFAULT '[]',    -- [{number, href}]
  socials          JSONB       NOT NULL DEFAULT '[]',    -- [{name, href}]

  -- Feature flags (mirrors SITE.features)
  features         JSONB       NOT NULL DEFAULT '{
    "isDemo": true,
    "i18n": true,
    "googleMaps": true,
    "advancedFilters": true,
    "whatsappButton": true
  }',

  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only one tenant may be the default (used for localhost dev)
CREATE UNIQUE INDEX IF NOT EXISTS tenants_is_default_unique
  ON tenants (is_default)
  WHERE is_default = true;

-- ─── Sample default tenant (mirrors current siteConfig.js values) ────────────

INSERT INTO tenants (
  slug, name, full_name, tagline, description,
  is_default, custom_domain,
  primary_color, secondary_color, theme,
  zone, province, country, address, email,
  phones, socials, features
) VALUES (
  'inmozen',
  'InmoZen',
  'InmoZen Real Estate Group',
  'Real Estate Minimalist',
  'Encuentra la casa de tus sueños con la experiencia InmoZen. Lujo, minimalismo y eficiencia.',
  true,
  NULL,
  '#23c698',
  '#64748b',
  'MINIMAL',
  'Costa del Sol',
  'Málaga',
  'España',
  'Av. Ricardo Soriano, 12, 29601 Marbella, Málaga',
  'hello@inmozen.com',
  '[{"number": "+34 600 00 00 00", "href": "tel:+34600000000"}]',
  '[
    {"name": "Instagram", "href": "https://instagram.com/inmozen"},
    {"name": "LinkedIn",  "href": "https://linkedin.com/company/inmozen"},
    {"name": "Twitter",   "href": "#"}
  ]',
  '{"isDemo": true, "i18n": true, "googleMaps": true, "advancedFilters": true, "whatsappButton": true}'
) ON CONFLICT (slug) DO NOTHING;

-- ─── 2. PROPERTY_IMAGES ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS property_images (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id    UUID        NOT NULL REFERENCES tenants(id),
  url          TEXT        NOT NULL,   -- public URL from Supabase Storage
  path         TEXT        NOT NULL,   -- storage path: {tenant_slug}/{property_slug}/{filename}
  is_cover     BOOLEAN     NOT NULL DEFAULT false,
  order_index  INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast property lookups
CREATE INDEX IF NOT EXISTS idx_property_images_property_id
  ON property_images (property_id);

CREATE INDEX IF NOT EXISTS idx_property_images_tenant_id
  ON property_images (tenant_id);

-- Enforce a single cover image per property at the DB level
CREATE UNIQUE INDEX IF NOT EXISTS property_images_one_cover_per_property
  ON property_images (property_id)
  WHERE is_cover = true;

-- ─── 3. RLS POLICIES ────────────────────────────────────────────────────────

-- tenants: public read (needed for TenantProvider to resolve config)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenants_public_read"
  ON tenants FOR SELECT
  USING (true);

-- property_images: public read, authenticated write
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_images_public_read"
  ON property_images FOR SELECT
  USING (true);

CREATE POLICY "property_images_auth_write"
  ON property_images FOR ALL
  USING (auth.role() = 'authenticated');
