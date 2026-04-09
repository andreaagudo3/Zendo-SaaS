/**
 * adminService.js — Servicios para el panel de administración.
 *
 * Requiere usuario autenticado (Supabase Auth) para INSERT/UPDATE/DELETE.
 * Lectura de todas las propiedades (sin filtro published).
 */

import { supabase } from './supabaseClient'

const STORAGE_BUCKET = 'properties'

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Inicia sesión con email y contraseña.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user, session, error}>}
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { ...data, error }
}

/**
 * Cierra la sesión actual.
 */
export async function signOut() {
  await supabase.auth.signOut()
}

/**
 * Obtiene la sesión activa actual.
 * @returns {Promise<Session|null>}
 */
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data?.session ?? null
}

/**
 * Actualiza los datos del inquilino (tenant) actual.
 * @param {string} id
 * @param {object} updates
 * @returns {Promise<{data, error}>}
 */
export async function updateTenant(id, updates) {
  const { data, error } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) console.error('[adminService] updateTenant:', error.message)
  return { data, error }
}

// ─── Properties CRUD ─────────────────────────────────────────────────────────

const ADMIN_FIELDS = [
  'id', 'reference_code', 'title', 'description', 'price',
  'bedrooms', 'bathrooms', 'size_m2', 'location_id', 'slug',
  'property_type', 'listing_type', 'status', 'featured', 'published',
  'meta_description',
  'meta_title',
  'image_cover_url',
  'internal_notes', 'owner_contact',
  'occupancy_status', 'condition', 'energy_rating', 'is_luxury', 'is_bank_owned',
  'locations!properties_location_id_fkey(id, name, slug, provinces(name))'
].join(', ')


/**
 * Obtiene TODAS las propiedades (publicadas o no) para el panel admin.
 * @returns {Promise<object[]>}
 */
export const ADMIN_PAGE_SIZE = 20

/**
 * Obtiene propiedades paginadas desde el servidor con filtros opcionales.
 * @param {number} page — página actual (1-based)
 * @param {string} search — texto de búsqueda (título, referencia o localidad)
 * @param {'all'|'featured'|'not_featured'} featuredFilter
 * @param {string} tenantId — ID del inquilino activo (obligatorio para aislamiento)
 * @returns {Promise<{ data: object[], count: number }>}
 */
export async function getAdminPropertiesPaginated(page = 1, search = '', featuredFilter = 'all', tenantId) {
  if (!tenantId) return { data: [], count: 0 }

  const from = (page - 1) * ADMIN_PAGE_SIZE
  const to = from + ADMIN_PAGE_SIZE - 1

  let query = supabase
    .from('properties')
    .select(ADMIN_FIELDS, { count: 'exact' })
    .eq('tenant_id', tenantId)
    .order('updated_at', { ascending: false })

  // Filtro destacadas
  if (featuredFilter === 'featured') query = query.eq('featured', true)
  if (featuredFilter === 'not_featured') query = query.eq('featured', false)

  // Búsqueda por título, referencia o localidad
  if (search.trim()) {
    const q = search.trim()

    // Sub-query: location IDs del tenant cuyo nombre coincide
    const { data: locs } = await supabase
      .from('locations')
      .select('id')
      .eq('tenant_id', tenantId)
      .ilike('name', `%${q}%`)

    const locIds = (locs ?? []).map((l) => l.id)

    // OR filter: título, referencia o location_id en la lista
    let orParts = `title.ilike.%${q}%,reference_code.ilike.%${q}%`
    if (locIds.length > 0) orParts += `,location_id.in.(${locIds.join(',')})`

    query = query.or(orParts)
  }

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('[adminService] getAdminPropertiesPaginated:', error.message)
    return { data: [], count: 0 }
  }

  return { data: data ?? [], count: count ?? 0 }
}

/**
 * @deprecated Usar getAdminPropertiesPaginated. Mantenida para compatibilidad.
 */
export async function getAllProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select(ADMIN_FIELDS)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[adminService] getAllProperties:', error.message)
    return []
  }
  return data ?? []
}

/**
 * Obtiene una única propiedad por ID para edición.
 * @param {string} id 
 * @returns {Promise<object|null>}
 */
export async function getPropertyById(id) {
  const { data, error } = await supabase
    .from('properties')
    .select(ADMIN_FIELDS)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`[adminService] getPropertyById("${id}"):`, error.message)
    return null
  }
  return data
}

/**
 * Obtiene la lista de provincias filtradas por inquilino.
 */
export async function getProvinces(tenantId) {
  if (!tenantId) return [] // Seguridad: si no hay ID, no hay datos

  const { data, error } = await supabase
    .from('provinces')
    .select('id, name')
    .eq('tenant_id', tenantId) // <--- FILTRO POR ID
    .order('name', { ascending: true })

  if (error) {
    console.error('[adminService] getProvinces:', error.message)
    return []
  }
  return data ?? []
}

/**
 * Crea una nueva provincia en la base de datos.
 * @param {string} name - Nombre de la provincia
 * @returns {Promise<{data, error}>}
 */
export async function createProvince(name) {
  const slug = name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const { data, error } = await supabase
    .from('provinces')
    .insert([{ name, slug }])
    .select('id, name')
    .single()

  if (error) console.error('[adminService] createProvince:', error.message)
  return { data, error }
}

/**
 * Crea una nueva localidad asociada a una provincia.
 * @param {string} name - Nombre de la localidad
 * @param {string} province_id - UUID de la provincia
 * @returns {Promise<{data, error}>}
 */
