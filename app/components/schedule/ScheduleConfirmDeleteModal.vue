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
      class="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
    >
      <div class="bg-[#1B1B1B] p-8 rounded-3xl w-full max-w-sm border border-white/10">
        <h3 class="text-white text-xl font-black mb-6">{{ t('schedule.confirmDeleteTitle') }}</h3>

        <p class="text-white/70 mb-8">{{ t('schedule.confirmDeleteMessage') }}</p>

        <div class="flex gap-4">
          <button
            class="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold"
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
