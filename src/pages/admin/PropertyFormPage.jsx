import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createProperty, updateProperty,
  getAllProperties, getProvinces, createLocation, createProvince
} from '../../services/adminService'
import { supabase } from '../../services/supabaseClient'
import { slugify, generateReferenceCode } from '../../utils/slugify'
import ImageUploader from '../../components/admin/ImageUploader'
import AdminLayout from './AdminLayout'

const EMPTY_FORM = {
  title: '', description: '', price: '',
  location_id: '', bedrooms: '', bathrooms: '',
  size_m2: '', listing_type: 'sale',
  property_type: '', status: 'available',
  published: true, featured: false,
}

/**
 * PropertyFormPage — Formulario unificado para crear y editar propiedades.
 * Modo crear: /admin/new
 * Modo editar: /admin/edit/:id
 */
export default function PropertyFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [referenceCode, setReferenceCode] = useState('')
  const [status, setStatus] = useState('idle') // idle | saving | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [loadingProp, setLoadingProp] = useState(isEdit)
  
  // Locations Data
  const [provinces, setProvinces] = useState([])
  const [locations, setLocations] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  
  // New Province Inline Form
  const [isAddingProvince, setIsAddingProvince] = useState(false)
  const [newProvinceName, setNewProvinceName] = useState('')
  const [isSavingProvince, setIsSavingProvince] = useState(false)

  // New Location Inline Form
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [newLocationName, setNewLocationName] = useState('')
  const [isSavingLocation, setIsSavingLocation] = useState(false)

  // Cargar lista de Provincias y Localidades al montar
  useEffect(() => {
    async function fetchData() {
      const provs = await getProvinces()
      setProvinces(provs)

      const { data } = await supabase.from('locations').select('id, name, province_id').order('name')
      if (data) setLocations(data)
    }
    fetchData()
  }, [])

  // Cargar propiedad en modo edición
  useEffect(() => {
    if (!isEdit) {
      setReferenceCode(generateReferenceCode())
      return
    }
    getAllProperties().then((all) => {
      const prop = all.find((p) => p.id === id)
      if (!prop) { navigate('/admin'); return }

      setReferenceCode(prop.reference_code ?? '')
      setForm({
        title:         prop.title ?? '',
        description:   prop.description ?? '',
        price:         prop.price ?? '',
        location_id:   prop.location_id ?? '',
        bedrooms:      prop.bedrooms ?? '',
        bathrooms:     prop.bathrooms ?? '',
        size_m2:       prop.size_m2 ?? '',
        listing_type:  prop.listing_type ?? 'sale',
        property_type: prop.property_type ?? '',
        status:        prop.status ?? 'available',
        published:     prop.published ?? false,
        featured:      prop.featured ?? false,
      })
      // Buscar a qué provincia pertenece la localidad actual para setear el primer select
      if (prop.location_id && locations.length > 0) {
        const loc = locations.find(l => l.id === prop.location_id)
        if (loc) setSelectedProvince(loc.province_id)
      }
      setLoadingProp(false)
    })
  }, [id, isEdit, navigate, locations]) // Added locations to dependency array

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    
    // Si cambia la localidad desde el select, cierra el prompt de crear nueva
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

    const payload = {
      title:         form.title.trim(),
      description:   form.description.trim() || null,
      price:         form.price !== '' ? Number(form.price) : null,
      location_id:   form.location_id || null,
      bedrooms:      form.bedrooms !== '' ? Number(form.bedrooms) : null,
      bathrooms:     form.bathrooms !== '' ? Number(form.bathrooms) : null,
      size_m2:       form.size_m2 !== '' ? Number(form.size_m2) : null,
      listing_type:  form.listing_type || null,
      property_type: form.property_type.trim() || null,
      status:        form.status,
      published:     form.published,
      featured:      form.featured,
    }

    let result
    if (isEdit) {
      result = await updateProperty(id, payload)
    } else {
      result = await createProperty({
        ...payload,
        reference_code: referenceCode,
        slug: slugify(form.title),
      })
    }

    if (result.error) {
      setErrorMsg(result.error.message)
      setStatus('error')
    } else {
      setStatus('success')
      setTimeout(() => navigate('/admin'), 1000)
    }
  }

  // ─── Helpers localizaciones ───────────────────────────────────────
  const filteredLocations = selectedProvince
    ? locations.filter(l => l.province_id === selectedProvince)
    : []

  const handleProvinceChange = (e) => {
    const provId = e.target.value
    setSelectedProvince(provId)
    // Reseteamos locality si cambiamos de provincia
    setForm(prev => ({ ...prev, location_id: '' }))
    
    // Cierra popups si elige del select
    if (provId) {
      setIsAddingProvince(false)
      setNewProvinceName('')
    }
    setIsAddingLocation(false)
    setNewLocationName('')
  }

  const handleAddProvince = async (e) => {
    e.preventDefault()
    if (!newProvinceName.trim()) return

    setIsSavingProvince(true)
    const { data, error } = await createProvince(newProvinceName.trim())
    setIsSavingProvince(false)

    if (error) {
      alert('Error al añadir la provincia: ' + error.message)
      return
    }

    if (data) {
      setProvinces(prev => [...prev, data].sort((a,b) => a.name.localeCompare(b.name)))
      setSelectedProvince(data.id)
      setForm(prev => ({ ...prev, location_id: '' }))
      setIsAddingProvince(false)
      setNewProvinceName('')
    }
  }

  const handleAddLocation = async (e) => {
    e.preventDefault()
    if (!newLocationName.trim() || !selectedProvince) return
    
    setIsSavingLocation(true)
    const { data, error } = await createLocation(newLocationName.trim(), selectedProvince)
    setIsSavingLocation(false)
    
    if (error) {
      alert('Error al añadir la localidad: ' + error.message)
      return
    }
    
    if (data) {
      // Añadir la nueva localidad a local state
      setLocations(prev => [...prev, data].sort((a,b) => a.name.localeCompare(b.name)))
      // Seleccionarla automáticamente
      setForm(prev => ({ ...prev, location_id: data.id }))
      setIsAddingLocation(false)
      setNewLocationName('')
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

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
            title="Volver atrás"
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
            ✅ {isEdit ? 'Cambios guardados.' : 'Propiedad creada.'} Redirigiendo…
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
                    
                    {/* Select y creación de Provincia */}
                    <div className="space-y-2">
                      <select
                        id="f-province"
                        className={INPUT_CLS}
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                      >
                        <option value="">— Provincia —</option>
                        {provinces.map((prov) => (
                          <option key={prov.id} value={prov.id}>{prov.name}</option>
                        ))}
                      </select>
                      
                      <div className="flex justify-end">
                        {!isAddingProvince ? (
                          <button
                            type="button"
                            onClick={() => setIsAddingProvince(true)}
                            className="text-primary-600 text-xs font-medium hover:text-primary-800 transition-colors"
                          >
                            + Añadir provincia
                          </button>
                        ) : (
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-secondary-50 p-2 rounded-lg border border-secondary-200 w-full">
                            <input
                              type="text"
                              value={newProvinceName}
                              onChange={(e) => setNewProvinceName(e.target.value)}
                              placeholder="Nombre..."
                              className="px-2 py-1 text-xs border border-secondary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
                              autoFocus
                              disabled={isSavingProvince}
                            />
                            <button
                              type="button"
                              onClick={handleAddProvince}
                              disabled={isSavingProvince || !newProvinceName.trim()}
                              className="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap"
                            >
                              ✓
                            </button>
                            <button
                              type="button"
                              onClick={() => { setIsAddingProvince(false); setNewProvinceName(''); }}
                              disabled={isSavingProvince}
                              className="px-2 py-1 text-xs text-secondary-500 hover:text-secondary-700"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Select y creación de Localidad */}
                    <div className="space-y-2">
                      <select
                        id="f-location"
                        name="location_id"
                        required
                        value={form.location_id}
                        onChange={handleChange}
                        className={`${INPUT_CLS} ${!selectedProvince ? 'opacity-50 cursor-not-allowed bg-secondary-50' : ''}`}
                        disabled={!selectedProvince}
                      >
                        <option value="">
                          {selectedProvince ? '— Localidad —' : '← Primero elige provincia'}
                        </option>
                        {filteredLocations.map((loc) => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                      
                      {selectedProvince && (
                        <div className="flex justify-end">
                          {!isAddingLocation ? (
                            <button
                              type="button"
                              onClick={() => setIsAddingLocation(true)}
                              className="text-primary-600 text-xs font-medium hover:text-primary-800 transition-colors"
                            >
                              + Añadir localidad
                            </button>
                          ) : (
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-secondary-50 p-2 rounded-lg border border-secondary-200 w-full">
                              <input
                                type="text"
                                value={newLocationName}
                                onChange={(e) => setNewLocationName(e.target.value)}
                                placeholder="Nombre..."
                                className="px-2 py-1 text-xs border border-secondary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
                                autoFocus
                                disabled={isSavingLocation}
                              />
                              <button
                                type="button"
                                onClick={handleAddLocation}
                                disabled={isSavingLocation || !newLocationName.trim()}
                                className="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap"
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                onClick={() => { setIsAddingLocation(false); setNewLocationName(''); }}
                                disabled={isSavingLocation}
                                className="px-2 py-1 text-xs text-secondary-500 hover:text-secondary-700"
                              >
                                ✕
                              </button>
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
            <ImageUploader referenceCode={referenceCode} />
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
