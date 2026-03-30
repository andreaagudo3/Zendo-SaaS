import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SITE } from '../config/siteConfig'
import { injectTheme } from '../utils/themeInjector'

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: SITE.theme || 'MINIMAL',
      primaryColor: SITE.branding?.primaryColor || '#23c698',
      
      setTheme: (newTheme) => set((state) => {
        injectTheme(newTheme, state.primaryColor)
        return { theme: newTheme }
      }),
      
      setPrimaryColor: (newColor) => set((state) => {
        injectTheme(state.theme, newColor)
        return { primaryColor: newColor }
      }),
    }),
    {
      name: 'inmozen-demo-theme',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        // Ejecutar la inyección de estilos inmediatamente tras recuperar estado al recargar la página
        if (state) {
          injectTheme(state.theme, state.primaryColor)
        }
      }
    }
  )
)
