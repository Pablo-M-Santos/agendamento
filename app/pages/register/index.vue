<script setup lang="ts">
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'
import type { FirebaseError } from 'firebase/app'

const { $auth } = useNuxtApp()
const { loginWithGoogle: authLoginWithGoogle } = useAuth()
const { settings } = useUserSettings()
const toast = useToast()
const isLightTheme = computed(() => settings.value.theme === 'light')

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
      description: 'Verifique seu email 📩',
      color: 'success'
    })

    email.value = ''
    password.value = ''

    navigateTo('/')
  } catch (error: unknown) {
    const err = error as FirebaseError
    let message = 'Não foi possível concluir seu cadastro. Tente novamente.'

    switch (err?.code) {
      case 'auth/email-already-in-use':
        message = 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.'
        break
      case 'auth/invalid-email':
        message = 'Email inválido.'
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
  <div
    class="h-dvh flex justify-center overflow-hidden transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <form class="w-full max-w-md text-center px-6 pt-20" @submit.prevent="registerWithEmail">
      <img src="/logo.png" alt="Logo" class="w-20 mx-auto mb-4" />

      <h1 class="text-3xl font-bold" :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'">
        Criar Conta
      </h1>
      <p class="mb-10" :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-gray-300'">
        Preencha os dados para se cadastrar
      </p>

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
        autocomplete="new-password"
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

      <p v-if="errors.password" class="text-red-400 text-sm mb-4 text-left">
        {{ errors.password }}
      </p>

      <UButton
        block
        type="submit"
        size="xl"
        :loading="loading"
        :disabled="!isFormValid || loading"
        class="mb-4 bg-[#0063C7] text-white transition-all duration-200 ease-in-out hover:bg-[#0057B0] active:bg-[#004A96] focus:ring-0 disabled:opacity-100 disabled:bg-[#0063C7] disabled:cursor-not-allowed"
      >
        Cadastrar
      </UButton>

      <NuxtLink
        to="/"
        class="block text-sm hover:underline mb-6"
        :class="isLightTheme ? 'text-[#003D7A]' : 'text-white'"
      >
        Já tenho uma conta
      </NuxtLink>

      <UButton
        block
        variant="outline"
        type="button"
        size="xl"
        class="relative mb-3 transition-all duration-200 ease-in-out focus:ring-0"
        :class="
          isLightTheme
            ? 'bg-white border-[#D8E7FF] hover:bg-[#F7FAFF] active:bg-[#E8F1FF]'
            : 'bg-[#D8D8D8] hover:bg-[#CFCFCF] active:bg-[#BEBEBE]'
        "
        @click="loginWithGoogle"
      >
        <span class="absolute left-8 flex items-center">
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
            alt="Google"
            class="w-5 h-5"
          />
        </span>

        <span class="mx-auto" :class="isLightTheme ? 'text-[#003D7A]' : 'text-[#0063C7]'">
          Cadastrar com Google
        </span>
      </UButton>
    </form>
  </div>
</template>
