import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public

  const requiredFields = {
    NUXT_PUBLIC_FIREBASE_API_KEY: config.firebaseApiKey,
    NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN: config.firebaseAuthDomain,
    NUXT_PUBLIC_FIREBASE_PROJECT_ID: config.firebaseProjectId,
    NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET: config.firebaseStorageBucket,
    NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: config.firebaseMessagingSenderId,
    NUXT_PUBLIC_FIREBASE_APP_ID: config.firebaseAppId
  }

  const missing = Object.entries(requiredFields)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Firebase config incompleto. Defina: ${missing.join(', ')}`)
  }

  const firebaseConfig = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId,
    measurementId: config.firebaseMeasurementId || undefined
  }

  const app = initializeApp(firebaseConfig)

  const auth = getAuth(app)
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // If browser blocks persistence, Firebase keeps the best available fallback.
  })

  const db = getFirestore(app)

  return {
    provide: {
      auth,
      db
    }
  }
})
