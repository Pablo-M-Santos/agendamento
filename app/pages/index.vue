<script setup lang="ts">
const {
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
} = useLoginPage()
</script>

<template>
  <AuthPageShell :is-light-theme="isLightTheme" title="Entrar" subtitle="Acesse sua conta">
    <form @submit.prevent="loginWithEmail">
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

      <AuthPasswordInput
        v-model="password"
        :show="showPassword"
        placeholder="Digite sua senha"
        autocomplete="current-password"
        input-class="w-full mb-5"
        :color="errors.password ? 'error' : 'neutral'"
        @update:show="showPassword = $event"
        @blur="validateField('password')"
      />

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
        Entrar
      </UButton>

      <NuxtLink
        to="/register"
        class="block text-sm hover:underline mb-6"
        :class="isLightTheme ? 'text-[#003D7A]' : 'text-white'"
      >
        Quero me cadastrar
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
          Entrar com Google
        </span>
      </UButton>
    </form>
  </AuthPageShell>
</template>
