import { useEffect } from 'react'
import { getProperties } from './propertyService'

/**
 * useProperties — hook de servicio que carga propiedades desde Supabase.
 *
 * @param {object} store  Objeto retornado por usePropertiesStore()
 * @param {string} tenantId ID del inquilino actual
 */
export function useProperties(store, tenantId) {
  const { setProperties, setLoading, setError } = store

  useEffect(() => {
    if (!tenantId) return;
    let cancelled = false

    async function loadProperties() {
      setLoading(true)
      setError(null)

      try {
        const data = await getProperties(tenantId)

        if (!cancelled) {
          setProperties(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message ?? 'Error al cargar las propiedades')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProperties()

    return () => {
      cancelled = true
    }
  }, [setProperties, setLoading, setError, tenantId])
}
