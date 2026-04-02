import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../../services/adminService'
import { useTenant } from '../../context/TenantContext'

/**
 * LoginPage — Acceso al panel de administración via Supabase Auth.
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const tenant = useTenant()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } = await signIn(form.email, form.password)

    if (error) {
      setErrorMsg('Credenciales incorrectas. Verifica tu email y contraseña.')
      setStatus('error')
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-secondary-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo Zendo branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <img src={tenant?.logo_url || "/zendo-logo.png"} alt={tenant?.name || "Zendo"} className="h-12 w-auto object-contain" />
            <span className="text-white text-3xl font-bold tracking-tight">
              {tenant?.name || "Zendo"}
            </span>
          </div>
          <p className="text-secondary-400 text-sm mt-3">Panel de Administración</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-secondary-900 border border-secondary-800 rounded-2xl p-8 space-y-5 shadow-xl"
          noValidate
        >
          <h1 className="text-white text-xl font-bold text-center">Iniciar sesión</h1>

          {/* Error */}
          {status === 'error' && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
              {errorMsg}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-secondary-300 mb-1">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="admin@parquesierra.com"
              className="w-full px-4 py-2.5 rounded-xl bg-secondary-800 border border-secondary-700 text-white text-sm placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-secondary-300 mb-1">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-secondary-800 border border-secondary-700 text-white text-sm placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 rounded-xl bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Entrando…
              </span>
            ) : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
