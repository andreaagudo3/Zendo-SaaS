/**
 * i18n.js — Configuración de react-i18next
 *
 * Namespaces disponibles:
 *   common     — botones, estados, acciones reutilizados
 *   home       — Hero, Destacadas, CTA
 *   properties — listado de propiedades
 *   property   — detalle de propiedad
 *   contact    — formulario de contacto
 *   nav        — Navbar y Footer
 *
 * Para añadir un idioma nuevo, crea public/locales/{lang}/*.json
 * y añade el código al array `supportedLngs`.
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

i18n
  .use(HttpBackend)             // carga ficheros JSON desde /public/locales/
  .use(LanguageDetector)        // detecta idioma del navegador automáticamente
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],      // Añadido inglés
    ns: ['common', 'home', 'properties', 'property', 'contact', 'nav', 'admin', 'features', 'marketing'],
    defaultNS: 'common',

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React ya escapa XSS
    },
  })

export default i18n
