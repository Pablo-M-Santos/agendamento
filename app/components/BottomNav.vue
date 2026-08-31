<script setup>
import { HomeIcon, CalendarDaysIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => route.path === path
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 px-6 py-3 flex justify-between items-center border-t transition-colors bg-[#0B2F66] border-white/15">
    <!-- Dashboard -->
    <NuxtLink
      to="/dashboard"
      class="flex flex-col items-center text-xs font-medium transition"
      :class="
        isActive('/dashboard')
          ? 'text-white'
          : 'text-white/60'
      "
    >
      <HomeIcon class="w-6 h-6 mb-1" />
      Dashboard
    </NuxtLink>

    <!-- Agenda -->
    <NuxtLink
      to="/schedule"
      class="flex flex-col items-center text-xs font-medium transition"
      :class="
        isActive('/schedule')
          ? 'text-white'
          : 'text-white/60'
      "
    >
      <CalendarDaysIcon class="w-6 h-6 mb-1" />
      Agenda
    </NuxtLink>

    <!-- Perfil -->
    <NuxtLink
      to="/profile"
      class="flex flex-col items-center text-xs font-medium transition"
      :class="
        isActive('/profile')
          ? 'text-white'
          : 'text-white/60'
      "
    >
      <UserIcon class="w-6 h-6 mb-1" />
      Perfil
    </NuxtLink>
  </nav>
</template>
