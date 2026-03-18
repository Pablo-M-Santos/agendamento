import {
  confirmPasswordReset,
  signInWithEmailAndPassword,
  verifyPasswordResetCode
} from 'firebase/auth'
import { computed, onMounted, ref } from 'vue'

export const useResetPasswordPage = () => {
  const { $auth } = useNuxtApp()
  const route = useRoute()
  const toast = useToast()
  const { settings } = useUserSettings()

  const isLightTheme = computed(() => settings.value.theme === 'light')
  const loading = ref(true)
  const submitting = ref(false)
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const error = ref('')
  const success = ref(false)

  const oobCode = computed(() => String(route.query.oobCode || ''))

  const isFormValid = computed(() => {
    return password.value.length >= 6 && password.value === confirmPassword.value
  })

  onMounted(async () => {
    if (!oobCode.value) {
      error.value = 'Link invalido ou ja utilizado. Solicite um novo link de redefinicao.'
      loading.value = false
      return
    }

    try {
      const resultEmail = await verifyPasswordResetCode($auth, oobCode.value)
      email.value = resultEmail
    } catch {
      error.value = 'Link expirado ou invalido.'
    } finally {
      loading.value = false
    }
  })

  const submit = async () => {
    if (!isFormValid.value || !oobCode.value) return

    try {
      submitting.value = true
      await confirmPasswordReset($auth, oobCode.value, password.value)
      await signInWithEmailAndPassword($auth, email.value, password.value)

      success.value = true

      toast.add({
        title: 'Senha definida com sucesso!',
        description: 'Redirecionando para o dashboard...',
        color: 'success'
      })

      setTimeout(() => {
        void navigateTo('/dashboard')
      }, 1200)
    } catch {
      toast.add({
        title: 'Erro ao redefinir senha',
        description: 'Link expirado ou invalido. Solicite um novo link.',
        color: 'error'
      })
    } finally {
      submitting.value = false
    }
  }

  return {
    isLightTheme,
    loading,
    submitting,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    error,
    success,
    isFormValid,
    submit
  }
}
