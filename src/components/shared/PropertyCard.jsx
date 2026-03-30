import { Link } from 'react-router-dom'
import { Badge } from './Badge'
import { PropertyDescription } from './PropertyDescription'
import { SITE } from '../../config/siteConfig'

/**
 * Formats a price number to a locale string.
 */
function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * PropertyCard — tarjeta reutilizable para listados de propiedades.
 * Usa los campos reales del schema de Supabase.
 */
export function PropertyCard({ property }) {
  const {
    slug,
    title,
    listing_type,
    price,
    bedrooms,
    bathrooms,
    size_m2,
    description,
    coverImage,
    status,
  } = property

  const href = `/properties/${slug}`
  
  const isMinimal = SITE.theme === 'MINIMAL'
  const isCorporate = SITE.theme === 'CORPORATE'
  const isPortal = SITE.theme === 'PORTAL'

  const containerClass = [
    'group relative overflow-hidden flex flex-col transition-all duration-500 rounded-2xl bg-white border shadow-card hover:shadow-hover',
    isMinimal ? 'ease-minimal border-secondary-100 hover:-translate-y-1' : '',
    isCorporate ? 'ease-corporate border-secondary-200 hover:border-primary-600' : '',
    isPortal ? 'ease-portal border-secondary-100 hover:scale-[1.02]' : '',
  ].filter(Boolean).join(' ')

  const imageWrapperClass = `block overflow-hidden ${isPortal ? 'aspect-[4/3]' : 'aspect-video'} bg-secondary-100`

  const contentClass = `flex flex-col flex-1 ${
    isPortal ? 'p-3 sm:p-4 gap-2' : isCorporate ? 'p-6 gap-4' : 'p-5 lg:p-6 gap-3'
  }`

  const titleClass = `text-secondary-900 leading-snug ${
    isPortal ? 'font-bold text-base line-clamp-1' : isCorporate ? 'text-lg tracking-wide uppercase font-extrabold' : 'text-lg lg:text-xl font-semibold'
  }`

  const priceClass = `text-secondary-950 font-bold ${
    isPortal ? 'text-xl' : 'text-2xl'
  }`

  const specsClass = `flex items-center pt-3 border-t border-secondary-100 text-secondary-600 mt-auto ${
    isPortal ? 'gap-3 text-xs' : isCorporate ? 'gap-5 text-sm font-bold uppercase tracking-wide' : 'gap-4 text-sm font-medium'
  }`

  // Conditional Icons
  const BedIcon = isMinimal 
    ? () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    : () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path d="M1 14a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2z" /></svg>

  const BathIcon = isMinimal
    ? () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    : () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12H3V8a4 4 0 014-4h2a4 4 0 014 4h8v4zm-9 6a5 5 0 01-5-5H3a9 9 0 0018 0h-4a5 5 0 01-5 5z" /></svg>

  const SizeIcon = isMinimal
    ? () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
    : () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" clipRule="evenodd" /></svg>

  return (
    <article className={containerClass}>
      <Link
        to={href}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalles de ${title}`}
      />

      <div className={imageWrapperClass}>
        <img
          src={coverImage}
          alt={`Fotografía de ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/images/property-placeholder.jpg' }}
        />
      </div>

      <div className={contentClass}>
        {/* Badges */}
        {(listing_type || status === 'reserved' || status === 'sold') && (
          <div className={`flex gap-2 flex-wrap ${isPortal ? 'absolute top-3 left-3 z-20' : ''}`}>
            {listing_type && (
              <Badge
                label={listing_type === 'sale' ? 'Compra' : 'Alquiler'}
                variant={listing_type}
              />
            )}
            {status === 'reserved' && <Badge label="Reservado" variant="reserved" />}
            {status === 'sold' && <Badge label="Vendido" variant="sold" />}
          </div>
        )}

        <h3 className={titleClass}>{title}</h3>

        {!isPortal && description && (
          <div className="text-sm">
            <PropertyDescription
              text={description}
              className="line-clamp-2 text-secondary-500 text-sm leading-relaxed"
            />
          </div>
        )}

        {price != null && (
          <p className={priceClass}>
            {formatPrice(price)}
            {listing_type === 'rent' && (
              <span className="text-sm font-normal text-secondary-500 ml-1">/mes</span>
            )}
          </p>
        )}

        {(bedrooms != null || bathrooms != null || size_m2 != null) && (
          <div className={specsClass}>
            {bedrooms != null && (
              <span className="flex items-center gap-1.5">
                <BedIcon />
                {bedrooms === 0 ? 'Estudio' : `${bedrooms}`}
              </span>
            )}
            {bathrooms != null && (
              <span className="flex items-center gap-1.5">
                <BathIcon />
                {bathrooms}
              </span>
            )}
            {size_m2 != null && (
              <span className="flex items-center gap-1.5">
                <SizeIcon />
                {size_m2}m²
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
