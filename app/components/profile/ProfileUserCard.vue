<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  photoUrl?: string | null
  name: string
  email?: string | null
  initial: string
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
  <section
    class="relative overflow-hidden flex flex-col items-center p-8 rounded-[2rem] border shadow-2xl transition-colors bg-[#1A2132] border-[#262E42]"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,209,197,0.08),_transparent_55%)]"
    />

    <div
      class="relative z-10 w-24 h-24 rounded-full border-4 border-[#4FD1C5] flex items-center justify-center overflow-hidden mb-6 bg-[#1E2A3D]"
    >
      <img
        v-if="photoUrl && !avatarLoadError"
        :src="photoUrl"
        alt="Foto de perfil"
        class="w-full h-full object-cover"
        @error="avatarLoadError = true"
      />
      <span
        v-else
        class="text-4xl font-black text-[#EDEFF4]"
      >
        {{ initial }}
      </span>
    </div>

    <div class="relative z-10 text-center space-y-2">
      <h2 class="text-2xl font-black">
        {{ name }}
      </h2>
      <p
        class="max-w-[280px] mx-auto px-1 text-xs sm:text-sm font-semibold tracking-[0.08em] break-all text-[#8A93A6]"
      >
        {{ email || '--' }}
      </p>
    </div>
  </section>
</template>