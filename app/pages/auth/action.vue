<script setup lang="ts">
import { applyActionCode } from 'firebase/auth'

const { $auth } = useNuxtApp()
const route = useRoute()
const { settings } = useUserSettings()
const isLightTheme = computed(() => settings.value.theme === 'light')

const loading = ref(true)
const message = ref('Processando ação...')
const hasError = ref(false)

const mode = computed(() => String(route.query.mode || ''))
const oobCode = computed(() => String(route.query.oobCode || ''))

const redirectToResetPassword = async () => {
  await navigateTo({
    path: '/reset-password',
    query: {
      oobCode: oobCode.value
    }
  })
}

const verifyEmailAction = async () => {
  await applyActionCode($auth, oobCode.value)

  message.value = 'E-mail verificado com sucesso! Redirecionando...'

  setTimeout(() => {
    navigateTo('/dashboard')
  }, 1000)
}

onMounted(async () => {
  if (!mode.value || !oobCode.value) {
    hasError.value = true
    message.value = 'Link inválido ou incompleto.'
    loading.value = false
    return
  }

  try {
    if (mode.value === 'resetPassword') {
      await redirectToResetPassword()
      return
    }

    if (mode.value === 'verifyEmail') {
      await verifyEmailAction()
      return
    }

    hasError.value = true
    message.value = 'Tipo de ação não suportado por este link.'
  } catch {
    hasError.value = true
    message.value = 'Não foi possível concluir esta ação. Tente novamente.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div
    class="h-dvh flex items-center justify-center px-6 transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <div class="text-center">
      <p v-if="loading" :class="isLightTheme ? 'text-[#003D7A]' : 'text-white'">
        Processando link...
      </p>
      <p v-else :class="hasError ? 'text-red-300' : 'text-green-300'">{{ message }}</p>
    </div>
  </div>
</template>
