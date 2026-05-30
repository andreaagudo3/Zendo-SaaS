import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTenant } from '../context/TenantContext'
import { Layout } from '../components/Layout/Layout'
import { ShieldCheck, Scale, Cookie, AlertCircle, Calendar, ChevronRight, Globe } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { fetchTenantLegalTranslations } from '../services/tenantResolver'

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

  // Dedicated dynamic state to load the isolated heavy legal translations context
  const [legalTranslations, setLegalTranslations] = useState(null)
  const [loadingLegal, setLoadingLegal] = useState(true)

  useEffect(() => {
    if (!tenant?.id || tenant.isMaster) {
      setLoadingLegal(false)
      return
    }
    setLoadingLegal(true)
    fetchTenantLegalTranslations(tenant.id)
      .then(({ data, error }) => {
        if (!error && data) {
          setLegalTranslations(data)
        } else {
          console.error('[LegalPage] Error loading from tenant_legal_context:', error)
        }
        setLoadingLegal(false)
      })
  }, [tenant?.id])

  // Get content from the fetched tenant_legal_context state
  const activeTranslations = legalTranslations || {}
  let content = activeTranslations[currentLang]?.[sectionKey] || ''

  const isPublished = (sectionKey === 'cookies') || (content && content.replace(/<[^>]*>/g, '').trim() !== '')

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
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 font-semibold text-sm cursor-pointer ${isSelected
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

          <main className="lg:col-span-9 bg-white border border-secondary-200 rounded-3xl p-6 sm:p-10 shadow-xs">

            {loadingLegal ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#059669', animation: 'tz-spin 0.8s linear infinite' }} />
                <style>{`@keyframes tz-spin { to { transform: rotate(360deg); } }`}</style>
                <p className="text-secondary-400 text-xs font-mono">Fetching isolated legal payload...</p>
              </div>
            ) : isPublished ? (
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
                {sectionKey === 'cookies' ? (
                  <div className="space-y-6">
                    {/* Immutable Layer */}
                    <div className="prose max-w-none text-secondary-800 space-y-3">
                      <h3 className="font-extrabold text-secondary-900 text-base">
                        {currentLang === 'es' ? '1. Cookies Técnicas Obligatorias (Zendo)' : '1. Mandatory Technical Cookies (Zendo)'}
                      </h3>
                      <p className="text-secondary-600 text-sm leading-relaxed">
                        {currentLang === 'es' 
                          ? 'Este sitio web utiliza cookies técnicas esenciales y estrictamente necesarias para el correcto funcionamiento y la navegación segura a través del portal. Estas cookies permiten gestionar la sesión del usuario, garantizar la seguridad del sitio y recordar preferencias básicas (como el idioma de navegación). Al ser indispensables para la prestación del servicio, no requieren de su consentimiento y no pueden ser desactivadas en nuestros sistemas.'
                          : 'This website uses essential technical cookies strictly necessary for the proper functioning and secure navigation of the portal. These cookies handle user sessions, guarantee site security, and remember basic preferences (such as your browser language). As they are indispensable for providing our services, they do not require consent and cannot be deactivated in our systems.'}
                      </p>
                    </div>

                    {/* Dynamic Layer / Fallback */}
                    <div className="pt-6 border-t border-secondary-150 prose max-w-none text-secondary-800 space-y-3">
                      <h3 className="font-extrabold text-secondary-900 text-base">
                        {currentLang === 'es' ? '2. Cookies de Terceros y Servicios de Rastreo' : '2. Third-Party Cookies & Tracking Services'}
                      </h3>
                      {content && content.replace(/<[^>]*>/g, '').trim() !== '' ? (
                        <div
                          className="tiptap-editor font-sans text-secondary-800 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      ) : (
                        <div className="p-4 bg-secondary-50 border border-secondary-200 rounded-2xl text-secondary-500 text-sm italic leading-relaxed">
                          {currentLang === 'es'
                            ? 'Esta agencia no utiliza cookies de terceros ni herramientas de rastreo adicionales (como Google Analytics o Meta Pixel) en este momento.'
                            : 'This agency does not use third-party cookies or additional tracking tools (such as Google Analytics or Meta Pixel) at this time.'}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="tiptap-editor font-sans prose max-w-none text-secondary-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
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
