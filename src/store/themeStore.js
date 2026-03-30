import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { injectTheme } from '../utils/themeInjector'

/**
 * themeStore — manages runtime theme for the DemoPanel.
 *
 * Seeded by TenantProvider via initFromTenant() on every page load.
 * Changes made by DemoPanel persist to sessionStorage (session-scoped).
 */
export const useThemeStore = create(
  persist(
    (set) => ({
      theme:          'MINIMAL',
      primaryColor:   '#23c698',
      secondaryColor: '#64748b',

      /** DemoPanel: change structural theme */
      setTheme: (newTheme) => set((state) => {
        injectTheme(newTheme, state.primaryColor, state.secondaryColor)
        return { theme: newTheme }
      }),

      /** DemoPanel: change accent color */
      setPrimaryColor: (newColor) => set((state) => {
        injectTheme(state.theme, newColor, state.secondaryColor)
        return { primaryColor: newColor }
      }),

      /**
       * Called by TenantProvider after tenant is resolved.
       * Seeds all three values and injects CSS variables.
       * Always takes precedence over stale sessionStorage values
       * from a previous DemoPanel session.
       */
      initFromTenant: (theme, primaryColor, secondaryColor) => set(() => {
        injectTheme(theme, primaryColor, secondaryColor)
        return { theme, primaryColor, secondaryColor }
      }),
    }),
    {
      name: 'inmozen-demo-theme',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        // Re-apply CSS variables from sessionStorage on hard reload.
        // TenantProvider will override these shortly after with tenant values.
        if (state) {
          injectTheme(
            state.theme          ?? 'MINIMAL',
            state.primaryColor   ?? '#23c698',
            state.secondaryColor ?? '#64748b',
          )
        }
      },
    }
  )
)
