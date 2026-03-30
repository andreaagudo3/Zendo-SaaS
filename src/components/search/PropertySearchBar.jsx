import { useTranslation } from 'react-i18next'
import { HierarchicalLocationSelect } from './HierarchicalLocationSelect'
import { SITE } from '../../config/siteConfig'

const PRICE_FORMAT = new Intl.NumberFormat('es-ES', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
})

export function PropertySearchBar({
  filters,
  provinces,
  onFilterChange,
  onOpenModal,
  activeAdvancedCount = 0,
}) {
  const { t } = useTranslation(['properties', 'common'])

  const priceOptions = [
    { value: Infinity, label: t('properties:filters.noLimit', 'Sin límite') },
    { value: 150_000, label: t('properties:filters.maxPriceVal', 'Hasta {{price}}', { price: '150.000 €' }) },
    { value: 200_000, label: t('properties:filters.maxPriceVal', 'Hasta {{price}}', { price: '200.000 €' }) },
    { value: 300_000, label: t('properties:filters.maxPriceVal', 'Hasta {{price}}', { price: '300.000 €' }) },
    { value: 500_000, label: t('properties:filters.maxPriceVal', 'Hasta {{price}}', { price: '500.000 €' }) },
    { value: 750_000, label: t('properties:filters.maxPriceVal', 'Hasta {{price}}', { price: '750.000 €' }) },
    { value: 1_000_000, label: t('properties:filters.maxPriceVal', 'Hasta {{price}}', { price: '1.000.000 €' }) },
  ]

  return (
    <>
      {/* ── DESKTOP ── */}
      <div className="hidden md:flex items-stretch bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden divide-x divide-secondary-100">
        
        {/* Ubicación */}
        <div className="flex flex-col justify-center px-4 py-3 flex-1 min-w-0">
          <label className="text-[10px] font-semibold text-secondary-400 uppercase tracking-wider mb-1">
            {t('properties:filters.location', 'Ubicación')}
          </label>
          <HierarchicalLocationSelect
            provinces={provinces}
            value={filters.locationFilter}
            onChange={(v) => onFilterChange('locationFilter', v)}
            allLabel={t('common:location.any', 'Cualquier ubicación')}
            className="text-sm text-secondary-800 bg-transparent focus:outline-none cursor-pointer truncate"
          />
        </div>

        {/* Tipo de operación */}
        <div className="flex flex-col justify-center px-4 py-3 min-w-[140px]">
          <label className="text-[10px] font-semibold text-secondary-400 uppercase tracking-wider mb-1">
            {t('properties:filters.operation', 'Operación')}
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="text-sm text-secondary-800 bg-transparent focus:outline-none cursor-pointer"
            aria-label="Filtrar por tipo de operación"
          >
            <option value="all">{t('common:listing.all', 'Compra o alquiler')}</option>
            <option value="sale">{t('common:listing.sale', 'En venta')}</option>
            <option value="rent">{t('common:listing.rent', 'En alquiler')}</option>
          </select>
        </div>

        {/* Precio */}
        <div className="flex flex-col justify-center px-4 py-3 min-w-[180px]">
          <label className="text-[10px] font-semibold text-secondary-400 uppercase tracking-wider mb-1">
            {t('properties:filters.maxPrice', 'Precio máximo')}
          </label>
          <select
            value={filters.maxPrice}
            onChange={(e) => {
              const val = e.target.value === 'Infinity' ? Infinity : Number(e.target.value)
              onFilterChange('maxPrice', val)
            }}
            className="text-sm text-secondary-800 bg-transparent focus:outline-none cursor-pointer"
            aria-label="Filtrar por precio máximo"
          >
            {priceOptions.map(({ value, label }) => (
              <option key={label} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Botón Más filtros */}
        {SITE.features.advancedFilters && (
          <button
            type="button"
            onClick={onOpenModal}
            className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium text-secondary-600 hover:bg-secondary-50 transition-colors whitespace-nowrap"
            aria-label="Abrir más filtros"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {t('properties:filters.moreFilters', 'Más filtros')}
            {activeAdvancedCount > 0 && (
              <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-700 text-white text-[10px] font-bold leading-none">
                {activeAdvancedCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ── MOBILE ── */}
      <div className="flex md:hidden items-center gap-2">
        {/* Selector de ubicación simplificado */}
        <div className="flex-1 relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <HierarchicalLocationSelect
            provinces={provinces}
            value={filters.locationFilter}
            onChange={(v) => onFilterChange('locationFilter', v)}
            allLabel={t('common:location.any', 'Cualquier ubicación')}
            className="w-full pl-9 pr-3 py-3 rounded-xl border border-secondary-200 bg-white text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>

        {/* Botón Filtros mobile */}
        {SITE.features.advancedFilters && (
          <button
            type="button"
            onClick={onOpenModal}
            className="relative flex items-center gap-1.5 px-4 py-3 rounded-xl border border-secondary-200 bg-white text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors whitespace-nowrap shadow-sm"
            aria-label="Abrir filtros"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {t('properties:filters.title', 'Filtros')}
            {activeAdvancedCount + (filters.type !== 'all' ? 1 : 0) + (filters.maxPrice !== Infinity ? 1 : 0) > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 text-white text-[10px] font-bold">
                {activeAdvancedCount + (filters.type !== 'all' ? 1 : 0) + (filters.maxPrice !== Infinity ? 1 : 0)}
              </span>
            )}
          </button>
        )}
      </div>
    </>
  )
}
