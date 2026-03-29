import { useTranslation } from 'react-i18next'

/**
 * HierarchicalLocationSelect — selector de ubicación con jerarquía provincia → localidad.
 *
 * Usa <optgroup> nativos del HTML para máxima compatibilidad y accesibilidad.
 * El valor del select tiene el formato: 'all' | 'prov:uuid' | 'loc:uuid'
 *
 * Props:
 *   provinces    — array { id, name, locations: [{id, name}] }
 *   value        — string ('all' | 'prov:uuid' | 'loc:uuid')
 *   onChange     — fn(newValue: string)
 *   className    — clases adicionales para el <select>
 *   allLabel     — texto de la opción "sin filtro" (default: "Todas las ubicaciones")
 */
export function HierarchicalLocationSelect({
  provinces = [],
  value,
  onChange,
  className = '',
  allLabel,
}) {
  const { t } = useTranslation('common')
  const finalAllLabel = allLabel || t('location.any', 'Todas las ubicaciones')

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      aria-label={t('location.filterAria', 'Filtrar por ubicación')}
    >
      <option value="all">{finalAllLabel}</option>

      {provinces.map((prov) => (
        <optgroup key={prov.id} label={`— ${prov.name} —`}>
          {/* Opción de seleccionar toda la provincia */}
          <option value={`prov:${prov.id}`}>
            {t('location.entireProvince', 'Toda la provincia de {{name}}', { name: prov.name })}
          </option>
          {/* Localidades de esa provincia */}
          {prov.locations.map((loc) => (
            <option key={loc.id} value={`loc:${loc.id}`}>
              &nbsp;&nbsp;{loc.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}
