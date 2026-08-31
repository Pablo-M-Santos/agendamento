import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let firebaseAdminApp: App | null = null

function getFirebaseAdminApp(): App {
  if (firebaseAdminApp) {
    return firebaseAdminApp
  }

  const apps = getApps()
  if (apps.length > 0) {
    firebaseAdminApp = apps[0]!
    return firebaseAdminApp
  }

  const config = useRuntimeConfig()

  if (!config.firebaseAdminProjectId || !config.firebaseAdminClientEmail || !config.firebaseAdminPrivateKey) {
    throw new Error('Firebase Admin SDK: credenciais não configuradas')
  }

  firebaseAdminApp = initializeApp({
    credential: cert({
      projectId: config.firebaseAdminProjectId,
      clientEmail: config.firebaseAdminClientEmail,
      privateKey: config.firebaseAdminPrivateKey.replace(/\\n/g, '\n')
    })
  })

  return firebaseAdminApp
}

export function getFirebaseAuth() {
  const app = getFirebaseAdminApp() as App
  return getAuth(app)
}

export async function createFirebaseUser(email: string, password: string) {
  const auth = getFirebaseAuth()
  return auth.createUser({
    email,
    password,
    emailVerified: false
  })
}

export async function generateEmailVerificationLink(email: string, appUrl: string) {
  const auth = getFirebaseAuth()
  const actionCodeSettings = {
    url: `${appUrl}/auth/action`,
    handleCodeInApp: false
  }
  return auth.generateEmailVerificationLink(email, actionCodeSettings)
}

export async function checkIfUserExists(email: string): Promise<boolean> {
  try {
    const auth = getFirebaseAuth()
    await auth.getUserByEmail(email)
    return true
  } catch (error: unknown) {
    const err = error as { code?: string }
    if (err.code === 'auth/user-not-found') {
      return false
    }
    throw error
  }
}
