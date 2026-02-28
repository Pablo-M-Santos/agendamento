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

type AuthResult = {
  ok: boolean
  code?: string
}

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const config = useRuntimeConfig()

  const user = useState<User | null>('user', () => null)

  const loading = useState<boolean>('loading', () => true)

  const initAuth = () => {
    onAuthStateChanged($auth, (firebaseUser) => {
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
