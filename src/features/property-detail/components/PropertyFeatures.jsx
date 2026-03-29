import { useTranslation } from 'react-i18next'

export function PropertyFeatures({ bedrooms, bathrooms, size_m2 }) {
  const { t } = useTranslation('property')

  const SPECS = [
    bedrooms != null && {
      icon: '🛏️',
      label: bedrooms === 0
        ? t('features.bedrooms_other', { count: 0 })
        : t('features.bedrooms_one', { count: bedrooms, defaultValue_other: t('features.bedrooms_other', { count: bedrooms }) }),
      title: t('features.bedrooms_other', { count: bedrooms }),
    },
    bathrooms != null && {
      icon: '🚿',
      label: t('features.bathrooms_one', { count: bathrooms, defaultValue_other: t('features.bathrooms_other', { count: bathrooms }) }),
      title: t('features.bathrooms_other', { count: bathrooms }),
    },
    size_m2 != null && {
      icon: '📐',
      label: t('features.size', { size: size_m2 }),
      title: t('features.size', { size: size_m2 }),
    },
  ].filter(Boolean)

  if (SPECS.length === 0) return null

  return (
    <section aria-label="Características del inmueble">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('features.title', 'Características')}</h2>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SPECS.map(({ icon, label, title: specTitle }) => (
          <div key={specTitle} className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
            <span className="text-2xl" aria-hidden="true">{icon}</span>
            <dt className="text-xs text-slate-400 uppercase tracking-wide mt-1">{specTitle}</dt>
            <dd className="text-sm font-semibold text-slate-800 mt-0.5">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
