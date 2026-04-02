import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePropertiesStore } from '../../store/propertiesStore'
import { useProperties } from '../../services/useProperties'
import { usePropertyImages } from './hooks/usePropertyImages'
import { useThemeStore } from '../../store/themeStore'
import { useTenant } from '../../context/TenantContext'

// Components
import { PropertyHeader } from './components/PropertyHeader'
import { PropertyGallery } from './components/PropertyGallery'
import { PropertyFeatures } from './components/PropertyFeatures'
import { PropertyContactForm } from './components/PropertyContactForm'
import { PropertyDescription } from '../../components/shared/PropertyDescription'

export default function PropertyDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation('property')
  const tenant = useTenant()
  
  // Theme State
  const theme = useThemeStore((s) => s.theme)
  const isMinimal = theme === 'MINIMAL'
  
  // Data Fetching & State
  const store = usePropertiesStore()
  useProperties(store)

  const property = store.properties.find((p) => p.slug === slug)

  // ─── SEO Dinámico ───
  useEffect(() => {
    if (!property) return;

    // 1. Título
    const originalTitle = document.title;
    const seoTitle = property.meta_title || `${property.title} | ${tenant.name}`;
    document.title = seoTitle;

    // 2. Meta Description
    const originalDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const seoDesc = property.meta_description || (property.description ? property.description.substring(0, 155) : '');
    
    const updateMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    updateMeta('meta[name="description"]', 'content', seoDesc);
    updateMeta('meta[property="og:title"]', 'content', seoTitle);
    updateMeta('meta[property="og:description"]', 'content', seoDesc);
    if (property.coverImage) {
      updateMeta('meta[property="og:image"]', 'content', property.coverImage);
    }

    // Limpieza al desmontar
    return () => {
      document.title = originalTitle;
      updateMeta('meta[name="description"]', 'content', originalDesc);
      updateMeta('meta[property="og:title"]', 'content', tenant.browser_title || `${tenant.name} - Real Estate`);
      updateMeta('meta[property="og:description"]', 'content', tenant.meta_description || tenant.description || '');
    };
  }, [property, tenant]);
  
  // Custom Hook for complex gallery logic
  const {
    gallery,
    activeImage,
    setActiveImage,
    isGalleryOpen,
    setIsGalleryOpen,
    touchHandlers
  } = usePropertyImages(property?.images, property?.coverImage)

  // Loading State
  if (store.loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-secondary-200 rounded-2xl" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-24 bg-secondary-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    )
  }

  // Not Found State
  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4">
        <p className="text-5xl">{t('notFound.icon')}</p>
        <p className="text-2xl font-bold text-secondary-700">{t('notFound.title')}</p>
        <Link to="/properties" className="inline-block mt-4 px-6 py-3 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-800 transition-colors">
          {t('notFound.cta')}
        </Link>
      </div>
    )
  }

  // Derived Data (Corrected)
  const locationName = property.locations?.name || 'Ubicación no disponible'
  const locationString = property.locations?.name
    ? `${property.locations.name}${property.locations.provinces?.name ? `, ${property.locations.provinces.name}` : ''}`
    : locationName

  return (
    <article className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 ${isMinimal ? 'pt-32 md:pt-40' : 'pt-10'}`}>
      
      {/* ── Back Navigation ── */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary-100 text-secondary-700 font-semibold hover:bg-secondary-200 transition-colors"
        aria-label={t('backAriaLabel')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {t('common:btn.back', 'Volver')}
      </button>

      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          <PropertyGallery 
            gallery={gallery}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            isGalleryOpen={isGalleryOpen}
            setIsGalleryOpen={setIsGalleryOpen}
            touchHandlers={touchHandlers}
            title={property.title}
          />
          
          <PropertyHeader 
            title={property.title}
            listing_type={property.listing_type}
            price={property.price}
            status={property.status}
            locationString={locationString}
          />

          <PropertyFeatures 
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            size_m2={property.size_m2}
          />

          {property.description && (
            <div className="prose prose-slate max-w-none mb-12">
              <h2 className="text-xl font-bold text-secondary-950 mb-4">Descripción</h2>
              <PropertyDescription text={property.description} />
            </div>
          )}
        </div>

        {/* Right Column (1/3 width) Sidebar */}
        <PropertyContactForm propertyTitle={property.title} />
        
      </div>
    </article>
  )
}
