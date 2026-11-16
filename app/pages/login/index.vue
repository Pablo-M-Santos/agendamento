<script setup lang="ts">
import { computed } from 'vue'

const {
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
} = useLoginPage()

const emailId = 'login-email'
const passwordId = 'login-password'
const emailErrorId = 'login-email-error'
const passwordErrorId = 'login-password-error'

const emailDescribedBy = computed(() => (errors.email ? emailErrorId : undefined))
</script>

<template>
  <AuthPageShell title="Entrar" subtitle="Acesse sua conta AgendaPro">
    <form novalidate @submit.prevent="loginWithEmail">
      <div class="mb-3 sm:mb-4">
        <label
          :for="emailId"
          class="mb-1.5 block text-xs font-semibold text-[var(--color-text-primary)] sm:mb-2 sm:text-sm"
        >
          Email
        </label>
        <input
          :id="emailId"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="seu@email.com"
          :aria-describedby="emailDescribedBy"
          :aria-invalid="!!errors.email"
          class="auth-input-base"
          :class="{ error: errors.email }"
          @blur="validateField('email')"
        />
        <p v-if="errors.email" :id="emailErrorId" class="auth-error-text" role="alert">
          {{ errors.email }}
        </p>
      </div>

      <div class="mb-4 sm:mb-6">
        <label
          :for="passwordId"
          class="mb-1.5 block text-xs font-semibold text-[var(--color-text-primary)] sm:mb-2 sm:text-sm"
        >
          Senha
        </label>
        <AuthPasswordInput
          :id="passwordId"
          v-model="password"
          :show="showPassword"
          placeholder="Digite sua senha"
          autocomplete="current-password"
          :color="errors.password ? 'error' : 'neutral'"
          :error-id="passwordErrorId"
          @update:show="showPassword = $event"
          @blur="validateField('password')"
        />
        <p v-if="errors.password" :id="passwordErrorId" class="auth-error-text" role="alert">
          {{ errors.password }}
        </p>
      </div>

      <p v-if="isRateLimited" class="mb-3 text-center text-xs text-amber-400" role="status">
        Muitas tentativas. Tente novamente em {{ cooldownSeconds }}s.
      </p>

      <button
        type="submit"
        :disabled="!isFormValid || loading || isRateLimited"
        class="auth-button-primary flex items-center justify-center gap-2"
      >
        <span>{{ loading ? 'Entrando...' : 'Entrar' }}</span>
      </button>
    </form>

    <div class="auth-divider">
      <span class="text-xs text-[var(--color-text-tertiary)] sm:text-sm">ou continue com</span>
    </div>

    <button
      type="button"
      :disabled="loading"
      class="auth-button-google flex items-center justify-center gap-3"
      @click="loginWithGoogle"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.04A7.96 7.96 0 015.42 12c0-.71.12-1.4.32-2.04V7.12H2.18A11 11 0 001 12c0 1.77.42 3.44 1.18 4.88l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.43c1.62 0 3.08.56 4.23 1.67l3.16-3.16C17.45 2.47 14.97 1.5 12 1.5a11 11 0 00-9.82 5.62l3.66 2.84C6.71 7.36 9.14 5.43 12 5.43z"
        />
      </svg>
      <span>Entrar com Google</span>
    </button>

    <div class="mt-4 text-center sm:mt-6">
      <NuxtLink to="/register" class="auth-link">
        Ainda não tem uma conta?
        <span class="font-bold text-[var(--color-accent-primary)]">Criar conta</span>
      </NuxtLink>
    </div>
  </AuthPageShell>
</template>
