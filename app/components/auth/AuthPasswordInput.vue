<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    show: boolean
    placeholder: string
    autocomplete: string
    inputClass?: string
    color?: 'error' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'info'
  }>(),
  {
    inputClass: 'w-full mb-4',
    color: 'neutral'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:show': [value: boolean]
  blur: [event: FocusEvent]
}>()
</script>

<template>
  <UInput
    :model-value="props.modelValue"
    :type="props.show ? 'text' : 'password'"
    :autocomplete="props.autocomplete"
    icon="i-heroicons-lock-closed"
    :placeholder="props.placeholder"
    size="xl"
    :class="props.inputClass"
    :color="props.color"
    @update:model-value="emit('update:modelValue', String($event))"
    @blur="emit('blur', $event as FocusEvent)"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        type="button"
        size="sm"
        :icon="props.show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        @click="emit('update:show', !props.show)"
      />
    </template>
  </UInput>
</template>
