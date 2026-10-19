<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LandingBackground from '@/components/canvas/FinancialBackground.vue'

const scrollYPos = ref(0)
const heroRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

const activeBadge = ref<number>(1)
let badgeInterval: NodeJS.Timeout | null = null

let observer: IntersectionObserver | null = null

const handleScroll = () => {
  scrollYPos.value = window.scrollY
}

const handleMouseMove = (e: MouseEvent) => {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width - 0.5) * 20
  mouseY.value = ((e.clientY - rect.top) / rect.height - 0.5) * -20
}

const startBadgeLoop = () => {
  badgeInterval = setInterval(() => {
    if (activeBadge.value === 1) {
      activeBadge.value = 2
    } else if (activeBadge.value === 2) {
      activeBadge.value = 0
    } else {
      activeBadge.value = 1
    }
  }, 4000)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  startBadgeLoop()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        } else {
          entry.target.classList.remove('is-visible')
        }
      })
    },
    { root: null, rootMargin: '0px', threshold: 0.15 }
  )

  document.querySelectorAll('.observe-animate').forEach((el) => observer?.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (badgeInterval) clearInterval(badgeInterval)
  observer?.disconnect()
})
</script>

<template>
  <section
    id="home"
    ref="heroRef"
    @mousemove="handleMouseMove"
    class="relative min-h-[95vh] lg:min-h-dvh flex flex-col justify-center items-center py-20 lg:py-28 overflow-hidden bg-[#F8FAFC] text-slate-900"
  >
    <LandingBackground :scroll-y-pos="scrollYPos" />

    <div
      class="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 w-full relative z-10 flex flex-col items-center text-center"
    >
      <div
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-6 observe-animate anim-1"
      >
        <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span class="text-xs font-mono font-medium text-emerald-700 tracking-wider uppercase">
          Agenda & Gestão Inteligente para Autônomos
        </span>
      </div>

      <h1
        class="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] max-w-[900px] observe-animate anim-2"
      >
        A forma mais inteligente de controlar sua <br class="hidden sm:inline" />
        <span class="text-emerald-600">agenda, clientes e faturamento.</span>
      </h1>

      <p
        class="text-base sm:text-lg lg:text-xl text-slate-600 mb-10 max-w-[680px] leading-relaxed font-light observe-animate anim-3"
      >
        Diga adeus às planilhas e anotações perdidas. Acompanhe atendimentos em tempo real, organize
        horários e tenha relatórios claros na palma da mão.
      </p>

      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full sm:w-auto observe-animate anim-4"
      >
        <NuxtLink
          to="/register"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-emerald-600/20 group"
        >
          Criar conta grátis
          <svg
            class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </NuxtLink>

        <NuxtLink
          to="/"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-medium text-sm text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 bg-white shadow-sm transition-all duration-200"
        >
          <svg
            class="w-4 h-4 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Acessar demonstração
        </NuxtLink>
      </div>

      <div
        class="flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 mb-16 observe-animate anim-5"
      >
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          100% Gratuito para começar
        </div>
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Sem necessidade de cartão
        </div>
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Otimizado para Mobile & Desktop
        </div>
      </div>

      <div class="relative w-full max-w-[960px] perspective-container observe-animate anim-panel">
        <Transition name="badge-pop">
          <div
            v-if="activeBadge === 1"
            class="hidden md:flex absolute -left-10 top-8 z-30 items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-xl pointer-events-none"
          >
            <div
              class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="text-left">
              <span class="block text-xs font-semibold text-slate-900">+ R$ 640,00</span>
              <span class="text-[10px] text-slate-500">Recebido hoje</span>
            </div>
          </div>
        </Transition>

        <Transition name="badge-pop">
          <div
            v-if="activeBadge === 2"
            class="hidden md:flex absolute -right-8 bottom-12 z-30 items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white/90 backdrop-blur-xl shadow-xl pointer-events-none"
          >
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div class="text-left">
              <span class="block text-xs font-semibold text-slate-900">Próximo: 14:30</span>
              <span class="text-[10px] text-slate-500">Maria Eduarda Santos</span>
            </div>
          </div>
        </Transition>

        <div
          class="tilt-card rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] text-left"
          :style="{ transform: `rotateX(${mouseY * 0.2}deg) rotateY(${mouseX * 0.2}deg)` }"
        >
          <div class="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-400" />
                <div class="w-3 h-3 rounded-full bg-amber-400" />
                <div class="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span class="text-xs font-mono text-slate-400 ml-2">app.suaagenda.com</span>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                >Hoje</span
              >
              <span class="text-xs text-slate-500">5 Agendamentos</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2 space-y-2.5">
              <span
                class="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2"
                >Linha do Tempo</span
              >

              <div
                class="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded"
                    >14:30</span
                  >
                  <div>
                    <h4 class="text-sm font-semibold text-slate-900">Maria Eduarda Santos</h4>
                    <p class="text-xs text-slate-500">Corte & Escova</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-emerald-700">R$ 180</span>
              </div>

              <div
                class="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                <div class="flex items-center gap-3">
                  <span class="text-xs font-mono text-slate-500 bg-slate-200/60 px-2 py-1 rounded"
                    >16:00</span
                  >
                  <div>
                    <h4 class="text-sm font-medium text-slate-700">Carlos Henrique Lima</h4>
                    <p class="text-xs text-slate-400">Barba & Cabelo</p>
                  </div>
                </div>
                <span class="text-sm font-semibold text-slate-700">R$ 250</span>
              </div>
            </div>

            <div
              class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <span
                  class="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-3"
                  >Resumo Financeiro</span
                >
                <span class="text-2xl font-bold text-slate-900 block mb-1">R$ 640,00</span>
                <span class="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  +24% vs. semana passada
                </span>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-200/60">
                <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full w-[70%]" />
                </div>
                <span class="text-[10px] text-slate-500 mt-1 block text-right"
                  >70% da meta diária</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.perspective-container {
  perspective: 500px;
}

.tilt-card {
  transition: transform 0.15s ease-out;
  transform-style: preserve-3d;
}

.badge-pop-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-pop-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.badge-pop-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

.badge-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.observe-animate {
  opacity: 0;
  transform: translateY(24px);
  transition: none;
}

.observe-animate.is-visible.anim-1 {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}
.observe-animate.is-visible.anim-2 {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}
.observe-animate.is-visible.anim-3 {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}
.observe-animate.is-visible.anim-4 {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}
.observe-animate.is-visible.anim-5 {
  animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}
.observe-animate.is-visible.anim-panel {
  animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
