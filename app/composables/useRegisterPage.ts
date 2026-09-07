import { computed, reactive, ref } from 'vue'

export const useRegisterPage = () => {
  const { loginWithGoogle: authLoginWithGoogle } = useAuth()
  const toast = useToast()
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

      const response = await $fetch<{ ok: boolean; message: string; emailSent: boolean }>('/api/auth/register', {
        method: 'POST',
        body: {
          email: email.value.trim(),
          password: password.value
        }
      })

      toast.add({
        title: 'Cadastro realizado com sucesso!',
        description: response.message,
        color: 'success'
      })

      email.value = ''
      password.value = ''

      await navigateTo('/')
    } catch (error: unknown) {
      const err = error as { data?: { statusMessage?: string } }
      const message = err.data?.statusMessage || 'Nao foi possivel concluir seu cadastro. Tente novamente.'

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
