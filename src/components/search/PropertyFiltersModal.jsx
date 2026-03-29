import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HierarchicalLocationSelect } from './HierarchicalLocationSelect'

const PRICE_FORMAT = new Intl.NumberFormat('es-ES', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
})

/**
 * PropertyFiltersModal
 *
 * • Móvil (<640px): pantalla completa que entra por la derecha (estilo app nativa).
 *   Sin bottom sheet. Sin gestos de arrastre.
 * • Desktop (≥640px): modal centrado con overlay oscuro y animación fade+scale.
 *
 * Props:
 *   isOpen    — boolean
 *   onClose   — fn()
 *   filters   — objeto de filtros actual
 *   locations — array {id, name}
 *   onApply   — fn(partialFilters) — solo se aplica al pulsar "Aplicar filtros"
 */
export function PropertyFiltersModal({ isOpen, onClose, filters, provinces = [], onApply }) {
  const { t } = useTranslation(['properties', 'common'])
  // Estado local — no se aplica hasta pulsar "Aplicar filtros"
  const [local, setLocal] = useState({
    locationFilter: filters.locationFilter,
    bedrooms:       filters.bedrooms,
    maxPrice:       filters.maxPrice === Infinity ? 2_000_000 : filters.maxPrice,
  })

  const set = (key, val) => setLocal(prev => ({ ...prev, [key]: val }))

  // Sincronizar al abrir
  useEffect(() => {
    if (isOpen) {
      setLocal({
        locationFilter: filters.locationFilter,
        bedrooms:       filters.bedrooms,
        maxPrice:       filters.maxPrice === Infinity ? 2_000_000 : filters.maxPrice,
      })
    }
  }, [isOpen, filters.locationFilter, filters.bedrooms, filters.maxPrice])

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
    })
    onClose()
  }

  function handleReset() {
    setLocal({ locationFilter: 'all', bedrooms: 'all', maxPrice: 2_000_000 })
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
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )

  const SectionDivider = () => <hr className="border-slate-100" />

  return (
    <>
      {/* ═══ MÓVIL: pantalla completa, sin overlay ═══
          La pantalla ocupa el 100% del viewport y entra desde la derecha.
          El layout es idéntico a una pantalla nativa de iOS/Android.            */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de búsqueda"
        className="sm:hidden animate-slide-right fixed inset-0 z-50 bg-white flex flex-col"
      >
        {/* Header sticky */}
        <div className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          {/* Botón volver (izquierda) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Volver"
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="flex-1 text-base font-bold text-slate-900">{t('properties:filters.title', 'Filtros')}</h1>
          {/* Botón cerrar (derecha) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-slate-100">

          {/* Ubicación */}
          <section className="px-5 py-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">{t('properties:filters.location', 'Ubicación')}</h2>
            <HierarchicalLocationSelect
              provinces={provinces}
              value={local.locationFilter}
              onChange={(v) => set('locationFilter', v)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </section>

          {/* Habitaciones */}
          <section className="px-5 py-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">{t('properties:filters.bedroomsLabel', 'Habitaciones')}</h2>
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
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              {t('properties:filters.maxPrice', 'Precio máximo')}{' '}
              <span className="text-primary-700">
                {local.maxPrice >= 2_000_000 ? t('properties:filters.maxPriceNone', '— Sin límite') : `— ${PRICE_FORMAT.format(local.maxPrice)}`}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">{t('properties:filters.dragToAdjust', 'Arrastra para ajustar')}</p>
            <input
              type="range"
              min={50_000}
              max={2_000_000}
              step={25_000}
              value={local.maxPrice}
              onChange={(e) => set('maxPrice', Number(e.target.value))}
              className="w-full accent-primary-700 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>{t('properties:filters.priceMin', '50.000 €')}</span>
              <span>{t('properties:filters.noLimit', 'Sin límite')}</span>
            </div>
          </section>

        </div>

        {/* Footer sticky */}
        <div className="shrink-0 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors whitespace-nowrap"
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

        {/* Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filtros de búsqueda"
          className="animate-modal-in fixed z-50 inset-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     bg-white rounded-2xl shadow-2xl w-[min(540px,95vw)] max-h-[88dvh]
                     flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">{t('properties:filters.title', 'Filtros')}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar filtros"
              className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

            <div>
              <label className="text-sm font-semibold text-slate-800 block mb-3">{t('properties:filters.location', 'Ubicación')}</label>
              <HierarchicalLocationSelect
                provinces={provinces}
                value={local.locationFilter}
                onChange={(v) => set('locationFilter', v)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-slate-800 mb-3">{t('properties:filters.bedroomsLabel', 'Habitaciones')}</legend>
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
              <p className="text-sm font-semibold text-slate-800 mb-1">
                {t('properties:filters.maxPrice', 'Precio máximo')}:{' '}
                <span className="text-primary-700 font-bold">
                  {local.maxPrice >= 2_000_000 ? t('properties:filters.noLimit', 'Sin límite') : PRICE_FORMAT.format(local.maxPrice)}
                </span>
              </p>
              <p className="text-xs text-slate-400 mb-3">{t('properties:filters.dragSubtitle', 'Arrastra para ajustar el presupuesto')}</p>
              <input
                type="range"
                min={50_000}
                max={2_000_000}
                step={25_000}
                value={local.maxPrice}
                onChange={(e) => set('maxPrice', Number(e.target.value))}
                className="w-full accent-primary-700 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{t('properties:filters.priceMin', '50.000 €')}</span>
                <span>{t('properties:filters.noLimit', 'Sin límite')}</span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors whitespace-nowrap"
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
