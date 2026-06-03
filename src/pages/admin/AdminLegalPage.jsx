import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTenant } from '../../context/TenantContext'
import { updateTenant } from '../../services/adminService'
import { fetchTenantLegalTranslations } from '../../services/tenantResolver'
import AdminLayout from './AdminLayout'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import {
  Bold, Italic, List, ListOrdered,
  Heading2, Heading3, Link as LinkIcon,
  Unlink, FileText, CheckCircle2, AlertCircle,
  Globe, Sparkles, Info, X, ChevronRight, Check,
  Scale, ShieldCheck, Cookie, Lock, Cloud,
  LayoutTemplate, ExternalLink, Zap, AlertTriangle
} from 'lucide-react'
import { legalTemplates, LEGAL_TEMPLATES } from '../../data/legalTemplates'

const DEFAULT_LEGAL_TRANSLATIONS = {
  en: {
    terms: null,
    cookies: null,
    privacy: null
  },
  es: {
    terms: null,
    cookies: null,
    privacy: null
  }
}



function ToolbarSep() {
  return <div className="w-px h-5 bg-secondary-200 mx-0.5 self-center" />
}

function TipTapToolbar({ editor }) {
  if (!editor) return null
  const toggleLink = () => {
    if (editor.isActive('link')) { editor.chain().focus().unsetLink().run(); return }
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL del enlace', previousUrl)
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
  const btn = (active) => `relative p-2 rounded-lg transition-all duration-150 ${active ? 'bg-primary-100 text-primary-700 shadow-sm' : 'text-secondary-500 hover:bg-secondary-100 hover:text-secondary-900'}`
  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2.5 bg-white border-b border-secondary-150">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Negrita"><Bold size={14} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Cursiva"><Italic size={14} /></button>
      <ToolbarSep />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="H2"><Heading2 size={14} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="H3"><Heading3 size={14} /></button>
      <ToolbarSep />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Lista"><List size={14} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Lista Numerada"><ListOrdered size={14} /></button>
      <ToolbarSep />
      <button type="button" onClick={toggleLink} className={btn(editor.isActive('link'))} title="Enlace"><LinkIcon size={14} /></button>
      {editor.isActive('link') && <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className={btn(false)} title="Quitar Enlace"><Unlink size={14} /></button>}
    </div>
  )
}

function LangStatusBadge({ lang, isEmpty }) {
  const flag = lang === 'es' ? 'ES' : 'EN'
  if (isEmpty) return <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold bg-secondary-100 text-secondary-400 border border-dashed border-secondary-300">{flag} <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 inline-block" /></span>
  return <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{flag} <Check size={10} strokeWidth={2.5} /></span>
}

