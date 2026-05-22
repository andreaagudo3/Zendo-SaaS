import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppButton } from '../shared/WhatsAppButton'
import { Link } from 'react-router-dom'

/**
 * MarketingNavbar — Simplified navigation for the B2B side.
 */
function MarketingNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 h-16 flex items-center justify-between px-6 md:px-12"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)' }}>
      <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-tight text-white">Zendo</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Precios</a>
        <a href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? `${window.location.origin}/?tenant=demo` : 'https://demo.zendoapp.es'}
          target="_blank" rel="noopener noreferrer"
          className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
          Ver demo
        </a>
      </div>
    </nav>
  )
}

/**
 * MarketingFooter — Simplified footer for the B2B side.
 */
function MarketingFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="flex items-center gap-3">
          <img src="/zendo-logo.png" alt="Zendo Logo" className="h-6 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          <span className="font-bold text-lg tracking-tight text-slate-900">Zendo</span>
        </div>
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Zendo SaaS. Todos los derechos reservados.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Privacidad</a>
          <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Términos</a>
        </div>
      </div>
    </footer>
  )
}

/**
 * Layout — wraps every page with the sticky Navbar and Footer.
 * If isMarketing is true, it shows a specialized B2B navigation.
 * 
 * @param {{ children: React.ReactNode, isMarketing?: boolean }} props
 */
export function Layout({ children, isMarketing = false }) {
  if (isMarketing) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 selection:bg-blue-100 selection:text-blue-900">
        <MarketingNavbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        {/* Footer is embedded inside SaaSLandingPage itself — no duplicate here */}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
