<script setup lang="ts">
import { signOut } from 'firebase/auth'

const { $auth } = useNuxtApp()
const {
  loginWithEmail: authLoginWithEmail,
  loginWithGoogle: authLoginWithGoogle,
  sendSetPasswordEmail: authSendSetPasswordEmail
} = useAuth()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const show = ref(false)

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
      errors.email = 'Email é obrigatório'
    } else if (!validateEmail(email.value)) {
      errors.email = 'Digite um email válido'
    } else {
      errors.email = ''
    }
  }

  if (field === 'password') {
    if (!password.value) {
      errors.password = 'Senha é obrigatória'
    } else if (password.value.length < 6) {
      errors.password = 'Mínimo de 6 caracteres'
    } else {
      errors.password = ''
    }
  }
}

const isFormValid = computed(() => {
  return email.value && password.value && !errors.email && !errors.password
})

const handleSetPasswordByEmail = async () => {
  const result = await authSendSetPasswordEmail(email.value.trim())

  if (!result.ok) {
    toast.add({
      title: 'Erro ao enviar e-mail',
      description: 'Não foi possível enviar agora. Tente novamente em instantes.',
      color: 'error'
    })

    return
  }

  toast.add({
    title: 'Confira seu e-mail',
    description:
      'Enviamos os próximos passos para definir sua senha. Veja também a caixa de spam ou entre com Google.',
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
          await handleSetPasswordByEmail()

          return
        case 'auth/invalid-login':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          await handleSetPasswordByEmail()

          return
        case 'auth/invalid-email':
          message = 'Email inválido.'
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
        title: 'Email não verificado',
        description: 'Verifique seu email antes de entrar 📩',
        color: 'warning'
      })

      await signOut($auth)
      return
    }

    toast.add({
      title: 'Login realizado com sucesso!',
      color: 'success'
    })

    navigateTo('/dashboard')
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
          message = 'Este email já está cadastrado com senha. Entre com email e senha.'
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

    navigateTo('/dashboard')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="h-dvh bg-[#003D7A] flex justify-center overflow-hidden">
    <form class="w-full max-w-md text-center px-6 pt-20" @submit.prevent="loginWithEmail">
      <img src="/logo.png" alt="Logo" class="w-20 mx-auto mb-4" />

      <h1 class="text-3xl font-bold text-white">Entrar</h1>
      <p class="text-gray-300 mb-10">Acesse sua conta</p>

      <UInput
        v-model="email"
        type="email"
        autocomplete="email"
        icon="i-heroicons-envelope"
        placeholder="Digite seu email"
        size="xl"
        class="w-full mb-5"
        :color="errors.email ? 'error' : 'neutral'"
        @blur="validateField('email')"
      />

      <p v-if="errors.email" class="text-red-400 text-sm mb-4 text-left">
        {{ errors.email }}
      </p>

      <UInput
        v-model="password"
        :type="show ? 'text' : 'password'"
        autocomplete="current-password"
        icon="i-heroicons-lock-closed"
        placeholder="Digite sua senha"
        size="xl"
        class="w-full mb-5"
        :color="errors.password ? 'error' : 'neutral'"
        @blur="validateField('password')"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            @click="show = !show"
          />
        </template>
      </UInput>

      <UButton
        block
        type="submit"
        size="xl"
        :loading="loading"
        :disabled="!isFormValid || loading"
        class="mb-4 bg-[#0063C7] text-white transition-all duration-200 ease-in-out hover:bg-[#0057B0] active:bg-[#004A96] focus:ring-0 disabled:opacity-100 disabled:bg-[#0063C7] disabled:cursor-not-allowed"
      >
        Entrar
      </UButton>

      <NuxtLink to="/register" class="block text-sm text-primary hover:underline mb-6 text-white">
        Quero me cadastrar
      </NuxtLink>

      <UButton
        block
        variant="outline"
        type="button"
        size="xl"
        class="relative mb-3 bg-[#D8D8D8] transition-all duration-200 ease-in-out hover:bg-[#CFCFCF] active:bg-[#BEBEBE] focus:ring-0"
        @click="loginWithGoogle"
      >
        <span class="absolute left-8 flex items-center">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
            alt="Google"
            class="w-5 h-5"
          />
        </span>

        <span class="mx-auto text-[#0063C7]"> Entrar com Google </span>
      </UButton>
    </form>
  </div>
</template>
