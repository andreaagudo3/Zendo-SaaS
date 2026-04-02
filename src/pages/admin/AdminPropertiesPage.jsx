import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  getAdminPropertiesPaginated,
  ADMIN_PAGE_SIZE,
  deleteProperty,
  updateProperty,
} from '../../services/adminService'
import AdminLayout from './AdminLayout'
import { useTenant } from '../../context/TenantContext'

/**
 * AdminPropertiesPage — Lista paginada de propiedades (server-side).
 * 20 por página, orden updated_at DESC.
 * Desktop: tabla. Móvil: cards.
 */
export default function AdminPropertiesPage() {
  const tenant = useTenant()
  const [properties, setProperties] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState(null)
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')         // debounced
  const [page, setPage] = useState(1)
  const debounceRef = useRef(null)

  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE))

  // Debounce del buscador: 350ms después de dejar de escribir
  function handleSearchInput(val) {
    setSearchInput(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(val)
      setPage(1)
    }, 350)
  }

  function handleFeaturedFilter(val) {
    setFeaturedFilter(val)
    setPage(1)
  }

  // Carga desde el servidor cada vez que cambia page, search o featuredFilter
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getAdminPropertiesPaginated(page, search, featuredFilter, tenant?.id).then(({ data, count }) => {
      if (cancelled) return
      setProperties(data)
      setTotalCount(count)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [page, search, featuredFilter, tenant?.id])

  async function handleDelete(property) {
    if (!confirm(`¿Eliminar "${property.title}"? Esta acción no se puede deshacer.`)) return
    setDeletingId(property.id)
    const { error } = await deleteProperty(property.id, tenant?.id)
    if (error) {
      setError(`Error al eliminar: ${error.message}`)
      setDeletingId(null)
    } else {
      // Recargar la página actual (o retroceder si quedó vacía)
      const newCount = totalCount - 1
      const newTotalPages = Math.max(1, Math.ceil(newCount / ADMIN_PAGE_SIZE))
      const newPage = Math.min(page, newTotalPages)
      setPage(newPage === page ? 0 : newPage)  // forzar re-trigger del effect
      setDeletingId(null)
    }
  }

  async function handleStatusChange(propertyId, newStatus) {
    setUpdatingId(propertyId)
    const { error } = await updateProperty(propertyId, { status: newStatus }, tenant?.id)
    if (error) {
      setError(`Error al actualizar estado: ${error.message}`)
    } else {
      setProperties((prev) =>
        prev.map((p) => p.id === propertyId ? { ...p, status: newStatus } : p)
      )
    }
    setUpdatingId(null)
  }

  async function handleToggleFeatured(property) {
    const newVal = !property.featured
    setUpdatingId(property.id)
    const { error } = await updateProperty(property.id, { featured: newVal }, tenant?.id)
    if (error) {
      setError(`Error al actualizar destacado: ${error.message}`)
    } else {
      setProperties((prev) =>
        prev.map((p) => p.id === property.id ? { ...p, featured: newVal } : p)
      )
    }
    setUpdatingId(null)
  }

  // Workaround del hack de delete (restablecer page=0 → page correcta)
  useEffect(() => {
    if (page === 0) {
      const newTotalPages = Math.max(1, Math.ceil((totalCount - 1) / ADMIN_PAGE_SIZE))
      setPage(Math.min(Math.max(1, page), newTotalPages))
    }
  }, [page])

  const FILTER_OPTS = [
    { value: 'all', label: 'Todas' },
    { value: 'featured', label: '★ Destacadas' },
    { value: 'not_featured', label: '☆ No destacadas' },
  ]

  const formatPrice = (price) =>
    price != null
      ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
      : '—'

  const statusCls = (status) =>
    status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
      status === 'reserved' ? 'bg-amber-50 text-amber-700 border-amber-200' :
        'bg-secondary-100 text-secondary-500 border-secondary-200'

  const Spinner = () => (
    <div className="flex items-center justify-center py-20 text-secondary-400">
      <svg className="animate-spin h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
      </svg>
      Cargando…
    </div>
  )

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Propiedades</h1>
          <p className="text-sm text-secondary-500">
            {totalCount} propiedades en total
          </p>
        </div>
        <Link
          to="/admin/new"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-primary-700 text-white text-sm font-semibold hover:bg-primary-800 transition-colors"
        >
          + Nueva propiedad
        </Link>
      </div>

      {/* Buscador */}
      <div className="relative mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder="Buscar por título, referencia o localidad…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-secondary-200 bg-white text-sm text-secondary-800 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-600"
          aria-label="Buscar propiedades"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => { setSearchInput(''); handleSearchInput('') }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Filtro destacadas */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTER_OPTS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleFeaturedFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${featuredFilter === value
                ? 'bg-primary-700 text-white'
                : 'bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ═══ MÓVIL: Cards (<md) ═══ */}
      <div className="md:hidden space-y-3">
        {loading ? <Spinner /> : properties.length === 0 ? (
          <div className="text-center py-20 text-secondary-400 bg-white rounded-2xl border border-secondary-200">
            <p className="text-4xl mb-3">🏠</p>
            <p className="font-medium">{search ? 'Sin resultados para tu búsqueda.' : 'Sin propiedades aún.'}</p>
          </div>
        ) : (
          properties.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-4 space-y-3">

              {/* Top: ref + published dot + star */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-secondary-400">{p.reference_code ?? '—'}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${p.published ? 'bg-emerald-500' : 'bg-red-400'}`}
                    title={p.published ? 'Publicada' : 'No publicada'}
                  />
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(p)}
                    disabled={updatingId === p.id}
                    aria-label={p.featured ? 'Quitar destacada' : 'Marcar como destacada'}
                    className={`text-xl leading-none transition-transform hover:scale-110 disabled:opacity-40 ${p.featured ? 'text-amber-400' : 'text-secondary-300'
                      }`}
                  >
                    {p.featured ? '★' : '☆'}
                  </button>
                </div>
              </div>

              <p className="font-semibold text-secondary-900 leading-snug">{p.title}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-secondary-500">
                {p.locations?.name && (
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {p.locations.name}
                  </span>
                )}
                <span className="font-semibold text-secondary-700">{formatPrice(p.price)}</span>
              </div>

              <select
                value={p.status ?? 'available'}
                disabled={updatingId === p.id}
                onChange={(e) => handleStatusChange(p.id, e.target.value)}
                aria-label="Cambiar estado"
                className={`w-full text-sm font-medium rounded-xl px-3 py-2 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:opacity-50 transition-colors ${statusCls(p.status)}`}
              >
                <option value="available">Disponible</option>
                <option value="reserved">Reservado</option>
                <option value="sold">Vendido</option>
              </select>

              <div className="flex gap-2">
                <Link
                  to={`/admin/edit/${p.id}`}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-secondary-100 text-secondary-700 hover:bg-secondary-200 transition-colors"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  disabled={deletingId === p.id}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deletingId === p.id ? '…' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ═══ DESKTOP: Tabla (md+) ═══ */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
        {loading ? <Spinner /> : properties.length === 0 ? (
          <div className="text-center py-20 text-secondary-400">
            <p className="text-4xl mb-3">🏠</p>
            <p className="font-medium">{search ? 'Sin resultados para tu búsqueda.' : 'Sin propiedades aún.'}</p>
            {!search && (
              <Link to="/admin/new" className="text-primary-700 text-sm hover:underline mt-1 inline-block">
                Crea la primera →
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="w-8 px-4 py-3" title="Destacada" />
                <th className="text-left px-4 py-3 font-semibold text-secondary-600">Ref.</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary-600">Título</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary-600">Ubicación</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary-600">Precio</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary-600">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary-600">Publicada</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(p)}
                      disabled={updatingId === p.id}
                      aria-label={p.featured ? 'Quitar destacada' : 'Marcar como destacada'}
                      className={`text-xl leading-none transition-transform hover:scale-125 disabled:opacity-40 ${p.featured ? 'text-amber-400' : 'text-secondary-300 hover:text-amber-300'
                        }`}
                    >
                      {p.featured ? '★' : '☆'}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono text-secondary-500 text-xs">{p.reference_code}</td>
                  <td className="px-4 py-3 font-medium text-secondary-900 max-w-[200px] truncate">{p.title}</td>
                  <td className="px-4 py-3 text-secondary-600">{p.locations?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-secondary-600">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={p.status ?? 'available'}
                      disabled={updatingId === p.id}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      aria-label="Cambiar estado"
                      className={`text-xs font-medium rounded-lg px-2 py-1 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:opacity-50 transition-colors ${statusCls(p.status)}`}
                    >
                      <option value="available">Disponible</option>
                      <option value="reserved">Reservado</option>
                      <option value="sold">Vendido</option>
                    </select>
                    {updatingId === p.id && <span className="ml-1 text-xs text-secondary-400">...</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${p.published ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        to={`/admin/edit/${p.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary-100 text-secondary-700 hover:bg-secondary-200 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        disabled={deletingId === p.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {deletingId === p.id ? '…' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-5 flex-wrap">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
            .reduce((acc, n, idx, arr) => {
              if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…')
              acc.push(n)
              return acc
            }, [])
            .map((item, idx) =>
              item === '…' ? (
                <span key={`sep-${idx}`} className="px-2 text-secondary-400 text-sm">…</span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPage(item)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === item
                      ? 'bg-primary-700 text-white'
                      : 'bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50'
                    }`}
                >
                  {item}
                </button>
              )
            )
          }

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </AdminLayout>
  )
}
