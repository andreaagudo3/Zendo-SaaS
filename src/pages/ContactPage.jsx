import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SITE } from '../config/siteConfig'
import { sendContactEmail } from '../services/contactService'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}



/**
 * ContactPage — full contact form with validation and visual feedback.
 */
export default function ContactPage() {
  const { t } = useTranslation('contact')
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitState, setSubmitState] = useState('idle') // idle | submitting | success | error

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
        { text: SITE.zone },
        { text: `${SITE.province}, ${SITE.country}` },
      ],
    },
    {
      icon: '📞',
      title: t('info.phone'),
      lines: SITE.phones.map((p) => ({ text: p.number, href: p.href })),
    },
    {
      icon: '✉️',
      title: t('info.email'),
      lines: [
        { text: SITE.email.address, href: `mailto:${SITE.email.address}` },
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
    // Clear error on change
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
        property: `Consulta general: ${form.subject}`
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
    `w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${errors[field]
      ? 'border-red-400 focus:ring-red-400'
      : 'border-slate-200 focus:ring-primary-600'
    }`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Page header */}
      <header className="max-w-2xl mb-14">
        <p className="text-primary-700 font-semibold text-sm tracking-wide uppercase mb-2">{t('hero.eyebrow')}</p>
        <h1 className="text-4xl font-bold text-slate-950 mb-3">{t('hero.title')}</h1>
        <p className="text-slate-500 text-lg">
          {t('hero.subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Contact info */}
        <aside className="lg:col-span-2 space-y-6" aria-label="Información de contacto">
          {INFO_BLOCKS.map(({ icon, title, lines }) => (
            <div key={title} className="flex gap-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
              <div>
                <h2 className="font-semibold text-slate-900 text-sm mb-1">{title}</h2>
                {lines.map((line, idx) => (
                  line.href ? (
                    <a key={idx} href={line.href} className="text-sm text-primary-700 hover:text-primary-800 transition block">
                      {line.text}
                    </a>
                  ) : (
                    <p key={idx} className="text-sm text-slate-500">{line.text}</p>
                  )
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Form */}
        <section className="lg:col-span-3" aria-label="Formulario de contacto">
          {submitState === 'success' ? (
            <div className="h-full flex items-center justify-center py-16">
              <div className="animate-pop-in bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-12 text-center w-full max-w-md">
                {/* Checkmark animado */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl animate-pop-in">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" className="animate-draw-check" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-emerald-900 mb-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  {t('success.title')}
                </h2>
                <p className="text-emerald-700 animate-fade-up" style={{ animationDelay: '0.35s' }}>
                  {t('success.message')}
                </p>
                <button
                  onClick={() => setSubmitState('idle')}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors animate-fade-up"
                  style={{ animationDelay: '0.5s' }}
                >
                  {t('success.again')}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5"
            >
              {submitState === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-up">
                  {t('error.message')}
                </div>
              )}

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    {t('form.nameLabel')} <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t('form.namePlaceholder')}
                    className={inputClass('name')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-500" role="alert">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    {t('form.emailLabel')} <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t('form.emailPlaceholder')}
                    className={inputClass('email')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-500" role="alert">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                  {t('form.phoneLabel')}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t('form.phonePlaceholder')}
                  className={inputClass('phone')}
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                  {t('form.subjectLabel', 'Asunto')} <span aria-hidden="true" className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className={inputClass('subject')}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                >
                  <option value="" disabled>{t('form.subjectPlaceholder', 'Selecciona una opción')}</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-xs text-red-500" role="alert">{errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  {t('form.messageLabel')} <span aria-hidden="true" className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t('form.messagePlaceholder')}
                  className={`${inputClass('message')} resize-none`}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-xs text-red-500" role="alert">{errors.message}</p>
                )}
                <p className="mt-1 text-xs text-slate-400 text-right">{form.message.length} / 500</p>
              </div>

              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="w-full py-3.5 rounded-xl bg-primary-700 text-white font-semibold hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm"
                aria-label={t('form.sendBtn')}
              >
                {submitState === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    {t('form.sending')}
                  </span>
                ) : t('form.sendBtn')}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
