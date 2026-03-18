import { watch } from 'vue'
import type { AppTheme } from './useUserSettings'

export const useTheme = () => {
  const { settings, initUserSettings } = useUserSettings()

  const applyTheme = (theme: AppTheme) => {
    if (!import.meta.client) return

    const html = document.documentElement

    if (theme === 'dark') {
      html.classList.remove('light')
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
      html.classList.add('light')
    }
  }

  const initTheme = () => {
    // Apply initial theme
    applyTheme(settings.value.theme)

    // Watch for theme changes
    watch(
      () => settings.value.theme,
      (newTheme) => {
        applyTheme(newTheme)
      }
    )
  }

  return {
    initTheme,
    applyTheme
  }
}
