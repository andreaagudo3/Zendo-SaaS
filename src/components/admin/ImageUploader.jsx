import { useState, useEffect } from 'react'
import {
  uploadPropertyImage,
  getPropertyImagesFromDB,
  deletePropertyImage,
  setImageAsCover,
} from '../../services/imageService'

/**
 * ImageUploader — manages property images via the property_images table.
 *
 * @param {{ id: string, slug: string }|null} property — null until property is saved
 * @param {{ id: string, slug: string }|null} tenant   — current tenant from useTenant()
 *
 * Images are stored at:  {tenant.slug}/{property.slug}/{timestamp}-{filename}
 * DB record inserted in: property_images (property_id, tenant_id, url, path, is_cover, order_index)
 *
 * UX rules:
 *  - First uploaded image is automatically the cover
 *  - Click any image to promote it to cover (highlighted with primary ring)
 *  - Hover to reveal delete button
 *  - Deleting the cover auto-promotes the next image
 */
export default function ImageUploader({ property, tenant, onCoverChange }) {
  const [images,    setImages]    = useState([]) // { id, url, path, is_cover, order_index }
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState(null)

  const isReady = Boolean(property?.id && property?.slug && tenant?.id && tenant?.slug)

  // Load existing images when property becomes available
  useEffect(() => {
    if (!isReady) return
    getPropertyImagesFromDB(property.id).then(setImages)
  }, [property?.id, isReady])

  async function handleFileChange(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setUploading(true)
    setError(null)

    const results = await Promise.all(
      files.map((f) => uploadPropertyImage(f, property, tenant))
    )

    const failed = results.filter((r) => r.error)
    if (failed.length) setError(`${failed.length} imagen(es) fallaron al subir.`)

    // Reload from DB to get accurate state (covers, order_index)
    const updated = await getPropertyImagesFromDB(property.id)
    setImages(updated)
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(img) {
    if (!confirm('¿Eliminar esta imagen?')) return

    const { error } = await deletePropertyImage(img.id, img.path, property.id)
    if (error) {
      setError('Error al eliminar la imagen.')
      return
    }

    // Reload to get updated cover state after auto-promotion
    const updated = await getPropertyImagesFromDB(property.id)
    setImages(updated)
  }

  async function handleSetCover(img) {
    if (img.is_cover) return

    const { error } = await setImageAsCover(img.id, property.id)
    if (error) {
      setError('Error al establecer imagen de portada.')
      return
    }

    // Optimistic update of local state
    setImages((prev) =>
      prev.map((i) => ({ ...i, is_cover: i.id === img.id }))
    )

    // Notify parent so it can refresh image_cover_url without a full refetch
    onCoverChange?.(img.url)
  }

  // ── Guard: property not yet saved ──────────────────────────────────────────
  if (!isReady) {
    return (
      <p className="text-sm text-secondary-400 italic">
        Guarda la propiedad primero para poder subir imágenes.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {/* Upload trigger */}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <span className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
          uploading
            ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
            : 'bg-primary-700 text-white hover:bg-primary-800'
        }`}>
          {uploading ? 'Subiendo…' : '+ Añadir imágenes'}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 ? (
        <>
          <p className="text-xs text-secondary-400">
            Haz clic en una imagen para establecerla como portada.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => handleSetCover(img)}
                className={`relative group rounded-xl overflow-hidden bg-secondary-100 aspect-video cursor-pointer ring-2 transition-all ${
                  img.is_cover
                    ? 'ring-primary-500 shadow-md'
                    : 'ring-transparent hover:ring-secondary-300'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />

                {/* Cover badge */}
                {img.is_cover && (
                  <span className="absolute top-1 left-1 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Portada
                  </span>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDelete(img) }}
                  className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Eliminar imagen"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-secondary-400 italic">Sin imágenes aún.</p>
      )}
    </div>
  )
}
