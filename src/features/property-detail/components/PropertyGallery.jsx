import { useTranslation } from 'react-i18next'

export function PropertyGallery({ gallery, activeImage, setActiveImage, isGalleryOpen, setIsGalleryOpen, touchHandlers, title }) {
  const { t } = useTranslation('property')

  if (gallery.length === 0) return null

  return (
    <>
      {/* ── Galería Principal en pantalla ── */}
      <section aria-label="Galería de imágenes">
        <div 
          className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-3 group cursor-zoom-in"
          onClick={() => setIsGalleryOpen(true)}
          {...touchHandlers}
        >
          <img
            src={gallery[activeImage] ?? '/images/property-placeholder.jpg'}
            alt={`${title} – imagen ${activeImage + 1} de ${gallery.length}`}
            className="w-full h-full object-cover transition-all duration-500"
            onError={(e) => { e.currentTarget.src = '/images/property-placeholder.jpg' }}
          />

          {gallery.length > 1 && (
            <>
              {/* Botones Flotantes Desktop Navegación Principal */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.max(i - 1, 0)) }}
                disabled={activeImage === 0}
                aria-label={t('gallery.prevImage', 'Imagen anterior')}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.min(i + 1, gallery.length - 1)) }}
                disabled={activeImage === gallery.length - 1}
                aria-label={t('gallery.nextImage', 'Imagen siguiente')}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
                  {activeImage + 1} / {gallery.length}
                </span>
                <span className="text-white/80 hidden sm:flex items-center gap-1 text-sm bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {t('gallery.viewPhotos', 'Ver fotos')}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Thumbnails fijos inferiores */}
        {gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {gallery.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={t('gallery.viewImage', 'Ver imagen {{n}}', { n: i + 1 })}
                aria-pressed={activeImage === i}
                className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary-600 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── MODAL FULLSCREEN GALERÍA ── */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center">
          
          <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-white font-medium">
              {activeImage + 1} / {gallery.length}
            </span>
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="text-white hover:text-slate-300 p-2"
              aria-label={t('gallery.close', 'Cerrar galería')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div 
            className="w-full h-full flex items-center justify-center p-4 touch-none select-none"
            {...touchHandlers}
          >
            <img
              src={gallery[activeImage]}
              alt={t('gallery.expandedView', 'Vista ampliada {{n}}', { n: activeImage + 1 })}
              className="max-w-full max-h-full object-contain pointer-events-none"
            />
          </div>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.max(i - 1, 0)) }}
                disabled={activeImage === 0}
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center w-14 h-14 rounded-full bg-black/50 text-white hover:bg-black/80 transition disabled:opacity-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveImage((i) => Math.min(i + 1, gallery.length - 1)) }}
                disabled={activeImage === gallery.length - 1}
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-14 h-14 rounded-full bg-black/50 text-white hover:bg-black/80 transition disabled:opacity-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          {gallery.length > 1 && (
            <div className="absolute bottom-4 inset-x-0 w-full overflow-x-auto flex justify-center gap-2 px-4 pb-2">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-primary-500 opacity-100' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={src} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}

        </div>
      )}
    </>
  )
}
