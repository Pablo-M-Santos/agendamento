<script setup>
import { HomeIcon, CalendarDaysIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => route.path === path
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 px-6 py-3 flex justify-between items-center border-t bg-[#002e29] border-[rgba(255,255,255,0.1)]">
    <!-- Dashboard -->
    <NuxtLink
      to="/dashboard"
      class="flex flex-col items-center text-xs font-medium transition"
      :class="
        isActive('/dashboard')
          ? 'text-[#4da69c]'
          : 'text-[#80bfb8]/70'
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
          ? 'text-[#4da69c]'
          : 'text-[#80bfb8]/70'
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
          ? 'text-[#4da69c]'
          : 'text-[#80bfb8]/70'
      "
    >
      <UserIcon class="w-6 h-6 mb-1" />
      Perfil
    </NuxtLink>
  </nav>
</template>
