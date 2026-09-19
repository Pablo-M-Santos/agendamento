import { computed, onUnmounted, reactive, ref } from 'vue'
import { signOut } from 'firebase/auth'
import { validarEmail, validarSenha } from '~/utils/validacao'

export const useLoginPage = () => {
  const { $auth } = useNuxtApp()
  const { loginWithEmail: authLoginWithEmail, loginWithGoogle: authLoginWithGoogle } = useAuth()
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

  const MAX_ATTEMPTS = 3
  const BASE_COOLDOWN_SEC = 5
  const MAX_COOLDOWN_SEC = 30

  const failedAttempts = ref(0)
  const cooldownSeconds = ref(0)
  let cooldownTimer: ReturnType<typeof setInterval> | null = null

  const isRateLimited = computed(() => cooldownSeconds.value > 0)

  const clearCooldown = () => {
    if (cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
    cooldownSeconds.value = 0
  }

  const startCooldown = () => {
    const overshoot = failedAttempts.value - MAX_ATTEMPTS + 1
    const duration = Math.min(
      BASE_COOLDOWN_SEC * 2 ** (overshoot - 1),
      MAX_COOLDOWN_SEC
    )
    cooldownSeconds.value = duration

    cooldownTimer = setInterval(() => {
      cooldownSeconds.value--
      if (cooldownSeconds.value <= 0) {
        clearCooldown()
        failedAttempts.value = 0
      }
    }, 1000)
  }

  onUnmounted(() => clearCooldown())

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

  const loginWithEmail = async () => {
    if (isRateLimited.value) {
      toast.add({
        title: t('auth.loginError'),
        description: t('auth.loginThrottled', { seconds: cooldownSeconds.value }),
        color: 'warning'
      })
      return
    }

    validateField('email')
    validateField('password')

    if (!isFormValid.value) return

    try {
      loading.value = true
      const result = await authLoginWithEmail(email.value, password.value)

      if (!result.ok) {
        failedAttempts.value++
        if (failedAttempts.value >= MAX_ATTEMPTS) {
          startCooldown()
        }

        let message = t('auth.tryAgain')

        switch (result.code) {
          case 'auth/google-only-account':
          case 'auth/invalid-login':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            message = t('auth.loginErrorInvalid')
            break
          case 'auth/invalid-email':
            message = t('auth.loginErrorInvalidEmail')
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

      if (!$auth.currentUser?.emailVerified) {
        toast.add({
          title: t('auth.loginError'),
          description: t('auth.emailNotVerified'),
          color: 'warning'
        })

        await signOut($auth)
        return
      }

      clearCooldown()
      failedAttempts.value = 0

      toast.add({
        title: t('auth.loginSuccess'),
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
        title: t('auth.loginSuccess'),
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
    isRateLimited,
    cooldownSeconds,
    validateField,
    loginWithEmail,
    loginWithGoogle
  }
}
