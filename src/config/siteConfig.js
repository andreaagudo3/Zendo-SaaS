/**
 * siteConfig.js — Configuración central del negocio.
 *
 * ✏️  Edita SOLO este archivo para actualizar los datos de contacto,
 *     nombre del negocio y zona geográfica en toda la web.
 */

export const SITE = {
  /** 
   * Configuración Principal del Negocio
   * Cambia estos datos para generar una web diferente.
   */
  name: 'Zendo',
  tagline: 'Real Estate Minimalist',
  fullName: 'Zendo Real Estate Group',

  description: 'Encuentra la casa de tus sueños con la experiencia Zendo. Lujo, minimalismo y eficiencia.',
  seo: {
    titleTemplate: '%s | Zendo',
    defaultTitle: 'Zendo - Real Estate',
  },

  zone: 'Costa del Sol',
  heroZone: 'Marbella & Málaga',
  province: 'Málaga',
  country: 'España',
  address: 'Av. Ricardo Soriano, 12, 29601 Marbella, Málaga',

  phones: [
    { number: '+34 600 00 00 00', href: 'tel:+34600000000' }
  ],

  email: {
    address: 'hello@zendo.com',
    href: 'mailto:hello@zendo.com',
  },

  socials: [
    { name: 'Instagram', href: 'https://instagram.com/zendogroup' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/zendogroup' },
    { name: 'Twitter', href: '#' },
  ],

  /**
   * Identidad Visual
   * Cambia el color primario (ej. botones, acentos) y secundario (fondos, bordes)
   * para rediseñar toda la web automáticamente.
   */
  branding: {
    primaryColor: '#23c698',   // Verde agua / Teal
    secondaryColor: '#64748b', // Tono neutro / Slate
  },

  /**
   * Theme System
   * Allowed values: 'MINIMAL', 'CORPORATE', 'PORTAL'
   * Define tipografías y radios (los colores ahora dependen de branding)
   */
  theme: 'MINIMAL',
  themeTokens: {
    MINIMAL: {
      radiusMd: '0.375rem', // Afecta a botones pequeños, badges, inputs
      radiusLg: '0.5rem',   // Afecta a botones principales flotantes
      radiusXl: '0.75rem',  // Afecta a dropdowns, menús, fotos secundarias
      radius2xl: '1rem',    // Afecta a Tarjetas de Propiedades (PropertyCard) y Hero
      radius3xl: '1.5rem',  // Afecta a fondos grandes, ventanas modales
      shadowCard: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)', // Sombra base suave
      shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)', // Sombra hover flotante
      fontHeading: '"Inter", sans-serif', // Títulos grandes (H1, H2, H3...)
      fontBody: '"Inter", sans-serif',    // Párrafos, menús, textos normales
    },
    CORPORATE: {
      radiusMd: '0px',
      radiusLg: '0px',
      radiusXl: '0px',
      radius2xl: '0px',
      radius3xl: '0px',
      shadowCard: 'none',
      shadowHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      fontHeading: '"Roboto", sans-serif',
      fontBody: '"Roboto", sans-serif',
    },
    PORTAL: {
      radiusMd: '0.375rem',
      radiusLg: '0.5rem',
      radiusXl: '0.75rem',
      radius2xl: '1rem',
      radius3xl: '1.5rem',
      shadowCard: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      shadowHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      fontHeading: '"Outfit", sans-serif',
      fontBody: '"Outfit", sans-serif',
    }
  },

  /**
   * Feature Flags (Opciones de la plantilla)
   * Activa (true) o desactiva (false) módulos de la web.
   */
  features: {
    isDemo: true,           // Panel flotante para cambiar temas y colores en vivo
    i18n: true,             // Soporte multi-idioma
    googleMaps: true,       // Integración con mapas
    advancedFilters: true,  // Filtros de habitaciones, m2, etc. en búsqueda
    whatsappButton: true,   // Botón flotante de WhatsApp
  }
}
