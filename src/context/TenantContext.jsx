/**
 * TenantContext.jsx — Multi-tenant resolution and global provider.
 *
 * On every page load:
 *   1. Reads window.location.hostname
 *   2. Fetches the matching tenant row from Supabase (tenants table)
 *   3. Seeds the themeStore with tenant branding (injecting CSS variables)
 *   4. Updates <title> and <meta description>
 *   5. Blocks the app from rendering until tenant is ready
 *
 * Usage:
 *   const tenant = useTenant()
 *   tenant.name, tenant.email, tenant.phones, tenant.primary_color, …
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useThemeStore } from '../store/themeStore'

const TenantContext = createContext(null)

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function resolveTenant() {
      const hostname = window.location.hostname;
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

      let query = supabase.from('tenants').select('*');

      if (isLocal) {
        // --- LÓGICA PARA LOCALHOST ---
        const params = new URLSearchParams(window.location.search);
        const tenantSlug = params.get('tenant');

        if (tenantSlug) {
          // Si entras a localhost:5173?tenant=parque-sierra -> busca ese slug
          query = query.eq('slug', tenantSlug);
        } else {
          // POR DEFECTO EN LOCAL: Cargamos la Landing (Zendo)
          // Así, entrar a localhost:5173 es entrar a zendo.com
          query = query.eq('slug', 'zendo'); 
        }
      } else {
        // --- LÓGICA PARA PRODUCCIÓN ---
        // Aquí manda el dominio que haya en la barra de direcciones
        query = query.eq('custom_domain', hostname);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        console.error('[TenantProvider] Could not resolve tenant:', error?.message)
        setError('No se pudo cargar la configuración del sitio.')
        setLoading(false)
        return
      }

      // Seed the theme store — injects CSS variables and overwrites any
      // stale DemoPanel values from sessionStorage.
      const { initFromTenant } = useThemeStore.getState()
      initFromTenant(
        data.theme ?? 'MINIMAL',
        data.primary_color ?? '#23c698',
        data.secondary_color ?? '#64748b',
      )

      // Update page metadata
      if (data.name) {
        document.title = `${data.name} - Real Estate`
      }
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc && data.description) {
        metaDesc.setAttribute('content', data.description)
      }

      // Add isMaster convenience flag
      setTenant({
        ...data,
        isMaster: !!data.is_master
      })
      setLoading(false)
    }

    resolveTenant()
  }, [])

  if (loading) {
    // Inline styles: CSS variables may not be injected yet at this point.
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '3px solid #e2e8f0', borderTopColor: '#23c698',
          animation: 'tz-spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes tz-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontSize: 14 }}>{error}</p>
      </div>
    )
  }

  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  )
}

/**
 * useTenant — returns the current tenant object from context.
 *
 * Guaranteed to be non-null inside TenantProvider
 * (the provider blocks render until resolved).
 *
 * @returns {{
 *   id: string, slug: string, name: string, full_name: string,
 *   tagline: string, description: string,
 *   primary_color: string, secondary_color: string, theme: string,
 *   zone: string, province: string, country: string, address: string,
 *   email: string, phones: Array<{number: string, href: string}>,
 *   socials: Array<{name: string, href: string}>,
 *   features: object,
 *   isMaster: boolean,
 * }}
 */
export function useTenant() {
  return useContext(TenantContext)
}
