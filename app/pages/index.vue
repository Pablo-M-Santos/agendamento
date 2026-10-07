<script setup lang="ts">
import LandingHeader from '~/components/landing/LandingHeader.vue'
import LandingHero from '~/components/landing/LandingHero.vue'
import LandingFeatures from '~/components/landing/LandingFeatures.vue'
</script>

<template>
  <div
    class="page bg-[#080D14] text-slate-100 min-h-dvh font-sans selection:bg-emerald-400 selection:text-slate-950 overflow-clip"
  >
    <LandingHeader />

    <LandingHero />

    <LandingFeatures />
  </div>
</template>
