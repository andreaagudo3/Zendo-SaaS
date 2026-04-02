/**
 * propertyService.js — Acceso a datos de propiedades via Supabase.
 *
 * Campos de la tabla `properties`:
 *   id, reference_code, title, description, price, bedrooms, bathrooms,
 *   size_m2, city, slug, property_type, listing_type, status, featured
 *
 * Imágenes en Supabase Storage:
 *   Bucket: "properties"  /  Carpeta: "{reference_code}/"
 *   ej. properties/A738/img1.jpg, properties/A738/img2.jpg
 */

import { supabase } from './supabaseClient'
import { getPropertyImagesFromDB } from './imageService'

// Fallback when no images exist in storage or DB
const PLACEHOLDER_IMAGE = '/images/property-placeholder.jpg'

// ─── Configuración ───────────────────────────────────────────────────────────

const STORAGE_BUCKET = 'properties'

const PROPERTY_FIELDS = [
  'id',
  'reference_code',
  'title',
  'description',
  'price',
  'bedrooms',
  'bathrooms',
  'size_m2',
  'location_id',
  'slug',
  'property_type',
  'listing_type',
  'status',
  'featured',
  'meta_title',
  'meta_description',
  'locations!properties_location_id_fkey(id, name, slug, provinces(name))'
].join(', ')

// ─── Storage helpers ─────────────────────────────────────────────────────────

/**
 * Obtiene la URL pública de la imagen de portada de una propiedad
 * (primer archivo del bucket, ordenado alfabéticamente).
 * Devuelve PLACEHOLDER_IMAGE si la carpeta está vacía o da error.
 *
 * @param {string} referenceCode — ej. 'A738'
 * @returns {Promise<string>} URL de la imagen de portada
 */
export async function getCoverImage(referenceCode) {
  const { data: files, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(referenceCode, { sortBy: { column: 'name', order: 'asc' } })

  console.debug(`[Storage getCoverImage] ref="${referenceCode}"`, { files, error })

  if (error || !files || files.length === 0) {
    if (error) console.warn(`[Storage] getCoverImage error:`, error)
    return PLACEHOLDER_IMAGE
  }

  const imageFiles = files.filter((f) => f.name && !f.name.startsWith('.'))
  console.debug(`[Storage getCoverImage] imageFiles:`, imageFiles)

  if (imageFiles.length === 0) return PLACEHOLDER_IMAGE

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(`${referenceCode}/${imageFiles[0].name}`)

  console.debug(`[Storage getCoverImage] publicUrl:`, data?.publicUrl)
  return data.publicUrl ?? PLACEHOLDER_IMAGE
}

/**
 * Obtiene las URLs públicas de TODAS las imágenes de una propiedad
 * desde Supabase Storage.
 *
 * @param {string} referenceCode — ej. 'A738'
 * @returns {Promise<string[]>} Array de URLs públicas, ordenadas alfabéticamente
 */
export async function getPropertyImages(referenceCode) {
  const { data: files, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(referenceCode, { sortBy: { column: 'name', order: 'asc' } })

  console.debug(`[Storage getPropertyImages] ref="${referenceCode}"`, { files, error })

  if (error || !files || files.length === 0) {
    if (error) console.warn(`[Storage] getPropertyImages error:`, error)
    return []
  }

  const imageFiles = files.filter(
    (f) => f.name && !f.name.startsWith('.')
  )
  console.debug(`[Storage getPropertyImages] imageFiles after filter:`, imageFiles)

  return imageFiles.map((file) => {
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(`${referenceCode}/${file.name}`)
    return data.publicUrl
  })
}

// ─── Helpers internos ────────────────────────────────────────────────────────

/**
 * Enriches a property array with images[] and coverImage.
 *
 * Strategy (in priority order):
 *   1. property_images table  — new multi-tenant system
 *   2. Supabase Storage scan  — legacy fallback (reference_code folder)
 *
 * This dual-lookup guarantees backward compatibility while tenants
 * migrate their images to the new system.
 *
 * @param {object[]} properties
 * @returns {Promise<object[]>}
 */
async function withImages(properties) {
  if (!properties || properties.length === 0) return []

  return Promise.all(
    properties.map(async (property) => {
      // 1. Try the new property_images table
      const dbImages = await getPropertyImagesFromDB(property.id)

      if (dbImages.length > 0) {
        const cover = dbImages.find((i) => i.is_cover) ?? dbImages[0]
        return {
          ...property,
          images: dbImages.map((i) => i.url),
          coverImage: cover.url,
        }
      }

      // 2. Legacy fallback: scan Storage bucket by reference_code
      const images = await getPropertyImages(property.reference_code)
      const coverImage = images.length > 0 ? images[0] : PLACEHOLDER_IMAGE
      return { ...property, images, coverImage }
    })
  )
}

// ─── Queries públicas ─────────────────────────────────────────────────────────

export async function getProperties(tenantId) {
  if (!tenantId) return []
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_FIELDS)
    .eq('tenant_id', tenantId)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[propertyService] getProperties:', error.message)
    return []
  }

  return withImages(data ?? [])
}

