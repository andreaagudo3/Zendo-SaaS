import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * SaaSLandingPage — The B2B marketing landing for InmoZen.
 * Features: Hero section, Features grid, and simple Pricing.
 */
export default function SaaSLandingPage() {
  const { t } = useTranslation();

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
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            {t('marketing.hero.subtitle', 'Sin la lentitud de WordPress. Tecnología React + Supabase para inmobiliarias que quieren vender más y rápido.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="w-full sm:w-auto px-10 py-5 bg-slate-950 text-white rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-blue-200/50 transform hover:-translate-y-1">
              {t('marketing.hero.cta_primary', 'Empezar ahora')}
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all shadow-sm">
              {t('marketing.hero.cta_secondary', 'Ver planes')}
            </button>
          </div>
          
          <div className="mt-20 relative max-w-6xl mx-auto">
            <div className="relative rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(8,112,184,0.12)] overflow-hidden">
               <div className="bg-slate-50 rounded-2xl aspect-[16/10] md:aspect-[21/9] flex items-center justify-center border border-slate-100 overflow-hidden">
                 <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200" 
                    alt="Modern Real Estate Interface" 
                    className="w-full h-full object-cover opacity-90 transition-transform hover:scale-105 duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Por qué InmoZen ── */}
      <section id="features" className="py-32 bg-slate-50">
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
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-6 italic">Tarifas InmoZen 2026</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto italic">"No es solo una web, es tu propia casa digital sin intermediarios."</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
            {/* PLAN ESTÁNDAR */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Agente Local Top</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">ESTÁNDAR (Pro)</h3>
              <p className="text-slate-500 mb-6 text-sm italic line-clamp-2">Ideal para consolidar tu marca en tu zona de influencia.</p>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-slate-950">850€</span>
                <span className="text-slate-500 text-sm font-medium ml-2">Setup único</span>
              </div>
              <div className="mb-8 border-b border-slate-100 pb-6 font-semibold">
                <span className="text-2xl font-bold text-slate-950 font-sans tracking-tight">49€</span>
                <span className="text-slate-500 text-sm">/mes</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm leading-relaxed">
                {[
                  '1 Estilo de diseño (Fijo)',
                  'Idioma: Solo Español (ES)',
                  'Catálogo hasta 100 propiedades',
                  'Google Maps (Link Externo)',
                  'SEO Estándar (Metas Dinámicas)',
                  'Panel Admin InmoZen Core',
                  'WhatsApp Direct Trazable'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 px-6 border-2 border-slate-900 text-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all">Empezar Ahora</button>
            </div>

            {/* PLAN CRECIMIENTO */}
            <div className="bg-slate-950 rounded-3xl p-8 shadow-2xl relative lg:-translate-y-8 border-4 border-blue-500 ring-8 ring-blue-500/10">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest leading-relaxed">Más vendido ⭐ Agencia Internacional</div>
              <h3 className="text-2xl font-bold text-white mb-2">CRECIMIENTO (Business)</h3>
              <p className="text-slate-400 mb-6 text-sm italic">El estándar para quienes buscan captar cliente extranjero.</p>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">1.590€</span>
                <span className="text-slate-400 text-sm font-medium ml-2">Setup único</span>
              </div>
              <div className="mb-8 border-b border-white/10 pb-6 font-semibold">
                <span className="text-2xl font-bold text-white font-sans tracking-tight">79€</span>
                <span className="text-slate-400 text-sm">/mes</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm leading-relaxed">
                {[
                  'Los 3 Estilos (Intercambiables)',
                  'Multi-idioma (ES+EN Auto-detection)',
                  'Avanzado por Localidades (SEO)',
                  'Filtros dinámicos m² / Habitaciones',
                  'Google Maps (Link Externo)',
                  'Soporte técnico preferencial',
                  'Actualizaciones automáticas'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-200">
                    <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">Mejorar mi Agencia</button>
            </div>

            {/* PLAN LÍDER */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Dominio Total del Mercado</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">LÍDER (Enterprise)</h3>
              <p className="text-slate-500 mb-6 text-sm italic line-clamp-2">Para inmobiliarias líderes que necesitan potencia bruta y datos.</p>
              <div className="mb-2">
                <span className="text-inline font-medium text-slate-500 mr-1">Desde</span>
                <span className="text-4xl font-extrabold text-slate-950">2.900€</span>
                <span className="text-slate-500 text-xs font-medium ml-1">Setup</span>
              </div>
              <div className="mb-8 border-b border-slate-100 pb-6 font-semibold">
                <span className="text-2xl font-bold text-slate-950 font-sans tracking-tight">149€</span>
                <span className="text-slate-500 text-sm">/mes</span>
              </div>
              <ul className="space-y-4 mb-10 text-sm leading-relaxed">
                {[
                  'Personalización UI (Look & Feel)',
                  'Multi-idioma (IA Ilimitada)',
                  'Mapa Interactivo Integrado (vía API)',
                  'Estrategia de Contenidos (Blog)',
                  'Módulo Senior de Leads / CRM',
                  'Soporte Priority (< 4h)',
                  'Garantía de Evolución de por vida'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 px-6 border-2 border-slate-900 text-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all">Consolidar Mi Imperio</button>
            </div>
          </div>

          <div className="text-center bg-blue-50 py-4 px-6 rounded-2xl border border-blue-100 max-w-2xl mx-auto mb-24">
            <p className="text-blue-900 text-sm font-medium italic">
              "Todos los planes incluyen actualizaciones de seguridad y mejoras de la plataforma de por vida."
            </p>
          </div>

          {/* ── Comparativa InmoZen vs WordPress ── */}
          <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-slate-50/50">
            <div className="bg-slate-900 text-white px-8 py-6 text-center">
              <h3 className="text-2xl font-bold">InmoZen vs WordPress</h3>
              <p className="text-slate-400 text-sm">Compara la calidad de tu activo digital</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-8 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Concepto</th>
                    <th className="px-8 py-4 text-sm font-bold text-blue-600 uppercase tracking-wider bg-blue-50/50">InmoZen</th>
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

      {/* ── Upselling ── */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Aumenta tu impacto con servicios de valor</h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">Soluciones personalizadas para que tú solo te preocupes de vender.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { name: 'Migración de Catálogo', price: '350€', desc: 'Pasamos tus inmuebles de tu vieja web a InmoZen sin que muevas un dedo.' },
              { name: 'Formación Admin Pro', price: '150€', desc: '1h por Zoom enseñándote a optimizar fotos y textos para convertir visitas en leads.' },
              { name: 'Pack Dominio Blindado', price: '60€/año', desc: 'Gestión total de dominios y correos prof. bajo nuestra infraestructura segura.' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition-all group">
                <h4 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{s.name}</h4>
                <p className="text-blue-600 font-extrabold text-2xl mb-4">Desde {s.price}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-32 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 italic">¿Listo para transformar tu inmobiliaria?</h2>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed">Únete a la nueva era digital con InmoZen. Tu web estará volando en menos de una semana.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-2xl font-bold text-2xl hover:bg-slate-100 transition-all shadow-2xl hover:scale-105">
              Crear mi cuenta ahora
            </button>
            <a href="tel:+34900000000" className="text-white font-medium hover:text-blue-400 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Hablar con un experto
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
