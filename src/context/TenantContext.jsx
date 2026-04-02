import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useThemeStore } from '../store/themeStore'

const TenantContext = createContext(null)

// 1. CONFIGURACIÓN MAESTRA (Hardcoded para evitar pantallas en blanco)
const MASTER_DOMAINS = [
  'zendoapp.es',
  'www.zendoapp.es',
  'zendo-saa-s.vercel.app' // Tu URL de Vercel
];

const MASTER_IDENTITY = {
  id: 'master-zendo',
  slug: 'zendo',
  name: 'Zendo',
  isMaster: true,
  primary_color: '#2563eb', // Tu azul corporativo
  secondary_color: '#64748b',
  description: 'La plataforma definitiva para la gestión inmobiliaria moderna.',
  browser_title: 'Zendo - SaaS Inmobiliario y CRM para inmobiliarias',
  features: { isDemo: false }
};

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Actualizador de metadatos reactivo
  useEffect(() => {
    if (!tenant) return;

    // Prioridad: 1. browser_title | 2. Default Master | 3. Default Agency
    const pageTitle = tenant.browser_title 
      ? tenant.browser_title 
      : (tenant.isMaster ? 'Zendo - SaaS Inmobiliario' : `${tenant.name} - Real Estate`);
    
    document.title = pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && tenant.description) {
      metaDesc.setAttribute('content', tenant.description);
    }

    // Actualizador de Favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = tenant.isMaster ? '/zendo-logo.png' : '/favicon.ico'; // O /logo.png si prefieres
  }, [tenant]);

  useEffect(() => {
    async function resolveTenant() {
      const hostname = window.location.hostname;
      const params = new URLSearchParams(window.location.search);
      const tenantSlugParam = params.get('tenant'); // Para pruebas: ?tenant=parque-sierra

      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
      const isMasterProd = MASTER_DOMAINS.includes(hostname);

      // Determinamos si debemos cargar la identidad de Zendo (Landing)
      // Es Master si estamos en el dominio oficial o si estamos en local sin parámetros de inquilino.
      const shouldShowMaster = isMasterProd || (isLocal && !tenantSlugParam);

      try {
        // --- PASO 1: CARGA INMEDIATA DE IDENTIDAD MAESTRA (Si aplica) ---
        if (shouldShowMaster) {
          setTenant(MASTER_IDENTITY);
          // Aplicamos tema inicial para evitar flash de colores incorrectos
          useThemeStore.getState().initFromTenant('MINIMAL', '#2563eb', '#64748b');
          setLoading(false);
          // Nota: No retornamos aquí, seguimos para intentar "hidratar" desde la DB
        }

        // --- PASO 2: CONSULTA A SUPABASE ---
        let query = supabase.from('tenants').select('*');

        if (isLocal && tenantSlugParam) {
          // En local con parámetro -> Buscamos por SLUG
          query = query.eq('slug', tenantSlugParam);
        } else if (shouldShowMaster) {
          // Si es Master -> Buscamos la fila 'zendo' para refrescar datos (colores, descripciones...)
          query = query.eq('slug', 'zendo');
        } else {
          // En producción para clientes -> Buscamos por DOMINIO PERSONALIZADO
          query = query.eq('custom_domain', hostname);
        }

        const { data, error: dbError } = await query.single();

        // --- MANEJO DE ERRORES DE BÚSQUEDA ---
        if (dbError || !data) {
          // Si NO es master y la DB falla, mostramos error (inquilino no existe)
          if (!shouldShowMaster) {
            console.error('[TenantProvider] Error:', dbError?.message);
            setError('Esta inmobiliaria no está registrada o el dominio es incorrecto.');
            setLoading(false);
            return;
          }
          // Si ES master y la DB falla, no pasa nada: ya tenemos la MASTER_IDENTITY cargada.
          return;
        }

        // --- PASO 3: APLICAR DATOS FINALES (HIDRATACIÓN) ---
        const finalTenant = {
          ...data,
          isMaster: !!data.is_master || shouldShowMaster
        };

        setTenant(finalTenant);

        // Actualizamos el almacén de temas con los datos de la DB
        const { initFromTenant } = useThemeStore.getState();
        initFromTenant(
          data.theme ?? 'MINIMAL',
          data.primary_color ?? (shouldShowMaster ? '#2563eb' : '#23c698'),
          data.secondary_color ?? '#64748b',
        );

        setLoading(false);
      } catch (e) {
        console.error('[TenantProvider] Critical Error:', e);
        if (!shouldShowMaster) setError('Error crítico al cargar la configuración.');
        setLoading(false);
      }
    }

    resolveTenant();
  }, []);

  // Solo bloqueamos el render si estamos cargando y NO tenemos ni siquiera la identidad maestra
  if (loading && !tenant) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div className="animate-spin" style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '3px solid #e2e8f0', borderTopColor: '#2563eb',
          animation: 'tz-spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes tz-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#1e293b' }}>404</h1>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 16 }}>{error}</p>
          <a href="https://zendoapp.es" style={{ marginTop: 24, display: 'inline-block', color: '#2563eb', fontWeight: '600' }}>
            Ir a la página principal de Zendo
          </a>
        </div>
      </div>
    )
  }

  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext);
  return context;
}