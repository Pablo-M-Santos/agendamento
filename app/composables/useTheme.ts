export const useTheme = () => {
  const applyTheme = () => {
    if (!import.meta.client) return
    const html = document.documentElement
    html.classList.remove('light')
    html.classList.add('dark')
  }

  const initTheme = () => {
    applyTheme()
  }

  return {
    initTheme,
    applyTheme
  }
}
