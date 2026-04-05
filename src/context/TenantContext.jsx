import { createContext, useContext, useEffect, useState } from 'react'
import { useThemeStore } from '../store/themeStore'
import TenantNotFound from '../pages/error/TenantNotFound'
import { resolveTenantConfig } from '../services/tenantResolver'
import { supabase } from '../services/supabaseClient'

const TenantContext = createContext(null)

/**
 * MASTER IDENTITY — Used as fallback when no specific tenant is resolved.
 * This is the Zendo SaaS marketing identity, not a real DB record.
 */
const MASTER_IDENTITY = {
  id: 'master-zendo',
  slug: 'zendo',
  name: 'Zendo',
  isMaster: true,
  primary_color: '#2563eb',
  secondary_color: '#64748b',
  features: { isDemo: false },
}

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Reactive meta updater: title, description, favicon
  useEffect(() => {
    if (!tenant) return
    document.title = tenant.meta_title || (tenant.isMaster ? 'Zendo - SaaS Inmobiliario' : `${tenant.name} - Real Estate`)
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && tenant.description) metaDesc.setAttribute('content', tenant.description)
    let favicon = document.querySelector('link[rel="icon"]')
    if (!favicon) { favicon = document.createElement('link'); favicon.rel = 'icon'; document.head.appendChild(favicon) }
    favicon.href = tenant.isMaster ? '/zendo-logo.png' : '/favicon.ico'
  }, [tenant])

  useEffect(() => {
    async function resolve() {
      const isAdminPath = window.location.pathname.startsWith('/admin') || window.location.pathname === '/login'

      // ══════════════════════════════════════════════════════════════════════
      // PATH A — ADMIN: identity comes exclusively from the auth session.
      //   The URL is irrelevant for identity in admin routes.
      // ══════════════════════════════════════════════════════════════════════
      if (isAdminPath) {
        try {
          const { data: { session } } = await supabase.auth.getSession()

          if (!session?.user) {
            // No session — render nothing (ProtectedRoute will redirect to /login)
            setLoading(false)
            return
          }

          // Look up which tenant this user belongs to
          const { data: memberData } = await supabase
            .from('members')
            .select('tenant_id')
            .eq('user_id', session.user.id)
            .maybeSingle()

          if (memberData?.tenant_id) {
            const { data: tenantData } = await supabase
              .from('tenants')
              .select('*')
              .eq('id', memberData.tenant_id)
              .single()

            if (tenantData) {
              applyTenant(tenantData, tenantData.slug === 'zendo')
              return
            }
          }

          // Member has no tenant assignment — show master as fallback
          applyTenant(null, true)
        } catch (err) {
          console.error('[TenantContext] Admin resolution error:', err)
          setError('Error de conexión al cargar el panel.')
        } finally {
          setLoading(false)
        }
        return
      }

      // ══════════════════════════════════════════════════════════════════════
      // PATH B — PUBLIC: identity comes exclusively from the URL / hostname.
      //   No auth calls. Fast and clean.
      // ══════════════════════════════════════════════════════════════════════
      try {
        const hostname = window.location.hostname
        const params = new URLSearchParams(window.location.search)

        const result = await resolveTenantConfig(hostname, params)

        if (result.error) {
          setError(result.error)
          return
        }

        if (result.data) {
          applyTenant(result.data, result.isMaster)
        } else {
          // Master identity (Zendo SaaS landing)
          applyTenant(null, true)
        }
      } catch (err) {
        console.error('[TenantContext] Public resolution error:', err)
        setError('Error de conexión al cargar el sitio.')
      } finally {
        setLoading(false)
      }
    }

    resolve()
  }, [])

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function applyTenant(data, isMaster) {
    if (!data) {
      setTenant(MASTER_IDENTITY)
      useThemeStore.getState().initFromTenant('MINIMAL', '#2563eb', '#64748b')
      return
    }
    const finalTenant = {
      ...data,
      isMaster,
      isDemoMode: !!data.features?.isDemo,
    }
    setTenant(finalTenant)
    useThemeStore.getState().initFromTenant(
      data.theme ?? 'MINIMAL',
      data.primary_color ?? (isMaster ? '#2563eb' : '#23c698'),
      data.secondary_color ?? '#64748b'
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading && !tenant) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', animation: 'tz-spin 0.8s linear infinite' }} />
        <style>{`@keyframes tz-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error && !tenant) return <TenantNotFound />

  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  return useContext(TenantContext)
}