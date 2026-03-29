import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sendContactEmail } from '../../../services/contactService'
import { SITE } from '../../../config/siteConfig'

const CONTACT_INITIAL = { name: '', email: '', phone: '', message: '' }

export function PropertyContactForm({ propertyTitle }) {
  const { t } = useTranslation('property')
  const [contactForm, setContactForm] = useState(CONTACT_INITIAL)
  const [contactErrors, setContactErrors] = useState({})
  const [submitState, setSubmitState] = useState('idle')

  function validateContact() {
    const errs = {}
    if (!contactForm.name.trim())    errs.name    = t('contact.required')
    if (!contactForm.email.trim()) {
      errs.email = t('contact.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errs.email = t('contact.required')
    }
    if (!contactForm.message.trim()) errs.message = t('contact.required')
    return errs
  }

  async function handleContactSubmit(e) {
    e.preventDefault()
    const errs = validateContact()
    if (Object.keys(errs).length > 0) { setContactErrors(errs); return }
    setSubmitState('submitting')

    try {
      const messageWithPhone = contactForm.phone
        ? `Teléfono de contacto: ${contactForm.phone}\n\n${contactForm.message}`
        : contactForm.message

      await sendContactEmail({
        name:     contactForm.name,
        email:    contactForm.email,
        message:  messageWithPhone,
        property: propertyTitle
      })

      setSubmitState('success')
      setContactForm(CONTACT_INITIAL)
      setContactErrors({})
    } catch (error) {
      console.error(error)
      setSubmitState('error')
    }
  }

  function handleFieldChange(e) {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
    if (contactErrors[name]) setContactErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const FIELDS = [
    { name: 'name',  label: t('contact.nameLabel'),  type: 'text',  placeholder: t('contact.namePlaceholder'),  required: true  },
    { name: 'email', label: t('contact.emailLabel'), type: 'email', placeholder: t('contact.emailPlaceholder'), required: true  },
    { name: 'phone', label: t('contact.phoneLabel'), type: 'tel',   placeholder: '+34 600 000 000',             required: false },
  ]

  return (
    <aside aria-label="Formulario de contacto" className="lg:col-span-1">
      <div className="sticky top-20 bg-white border border-slate-200 rounded-2xl shadow-lg p-6 space-y-5">
        <h2 className="text-xl font-bold text-slate-950">{t('contact.title')}</h2>
        <p className="text-sm text-slate-500">{t('contact.subtitle')}</p>

        {submitState === 'success' ? (
          <div className="animate-pop-in bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-pop-in">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" className="animate-draw-check" />
                </svg>
              </div>
            </div>
            <p className="font-bold text-emerald-900 text-lg animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {t('contact.successTitle')}
            </p>
            <p className="text-sm text-emerald-700 mt-1 animate-fade-up" style={{ animationDelay: '0.35s' }}>
              {t('contact.successMsg')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4" noValidate>
            {submitState === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 animate-fade-up">
                {t('contact.errorMsg')}
              </div>
            )}

            {FIELDS.map(({ name, label, type, placeholder, required }) => (
              <div key={name}>
                <label htmlFor={`contact-${name}`} className="block text-sm font-medium text-slate-700 mb-1">
                  {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <input
                  id={`contact-${name}`}
                  type={type}
                  name={name}
                  value={contactForm[name]}
                  onChange={handleFieldChange}
                  placeholder={placeholder}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    contactErrors[name] ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-primary-600'
                  }`}
                />
                {contactErrors[name] && <p className="mt-1 text-xs text-red-500">{contactErrors[name]}</p>}
              </div>
            ))}

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1">
                {t('contact.messageLabel')}<span className="text-red-500 ml-0.5">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={contactForm.message}
                onChange={handleFieldChange}
                rows={4}
                placeholder={t('contact.messageDefault', { title: propertyTitle })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition resize-none ${
                  contactErrors.message ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-primary-600'
                }`}
              />
              {contactErrors.message && <p className="mt-1 text-xs text-red-500">{contactErrors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitState === 'submitting'}
              className="w-full py-3 rounded-xl bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              aria-label={t('contact.sendBtn')}
            >
              {submitState === 'submitting' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  {t('contact.sending')}
                </span>
              ) : t('contact.sendBtn')}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 mb-2">{t('contact.orCallDirectly', 'O llámanos directamente')}</p>
          {SITE.phones.map((p, i) => (
            <span key={p.href}>
              <a
                href={p.href}
                className="text-primary-700 font-semibold text-lg hover:text-primary-900 transition-colors"
                aria-label={t('contact.callAria', 'Llamar al {{n}}', { n: p.number })}
              >
                {p.number}
              </a>
              {i < SITE.phones.length - 1 && <span className="text-slate-300 mx-2">·</span>}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
