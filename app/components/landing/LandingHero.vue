<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LandingBackground from '@/components/canvas/FinancialBackground.vue'

const scrollYPos = ref(0)
let observer: IntersectionObserver | null = null

const handleScroll = () => {
  scrollYPos.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

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
  observer?.disconnect()
})
</script>

<template>
  <section
    class="relative min-h-[90vh] lg:min-h-dvh flex items-center py-16 sm:py-20 lg:py-24 overflow-hidden bg-[#080D14]"
  >
    <LandingBackground :scroll-y-pos="scrollYPos" />

    <div class="max-w-[1560px] mx-auto px-5 sm:px-8 lg:px-20 w-full relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

        <!-- Left: Copy -->
        <div
          class="flex flex-col items-center lg:items-start text-center lg:text-left lg:col-span-6"
        >
          <!-- Label -->
          <div class="flex items-center gap-3 mb-5 sm:mb-6 observe-animate anim-1">
            <div class="h-px w-6 bg-emerald-400/50 hidden lg:block" />
            <span class="text-[11px] font-mono font-medium text-emerald-400 tracking-widest uppercase">
              Agenda & Gestão para Autônomos
            </span>
          </div>

          <!-- Heading -->
          <h1
            class="text-3xl sm:text-4xl xl:text-[3.1rem] font-extrabold tracking-[-0.03em] text-white mb-5 sm:mb-6 leading-[1.15] lg:leading-[1.12] observe-animate anim-2"
          >
            Controle total da sua<br class="hidden sm:inline" />
            <span class="text-shimmer-sweep inline-block">agenda e dos seus clientes.</span>
          </h1>

          <!-- Subtitle -->
          <p
            class="text-sm sm:text-base lg:text-lg text-slate-400 mb-8 max-w-[520px] leading-relaxed font-light observe-animate anim-3"
          >
            A solução simples, gratuita e confiável para profissionais organizarem horários,
            acompanharem atendimentos e gerenciarem o caixa sem complicações.
          </p>

          <!-- CTAs -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10 w-full sm:w-auto observe-animate anim-4"
          >
            <NuxtLink
              to="/register"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:scale-[0.98] transition-all duration-200 group"
            >
              Criar conta grátis
              <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>

            <NuxtLink
              to="/"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              <svg class="w-4 h-4 text-emerald-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Entrar no sistema
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div
            class="flex items-center gap-6 pt-6 border-t border-white/[0.08] observe-animate anim-5"
          >
            <div>
              <span class="block text-base font-bold text-white">Prática</span>
              <span class="text-xs text-slate-500">Otimizada para celular</span>
            </div>
            <div class="w-px h-8 bg-white/10" />
            <div>
              <span class="block text-base font-bold text-emerald-400">Histórico</span>
              <span class="text-xs text-slate-500">Controle de clientes</span>
            </div>
            <div class="w-px h-8 bg-white/10" />
            <div>
              <span class="block text-base font-bold text-white">Relatórios</span>
              <span class="text-xs text-slate-500">Métricas e PDF</span>
            </div>
          </div>
        </div>

        <!-- Right: Card preview -->
        <div
          class="w-full lg:col-span-6 flex items-center justify-center observe-animate anim-panel mt-4 lg:mt-0"
        >
          <div class="relative w-full max-w-[460px]">

            <!-- Subtle ambient glow -->
            <div class="absolute -inset-6 -z-10 rounded-3xl bg-emerald-500/10 blur-[60px]" />

            <div class="rounded-2xl border border-white/10 bg-[#0D1522]/90 backdrop-blur-xl p-5 sm:p-6 shadow-2xl">

              <!-- Card header -->
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span class="text-xs font-semibold text-slate-300 uppercase tracking-wider">Agenda — Hoje</span>
                </div>
                <span class="text-xs text-slate-500">5 atendimentos</span>
              </div>

              <!-- Appointment rows -->
              <div class="space-y-1.5">

                <!-- Active -->
                <div class="flex items-center gap-3 px-3 py-3 rounded-lg border-l-2 border-emerald-400 bg-white/[0.05]">
                  <span class="text-[11px] font-mono font-bold text-emerald-400 w-10 shrink-0">14:30</span>
                  <span class="text-sm text-white font-semibold flex-1 truncate">Maria Eduarda Santos</span>
                  <span class="text-sm font-bold text-emerald-300 shrink-0">R$ 180</span>
                </div>

                <!-- Next -->
                <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                  <span class="text-[11px] font-mono text-slate-400 w-10 shrink-0">16:00</span>
                  <span class="text-sm text-slate-300 flex-1 truncate">Carlos Henrique Lima</span>
                  <span class="text-sm text-slate-300 shrink-0">R$ 250</span>
                </div>

                <!-- Later -->
                <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-50">
                  <span class="text-[11px] font-mono text-slate-500 w-10 shrink-0">17:30</span>
                  <span class="text-sm text-slate-400 flex-1 truncate">Ana Beatriz Souza</span>
                  <span class="text-sm text-slate-500 shrink-0">R$ 120</span>
                </div>

              </div>

              <!-- Card footer -->
              <div class="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span class="text-xs text-slate-500">Total do dia</span>
                <span class="text-sm font-bold text-white">R$ 640,00</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.text-shimmer-sweep {
  background: linear-gradient(
    90deg,
    #34d399 0%,
    #34d399 35%,
    #ffffff 50%,
    #34d399 65%,
    #34d399 100%
  );
  background-size: 250% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: lightSweep 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes lightSweep {
  0%   { background-position: 250% center; }
  100% { background-position: -50% center; }
}

.observe-animate {
  opacity: 0;
  transform: translateY(20px);
  transition: none;
}

.observe-animate.is-visible.anim-1 { animation: fadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.10s both; }
.observe-animate.is-visible.anim-2 { animation: fadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both; }
.observe-animate.is-visible.anim-3 { animation: fadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both; }
.observe-animate.is-visible.anim-4 { animation: fadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.48s both; }
.observe-animate.is-visible.anim-5 { animation: fadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.60s both; }
.observe-animate.is-visible.anim-panel { animation: fadeRight 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeRight {
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>