// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon.ico' },

        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icon.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/icon.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/icon.png' }
      ]
    }
  }
})
