import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePropertiesStore } from '../store/propertiesStore'
import { useProperties } from '../services/useProperties'
import { getProvincesWithLocations } from '../services/propertyService'
import { PropertyCard } from '../components/shared/PropertyCard'
import { SkeletonCard } from '../components/shared/SkeletonCard'
import { HierarchicalLocationSelect } from '../components/search/HierarchicalLocationSelect'
import { useTenant } from '../context/TenantContext'
import { useThemeStore } from '../store/themeStore'

export default function HomePage() {
  const tenant = useTenant()
  const theme = useThemeStore((s) => s.theme)
  const store = usePropertiesStore()
  useProperties(store, tenant?.id)

  const { t } = useTranslation(['home', 'common'])
  const navigate = useNavigate()

  const isMinimal = theme === 'MINIMAL'
  const isCorporate = theme === 'CORPORATE'
  const isPortal = theme === 'PORTAL'

  // Extracción de textos del Hero
  const heroData = tenant?.hero || {}
  const heroEyebrow = heroData.eyebrow || t('home:hero.eyebrow', { zone: tenant?.zone, province: tenant?.province })
  const heroTitle = heroData.title || t('home:hero.title')
  const heroSpan = heroData.titleSpan || t('home:hero.titleSpan', { zone: tenant?.zone })
  const heroSub = heroData.subtitle || t('home:hero.subtitle')

  // ── Estado y Lógica de Búsqueda ──
  const [locationFilter, setLocationFilter] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [provinces, setProvinces] = useState([])

  const featuredProperties = store.properties.filter((p) => p.featured)

  useEffect(() => {
    getProvincesWithLocations(tenant?.id).then(setProvinces)
  }, [tenant?.id])

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (activeType !== 'all') params.set('type', activeType)
    if (locationFilter !== 'all') params.set('loc', locationFilter)
    navigate(`/properties?${params.toString()}`)
  }

  const TYPE_OPTIONS = [
    { value: 'all', label: t('common:listing.all') },
    { value: 'sale', label: t('common:listing.sale') },
    { value: 'rent', label: t('common:listing.rent') },
  ]

  const renderSearchForm = (layoutType) => {
    const isCorp = layoutType === 'CORPORATE'
    const isPort = layoutType === 'PORTAL'
    const isMin = layoutType === 'MINIMAL'

    return (
      <form
        onSubmit={handleSearch}
        className={`w-full ${isCorp ? 'max-w-xl' : isPort ? 'max-w-4xl' : 'max-w-2xl'} ${isCorp ? '' : 'mx-auto'}`}
        role="search"
      >
        <div className={`flex gap-2 mb-4 ${isCorp ? 'justify-start' : 'justify-center'}`}>
          {TYPE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveType(value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeType === value
                  ? 'bg-primary-700 text-white'
                  : isCorp
                    ? 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                    : 'bg-white/10 text-secondary-300 hover:bg-white/20'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${isMin ? 'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2' : ''
          } ${isPort ? 'bg-white p-2 sm:p-3 rounded-2xl sm:rounded-[2rem] shadow-xl' : ''}`}
        >
          <div className="relative flex-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 h-5 w-5 text-secondary-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <HierarchicalLocationSelect
              provinces={provinces}
              value={locationFilter}
              onChange={setLocationFilter}
              allLabel={t('common:location.any')}
              className={`w-full pl-11 pr-4 py-3 sm:py-4 text-sm focus:outline-none transition-colors ${isCorp ? 'bg-white text-secondary-900 rounded-xl border border-secondary-200 shadow-sm' :
                  isPort ? 'bg-secondary-50 text-secondary-900 rounded-xl sm:rounded-2xl' :
                    'bg-transparent text-white [&>option]:text-secondary-900'
                }`}
            />
          </div>
          <button
            type="submit"
            className={`px-6 py-3 sm:py-4 font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors ${isPort ? 'rounded-xl sm:rounded-2xl text-base px-8' : 'rounded-xl text-sm'
              }`}
          >
            {t('common:btn.search')}
          </button>
        </div>
      </form>
    )
  }

  return (
    <>
      {/* ── MINIMAL Hero ────────────────────────────────────────────── */}
      {isMinimal && (
        <section className="relative bg-secondary-950 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary-950/80 via-secondary-950/60 to-secondary-950" />
          <div className="relative max-w-7xl mx-auto px-4 py-28 md:py-40 text-center space-y-8">
            <div className="flex flex-col items-center justify-center gap-8 mb-10 md:mb-16">
              <img src="/logo.png" alt={tenant?.name} className="h-16 md:h-20 w-auto object-contain brightness-0 invert" />
              <p className="inline-block px-4 py-1.5 rounded-full bg-primary-700/20 text-primary-300 text-sm font-medium tracking-wide border border-primary-600/30">
                {heroEyebrow}
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
              {heroTitle}
              <span className="block text-primary-400 mt-1">{heroSpan}</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-secondary-300">{heroSub}</p>
            {renderSearchForm('MINIMAL')}
          </div>
        </section>
      )}

      {/* ── CORPORATE Hero ────────────────────────────────────────────── */}
      {isCorporate && (
        <section className="bg-white border-b border-secondary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col justify-center order-2 lg:order-1">
                <p className="text-primary-700 font-bold tracking-widest uppercase text-xs sm:text-sm mb-4">{heroEyebrow}</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-secondary-950 leading-tight mb-6">
                  {heroTitle}
                  <span className="block text-primary-700 mt-2">{heroSpan}</span>
                </h1>
                <p className="text-lg text-secondary-600 mb-10 max-w-lg leading-relaxed">{heroSub}</p>
                {renderSearchForm('CORPORATE')}
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-none">
                  <div className="absolute inset-0 bg-secondary-100 translate-x-4 translate-y-4" />
                  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" alt={tenant?.name} className="absolute inset-0 w-full h-full object-cover border border-secondary-200 z-10" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PORTAL Hero ─────────────────────────────────────────────── */}
      {isPortal && (
        <section className="relative bg-secondary-900 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')" }} />
          <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
              {heroTitle} <span className="text-primary-400">{heroSpan}</span>
            </h1>
            <p className="text-lg sm:text-xl text-secondary-100 mb-10 md:mb-14 max-w-3xl drop-shadow-md">{heroSub}</p>
            <div className="w-full max-w-4xl bg-secondary-950/40 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl">
              {renderSearchForm('PORTAL')}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Properties ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-primary-700 font-semibold text-sm tracking-wide uppercase mb-1">{t('home:featured.eyebrow')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-950">{t('home:featured.title')}</h2>
          </div>
          <button onClick={() => navigate('/properties')} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-secondary-100 text-secondary-800 font-bold hover:bg-secondary-200 transition-colors">
            {t('common:btn.viewAll')}
          </button>
        </div>

        {store.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section className="bg-secondary-950 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t('home:cta.title')}</h2>
          <p className="text-secondary-400 text-lg">{t('home:cta.subtitle')}</p>
          <button onClick={() => navigate('/contact')} className="inline-block px-8 py-4 rounded-2xl bg-primary-700 text-white font-semibold hover:bg-primary-800 transition-colors text-lg">
            {t('home:cta.btn')}
          </button>
        </div>
      </section>
    </>
  )
}