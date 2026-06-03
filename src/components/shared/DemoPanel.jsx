import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'

const THEMES = ['MINIMAL', 'CORPORATE', 'PORTAL']
const COLORS = [
  { name: 'Teal', hex: '#23c698' },
  { name: 'Blue', hex: '#0ea5e9' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Slate', hex: '#475569' },
]

const TOOLTIP_KEY = 'zendo_demo_tooltip_seen'

export function DemoPanel() {
  const { t } = useTranslation('common')
  const { theme, setTheme, primaryColor, setPrimaryColor } = useThemeStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Show tooltip only on first visit
  useEffect(() => {
    if (!localStorage.getItem(TOOLTIP_KEY)) {
      // Small delay so page loads first
      const t = setTimeout(() => setShowTooltip(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  function dismissTooltip() {
    localStorage.setItem(TOOLTIP_KEY, '1')
    setShowTooltip(false)
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] flex flex-col items-start gap-2"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* ── First-visit onboarding callout ── */}
      {showTooltip && (
        <div style={{
          position: 'relative',
          background: '#1e293b',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12,
          padding: '12px 14px',
          width: 220,
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          animation: 'demoFadeIn .3s ease',
          color: '#fff',
        }}>
          <style>{`
            @keyframes demoFadeIn {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: none; }
            }
          `}</style>

          {/* Close button */}
          <button
            onClick={dismissTooltip}
            aria-label={t('demoPanel.closeAria')}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', lineHeight: 1, padding: 2,
              fontSize: 16,
            }}
          >×</button>

          {/* Content */}
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
            {t('demoPanel.title')}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: 0 }}>
            {t('demoPanel.desc')}
          </p>

          {/* Arrow pointing down at badge */}
          <div style={{
            position: 'absolute',
            bottom: -8,
            left: 22,
            width: 16, height: 8,
            overflow: 'hidden',
          }}>
            <div style={{
              width: 12, height: 12,
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.15)',
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
              margin: '-6px auto 0',
            }} />
          </div>
        </div>
      )}

      {/* ── Expanded settings panel ── */}
      {isExpanded && (
        <div style={{
          background: 'rgba(15,15,20,0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14,
          padding: '14px 16px',
          width: 220,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>{t('demoPanel.theme')}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {THEMES.map(t => (
                <button key={t} onClick={() => { setTheme(t); setIsExpanded(false) }} style={{
                  padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', border: 'none', transition: 'all .15s',
                  background: theme === t ? '#fff' : 'rgba(255,255,255,0.08)',
                  color: theme === t ? '#0f0f14' : 'rgba(255,255,255,0.6)',
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>{t('demoPanel.color')}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c.hex} onClick={() => { setPrimaryColor(c.hex); setIsExpanded(false) }}
                  title={c.name} aria-label={c.name}
                  style={{
                    width: 22, height: 22, borderRadius: '50%', background: c.hex,
                    border: primaryColor === c.hex ? '2px solid #fff' : '2px solid transparent',
                    transform: primaryColor === c.hex ? 'scale(1.2)' : 'scale(1)',
                    cursor: 'pointer', transition: 'transform .15s, border-color .15s', outline: 'none',
                  }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Badge — always visible ── */}
      <button
        onClick={() => { dismissTooltip(); setIsExpanded(v => !v) }}
        aria-label={t('demoPanel.btnAria')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: '999px',
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
          cursor: 'pointer', userSelect: 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: '#23c698',
          display: 'inline-block', flexShrink: 0,
          animation: 'demoPulse 2s ease-in-out infinite',
        }} />
        <style>{`@keyframes demoPulse{0%,100%{box-shadow:0 0 0 0 rgba(35,198,152,.6)}50%{box-shadow:0 0 0 5px rgba(35,198,152,0)}}`}</style>
        DEMO
        <svg style={{ width: 12, height: 12, opacity: 0.5, marginLeft: 2 }} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}
