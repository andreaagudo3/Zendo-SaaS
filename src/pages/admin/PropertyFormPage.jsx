import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createProperty, updateProperty,
  getAdminPropertiesPaginated, getProvinces, createLocation, createProvince,
  getPropertyById, getPropertyFeatures, syncPropertyFeatures
} from '../../services/adminService'
import { supabase } from '../../services/supabaseClient'
import { useTenant } from '../../context/TenantContext'
import { slugify, generateReferenceCode } from '../../utils/slugify'
import ImageUploader from '../../components/admin/ImageUploader'
import PropertyFeatureManager from '../../components/admin/PropertyFeatureManager'
import AdminLayout from './AdminLayout'

const EMPTY_FORM = {
  title: '', description: '', price: '',
  location_id: '', bedrooms: '', bathrooms: '',
  size_m2: '', listing_type: 'sale',
  property_type: '', status: 'available',
  published: true, featured: false,
  meta_description: '',
  meta_title: '',
  internal_notes: '',
  owner_contact: '',
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
  const { t } = useTranslation(['common', 'properties', 'admin'])
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
  const [selectedFeatureIds, setSelectedFeatureIds] = useState([])

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
      setCoverImageUrl(prop.image_cover_url ?? null)
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
        internal_notes: prop.internal_notes ?? '',
        owner_contact: prop.owner_contact ?? '',
      })

      // Resolve selected province from the current location
      if (prop.location_id && locations.length > 0) {
        const loc = locations.find((l) => l.id === prop.location_id)
        if (loc) setSelectedProvince(loc.province_id)
      }

      // Load existing features
      getPropertyFeatures(id).then((featureIds) => {
        setSelectedFeatureIds(featureIds || [])
      }).finally(() => {
        setLoadingProp(false)
      })
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

    const seoEnabled = tenant?.effective_features?.manualSeo === true
    const internalEnabled = tenant?.effective_features?.internalManagement === true

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
      // SEO fields
      ...(seoEnabled && {
        meta_description: form.meta_description.trim() || null,
        meta_title: form.meta_title.trim() || null,
      }),
      // Internal fields
      ...(internalEnabled && {
        internal_notes: form.internal_notes.trim() || null,
        owner_contact: form.owner_contact.trim() || null,
      }),
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

    // Sync features
    const savedPropertyId = isEdit ? id : result.data.id
    await syncPropertyFeatures(savedPropertyId, selectedFeatureIds)

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

  // Tracks the cover URL locally so we can refresh the preview without a full reload.
  // Seeded from the DB when the property is loaded (see useEffect above).
  const [coverImageUrl, setCoverImageUrl] = useState(null)
  const [coverUpdatedStatus, setCoverUpdatedStatus] = useState(false)

  function handleCoverChange(url) {
    setCoverImageUrl(url)
    setCoverUpdatedStatus(true)
    setTimeout(() => {
      setCoverUpdatedStatus(false)
    }, 3500)
  }

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
      <div className="max-w-5xl mx-auto">
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
              {isEdit ? t('admin:properties.editTitle') : t('admin:properties.newTitle')}
            </h1>
            {referenceCode && (
              <p className="text-xs text-secondary-400 font-mono">Ref: {referenceCode}</p>
            )}
          </div>
        </div>

        {/* Feedback */}
        {status === 'success' && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
            ✅ {isEdit ? t('admin:properties.feedback.saveSuccess') : t('admin:properties.feedback.createSuccess')}
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
            <h2 className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">{t('admin:properties.form.basicData')}</h2>

            <Field label={t('admin:properties.form.title')} htmlFor="f-title">
              <input id="f-title" name="title" required value={form.title} onChange={handleChange}
                placeholder={t('admin:properties.form.titlePlaceholder')} className={INPUT_CLS} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('admin:properties.form.price')} htmlFor="f-price">
                <input id="f-price" name="price" type="number" min="0" value={form.price} onChange={handleChange}
                  placeholder={t('admin:properties.form.pricePlaceholder')} className={INPUT_CLS} />
              </Field>
              <div className="space-y-4">
                <Field label={t('admin:properties.form.location')} htmlFor="f-province">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Province select + inline creation */}
                    <div className="space-y-2">
                      <select id="f-province" className={INPUT_CLS} value={selectedProvince} onChange={handleProvinceChange}>
                        <option value="">{t('admin:properties.form.provincePlaceholder')}</option>
                        {provinces.map((prov) => (
                          <option key={prov.id} value={prov.id}>{prov.name}</option>
                        ))}
                      </select>
                      <div className="flex justify-end">
                        {!isAddingProvince ? (
                          <button type="button" onClick={() => setIsAddingProvince(true)}
                            className="text-primary-600 text-xs font-medium hover:text-primary-800 transition-colors">
                            {t('admin:properties.form.addProvince')}
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
                        <option value="">{selectedProvince ? t('admin:properties.form.locationPlaceholder') : t('admin:properties.form.chooseProvinceFirst')}</option>
                        {filteredLocations.map((loc) => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                      {selectedProvince && (
                        <div className="flex justify-end">
                          {!isAddingLocation ? (
                            <button type="button" onClick={() => setIsAddingLocation(true)}
                              className="text-primary-600 text-xs font-medium hover:text-primary-800 transition-colors">
                              {t('admin:properties.form.addLocation')}
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

            <Field label={t('admin:properties.form.description')} htmlFor="f-desc">
              <textarea id="f-desc" name="description" rows={15} value={form.description} onChange={handleChange}
                placeholder={t('admin:properties.form.descriptionPlaceholder')} className={INPUT_CLS + ' resize-none'} />
            </Field>
          </section>

          {/* Detalles */}
          <section className="bg-white rounded-2xl border border-secondary-200 p-6 space-y-4 shadow-sm">
            <h2 className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">{t('admin:properties.form.details')}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label={t('admin:properties.form.bedrooms')} htmlFor="f-bed">
                <input id="f-bed" name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={handleChange}
                  placeholder="3" className={INPUT_CLS} />
              </Field>
              <Field label={t('admin:properties.form.bathrooms')} htmlFor="f-bath">
                <input id="f-bath" name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={handleChange}
                  placeholder="2" className={INPUT_CLS} />
              </Field>
              <Field label={t('admin:properties.form.surface')} htmlFor="f-m2">
                <input id="f-m2" name="size_m2" type="number" min="0" value={form.size_m2} onChange={handleChange}
                  placeholder="150" className={INPUT_CLS} />
              </Field>
              <Field label={t('admin:properties.form.propertyType')} htmlFor="f-ptype">
                <select id="f-ptype" name="property_type" value={form.property_type} onChange={handleChange} className={INPUT_CLS}>
                  <option value="">{t('admin:properties.form.types.unspecified')}</option>
                  <option value="house">{t('admin:properties.form.types.house')}</option>
                  <option value="apartment">{t('admin:properties.form.types.apartment')}</option>
                  <option value="land">{t('admin:properties.form.types.land')}</option>
                  <option value="rural">{t('admin:properties.form.types.rural')}</option>
                  <option value="commercial">{t('admin:properties.form.types.commercial')}</option>
                  <option value="garage">{t('admin:properties.form.types.garage')}</option>
                  <option value="office">{t('admin:properties.form.types.office')}</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label={t('admin:properties.form.operation')} htmlFor="f-ltype">
                <select id="f-ltype" name="listing_type" value={form.listing_type} onChange={handleChange} className={INPUT_CLS}>
                  <option value="sale">{t('common:listing.sale')}</option>
                  <option value="rent">{t('common:listing.rent')}</option>
                </select>
              </Field>
              <Field label={t('admin:properties.form.status')} htmlFor="f-status">
                <select id="f-status" name="status" value={form.status} onChange={handleChange} className={INPUT_CLS}>
                  <option value="available">{t('common:status.available')}</option>
                  <option value="reserved">{t('common:status.reserved')}</option>
                  <option value="sold">{t('common:status.sold')}</option>
                </select>
              </Field>
              <div className="flex flex-col gap-3 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700">
                  <input type="checkbox" name="published" checked={form.published} onChange={handleChange}
                    className="w-4 h-4 rounded accent-primary-700" />
                  {t('admin:properties.form.published')}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary-700">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                    className="w-4 h-4 rounded accent-primary-700" />
                  {t('admin:properties.form.featured')}
                </label>
              </div>
            </div>
          </section>

          {/* Imágenes */}
          <section className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">Imágenes</h2>

            {coverUpdatedStatus && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 animate-fade-in-down" style={{ animationDuration: '0.3s' }}>
                ✅ Portada de la propiedad actualizada correctamente.
              </div>
            )}

            {!isEdit && (
              <p className="text-xs text-secondary-400">
                Las imágenes se pueden subir después de guardar la propiedad.
              </p>
            )}
            {/* Current cover thumbnail */}
            {isEdit && coverImageUrl && (
              <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl border border-secondary-200">
                <img
                  src={coverImageUrl}
                  alt="Portada actual"
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <p className="text-xs text-secondary-500">
                  <span className="font-semibold text-secondary-700">Imagen de portada actual.</span>{' '}
                  Haz clic en otra imagen de la galería para cambiarla.
                </p>
              </div>
            )}
            <ImageUploader
              property={imageProperty}
              tenant={tenant}
              onCoverChange={handleCoverChange}
            />
          </section>

          {/* Características */}
          <PropertyFeatureManager
            tenant={tenant}
            selectedFeatureIds={selectedFeatureIds}
            onChange={setSelectedFeatureIds}
          />

          {/* Gestión Interna */}
          {(() => {
            const internalEnabled = tenant?.effective_features?.internalManagement === true
            const fieldCls = `w-full px-4 py-2.5 rounded-xl border border-secondary-200 text-sm text-secondary-900 placeholder-secondary-400 outline-none transition ${internalEnabled
                ? 'bg-white focus:ring-2 focus:ring-primary-600 focus:border-transparent'
                : 'bg-secondary-50 opacity-50 cursor-not-allowed'
              }`
            return (
              <section className="bg-white rounded-2xl border border-secondary-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">{t('admin:properties.internal.title', 'Gestión Interna Privada')}</h2>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-secondary-500 bg-secondary-100 border border-secondary-200 px-2 py-0.5 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                      {t('admin:properties.internal.invisibleBadge', 'Invisible al público')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!internalEnabled && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        {t('admin:seo.lockedBadge', 'No incluido en tu plan')}
                      </span>
                    )}
                  </div>
                </div>

                {!internalEnabled && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 leading-relaxed">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <span>
                      {t('admin:properties.internal.lockedMsg', 'Para documentar datos de propietarios y añadir gestiones privadas a las propiedades, consulta nuestras expansiones en contrataciones@zendoapp.es')}
                    </span>
                  </div>
                )}

                {internalEnabled && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-xs text-secondary-600 leading-relaxed">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-secondary-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>
                      <strong>{t('admin:properties.internal.privacyStrong', '100% Privado.')}</strong> {t('admin:properties.internal.privacyText', 'Cualquier dato o contacto que introduzcas en esta sección es estrictamente confidencial. Nunca se mostrará en internet ni en la ficha pública de la propiedad.')}
                    </span>
                  </div>
                )}

                <fieldset disabled={!internalEnabled} className="grid grid-cols-1 gap-4">
                  <Field label={t('admin:properties.internal.ownerContact', 'Contacto del Propietario')} htmlFor="f-owner">
                    <input
                      id="f-owner"
                      name="owner_contact"
                      type="text"
                      value={form.owner_contact}
                      onChange={handleChange}
                      placeholder={t('admin:properties.internal.ownerPlaceholder', 'Ej: Juan Pérez - 655443322')}
                      className={fieldCls}
                    />
                  </Field>

                  <Field label={t('admin:properties.internal.internalNotes', 'Notas Internas (Invisibles al público)')} htmlFor="f-notes">
                    <textarea
                      id="f-notes"
                      name="internal_notes"
                      rows={3}
                      value={form.internal_notes}
                      onChange={handleChange}
                      placeholder={t('admin:properties.internal.notesPlaceholder', 'Comisiones, avisos del propietario, códigos de llaves, estado de contrato...')}
                      className={fieldCls + ' resize-none'}
                    />
                  </Field>
                </fieldset>
              </section>
            )
          })()}

          {/* Configuración SEO */}
          {(() => {
            const seoEnabled = tenant?.effective_features?.manualSeo === true
            const fieldCls = `w-full px-4 py-2.5 rounded-xl border border-secondary-200 text-sm text-secondary-900 placeholder-secondary-400 outline-none transition ${seoEnabled
                ? 'bg-white focus:ring-2 focus:ring-primary-600 focus:border-transparent'
                : 'bg-secondary-50 opacity-50 cursor-not-allowed'
              }`
            return (
              <section className="bg-white rounded-2xl border border-secondary-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">{t('admin:seo.propertyTitle')}</h2>
                    {seoEnabled && (
                      <p className="text-xs text-secondary-400 mt-0.5">{t('admin:seo.propertyDesc')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {seoEnabled && (
                      <span className={`text-xs font-medium ${form.meta_description.length > 155 ? 'text-red-500' : 'text-secondary-400'}`}>
                        {form.meta_description.length} / 155
                      </span>
                    )}
                    {!seoEnabled && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        {t('admin:seo.lockedBadge')}
                      </span>
                    )}
                  </div>
                </div>

                {!seoEnabled && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 leading-relaxed">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <span>
                      {t('admin:seo.lockedMsg', { email: 'contrataciones@zendoapp.es' })}
                    </span>
                  </div>
                )}

                <fieldset disabled={!seoEnabled} className="grid grid-cols-1 gap-4">
                  <Field label={t('admin:seo.googleTitle')} htmlFor="f-mtitle">
                    <input
                      id="f-mtitle"
                      name="meta_title"
                      type="text"
                      value={form.meta_title}
                      onChange={handleChange}
                      placeholder={t('admin:seo.placeholderTitle')}
                      className={fieldCls}
                    />
                    <p className="text-xs text-secondary-400 mt-1 italic">
                      {t('admin:seo.googleTitleDesc')}
                    </p>
                  </Field>

                  <Field label={t('admin:seo.googleDesc')} htmlFor="f-meta">
                    <textarea
                      id="f-meta"
                      name="meta_description"
                      rows={3}
                      value={form.meta_description}
                      onChange={handleChange}
                      placeholder={t('admin:seo.placeholderDesc')}
                      className={fieldCls + ' resize-none'}
                    />
                    <p className="text-xs text-secondary-400 mt-1 italic leading-relaxed">
                      {t('admin:seo.googleDescDesc')}
                    </p>
                  </Field>
                </fieldset>
              </section>
            )
          })()}

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end pb-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-secondary-600 bg-secondary-100 hover:bg-secondary-200 transition-colors"
            >
              {t('btn.cancel')}
            </button>
            <button
              type="submit"
              disabled={status === 'saving'}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-700 hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'saving' ? t('btn.sending') : isEdit ? t('btn.saveChanges') : t('btn.createProperty')}
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
