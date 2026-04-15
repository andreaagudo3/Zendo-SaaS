import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTenant } from '../../context/TenantContext'
import { updateTenant } from '../../services/adminService'
import { uploadTenantImage } from '../../services/imageService'
import AdminLayout from './AdminLayout'

const CONTACT_EMAIL = 'contrataciones@zendoapp.es'

// ─── Reusable image-uploader card ─────────────────────────────────────────────

/**
 * BrandingImageUploader — Drag-and-drop / click-to-upload card for a single
 * tenant image (logo or home_header). Saves immediately on file selection.
 */
function BrandingImageUploader({ imageKey, label, description, currentUrl, tenant, onUploaded }) {
  const { t } = useTranslation(['admin'])
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentUrl || null)
  const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', msg }
  const [dragging, setDragging] = useState(false)

  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

  // Keep preview in sync when parent URL changes
  useEffect(() => {
    setPreviewUrl(currentUrl || null)
  }, [currentUrl])

  async function handleFile(file) {
    if (!file) return
    // Client-side format guard (service also validates, this gives instant UX feedback)
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFeedback({ type: 'error', msg: t('admin:settings.branding.invalidFormat') })
      return
    }
    setUploading(true)
    setFeedback(null)

    // Optimistic local preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    const { url, error } = await uploadTenantImage(file, imageKey, tenant)

    if (error) {
      setPreviewUrl(currentUrl || null)
      setFeedback({ type: 'error', msg: t('admin:settings.branding.uploadError', { message: error.message }) })
      setUploading(false)
      URL.revokeObjectURL(objectUrl)
      return
    }

    // Persist URL to tenants table
    const colName = imageKey === 'logo' ? 'logo_url' : 'home_header_url'
    const { error: saveError } = await updateTenant(tenant.id, { [colName]: url })

    if (saveError) {
      setFeedback({ type: 'error', msg: t('admin:settings.branding.uploadError', { message: saveError.message }) })
    } else {
      setPreviewUrl(url)
      setFeedback({ type: 'success', msg: t('admin:settings.branding.uploadSuccess') })
      onUploaded?.({ key: imageKey, url })
    }

    setUploading(false)
    URL.revokeObjectURL(objectUrl)
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset so the same file can be picked again
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-secondary-700">{label}</p>
        <p className="text-xs text-secondary-400 mt-0.5 leading-relaxed">{description}</p>
      </div>

      {/* Drop zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
          dragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-200 bg-secondary-50 hover:border-primary-400 hover:bg-primary-50/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {/* Preview */}
        {previewUrl ? (
          <div className={`${imageKey === 'logo' ? 'h-32' : 'h-48'} w-full relative group`}>
            <img
              src={previewUrl}
              alt={label}
              className={`w-full h-full ${imageKey === 'logo' ? 'object-contain p-4' : 'object-cover'}`}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-secondary-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-white text-secondary-900 rounded-xl text-sm font-bold shadow-lg hover:bg-secondary-50 transition-colors"
              >
                {uploading ? t('admin:settings.branding.uploading') : t('admin:settings.branding.changeBtn')}
              </button>
            </div>
            {/* Uploading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-3 py-10 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : (
              <svg className="h-10 w-10 text-secondary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            <span className="text-sm font-medium text-secondary-500">
              {uploading ? t('admin:settings.branding.uploading') : t('admin:settings.branding.uploadBtn')}
            </span>
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Feedback */}
      {feedback && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium animate-fade-in-down ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {feedback.type === 'success' ? (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {feedback.msg}
        </div>
      )}
    </div>
  )
}

// ─── AdminSettingsPage ────────────────────────────────────────────────────────

/**
 * AdminSettingsPage — Configuración de la agencia / tenant.
 * Permite editar el nombre, SEO y las imágenes de marca (logo + home_header).
 */
export default function AdminSettingsPage() {
  const { t } = useTranslation(['common', 'admin'])
  const currentTenant = useTenant()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Live brand image URLs (updated immediately on upload, before page reload)
  const [logoUrl, setLogoUrl] = useState(null)
  const [homeHeaderUrl, setHomeHeaderUrl] = useState(null)

  // Text form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    browser_title: '',
    meta_description: ''
  })

  // Load initial tenant data
  useEffect(() => {
    if (currentTenant) {
      setFormData({
        name: currentTenant.name || '',
        description: currentTenant.description || '',
        browser_title: currentTenant.browser_title || '',
        meta_description: currentTenant.meta_description || ''
      })
      setLogoUrl(currentTenant.logo_url || null)
      setHomeHeaderUrl(currentTenant.home_header_url || null)
    }
  }, [currentTenant])

  function handleBrandingUploaded({ key, url }) {
    if (key === 'logo') setLogoUrl(url)
    if (key === 'home_header') setHomeHeaderUrl(url)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    const { error: updateError } = await updateTenant(currentTenant.id, formData)

    if (updateError) {
      setError(`Error al guardar: ${updateError.message}`)
    } else {
      setSuccess(true)
      setTimeout(() => { window.location.reload() }, 1500)
    }
    setLoading(false)
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="mb-2">
          <h1 className="text-3xl font-bold text-secondary-900">{t('admin:settings.title', 'Configuración del Perfil')}</h1>
          <p className="text-secondary-500 mt-1">{t('admin:settings.subtitle', 'Gestiona la identidad y el SEO de tu inmobiliaria.')}</p>
        </header>

        {/* ── Branding Images ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold text-secondary-700 uppercase tracking-wide">
            {t('admin:settings.branding.title', 'Imágenes de Marca')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Logo */}
            <BrandingImageUploader
              imageKey="logo"
              label={t('admin:settings.branding.logoLabel', 'Logo de la Inmobiliaria')}
              description={t('admin:settings.branding.logoDesc', 'Aparece en la barra de navegación y en el pie de página.')}
              currentUrl={logoUrl}
              tenant={currentTenant}
              onUploaded={handleBrandingUploaded}
            />

            {/* Home Header */}
            <BrandingImageUploader
              imageKey="home_header"
              label={t('admin:settings.branding.homeHeaderLabel', 'Imagen de Cabecera (Home)')}
              description={t('admin:settings.branding.homeHeaderDesc', 'Imagen de fondo del hero en la página principal.')}
              currentUrl={homeHeaderUrl}
              tenant={currentTenant}
              onUploaded={handleBrandingUploaded}
            />
          </div>
        </section>

        {/* ── Text Settings Form ── */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6 md:p-8 space-y-6">
          {/* Agency Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-secondary-700">
              {t('admin:settings.agencyName', 'Nombre de la Inmobiliaria')}
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all text-secondary-800"
            />
          </div>

          {/* ── Advanced SEO ── */}
          {(() => {
            const fieldCls = `w-full px-4 py-3 rounded-xl border border-secondary-200 outline-none transition-all text-secondary-800 focus:ring-2 focus:ring-primary-600 focus:border-transparent`
            return (
              <fieldset className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-secondary-700 uppercase tracking-wide">{t('admin:seo.advancedTitle')}</h3>
                </div>

                <div className="space-y-2">
                  <label htmlFor="browser_title" className="block text-sm font-semibold text-secondary-700">
                    {t('admin:seo.browserTitle')}
                  </label>
                  <input
                    id="browser_title"
                    type="text"
                    placeholder={t('admin:seo.placeholderTitle')}
                    value={formData.browser_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, browser_title: e.target.value }))}
                    className={fieldCls}
                  />
                  <p className="text-xs text-secondary-400 italic">
                    {t('admin:seo.browserTitleDesc')}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="meta_description" className="block text-sm font-semibold text-secondary-700">
                      {t('admin:seo.globalDesc')}
                    </label>
                    <span className={`text-xs font-medium ${formData.meta_description.length > 155 ? 'text-red-500' : 'text-secondary-400'}`}>
                      {formData.meta_description.length} / 155
                    </span>
                  </div>
                  <textarea
                    id="meta_description"
                    rows={3}
                    placeholder={t('admin:seo.placeholderDesc')}
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    className={`${fieldCls} resize-none font-sans`}
                  />
                  <p className="text-xs text-secondary-400 italic leading-relaxed">
                    {t('admin:seo.globalDescDesc')}
                  </p>
                </div>
              </fieldset>
            )
          })()}

          {/* Status */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('admin:settings.success')}
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3.5 bg-primary-700 text-white rounded-xl font-bold hover:bg-primary-800 transition-all shadow-lg shadow-primary-900/20 disabled:opacity-50"
            >
              {loading ? t('btn.sending') : t('btn.save')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
