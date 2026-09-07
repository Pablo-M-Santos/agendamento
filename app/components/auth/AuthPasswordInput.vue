<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    show: boolean
    placeholder: string
    autocomplete: string
    inputClass?: string
    color?: 'error' | 'neutral'
    id?: string
    errorId?: string
  }>(),
  {
    inputClass: '',
    color: 'neutral',
    id: () => `password-${Math.random().toString(36).substring(2, 9)}`,
    errorId: () => `password-error-${Math.random().toString(36).substring(2, 9)}`
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:show': [value: boolean]
  blur: [event: FocusEvent]
}>()

const inputType = computed(() => (props.show ? 'text' : 'password'))

const ariaDescribedBy = computed(() => {
  if (props.color === 'error' && props.errorId) {
    return props.errorId
  }
  return undefined
})
</script>

<template>
  <div class="relative">
    <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
      <svg
        class="w-5 h-5 transition-colors duration-200"
        :class="color === 'error' ? 'text-[var(--color-auth-error)]' : 'text-[var(--color-text-tertiary)]'"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    </div>

    <input
      :id="id"
      :type="inputType"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="color === 'error'"
      class="auth-input-base has-toggle"
      :class="[inputClass, { error: color === 'error' }]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="emit('blur', $event)"
    />

    <button
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-lg transition-colors duration-200 hover:bg-[var(--color-bg-tertiary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] z-10"
      :aria-label="show ? 'Ocultar senha' : 'Mostrar senha'"
      :aria-pressed="show"
      tabindex="0"
      @click="emit('update:show', !show)"
    >
      <svg
        v-if="show"
        class="w-5 h-5 text-[var(--color-text-secondary)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
      <svg
        v-else
        class="w-5 h-5 text-[var(--color-text-secondary)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </button>
  </div>
</template>
