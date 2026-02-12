import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth'

export const useAuth = () => {
  const { $auth } = useNuxtApp()

  const user = useState<any>('user', () => null)
  const loading = useState<boolean>('loading', () => true)

  // 🔹 Inicializa o listener de autenticação
  const initAuth = () => {
    onAuthStateChanged($auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  // 🔹 Login com Google
  const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider()

    provider.setCustomParameters({
      prompt: 'select_account'
    })

    await signInWithPopup($auth, provider)
  }


  // 🔹 Logout
  const logout = async () => {
    await signOut($auth)
    user.value = null
    await navigateTo('/login')
  }

  return {
    user,
    loading,
    initAuth,
    loginWithGoogle,
    logout
  }
}
