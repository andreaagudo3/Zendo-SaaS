# 🏡 InmoZen — Plataforma Inmobiliaria SaaS Multi-tenant

> **InmoZen** es una solución "Software as a Service" (SaaS) diseñada para gestionar múltiples inmobiliarias de forma aislada y segura bajo una única infraestructura tecnológica y una sola base de datos.

---

## 📋 Índice

1. [Stack tecnológico](#-stack-tecnológico)
2. [Arquitectura del proyecto](#-arquitectura-del-proyecto)
3. [Estructura de directorios](#-estructura-de-directorios)
4. [Features públicas](#-features-públicas)
5. [Panel de administración](#-panel-de-administración)
6. [Internacionalización (i18n)](#-internacionalización-i18n)
7. [Base de datos (Supabase)](#-base-de-datos--supabase)
8. [Comandos de desarrollo](#-comandos-de-desarrollo)
9. [Variables de entorno](#-variables-de-entorno)
10. [Guía de mantenimiento](#-guía-de-mantenimiento)

---

## 🛠 Stack tecnológico

| Capa | Tecnología | Versión | Rol |
|---|---|---|---|
| **UI Framework** | React | 19 | Librería de componentes |
| **Build tool** | Vite | 7 | Bundler y dev server |
| **Routing** | React Router DOM | 7 | Navegación SPA |
| **Estilos** | Tailwind CSS | 4 | Utility-first CSS |
| **Backend / DB** | Supabase | 2 | PostgreSQL + Auth + Storage |
| **i18n** | react-i18next + i18next | 17/26 | Traducciones multi-idioma |
| **Linting** | ESLint + eslint-plugin-react-hooks | 9/7 | Calidad de código |

### Diagrama de capas

```
┌─────────────────────────────────────────────────┐
│                   NAVEGADOR                     │
│  ┌──────────────────────────────────────────┐  │
│  │         React 19 SPA (Vite)              │  │
│  │  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │  Páginas     │  │  Componentes    │  │  │
│  │  │  públicas    │  │  compartidos    │  │  │
│  │  └──────┬───────┘  └────────┬────────┘  │  │
│  │         │                   │            │  │
│  │  ┌──────▼───────────────────▼────────┐  │  │
│  │  │         Services Layer            │  │  │
│  │  │  propertyService  adminService    │  │  │
│  │  │  contactService   locationService │  │  │
│  │  └──────────────┬────────────────────┘  │  │
│  └─────────────────┼──────────────────────┘  │
│                    │ HTTPS / REST              │
│  ┌─────────────────▼──────────────────────┐  │
│  │              SUPABASE                   │  │
│  │  PostgreSQL  │  Auth  │  Storage        │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🗂 Arquitectura del proyecto

### Flujo de datos

```
URL (query params)
       │
       ▼
┌──────────────┐     useSearchParams     ┌───────────────┐
│  Properties  │ ─────────────────────► │  URL State    │
│   Page       │ ◄───────────────────── │  (filtros,    │
│              │     setSearchParams     │   página)     │
└──────┬───────┘                         └───────────────┘
       │
       │  getPropertiesPaginated(filters, page)
       ▼
┌──────────────┐      .range() server-side      ┌───────────────┐
│  property    │ ─────────────────────────────► │   Supabase    │
│  Service.js  │ ◄───────────────────────────── │  PostgreSQL   │
└──────┬───────┘      { data, count }            └───────────────┘
       │
       │  withImages(data) → Storage URLs
       ▼
┌──────────────────────────────────────────────┐
│  PropertyCard × N   (grid responsive)        │
└──────────────────────────────────────────────┘
```

### Gestión de estado

- **Filtros y paginación**: URL query params (`?loc=...&type=...&page=2`). El estado vive en la URL, no en memoria.
- **Propiedades destacadas (Home)**: `propertiesStore` (Zustand-like hook personalizado).
- **Admin**: estado local por componente + llamadas directas a `adminService`.

---

## 📁 Estructura de directorios

```
ParqueSierra/
├── public/
│   ├── locales/               ← Traducciones i18n
│   │   └── es/
│   │       ├── common.json
│   │       ├── home.json
│   │       ├── properties.json
│   │       ├── property.json
│   │       ├── contact.json
│   │       └── nav.json
│   └── logo.png
│
├── src/
│   ├── i18n.js                ← Config de react-i18next
│   ├── main.jsx               ← Entry point
│   ├── App.jsx                ← Router principal
│   │
│   ├── config/
│   │   └── siteConfig.js      ← ⚙️  Datos del negocio (nombre, zona, teléfono…)
│   │
│   ├── pages/                 ← Páginas de alto nivel
│   │   ├── HomePage.jsx
│   │   ├── PropertiesPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── admin/
│   │       ├── AdminPropertiesPage.jsx
│   │       ├── AdminLocationsPage.jsx
│   │       ├── PropertyFormPage.jsx
│   │       └── LoginPage.jsx
│   │
│   ├── features/              ← Feature modules autocontenidos
│   │   └── property-detail/
│   │       ├── PropertyDetailPage.jsx
│   │       ├── components/
│   │       │   ├── PropertyGallery.jsx
│   │       │   ├── PropertyHeader.jsx
│   │       │   ├── PropertyFeatures.jsx
│   │       │   └── PropertyContactForm.jsx
│   │       └── hooks/
│   │           └── usePropertyImages.js
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── search/
│   │   │   ├── PropertySearchBar.jsx
│   │   │   ├── PropertyFiltersModal.jsx
│   │   │   ├── HierarchicalLocationSelect.jsx
│   │   │   └── FilterChips.jsx
│   │   ├── shared/
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyDescription.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── SkeletonCard.jsx
│   │   └── admin/
│   │       ├── ProtectedRoute.jsx
│   │       └── ImageUploader.jsx
│   │
│   ├── services/              ← Capa de acceso a datos
│   │   ├── propertyService.js ← Propiedades públicas + Storage
│   │   ├── adminService.js    ← CRUD admin + paginación server-side
│   │   ├── contactService.js  ← Envío de formulario de contacto
│   │   └── supabaseClient.js  ← Singleton Supabase
│   │
│   ├── store/
│   │   └── propertiesStore.js ← Estado global de propiedades destacadas
│   │
│   └── utils/
│       └── slugify.js         ← Genera slugs SEO-friendly
│
├── supabase/
│   └── create_properties_table.sql
│
├── .env                       ← Variables de entorno (no commitear)
├── vite.config.js
└── package.json
```

---

## 🌐 Pantallas públicas — Descripción de producto

---

### 🏠 1. Home Page (`/`) — Primera impresión que convierte

La portada es la cara de la inmobiliaria: impacto visual inmediato, identidad de marca y captura de intención del visitante en segundos.

```
┌─────────────────────────────────────────────────────┐
│  HERO  │  Logo + Zona geográfica                    │
│        │  Título  "Encuentra tu hogar en Aracena"   │
│        │  ┌────────────────────────────────────┐    │
│        │  │  [Todos] [Comprar] [Alquilar]       │    │
│        │  │  📍 Selector de ubicación  [Buscar] │    │
│        │  └────────────────────────────────────┘    │
├─────────────────────────────────────────────────────┤
│  DESTACADAS │  Grid de propiedades con ★ featured   │
├─────────────────────────────────────────────────────┤
│  CTA BANNER │  "¿Quieres vender?"  [Contactar]      │
└─────────────────────────────────────────────────────┘
```

**¿Qué puede hacer el visitante?**

- **Buscar directamente desde la portada** eligiendo si quiere comprar o alquilar y seleccionando su zona de interés en el desplegable jerárquico (Provincia → Localidad). Un clic en «Buscar» le lleva al catálogo ya filtrado — sin fricciones.
- **Descubrir las mejores propiedades** a golpe de vista en el bloque de Destacadas: el asesor elige qué inmuebles aparecen aquí desde el panel admin, controlando qué se promociona en cada momento.
- **Contactar directamente** gracias al banner CTA en la parte inferior, que lleva al formulario de contacto con un solo clic.
- **Navegar a todo el catálogo** con el botón «Ver todas» que abre el listado completo sin ningún filtro.

> 💡 **Valor de producto**: la Home funciona como escaparate y embudo al mismo tiempo. El buscador elimina fricción porque no hay texto libre: el usuario elige de una lista predefinida→ resultados siempre relevantes.

---

### 📋 2. Listado de propiedades (`/properties`) — El catálogo inteligente

El corazón de la plataforma: un buscador tipológico potente que corre completamente en el servidor y funciona igual de bien en móvil que en escritorio.

```
┌──────────────────────────────────────────────────────┐
│  HEADER  │  "Propiedades"  ·  47 resultados           │
├──────────────────────────────────────────────────────┤
│  BARRA   │  [Venta/Alquiler ▾]  [📍 Ubicación ▾]     │
│  FILTROS │                           [Más filtros ⚙] │
├──────────────────────────────────────────────────────┤
│  CHIPS   │  ✕ En venta  ✕ Aracena  ✕ Hasta 300.000€  │
├──────────────────────────────────────────────────────┤
│                                                      │
│   ┌──────┐  ┌──────┐  ┌──────┐  ← grid 3 col        │
│   │ card │  │ card │  │ card │    (1 col en móvil)    │
│   └──────┘  └──────┘  └──────┘                      │
│                                                      │
│   [← 1]  [2]  [3]  ...  [12 →]  ← paginación        │
└──────────────────────────────────────────────────────┘
```

**¿Qué puede hacer el visitante?**

- **Filtrar por tipo de operación**: conmutar entre Comprar y Alquilar con un solo toque.
- **Localización jerárquica**: elegir primero una provincia y luego refinar a una localidad concreta — ninguna caja de texto libre donde puedan escribir cualquier cosa.
- **Filtros avanzados** (botón «Más filtros»):
  - Número de habitaciones: Estudio, 1, 2, 3 ó 4+ (chips tipo pill).
  - Precio máximo: slider continuo de 50.000€ a «Sin límite», con feedback del valor en tiempo real.
- **Ver los filtros activos** como chips eliminables directamente sobre el grid — y limpiarlos todos de un golpe si cambia de idea.
- **Compartir búsquedas**: la URL refleja todos los filtros y la página actual. Un visitante puede copiar y pegar la URL o compartirla por WhatsApp y el receptor aterrizará exactamente en los mismos resultados.
- **Navegar por páginas** sin perder los filtros: la paginación es server-side, cada página carga en <500ms.
- **En móvil**: los filtros avanzados se abren en pantalla completa (experiencia nativa, sin scroll del fondo). En escritorio: modal centrado con overlay.

> 💡 **Valor de producto**: los filtros en URL hacen el catálogo compartible y «guardable» en favoritos del navegador. La paginación server-side significa que funciona con 10 o con 10.000 propiedades sin degradación.

---

### 🔍 3. Detalle de propiedad (`/properties/:slug`) — La ficha que vende

Cada propiedad tiene su propia página con URL semántica (`/properties/casa-aracena-centro`), optimizada para buscadores y diseñada para convertir visitas en consultas.

```
┌──────────────────────────────────────────────────────┐
│  [← Volver]                                          │
├─────────────────────────────┬────────────────────────┤
│                             │  ┌──────────────────┐  │
│   GALERÍA PRINCIPAL         │  │  Solicitar info  │  │
│   (imagen grande)           │  │  ─────────────── │  │
│                             │  │  Nombre *        │  │
│   [ thumb ][ thumb ][ +3 ]  │  │  Email  *        │  │
│                             │  │  Teléfono        │  │
├─────────────────────────────┤  │  Mensaje         │  │
│  🏷 En Venta   ✅ Disponible│  │  [Enviar]        │  │
│  Casa en Aracena Centro     │  │  ─────────────── │  │
│  📍 Aracena, Huelva         │  │  📞 680 686 455  │  │
│  350.000 €                  │  └──────────────────┘  │
├─────────────────────────────┤                        │
│  🛏 3 hab. · 🚿 2 baños · 📐 180 m²                  │
├──────────────────────────────────────────────────────┤
│  DESCRIPCIÓN (texto completo)                        │
└──────────────────────────────────────────────────────┘
```

**¿Qué puede hacer el visitante?**

- **Explorar la galería completa**: las imágenes se cargan desde Supabase Storage. Un clic abre el lightbox a pantalla completa con navegación por teclado o swipe táctil en móvil.
- **Ver toda la ficha técnica** de un vistazo: precio formateado, tipo de operación (Venta/Alquiler), estado (Disponible/Reservado/Vendido), localización, habitaciones, baños y superficie.
- **Abrir la ubicación en Google Maps** con un toque en el nombre del lugar.
- **Contactar directamente** desde el formulario lateral sin salir de la página:
  - El mensaje se prerrellena con el título de la propiedad (evita que el cliente olvide decir por qué llama).
  - Validación en cliente antes de enviar.
  - Animación de confirmación al enviar con éxito.
  - Si el envío falla, muestra un error claro y permite reintentar.
- **Llamar directamente** con el teléfono visible justo debajo del formulario.
- **Volver al listado** manteniendo los filtros anteriores (botón Volver usa `navigate(-1)`).

> 💡 **Valor de producto**: la URL tipo `/properties/casa-aracena-centro` es indexable por Google. El formulario sticky en desktop significa que el call-to-action siempre está visible mientras el visitante lee la descripción.

---

### ✉️ 4. Contacto (`/contact`) — Canal de captación general

Formulario de contacto genérico para visitantes que no tienen una propiedad concreta en mente pero quieren hablar con el asesor.

```
┌──────────────────────────────────────────────────────┐
│  INFO             │  FORMULARIO                      │
│  📍 Sierra de     │  Nombre *                        │
│     Aracena       │  Email *                         │
│  📞 680 686 455   │  Teléfono (opcional)             │
│  ✉  email         │  Asunto (desplegable)            │
│  🕘 Lun–Vie 9–18  │  Mensaje *                       │
│                   │  [Enviar mensaje]                │
└──────────────────────────────────────────────────────┘

          ✅  ¡Mensaje recibido! (animado)
```

**¿Qué puede hacer el visitante?**

- **Seleccionar el motivo de contacto** desde un desplegable predefinido (comprar, alquilar, vender, asesoría hipotecaria…) — el asesor sabe de qué va la consulta antes de leerla.
- **Enviar el formulario** con nombre, email, teléfono opcional y mensaje libre.
- **Ver confirmación animada** con checkmark verde al enviar con éxito — el visitante sabe que el mensaje llegó.
- **Reintentar** si hubo un error de red, sin perder lo que había escrito.
- **Localizar la inmobiliaria** gracias al bloque de información con teléfono, email y horario de atención.

> 💡 **Valor de producto**: el asunto predefinido facilita la clasificación de leads por parte del asesor sin depender de que el cliente lo explique bien.

---

## 🔐 Panel de administración — Descripción de producto

> Acceso en `/admin/login`. Protegido por autenticación Supabase (solo usuarios registrados en el proyecto).

```
/admin
├── /admin/login           ← Acceso seguro
├── /admin/properties      ← Centro de control del catálogo
├── /admin/properties/new  ← Alta de nueva propiedad
├── /admin/properties/:id  ← Edición de propiedad existente
└── /admin/locations       ← Gestión del árbol de ubicaciones
```

---

### 🔑 Login (`/admin/login`) — Acceso seguro

- Formulario de email + contraseña autenticado por **Supabase Auth**.
- Rutas admin protegidas (`ProtectedRoute`): si la sesión caduca o no existe, redirige automáticamente al login.
- Sin tokens en el código fuente — todo gestionado por Supabase.

---

### 🗂 Gestión de propiedades (`/admin/properties`) — Centro de control del catálogo

Vista unificada de todo el inventario. Diseñada para que el asesor trabaje con comodidad tanto desde el móvil en una visita como desde el escritorio en la oficina.

```
Desktop:
┌────────────────────────────────────────────────────────────┐
│  [🔍 Buscar...]  [Todas / Destacadas ▾]  [+ Nueva]         │
├────────┬──────────┬───────────┬────────┬──────────┬────────┤
│  Ref   │  Título  │ Ubicación │ Precio │  Estado  │ Acciones│
├────────┼──────────┼───────────┼────────┼──────────┼────────┤
│  A738  │ Casa...  │ Aracena   │ 350k€  │ ✅ Disp. │ ✏️  🗑  │
│  B102  │ Finca... │ Cortegana │ 120k€  │ 📌 Res.  │ ✏️  🗑  │
└────────┴──────────┴───────────┴────────┴──────────┴────────┘
          [← 1] [2] [3] ... [→]  ·  Página 1 de 4

Móvil:
┌─────────────────────────────┐
│  Ref: A738      ★ Destacada │
│  Casa en Aracena Centro     │
│  Aracena · 350.000 €        │
│  ✅ Disponible  · Publicada │
│  [✏️ Editar] [🗑 Eliminar]  │
└─────────────────────────────┘
```

**¿Qué puede hacer el asesor?**

- **Buscar en tiempo real** con debounce: escribe parte del título o referencia y el resultado aparece instantáneamente (sin pulsar Enter).
- **Filtrar por tipo**: ver «Todas» o solo las «Destacadas» para gestionar rápido su escaparate.
- **Publicar o despublicar** una propiedad con un toggle inline — sin entrar al formulario. Útil para ocultar temporalmente un inmueble mientras se negocia.
- **Marcar como destacada** con un icono de estrella togglable directamente en la lista — controla qué aparece en la portada de la web.
- **Eliminar** con confirmación previa para evitar borrados accidentales.
- **Paginar** a través de grandes catálogos con carga server-side (20 por página, orden por última modificación).
- **Acceder al formulario de edición** en un clic desde cualquier fila o card.

---

### ✏️ Crear / Editar propiedad (`/admin/properties/new` · `/:id`) — El formulario completo

Todo lo necesario para publicar una ficha profesional de propiedad, incluyendo galería de fotos.

**¿Qué puede hacer el asesor?**

- **Rellenar la ficha completa**:
  - Título, descripción libre, tipo de operación (venta/alquiler)
  - Precio, habitaciones, baños, superficie en m²
  - Localidad (desplegable jerárquico de la BBDD)
  - Estado (Disponible / Reservado / Vendido)
  - Activar/desactivar Publicada y Destacada
- **Código de referencia autogerado**: cuando se crea una propiedad nueva, el sistema genera automáticamente un código único (ej. `A738`). No hay que inventarse nada.
- **El slug SEO se genera solo** a partir del título — la URL de la ficha pública queda limpia y descriptiva desde el primer momento.
- **Subir y gestionar imágenes**: el `ImageUploader` sube las fotos directamente a Supabase Storage bajo la carpeta del código de referencia. Las fotos aparecen en la galería pública en el mismo orden.
- **Volver al listado** con el botón circular de retroceso — claro y accesible en móvil.

---

### 📍 Gestión de localidades (`/admin/locations`) — El árbol de ubicaciones

**¿Qué puede hacer el asesor?**

- **Crear y editar provincias**: el primer nivel del árbol geográfico.
- **Crear y editar localidades** asignadas a una provincia.
- **Eliminar** provincias o localidades que ya no sean necesarias.
- Los cambios **se reflejan automáticamente** en el selector jerárquico del buscador público — sin tocar código.

> 💡 **Valor de producto**: el asesor tiene control total del catálogo geográfico. Cuando se comiencen a operar en una zona nueva, basta con crear la localidad en este panel para que aparezca disponible en la búsqueda pública al instante.

---

## 🌍 Internacionalización (i18n)

> Implementado con `react-i18next`. La web detecta automáticamente el idioma del navegador.

### Namespaces disponibles

| Namespace | Fichero | Contiene |
|---|---|---|
| `common` | `es/common.json` | Botones, estados, tipos, UI genérica |
| `home` | `es/home.json` | Hero, Destacadas, CTA |
| `properties` | `es/properties.json` | Listado, filtros, chips, vacío |
| `property` | `es/property.json` | Detalle, features, formulario lateral |
| `contact` | `es/contact.json` | Formulario de contacto completo |
| `nav` | `es/nav.json` | Navbar y Footer |

### Añadir un nuevo idioma

```
# 1. Crear carpeta
mkdir public/locales/en

# 2. Copiar los ficheros de referencia y traducir
cp public/locales/es/*.json public/locales/en/
# → editar cada fichero con los textos en inglés

# 3. Registrar en src/i18n.js
supportedLngs: ['es', 'en'],   ← añadir 'en'
```

> El navegador del usuario usará el idioma automáticamente. Para un selector manual, llama a `i18next.changeLanguage('en')` desde cualquier componente.

---

## 🗄 Base de datos — Supabase

### Tablas principales

```
┌─────────────────────────────────────────────────────────┐
│  properties                                             │
├─────────────────┬──────────────┬────────────────────────┤
│  id             │ uuid (PK)    │                        │
│  reference_code │ text         │ Ej: "A738"             │
│  title          │ text         │                        │
│  slug           │ text (UNIQUE)│ SEO-friendly URL       │
│  description    │ text         │                        │
│  listing_type   │ enum         │ 'sale' | 'rent'        │
│  price          │ numeric      │                        │
│  bedrooms       │ int          │ 0 = estudio            │
│  bathrooms      │ int          │                        │
│  size_m2        │ numeric      │                        │
│  location_id    │ uuid (FK)    │ → locations.id         │
│  status         │ enum         │ available/reserved/sold│
│  published      │ bool         │                        │
│  featured       │ bool         │                        │
│  created_at     │ timestamptz  │                        │
│  updated_at     │ timestamptz  │                        │
└─────────────────┴──────────────┴────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  locations                                              │
├─────────────────┬──────────────┬────────────────────────┤
│  id             │ uuid (PK)    │                        │
│  name           │ text         │                        │
│  province_id    │ uuid (FK)    │ → provinces.id         │
└─────────────────┴──────────────┴────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  provinces                                              │
├─────────────────┬──────────────┬────────────────────────┤
│  id             │ uuid (PK)    │                        │
│  name           │ text         │                        │
└─────────────────┴──────────────┴────────────────────────┘
```

### Storage (Supabase)

- **Bucket**: `property-images`
- Estructura de carpetas: `{reference_code}/{filename}`  
  Ej: `A738/foto-principal.webp`
- Las URLs públicas se generan en `propertyService.js` → `getPropertyImages()`

---

## 💻 Comandos de desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 🔑 Variables de entorno

Crea un fichero `.env` en la raíz con:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

> ⚠️  Nunca commitees el `.env`. Está excluido por `.gitignore`.

---

## 🧭 Guía de mantenimiento

### Actualizar datos del negocio

Todos los datos de contacto, nombre comercial y zona geográfica están centralizados en un único fichero:

```
src/config/siteConfig.js
```

Edita solo ese fichero para actualizar teléfono, email, zona, etc. El cambio se propaga automáticamente por toda la web.

### Añadir una propiedad nueva

1. Acceder a `/admin/login`
2. Ir a **Propiedades → + Nueva propiedad**
3. Rellenar el formulario (el código de referencia se autogenera)
4. Subir imágenes desde la sección de galería
5. Activar **Publicada** para que aparezca en la web

### Añadir una localidad nueva

1. Acceder a **Admin → Localidades**
2. Crear la provincia si no existe
3. Crear la localidad y asignarla a la provincia
4. La localidad aparecerá automáticamente en el selector jerárquico del buscador

### Modificar textos de la web

Edita los ficheros JSON de traducción en `public/locales/es/`. No es necesario tocar ningún componente.

### Añadir una nueva página pública

1. Crear el componente en `src/pages/NuevaPagina.jsx`
2. Registrar la ruta en `src/App.jsx`
3. Añadir el link en `src/components/Layout/Navbar.jsx` (array `NAV_LINKS`)
4. Añadir en `src/config/nav.json` la clave de traducción correspondiente

---

## 📐 Diseño — Decisiones técnicas

| Decisión | Motivo |
|---|---|
| **State en URL** para filtros | Compartible, navegable con botón Atrás, sin estado global |
| **Paginación server-side** | Evita cargar miles de registros en cliente |
| **Debounce en buscador admin (350ms)** | Reduce queries innecesarias al escribir |
| **Modal vs pantalla completa** | Sub-640px: nativo mobile, ≥640px: modal Desktop |
| **`siteConfig.js` centralizado** | Un solo punto de verdad para datos del negocio |
| **Slugs SEO-friendly** | URLs legibles y optimizadas para buscadores |
| **`public/locales/`** para i18n | Carga lazy (HttpBackend), sin bloquear el bundle JS |

---

## 🔐 Seguridad y Aislamiento de Datos (Multi-tenant)

La plataforma implementa un modelo de seguridad **SaaS de aislamiento lógico**, donde la integridad de los datos no depende del código Frontend, sino que está blindada directamente en el motor de la base de datos mediante **Row Level Security (RLS)**.

### 1\. Identidad: La función `get_my_tenant()`

Para identificar en tiempo real a qué inmobiliaria pertenece el usuario logueado, utilizamos una función personalizada en PostgreSQL que actúa como puente entre la autenticación y los datos de negocio:

SQL

    CREATE FUNCTION get_my_tenant() RETURNS uuid AS $$
      -- Busca el tenant_id vinculado al usuario autenticado en la tabla members
      SELECT tenant_id FROM public.members WHERE id = auth.uid();
    $$ LANGUAGE sql STABLE SECURITY DEFINER;
    

### 2\. Políticas de Acceso (RLS)

La tabla `properties` cuenta con políticas estrictas que separan el tráfico público del administrativo de forma infalible:

-   **Lectura Pública (SELECT)**: Permite que cualquier visitante vea las propiedades. El motor filtra los resultados basándose en el dominio desde el que se accede (`app.current_domain`).
    
-   **Gestión Administrativa (ALL)**: Los usuarios autenticados tienen permisos totales (Insert, Update, Delete) **únicamente** si el `tenant_id` de la propiedad coincide con el resultado de `get_my_tenant()`.
    

### 3\. Mecanismos de Blindaje Anti-Fraude

Para evitar inyecciones de datos, publicidad no deseada o errores manuales, el sistema cuenta con dos protecciones críticas a nivel de esquema:

-   **Auto-Inyección (DEFAULT)**: La columna `tenant_id` tiene configurado el valor por defecto `get_my_tenant()`. Al crear una propiedad desde el panel, el sistema asigna el ID del dueño automáticamente sin intervención del usuario.
    
-   **Restricción de Escritura (WITH CHECK)**: Aunque un usuario intente enviar manualmente un `tenant_id` de otra inmobiliaria mediante la consola del navegador, la política `WITH CHECK` validará el ID contra su identidad real y abortará la operación con un error `403 Forbidden`.
    

### 4\. Estructura de Miembros

El acceso al panel de administración está regulado por la tabla `members`, que vincula los `UID` únicos de **Supabase Auth** con los IDs de la tabla `tenants`. Esto permite un entorno multi-agente donde varios usuarios pueden gestionar la misma inmobiliaria manteniendo el aislamiento total respecto al resto de clientes de la plataforma.

*Última actualización: Marzo 2026*
