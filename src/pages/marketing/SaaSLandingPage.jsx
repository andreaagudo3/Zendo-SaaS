import React from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../services/supabaseClient';

/**
 * SaaSLandingPage — The B2B marketing landing for Zendo.
 * Features: Hero section, Features grid, and simple Pricing.
 */
export default function SaaSLandingPage() {
  const { t } = useTranslation();

  const [demoUrl, setDemoUrl] = React.useState('https://parquesierra.zendo.com'); // Fallback

  React.useEffect(() => {
    async function fetchDemoTenant() {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('custom_domain, slug')
          .eq('is_demo', true)
          .limit(1)
          .maybeSingle();

        if (data) {
          const url = data.custom_domain 
            ? `https://${data.custom_domain}` 
            : `${window.location.origin}?tenant=${data.slug}`; // Local compatibility
          setDemoUrl(url);
        }
      } catch (err) {
        console.error('Error fetching demo tenant:', err);
      }
    }
    fetchDemoTenant();
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ── Hero Section ── */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-8 border border-blue-100 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t('marketing.hero.badge', 'Listas en solo 7 días')}
          </div>
          
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight text-slate-950 mb-8 leading-[1.1]">
            Webs inmobiliarias de <br className="hidden md:block" />
            <span className="text-blue-600">alto rendimiento</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed italic">
            Sin WordPress ni esperas. Tu web inmobiliaria con un panel de gestión tan fácil como usar Instagram: sube casas y cierra ventas en segundos.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="w-full sm:w-auto px-10 py-5 bg-slate-950 text-white rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-blue-200/50 transform hover:-translate-y-1">
              Empezar ahora
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all shadow-sm">
              Ver planes
            </button>
          </div>
          
          {/* ── Live Demo Section (Moved Up) ── */}
          <div className="mt-20">
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl text-left">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold mb-6 border border-blue-500/20">
                    Prueba el producto final
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 italic tracking-tight leading-tight">
                    No te lo imagines. <br /> 
                    <span className="text-blue-500 text-glow">Pruébalo ahora.</span>
                  </h2>
                  <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-md">
                    Entra en nuestra inmobiliaria de pruebas. Navega, filtra y experimenta la velocidad real que tendrán tus clientes. 
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 text-white rounded-2xl font-extrabold text-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 hover:scale-105"
                    >
                      🚀 Probar la web ahora
                      <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
                </div>
                
                <div className="relative group flex justify-center lg:justify-end">
                  <div className="absolute -inset-4 bg-blue-500/20 rounded-[2rem] blur-2xl group-hover:bg-blue-500/30 transition-all duration-700" />
                  <div className="relative rounded-[2rem] border border-white/10 bg-slate-800 p-2 shadow-2xl overflow-hidden transform md:rotate-2 hover:rotate-0 transition-transform duration-500 max-w-md lg:max-w-none">
                    <img 
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                      alt="Demo Preview" 
                      className="w-full rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-2xl font-bold animate-pulse text-sm">LIVE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Por qué Zendo (Features) ── */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                title: 'Velocidad Rayo',
                desc: 'Carga en menos de 1s. Google amará tu web y tus clientes no esperarán.',
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                color: 'blue'
              },
              {
                title: 'Panel "Para Humanos"',
                desc: 'Olvídate de WordPress. Nuestro panel es tan fácil que no requiere formación.',
                icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
                color: 'indigo'
              },
              {
                title: 'Arquitectura Moderna',
                desc: 'React 19 + Supabase. La tecnología de Silicon Valley en tu negocio.',
                icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
                color: 'purple'
              },
              {
                title: 'En 7 días Vendes',
                desc: 'El lunes empezamos, el domingo tienes tu web volando.',
                icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                color: 'green'
              }
            ].map((arg, i) => (
              <div key={i} className="group">
                <div className={`w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 border border-slate-100 text-${arg.color}-600`}>
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={arg.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{arg.title}</h3>
                <p className="text-slate-600 leading-relaxed">{arg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-6 italic">Tarifas Zendo 2026</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto italic mb-8">"No es solo una web, es tu propia casa digital sin intermediarios."</p>
            
            {/* Escalabilidad Sticker (Visible near title) */}
            <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl border border-blue-100 font-bold text-sm shadow-sm animate-soft-float cursor-default group transition-shadow hover:shadow-md">
              <span className="text-xl group-hover:rotate-12 transition-transform">📈</span>
              Paga solo la diferencia si subes de plan en el futuro. Protegemos tu inversión.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16 relative">
            {/* PLAN PRO */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Agente Independiente</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">PLAN PRO</h3>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-slate-950">850€</span>
                <span className="text-slate-500 text-sm font-medium ml-2">Setup único</span>
              </div>
              <div className="mb-8 border-b border-slate-100 pb-6 font-semibold">
                <span className="text-2xl font-bold text-slate-950">49€</span>
                <span className="text-slate-500 text-sm">/mes</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm leading-relaxed">
                {[
                  'Límite: Hasta 30 propiedades',
                  'CRM / Panel Admin Completo',
                  'Contacto via Email Directo',
                  '1 Idioma (Español)',
                  'Ubicación Maps: No incluido',
                  '1 Tema UI a elegir (Fijo)',
                  'Filtros: Precio / Tipo / Zona'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 px-6 border-2 border-slate-900 text-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all">Seleccionar PRO</button>
            </div>

            {/* PLAN BUSINESS */}
            <div className="bg-slate-950 rounded-3xl p-8 shadow-2xl relative lg:-translate-y-8 border-4 border-blue-500 ring-8 ring-blue-500/10">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest leading-relaxed">Más vendido ⭐ Agencia Pro</div>
              <h3 className="text-2xl font-bold text-white mb-2">PLAN BUSINESS</h3>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">1.590€</span>
                <span className="text-slate-400 text-sm font-medium ml-2">Setup único</span>
              </div>
              <div className="mb-8 border-b border-white/10 pb-6 font-semibold">
                <span className="text-2xl font-bold text-white">79€</span>
                <span className="text-slate-400 text-sm">/mes</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm leading-relaxed">
                {[
                  'Límite: Hasta 120 propiedades',
                  'CRM / Panel Admin Completo',
                  'Contacto via Email + WhatsApp',
                  '2 Idiomas (Español / Inglés)',
                  'Link a Google Maps incluido',
                  'Acceso a los 3 Temas UI',
                  'Filtros: + Hab / m² / Estado'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-200">
                    <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span className="font-semibold">{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">Impulsar mi Negocio</button>
            </div>

            {/* PLAN ENTERPRISE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Líderes del Mercado</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">PLAN ENTERPRISE</h3>
              <div className="mb-2">
                <span className="text-inline font-medium text-slate-500 mr-1">Desde</span>
                <span className="text-4xl font-extrabold text-slate-950">2.900€</span>
                <span className="text-slate-500 text-xs font-medium ml-1">Setup</span>
              </div>
              <div className="mb-8 border-b border-slate-100 pb-6 font-semibold">
                <span className="text-2xl font-bold text-slate-950">149€</span>
                <span className="text-slate-500 text-sm">/mes</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm leading-relaxed">
                {[
                  'Límite: Hasta 500 propiedades',
                  'CRM / Panel Admin Completo',
                  'Full Integración de Contacto',
                  'Multi-idioma (Hasta 4)',
                  'Link a Google Maps incluido',
                  'Acceso a los 3 Temas UI',
                  'Filtros: Gestión Total'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 px-6 border-2 border-slate-900 text-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all">Hablar con Ventas</button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-24">
            <div className="bg-blue-50 py-6 px-8 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden group">
              <p className="text-blue-900 text-sm md:text-base font-semibold italic leading-relaxed relative z-10 transition-transform group-hover:-translate-y-0.5 duration-300">
                <span className="font-extrabold uppercase mr-2 tracking-wider block mb-1">🛡️ Actualizaciones de por vida:</span>
                Todos los planes incluyen actualizaciones de seguridad y mejoras de la plataforma para siempre. <span className="text-blue-600 font-bold underline decoration-blue-200">Tu activo digital nunca envejece.</span>
              </p>
            </div>
          </div>

          {/* ── Comparativa Zendo vs WordPress ── */}
          <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-slate-50/50">
            <div className="bg-slate-900 text-white px-8 py-6 text-center">
              <h3 className="text-2xl font-bold">Zendo vs WordPress</h3>
              <p className="text-slate-400 text-sm">Compara la calidad de tu activo digital</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-8 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Concepto</th>
                    <th className="px-8 py-4 text-sm font-bold text-blue-600 uppercase tracking-wider bg-blue-50/50">Zendo</th>
                    <th className="px-8 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">WordPress / Otros</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {[
                    ['Velocidad de carga', '< 1s (Instantánea)', '3s - 8s (Lenta)'],
                    ['Seguridad', 'Arquitectura RLS (Blindada)', 'Vulnerable a plugins/scripts'],
                    ['Mantenimiento', 'Cero (Nos encargamos)', 'Requiere actualizaciones constantes'],
                    ['Panel de gestión', 'Intuitivo y Moderno', 'Complejo y fácil de romper'],
                    ['Escalabilidad', 'SaaS Nativo', 'Limitada por la plantilla']
                  ].map(([label, iz, wp], i) => (
                    <tr key={i} className="hover:bg-white transition-colors">
                      <td className="px-8 py-4 font-semibold text-slate-900">{label}</td>
                      <td className="px-8 py-4 text-blue-700 font-bold bg-blue-50/30">{iz}</td>
                      <td className="px-8 py-4 text-slate-500 italic">{wp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Módulos A la Carta (Add-ons) ── */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 italic">💎 Módulos "A la Carta" (Add-ons)</h2>
          <p className="text-slate-600 mb-12 max-w-3xl mx-auto">¿Necesitas algo específico del plan superior pero quieres mantener tu cuota actual? <br className="hidden md:block" /> Puedes contratar funcionalidades sueltas:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: 'WhatsApp Pro', price: '120€', desc: 'Botón con mensaje de referencia automática.', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
              { name: 'Google Maps', price: '60€', desc: 'Link externo directo en todas tus fichas.', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
              { name: 'Localidades', price: '200€', desc: 'Gestión avanzada del árbol de ubicaciones.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
              { name: 'Idioma i18n', price: '250€', desc: 'Configuración manual de lengua extra.', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.337 8.07 16.51 3 18.129' },
              { name: 'Catálogo', price: '350€', desc: 'Migración de tus 30 primeras propiedades.', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                </div>
                <h4 className="font-bold text-base text-slate-900 mb-1 tracking-tight">{s.name}</h4>
                <p className="text-blue-600 font-extrabold text-xl mb-3">{s.price}</p>
                <p className="text-xs text-slate-500 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-40 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[160px] opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-[160px] opacity-20 translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-10 italic tracking-tight">¿Hablamos sobre <br /> tu nueva web?</h2>
          <p className="text-xl md:text-2xl text-slate-400 mb-16 leading-relaxed max-w-3xl mx-auto italic">
            Únete a la nueva era digital. Tendrás tu inmobiliaria volando en menos de una semana, con el diseño que más te guste y un panel de control tan fácil que no necesitarás manuales.
          </p>
          <div className="flex flex-col items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-16 py-7 bg-white text-slate-950 rounded-[2rem] font-black text-2xl hover:bg-blue-50 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95">
              Quiero informarme gratis
            </button>
            <p className="text-slate-400 font-medium italic text-lg">
              Te enseñamos cómo pasar tus casas de tu viejo WordPress a Zendo en una llamada de 15 minutos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
