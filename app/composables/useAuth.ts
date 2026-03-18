import type { User } from 'firebase/auth'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth'

const SESSION_STORAGE_KEY = 'agendamento-auth-session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

type LoginMethod = 'google' | 'email-senha' | 'desconhecido'

type AuthSession = {
  method: LoginMethod
  loginAt: number
  expiresAt: number
}

type AuthResult = {
  ok: boolean
  code?: string
}

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const config = useRuntimeConfig()

  const user = useState<User | null>('user', () => null)
  const loading = useState<boolean>('loading', () => true)
  const authInitialized = useState<boolean>('auth-initialized', () => false)

  const getStoredSession = (): AuthSession | null => {
    if (!process.client) return null

    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null

    try {
      const parsed = JSON.parse(raw) as Partial<AuthSession>
      if (typeof parsed.loginAt !== 'number' || typeof parsed.expiresAt !== 'number') return null

      const method: LoginMethod =
        parsed.method === 'google' || parsed.method === 'email-senha'
          ? parsed.method
          : 'desconhecido'

      return {
        method,
        loginAt: parsed.loginAt,
        expiresAt: parsed.expiresAt
      }
    } catch {
      return null
    }
  }

  const clearStoredSession = () => {
    if (!process.client) return
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }

  const createStoredSession = (method: LoginMethod) => {
    if (!process.client) return

    const now = Date.now()
    const payload: AuthSession = {
      method,
      loginAt: now,
      expiresAt: now + SESSION_DURATION_MS
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload))
  }

  const inferLoginMethod = (firebaseUser: User): LoginMethod => {
    const providers = (firebaseUser.providerData || []).map((provider) => provider.providerId)

    if (providers.includes('google.com')) return 'google'
    if (providers.includes('password') || providers.includes('emailLink')) return 'email-senha'

    return 'desconhecido'
  }

  const initAuth = () => {
    if (authInitialized.value) {
      loading.value = false
      return
    }

    authInitialized.value = true

    onAuthStateChanged($auth, async (firebaseUser) => {
      if (!firebaseUser) {
        clearStoredSession()
        user.value = null
        loading.value = false
        return
      }

      const storedSession = getStoredSession()

      if (storedSession && storedSession.expiresAt <= Date.now()) {
        clearStoredSession()
        await signOut($auth)
        user.value = null
        loading.value = false
        return
      }

      if (!storedSession) {
        createStoredSession(inferLoginMethod(firebaseUser))
      }

      user.value = firebaseUser
      loading.value = false
    })
  }

  const getSignInMethodsByEmail = async (email: string) => {
    return fetchSignInMethodsForEmail($auth, email.trim())
  }

  const loginWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    const currentEmail = email.trim()
    let methods: string[] = []

    try {
      methods = await getSignInMethodsByEmail(currentEmail)
    } catch {
      methods = []
    }

    if (methods.includes('google.com') && !methods.includes('password')) {
      return {
        ok: false,
        code: 'auth/google-only-account'
      }
    }

    try {
      await signInWithEmailAndPassword($auth, currentEmail, password)
      createStoredSession('email-senha')
    } catch (error: any) {
      if (
        error?.code === 'auth/invalid-credential' ||
        error?.code === 'auth/wrong-password' ||
        error?.code === 'auth/user-not-found'
      ) {
        let fallbackMethods: string[] = []

        try {
          fallbackMethods = await getSignInMethodsByEmail(currentEmail)
        } catch {
          fallbackMethods = []
        }

        if (fallbackMethods.includes('google.com') && !fallbackMethods.includes('password')) {
          return {
            ok: false,
            code: 'auth/google-only-account'
          }
        }

        return {
          ok: false,
          code: 'auth/invalid-login'
        }
      }

      return {
        ok: false,
        code: error?.code || 'auth/unknown'
      }
    }

    return {
      ok: true
    }
  }

  const loginWithGoogle = async (): Promise<AuthResult> => {
    const provider = new GoogleAuthProvider()

    provider.setCustomParameters({
      prompt: 'select_account'
    })

    try {
      await signInWithPopup($auth, provider)
      createStoredSession('google')

      return {
        ok: true
      }
    } catch (error: any) {
      return {
        ok: false,
        code: error?.code || 'auth/unknown'
      }
    }
  }

  const sendSetPasswordEmail = async (email: string): Promise<AuthResult> => {
    const appUrl = String(config.public.appUrl || '').replace(/\/$/, '')

    try {
      await sendPasswordResetEmail($auth, email.trim(), {
        url: `${appUrl}/reset-password`
      })

      return {
        ok: true
      }
    } catch (error: any) {
      return {
        ok: false,
        code: error?.code || 'auth/unknown'
      }
    }
  }

  const logout = async () => {
    clearStoredSession()
    await signOut($auth)
    user.value = null
    await navigateTo('/')
  }

  return {
    user,
    loading,
    initAuth,
    getSignInMethodsByEmail,
    loginWithEmail,
    loginWithGoogle,
    sendSetPasswordEmail,
    logout
  }
}
