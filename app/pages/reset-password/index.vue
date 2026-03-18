<script setup lang="ts">
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  signInWithEmailAndPassword
} from 'firebase/auth'

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
    error.value = 'Link inválido ou já utilizado. Solicite um novo link de redefinição.'
    loading.value = false
    return
  }

  try {
    const resultEmail = await verifyPasswordResetCode($auth, oobCode.value)
    email.value = resultEmail
  } catch {
    error.value = 'Link expirado ou inválido.'
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
      navigateTo('/dashboard')
    }, 1200)
  } catch {
    toast.add({
      title: 'Erro ao redefinir senha',
      description: 'Link expirado ou inválido. Solicite um novo link.',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div
    class="h-dvh flex justify-center overflow-hidden transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <div class="w-full max-w-md text-center px-6 pt-20">
      <img src="/logo.png" alt="Logo" class="w-20 mx-auto mb-4" />

      <h1 class="text-3xl font-bold" :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'">
        Definir senha
      </h1>
      <p class="mb-10" :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-gray-300'">
        Finalize o acesso com email e senha
      </p>

      <div v-if="loading" :class="isLightTheme ? 'text-[#003D7A]' : 'text-white'">
        Validando link...
      </div>

      <div v-else-if="error" class="text-red-300">
        {{ error }}
      </div>

      <div v-else-if="success" class="text-green-300">Senha atualizada com sucesso!</div>

      <form v-else class="text-left" @submit.prevent="submit">
        <p class="text-sm mb-4" :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-gray-300'">
          Conta: {{ email }}
        </p>

        <UInput
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          icon="i-heroicons-lock-closed"
          placeholder="Nova senha"
          size="xl"
          class="w-full mb-4"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              type="button"
              size="sm"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>

        <UInput
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          autocomplete="new-password"
          icon="i-heroicons-lock-closed"
          placeholder="Confirmar nova senha"
          size="xl"
          class="w-full mb-2"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              type="button"
              size="sm"
              :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </UInput>

        <p v-if="password && password.length < 6" class="text-red-300 text-sm mb-2">
          A senha deve ter no mínimo 6 caracteres.
        </p>
        <p
          v-else-if="confirmPassword && password !== confirmPassword"
          class="text-red-300 text-sm mb-2"
        >
          As senhas não conferem.
        </p>

        <UButton
          block
          type="submit"
          size="xl"
          :loading="submitting"
          :disabled="!isFormValid || submitting"
          class="mt-4 bg-[#0063C7] text-white transition-all duration-200 ease-in-out hover:bg-[#0057B0]"
        >
          Salvar nova senha
        </UButton>
      </form>
    </div>
  </div>
</template>
