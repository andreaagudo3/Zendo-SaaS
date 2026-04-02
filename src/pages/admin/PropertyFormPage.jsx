import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createProperty, updateProperty,
  getAdminPropertiesPaginated, getProvinces, createLocation, createProvince,
  getPropertyById
} from '../../services/adminService'
import { supabase } from '../../services/supabaseClient'
import { useTenant } from '../../context/TenantContext'
import { slugify, generateReferenceCode } from '../../utils/slugify'
import ImageUploader from '../../components/admin/ImageUploader'
import AdminLayout from './AdminLayout'

const EMPTY_FORM = {
  title: '', description: '', price: '',
  location_id: '', bedrooms: '', bathrooms: '',
  size_m2: '', listing_type: 'sale',
  property_type: '', status: 'available',
  published: true, featured: false,
  meta_description: '',
  meta_title: '',
}

/**
 * PropertyFormPage — unified create / edit form for properties.
 *
 * Create mode (/admin/new):
 *   - Saves property → redirects to /admin/edit/:id
 *   - User then uploads images in edit mode (where property.id is available)
 *
 * Edit mode (/admin/edit/:id):
 *   - Loads existing property data
 *   - ImageUploader is fully functional (property.id + slug are known)
 */
export default function PropertyFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const tenant = useTenant()

  const [form, setForm] = useState(EMPTY_FORM)
  const [referenceCode, setReferenceCode] = useState('')
  const [propertySlug, setPropertySlug] = useState('') // slug for the saved property
  const [status, setStatus] = useState('idle') // idle | saving | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [loadingProp, setLoadingProp] = useState(isEdit)

  // Locations data
  const [provinces, setProvinces] = useState([])
  const [locations, setLocations] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')

  // Inline province creation
  const [isAddingProvince, setIsAddingProvince] = useState(false)
  const [newProvinceName, setNewProvinceName] = useState('')
  const [isSavingProvince, setIsSavingProvince] = useState(false)

  // Inline location creation
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [newLocationName, setNewLocationName] = useState('')
  const [isSavingLocation, setIsSavingLocation] = useState(false)

  // Load provinces and locations on mount
  useEffect(() => {
    async function fetchData() {
      const provs = await getProvinces(tenant?.id)
      setProvinces(provs)
      const { data } = await supabase
        .from('locations')
        .select('id, name, province_id')
        .eq('tenant_id', tenant?.id)
        .order('name')
      if (data) setLocations(data)
    }
    fetchData()
  }, [tenant?.id])

  // Load property in edit mode
  useEffect(() => {
    if (!isEdit) {
      setReferenceCode(generateReferenceCode())
      return
    }
    getPropertyById(id).then((prop) => {
      if (!prop) {
        console.warn(`[PropertyFormPage] Property not found: ${id}`)
        navigate('/admin')
        return
      }

      setReferenceCode(prop.reference_code ?? '')
      setPropertySlug(prop.slug ?? '')
      setForm({
        title: prop.title ?? '',
        description: prop.description ?? '',
        price: prop.price ?? '',
        location_id: prop.location_id ?? '',
        bedrooms: prop.bedrooms ?? '',
        bathrooms: prop.bathrooms ?? '',
        size_m2: prop.size_m2 ?? '',
        listing_type: prop.listing_type ?? 'sale',
        property_type: prop.property_type ?? '',
        status: prop.status ?? 'available',
        published: prop.published ?? false,
        featured: prop.featured ?? false,
        meta_description: prop.meta_description ?? '',
        meta_title: prop.meta_title ?? '',
      })

      // Resolve selected province from the current location
      if (prop.location_id && locations.length > 0) {
        const loc = locations.find((l) => l.id === prop.location_id)
        if (loc) setSelectedProvince(loc.province_id)
      }
      setLoadingProp(false)
    })
  }, [id, isEdit, navigate, locations, tenant?.id])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))

    if (name === 'location_id' && value) {
      setIsAddingLocation(false)
      setNewLocationName('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('saving')
    setErrorMsg('')

    if (!form.location_id) {
      setErrorMsg('Debes seleccionar una provincia y una localidad válidas.')
      setStatus('error')
      return
    }

    const generatedSlug = slugify(form.title)

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      price: form.price !== '' ? Number(form.price) : null,
      location_id: form.location_id || null,
      bedrooms: form.bedrooms !== '' ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms !== '' ? Number(form.bathrooms) : null,
      size_m2: form.size_m2 !== '' ? Number(form.size_m2) : null,
      listing_type: form.listing_type || null,
      property_type: form.property_type.trim() || null,
      status: form.status,
      published: form.published,
      featured: form.featured,
      meta_description: form.meta_description.trim() || null,
      meta_title: form.meta_title.trim() || null,
      tenant_id: tenant?.id || null,
    }

    let result
    if (isEdit) {
      result = await updateProperty(id, payload)
    } else {
      result = await createProperty({
        ...payload,
        reference_code: referenceCode,
        slug: generatedSlug,
      })
    }

    if (result.error) {
      setErrorMsg(result.error.message)
      setStatus('error')
      return
    }

    setStatus('success')

    if (isEdit) {
      // Stay on edit page briefly, then go back to admin list
      setTimeout(() => navigate('/admin'), 1000)
    } else {
      // Redirect to edit mode so the user can upload images immediately
      // (ImageUploader requires property.id which is only available after DB insert)
      setTimeout(() => navigate(`/admin/edit/${result.data.id}`), 800)
    }
  }

  // ─── Location helpers ─────────────────────────────────────────────────────

  const filteredLocations = selectedProvince
    ? locations.filter((l) => l.province_id === selectedProvince)
    : []

  function handleProvinceChange(e) {
    const provId = e.target.value
    setSelectedProvince(provId)
    setForm((prev) => ({ ...prev, location_id: '' }))
    if (provId) { setIsAddingProvince(false); setNewProvinceName('') }
    setIsAddingLocation(false)
    setNewLocationName('')
  }

  async function handleAddProvince(e) {
    e.preventDefault()
    if (!newProvinceName.trim()) return
    setIsSavingProvince(true)
    const { data, error } = await createProvince(newProvinceName.trim())
    setIsSavingProvince(false)
    if (error) { alert('Error al añadir la provincia: ' + error.message); return }
    if (data) {
      setProvinces((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setSelectedProvince(data.id)
      setForm((prev) => ({ ...prev, location_id: '' }))
      setIsAddingProvince(false)
      setNewProvinceName('')
    }
  }

  async function handleAddLocation(e) {
    e.preventDefault()
    if (!newLocationName.trim() || !selectedProvince) return
    setIsSavingLocation(true)
    const { data, error } = await createLocation(newLocationName.trim(), selectedProvince)
    setIsSavingLocation(false)
    if (error) { alert('Error al añadir la localidad: ' + error.message); return }
    if (data) {
      setLocations((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setForm((prev) => ({ ...prev, location_id: data.id }))
      setIsAddingLocation(false)
      setNewLocationName('')
    }
  }

  // ─── ImageUploader props ──────────────────────────────────────────────────

  // In edit mode: property is known immediately.
  // In create mode: property is null until after first save (redirect to edit).
  const imageProperty = isEdit && propertySlug
    ? { id, slug: propertySlug }
    : null

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loadingProp) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20 text-secondary-400">
          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-secondary-100 text-secondary-500 hover:bg-secondary-200 hover:text-secondary-900 transition-colors"
            aria-label="Volver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              {isEdit ? 'Editar propiedad' : 'Nueva propiedad'}
            </h1>
            {referenceCode && (
              <p className="text-xs text-secondary-400 font-mono">Ref: {referenceCode}</p>
            )}
          </div>
        </div>

        {/* Feedback */}
        {status === 'success' && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
            ✅ {isEdit ? 'Cambios guardados.' : 'Propiedad creada. Redirigiendo para añadir imágenes…'}
          </div>
        )}
        {status === 'error' && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            ❌ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos básicos */}
          <section className="bg-white rounded-2xl border border-secondary-200 p-6 space-y-4 shadow-sm">
            <h2 className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">Datos básicos</h2>

            <Field label="Título *" htmlFor="f-title">
              <input id="f-title" name="title" required value={form.title} onChange={handleChange}
                placeholder="Casa en Aracena centro" className={INPUT_CLS} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Precio (€)" htmlFor="f-price">
                <input id="f-price" name="price" type="number" min="0" value={form.price} onChange={handleChange}
                  placeholder="250000" className={INPUT_CLS} />
              </Field>
              <div className="space-y-4">
                <Field label="Ubicación *" htmlFor="f-province">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Province select + inline creation */}
                    <div className="space-y-2">
                      <select id="f-province" className={INPUT_CLS} value={selectedProvince} onChange={handleProvinceChange}>
                        <option value="">— Provincia —</option>
                        {provinces.map((prov) => (
                          <option key={prov.id} value={prov.id}>{prov.name}</option>
                        ))}
                      </select>
                      <div className="flex justify-end">
                        {!isAddingProvince ? (
                          <button type="button" onClick={() => setIsAddingProvince(true)}
                            className="text-primary-600 text-xs font-medium hover:text-primary-800 transition-colors">
                            + Añadir provincia
                          </button>
                        ) : (
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-secondary-50 p-2 rounded-lg border border-secondary-200 w-full">
                            <input type="text" value={newProvinceName} onChange={(e) => setNewProvinceName(e.target.value)}
                              placeholder="Nombre..." autoFocus disabled={isSavingProvince}
                              className="px-2 py-1 text-xs border border-secondary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 w-full" />
                            <button type="button" onClick={handleAddProvince} disabled={isSavingProvince || !newProvinceName.trim()}
                              className="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap">✓</button>
                            <button type="button" onClick={() => { setIsAddingProvince(false); setNewProvinceName('') }} disabled={isSavingProvince}
                              className="px-2 py-1 text-xs text-secondary-500 hover:text-secondary-700">✕</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location select + inline creation */}
                    <div className="space-y-2">
                      <select id="f-location" name="location_id" required value={form.location_id} onChange={handleChange}
                        disabled={!selectedProvince}
                        className={`${INPUT_CLS} ${!selectedProvince ? 'opacity-50 cursor-not-allowed bg-secondary-50' : ''}`}>
                        <option value="">{selectedProvince ? '— Localidad —' : '← Primero elige provincia'}</option>
                        {filteredLocations.map((loc) => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                      {selectedProvince && (
                        <div className="flex justify-end">
                          {!isAddingLocation ? (
                            <button type="button" onClick={() => setIsAddingLocation(true)}
                              className="text-primary-600 text-xs font-medium hover:text-primary-800 transition-colors">
                              + Añadir localidad
                            </button>
                          ) : (
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-secondary-50 p-2 rounded-lg border border-secondary-200 w-full">
                              <input type="text" value={newLocationName} onChange={(e) => setNewLocationName(e.target.value)}
                                placeholder="Nombre..." autoFocus disabled={isSavingLocation}
                                className="px-2 py-1 text-xs border border-secondary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 w-full" />
                              <button type="button" onClick={handleAddLocation} disabled={isSavingLocation || !newLocationName.trim()}
                                className="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap">✓</button>
                              <button type="button" onClick={() => { setIsAddingLocation(false); setNewLocationName('') }} disabled={isSavingLocation}
                                className="px-2 py-1 text-xs text-secondary-500 hover:text-secondary-700">✕</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </Field>
              </div>
            </div>

            <Field label="Descripción" htmlFor="f-desc">
              <textarea id="f-desc" name="description" rows={4} value={form.description} onChange={handleChange}
                placeholder="Descripción detallada de la propiedad…" className={INPUT_CLS + ' resize-none'} />
            </Field>
          </section>

          {/* Detalles */}
          <section className="bg-white rounded-2xl border border-secondary-200 p-6 space-y-4 shadow-sm">
            <h2 className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">Detalles</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Habitaciones" htmlFor="f-bed">
                <input id="f-bed" name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={handleChange}
                  placeholder="3" className={INPUT_CLS} />
              </Field>
              <Field label="Baños" htmlFor="f-bath">
                <input id="f-bath" name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={handleChange}
                  placeholder="2" className={INPUT_CLS} />
              </Field>
              <Field label="Superficie (m²)" htmlFor="f-m2">
                <input id="f-m2" name="size_m2" type="number" min="0" value={form.size_m2} onChange={handleChange}
                  placeholder="150" className={INPUT_CLS} />
              </Field>
              <Field label="Tipo inmueble" htmlFor="f-ptype">
                <select id="f-ptype" name="property_type" value={form.property_type} onChange={handleChange} className={INPUT_CLS}>
                  <option value="">— Sin especificar —</option>
                  <option value="house">Casa</option>
                  <option value="apartment">Piso / Apartamento</option>
                  <option value="land">Terreno</option>
                  <option value="rural">Finca rústica</option>
                  <option value="commercial">Local comercial</option>
                  <option value="garage">Garaje</option>
                  <option value="office">Oficina</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Operación" htmlFor="f-ltype">
                <select id="f-ltype" name="listing_type" value={form.listing_type} onChange={handleChange} className={INPUT_CLS}>
                  <option value="sale">Venta</option>
                  <option value="rent">Alquiler</option>
                </select>
              </Field>
              <Field label="Estado" htmlFor="f-status">
                <select id="f-status" name="status" value={form.status} onChange={handleChange} className={INPUT_CLS}>
                  <option value="available">Disponible</option>
                  <option value="reserved">Reservado</option>
                  <option value="sold">Vendido</option>
                </select>
              </Field>
              <div className="flex flex-col gap-3 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700">
                  <input type="checkbox" name="published" checked={form.published} onChange={handleChange}
                    className="w-4 h-4 rounded accent-primary-700" />
                  Publicada
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                    className="w-4 h-4 rounded accent-primary-700" />
                  Destacada
                </label>
              </div>
            </div>
          </section>

          {/* Imágenes */}
          <section className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">Imágenes</h2>
            {!isEdit && (
              <p className="text-xs text-secondary-400">
                Las imágenes se pueden subir después de guardar la propiedad.
              </p>
            )}
            <ImageUploader property={imageProperty} tenant={tenant} />
          </section>

          {/* Configuración SEO */}
          <section className="bg-white rounded-2xl border border-secondary-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">Configuración SEO</h2>
              <span className={`text-xs font-medium ${form.meta_description.length > 155 ? 'text-red-500' : 'text-secondary-400'}`}>
                {form.meta_description.length} / 155
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Field label="Título para Google (meta_title)" htmlFor="f-mtitle">
                <input
                  id="f-mtitle"
                  name="meta_title"
                  type="text"
                  value={form.meta_title}
                  onChange={handleChange}
                  placeholder={form.meta_title ? '' : 'Ej: Chalet de lujo con vistas en Aracena | Zendo'}
                  className={INPUT_CLS}
                />
                <p className="text-xs text-secondary-400 mt-1 italic">
                  Si este campo está vacío, Google mostrará el título principal de la propiedad.
                </p>
              </Field>

              <Field label="Descripción para Google (meta_description)" htmlFor="f-meta">
                <textarea
                  id="f-meta"
                  name="meta_description"
                  rows={3}
                  value={form.meta_description}
                  onChange={handleChange}
                  placeholder={form.meta_description ? '' : 'El sistema usará un resumen automático si dejas esto vacío.'}
                  className={INPUT_CLS + ' resize-none'}
                />
                <p className="text-xs text-secondary-400 mt-1 italic leading-relaxed">
                  Este es el resumen que aparece bajo el título en los resultados de Google. Intenta no superar los 155 caracteres.
                </p>
              </Field>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end pb-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-600 bg-secondary-100 hover:bg-secondary-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={status === 'saving'}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-700 hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'saving' ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear propiedad'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

// ─── Helpers UI ───────────────────────────────────────────────────────────────

const INPUT_CLS = 'w-full px-4 py-2.5 rounded-xl border border-secondary-200 text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-600 transition bg-white'

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-secondary-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}
