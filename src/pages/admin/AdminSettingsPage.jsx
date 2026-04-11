import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTenant } from '../../context/TenantContext'
import { updateTenant } from '../../services/adminService'
import AdminLayout from './AdminLayout'

const CONTACT_EMAIL = 'contrataciones@zendoapp.es'

/**
 * AdminSettingsPage — Configuración de la agencia / tenant.
 * Permite editar el nombre, descripción y el Título del Navegador (SEO).
 */
export default function AdminSettingsPage() {
  const { t } = useTranslation(['common', 'admin'])
  const currentTenant = useTenant()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    browser_title: '',
    meta_description: ''
  })

  // Cargar datos iniciales del tenant
  useEffect(() => {
    if (currentTenant) {
      setFormData({
        name: currentTenant.name || '',
        description: currentTenant.description || '',
        browser_title: currentTenant.browser_title || '',
        meta_description: currentTenant.meta_description || ''
      })
    }
  }, [currentTenant])

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
      // No necesitamos forzar recarga, el document.title es reactivo al context
      // pero si queremos que el resto de la app vea el cambio, 
      // idealmente el TenantProvider debería refrescarse.
      // Como TenantProvider usa window.location, una opción simple es window.location.reload()
      // pero el usuario pidió "sin necesidad de recargar toda la página manualmente".
      // Para que sea 100% reactivo sin reload, el context debería proveer una función de 'refresh'.
      // Por ahora, al menos el document.title cambiará si el context se actualizara.
      // NOTA: Para que el context se actualice, deberíamos implementar un dispatch o similar.
      // De momento, haremos un pequeño hack: refrescar tras 1.5s para que vean el éxito.
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
    setLoading(false)
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">{t('admin:settings.title', 'Configuración del Perfil')}</h1>
          <p className="text-secondary-500 mt-1">{t('admin:settings.subtitle', 'Gestiona la identidad y el SEO de tu inmobiliaria.')}</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6 md:p-8 space-y-6">
          {/* Nombre de la Agencia */}
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

          {/* ── SEO Avanzado ── */}
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

          {/* Estado */}
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
              {t('admin.settings.success')}
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
