<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const activeSectionId = ref('')
const toggleRef = ref<HTMLButtonElement | null>(null)

const navLinks = [
  { name: 'Produtos', href: '#home' },
  { name: 'Funcionalidades', href: '#funcionalidades' },
  { name: 'Recursos', href: '#recursos' },
  { name: 'Blog', href: '#blog' },
  { name: 'Preços', href: '#precos' }
]

const idOf = (href: string) => href.slice(1)
const isActive = (href: string) => activeSectionId.value === idOf(href)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMenu = (returnFocus = false) => {
  if (!isMobileMenuOpen.value) return
  isMobileMenuOpen.value = false
  if (returnFocus) toggleRef.value?.focus()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu(true)
}

const handleResize = () => {
  if (window.innerWidth >= 1024) closeMenu()
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 8
}

let spyObserver: IntersectionObserver | null = null
const visibleIds = new Set<string>()

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)

  if (typeof IntersectionObserver === 'undefined') return

  // Scroll-spy apenas para âncoras que realmente existem na página.
  const targets = navLinks
    .map((link) => document.getElementById(idOf(link.href)))
    .filter((el): el is HTMLElement => el !== null)

  spyObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleIds.add(entry.target.id)
        else visibleIds.delete(entry.target.id)
      }
      activeSectionId.value =
        navLinks.find((link) => visibleIds.has(idOf(link.href)))?.href.slice(1) ?? ''
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  )

  targets.forEach((el) => spyObserver?.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
  if (spyObserver) spyObserver.disconnect()
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-lg transition-colors duration-300"
    :class="isScrolled ? 'bg-[#080D14]/95 border-white/10' : 'bg-[#080D14]/80 border-white/5'"
  >
    <div
      class="max-w-[1560px] mx-auto px-5 sm:px-8 lg:px-20 h-20 grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-6"
    >
      <!-- Logo -->
      <a
        href="#"
        class="hdr-focus group flex items-center gap-2.5 shrink-0 rounded-lg"
        aria-label="AgendaPro — início"
      >
        <span
          class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
        >
          <img src="/logo.png" alt="AgendaPro" class="w-full h-full object-contain" />
        </span>
        <span class="text-lg font-extrabold tracking-tight text-white">
          Agenda<span class="text-emerald-400">Pro</span>
        </span>
      </a>

      <!-- Navegação desktop (centralizada, hierarquia abaixo das ações de auth) -->
      <nav
        aria-label="Seções da página"
        class="hidden lg:flex items-center gap-1 justify-self-center"
      >
        <a
          v-for="link in navLinks"
          :key="link.name"
          :href="link.href"
          class="hdr-focus relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-emerald-400 after:transition-all after:duration-300 after:ease-out hover:after:w-full focus-visible:after:w-full motion-reduce:after:transition-none"
          :class="
            isActive(link.href) ? 'text-white after:w-full' : 'text-slate-400 hover:text-white'
          "
          :aria-current="isActive(link.href) ? 'location' : undefined"
        >
          {{ link.name }}
        </a>
      </nav>

      <!-- Ações: separador visual entre navegação e autenticação -->
      <div class="flex items-center gap-2 sm:gap-3 justify-self-end">
        <span aria-hidden="true" class="hidden sm:block w-px h-5 bg-white/10 mr-1" />

        <!-- Login: ação secundária -->
        <NuxtLink
          to="/"
          class="hdr-focus inline-flex items-center justify-center h-11 px-3.5 sm:px-4 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors duration-200"
        >
          Entrar
        </NuxtLink>

        <!-- Registro: CTA primário emerald -->
        <NuxtLink
          to="/register"
          class="hidden sm:inline-flex items-center gap-2 h-11 px-4 sm:px-5 rounded-xl font-bold text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all duration-200 shadow-lg shadow-emerald-400/15 hover:shadow-emerald-400/30 motion-reduce:transition-colors"
        >
          <span>Criar conta</span>
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </NuxtLink>

        <!-- Alternador do menu mobile -->
        <button
          ref="toggleRef"
          type="button"
          class="hdr-focus lg:hidden ml-0.5 w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-200 flex items-center justify-center"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
          @click="toggleMobileMenu"
        >
          <svg
            v-if="!isMobileMenuOpen"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
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

    <!-- Menu mobile -->
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
        id="mobile-menu"
        class="lg:hidden bg-[#080D14]/98 backdrop-blur-2xl border-b border-white/10 px-5 sm:px-8 max-h-[calc(100dvh-5rem)] overflow-y-auto shadow-2xl"
      >
        <nav aria-label="Seções da página" class="flex flex-col gap-1 pt-4">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="hdr-focus flex items-center justify-between min-h-11 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200"
            :class="
              isActive(link.href)
                ? 'text-white bg-emerald-500/10'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            "
            :aria-current="isActive(link.href) ? 'location' : undefined"
            @click="closeMenu()"
          >
            <span>{{ link.name }}</span>
            <svg
              class="w-4 h-4 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </nav>

        <div class="flex flex-col gap-3 mt-3 pt-4 border-t border-white/10 pb-5">
          <!-- Login: secundária -->
          <NuxtLink
            to="/"
            class="hdr-focus inline-flex items-center justify-center h-11 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors duration-200"
            @click="closeMenu()"
          >
            Entrar
          </NuxtLink>
          <!-- Registro: primária -->
          <NuxtLink
            to="/register"
            class="hdr-focus inline-flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-colors duration-200 shadow-lg shadow-emerald-400/15"
            @click="closeMenu()"
          >
            <span>Criar conta</span>
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
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

<style scoped>
/* As âncoras param considerando a altura do header fixo (h-20 = 80px) */
:global(html) {
  scroll-padding-top: 6.5rem;
}

/* Foco de teclado visível e consistente em todos os alvos do header */
.hdr-focus:focus-visible {
  outline: 2px solid rgba(52, 211, 153, 0.75);
  outline-offset: 3px;
}
</style>
