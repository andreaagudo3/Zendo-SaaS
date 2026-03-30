// themeTokens (border-radius, shadows, fonts) are layout constants shared
// across all tenants. Tenant-specific data (colors, name, contact) is resolved
// at runtime via TenantContext — NOT read from here.
import { SITE } from '../config/siteConfig'

function hexToRgb(hex) {
  let r = 0, g = 0, b = 0;
  if(hex.length == 4) {
    r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3];
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6];
  }
  return [+r, +g, +b];
}

function mix(color1, color2, weight) {
  const w1 = weight / 100;
  const w2 = 1 - w1;
  const r = Math.round(color1[0] * w1 + color2[0] * w2);
  const g = Math.round(color1[1] * w1 + color2[1] * w2);
  const b = Math.round(color1[2] * w1 + color2[2] * w2);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Genera variables para shades
 */
function generateShades(baseHex, name) {
  const rgb = hexToRgb(baseHex);
  const white = [255, 255, 255];
  const black = [0, 0, 0];

  const shades = {
    50: mix(rgb, white, 10),
    100: mix(rgb, white, 20),
    200: mix(rgb, white, 40),
    300: mix(rgb, white, 60),
    400: mix(rgb, white, 80),
    500: mix(rgb, white, 100), // Original hex
    600: mix(rgb, black, 80),
    700: mix(rgb, black, 60),
    800: mix(rgb, black, 40),
    900: mix(rgb, black, 20),
    950: mix(rgb, black, 10),
  };

  const root = document.documentElement;
  Object.entries(shades).forEach(([shade, color]) => {
    root.style.setProperty(`--theme-color-${name}-${shade}`, color);
  });
}

/**
 * Genera y aplica variables CSS dinámicas basadas en el sistema de temas.
 *
 * @param {string} themeName    — 'MINIMAL' | 'CORPORATE' | 'PORTAL'
 * @param {string} primaryHex  — Primary brand color (from tenant.primary_color)
 * @param {string} secondaryHex — Neutral/secondary color (from tenant.secondary_color)
 */
export function injectTheme(themeName = 'MINIMAL', primaryHex = '#23c698', secondaryHex = '#64748b') {
  const tokens = SITE.themeTokens[themeName];
  if (!tokens) return;

  generateShades(primaryHex, 'primary');
  generateShades(secondaryHex, 'secondary');

  // 2. Geometría y tipografía ligada al layout
  const root = document.documentElement;
  root.style.setProperty('--theme-radius-md', tokens.radiusMd);
  root.style.setProperty('--theme-radius-lg', tokens.radiusLg);
  root.style.setProperty('--theme-radius-xl', tokens.radiusXl);
  root.style.setProperty('--theme-radius-2xl', tokens.radius2xl)
  root.style.setProperty('--theme-radius-3xl', tokens.radius3xl)
  root.style.setProperty('--theme-shadow-card', tokens.shadowCard)
  root.style.setProperty('--theme-shadow-hover', tokens.shadowHover)
  root.style.setProperty('--theme-font-heading', tokens.fontHeading)
  root.style.setProperty('--theme-font-body', tokens.fontBody)
}
