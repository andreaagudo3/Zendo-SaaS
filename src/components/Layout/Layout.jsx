import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppButton } from '../shared/WhatsAppButton'
import { Link } from 'react-router-dom'

/**
 * MarketingNavbar — Simplified navigation for the B2B side.
 */
function MarketingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-6 md:px-12">
      <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <img src="/zendo-logo.png" alt="Zendo Logo" className="h-8 w-auto object-contain" />
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Características</a>
        <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Precios</a>
        <button className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95">
          Ver cómo funciona
        </button>
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
      <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900">
        <MarketingNavbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <MarketingFooter />
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
