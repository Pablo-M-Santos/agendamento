// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  ssr: false,

  devtools: {
    enabled: true
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
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  },

  routeRules: {
    '/agenda': { redirect: { to: '/schedule', statusCode: 301 } },
    '/cadastro': { redirect: { to: '/register', statusCode: 301 } },
    '/perfil': { redirect: { to: '/profile', statusCode: 301 } },
    '/relatorios': { redirect: { to: '/reports', statusCode: 301 } }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
})
