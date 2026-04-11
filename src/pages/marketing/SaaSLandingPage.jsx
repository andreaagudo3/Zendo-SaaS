import React from 'react';
import { useTranslation } from 'react-i18next';
import PricingSection from '../../components/marketing/pricing/PricingSection';

/**
 * SaaSLandingPage — The B2B marketing landing for Zendo.
 * Features: Hero section, Features grid, and simple Pricing.
 */
export default function SaaSLandingPage() {
    const { t } = useTranslation();
    // Demo URL: computed once, no DB needed.
    // Local  → http://localhost:5173/?tenant=demo
    // Prod   → https://demo.zendoapp.es  (subdomain, no query params)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const demoUrl = isLocal
        ? `${window.location.origin}/?tenant=demo`
        : 'https://demo.zendoapp.es';


    return (
        <div className="bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* 1. EL GANCHO (Hero Section) */}
            <section className="relative pt-16 pb-20 overflow-hidden bg-white">
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
                </div>
            </section>

            {/* 2. LA PRUEBA DE VIDA (Live Demo) */}
            <section className="pb-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            </section>

            {/* 3. EL "DOLOR" (Zendo vs WordPress) — Card Layout */}
            {/*
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-6 tracking-tight">Zendo vs. WordPress</h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                            Compara la tecnología del futuro frente a las soluciones del pasado. <br className="hidden md:block" />
                            Elige el motor que impulsará tu negocio inmobiliario.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Zendo Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100%] transition-transform group-hover:scale-150" />

                            <div className="min-h-[12rem]">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>

                                <h3 className="text-3xl font-black text-slate-900 mb-2">Zendo</h3>
                                <p className="text-slate-500 mb-6 font-medium italic">Tecnología React 19 + Supabase RLS de alto rendimiento.</p>
                            </div>

                            <div className="space-y-0 text-sm md:text-base flex-1">
                                {[
                                    { label: 'Velocidad de carga', value: 'Instantánea (<1s)' },
                                    { label: 'Arquitectura de seguridad', value: 'RLS (Blindada)' },
                                    { label: 'Mantenimiento técnico', value: 'Cero (Nos encargamos)' },
                                    { label: 'Panel de gestión', value: 'Intuitivo y Moderno' },
                                    { label: 'Escalabilidad', value: 'SaaS Nativo' },
                                    { label: 'Actualizaciones de por vida', check: true }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors min-h-[3.5rem]">
                                        <span className="font-semibold text-slate-700">{item.label}</span>
                                        {item.check ? (
                                            <svg className="w-6 h-6 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <span className="font-extrabold text-blue-600 text-right ml-4">{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WordPress Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm opacity-80 hover:opacity-100 transition-opacity flex flex-col">
                            <div className="min-h-[12rem]">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-6 border border-slate-200">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>

                                <h3 className="text-3xl font-black text-slate-900 mb-2">WordPress</h3>
                                <p className="text-slate-500 mb-6 font-medium italic">Sistemas basados en PHP y plugins de terceros.</p>
                            </div>

                            <div className="space-y-0 text-sm md:text-base flex-1">
                                {[
                                    { label: 'Velocidad de carga', value: 'Lenta (3s - 8s)' },
                                    { label: 'Arquitectura de seguridad', value: 'Vulnerable a Plugins' },
                                    { label: 'Mantenimiento técnico', value: 'Actualizaciones constantes' },
                                    { label: 'Panel de gestión', value: 'Complejo y Rígido' },
                                    { label: 'Escalabilidad', value: 'Limitada por Plantilla' },
                                    { label: 'Actualizaciones de por vida', check: false }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 min-h-[3.5rem]">
                                        <span className="font-semibold text-slate-700">{item.label}</span>
                                        {typeof item.check === 'boolean' ? (
                                            item.check ? (
                                                <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            )
                                        ) : (
                                            <span className="font-bold text-slate-400 text-right ml-4">{item.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            */}

            {/* 4. LA SOLUCIÓN (CRM + Features) */}
            <section id="features" className="py-20 bg-white">
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

            {/* 5. LAS TARIFAS (Pricing Component) */}
            <PricingSection />



            {/* 6. MÓDULOS "A LA CARTA" (Add-ons) */}
            <section className="py-20 bg-white border-t border-slate-100">
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

            {/* 7. EL CIERRE (CTA Final) */}
            <section className="py-28 bg-slate-950 text-white text-center relative overflow-hidden">
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
