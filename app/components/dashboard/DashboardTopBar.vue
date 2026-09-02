<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'

const props = defineProps<{
  greeting: string
  photoUrl?: string | null
  userInitial: string
  openSidebarLabel: string
  goProfileLabel: string
}>()

const emit = defineEmits<{
  openSidebar: []
}>()

const avatarLoadError = ref(false)

watch(
  () => props.photoUrl,
  () => {
    avatarLoadError.value = false
  }
)
</script>

<template>
  <div class="relative mb-6 lg:mb-10 h-[56px] flex items-center justify-center">
    <button
      class="absolute left-0 p-2 rounded-xl transition hover:bg-white/5"
      :aria-label="props.openSidebarLabel"
      @click="emit('openSidebar')"
    >
      <Bars3Icon class="w-7 h-7 text-[#EDEFF4]" />
    </button>

    <div class="text-center px-12">
      <p class="text-base sm:text-lg lg:text-xl font-black truncate text-[#EDEFF4]">
        {{ props.greeting }}
      </p>
    </div>

    <NuxtLink
      to="/profile"
      class="absolute right-0 w-11 h-11 lg:w-12 lg:h-12 rounded-[50%] overflow-hidden border border-[#262E42] bg-[#1E2A3D] flex items-center justify-center hover:scale-105 transition"
      :aria-label="props.goProfileLabel"
    >
      <img
        v-if="props.photoUrl && !avatarLoadError"
        :src="props.photoUrl"
        alt="Foto do usuario"
        class="w-full h-full object-cover"
        @error="avatarLoadError = true"
      />
      <span v-else class="text-sm font-black text-[#4FD1C5]">
        {{ props.userInitial }}
      </span>
    </NuxtLink>
  </div>
</template>
