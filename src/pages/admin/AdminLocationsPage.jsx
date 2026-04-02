import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import {
  getProvinces,
  getLocationsAdmin,
  createProvince,
  createLocation,
  updateProvince,
  updateLocation,
  deleteProvince,
  deleteLocation,
} from '../../services/adminService'

export default function AdminLocationsPage() {
  const [activeTab, setActiveTab] = useState('provinces') // 'provinces' | 'locations'
  const [provinces, setProvinces] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Formulario rápido añadir
  const [newName, setNewName] = useState('')
  const [newProvId, setNewProvId] = useState('') // Sólo para localidades
  const [isSaving, setIsSaving] = useState(false)

  // Buscador
  const [searchQuery, setSearchQuery] = useState('')

  // Estado para editar
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editProvId, setEditProvId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setErrorMsg('')
    try {
      const [provs, locs] = await Promise.all([
        getProvinces(),
        getLocationsAdmin()
      ])
      setProvinces(provs)
      setLocations(locs)
    } catch (err) {
      setErrorMsg('Error al cargar datos. ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- HANDLERS CREACIÓN ---
  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    if (activeTab === 'locations' && !newProvId) {
      setErrorMsg('Selecciona una provincia para esta localidad.')
      return
    }

    setIsSaving(true)
    setErrorMsg('')
    try {
      if (activeTab === 'provinces') {
        const { data, error } = await createProvince(newName.trim())
        if (error) throw error
        setProvinces((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      } else {
        const { data, error } = await createLocation(newName.trim(), newProvId)
        if (error) throw error
        // Para location, devolvemos el join a mano en la UI para no hacer refetch
        const provName = provinces.find(p => p.id === newProvId)?.name || ''
        const newLoc = { ...data, provinces: { name: provName } }
        setLocations((prev) => [...prev, newLoc].sort((a, b) => a.name.localeCompare(b.name)))
      }
      setNewName('')
      setNewProvId('')
    } catch (error) {
      setErrorMsg('Error al crear: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  // --- HANDLERS EDICIÓN ---
  function startEdit(item) {
    setEditingId(item.id)
    setEditName(item.name)
    if (activeTab === 'locations') {
      setEditProvId(item.province_id)
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditProvId('')
  }

  async function handleUpdate(id) {
    if (!editName.trim()) return

    setIsSaving(true)
    setErrorMsg('')
    try {
      if (activeTab === 'provinces') {
        const { data, error } = await updateProvince(id, { name: editName.trim() })
        if (error) throw error
        setProvinces(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
      } else {
        const { data, error } = await updateLocation(id, { name: editName.trim(), province_id: editProvId })
        if (error) throw error
        const provName = provinces.find(p => p.id === editProvId)?.name || ''
        const updatedLoc = { ...data, provinces: { name: provName } }
        setLocations(prev => prev.map(l => l.id === id ? { ...l, ...updatedLoc } : l))
      }
      cancelEdit()
    } catch (error) {
      setErrorMsg('Error al actualizar: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  // --- HANDLERS BORRADO ---
  async function handleDelete(id) {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente esto?`)) return

    setErrorMsg('')
    try {
      if (activeTab === 'provinces') {
        // Peligroso si tiene localidades o propiedades
        const { error } = await deleteProvince(id)
        if (error) throw error
        setProvinces(prev => prev.filter(p => p.id !== id))
      } else {
        const { error } = await deleteLocation(id)
        if (error) throw error
        setLocations(prev => prev.filter(l => l.id !== id))
      }
    } catch (error) {
      setErrorMsg('No se pudo borrar (es posible que esté en uso por propiedades). Detalles: ' + error.message)
    }
  }

  // --- DERIVADOS DATOS (BÚSQUEDA) ---
  const filteredProvinces = provinces.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.provinces?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeData = activeTab === 'provinces' ? filteredProvinces : filteredLocations

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Gestor de Ubicaciones</h1>
          <p className="text-secondary-500 mt-1">Administra las provincias y sus localidades asociadas.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2 mb-6 border-b border-secondary-200">
        <button
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'provinces'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          onClick={() => { setActiveTab('provinces'); cancelEdit(); setNewName(''); setErrorMsg(''); setSearchQuery('') }}
        >
          Provincias ({provinces.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'locations'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          onClick={() => { setActiveTab('locations'); cancelEdit(); setNewName(''); setErrorMsg(''); setSearchQuery('') }}
        >
          Localidades ({locations.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden mb-8 p-6">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full space-y-1">
            <label className="text-sm font-medium text-secondary-700">
              {activeTab === 'provinces' ? 'Nueva Provincia' : 'Nueva Localidad'}
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Escribe el nombre aquí..."
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isSaving || loading}
            />
          </div>
          {activeTab === 'locations' && (
            <div className="flex-1 w-full space-y-1">
              <label className="text-sm font-medium text-secondary-700">Asignar a Provincia</label>
              <select
                required
                value={newProvId}
                onChange={(e) => setNewProvId(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSaving || loading}
              >
                <option value="">— Seleccionar —</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>{prov.name}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            disabled={isSaving || loading || !newName.trim() || (activeTab === 'locations' && !newProvId)}
            className="w-full sm:w-auto px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            {isSaving ? 'Añadiendo...' : '+ Añadir'}
          </button>
        </form>
      </div>

      {/* RECUADRO DE BÚSQUEDA */}
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-3">
        <label htmlFor="search-locs" className="sr-only">Buscar ubicación</label>
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-secondary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="search-locs"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar ${activeTab === 'provinces' ? 'provincia' : 'localidad o provincia'}...`}
            className="w-full pl-9 pr-4 py-2 border border-secondary-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm transition-shadow"
          />
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-secondary-400">
            Cargando...
          </div>
        ) : (
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-secondary-600">Nombre</th>
                {activeTab === 'locations' && (
                  <th className="text-left px-4 py-3 font-semibold text-secondary-600">Provincia</th>
                )}
                <th className="text-right px-4 py-3 font-semibold text-secondary-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {activeData.map((item) => (
                <tr key={item.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-secondary-900">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 border border-primary-500 rounded text-sm w-full focus:outline-none"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  {activeTab === 'locations' && (
                    <td className="px-4 py-3 text-secondary-600">
                      {editingId === item.id ? (
                        <select
                          value={editProvId}
                          onChange={(e) => setEditProvId(e.target.value)}
                          className="px-2 py-1 border border-primary-500 rounded text-sm w-full focus:outline-none bg-white"
                        >
                          {provinces.map((prov) => (
                            <option key={prov.id} value={prov.id}>{prov.name}</option>
                          ))}
                        </select>
                      ) : (
                        item.provinces?.name || '—'
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleUpdate(item.id)}
                          disabled={!editName.trim() || isSaving}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? '…' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={isSaving}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-colors disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary-100 text-secondary-700 hover:bg-secondary-200 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {(activeData.length === 0) && (
                <tr>
                  <td colSpan={activeTab === 'locations' ? 3 : 2} className="px-4 py-8 text-center text-secondary-400">
                    {searchQuery ? 'Tristemente, no hay resultados para tu búsqueda.' : 'No hay registros en esta sección.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