export async function getFeaturedProperties(tenantId) {
  if (!tenantId) return []
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_FIELDS)
    .eq('tenant_id', tenantId)
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[propertyService] getFeaturedProperties:', error.message)
    return []
  }

  return withImages(data ?? [])
}

export async function getPropertyBySlug(slug, tenantId) {
  if (!tenantId) return null
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_FIELDS)
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    console.error(`[propertyService] getPropertyBySlug("${slug}"):`, error.message)
    return null
  }

  if (!data) return null

  // Try new property_images table first
  const dbImages = await getPropertyImagesFromDB(data.id)
  if (dbImages.length > 0) {
    const cover = dbImages.find((i) => i.is_cover) ?? dbImages[0]
    return {
      ...data,
      images: dbImages.map((i) => i.url),
      coverImage: cover.url,
    }
  }

  // Legacy fallback
  const images = await getPropertyImages(data.reference_code)
  return { ...data, images, coverImage: images[0] ?? PLACEHOLDER_IMAGE }
}

/**
 * Busca propiedades con filtros Y paginación real en Supabase.
 * Reemplaza el viejo slice en cliente con .range() servidor.
 *
 * @param {SearchFilters} filters
 * @param {number} page — página actual (1-based)
 * @returns {Promise<{ data: Property[], count: number }>}
 */
export const PAGE_SIZE = 12

export async function getPropertiesPaginated(filters = {}, page = 1, tenantId) {
  if (!tenantId) return { data: [], count: 0 }
  const { locationFilter, listing_type, bedrooms, minPrice, maxPrice } = filters

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('properties')
    .select(PROPERTY_FIELDS, { count: 'exact' })
    .eq('tenant_id', tenantId)
    .eq('published', true)

  // Filtro de ubicación jerárquico: 'loc:uuid' | 'prov:uuid' | 'all'
  if (locationFilter && locationFilter !== 'all') {
    const [type, id] = locationFilter.split(':')
    if (type === 'loc') {
      query = query.eq('location_id', id)
    } else if (type === 'prov') {
      // PostgREST no soporta filtrar por campo de tabla joined en la tabla padre.
      // Solución: sub-query para obtener los location_id de esa provincia.
      const { data: locs, error: locErr } = await supabase
        .from('locations')
        .select('id')
        .eq('province_id', id)

      if (locErr) {
        console.error('[propertyService] province sub-query:', locErr.message)
        return { data: [], count: 0 }
      }

      const locationIds = (locs ?? []).map((l) => l.id)

      if (locationIds.length === 0) {
        // No hay localidades en esta provincia → resultado vacío garantizado
        return { data: [], count: 0 }
      }

      query = query.in('location_id', locationIds)
    }
  }
  if (listing_type && listing_type !== 'all') {
    query = query.eq('listing_type', listing_type)
  }
  if (bedrooms && bedrooms !== 'all') {
    query = query.gte('bedrooms', Number(bedrooms))
  }
  if (minPrice != null && minPrice > 0) {
    query = query.gte('price', minPrice)
  }
  if (maxPrice != null && maxPrice < Infinity) {
    query = query.lte('price', maxPrice)
  }

  query = query.order('created_at', { ascending: false }).range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('[propertyService] getPropertiesPaginated:', error.message)
    return { data: [], count: 0 }
  }

  const enriched = await withImages(data ?? [])
  return { data: enriched, count: count ?? 0 }
}

