import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getSession } from '../../services/adminService'
import { supabase } from '../../services/supabaseClient'

/**
 * ProtectedRoute — Guarda de autenticación para rutas /admin.
 * Si no hay sesión activa, redirige a /login.
 * Escucha cambios de sesión en tiempo real.
 */
export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined) // undefined = comprobando

  useEffect(() => {
    // Sesión inicial
    getSession().then(setSession)

    // Escuchar cambios de auth (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Cargando — evitar flash de redireccion
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-secondary-950 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
        </svg>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}
