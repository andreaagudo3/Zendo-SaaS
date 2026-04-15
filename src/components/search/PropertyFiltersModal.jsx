import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HierarchicalLocationSelect } from './HierarchicalLocationSelect'
import { getPublicFeatures } from '../../services/propertyService'

const PRICE_FORMAT = new Intl.NumberFormat('es-ES', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
})

/**
 * PropertyFiltersModal
 *
 * • Móvil (<640px): pantalla completa que entra por la derecha (estilo app nativa).
 * • Desktop (≥640px): modal centrado con overlay oscuro y animación fade+scale.
 *
 * Props:
 *   isOpen    — boolean
 *   onClose   — fn()
 *   filters   — objeto de filtros actual
 *   provinces — array {id, name, locations: [{id,name}]}
 *   onApply   — fn(partialFilters) — solo se aplica al pulsar "Aplicar filtros"
 */
export function PropertyFiltersModal({ isOpen, onClose, filters, provinces = [], onApply }) {
  const { t } = useTranslation(['properties', 'common', 'features'])

  // Estado local — no se aplica hasta pulsar "Aplicar filtros"
  const [local, setLocal] = useState({
    locationFilter: filters.locationFilter,
    bedrooms:       filters.bedrooms,
    maxPrice:       filters.maxPrice === Infinity ? 2_000_000 : filters.maxPrice,
    featureIds:     filters.featureIds ?? [],
  })

  // Features loaded from DB
  const [groupedFeatures, setGroupedFeatures] = useState({})
  const [categories, setCategories]           = useState([])
  const [activeTab, setActiveTab]             = useState('')
  const [featuresLoading, setFeaturesLoading] = useState(true)

  const set = (key, val) => setLocal(prev => ({ ...prev, [key]: val }))

  // Sincronizar al abrir
  useEffect(() => {
    if (isOpen) {
      setLocal({
        locationFilter: filters.locationFilter,
        bedrooms:       filters.bedrooms,
        maxPrice:       filters.maxPrice === Infinity ? 2_000_000 : filters.maxPrice,
        featureIds:     filters.featureIds ?? [],
      })
    }
  }, [isOpen, filters.locationFilter, filters.bedrooms, filters.maxPrice, filters.featureIds])

  // Load features once
  useEffect(() => {
    getPublicFeatures().then((data) => {
      const grouped = data.reduce((acc, feat) => {
        const cat = feat.category || 'general'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(feat)
        return acc
      }, {})
      setGroupedFeatures(grouped)
      const cats = Object.keys(grouped).sort()
      setCategories(cats)
      if (cats.length > 0) setActiveTab(cats[0])
      setFeaturesLoading(false)
    })
  }, [])

  // Bloquear scroll del body + cerrar con ESC
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleApply() {
    onApply({
      locationFilter: local.locationFilter,
      bedrooms:       local.bedrooms,
      maxPrice:       local.maxPrice >= 2_000_000 ? Infinity : local.maxPrice,
      featureIds:     local.featureIds,
    })
    onClose()
  }

  function handleReset() {
    setLocal({ locationFilter: 'all', bedrooms: 'all', maxPrice: 2_000_000, featureIds: [] })
  }

  function toggleFeature(id) {
    setLocal(prev => ({
      ...prev,
      featureIds: prev.featureIds.includes(id)
        ? prev.featureIds.filter((f) => f !== id)
        : [...prev.featureIds, id],
    }))
  }

  // Prettify fallback when translation key isn't found
  function fmt(key) {
    if (!key) return ''
    return key.replace(/[-_.]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const PillGroup = ({ options, value, onChange }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(({ v, label }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            value === v
              ? 'bg-secondary-900 text-white border-secondary-900'
              : 'bg-white text-secondary-600 border-secondary-200 hover:border-secondary-400'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )

  // ── Shared features section (rendered inside both mobile and desktop) ─────
  const FeaturesSection = ({ mobile = false }) => {
    if (featuresLoading) return null
    if (categories.length === 0) return null

    return (
      <div className={mobile ? 'px-5 py-6' : ''}>
        {!mobile && (
          <p className="text-sm font-semibold text-secondary-800 mb-3">
            {t('properties:filters.featuresLabel', 'Características')}
          </p>
        )}
        {mobile && (
          <h2 className="text-sm font-bold text-secondary-900 mb-4">
            {t('properties:filters.featuresLabel', 'Características')}
          </h2>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none border-b border-secondary-100">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === cat
                  ? 'text-primary-700 border-primary-700 bg-primary-50/50'
                  : 'text-secondary-500 border-transparent hover:text-secondary-800 hover:bg-secondary-50'
              }`}
            >
              {t(`admin:properties.features.categories.${cat}`, { ns: 'admin', defaultValue: fmt(cat) })}
              {groupedFeatures[cat]?.some((f) => local.featureIds.includes(f.id)) && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary-700 text-white text-[9px] font-bold">
                  {groupedFeatures[cat].filter((f) => local.featureIds.includes(f.id)).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Feature checkboxes */}
        {activeTab && groupedFeatures[activeTab] && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {groupedFeatures[activeTab].map((feat) => {
              const checked = local.featureIds.includes(feat.id)
              return (
                <label
                  key={feat.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                    checked
                      ? 'bg-primary-50 border-primary-300 ring-1 ring-primary-300'
                      : 'bg-white border-secondary-200 hover:border-primary-200 hover:bg-secondary-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleFeature(feat.id)}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-secondary-300 shrink-0 pointer-events-none"
                  />
                  <span className={`text-sm font-medium ${checked ? 'text-primary-900' : 'text-secondary-700'}`}>
                    {t(feat.feature_key, { ns: 'features', defaultValue: fmt(feat.feature_key) })}
                  </span>
                </label>
              )
            })}
          </div>
        )}

        {/* Active features count */}
        {local.featureIds.length > 0 && (
          <p className="mt-3 text-xs text-primary-700 font-medium">
            {local.featureIds.length} {local.featureIds.length === 1 ? 'característica seleccionada' : 'características seleccionadas'}
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      {/* ═══ MÓVIL: pantalla completa, sin overlay ═══ */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de búsqueda"
        className="sm:hidden animate-slide-right fixed inset-0 z-50 bg-white flex flex-col"
      >
        {/* Header sticky */}
        <div className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-secondary-100">
          <button
            type="button"
            onClick={onClose}
            aria-label="Volver"
            className="p-2 -ml-2 rounded-full hover:bg-secondary-100 text-secondary-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="flex-1 text-base font-bold text-secondary-900">{t('properties:filters.title', 'Filtros')}</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-full hover:bg-secondary-100 text-secondary-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-secondary-100">

          {/* Ubicación */}
          <section className="px-5 py-6">
            <h2 className="text-sm font-bold text-secondary-900 mb-4">{t('properties:filters.location', 'Ubicación')}</h2>
            <HierarchicalLocationSelect
              provinces={provinces}
              value={local.locationFilter}
              onChange={(v) => set('locationFilter', v)}
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 bg-white text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </section>

          {/* Habitaciones */}
          <section className="px-5 py-6">
            <h2 className="text-sm font-bold text-secondary-900 mb-4">{t('properties:filters.bedroomsLabel', 'Habitaciones')}</h2>
            <PillGroup
              value={local.bedrooms}
              onChange={(v) => set('bedrooms', v)}
              options={[
                { v: 'all', label: t('properties:filters.bedrooms.any', 'Cualquiera') },
                { v: '0',   label: t('properties:filters.bedrooms.studio', 'Estudio') },
                { v: '1',   label: '1' },
                { v: '2',   label: '2' },
                { v: '3',   label: '3' },
                { v: '4',   label: t('properties:filters.bedrooms.4plus', '4+') },
              ]}
            />
          </section>

          {/* Precio */}
          <section className="px-5 py-6">
            <h2 className="text-sm font-bold text-secondary-900 mb-1">
              {t('properties:filters.maxPrice', 'Precio máximo')}{' '}
              <span className="text-primary-700">
                {local.maxPrice >= 2_000_000 ? t('properties:filters.maxPriceNone', '— Sin límite') : `— ${PRICE_FORMAT.format(local.maxPrice)}`}
              </span>
            </h2>
            <p className="text-xs text-secondary-400 mb-4">{t('properties:filters.dragToAdjust', 'Arrastra para ajustar')}</p>
            <input
              type="range"
              min={50_000}
              max={2_000_000}
              step={25_000}
              value={local.maxPrice}
              onChange={(e) => set('maxPrice', Number(e.target.value))}
              className="w-full accent-primary-700 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-secondary-400 mt-2">
              <span>{t('properties:filters.priceMin', '50.000 €')}</span>
              <span>{t('properties:filters.noLimit', 'Sin límite')}</span>
            </div>
          </section>

          {/* Características */}
          <section>
            <FeaturesSection mobile />
          </section>

        </div>

        {/* Footer sticky */}
        <div className="shrink-0 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-secondary-100 flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-secondary-500 hover:text-secondary-900 underline underline-offset-2 transition-colors whitespace-nowrap"
          >
            {t('common:btn.clearFilters', 'Limpiar filtros')}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3.5 bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm rounded-xl transition-colors"
          >
            {t('common:btn.applyFilters', 'Aplicar filtros')}
          </button>
        </div>
      </div>

      {/* ═══ DESKTOP: modal centrado con overlay oscuro ═══ */}
      <div className="hidden sm:block">
        {/* Overlay */}
        <div
          className="animate-overlay-in fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Panel — wider to accommodate features grid */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filtros de búsqueda"
          className="animate-modal-in fixed z-50 inset-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     bg-white rounded-2xl shadow-2xl w-[min(680px,95vw)] max-h-[88dvh]
                     flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-secondary-100">
            <h2 className="text-base font-bold text-secondary-900">{t('properties:filters.title', 'Filtros')}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar filtros"
              className="p-2 rounded-full hover:bg-secondary-100 transition-colors text-secondary-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

            <div>
              <label className="text-sm font-semibold text-secondary-800 block mb-3">{t('properties:filters.location', 'Ubicación')}</label>
              <HierarchicalLocationSelect
                provinces={provinces}
                value={local.locationFilter}
                onChange={(v) => set('locationFilter', v)}
                className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm text-secondary-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-secondary-800 mb-3">{t('properties:filters.bedroomsLabel', 'Habitaciones')}</legend>
              <PillGroup
                value={local.bedrooms}
                onChange={(v) => set('bedrooms', v)}
                options={[
                  { v: 'all', label: t('properties:filters.bedrooms.any', 'Cualquiera') },
                  { v: '0',   label: t('properties:filters.bedrooms.studio', 'Estudio') },
                  { v: '1',   label: '1' },
                  { v: '2',   label: '2' },
                  { v: '3',   label: '3' },
                  { v: '4',   label: t('properties:filters.bedrooms.4plus', '4+') },
                ]}
              />
            </fieldset>

            <div>
              <p className="text-sm font-semibold text-secondary-800 mb-1">
                {t('properties:filters.maxPrice', 'Precio máximo')}:{' '}
                <span className="text-primary-700 font-bold">
                  {local.maxPrice >= 2_000_000 ? t('properties:filters.noLimit', 'Sin límite') : PRICE_FORMAT.format(local.maxPrice)}
                </span>
              </p>
              <p className="text-xs text-secondary-400 mb-3">{t('properties:filters.dragSubtitle', 'Arrastra para ajustar el presupuesto')}</p>
              <input
                type="range"
                min={50_000}
                max={2_000_000}
                step={25_000}
                value={local.maxPrice}
                onChange={(e) => set('maxPrice', Number(e.target.value))}
                className="w-full accent-primary-700 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-secondary-400 mt-1">
                <span>{t('properties:filters.priceMin', '50.000 €')}</span>
                <span>{t('properties:filters.noLimit', 'Sin límite')}</span>
              </div>
            </div>

            {/* ── Features ── */}
            <div>
              <FeaturesSection mobile={false} />
            </div>

          </div>

          {/* Footer */}
          <div className="shrink-0 px-6 py-4 border-t border-secondary-100 flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-secondary-500 hover:text-secondary-800 underline underline-offset-2 transition-colors whitespace-nowrap"
            >
              {t('common:btn.clearFilters', 'Limpiar filtros')}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-3 bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              {t('common:btn.applyFilters', 'Aplicar filtros')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
