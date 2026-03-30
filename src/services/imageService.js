/**
 * imageService.js — Property image management for the multi-tenant system.
 *
 * Storage path convention:
 *   {tenant.slug}/{property.slug}/{filename}
 *   e.g. parque-sierra/casa-rural-aracena/1700000000000-photo.jpg
 *
 * DB table: property_images
 *   id, property_id, tenant_id, url, path, is_cover, order_index, created_at
 */

import { supabase } from './supabaseClient'

const IMAGE_BUCKET = 'properties'

export const IMAGE_PLACEHOLDER = '/images/property-placeholder.jpg'

// ─── Upload ──────────────────────────────────────────────────────────────────

/**
 * Uploads a file to Supabase Storage and inserts a record in property_images.
 *
 * @param {File} file
 * @param {{ id: string, slug: string }} property
 * @param {{ id: string, slug: string }} tenant
 * @returns {Promise<{ data: object|null, error: object|null }>}
 */
export async function uploadPropertyImage(file, property, tenant) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const fileName = `${Date.now()}-${safeName}`
  const path     = `${tenant.slug}/${property.slug}/${fileName}`

  const { error: storageError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { upsert: false })

  if (storageError) {
    console.error('[imageService] upload failed:', storageError.message)
    return { data: null, error: storageError }
  }

  const { data: { publicUrl } } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(path)

  // Determine order_index (current count becomes the next index)
  const { count } = await supabase
    .from('property_images')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', property.id)

  const orderIndex = count ?? 0
  const isCover    = orderIndex === 0 // first image is cover by default

  const { data, error } = await supabase
    .from('property_images')
    .insert({
      property_id:  property.id,
      tenant_id:    tenant.id,
      url:          publicUrl,
      path,
      is_cover:     isCover,
      order_index:  orderIndex,
    })
    .select()
    .single()

  if (error) {
    console.error('[imageService] DB insert failed:', error.message)
    return { data: null, error }
  }

  return { data, error: null }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetches all property_images records for a given property,
 * ordered by order_index then created_at.
 *
 * @param {string} propertyId — UUID
 * @returns {Promise<Array<{ id, url, path, is_cover, order_index }>>}
 */
export async function getPropertyImagesFromDB(propertyId) {
  const { data, error } = await supabase
    .from('property_images')
    .select('id, url, path, is_cover, order_index')
    .eq('property_id', propertyId)
    .order('order_index', { ascending: true })
    .order('created_at',  { ascending: true })

  if (error) {
    console.error('[imageService] fetch failed:', error.message)
    return []
  }

  return data ?? []
}

// ─── Delete ──────────────────────────────────────────────────────────────────

/**
 * Removes a file from Storage and deletes its property_images record.
 * If the deleted image was the cover, promotes the next image automatically.
 *
 * @param {string} imageId  — UUID from property_images
 * @param {string} path     — storage path (e.g. 'slug/prop-slug/file.jpg')
 * @param {string} propertyId — UUID (needed to promote next cover)
 * @returns {Promise<{ error: object|null }>}
 */
export async function deletePropertyImage(imageId, path, propertyId) {
  // Fetch the image first to know if it was the cover
  const { data: img } = await supabase
    .from('property_images')
    .select('is_cover')
    .eq('id', imageId)
    .single()

  const { error: storageError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .remove([path])

  if (storageError) {
    console.error('[imageService] storage delete failed:', storageError.message)
    return { error: storageError }
  }

  const { error } = await supabase
    .from('property_images')
    .delete()
    .eq('id', imageId)

  if (error) {
    console.error('[imageService] DB delete failed:', error.message)
    return { error }
  }

  // If this was the cover image, promote the next image in order
  if (img?.is_cover && propertyId) {
    const { data: remaining } = await supabase
      .from('property_images')
      .select('id')
      .eq('property_id', propertyId)
      .order('order_index', { ascending: true })
      .limit(1)

    if (remaining?.length) {
      await supabase
        .from('property_images')
        .update({ is_cover: true })
        .eq('id', remaining[0].id)
    }
  }

  return { error: null }
}

// ─── Cover ────────────────────────────────────────────────────────────────────

/**
 * Sets a specific image as the cover for a property.
 * Clears is_cover on all sibling images first.
 * (The DB unique partial index enforces single cover at DB level too.)
 *
 * @param {string} imageId
 * @param {string} propertyId
 * @returns {Promise<{ error: object|null }>}
 */
export async function setImageAsCover(imageId, propertyId) {
  // Clear existing cover
  const { error: clearError } = await supabase
    .from('property_images')
    .update({ is_cover: false })
    .eq('property_id', propertyId)

  if (clearError) {
    console.error('[imageService] setImageAsCover clear failed:', clearError.message)
    return { error: clearError }
  }

  const { error } = await supabase
    .from('property_images')
    .update({ is_cover: true })
    .eq('id', imageId)

  if (error) console.error('[imageService] setImageAsCover failed:', error.message)
  return { error: error ?? null }
}
