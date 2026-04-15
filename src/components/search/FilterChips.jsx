import { useTranslation } from 'react-i18next'

/**
 * FilterChips — fila de chips removibles que muestran los filtros activos.
 * Props:
 *   filters      — objeto de filtros actual
 *   provinces    — array de { id, name, locations: [{id, name}] }
 *   allFeatures  — array de { id, feature_key } para resolver labels de features
 *   onRemove     — fn(key, value?) para quitar un filtro individual
 *   onClearAll   — fn() para limpiar todos los filtros
 */

const PRICE_FORMAT = new Intl.NumberFormat('es-ES', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
})

/** Resuelve el nombre de una ubicación a partir de el valor 'loc:uuid' o 'prov:uuid'. */
function resolveLocationLabel(locationFilter, provinces) {
  if (!locationFilter || locationFilter === 'all') return null
  const [type, id] = locationFilter.split(':')
  if (type === 'prov') {
    const prov = provinces.find((p) => p.id === id)
    return prov ? `${prov.name} (provincia)` : null
  }
  if (type === 'loc') {
    for (const prov of provinces) {
      const loc = prov.locations?.find((l) => l.id === id)
      if (loc) return loc.name
    }
  }
  return null
}

function fmt(key) {
  if (!key) return ''
  return key.replace(/[-_.]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function FilterChips({ filters, provinces = [], allFeatures = [], onRemove, onClearAll }) {
  const { t } = useTranslation(['properties', 'common', 'features'])
  const chips = []

  if (filters.type !== 'all') {
    chips.push({
      key: 'type',
      label: filters.type === 'sale' ? t('common:type.sale') : t('common:type.rent'),
      onRemove: () => onRemove('type'),
    })
  }

  const locationLabel = resolveLocationLabel(filters.locationFilter, provinces)
  if (locationLabel) {
    chips.push({
      key: 'locationFilter',
      label: locationLabel,
      onRemove: () => onRemove('locationFilter'),
    })
  }

  if (filters.bedrooms !== 'all') {
    chips.push({
      key: 'bedrooms',
      label: filters.bedrooms === '0'
        ? t('properties:filters.bedrooms.studio')
        : `${filters.bedrooms}+ hab.`,
      onRemove: () => onRemove('bedrooms'),
    })
  }

  if (filters.maxPrice !== Infinity) {
    chips.push({
      key: 'maxPrice',
      label: `Hasta ${PRICE_FORMAT.format(filters.maxPrice)}`,
      onRemove: () => onRemove('maxPrice'),
    })
  }

  // Feature chips — one per active feature
  if (filters.featureIds?.length > 0) {
    filters.featureIds.forEach((fid) => {
      const feat = allFeatures.find((f) => f.id === fid)
      const label = feat
        ? t(feat.feature_key, { ns: 'features', defaultValue: fmt(feat.feature_key) })
        : fid
      chips.push({
        key: `feature_${fid}`,
        label,
        onRemove: () => onRemove('featureIds', fid),
      })
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {chips.map(({ key, label, onRemove: handleRemove }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-primary-50 text-primary-800 border border-primary-200 text-sm font-medium"
        >
          {label}
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Quitar filtro: ${label}`}
            className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-secondary-400 hover:text-secondary-700 underline underline-offset-2 transition-colors ml-1"
      >
        {t('properties:chips.clearAll')}
      </button>
    </div>
  )
}
