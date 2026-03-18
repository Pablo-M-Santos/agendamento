<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'

const props = defineProps<{
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

const avatarLoadError = ref(false)

watch(
  () => props.photoUrl,
  () => {
    avatarLoadError.value = false
  }
)
</script>

<template>
  <div class="relative mb-6 h-[56px] flex items-center justify-center">
    <button
      class="absolute left-0 p-2 rounded-xl transition"
      :class="props.isLightTheme ? 'hover:bg-[#E8F1FF]' : 'hover:bg-white/10'"
      :aria-label="props.openSidebarLabel"
      @click="emit('openSidebar')"
    >
      <Bars3Icon class="w-7 h-7" />
    </button>

    <div class="text-center px-12">
      <p
        class="text-base font-black truncate"
        :class="props.isLightTheme ? 'text-[#0B1F3A]' : 'text-white'"
      >
        {{ props.greeting }}
      </p>
    </div>

    <NuxtLink
      to="/profile"
      class="absolute right-0 w-11 h-11 rounded-[50%] overflow-hidden border flex items-center justify-center hover:scale-105 transition"
      :class="props.isLightTheme ? 'border-[#D8E7FF] bg-white' : 'border-white/20 bg-white/10'"
      :aria-label="props.goProfileLabel"
    >
      <img
        v-if="props.photoUrl && !avatarLoadError"
        :src="props.photoUrl"
        alt="Foto do usuario"
        class="w-full h-full object-cover"
        @error="avatarLoadError = true"
      />
      <span
        v-else
        class="text-sm font-black"
        :class="props.isLightTheme ? 'text-[#003D7A]' : 'text-white'"
      >
        {{ props.userInitial }}
      </span>
    </NuxtLink>
  </div>
</template>
