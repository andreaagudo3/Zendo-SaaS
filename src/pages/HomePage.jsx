import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePropertiesStore } from '../store/propertiesStore'
import { useProperties } from '../services/useProperties'
import { getProvincesWithLocations } from '../services/propertyService'
import { PropertyCard } from '../components/shared/PropertyCard'
import { SkeletonCard } from '../components/shared/SkeletonCard'
import { HierarchicalLocationSelect } from '../components/search/HierarchicalLocationSelect'
import { SITE } from '../config/siteConfig'

/**
 * HomePage — Hero + Search + Featured Properties
 */
export default function HomePage() {
  const store = usePropertiesStore()
  useProperties(store)
  const { t } = useTranslation(['home', 'common'])

  const [locationFilter, setLocationFilter] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [provinces, setProvinces] = useState([])
  const navigate = useNavigate()

  const featuredProperties = store.properties.filter((p) => p.featured)

  useEffect(() => {
    getProvincesWithLocations().then(setProvinces)
  }, [])

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

  return (
    <>
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section
        className="relative bg-secondary-950 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')",
          }}
          aria-hidden="true"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-950/80 via-secondary-950/60 to-secondary-950" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 text-center space-y-8">
          {/* Logo hero & Eyebrow Group */}
          <div className="flex flex-col items-center justify-center gap-8 mb-10 md:mb-16">
            <img
              src="/logo.png"
              alt={t('home:hero.logoAlt', { name: SITE.name })}
              className="h-16 md:h-20 max-h-[80px] w-auto object-contain brightness-0 invert"
            />
            <p className="inline-block px-4 py-1.5 rounded-full bg-primary-700/20 text-primary-300 text-sm font-medium tracking-wide border border-primary-600/30">
              {t('home:hero.eyebrow', { zone: SITE.zone, province: SITE.province })}
            </p>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight"
          >
            {t('home:hero.title')}
            <span className="block text-primary-400 mt-1">{t('home:hero.titleSpan', { zone: SITE.heroZone })}</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-secondary-300">
            {t('home:hero.subtitle')}
          </p>

          {/* ── Search form ── */}
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
            role="search"
            aria-label={t('home:hero.searchAriaLabel')}
          >
            {/* Tipo toggle */}
            <div className="flex justify-center gap-2 mb-4">
              {TYPE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveType(value)}
                  aria-pressed={activeType === value}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeType === value
                    ? 'bg-primary-700 text-white'
                    : 'bg-white/10 text-secondary-300 hover:bg-white/20'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Selector jerárquico + botón buscar */}
            <div className="flex gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-2">
              <div className="relative flex-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 h-4 w-4 text-secondary-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <HierarchicalLocationSelect
                  provinces={provinces}
                  value={locationFilter}
                  onChange={setLocationFilter}
                  allLabel={t('common:location.any')}
                  className="w-full pl-9 pr-3 py-3 bg-transparent text-white placeholder-secondary-400 text-sm focus:outline-none [&>option]:text-secondary-900 [&>optgroup]:text-secondary-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800 transition-colors whitespace-nowrap"
                aria-label={t('home:hero.searchAriaLabel')}
              >
                {t('common:btn.search')}
              </button>
            </div>
          </form>
        </div>
      </section>


      {/* ── Featured Properties ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" aria-labelledby="featured-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-primary-700 font-semibold text-sm tracking-wide uppercase mb-1">
              {t('home:featured.eyebrow')}
            </p>
            <h2 id="featured-heading" className="text-3xl md:text-4xl font-bold text-secondary-950">
              {t('home:featured.title')}
            </h2>
          </div>
          <a
            href="/properties"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-secondary-100 text-secondary-800 font-bold hover:bg-secondary-200 transition-colors"
          >
            {t('common:btn.viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {store.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : store.error ? (
          <div className="text-center py-16 text-red-500">{store.error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section className="bg-secondary-950 py-20" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white">
            {t('home:cta.title')}
          </h2>
          <p className="text-secondary-400 text-lg">
            {t('home:cta.subtitle')}
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 rounded-2xl bg-primary-700 text-white font-semibold hover:bg-primary-800 transition-colors text-lg"
            aria-label={t('home:cta.btnAriaLabel')}
          >
            {t('home:cta.btn')}
          </a>
        </div>
      </section>
    </>
  )
}
