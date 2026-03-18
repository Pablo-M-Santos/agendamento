import type { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'
import { computed, reactive, ref } from 'vue'

export const useRegisterPage = () => {
  const { $auth } = useNuxtApp()
  const { loginWithGoogle: authLoginWithGoogle } = useAuth()
  const { settings } = useUserSettings()
  const toast = useToast()

  const isLightTheme = computed(() => settings.value.theme === 'light')
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const showPassword = ref(false)

  const errors = reactive({
    email: '',
    password: ''
  })

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  }

  const validateField = (field: 'email' | 'password') => {
    if (field === 'email') {
      if (!email.value) {
        errors.email = 'Email e obrigatorio'
      } else if (!validateEmail(email.value)) {
        errors.email = 'Digite um email valido'
      } else {
        errors.email = ''
      }
    }

    if (field === 'password') {
      if (!password.value) {
        errors.password = 'Senha e obrigatoria'
      } else if (password.value.length < 6) {
        errors.password = 'Minimo de 6 caracteres'
      } else {
        errors.password = ''
      }
    }
  }

  const isFormValid = computed(() => {
    return !!email.value && !!password.value && !errors.email && !errors.password
  })

  const registerWithEmail = async () => {
    validateField('email')
    validateField('password')

    if (!isFormValid.value) return

    try {
      loading.value = true

      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email.value.trim(),
        password.value
      )

      await sendEmailVerification(userCredential.user)
      await signOut($auth)

      toast.add({
        title: 'Cadastro realizado com sucesso!',
        description: 'Verifique seu email',
        color: 'success'
      })

      email.value = ''
      password.value = ''

      await navigateTo('/')
    } catch (error: unknown) {
      const err = error as FirebaseError
      let message = 'Nao foi possivel concluir seu cadastro. Tente novamente.'

      switch (err?.code) {
        case 'auth/email-already-in-use':
          message = 'Este e-mail ja esta cadastrado. Faca login ou use outro e-mail.'
          break
        case 'auth/invalid-email':
          message = 'Email invalido.'
          break
        case 'auth/weak-password':
          message = 'Senha muito fraca. Use pelo menos 6 caracteres.'
          break
        case 'auth/too-many-requests':
          message = 'Muitas tentativas. Tente novamente mais tarde.'
          break
      }

      toast.add({
        title: 'Erro no cadastro',
        description: message,
        color: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  const registerWithGoogle = async () => {
    try {
      loading.value = true
      const result = await authLoginWithGoogle()

      if (!result.ok) {
        let message = 'Tente novamente.'

        switch (result.code) {
          case 'auth/account-exists-with-different-credential':
            message = 'Este email ja esta cadastrado com senha. Entre com email e senha.'
            break
          case 'auth/popup-closed-by-user':
            message = 'Login com Google cancelado.'
            break
          case 'auth/too-many-requests':
            message = 'Muitas tentativas. Tente mais tarde.'
            break
        }

        toast.add({
          title: 'Erro no login com Google',
          description: message,
          color: 'error'
        })

        return
      }

      toast.add({
        title: 'Login com Google realizado!',
        color: 'success'
      })

      await navigateTo('/dashboard')
    } finally {
      loading.value = false
    }
  }

  return {
    isLightTheme,
    email,
    password,
    loading,
    showPassword,
    errors,
    isFormValid,
    validateField,
    registerWithEmail,
    registerWithGoogle
  }
}
