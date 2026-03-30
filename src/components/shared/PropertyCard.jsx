import { Link } from 'react-router-dom'
import { Badge } from './Badge'
import { PropertyDescription } from './PropertyDescription'

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
 * Usa los campos reales del schema de Supabase:
 *   coverImage, listing_type, size_m2, slug
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
    locations,
    description,
    coverImage,
    featured,
    status,
  } = property

  // El enlace usa slug para URLs SEO-friendly (/properties/casa-aracena-centro)
  const href = `/properties/${slug}`

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-secondary-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Stretched link — hace clickable toda la card */}
      <Link
        to={href}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalles de ${title}`}
      />

      {/* Image */}
      <div className="block overflow-hidden">
        <div className="aspect-video overflow-hidden bg-secondary-100">
          <img
            src={coverImage}
            alt={`Fotografía de ${title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = '/images/property-placeholder.jpg' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Badges */}
        {(listing_type || status === 'reserved' || status === 'sold') && (
          <div className="flex gap-2 flex-wrap">
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

        {/* Title */}
        <h3 className="text-lg font-semibold text-secondary-900 leading-snug">{title}</h3>



        {/* Description snippet */}
        {description && (
          <div className="text-sm">
            <PropertyDescription
              text={description}
              className="line-clamp-2 text-secondary-500 text-sm leading-snug"
            />
          </div>
        )}

        {/* Price */}
        {price != null && (
          <p className="text-2xl font-bold text-secondary-950">
            {formatPrice(price)}
            {listing_type === 'rent' && (
              <span className="text-sm font-normal text-secondary-500 ml-1">/mes</span>
            )}
          </p>
        )}

        {/* Specs — solo si hay al menos un valor */}
        {(bedrooms != null || bathrooms != null || size_m2 != null) && (
          <div className="flex items-center gap-4 pt-3 border-t border-secondary-100 text-sm text-secondary-600 mt-auto">
            {bedrooms != null && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  <path d="M1 14a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2z" />
                </svg>
                {bedrooms === 0 ? 'Estudio' : `${bedrooms} hab.`}
              </span>
            )}
            {bathrooms != null && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 12H3V8a4 4 0 014-4h2a4 4 0 014 4h8v4zm-9 6a5 5 0 01-5-5H3a9 9 0 0018 0h-4a5 5 0 01-5 5z" />
                </svg>
                {bathrooms} baños
              </span>
            )}
            {size_m2 != null && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" clipRule="evenodd" />
                </svg>
                {size_m2} m²
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
