import { computed, reactive, ref } from 'vue'
import { signOut } from 'firebase/auth'

export const useLoginPage = () => {
  const { $auth } = useNuxtApp()
  const {
    loginWithEmail: authLoginWithEmail,
    loginWithGoogle: authLoginWithGoogle,
    sendSetPasswordEmail: authSendSetPasswordEmail
  } = useAuth()
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

  const handleSetPasswordByEmail = async () => {
    const result = await authSendSetPasswordEmail(email.value.trim())

    if (!result.ok) {
      toast.add({
        title: 'Erro ao enviar e-mail',
        description: 'Nao foi possivel enviar agora. Tente novamente em instantes.',
        color: 'error'
      })
      return
    }

    toast.add({
      title: 'Confira seu e-mail',
      description:
        'Enviamos os proximos passos para definir sua senha. Veja tambem a caixa de spam ou entre com Google.',
      color: 'warning'
    })
  }

  const loginWithEmail = async () => {
    validateField('email')
    validateField('password')

    if (!isFormValid.value) return

    try {
      loading.value = true
      const result = await authLoginWithEmail(email.value, password.value)

      if (!result.ok) {
        let message = 'Tente novamente.'

        switch (result.code) {
          case 'auth/google-only-account':
          case 'auth/invalid-login':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            await handleSetPasswordByEmail()
            return
          case 'auth/invalid-email':
            message = 'Email invalido.'
            break
          case 'auth/too-many-requests':
            message = 'Muitas tentativas. Tente mais tarde.'
            break
        }

        toast.add({
          title: 'Erro no login',
          description: message,
          color: 'error'
        })

        return
      }

      if (!$auth.currentUser?.emailVerified) {
        toast.add({
          title: 'Email nao verificado',
          description: 'Verifique seu email antes de entrar',
          color: 'warning'
        })

        await signOut($auth)
        return
      }

      toast.add({
        title: 'Login realizado com sucesso!',
        color: 'success'
      })

      await navigateTo('/dashboard')
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
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
    loginWithEmail,
    loginWithGoogle
  }
}