export async function createLocation(name, province_id) {
  // Generar un slug simple para la localidad
  const slug = name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const { data, error } = await supabase
    .from('locations')
    .insert([{ name, slug, province_id }])
    .select('id, name, province_id')
    .single()

  if (error) console.error('[adminService] createLocation:', error.message)
  return { data, error }
}

/**
 * Obtiene las localidades filtradas por inquilino.
 * @param {string} tenantId
 * @returns {Promise<object[]>}
 */
export async function getLocationsAdmin(tenantId) {
  if (!tenantId) return []

  const { data, error } = await supabase
    .from('locations')
    .select('id, name, slug, province_id, provinces(name)')
    .eq('tenant_id', tenantId)
    .order('name', { ascending: true })

  if (error) {
    console.error('[adminService] getLocationsAdmin:', error.message)
    return []
  }
  return data ?? []
}

/**
 * Actualiza una provincia
 */
export async function updateProvince(id, updates) {
  if (updates.name) {
    updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-')
  }
  const { data, error } = await supabase.from('provinces').update(updates).eq('id', id).select().single()
  if (error) console.error('[adminService] updateProvince:', error.message)
  return { data, error }
}

/**
 * Elimina una provincia por ID.
 */
export async function deleteProvince(id) {
  const { error } = await supabase.from('provinces').delete().eq('id', id)
  if (error) console.error('[adminService] deleteProvince:', error.message)
  return { error }
}

/**
 * Actualiza una localidad
 */
export async function updateLocation(id, updates) {
  if (updates.name) {
    updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-')
  }
  const { data, error } = await supabase.from('locations').update(updates).eq('id', id).select().single()
  if (error) console.error('[adminService] updateLocation:', error.message)
  return { data, error }
}

/**
 * Elimina una localidad por ID.
 */
export async function deleteLocation(id) {
  const { error } = await supabase.from('locations').delete().eq('id', id)
  if (error) console.error('[adminService] deleteLocation:', error.message)
  return { error }
}


/**
 * Crea una nueva propiedad.
 * @param {object} propertyData
 * @returns {Promise<{data, error}>}
 */
export async function createProperty(propertyData) {
  const { data, error } = await supabase
    .from('properties')
    .insert(propertyData)
    .select()
    .single()

  if (error) console.error('[adminService] createProperty:', error.message)
  return { data, error }
}

/**
 * Actualiza una propiedad existente.
 * @param {string} id
 * @param {object} updates
 * @returns {Promise<{data, error}>}
 */
export async function updateProperty(id, updates) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) console.error('[adminService] updateProperty:', error.message)
  return { data, error }
}

/**
 * Elimina una propiedad por ID.
 * @param {string} id
 * @returns {Promise<{error}>}
 */
export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) console.error('[adminService] deleteProperty:', error.message)
  return { error }
}

// ─── Storage ──────────────────────────────────────────────────────────────────

/**
 * Sube un archivo de imagen al bucket de Storage.
 * @param {string} referenceCode — carpeta destino (ej. 'A738')
 * @param {File} file
 * @returns {Promise<{path, error}>}
 */
export async function uploadImage(referenceCode, file) {
  const path = `${referenceCode}/${file.name}`
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true })

  if (error) console.error('[adminService] uploadImage:', error.message)
  return { path: data?.path, error }
}

/**
 * Elimina una imagen del bucket de Storage.
 * @param {string} referenceCode
 * @param {string} filename
 * @returns {Promise<{error}>}
 */
export async function deleteImage(referenceCode, filename) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([`${referenceCode}/${filename}`])

  if (error) console.error('[adminService] deleteImage:', error.message)
  return { error }
}

/**
 * Lista las imágenes de una propiedad en Storage.
 * @param {string} referenceCode
 * @returns {Promise<Array<{name, publicUrl}>>}
 */
export async function listImages(referenceCode) {
  const { data: files, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(referenceCode, { sortBy: { column: 'name', order: 'asc' } })

  if (error || !files) return []

  return files
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => {
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(`${referenceCode}/${f.name}`)
      return { name: f.name, publicUrl: data.publicUrl }
    })
}

// ─── Features ───────────────────────────────────────────────────────────────

/**
 * Obtiene todas las características disponibles (maestro).
 */
export async function getFeatures() {
  const { data, error } = await supabase
    .from('features')
    .select('id, feature_key, category')
    .order('category')
    .order('feature_key')

  if (error) {
    console.error('[adminService] getFeatures:', error.message)
    return []
  }
  return data ?? []
}

/**
 * Obtiene las características asignadas a una propiedad.
 */
export async function getPropertyFeatures(propertyId) {
  if (!propertyId) return []

  const { data, error } = await supabase
    .from('property_features')
    .select('feature_id')
    .eq('property_id', propertyId)

  if (error) {
    console.error('[adminService] getPropertyFeatures:', error.message)
    return []
  }
  return data ? data.map((pf) => pf.feature_id) : []
}

/**
 * Sincroniza las características de una propiedad.
 * Elimina las relaciones existentes e inserta las nuevas.
 */
export async function syncPropertyFeatures(propertyId, featureIds) {
  // 1. Delete existing for this property
  const { error: delError } = await supabase
    .from('property_features')
    .delete()
    .eq('property_id', propertyId)

  if (delError) {
    console.error('[adminService] syncPropertyFeatures (delete):', delError.message)
    return { error: delError }
  }

  // 2. Insert new features if any
  if (featureIds && featureIds.length > 0) {
    const payload = featureIds.map((fId) => ({
      property_id: propertyId,
      feature_id: fId
    }))

    const { error: insError } = await supabase
      .from('property_features')
      .insert(payload)

    if (insError) {
      console.error('[adminService] syncPropertyFeatures (insert):', insError.message)
      return { error: insError }
    }
  }

  return { error: null }
}

