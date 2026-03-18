<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isLightTheme: boolean
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
    class="relative overflow-hidden flex flex-col items-center p-8 rounded-[2rem] border shadow-2xl transition-colors"
    :class="isLightTheme ? 'bg-white border-[#D8E7FF]' : 'bg-white/10 border-white/10'"
  >
    <div
      class="pointer-events-none absolute inset-0"
      :class="
        isLightTheme
          ? 'bg-[radial-gradient(circle_at_top,_rgba(79,156,255,0.18),_transparent_55%)]'
          : 'bg-[radial-gradient(circle_at_top,_rgba(181,255,246,0.15),_transparent_55%)]'
      "
    />

    <div
      class="relative z-10 w-24 h-24 rounded-full border-4 border-[#00D3B8] flex items-center justify-center overflow-hidden mb-6"
      :class="isLightTheme ? 'bg-[#E8F1FF]' : 'bg-[#0B2C54]'"
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
        class="text-4xl font-black"
        :class="isLightTheme ? 'text-[#003D7A]' : 'text-white'"
      >
        {{ initial }}
      </span>
    </div>

    <div class="relative z-10 text-center space-y-2">
      <h2 class="text-2xl font-black">
        {{ name }}
      </h2>
      <p
        class="max-w-[280px] mx-auto px-1 text-xs sm:text-sm font-semibold tracking-[0.08em] break-all"
        :class="isLightTheme ? 'text-[#5B6B8A]' : 'text-white/60'"
      >
        {{ email || '--' }}
      </p>
    </div>
  </section>
</template>