// ─── Publish Confirmation Modal ────────────────────────────────────────────────
function PublishModal({ isOpen, onClose, onConfirm, loading, t }) {
  const [accepted, setAccepted] = useState(false)

  // Reset checkbox each time modal opens
  useEffect(() => {
    if (isOpen) setAccepted(false)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-secondary-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-secondary-200 overflow-hidden animate-fade-up">

        {/* Header — amber warning stripe */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
            <AlertTriangle size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-extrabold text-white text-sm leading-tight">
              {t('legal.publishModal.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-secondary-700 leading-relaxed">
            {t('legal.publishModal.body')}
          </p>

          {/* Numbered clauses */}
          <ol className="space-y-3">
            {[
              t('legal.publishModal.point1'),
              t('legal.publishModal.point2'),
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-extrabold flex items-center justify-center mt-0.5 border border-amber-200">
                  {i + 1}
                </span>
                <p className="text-sm text-secondary-800 leading-relaxed">{point}</p>
              </li>
            ))}
          </ol>

          {/* Required checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 cursor-pointer group hover:bg-amber-100/60 transition-colors">
            <input
              type="checkbox"
              id="publish-accept-checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-amber-500 cursor-pointer shrink-0"
            />
            <span className="text-sm font-semibold text-amber-900 leading-relaxed select-none">
              {t('legal.publishModal.checkboxLabel')}
            </span>
          </label>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          <button
            id="modal-cancel-btn"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-secondary-300 text-secondary-700 font-semibold text-sm hover:bg-secondary-50 transition-colors cursor-pointer"
          >
            {t('legal.publishModal.cancelBtn')}
          </button>
          <button
            id="modal-confirm-publish-btn"
            onClick={() => { if (accepted) onConfirm() }}
            disabled={!accepted || loading}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 ${accepted && !loading
                ? 'bg-primary-700 hover:bg-primary-800 text-white shadow-md hover:shadow-lg cursor-pointer'
                : 'bg-secondary-200 text-secondary-400 cursor-not-allowed opacity-60'
              }`}
          >
            {loading ? (
              <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" /></svg><span>{t('legal.syncingBtn')}</span></>
            ) : (
              <><Cloud size={15} /><span>{t('legal.publishModal.confirmBtn')}</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLegalPage() {
  const currentTenant = useTenant()
  const { t } = useTranslation(['admin'])

  const SECTIONS = [
    { id: 'terms', title: t('legal.sections.terms.title'), titleEn: t('legal.sections.terms.title'), desc: t('legal.sections.terms.desc'), icon: Scale, accentLight: 'bg-violet-50 text-violet-700 border-violet-200' },
    { id: 'privacy', title: t('legal.sections.privacy.title'), titleEn: t('legal.sections.privacy.title'), desc: t('legal.sections.privacy.desc'), icon: ShieldCheck, accentLight: 'bg-sky-50 text-sky-700 border-sky-200' },
    { id: 'cookies', title: t('legal.sections.cookies.title'), titleEn: t('legal.sections.cookies.title'), desc: t('legal.sections.cookies.desc'), icon: Cookie, accentLight: 'bg-amber-50 text-amber-700 border-amber-200' },
  ]

  const [activeSection, setActiveSection] = useState('terms')
  const [activeLang, setActiveLang] = useState('es')
  const [isTemplateSidebarOpen, setIsTemplateSidebarOpen] = useState(false)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [dbWarning, setDbWarning] = useState(false)
  const [localLegalTranslations, setLocalLegalTranslations] = useState(() => {
    if (currentTenant?.legal_translations) {
      const loaded = JSON.parse(JSON.stringify(currentTenant.legal_translations))
      return {
        en: { terms: null, cookies: null, privacy: null, ...loaded.en },
        es: { terms: null, cookies: null, privacy: null, ...loaded.es }
      }
    }
    const fallback = JSON.parse(JSON.stringify(DEFAULT_LEGAL_TRANSLATIONS))
    return fallback
  })

  const [isDirty, setIsDirty] = useState(false)
  const [loadingTranslations, setLoadingTranslations] = useState(true)

  const activeSectionRef = useRef(activeSection)
  const activeLangRef    = useRef(activeLang)
  useEffect(() => { activeSectionRef.current = activeSection; activeLangRef.current = activeLang }, [activeSection, activeLang])

  const isEnUnlocked = !!(
    currentTenant?.effective_features?.i18n ||
    currentTenant?.effective_features?.multiLanguage ||
    currentTenant?.plan === 'enterprise'
  )

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary-600 underline font-medium hover:text-primary-700' } })],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const sec = activeSectionRef.current
      const lng = activeLangRef.current
      setLocalLegalTranslations(prev => {
        if (prev[lng]?.[sec] === html) return prev
        setIsDirty(true)
        return { ...prev, [lng]: { ...prev[lng], [sec]: html } }
      })
    },
    editorProps: { attributes: { class: 'tiptap-editor focus:outline-none min-h-[460px] px-8 py-6 text-secondary-800 prose max-w-none' } },
  })

  const tenantLoadedRef = useRef(false)
  useEffect(() => {
    if (!currentTenant || tenantLoadedRef.current) return
    tenantLoadedRef.current = true
    setLoadingTranslations(true)

    fetchTenantLegalTranslations(currentTenant.id)
      .then(({ data, error }) => {
        if (!error && data) {
          const loaded = JSON.parse(JSON.stringify(data))
          setLocalLegalTranslations({
            en: { terms: null, cookies: null, privacy: null, ...loaded.en },
            es: { terms: null, cookies: null, privacy: null, ...loaded.es }
          })
        } else {
          console.error('[AdminLegalPage] Error loading legal translations:', error)
          const fallback = JSON.parse(JSON.stringify(DEFAULT_LEGAL_TRANSLATIONS))
          setLocalLegalTranslations(fallback)
        }
        setLoadingTranslations(false)
      })
  }, [currentTenant])

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentContent = localLegalTranslations[activeLang]?.[activeSection] || ''
      if (editor.getHTML() !== currentContent) editor.commands.setContent(currentContent)
    }
  }, [activeSection, activeLang, editor, localLegalTranslations])

  // ─── SESSION NAVIGATION BLOCKER (UNSAVED CHANGES WARNING) ─────────────────
  // Intercepts and warns users before they close the tab, click on any link that 
  // navigates away from this CRM page, or hit the browser back/forward buttons,
  // preventing accidental data loss when the editor state is dirty (isDirty === true).
  useEffect(() => {
    // A. Intercept browser tab close, refresh (F5/Cmd+R), or direct URL editing
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = '' // Triggers native browser leave confirmation prompt
      }
    }

    // B. Intercept internal client-side React Router navigation links (click capture phase)
    const handleGlobalClick = (e) => {
      if (!isDirty) return

      // Find the clicked link or button that initiates a navigation
      const target = e.target.closest('a, button')
      if (!target) return

      const href = target.getAttribute('href') || (target.closest('a')?.getAttribute('href'))
      
      // EXCEPTION: Allow internal CRM Legal page actions (switching tabs, loading templates, toggling lang, etc.)
      if (target.id && (
        target.id.startsWith('section-tab-') || 
        target.id.startsWith('apply-template-') || 
        target.id.startsWith('lang-toggle-') || 
        target.id === 'btn-sincronizar-publicar'
      )) {
        return // Bypass warnings for local state modifications
      }

      // Check if the click navigates away from the '/admin/legal' panel
      const isNavigatingAway = href && href !== '/admin/legal' && !href.startsWith('#')
      // Check if the click triggers the logout action
      const isLogoutButton = target.innerText?.toLowerCase().includes('salir') || 
                             target.innerText?.toLowerCase().includes('log out') || 
                             target.closest('button')?.innerText?.toLowerCase().includes('salir')

      if (isNavigatingAway || isLogoutButton) {
        const confirmLeave = window.confirm(
          t('legal.unsavedChangesWarning', { lng: activeLang })
        )
        if (!confirmLeave) {
          // Block React Router and standard link behaviors by halting event propagation
          e.preventDefault()
          e.stopPropagation()
        }
      }
    }

    // C. Intercept browser history transitions (back/forward mouse buttons)
    const handlePopState = () => {
      if (!isDirty) return
      const confirmLeave = window.confirm(
        t('legal.unsavedChangesWarning', { lng: activeLang })
      )
      if (!confirmLeave) {
        // Re-inject current location into window history to effectively freeze the transition
        window.history.pushState(null, '', window.location.href)
      }
    }

    // Attach listeners. Use capture phase (true) for clicks to intercept before router handlers fire.
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('click', handleGlobalClick, true)
    window.addEventListener('popstate', handlePopState)

    // Cleanup listeners on component unmount or state update
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleGlobalClick, true)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isDirty, activeLang])

  const isContentEmpty = (section, lang) => (localLegalTranslations[lang]?.[section] || '').replace(/<[^>]*>/g, '').trim() === ''

  const handleLoadTemplate = (sectionId = activeSection) => {
    console.log('[handleLoadTemplate] Triggered for:', { sectionId, activeLang, activeSection })
    const lang = activeLang
    const template = legalTemplates[lang]?.[sectionId] || LEGAL_TEMPLATES[sectionId]?.[lang] || ''
    
    if (!editor) {
      console.warn('[handleLoadTemplate] Editor instance is not ready yet!')
      return
    }
    if (!template) {
      console.warn('[handleLoadTemplate] Template content is empty or not found for:', { lang, sectionId })
      return
    }

    let resolved = template
    const analyticsId = currentTenant?.analytics_id || currentTenant?.google_analytics_id
    resolved = resolved.replace('[GOOGLE_ANALYTICS_PLACEHOLDER]', analyticsId ? t('legal.gaClause', { lng: lang }) : '')
    const metaPixelId = currentTenant?.meta_pixel_id || currentTenant?.facebook_pixel_id
    resolved = resolved.replace('[META_PIXEL_PLACEHOLDER]', metaPixelId ? t('legal.metaPixelClause', { lng: lang }) : '')

    console.log('[handleLoadTemplate] Resolved template length:', resolved.length)

    // Set dirty state
    setIsDirty(true)

    // Update state first
    setLocalLegalTranslations(prev => {
      console.log('[handleLoadTemplate] setLocalLegalTranslations prev state:', prev)
      const updated = {
        ...prev,
        [lang]: {
          ...prev[lang],
          [sectionId]: resolved
        }
      }
      console.log('[handleLoadTemplate] setLocalLegalTranslations updated state:', updated)
      return updated
    })

    // If section matches the current active section, set the editor content directly.
    // If not, we switch activeSection and let the useEffect do the setting.
    if (sectionId === activeSection) {
      console.log('[handleLoadTemplate] Setting editor content directly for active section')
      editor.commands.setContent(resolved)
    } else {
      console.log('[handleLoadTemplate] Switching active section to:', sectionId)
      setActiveSection(sectionId)
    }

    setIsTemplateSidebarOpen(false)
  }

  const handleSave = async () => {
    if (!currentTenant) return
    setLoading(true); setSuccess(false); setErrorMessage(null); setDbWarning(false)
    const updates = {
      legal_translations: localLegalTranslations
    }
    const { error } = await updateTenant(currentTenant.id, updates)
    if (!error) {
      setSuccess(true)
      setIsDirty(false)
      setTimeout(() => setSuccess(false), 4000)
    }
    else if (error.code === '42703' || error.message?.includes('column')) setDbWarning(true)
    else setErrorMessage(error.message || 'Error de conexion al guardar los datos.')
    setLoading(false)
    setIsPublishModalOpen(false)
  }

  const wordCount = editor?.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0
  const activeSectionData = SECTIONS.find(s => s.id === activeSection)
  const ActiveSectionIcon = activeSectionData?.icon

  const legalStatus = {
    has_terms: currentTenant?.legal_status?.has_terms ?? true,
    has_privacy: currentTenant?.legal_status?.has_privacy ?? true,
    has_cookies: true,
  }

  const footerLinks = [
    { label: t('legal.footerLinks.terms'),   route: '/legal?section=terms',   color: 'bg-violet-400', statusKey: 'has_terms' },
    { label: t('legal.footerLinks.privacy'),  route: '/legal?section=privacy', color: 'bg-sky-400', statusKey: 'has_privacy' },
    { label: t('legal.footerLinks.cookies'),  route: '/legal?section=cookies', color: 'bg-amber-400', statusKey: 'has_cookies' },
  ]

  return (
    <AdminLayout>

      {/* ── Publish Confirmation Modal ──────────────────────────────── */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handleSave}
        loading={loading}
        t={t}
      />

      {/* ── Sticky Header ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-secondary-200 mb-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary-400 mb-0.5 uppercase tracking-wider">
              <span>Admin</span><ChevronRight size={11} /><span className="text-primary-600">{t('legal.breadcrumb')}</span>
            </div>
            <h1 className="text-xl font-extrabold text-secondary-950 tracking-tight leading-none">{t('legal.pageTitle')}</h1>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            <div className="relative flex items-center bg-secondary-100 p-1 rounded-xl border border-secondary-200 shadow-xs">
              <button id="lang-toggle-es" onClick={() => setActiveLang('es')} className={`relative px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${activeLang === 'es' ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-800'}`}>
                ES
              </button>
              {isEnUnlocked ? (
                <button id="lang-toggle-en" onClick={() => setActiveLang('en')} className={`relative px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${activeLang === 'en' ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-800'}`}>
                  EN
                </button>
              ) : (
                <div className="relative group">
                  <button id="lang-toggle-en-locked" disabled className="relative px-3.5 py-2 rounded-lg text-xs font-bold text-secondary-400 flex items-center gap-1.5 cursor-not-allowed opacity-60">
                    EN <Lock size={10} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-secondary-950 text-white rounded-xl shadow-2xl border border-secondary-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                    <div className="flex items-center gap-2 mb-1.5"><Zap size={13} className="text-amber-400 shrink-0" /><p className="text-xs font-bold text-amber-400">{t('legal.enLocked.planRequired')}</p></div>
                    <p className="text-xs text-secondary-400 leading-relaxed">{t('legal.enLocked.planMsg')}</p>
                  </div>
                </div>
              )}
            </div>
            <button
              id="btn-sincronizar-publicar"
              onClick={() => setIsPublishModalOpen(true)}
              disabled={loading}
              className="group relative px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 whitespace-nowrap text-sm flex items-center gap-2 cursor-pointer overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <Cloud size={15} /><span>{t('legal.syncBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-3 mb-4">
        <div className="p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-300 text-amber-900 rounded-2xl flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-amber-200 rounded-xl shrink-0">
            <AlertTriangle size={18} className="text-amber-700" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-extrabold text-amber-900">{t('legal.disclaimer.title')}</p>
            <p className="text-sm text-amber-800 leading-relaxed">{t('legal.disclaimer.body')}</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50/30 to-orange-50 border border-orange-200 text-orange-950 rounded-2xl flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-orange-100 rounded-xl shrink-0">
            <Info size={18} className="text-orange-700" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-extrabold text-orange-950">{t('legal.sessionWarningTitle')}</p>
            <p 
              className="text-sm text-orange-900 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t('legal.sessionWarningBody') }}
            />
          </div>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 shadow-sm animate-fade-up">
            <div className="p-1.5 bg-emerald-100 rounded-lg shrink-0"><CheckCircle2 size={16} className="text-emerald-600" /></div>
            <div><p className="text-sm font-bold">{t('legal.successBanner.title')}</p><p className="text-xs text-emerald-600 mt-0.5">{t('legal.successBanner.desc')}</p></div>
          </div>
        )}
        {dbWarning && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-start gap-3 shadow-sm">
            <div className="p-1.5 bg-amber-100 rounded-lg shrink-0 mt-0.5"><AlertCircle size={16} className="text-amber-600" /></div>
            <div className="space-y-1 text-sm"><h3 className="font-bold text-amber-950">{t('legal.dbWarningBanner.title')}</h3><p className="leading-relaxed text-amber-800">{t('legal.dbWarningBanner.desc')}</p></div>
          </div>
        )}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 shadow-sm">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <p className="text-sm font-semibold">{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-[88px]">
            <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm overflow-hidden">
              <div className="px-4 pt-4 pb-2"><p className="text-xs font-bold text-secondary-400 uppercase tracking-widest">{t('legal.sidebarLabel')}</p></div>
              <nav className="p-2 space-y-1" aria-label="Secciones legales">
                {SECTIONS.map((sec) => {
                  const isSelected = activeSection === sec.id
                  const isEsEmpty = isContentEmpty(sec.id, 'es')
                  const isEnEmpty = isContentEmpty(sec.id, 'en')
                  const SecIcon = sec.icon
                  return (
                    <button key={sec.id} id={`section-tab-${sec.id}`} onClick={() => setActiveSection(sec.id)} className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 group cursor-pointer ${isSelected ? 'bg-secondary-950 text-white shadow-md' : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'}`}>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className={`p-1.5 rounded-lg shrink-0 border ${isSelected ? 'bg-white/10 text-white border-white/10' : sec.accentLight}`}><SecIcon size={14} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm leading-tight truncate">{sec.title}</p>
                          <p className={`text-xs mt-0.5 truncate ${isSelected ? 'text-secondary-400' : 'text-secondary-500'}`}>{sec.desc}</p>
                        </div>
                        <ChevronRight size={13} className={`shrink-0 transition-transform duration-200 ${isSelected ? 'translate-x-0.5 text-primary-400' : 'text-secondary-300 group-hover:translate-x-0.5'}`} />
                      </div>
                      <div className={`flex items-center gap-1.5 pt-2.5 border-t ${isSelected ? 'border-white/10' : 'border-secondary-100'}`}>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-secondary-500' : 'text-secondary-400'}`}>{t('legal.statusLabel')}</span>
                        <LangStatusBadge lang="es" isEmpty={isEsEmpty} />
                        <LangStatusBadge lang="en" isEmpty={isEnEmpty} />
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50/30 border border-primary-200/60 p-4 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-700 shrink-0"><LayoutTemplate size={16} /></div>
                <div>
                  <h3 className="text-sm font-bold text-secondary-900">{t('legal.templateLibraryTitle')}</h3>
                  <p className="text-xs text-secondary-500 mt-0.5 leading-relaxed">{t('legal.templateLibraryDesc')}</p>
                </div>
              </div>
              <button id="btn-open-template-library" onClick={() => setIsTemplateSidebarOpen(true)} className="w-full py-2.5 bg-white border border-primary-200 text-primary-700 rounded-xl text-xs font-bold hover:bg-primary-50 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <Sparkles size={13} />
                {t('legal.templateLibraryBtn')}
              </button>
            </div>
          </aside>

          {/* Central Canvas */}
          <div className="lg:col-span-9 space-y-5">

            <div className="relative bg-white rounded-2xl border border-secondary-200 shadow-sm overflow-hidden flex flex-col z-0">
              {/* Action Bar */}
              <div className="px-5 py-3.5 border-b border-secondary-150 bg-secondary-50/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-widest border ${activeSectionData?.accentLight}`}>
                    {activeLang === 'es' ? t('legal.langES') : t('legal.langEN')}
                  </span>
                  <div className="h-4 w-px bg-secondary-200" />
                  <div className="flex items-center gap-1.5">
                    {ActiveSectionIcon && <ActiveSectionIcon size={15} className="text-secondary-500" />}
                    <h2 className="font-bold text-secondary-900 text-sm leading-tight">
                      {activeSectionData?.title}
                    </h2>
                  </div>
                </div>
                {isDirty ? (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-lg text-xs font-semibold max-w-md animate-pulse">
                    <AlertTriangle size={13} className="shrink-0 text-amber-500" />
                    <span>Cambios en sesión (Sin publicar)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
                    <span>Publicado en la web</span>
                  </div>
                )}
              </div>

              {/* Cookies Smart Alert */}
              {activeSection === 'cookies' && (
                <div className="mx-5 mt-4 px-4 py-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <span className="text-xl leading-none mt-0.5 shrink-0">&#128161;</span>
                  <div>
                    <p className="text-sm font-bold text-amber-900 mb-0.5">{t('legal.cookiesAlert.label')}</p>
                    <p className="text-sm text-amber-800 leading-relaxed">{t('legal.cookiesAlert.msg')}</p>
                  </div>
                </div>
              )}

              {/* 🔒 Cookies Section — Immutable System Block */}
              {activeSection === 'cookies' && (
                <div className="mx-5 mt-4 rounded-xl border-2 border-secondary-300 bg-secondary-50 overflow-hidden">
                  {/* Locked Header */}
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-secondary-100 border-b border-secondary-300">
                    <Lock size={14} className="text-secondary-500 shrink-0" />
                    <p className="text-sm font-extrabold text-secondary-600 uppercase tracking-wider">{t('legal.cookiesLocked.title')}</p>
                  </div>
                  {/* Read-only locked content */}
                  <div className="px-4 py-3 bg-secondary-50/80 select-none pointer-events-none">
                    <p className="text-sm text-secondary-500 leading-relaxed italic">{t('legal.cookiesLocked.body')}</p>
                  </div>
                  {/* Editable third-party area */}
                  <div className="px-4 pb-4 pt-3 border-t border-secondary-200 bg-white">
                    <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-2">{t('legal.cookiesLocked.thirdPartyLabel')}</p>
                    <textarea
                      rows={3}
                      placeholder={t('legal.cookiesLocked.thirdPartyPlaceholder')}
                      className="w-full resize-none text-sm text-secondary-700 placeholder-secondary-400 bg-secondary-50 border border-secondary-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Editor */}
              <div className="flex-1 flex flex-col relative">
                {loadingTranslations && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-30 space-y-3">
                    <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#059669', animation: 'tz-spin 0.8s linear infinite' }} />
                    <style>{`@keyframes tz-spin { to { transform: rotate(360deg); } }`}</style>
                    <p className="text-secondary-400 text-xs font-mono">Loading saved legal content from database...</p>
                  </div>
                )}
                <TipTapToolbar editor={editor} />
                <div className="flex-1 min-h-[460px] bg-white"><EditorContent editor={editor} /></div>
              </div>

              {/* Word Count Bar */}
              <div className="px-5 py-2.5 border-t border-secondary-100 bg-secondary-50/30 flex items-center justify-between">
                <span className="text-xs text-secondary-400">{t('legal.editorCanvas')}</span>
                <span className="text-xs font-semibold text-secondary-500 tabular-nums">
                  {t(wordCount === 1 ? 'legal.words_one' : 'legal.words_other', { count: wordCount })}
                </span>
              </div>
            </div>

            {/* Footer Preview */}
            <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-secondary-100 bg-secondary-50/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-secondary-100 rounded-lg text-secondary-600"><FileText size={14} /></div>
                  <div>
                    <h3 className="font-bold text-secondary-900 text-sm">{t('legal.footerPreviewTitle')}</h3>
                    <p className="text-xs text-secondary-500">{t('legal.footerPreviewDesc')}</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="bg-secondary-950 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-primary-700 flex items-center justify-center"><Globe size={12} className="text-white" /></div>
                    <p className="text-secondary-400 text-xs font-medium">
                      {t('legal.copyright', { year: new Date().getFullYear(), name: currentTenant?.name || 'Zendo' })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {footerLinks.map(({ label, route, statusKey }) => {
                      const isRendered = legalStatus[statusKey]
                      if (!isRendered) return null
                      return (
                        <a
                          key={route}
                          href={route}
                          onClick={(e) => e.preventDefault()}
                          className="text-secondary-400 hover:text-white transition-colors text-xs font-semibold"
                        >
                          {label}
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Template Library Drawer */}
      <div className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${isTemplateSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsTemplateSidebarOpen(false)} />

      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white border-l border-secondary-200 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isTemplateSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-6 py-5 border-b border-secondary-100 bg-secondary-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-700 rounded-xl"><LayoutTemplate size={18} /></div>
            <div><h3 className="font-extrabold text-secondary-950 text-base">{t('legal.templateLibraryTitle')}</h3><p className="text-secondary-500 text-xs mt-0.5">{t('legal.templateLibrarySubtitle')}</p></div>
          </div>
          <button onClick={() => setIsTemplateSidebarOpen(false)} className="p-2 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-200 rounded-xl transition-colors cursor-pointer"><X size={18} /></button>
        </div>

        <div className="mx-5 mt-5 p-3.5 bg-primary-50/80 border border-primary-200/60 rounded-xl flex items-center gap-2.5 shrink-0">
          <Globe size={14} className="text-primary-600 shrink-0" />
          <p className="text-sm text-primary-900 font-semibold leading-snug">
            {t('legal.activeLanguageLabel')} <strong>{activeLang === 'es' ? t('legal.activeLanguageES') : t('legal.activeLanguageEN')}</strong>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {SECTIONS.map((sec) => {
            const template = legalTemplates[activeLang]?.[sec.id] || ''
            const preview = template.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 130)
            const SecIcon = sec.icon
            const isActive = activeSection === sec.id
            return (
              <div key={sec.id} className={`rounded-xl border overflow-hidden transition-all duration-200 ${isActive ? 'border-primary-300 shadow-sm bg-primary-50/40' : 'border-secondary-200 bg-white hover:border-secondary-300 hover:shadow-sm'}`}>
                <div className="px-4 py-3 flex items-center justify-between border-b border-secondary-100/60">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${sec.accentLight}`}><SecIcon size={13} /></div>
                    <div>
                      <p className="text-sm font-bold text-secondary-900">{sec.title}</p>
                      {isActive && <span className="inline-block text-xs font-bold text-primary-600 bg-primary-100 px-1.5 rounded mt-0.5">{t('legal.activeSection')}</span>}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${sec.accentLight}`}>{activeLang === 'es' ? 'ES' : 'EN'}</span>
                </div>
                <div className="px-4 py-3"><p className="text-xs text-secondary-500 leading-relaxed line-clamp-3">{preview}...</p></div>
                <div className="px-4 pb-3.5">
                  <button id={`apply-template-${sec.id}`} onClick={() => handleLoadTemplate(sec.id)} className="w-full py-2 bg-secondary-950 hover:bg-secondary-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <Check size={12} />{t('legal.applyToEditor')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-5 py-4 border-t border-secondary-100 bg-secondary-50 shrink-0">
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Zap size={13} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed"><strong>{t('legal.autoSmartLabel')}</strong> {t('legal.autoSmartNote')}</p>
          </div>
        </div>
      </div>

    </AdminLayout>
  )
}
