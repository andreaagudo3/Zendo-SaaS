import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPropertiesPaginated, getProvincesWithLocations, PAGE_SIZE } from '../services/propertyService'
import { PropertyCard } from '../components/shared/PropertyCard'
import { SkeletonCard } from '../components/shared/SkeletonCard'
import { Pagination } from '../components/shared/Pagination'
import { PropertySearchBar } from '../components/search/PropertySearchBar'
import { PropertyFiltersModal } from '../components/search/PropertyFiltersModal'
import { FilterChips } from '../components/search/FilterChips'
import { useThemeStore } from '../store/themeStore'
import { useTenant } from '../context/TenantContext'

const INITIAL_FILTERS = {
  type: 'all',
  bedrooms: 'all',
  locationFilter: 'all',  // 'all' | 'prov:uuid' | 'loc:uuid'
  minPrice: 0,
  maxPrice: Infinity,
}

function filtersToParams(filters, page) {
  const p = new URLSearchParams()
  if (filters.type !== 'all') p.set('type', filters.type)
  if (filters.bedrooms !== 'all') p.set('bedrooms', filters.bedrooms)
  if (filters.locationFilter !== 'all') p.set('loc', filters.locationFilter)
  if (filters.maxPrice !== Infinity) p.set('maxPrice', String(filters.maxPrice))
  if (page > 1) p.set('page', String(page))
  return p
}

function paramsToFilters(searchParams) {
  return {
    type: searchParams.get('type') || 'all',
    bedrooms: searchParams.get('bedrooms') || 'all',
    locationFilter: searchParams.get('loc') || 'all',
    minPrice: 0,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : Infinity,
  }
}

export default function PropertiesPage() {
  const tenant = useTenant()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation(['properties', 'common'])

  const [filters, setFiltersState] = useState(() => paramsToFilters(searchParams))
  const [page, setPage] = useState(() => Number(searchParams.get('page') || 1))

  const [results, setResults] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [provinces, setProvinces] = useState([])  // jerarquía provincia → localidades
  const [isModalOpen, setIsModalOpen] = useState(false)

  const theme = useThemeStore((s) => s.theme)
  const isMinimal = theme === 'MINIMAL'
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Filtros avanzados activos para el badge del botón "Más filtros"
  const activeAdvancedCount = [
    filters.bedrooms !== 'all',
    filters.locationFilter !== 'all',
    filters.maxPrice !== Infinity,
  ].filter(Boolean).length

  // Cargar árbol de provincias con localidades (una sola vez)
  useEffect(() => {
    getProvincesWithLocations(tenant?.id).then(setProvinces)
  }, [tenant?.id])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const serviceFilters = {
      listing_type: filters.type,
      bedrooms: filters.bedrooms,
      locationFilter: filters.locationFilter,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    }

    getPropertiesPaginated(serviceFilters, page, tenant?.id)
      .then(({ data, count }) => {
        if (!cancelled) {
          setResults(data)
          setTotalCount(count)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'Error al cargar propiedades')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [filters, page, tenant?.id])

  useEffect(() => {
    setSearchParams(filtersToParams(filters, page), { replace: true })
  }, [filters, page, setSearchParams])

  const setFilter = useCallback((key, value) => {
    setFiltersState(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const removeFilter = useCallback((key) => {
    setFiltersState(prev => ({ ...prev, [key]: INITIAL_FILTERS[key] }))
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState(INITIAL_FILTERS)
    setPage(1)
  }, [])

  const applyAdvancedFilters = useCallback((partial) => {
    setFiltersState(prev => ({ ...prev, ...partial }))
    setPage(1)
  }, [])

  function handlePageChange(newPage) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 ${isMinimal ? 'pt-32 md:pt-40' : 'pt-12'}`} aria-labelledby="listing-heading">
      {/* Page header */}
      <header className="mb-6">
        <h1 id="listing-heading" className="text-3xl font-bold text-secondary-950 mb-1">
          {t('properties:page.title')}
        </h1>
        <p className="text-secondary-500 text-sm">
          {loading
            ? t('common:ui.searching')
            : t('common:ui.resultsCount', { count: totalCount })}
        </p>
      </header>

      {/* Search Bar + Chips */}
      <div className="mb-8">
        <PropertySearchBar
          filters={filters}
          provinces={provinces}
          onFilterChange={setFilter}
          onOpenModal={() => setIsModalOpen(true)}
          activeAdvancedCount={activeAdvancedCount}
        />
        <FilterChips
          filters={filters}
          provinces={provinces}
          onRemove={removeFilter}
          onClearAll={resetFilters}
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-24 text-red-500 text-lg">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <p className="text-5xl">{t('properties:empty.icon')}</p>
          <p className="text-xl font-semibold text-secondary-700">{t('properties:empty.title')}</p>
          <p className="text-secondary-500">{t('properties:empty.message')}</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2 bg-primary-700 text-white rounded-xl text-sm font-semibold hover:bg-primary-800 transition-colors"
          >
            {t('common:btn.clearFilters')}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Filters Modal */}
      <PropertyFiltersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={filters}
        provinces={provinces}
        onApply={applyAdvancedFilters}
      />
    </section>
  )
}
