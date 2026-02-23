<script setup>
import { HomeIcon, CalendarDaysIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path) => route.path === path
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- HEADER -->
    <header class="h-16 bg-black text-white flex items-center px-6">Header</header>

    <!-- CONTEÚDO -->
    <main class="flex-1 p-6">
      <slot />
    </main>

    <!-- FOOTER -->
    <footer class="h-14 bg-black text-white flex items-center justify-center">Footer</footer>
  </div>
</template>
