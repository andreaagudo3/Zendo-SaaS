import { useTranslation } from 'react-i18next'
import { Badge } from '../../../components/shared/Badge'
import { SITE } from '../../../config/siteConfig'

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function PropertyHeader({ title, listing_type, price, status, locationString }) {
  const { t } = useTranslation('property')

  return (
    <header>
      {(listing_type || status === 'reserved' || status === 'sold') && (
        <div className="flex flex-wrap gap-2 mb-3">
          {listing_type && (
            <Badge
              label={listing_type === 'sale' ? t('header.forSale') : t('header.forRent')}
              variant={listing_type}
            />
          )}
          {status === 'reserved' && <Badge label={t('header.status.reserved')} variant="reserved" />}
          {status === 'sold'     && <Badge label={t('header.status.sold')}     variant="sold"     />}
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-slate-950 mb-2">{title}</h1>

      {locationString && (
        SITE.features.googleMaps ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationString)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('header.mapsAriaLabel')}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-primary-700 hover:underline underline-offset-2 transition-colors cursor-pointer w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {locationString}
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-slate-500 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {locationString}
          </span>
        )
      )}

      {price != null && (
        <p className="text-4xl font-extrabold text-slate-950 mt-4">
          {formatPrice(price)}
          {listing_type === 'rent' && <span className="text-lg font-normal text-slate-500 ml-1">{t('header.perMonth', '/mes')}</span>}
        </p>
      )}
    </header>
  )
}
