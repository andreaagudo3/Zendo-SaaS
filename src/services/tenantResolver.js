import { supabase } from './supabaseClient'

/**
 * resolveTenantConfig
 * 
 * Resolves which TENANT should be active for PUBLIC routes only.
 * Admin routes resolve their identity via auth session (see TenantContext).
 *
 * Priority:
 *  1. Local dev  → ?tenant=<slug> param  (fallback: master identity)
 *  2. Production → subdomain (demo.zendoapp.es → slug "demo")
 *  3. Production → custom domain (inmobiliaria.es)
 *  4. Production → master domains (zendoapp.com/es)  → master identity
 *
 * @param {string} hostname
 * @param {URLSearchParams} params
 * @returns {Promise<{ data: object|null, isMaster: boolean, error: string|null }>}
 */
export async function resolveTenantConfig(hostname, params) {
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')

  const MASTER_DOMAINS = [
    'zendoapp.com', 'www.zendoapp.com',
    'zendoapp.es',  'www.zendoapp.es',
  ]
  const isMasterDomain = MASTER_DOMAINS.includes(hostname)
  const isZendoSubdomain = hostname.endsWith('.zendoapp.com') || hostname.endsWith('.zendoapp.es')
  const isSubdomain = isZendoSubdomain && !isMasterDomain

  // ── LOCAL ──────────────────────────────────────────────────────────────────
  if (isLocal) {
    const slug = params.get('tenant')
    if (!slug) return { data: null, isMaster: true, error: null }
    return fetchBySlug(slug)
  }

  // ── MASTER PRODUCTION DOMAIN ───────────────────────────────────────────────
  if (isMasterDomain) {
    return { data: null, isMaster: true, error: null }
  }

  // ── SUBDOMAIN (demo.zendoapp.es) ───────────────────────────────────────────
  if (isSubdomain) {
    const slug = hostname.split('.')[0]
    return fetchBySlug(slug)
  }

  // ── CUSTOM DOMAIN ──────────────────────────────────────────────────────────
  return fetchByCustomDomain(hostname)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return { data: null, isMaster: false, error: `Inmobiliaria "${slug}" no encontrada.` }
    }
    return { data, isMaster: data.slug === 'zendo', error: null }
  } catch (err) {
    console.error('[tenantResolver] fetchBySlug:', err)
    return { data: null, isMaster: false, error: 'Error de conexión.' }
  }
}

async function fetchByCustomDomain(domain) {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('custom_domain', domain)
      .single()

    if (error || !data) {
      return { data: null, isMaster: false, error: `Dominio "${domain}" no registrado en el sistema.` }
    }
    return { data, isMaster: false, error: null }
  } catch (err) {
    console.error('[tenantResolver] fetchByCustomDomain:', err)
    return { data: null, isMaster: false, error: 'Error de conexión.' }
  }
}
