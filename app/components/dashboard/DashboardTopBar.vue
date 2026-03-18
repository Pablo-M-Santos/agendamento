<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline'

defineProps<{
  isLightTheme: boolean
  greeting: string
  photoUrl?: string | null
  userInitial: string
  openSidebarLabel: string
  goProfileLabel: string
}>()

const emit = defineEmits<{
  openSidebar: []
}>()
</script>

<template>
  <div class="relative mb-6 h-[56px] flex items-center justify-center">
    <button
      class="absolute left-0 p-2 rounded-xl transition"
      :class="isLightTheme ? 'hover:bg-[#E8F1FF]' : 'hover:bg-white/10'"
      :aria-label="openSidebarLabel"
      @click="emit('openSidebar')"
    >
      <Bars3Icon class="w-7 h-7" />
    </button>

    <div class="text-center px-12">
      <p
        class="text-base font-black truncate"
        :class="isLightTheme ? 'text-[#0B1F3A]' : 'text-white'"
      >
        {{ greeting }}
      </p>
    </div>

    <NuxtLink
      to="/profile"
      class="absolute right-0 w-11 h-11 rounded-[50%] overflow-hidden border flex items-center justify-center hover:scale-105 transition"
      :class="isLightTheme ? 'border-[#D8E7FF] bg-white' : 'border-white/20 bg-white/10'"
      :aria-label="goProfileLabel"
    >
      <img
        v-if="photoUrl"
        :src="photoUrl"
        alt="Foto do usuario"
        class="w-full h-full object-cover"
      />
      <span
        v-else
        class="text-sm font-black"
        :class="isLightTheme ? 'text-[#003D7A]' : 'text-white'"
      >
        {{ userInitial }}
      </span>
    </NuxtLink>
  </div>
</template>