/**
 * Obtiene todas las provincias con sus localidades anidadas.
 * Usado para construir el selector jerárquico de ubicación.
 * @returns {Promise<Array<{ id: string, name: string, locations: Array<{id,name}> }>>}
 */
export async function getProvincesWithLocations(tenantId) {
  if (!tenantId) return []
  const { data, error } = await supabase
    .from('provinces')
    .select('id, name, locations(id, name, tenant_id)')
    .eq('tenant_id', tenantId)
    .order('name')

  if (error) {
    console.error('[propertyService] getProvincesWithLocations:', error.message)
    return []
  }

  // Ordenar localidades dentro de cada provincia y filtrar por tenantId si es necesario
  // (Aunque el select ya filtra, por si acaso la estructura del join pre-filtra la provincia)
  return (data ?? [])
    .map((prov) => ({
      ...prov,
      locations: (prov.locations ?? [])
        .filter(loc => loc.tenant_id === tenantId)
        .sort((a, b) => a.name.localeCompare(b.name, 'es')),
    }))
    .filter(prov => prov.locations.length > 0) // Solo provincias que tengan locations de este tenant
}

export async function searchProperties(filters = {}, tenantId) {
  if (!tenantId) return []
  const { location_id, listing_type, bedrooms, minPrice, maxPrice } = filters

  let query = supabase
    .from('properties')
    .select(PROPERTY_FIELDS)
    .eq('tenant_id', tenantId)
    .eq('published', true)

  if (location_id && location_id !== 'all') {
    query = query.eq('location_id', location_id)
  }
  if (listing_type && listing_type !== 'all') {
    query = query.eq('listing_type', listing_type)
  }
  if (bedrooms && bedrooms !== 'all') {
    query = query.gte('bedrooms', Number(bedrooms))
  }
  if (minPrice != null && minPrice > 0) {
    query = query.gte('price', minPrice)
  }
  if (maxPrice != null && maxPrice < Infinity) {
    query = query.lte('price', maxPrice)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('[propertyService] searchProperties:', error.message)
    return []
  }

  return withImages(data ?? [])
}

/**
 * @typedef {Object} SearchFilters
 * @property {string} [location_id]   — ID de la localidad seleccionada o 'all'
 * @property {string} [listing_type]  — 'sale' | 'rent' | 'all'
 * @property {string|number} [bedrooms] — número mínimo de habitaciones o 'all'
 * @property {number} [minPrice]      — precio mínimo
 * @property {number} [maxPrice]      — precio máximo (Infinity = sin límite)
 */

// ─── Types ────────────────────────────────────────────────────────────────────


/**
 * @typedef {Object} Property
 * @property {string}   id
 * @property {string}   reference_code
 * @property {string}   title
 * @property {string}   description
 * @property {number}   price
 * @property {number}   bedrooms
 * @property {number}   bathrooms
 * @property {number}   size_m2
 * @property {string}   location_id
 * @property {Object}   locations
 * @property {string}   slug
 * @property {string}   property_type   — 'casa' | 'piso' | 'finca' | 'local' | …
 * @property {string}   listing_type    — 'sale' | 'rent'
 * @property {string}   status          — 'available' | 'reserved' | 'sold'
 * @property {boolean}  featured
 * @property {string[]} images          — URLs públicas del bucket "properties"
 */
