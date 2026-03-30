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
  name: 'InmoZen',
  tagline: 'Real Estate Minimalist',
  fullName: 'InmoZen Real Estate Group',

  description: 'Encuentra la casa de tus sueños con la experiencia InmoZen. Lujo, minimalismo y eficiencia.',
  seo: {
    titleTemplate: '%s | InmoZen',
    defaultTitle: 'InmoZen - Real Estate',
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
    address: 'hello@inmozen.com',
    href: 'mailto:hello@inmozen.com',
  },

  socials: [
    { name: 'Instagram', href: 'https://instagram.com/inmozen' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/inmozen' },
    { name: 'Twitter', href: '#' },
  ],

  /**
   * Identidad Visual
   * Cambia el color primario (ej. botones, acentos) y secundario (fondos, bordes)
   * para rediseñar toda la web automáticamente.
   */
  branding: {
    primaryColor: '#0ea5e9',   // Azul moderno (el que estaba antes)
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
      radiusMd: '0.375rem',
      radiusLg: '0.5rem',
      fontHeading: '"Inter", sans-serif',
      fontBody: '"Inter", sans-serif',
    },
    CORPORATE: {
      radiusMd: '0px',
      radiusLg: '0px',
      fontHeading: '"Roboto", sans-serif',
      fontBody: '"Roboto", sans-serif',
    },
    PORTAL: {
      radiusMd: '1rem',
      radiusLg: '1.5rem',
      fontHeading: '"Outfit", sans-serif',
      fontBody: '"Outfit", sans-serif',
    }
  },

  /**
   * Feature Flags (Opciones de la plantilla)
   * Activa (true) o desactiva (false) módulos de la web.
   */
  features: {
    i18n: true,             // Soporte multi-idioma
    googleMaps: true,       // Integración con mapas
    advancedFilters: true,  // Filtros de habitaciones, m2, etc. en búsqueda
    whatsappButton: true,   // Botón flotante de WhatsApp
  }
}
