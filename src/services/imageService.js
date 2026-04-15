/**
 * imageService.js — Property & tenant image management for the multi-tenant system.
 *
 * Storage path convention (properties bucket):
 *   {tenant.id}/{property.id}/{filename}
 *   e.g. 123e4567-e89b-12d3.../123e4567-e89b-12d3.../1700000000000-photo.jpg
 *
 * Storage path convention (tenants bucket):
 *   {tenant.id}/{imageName}.{ext}   — imageName is 'logo' or 'home_header'
 *   e.g. 123e4567-e89b-12d3.../logo.png
 *
 * DB table: property_images
 *   id, property_id, tenant_id, url, path, is_cover, order_index, created_at
 */

import { supabase } from './supabaseClient'

const IMAGE_BUCKET  = 'properties'  // property photos
const TENANT_BUCKET = 'tenants'     // tenant branding images (logo, home_header)

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
  const path     = `${tenant.id}/${property.id}/${fileName}`

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

// ─── Tenant Branding Images ───────────────────────────────────────────────────

/** Supported extensions for tenant branding images. */
const BRANDING_EXTS = ['jpg', 'jpeg', 'png']

/**
 * Uploads a branding image (logo or home_header) for a tenant.
 *
 * Rules:
 *  - Only jpg / jpeg / png are accepted.
 *  - ALL previous variants ({imageName}.jpg, .jpeg, .png) are deleted first
 *    so storage never accumulates stale files.
 *  - The file is stored at: {tenant.id}/{imageName}.{normalizedExt}
 *    where normalizedExt is 'jpg' for jpeg/jpg and 'png' for png.
 *
 * @param {File}   file      — The image file to upload
 * @param {string} imageName — 'logo' | 'home_header'
 * @param {{ id: string }} tenant
 * @returns {Promise<{ url: string|null, path: string|null, error: object|null }>}
 */
export async function uploadTenantImage(file, imageName, tenant) {
  // ── Validate extension ────────────────────────────────────────────────────
  const rawExt = file.name.split('.').pop().toLowerCase()
  if (!BRANDING_EXTS.includes(rawExt)) {
    return {
      url: null,
      path: null,
      error: { message: 'Only JPG and PNG images are supported.' },
    }
  }

  // Normalise: treat jpeg → jpg so we only ever have .jpg or .png on disk
  const ext  = rawExt === 'jpeg' ? 'jpg' : rawExt
  const path = `${tenant.id}/${imageName}.${ext}`

  // ── Delete all previous variants (jpg + jpeg + png) ───────────────────────
  // We ignore errors here intentionally — files may not exist yet.
  const prevPaths = BRANDING_EXTS.map((e) => `${tenant.id}/${imageName}.${e}`)
  await supabase.storage.from(TENANT_BUCKET).remove(prevPaths)

  // ── Upload new file ───────────────────────────────────────────────────────
  const { error: storageError } = await supabase.storage
    .from(TENANT_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (storageError) {
    console.error('[imageService] uploadTenantImage failed:', storageError.message)
    return { url: null, path: null, error: storageError }
  }

  // Add cache-bust timestamp so browsers don't serve a stale version
  const { data: { publicUrl } } = supabase.storage
    .from(TENANT_BUCKET)
    .getPublicUrl(path)

  const url = `${publicUrl}?t=${Date.now()}`
  return { url, path, error: null }
}

/**
 * Deletes ALL extension variants of a tenant branding image from storage.
 * (Useful when a tenant account is removed or branding is reset.)
 *
 * @param {string} imageName — 'logo' | 'home_header'
 * @param {{ id: string }} tenant
 * @returns {Promise<{ error: object|null }>}
 */
export async function deleteTenantImage(imageName, tenant) {
  const paths = BRANDING_EXTS.map((e) => `${tenant.id}/${imageName}.${e}`)
  const { error } = await supabase.storage.from(TENANT_BUCKET).remove(paths)
  if (error) console.error('[imageService] deleteTenantImage failed:', error.message)
  return { error: error ?? null }
}
