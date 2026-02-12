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

 
  const initAuth = () => {
    onAuthStateChanged($auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

 
  const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider()

    provider.setCustomParameters({
      prompt: 'select_account'
    })

    await signInWithPopup($auth, provider)
  }



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
