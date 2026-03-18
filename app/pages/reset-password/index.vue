<script setup lang="ts">
const {
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
} = useResetPasswordPage()
</script>

<template>
  <AuthPageShell
    :is-light-theme="isLightTheme"
    title="Definir senha"
    subtitle="Finalize o acesso com email e senha"
  >
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

      <AuthPasswordInput
        v-model="password"
        :show="showPassword"
        placeholder="Nova senha"
        autocomplete="new-password"
        input-class="w-full mb-4"
        @update:show="showPassword = $event"
      />

      <AuthPasswordInput
        v-model="confirmPassword"
        :show="showConfirmPassword"
        placeholder="Confirmar nova senha"
        autocomplete="new-password"
        input-class="w-full mb-2"
        @update:show="showConfirmPassword = $event"
      />

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
  </AuthPageShell>
</template>
