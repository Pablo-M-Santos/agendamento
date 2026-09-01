<script setup lang="ts">
const { t } = useAppI18n()

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
    >
      <div
        class="p-8 rounded-3xl w-full max-w-sm border bg-[#1B1B1B] border-white/10 text-white"
      >
        <h3 class="text-xl font-black mb-6">{{ t('schedule.confirmDeleteTitle') }}</h3>

        <p class="mb-8 text-white/70">
          {{ t('schedule.confirmDeleteMessage') }}
        </p>

        <div class="flex gap-4">
          <button
            class="flex-1 py-3 rounded-xl font-bold bg-white/10 text-white"
            @click="emit('update:modelValue', false)"
          >
            {{ t('schedule.cancel') }}
          </button>

          <button
            class="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold"
            @click="emit('confirm')"
          >
            {{ t('schedule.delete') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
