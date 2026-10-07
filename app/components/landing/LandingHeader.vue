<script setup lang="ts"></script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-[#080D14]/80 backdrop-blur-md border-b border-white/5"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1.5"
        >
          <img src="/logo.png" alt="CashFlow" class="w-full h-full object-contain" />
        </div>
        <span class="text-lg font-bold tracking-tight text-white">
          Cash<span class="text-emerald-400">Flow</span>
        </span>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#produtos" class="hover:text-white transition-colors">Produtos</a>
        <a href="#solucoes" class="hover:text-white transition-colors">Soluções</a>
        <a href="#recursos" class="hover:text-white transition-colors">Recursos</a>
        <a href="#blog" class="hover:text-white transition-colors">Blog</a>
        <a href="#precos" class="hover:text-white transition-colors">Preços</a>
      </nav>

      <div class="flex items-center gap-4">
        <NuxtLink
          to="/register"
          class="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-400/20 flex items-center gap-2"
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
      </div>
    </div>
  </header>
</template>
