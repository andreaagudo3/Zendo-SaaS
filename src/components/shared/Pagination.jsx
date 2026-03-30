import { useTranslation } from 'react-i18next'

/**
 * Pagination — controls de navegación entre páginas.
 * Props:
 *   currentPage  (number)
 *   totalPages   (number)
 *   onPageChange (fn)
 */
export function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation('common')

  if (totalPages <= 1) return null

  // Genera el rango de páginas a mostrar (máx 7 botones)
  function getPageNumbers() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  const pages = getPageNumbers()

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1 mt-12 flex-wrap">
      {/* Anterior */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t('ui.previous')}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {t('ui.previous')}
      </button>

      {/* Páginas */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-secondary-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Página ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-primary-700 text-white shadow-md'
                : 'text-secondary-600 hover:bg-secondary-100'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Siguiente */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t('ui.next')}
        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {t('ui.next')}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Indicador de página actual */}
      <span className="w-full text-center mt-2 text-xs text-secondary-400">
        {t('ui.page', { n: currentPage, total: totalPages })}
      </span>
    </nav>
  )
}
