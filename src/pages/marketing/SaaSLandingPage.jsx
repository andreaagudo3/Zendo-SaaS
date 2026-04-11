import React from 'react';
import { useTranslation } from 'react-i18next';
import PricingSection from '../../components/marketing/pricing/PricingSection';

/**
 * SaaSLandingPage — The B2B marketing landing for Zendo.
 * Features: Hero section, Features grid, and simple Pricing.
 */
export default function SaaSLandingPage() {
    const { t } = useTranslation(['marketing']);

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const demoUrl = isLocal
        ? `${window.location.origin}/?tenant=demo`
        : 'https://demo.zendoapp.es';

    return (
        <div className="bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

            {/* 1. HERO — The Lead Gen System */}
            <section className="relative pt-24 pb-32 overflow-hidden bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-3xl opacity-60" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-10 border border-blue-100/50">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        {t('marketing:hero.badge', 'Listas en solo 7 días')}
                    </div>

                    <h1 className="text-5xl md:text-[5.5rem] font-extrabold tracking-tight text-slate-950 mb-10 leading-[1.05]">
                        {t('marketing:hero.headlinePart1', 'Consigue clientes desde')} <br className="hidden md:block" />
                        <span className="text-blue-600">{t('marketing:hero.headlineHighlight', 'tu propia web inmobiliaria')}</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
                        {t('marketing:hero.subline', 'Sin depender de portales. Sin WordPress. Con un sistema diseñado para convertir visitas en contactos reales.')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a href="#pricing" className="w-full sm:w-auto px-12 py-6 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-blue-600 transition-all shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1 flex items-center justify-center">
                            {t('marketing:hero.cta', 'Ver cómo funciona')}
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. PROBLEM SECTION — The "Pain" */}
            <section className="py-24 bg-slate-50 border-y border-slate-200/50">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-950 mb-16 tracking-tight">
                        {t('marketing:problem.title', '¿Tu web te está trayendo clientes… o solo está ahí?')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { key: 'b1', icon: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 17l10 5 10-5M2 12l10 5 10-5M12 2l10 5-10 5L2 7l10-5z' },
                            { key: 'b2', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
                            { key: 'b3', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                                </div>
                                <p className="text-lg font-bold text-slate-800 leading-snug">
                                    {t(`marketing:problem.${item.key}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. SOLUTION SECTION — The Three Pillars */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-950 mb-6 tracking-tight">
                            {t('marketing:solution.title', 'Un sistema completo para inmobiliarias')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                key: '1',
                                bg: 'bg-blue-600',
                                shadow: 'shadow-blue-200',
                                icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                            },
                            {
                                key: '2',
                                bg: 'bg-indigo-600',
                                shadow: 'shadow-indigo-200',
                                icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                            },
                            {
                                key: '3',
                                bg: 'bg-purple-600',
                                shadow: 'shadow-purple-200',
                                icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                            }
                        ].map((block) => (
                            <div key={block.key} className="relative p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                                <div className={`w-16 h-16 ${block.bg} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg ${block.shadow} group-hover:scale-110 transition-transform`}>
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={block.icon} /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{t(`marketing:solution.c${block.key}`)}</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    {t(`marketing:solution.d${block.key}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. DIFFERENTIATION — Why us? */}
            <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="mt-1 flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-xl font-bold tracking-tight">
                                    {t(`marketing:differentiation.b${i}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LIVE DEMO — Keep it section */}
            <section className="py-24 bg-slate-900 text-white border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 text-blue-400 text-sm font-bold mb-8 border border-blue-600/30">
                                {t('marketing:roi.demoTitle', 'Pruébalo en vivo')}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 italic tracking-tight leading-tight">
                                {t('marketing:roi.headlineMain', 'No te lo imagines.')} <br />
                                <span className="text-blue-500 text-glow">{t('marketing:roi.headlineHighlight', 'Pruébalo ahora.')}</span>
                            </h2>
                            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg">
                                {t('marketing:roi.demoDesc', 'Entra en nuestra inmobiliaria demo y experimenta la velocidad real que tendrán tus clientes.')}
                            </p>
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 text-white rounded-2xl font-extrabold text-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 hover:scale-105"
                            >
                                🚀 {t('marketing:roi.demoBtn', 'Explorar Demo en Vivo')}
                            </a>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-8 bg-blue-500/20 rounded-[3rem] blur-3xl group-hover:bg-blue-500/30 transition-all duration-700" />
                            <div className="relative rounded-[2.5rem] border border-white/10 bg-slate-800 p-2 shadow-2xl overflow-hidden aspect-video">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                                    alt={t('marketing:roi.imageAlt', 'Live Demo Preview')}
                                    className="w-full h-full object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. WORDPRESS COMPARISON — The "Truth" 
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-10 tracking-tight">
                        {t('marketing:wp.title', 'Olvídate de WordPress y sus problemas')}
                    </h2>
                    <div className="space-y-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        <p>{t('marketing:wp.p1')}</p>
                        <p className="font-extrabold text-blue-600 text-2xl tracking-tight">{t('marketing:wp.p2')}</p>
                        <p>{t('marketing:wp.p3')}</p>
                    </div>
                </div>
            </section>
            */}

            {/* 8. PRICING — Final Conversion */}
            <PricingSection />

            {/* ADD-ONS — Extras 
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 italic tracking-tight">{t('marketing:addons.title', '💎 Módulos "A la Carta" (Add-ons)')}</h2>
                    <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto">{t('marketing:addons.subline', '¿Necesitas algo específico sin subir de plan? Puedes contratar funcionalidades sueltas de alto impacto.')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {[
                            { key: 'whatsapp', price: '120€', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                            { key: 'maps', price: '60€', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
                            { key: 'locations', price: '200€', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                            { key: 'i18n', price: '250€', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.337 8.07 16.51 3 18.129' },
                            { key: 'catalog', price: '350€', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' }
                        ].map((s, i) => (
                            <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 hover:shadow-xl transition-all group flex flex-col items-center">
                                <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                                </div>
                                <h4 className="font-bold text-lg text-slate-900 mb-2">{t(`marketing:addons.items.${s.key}`)}</h4>
                                <p className="text-blue-600 font-black text-2xl mb-4">{s.price}</p>
                                <div className="h-1 w-8 bg-slate-200 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            */}

            {/* CLOSING / FINAL CTA */}
            <section className="py-32 bg-slate-950 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[200px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-[200px] opacity-20 translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <h2 className="text-5xl md:text-[5.5rem] font-bold mb-10 italic tracking-tighter leading-tight">
                        {t('marketing:closing.title', '¿Hablamos sobre tu éxito digital?')}
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-400 mb-16 leading-relaxed font-medium">
                        {t('marketing:closing.subline', 'Deja de perder clientes por una web obsoleta. Empieza hoy y en 7 días tendrás tu sistema inmobiliario de alto rendimiento funcionando.')}
                    </p>
                    <div className="flex flex-col items-center gap-8">
                        <button className="w-full sm:w-auto px-16 py-8 bg-white text-slate-950 rounded-[2.5rem] font-black text-2xl hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 active:scale-95">
                            {t('marketing:closing.cta', 'Quiero informarme ahora')}
                        </button>
                        <p className="text-slate-500 font-bold italic text-xl">
                            {t('marketing:closing.quote', '"Menos técnica, más resultados."')}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
