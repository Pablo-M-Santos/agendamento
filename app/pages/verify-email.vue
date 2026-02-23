<script setup lang="ts">
import { applyActionCode } from 'firebase/auth'

const { $auth } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const oobCode = route.query.oobCode as string

  if (!oobCode) {
    error.value = 'Código inválido.'
    loading.value = false
    return
  }

  try {
    // Aplica o código
    await applyActionCode($auth, oobCode)

    // Espera o Firebase atualizar o estado do usuário
    await new Promise((resolve) => {
      const unsubscribe = $auth.onAuthStateChanged(async (user) => {
        if (user) {
          await user.reload()

          if (user.emailVerified) {
            unsubscribe()
            router.push('/dashboard')
          }
        } else {
          unsubscribe()
          router.push('/login')
        }
      })
    })
  } catch (err) {
    error.value = 'Link expirado ou inválido.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="loading">Verificando seu e-mail...</div>

    <div v-else-if="error">
      {{ error }}
    </div>
  </div>
</template>
