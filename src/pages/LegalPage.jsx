import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTenant } from '../context/TenantContext'
import { Layout } from '../components/Layout/Layout'
import { ShieldCheck, Scale, Cookie, AlertCircle, Calendar, ChevronRight, Globe } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

const SECTION_INFO = {
  terms: {
    key: 'terms',
    title: {
      es: 'Aviso Legal y Términos',
      en: 'Legal Notice & Terms'
    },
    icon: Scale,
    description: {
      es: 'Condiciones generales de uso del portal, responsabilidades y propiedad intelectual.',
      en: 'General conditions for using the portal, liabilities, and intellectual property.'
    }
  },
  privacy: {
    key: 'privacy',
    title: {
      es: 'Política de Privacidad',
      en: 'Privacy Policy'
    },
    icon: ShieldCheck,
    description: {
      es: 'Información sobre el tratamiento de tus datos personales, finalidades y derechos.',
      en: 'Information about personal data processing, purposes, and your rights.'
    }
  },
  cookies: {
    key: 'cookies',
    title: {
      es: 'Política de Cookies',
      en: 'Cookies Policy'
    },
    icon: Cookie,
    description: {
      es: 'Detalles sobre las cookies y tecnologías similares empleadas en este portal.',
      en: 'Details about cookies and similar tracking technologies used on this website.'
    }
  }
}

export default function LegalPage() {
  const tenant = useTenant()
  const theme = useThemeStore((s) => s.theme)
  const isMinimal = theme === 'MINIMAL'
  const { i18n, t } = useTranslation(['nav', 'common'])
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Section resolution: default to 'terms'
  const activeSection = searchParams.get('section') || 'terms'
  const sectionKey = SECTION_INFO[activeSection] ? activeSection : 'terms'
  const sectionData = SECTION_INFO[sectionKey]

  // Language resolution: sync with i18n browser language, no manual override
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'es'

  // Get content from tenant.legal_translations
  const legalTranslations = tenant?.legal_translations || {}
  let content = legalTranslations[currentLang]?.[sectionKey] || ''

  // Fallback for terms and conditions (backward compatibility)
  if (!content && sectionKey === 'terms' && currentLang === 'es' && tenant?.terms_and_conditions) {
    content = tenant.terms_and_conditions
  }

  const isPublished = content && content.replace(/<[^>]*>/g, '').trim() !== ''

  const handleSectionChange = (key) => {
    setSearchParams({ section: key })
  }

  const ActiveIcon = sectionData.icon

  return (
    <Layout>
      {/* Minimalist Top Header Banner */}
      <div className={`relative bg-secondary-950 py-10 overflow-hidden border-b border-secondary-900 ${isMinimal ? 'pt-24 md:pt-32' : ''}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--color-primary-900),transparent)] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {sectionData.title[currentLang]}
            </h1>
            <p className="text-secondary-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {sectionData.description[currentLang]}
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar (Span 3) */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-secondary-200 rounded-2xl p-4 shadow-xs sticky top-24">
              <h3 className="px-3 pt-1 pb-3 text-xs font-bold text-secondary-400 uppercase tracking-wider">
                {currentLang === 'es' ? 'Documentos Legales' : 'Legal Documents'}
              </h3>
              <nav className="space-y-1.5" aria-label="Legal Documents Menu">
                {Object.values(SECTION_INFO).map((item) => {
                  const isSelected = sectionKey === item.key
                  const TabIcon = item.icon
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleSectionChange(item.key)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 font-semibold text-sm cursor-pointer ${
                        isSelected
                          ? 'bg-primary-700 text-white shadow-md'
                          : 'bg-transparent text-secondary-700 hover:bg-secondary-50 border border-transparent hover:border-secondary-100'
                      }`}
                    >
                      <TabIcon size={16} className={isSelected ? 'text-white' : 'text-secondary-400'} />
                      <span>{item.title[currentLang]}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Right Content Panel (Span 9) */}
          <main className="lg:col-span-9 bg-white border border-secondary-200 rounded-3xl p-6 sm:p-10 shadow-xs">
            {isPublished ? (
              <div className="space-y-6">
                
                {/* Header of Content card */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-secondary-150">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary-50 text-primary-700 rounded-xl">
                      <ActiveIcon size={20} />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-secondary-900 text-lg leading-tight">
                        {sectionData.title[currentLang]}
                      </h2>
                      <p className="text-secondary-400 text-xs mt-0.5">
                        {tenant?.name || 'Zendo'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Calendar/Updated Info */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary-500 bg-secondary-50 px-3 py-1.5 rounded-lg border border-secondary-100">
                    <Calendar size={14} className="text-secondary-400" />
                    <span>
                      {currentLang === 'es' ? 'Versión Vigente' : 'Active Version'}
                    </span>
                  </div>
                </div>

                {/* Main Legal text in TipTap format */}
                <div 
                  className="tiptap-editor font-sans prose max-w-none text-secondary-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (
              /* High-fidelity Empty/Draft State */
              <div className="py-16 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5">
                <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-xs">
                  <AlertCircle size={28} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-extrabold text-secondary-900 text-xl tracking-tight">
                    {currentLang === 'es' ? 'Documento no publicado' : 'Document not published'}
                  </h3>
                  <p className="text-secondary-500 text-sm leading-relaxed">
                    {currentLang === 'es' 
                      ? 'Este bloque legal se encuentra temporalmente en borrador o no ha sido publicado aún por el administrador de la inmobiliaria.' 
                      : 'This legal section is temporarily in draft mode or has not been published yet by the real estate administrator.'}
                  </p>
                </div>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-secondary-900 text-white rounded-xl text-xs font-bold hover:bg-secondary-800 transition-colors shadow-xs"
                >
                  {currentLang === 'es' ? 'Volver al Inicio' : 'Return to Home'}
                </Link>
              </div>
            )}
          </main>

        </div>
      </div>
    </Layout>
  )
}
