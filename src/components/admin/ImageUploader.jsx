import { useState, useEffect } from 'react'
import { uploadImage, deleteImage, listImages } from '../../services/adminService'

/**
 * ImageUploader — Sube y gestiona imágenes en Supabase Storage.
 * @param {{ referenceCode: string }} props
 */
export default function ImageUploader({ referenceCode }) {
  const [images, setImages] = useState([])   // { name, publicUrl }
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar imágenes existentes al montar
  useEffect(() => {
    if (!referenceCode) return
    listImages(referenceCode).then(setImages)
  }, [referenceCode])

  async function handleFileChange(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setUploading(true)
    setError(null)

    const results = await Promise.all(files.map((f) => uploadImage(referenceCode, f)))
    const failed = results.filter((r) => r.error)

    if (failed.length) {
      setError(`${failed.length} imagen(es) fallaron al subir.`)
    }

    // Recargar listado
    const updated = await listImages(referenceCode)
    setImages(updated)
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(filename) {
    if (!confirm(`¿Eliminar "${filename}"?`)) return
    await deleteImage(referenceCode, filename)
    setImages((prev) => prev.filter((img) => img.name !== filename))
  }

  if (!referenceCode) {
    return (
      <p className="text-sm text-secondary-400 italic">
        Guarda la propiedad primero para poder subir imágenes.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {/* Upload button */}
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

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Grid de imágenes */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.name} className="relative group rounded-xl overflow-hidden bg-secondary-100 aspect-video">
              <img src={img.publicUrl} alt={img.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(img.name)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                aria-label={`Eliminar ${img.name}`}
              >
                🗑 Eliminar
              </button>
              <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white/80 truncate bg-black/30 px-1 rounded">
                {img.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-secondary-400 italic">Sin imágenes aún.</p>
      )}
    </div>
  )
}
