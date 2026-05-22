import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PricingSection from '../../components/marketing/pricing/PricingSection';

/* ─────────────────────────────────────────────────────────────────────────────
   SaaSLandingPage — Zendo B2B Marketing Landing
   Flow: Hero (with stats) → Features Bento → Live Branding + Demo CTA
         → Pricing → Closing CTA → Footer
   Design: dark-first · blue-600/indigo gradient · Inter
───────────────────────────────────────────────────────────────────────────── */

const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const DEMO_URL = isLocal
  ? `${typeof window !== 'undefined' ? window.location.origin : ''}/?tenant=demo`
  : 'https://demo.zendoapp.es';

/* ── Primitives ─────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Check = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* ── Animated counter ───────────────────────────────────────────────────── */
function Stat({ end, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        const step = end / (1600 / 16);
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + step, end);
          setVal(Math.floor(cur));
          if (cur >= end) clearInterval(t);
        }, 16);
      }
    }, { threshold: 0.6 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Dashboard Mockup ───────────────────────────────────────────────────── */
const Mockup = () => (
  <div className="relative w-full max-w-xl mx-auto select-none">
    <div className="absolute -top-10 -left-10 w-56 h-56 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-950/60"
      style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(24px)' }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10"
        style={{ background: 'rgba(15,23,42,0.9)' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        <div className="flex-1 mx-3 h-5 rounded flex items-center px-2.5 gap-1.5"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <span className="text-[9px] text-slate-500 font-mono">app.zendoapp.es/admin</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[['124', 'Propiedades', true], ['18', 'Contactos hoy', true], ['2.4k', 'Visitas', false]].map(([v, l, up]) => (
            <div key={l} className="rounded-xl p-3 border border-white/8" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-[8px] text-slate-500 mb-1">{l}</p>
              <p className="text-base font-bold text-white leading-none">{v}</p>
              <p className={`text-[8px] mt-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>{up ? '↑ +12%' : '↓ -3%'}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[['Ático Marbella', '890.000 €', 'from-blue-800 to-indigo-900'],
            ['Villa Costa Sol', '2.1M €', 'from-slate-700 to-slate-800']].map(([n, p, g]) => (
            <div key={n} className="rounded-xl overflow-hidden border border-white/8">
              <div className={`h-16 bg-gradient-to-br ${g} flex items-end p-1.5`}>
                <span className="text-[7px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">Destacada</span>
              </div>
              <div className="p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[8px] text-slate-300 font-semibold truncate">{n}</p>
                <p className="text-[9px] font-bold text-white">{p}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-1">
          {['🏠 Inicio', '🏢 Props', '📊 Stats', '⚙️ Config'].map(i => (
            <span key={i} className="text-[8px] text-slate-600">{i}</span>
          ))}
        </div>
      </div>
    </div>
    <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/40 text-[11px] font-semibold text-emerald-400"
      style={{ background: 'rgba(5,46,22,0.85)', backdropFilter: 'blur(10px)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
      Nuevo contacto
    </div>
  </div>
);

/* ── Live Branding Preview ──────────────────────────────────────────────── */
const BrandingPreview = () => {
  const THEMES = [
    { name: 'Teal',  color: '#14b8a6', bg: 'from-teal-600 to-emerald-700',   btn: '#0d9488' },
    { name: 'Blue',  color: '#2563eb', bg: 'from-blue-600 to-indigo-700',     btn: '#1d4ed8' },
    { name: 'Rose',  color: '#e11d48', bg: 'from-rose-600 to-pink-700',       btn: '#be123c' },
    { name: 'Amber', color: '#d97706', bg: 'from-amber-500 to-orange-600',    btn: '#b45309' },
  ];
  const [active, setActive] = useState(1);
  const th = THEMES[active];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">Branding en tiempo real</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Tu agencia,<br /><span className="text-blue-400">tu identidad.</span>
        </h2>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Cambia colores, logo y cabecera desde el panel. Los cambios se aplican al instante, sin tocar código.
        </p>

        {/* Color buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {THEMES.map((t, i) => (
            <button key={t.name} onClick={() => setActive(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all"
              style={{
                borderColor: active === i ? t.color : 'rgba(255,255,255,0.1)',
                background:  active === i ? `${t.color}22` : 'rgba(255,255,255,0.04)',
                color:       active === i ? t.color : '#94a3b8',
              }}>
              <span className="w-3 h-3 rounded-full" style={{ background: t.color }} />
              {t.name}
            </button>
          ))}
        </div>

        {/* Demo CTA — consolidated here */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-white/10">
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }}>
            🚀 Explorar el demo en vivo
          </a>
          <a href="#pricing"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-slate-300 border border-white/15 hover:border-white/30 transition-all text-sm"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            Ver precios →
          </a>
        </div>
      </div>

      {/* Preview window */}
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl transition-all duration-500"
        style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)' }}>
        <div className={`bg-gradient-to-r ${th.bg} px-5 py-3 flex items-center justify-between transition-all duration-500`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-md" />
            <span className="text-white font-bold text-sm">Inmobiliaria Demo</span>
          </div>
          <button className="text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-500"
            style={{ background: th.btn }}>
            Contactar
          </button>
        </div>
        <div className={`bg-gradient-to-br ${th.bg} opacity-25 h-24 transition-all duration-500`} />
        <div className="px-4 pb-4 -mt-8 relative z-10">
          <div className="p-3 rounded-xl border border-white/10" style={{ background: 'rgba(15,23,42,0.9)' }}>
            <p className="text-[10px] text-slate-500 mb-2">Propiedades destacadas</p>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2].map(i => (
                <div key={i} className="rounded-lg overflow-hidden border border-white/10">
                  <div className={`h-10 bg-gradient-to-br ${th.bg} opacity-60 transition-all duration-500`} />
                  <div className="p-1.5 bg-slate-900">
                    <div className="h-1.5 bg-slate-700 rounded w-3/4 mb-1" />
                    <div className="h-1.5 rounded w-1/2" style={{ background: `${th.color}88` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main ───────────────────────────────────────────────────────────────── */
export default function SaaSLandingPage() {
  const { t } = useTranslation(['marketing']);

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ═══════════════════════════════════════════════════
          1. HERO  (includes stats — no separate section)
      ═══════════════════════════════════════════════════ */}
      <section className="relative flex flex-col justify-center pt-16 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Ambient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-700/18 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-700/15 rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
              backgroundSize: '60px 60px',
            }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 border text-sm font-semibold"
                style={{ background: 'rgba(37,99,235,0.12)', borderColor: 'rgba(37,99,235,0.3)', color: '#93c5fd' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                {t('marketing:hero.badge', 'Tu web inmobiliaria lista en 7 días')}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight mb-6">
                <span className="text-white">{t('marketing:hero.headlinePart1', 'Consigue clientes')}</span><br />
                <span style={{
                  display: 'inline',
                  background: 'linear-gradient(135deg,#3b82f6 0%,#818cf8 55%,#a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}>
                  {t('marketing:hero.headlineHighlight', 'desde tu propia web')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                {t('marketing:hero.subline', 'Sin portales. Sin WordPress. Un sistema diseñado para convertir visitas en contactos reales.')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', boxShadow: '0 4px 24px rgba(37,99,235,0.4)' }}>
                  {t('marketing:hero.cta', 'Ver precios')}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
                <a href={DEMO_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-slate-300 border border-white/15 hover:border-white/30 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  🚀 {t('marketing:roi.demoBtn', 'Demo en vivo')}
                </a>
              </div>

              {/* Social proof + stats — merged into hero */}
              <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {['#1d4ed8','#7c3aed','#059669','#dc2626'].map((c,i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: c }}>
                        {['MG','AR','JL','SP'][i]}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-400"><span className="text-white font-semibold">+40</span> agencias</p>
                </div>
                {[['7', ' días', 'Lanzamiento'], ['98', '%', 'Satisfacción']].map(([n, s, l]) => (
                  <div key={l} className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold"
                      style={{ background: 'linear-gradient(135deg,#93c5fd,#a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      <Stat end={parseInt(n)} suffix={s} />
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup — hidden on mobile */}
            <div className="hidden lg:block">
              <Mockup />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom,transparent,rgb(2,6,23))' }} />
      </section>

      {/* ═══════════════════════════════════════════════════
          2. FEATURES BENTO
          (why-us bullets absorbed into 6th "card")
      ═══════════════════════════════════════════════════ */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-blue-800/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
              {t('marketing:solution.eyebrow', 'Plataforma completa')}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {t('marketing:solution.title', 'Un sistema completo para inmobiliarias')}
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              {t('marketing:solution.subtitle', 'Todo lo que necesita tu agencia para captar, gestionar y convertir clientes.')}
            </p>
          </div>

          {/* Bento: mobile=1col, tablet=2col, desktop=6col */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

            {/* Large cell — spans full row on tablet / 3 col desktop */}
            <div className="lg:col-span-3 rounded-3xl p-6 md:p-8 border border-white/8 relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300"
              style={{ background: 'linear-gradient(145deg,rgba(37,99,235,0.13),rgba(79,70,229,0.06))' }}>
              <div className="absolute -top-8 -right-8 w-36 h-36 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/30 transition-all duration-500" />
              <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-5 text-blue-400">
                <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('marketing:solution.c1')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{t('marketing:solution.d1')}</p>
              <div className="flex flex-wrap gap-2">
                {['Buscador avanzado','Filtros dinámicos','Bento grid'].map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-blue-500/30 text-blue-300"
                    style={{ background: 'rgba(37,99,235,0.1)' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* WhatsApp/contact */}
            <div className="lg:col-span-3 rounded-3xl p-6 md:p-8 border border-white/8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300"
              style={{ background: 'linear-gradient(145deg,rgba(79,70,229,0.13),rgba(124,58,237,0.06))' }}>
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-indigo-600/20 rounded-full blur-2xl group-hover:bg-indigo-600/30 transition-all duration-500" />
              <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400">
                <Icon d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('marketing:solution.c2')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t('marketing:solution.d2')}</p>
            </div>

            {/* Admin */}
            <div className="lg:col-span-2 rounded-3xl p-6 md:p-8 border border-white/8 group hover:border-violet-500/40 transition-all duration-300"
              style={{ background: 'linear-gradient(145deg,rgba(124,58,237,0.1),rgba(15,23,42,0.85))' }}>
              <div className="w-11 h-11 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-5 text-violet-400">
                <Icon d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('marketing:solution.c3')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t('marketing:solution.d3')}</p>
            </div>

            {/* Multi-tenant */}
            <div className="lg:col-span-2 rounded-3xl p-6 md:p-8 border border-white/8 group hover:border-emerald-500/40 transition-all duration-300"
              style={{ background: 'linear-gradient(145deg,rgba(5,150,105,0.1),rgba(15,23,42,0.85))' }}>
              <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mb-5 text-emerald-400">
                <Icon d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-tenant</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Cada agencia con su propia web, panel e identidad de marca.</p>
            </div>

            {/* Why us — bullets absorbed here, no separate strip needed */}
            <div className="md:col-span-2 lg:col-span-2 rounded-3xl p-6 md:p-8 border border-white/8 group hover:border-amber-500/40 transition-all duration-300"
              style={{ background: 'linear-gradient(145deg,rgba(217,119,6,0.08),rgba(15,23,42,0.85))' }}>
              <div className="w-11 h-11 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-5 text-amber-400">
                <Icon d="M13 10V3L4 14h7v7l9-11h-7z" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">¿Por qué Zendo?</h3>
              <ul className="space-y-2.5">
                {[1,2,3,4].map(i => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"><Check /></span>
                    <span className="text-slate-300 text-sm leading-snug">{t(`marketing:differentiation.b${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. LIVE BRANDING + DEMO CTA (merged, no separate section)
      ═══════════════════════════════════════════════════ */}
      <section className="py-12 md:py-20 border-y border-white/8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.06),rgba(79,70,229,0.04))' }}>
        <div className="absolute bottom-0 left-0 w-[500px] h-[350px] bg-indigo-800/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <BrandingPreview />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. PRICING
      ═══════════════════════════════════════════════════ */}
      <div className="bg-white">
        <PricingSection />
      </div>

      {/* ═══════════════════════════════════════════════════
          5. CLOSING CTA + FOOTER
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/12 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-600/12 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            <span className="text-white">{t('marketing:closing.title', '¿Hablamos sobre')}</span><br />
            <span style={{
              background: 'linear-gradient(135deg,#3b82f6,#818cf8,#a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>tu éxito digital?</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            {t('marketing:closing.subline', 'Deja de perder clientes por una web obsoleta. En 7 días tendrás tu plataforma inmobiliaria lista.')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <a href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }}>
              {t('marketing:closing.cta', 'Quiero informarme ahora')}
            </a>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-slate-300 border border-white/15 hover:border-white/30 transition-all text-sm"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              🚀 Ver demo gratis
            </a>
          </div>
          <p className="text-slate-600 text-sm italic">
            {t('marketing:closing.quote', '"Menos técnica, más resultados."')}
          </p>
        </div>

        {/* ── Footer (inside closing section — avoids extra `bg-slate-950` section) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-8 border-t border-white/8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                </div>
                <span className="font-extrabold text-white tracking-tight">Zendo</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Plataforma SaaS para agencias inmobiliarias.
              </p>
              <div className="flex gap-2">
                {[
                  { l: 'Instagram', d: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z' },
                  { l: 'LinkedIn', d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                ].map(s => (
                  <a key={s.l} href="#" aria-label={s.l}
                    className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/30 transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <Icon d={s.d} size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Producto */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4">Producto</h4>
              <ul className="space-y-2.5">
                {['Características', 'Precios', 'Demo', 'Integraciones'].map(i => (
                  <li key={i}><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4">Empresa</h4>
              <ul className="space-y-2.5">
                {['Sobre nosotros', 'Blog', 'Casos de éxito', 'Contacto'].map(i => (
                  <li key={i}><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">{i}</a></li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4">Newsletter</h4>
              <p className="text-slate-600 text-sm mb-3">Tips y novedades cada 2 semanas.</p>
              <form onSubmit={e => e.preventDefault()} className="space-y-2">
                <input type="email" placeholder="tu@email.com"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-700 border border-white/10 focus:outline-none focus:border-blue-500/60 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }} />
                <button type="submit"
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
                  Suscribirme
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-white/8">
            <p className="text-slate-700 text-xs">© {new Date().getFullYear()} Zendo. Todos los derechos reservados.</p>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/25 text-emerald-600 text-xs font-semibold"
              style={{ background: 'rgba(5,150,105,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              99.9% uptime · Todos los sistemas operativos
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
