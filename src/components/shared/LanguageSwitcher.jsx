import { useTranslation } from 'react-i18next'
import { SITE } from '../../config/siteConfig'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'es'

  if (!SITE.features.i18n) return null

  return (
    <div className="flex items-center gap-1.5 text-sm font-medium mr-2">
      <button 
        onClick={() => i18n.changeLanguage('es')}
        className={`hover:text-primary-600 px-1.5 transition-colors ${currentLang.startsWith('es') ? 'text-primary-700 underline underline-offset-4' : 'text-secondary-500'}`}
      >
        ES
      </button>
      <span className="text-secondary-300">|</span>
      <button 
        onClick={() => i18n.changeLanguage('en')}
        className={`hover:text-primary-600 px-1.5 transition-colors ${currentLang.startsWith('en') ? 'text-primary-700 underline underline-offset-4' : 'text-secondary-500'}`}
      >
        EN
      </button>
    </div>
  )
}
