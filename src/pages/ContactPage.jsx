import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTenant } from '../context/TenantContext'
import { sendContactEmail } from '../services/contactService'
import { useThemeStore } from '../store/themeStore'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

/**
 * ContactPage — Formulario de contacto dinámico configurado por Tenant.
 */
export default function ContactPage() {
  const { t } = useTranslation('contact')
  const tenant = useTenant()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitState, setSubmitState] = useState('idle')

  // ── Valores Dinámicos del Tenant ──
  const phones = tenant?.phones ?? []
  const heroContent = tenant?.hero ?? {}

  // Usamos los mismos campos del Hero o los fallbacks de traducción
  const contactEyebrow = heroContent.eyebrow || t('hero.eyebrow')
  const contactTitle = t('hero.title') // Normalmente "Contacto" o "Habla con nosotros"
  const contactSubtitle = heroContent.subtitle || t('hero.subtitle')

  const SUBJECTS = [
    t('subjects.buy', 'Quiero comprar una propiedad'),
    t('subjects.rent', 'Quiero alquilar una propiedad'),
    t('subjects.sell', 'Quiero vender mi propiedad'),
    t('subjects.let', 'Quiero poner mi piso en alquiler'),
    t('subjects.mortgage', 'Asesoría hipotecaria'),
    t('subjects.other', 'Otro'),
  ]

  const INFO_BLOCKS = [
    {
      icon: '📍',
      title: t('info.address'),
      lines: [
        { text: tenant?.address || t('info.addressVal') }
      ],
    },
    {
      icon: '📞',
      title: t('info.phone'),
      // Mapeo correcto para array de strings (phones)
      lines: phones.map((p) => ({
        text: p,
        href: `tel:${p.replace(/\s+/g, '')}`
      })),
    },
    {
      icon: '✉️',
      title: t('info.email'),
      lines: [
        { text: tenant?.email, href: tenant?.email ? `mailto:${tenant.email}` : '#' },
        { text: t('info.hoursVal') },
      ],
    },
  ]

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = t('form.namePlaceholder')
    if (!form.email.trim()) {
      errs.email = t('form.emailPlaceholder')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t('form.emailPlaceholder')
    }
    if (!form.subject) errs.subject = t('form.messagePlaceholder')
    if (!form.message.trim() || form.message.length < 20) {
      errs.message = t('form.messagePlaceholder')
    }
    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitState('submitting')

    try {
      const messageWithPhone = form.phone
        ? `Teléfono de contacto: ${form.phone}\n\n${form.message}`
        : form.message

      await sendContactEmail({
        name: form.name,
        email: form.email,
        message: messageWithPhone,
        property: `Consulta general: ${form.subject}`,
        tenant_id: tenant?.id // Enviamos el ID para que el servicio sepa a quién notificar
      })

      setSubmitState('success')
      setForm(INITIAL_FORM)
      setErrors({})
    } catch (error) {
      console.error(error)
      setSubmitState('error')
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 transition ${errors[field]
      ? 'border-red-400 focus:ring-red-400'
      : 'border-secondary-200 focus:ring-primary-600'
    }`

  const theme = useThemeStore((s) => s.theme)
  const isMinimal = theme === 'MINIMAL'

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 ${isMinimal ? 'pt-32 md:pt-40' : 'pt-16'}`}>
      <header className="max-w-2xl mb-14">
        {/* Usamos el Eyebrow dinámico de la DB */}
        <p className="text-primary-700 font-semibold text-sm tracking-wide uppercase mb-2">
          {contactEyebrow}
        </p>
        {/* Título dinámico */}
        <h1 className="text-4xl font-bold text-secondary-950 mb-3">
          {contactTitle}
        </h1>
        {/* Subtítulo dinámico */}
        <p className="text-secondary-500 text-lg">
          {contactSubtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <aside className="lg:col-span-2 space-y-6" aria-label="Información de contacto">
          {INFO_BLOCKS.map(({ icon, title, lines }) => (
            <div key={title} className="flex gap-4 bg-white border border-secondary-100 rounded-2xl p-5 shadow-sm">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
              <div>
                <h2 className="font-semibold text-secondary-900 text-sm mb-1">{title}</h2>
                {lines.map((line, idx) => (
                  line.href ? (
                    <a key={idx} href={line.href} className="text-sm text-primary-700 hover:text-primary-800 transition block">
                      {line.text}
                    </a>
                  ) : (
                    <p key={idx} className="text-sm text-secondary-500">{line.text}</p>
                  )
                ))}
              </div>
            </div>
          ))}
        </aside>

        <section className="lg:col-span-3" aria-label="Formulario de contacto">
          {submitState === 'success' ? (
            <div className="h-full flex items-center justify-center py-16">
              <div className="animate-pop-in bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-12 text-center w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">{t('success.title')}</h2>
                <p className="text-emerald-700">{t('success.message')}</p>
                <button
                  onClick={() => setSubmitState('idle')}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  {t('success.again')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm space-y-5">
              {submitState === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                  {t('error.message')}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                    {t('form.nameLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name" name="name" type="text" required value={form.name}
                    onChange={handleChange} placeholder={t('form.namePlaceholder')}
                    className={inputClass('name')}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                    {t('form.emailLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email" name="email" type="email" required value={form.email}
                    onChange={handleChange} placeholder={t('form.emailPlaceholder')}
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">{t('form.phoneLabel')}</label>
                <input
                  id="phone" name="phone" type="tel" value={form.phone}
                  onChange={handleChange} placeholder={t('form.phonePlaceholder')}
                  className={inputClass('phone')}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-1">
                  {t('form.subjectLabel')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject" name="subject" required value={form.subject}
                  onChange={handleChange} className={inputClass('subject')}
                >
                  <option value="" disabled>{t('form.subjectPlaceholder')}</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1">
                  {t('form.messageLabel')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message" name="message" required rows={5} value={form.message}
                  onChange={handleChange} placeholder={t('form.messagePlaceholder')}
                  className={`${inputClass('message')} resize-none`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                <p className="mt-1 text-xs text-secondary-400 text-right">{form.message.length} / 500</p>
              </div>

              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="w-full py-3.5 rounded-xl bg-primary-700 text-white font-semibold hover:bg-primary-800 disabled:opacity-60 transition-colors text-sm"
              >
                {submitState === 'submitting' ? t('form.sending') : t('form.sendBtn')}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}