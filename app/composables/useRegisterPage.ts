import { computed, reactive, ref } from 'vue'
import { validarEmail, validarSenha } from '~/utils/validacao'

export const useRegisterPage = () => {
  const { loginWithGoogle: authLoginWithGoogle } = useAuth()
  const toast = useToast()
  const { t } = useAppI18n()
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const showPassword = ref(false)

  const errors = reactive({
    email: '',
    password: ''
  })

  const validateField = (field: 'email' | 'password') => {
    if (field === 'email') {
      if (!email.value) {
        errors.email = t('auth.emailRequired')
      } else if (!validarEmail(email.value)) {
        errors.email = t('auth.emailInvalid')
      } else {
        errors.email = ''
      }
    }

    if (field === 'password') {
      if (!password.value) {
        errors.password = t('auth.passwordRequired')
      } else if (!validarSenha(password.value)) {
        errors.password = t('auth.passwordMin')
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
        title: t('auth.registerSuccess'),
        description: response.message,
        color: 'success'
      })

      email.value = ''
      password.value = ''

      await navigateTo('/')
    } catch (error: unknown) {
      const err = error as { data?: { statusMessage?: string } }
      const message = err.data?.statusMessage || t('auth.registerErrorGeneric')

      toast.add({
        title: t('auth.registerError'),
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
        let message = t('auth.tryAgain')

        switch (result.code) {
          case 'auth/account-exists-with-different-credential':
            message = t('auth.googleOnlyAccount')
            break
          case 'auth/popup-closed-by-user':
            message = t('auth.popupClosed')
            break
          case 'auth/too-many-requests':
            message = t('auth.loginErrorTooManyRequests')
            break
        }

        toast.add({
          title: t('auth.loginError'),
          description: message,
          color: 'error'
        })

        return
      }

      toast.add({
        title: t('auth.registerGoogleSuccess'),
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
