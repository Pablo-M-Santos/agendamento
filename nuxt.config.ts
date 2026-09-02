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

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  runtimeConfig: {
    firebaseAdminProjectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
    firebaseAdminClientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
    firebaseAdminPrivateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFromEmail: process.env.RESEND_FROM_EMAIL || '',
    mailProvider: process.env.MAIL_PROVIDER || 'mailpit',
    mailHost: process.env.MAIL_HOST || 'localhost',
    mailPort: Number(process.env.MAIL_PORT) || 1025,
    mailUser: process.env.MAIL_USER || '',
    mailPassword: process.env.MAIL_PASSWORD || '',
    gmailUser: process.env.GMAIL_USER || '',
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
    }
  },

  routeRules: {
    '/agenda': { redirect: { to: '/schedule', statusCode: 301 } },
    '/cadastro': { redirect: { to: '/register', statusCode: 301 } },
    '/perfil': { redirect: { to: '/profile', statusCode: 301 } },
    '/relatorios': { redirect: { to: '/reports', statusCode: 301 } }
  },
  compatibilityDate: '2025-01-15',

  nitro: {
    externals: {
      external: ['firebase-admin']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
})
