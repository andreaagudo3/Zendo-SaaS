import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTenant } from '../../context/TenantContext'
import { saveDomain, verifyDomain } from '../../services/adminService'
import AdminLayout from './AdminLayout'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconGlobe({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  )
}

function IconCheck({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

function IconX({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  )
}

function IconInfo({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  )
}

function IconSpinner({ className = 'h-4 w-4' }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
    </svg>
  )
}

// ─── DNS Record Table ─────────────────────────────────────────────────────────

function DnsRecordTable({ t }) {
  const rows = [
    { label: t('admin:domain.dnsType'),   value: 'CNAME', mono: false },
    { label: t('admin:domain.dnsHost'),   value: 'www',   mono: true  },
    { label: t('admin:domain.dnsTarget'), value: 'cname.zendo.co', mono: true },
    { label: t('admin:domain.dnsTtl'),    value: t('admin:domain.dnsTtlValue'), mono: false },
  ]

  return (
    <div className="rounded-xl border border-secondary-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary-50 border-b border-secondary-200">
            {[t('admin:domain.tableColField'), t('admin:domain.tableColValue')].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-xs font-bold text-secondary-500 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, value, mono }) => (
            <tr key={label} className="border-b border-secondary-100 last:border-0 hover:bg-secondary-50/50 transition-colors">
              <td className="px-4 py-3 font-semibold text-secondary-600">{label}</td>
              <td className="px-4 py-3">
                {mono ? (
                  <code className="px-2 py-1 bg-secondary-900 text-primary-400 rounded-md text-xs font-mono select-all">
                    {value}
                  </code>
                ) : (
                  <span className="text-secondary-700">{value}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ verified, t }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 whitespace-nowrap">
        <IconCheck className="h-3.5 w-3.5" />
        {t('admin:domain.badgeConnected')}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 whitespace-nowrap">
      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      {t('admin:domain.badgePending')}
    </span>
  )
}

// ─── AdminDomainPage ──────────────────────────────────────────────────────────

/**
 * AdminDomainPage — Configuración de Dominio Personalizado.
 *
 * Allows the tenant admin to:
 *   1. View / update their domain value.
 *   2. See the DNS CNAME record they must configure in their registrar.
 *   3. Trigger a "verify" action that checks the CNAME propagation and
 *      updates domain_verified in the tenants table.
 *
 * State source: public.tenant_context.domain_verified
 */
export default function AdminDomainPage() {
  const { t } = useTranslation(['admin'])
  const currentTenant = useTenant()

  // ── local state ────────────────────────────────────────────────────────────
  const [domain, setDomain] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  const [saving, setSaving]     = useState(false)
  const [verifying, setVerifying] = useState(false)

  const [feedback, setFeedback] = useState(null) // { type: 'success'|'error'|'warn', msg }

  // Populate from tenant context when it loads
  useEffect(() => {
    if (currentTenant) {
      setDomain(currentTenant.domain || '')
      setIsVerified(currentTenant.domain_verified ?? false)
    }
  }, [currentTenant])

  // ── helpers ────────────────────────────────────────────────────────────────

  function showFeedback(type, msg, autoDismissMs = 8000) {
    setFeedback({ type, msg })
    if (autoDismissMs) setTimeout(() => setFeedback(null), autoDismissMs)
  }

  /**
   * mapVerifyError — Translates raw error codes / messages from the Edge
   * Function or Supabase client into friendly, human-readable strings.
   *
   * Priority:
   *   1. Structured error code returned by the Edge Function (data.code)
   *   2. Human message returned by the Edge Function (data.error)
   *   3. Known network / Supabase client error patterns (fnError.message)
   *   4. Generic fallback
   */
  function mapVerifyError(data, fnError) {
    // 1 — Structured code from Edge Function
    const code = data?.code
    if (code) {
      const codeMap = {
        CNAME_NOT_FOUND:     t('admin:domain.err.cnameNotFound'),
        WRONG_CNAME_TARGET:  t('admin:domain.err.wrongTarget'),
        DNS_TIMEOUT:         t('admin:domain.err.dnsTimeout'),
        INVALID_DOMAIN:      t('admin:domain.err.invalidDomain'),
        DOMAIN_UNREACHABLE:  t('admin:domain.err.domainUnreachable'),
        TENANT_NOT_FOUND:    t('admin:domain.err.tenantNotFound'),
      }
      if (codeMap[code]) return codeMap[code]
    }

    // 2 — Human message directly from Edge Function
    if (data?.error && typeof data.error === 'string' && data.error.length < 200) {
      return data.error
    }

    // 3 — Known Supabase / network client errors
    const rawMsg = fnError?.message ?? ''
    if (rawMsg.includes('Failed to fetch') || rawMsg.includes('NetworkError')) {
      return t('admin:domain.err.networkError')
    }
    if (rawMsg.includes('FunctionsHttpError') || rawMsg.includes('non-2xx')) {
      return t('admin:domain.err.functionError')
    }
    if (rawMsg.includes('timeout') || rawMsg.includes('Timeout')) {
      return t('admin:domain.err.dnsTimeout')
    }

    // 4 — Generic fallback
    return t('admin:domain.verifyError')
  }

  // ── actions ────────────────────────────────────────────────────────────────

  /**
   * Persists domain (and resets domain_verified to false since the
   * domain has changed and needs re-verification).
   */
  async function handleSaveDomain() {
    if (!currentTenant?.id) return
    setSaving(true)
    setFeedback(null)

    const { error } = await saveDomain(currentTenant.id, domain)

    if (error) {
      const msg = error.message?.includes('unique')
        ? t('admin:domain.err.domainInUse')
        : t('admin:domain.saveError', { message: error.message })
      showFeedback('error', msg)
    } else {
      setIsVerified(false)
      showFeedback('success', t('admin:domain.saveSuccess'))
    }
    setSaving(false)
  }

  /**
   * Invokes the Supabase Edge Function 'verify-domain' via adminService.
   * The service handles the Edge Function call; we only manage UI state here.
   */
  async function handleVerifyDomain() {
    if (!domain.trim()) {
      showFeedback('warn', t('admin:domain.noDomainWarning'))
      return
    }
    if (!currentTenant?.id) return

    setVerifying(true)
    setFeedback(null)

    const { data, error: fnError } = await verifyDomain(currentTenant.id, domain)

    if (!fnError && data?.success === true) {
      setIsVerified(true)
      showFeedback('success', t('admin:domain.verifySuccess'))
    } else {
      showFeedback('error', mapVerifyError(data, fnError))
    }

    setVerifying(false)
  }

  // ── render ─────────────────────────────────────────────────────────────────

  const fieldCls = 'w-full px-4 py-3 rounded-xl border border-secondary-200 outline-none transition-all text-secondary-800 bg-white focus:ring-2 focus:ring-primary-600 focus:border-transparent font-mono text-sm'

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-3xl">

        {/* ── Page header ── */}
        <header className="mb-2">
          <h1 className="text-3xl font-bold text-secondary-900">
            {t('admin:domain.pageTitle')}
          </h1>
          <p className="text-secondary-500 mt-1">
            {t('admin:domain.pageSubtitle')}
          </p>
        </header>

        {/* ── Main card ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">

          {/* Card header stripe */}
          <div className="px-6 md:px-8 py-5 border-b border-secondary-100 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-50 rounded-xl">
                <IconGlobe className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-secondary-900">
                  {t('admin:domain.cardTitle')}
                </h2>
                <p className="text-xs text-secondary-400 mt-0.5">
                  {t('admin:domain.cardSubtitle')}
                </p>
              </div>
            </div>
            <StatusBadge verified={isVerified} t={t} />
          </div>

          <div className="px-6 md:px-8 py-6 space-y-6">

            {/* ── Domain input + save ── */}
            <div className="space-y-2">
              <label htmlFor="custom-domain" className="block text-sm font-semibold text-secondary-700">
                {t('admin:domain.inputLabel')}
              </label>
              <div className="flex items-center gap-3">
                {/* Scheme prefix hint */}
                <span className="text-sm text-secondary-400 font-mono whitespace-nowrap select-none">https://</span>
                <input
                  id="custom-domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder={t('admin:domain.inputPlaceholder')}
                  className={fieldCls}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <p className="text-xs text-secondary-400 italic">
                {t('admin:domain.inputHelper')}
              </p>
            </div>

            {/* ── DNS Instructions Box ── */}
            <div className="rounded-xl bg-secondary-50 border border-secondary-200 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <IconInfo className="h-4 w-4 text-secondary-500 shrink-0" />
                <p className="text-sm font-bold text-secondary-700">
                  {t('admin:domain.dnsTitle')}
                </p>
              </div>
              <p className="text-xs text-secondary-500 leading-relaxed">
                {t('admin:domain.dnsDesc')}
              </p>

              <DnsRecordTable t={t} />

              {/* Propagation note */}
              <p className="text-xs text-secondary-400 italic flex items-start gap-1.5">
                <span className="mt-px">⏱</span>
                {t('admin:domain.dnsNote')}
              </p>
            </div>

            {/* ── Feedback banner ── */}
            {feedback && (
              <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in-down ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : feedback.type === 'warn'
                  ? 'bg-amber-50 border border-amber-200 text-amber-700'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
                {feedback.type === 'success' ? (
                  <IconCheck className="h-4 w-4 shrink-0 mt-0.5" />
                ) : feedback.type === 'warn' ? (
                  <IconInfo className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <IconX className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <span>{feedback.msg}</span>
              </div>
            )}

            {/* ── Action row ── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Save button */}
              <button
                type="button"
                id="btn-save-domain"
                onClick={handleSaveDomain}
                disabled={saving || verifying}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-700 text-white rounded-xl font-bold hover:bg-primary-800 transition-all shadow-md shadow-primary-900/10 disabled:opacity-50 text-sm"
              >
                {saving && <IconSpinner />}
                {saving ? t('admin:domain.savingBtn') : t('admin:domain.saveBtn')}
              </button>

              {/* Verify button */}
              <button
                type="button"
                id="btn-verify-domain"
                onClick={handleVerifyDomain}
                disabled={saving || verifying || !domain.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-secondary-200 text-secondary-700 rounded-xl font-bold hover:border-primary-500 hover:text-primary-700 transition-all disabled:opacity-40 text-sm"
              >
                {verifying ? (
                  <>
                    <IconSpinner className="h-4 w-4 text-primary-500" />
                    {t('admin:domain.verifyingBtn')}
                  </>
                ) : (
                  <>
                    <IconGlobe className="h-4 w-4" />
                    {t('admin:domain.verifyBtn')}
                  </>
                )}
              </button>
            </div>

            {/* ── Technical blueprint micro-label ── */}
            <p className="text-[10px] text-secondary-300 font-mono pt-1">
              {t('admin:domain.blueprintLabel')}
            </p>
          </div>
        </section>

        {/* ── Support note ── */}
        <p className="text-xs text-secondary-400 text-center">
          {t('admin:domain.contactSupport')}
        </p>
      </div>
    </AdminLayout>
  )
}
