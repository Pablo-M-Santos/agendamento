<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Produtos', href: '#produtos' },
  { name: 'Soluções', href: '#solucoes' },
  { name: 'Recursos', href: '#recursos' },
  { name: 'Blog', href: '#blog' },
  { name: 'Preços', href: '#precos' }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-[#080D14]/85 backdrop-blur-xl border-b border-white/5 transition-all duration-300"
  >
    <div
      class="max-w-[1560px] mx-auto px-5 sm:px-8 lg:px-20 h-20 flex items-center justify-between"
    >
      <!-- Logo -->
      <a href="#" class="flex items-center gap-3 group shrink-0">
        <div
          class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105"
        >
          <img src="/logo.png" alt="AgendaPro" class="w-full h-full object-contain" />
        </div>
        <span class="text-lg font-bold tracking-tight text-white">
          Agenda<span class="text-emerald-400">Pro</span>
        </span>
      </a>

      <!-- Desktop Nav (Agora quebra em lg: 1024px para evitar colisão em 825px) -->
      <nav class="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a
          v-for="link in navLinks"
          :key="link.name"
          :href="link.href"
          class="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-400 hover:after:w-full after:transition-all"
        >
          {{ link.name }}
        </a>
      </nav>

      <!-- Ações da Direita -->
      <div class="flex items-center gap-3 sm:gap-4 shrink-0">
        <NuxtLink
          to="/register"
          class="hidden sm:flex px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-400/20 hover:shadow-emerald-400/30 items-center gap-2 transform hover:-translate-y-0.5"
        >
          <span>Acessar Plataforma</span>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </NuxtLink>

        <!-- Botão Mobile (Visível abaixo de 1024px) -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Abrir menu"
        >
          <svg
            v-if="!isMobileMenuOpen"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menu Mobile Dropdown (Ativo abaixo de 1024px) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-show="isMobileMenuOpen"
        class="lg:hidden bg-[#080D14]/98 backdrop-blur-2xl border-b border-white/10 px-5 sm:px-12 pt-4 pb-6 space-y-4 shadow-2xl"
      >
        <nav class="flex flex-col space-y-1.5">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            @click="isMobileMenuOpen = false"
            class="text-slate-300 hover:text-white hover:bg-white/5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between"
          >
            <span>{{ link.name }}</span>
            <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </nav>
        <div class="pt-3 border-t border-white/10 flex flex-col gap-3">
          <NuxtLink
            to="/register"
            @click="isMobileMenuOpen = false"
            class="w-full py-3 rounded-xl font-bold text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-400/20 flex items-center justify-center gap-2"
          >
            <span>Acessar Plataforma</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>