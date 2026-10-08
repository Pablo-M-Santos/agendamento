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

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      } else {
        entry.target.classList.remove('is-visible')
      }
    })
  }, options)

  const elements = document.querySelectorAll('.observe-animate')
  elements.forEach((el) => observer?.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <section
    class="relative min-h-[90vh] lg:min-h-dvh flex items-center py-16 sm:py-20 lg:py-24 overflow-hidden bg-[#080D14]"
  >
    <LandingBackground :scrollYPos="scrollYPos" />

    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div
        class="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1200px] h-[500px] sm:h-[700px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-[140px] sm:blur-[180px]"
      />
    </div>

    <div class="max-w-[1560px] mx-auto px-5 sm:px-8 lg:px-20 w-full relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
        <div
          class="flex flex-col items-center lg:items-start text-center lg:text-left z-20 lg:col-span-6 w-full"
        >
          <div class="flex items-center gap-3 mb-5 sm:mb-6 observe-animate animate-step-1">
            <div class="h-[1px] w-8 bg-emerald-400/60 hidden lg:block" />
            <span
              class="text-[11px] sm:text-xs font-mono font-medium text-emerald-400 tracking-widest uppercase"
            >
              Agenda & Gestão para Autônomos
            </span>
          </div>

          <h1
            class="text-3xl sm:text-4xl xl:text-[3.1rem] font-extrabold tracking-[-0.03em] text-white mb-5 sm:mb-6 leading-[1.15] lg:leading-[1.12] observe-animate animate-step-2"
          >
            Controle total da sua <br class="hidden sm:inline" />
            <span class="text-shimmer-sweep relative inline-block"
              >agenda e dos seus clientes.</span
            >
          </h1>

          <p
            class="text-sm sm:text-base lg:text-lg text-slate-400 mb-7 sm:mb-8 max-w-[580px] leading-relaxed font-light observe-animate animate-step-3"
          >
            A solução simples, gratuita e confiável para profissionais organizarem horários,
            acompanharem atendimentos e gerenciarem o caixa do dia a dia sem complicações.
          </p>

          <div
            class="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3.5 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto observe-animate animate-step-4"
          >
            <NuxtLink
              to="/register"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-emerald-500/10 group"
            >
              <span>Criar conta grátis</span>
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
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm sm:text-base text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 backdrop-blur-sm"
            >
              <svg
                class="w-4 h-4 text-emerald-400"
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
              <span>Entrar no sistema</span>
            </NuxtLink>
          </div>

          <div
            class="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-white/10 w-full max-w-[580px] observe-animate animate-step-5"
          >
            <div>
              <span class="block text-lg sm:text-xl font-bold text-white tracking-tight"
                >Prática</span
              >
              <span class="text-[11px] sm:text-xs text-slate-400 font-medium"
                >Otimizada para celular</span
              >
            </div>
            <div>
              <span class="block text-lg sm:text-xl font-bold text-emerald-400 tracking-tight"
                >Histórico</span
              >
              <span class="text-[11px] sm:text-xs text-slate-400 font-medium"
                >Controle de clientes</span
              >
            </div>
            <div>
              <span class="block text-lg sm:text-xl font-bold text-white tracking-tight"
                >Relatórios</span
              >
              <span class="text-[11px] sm:text-xs text-slate-400 font-medium">Métricas e PDF</span>
            </div>
          </div>
        </div>

        <div
          class="w-full lg:col-span-6 relative flex items-center justify-center observe-animate animate-panel-entry mt-4 lg:mt-0"
        >
          <div class="relative w-full max-w-[540px]">
            <div
              class="absolute -inset-2 sm:-inset-4 -z-10 rounded-3xl blur-[40px] sm:blur-[60px] bg-emerald-500/15"
            />

            <div
              class="rounded-2xl border border-white/15 bg-[#0D1522]/95 backdrop-blur-2xl p-4 sm:p-7 shadow-2xl relative overflow-hidden"
            >
              <div
                class="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-white/10"
              >
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span
                    class="text-[11px] sm:text-xs font-bold tracking-wider text-slate-200 uppercase"
                    >Agenda do Dia</span
                  >
                </div>
                <span
                  class="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
                  5 Atendimentos
                </span>
              </div>

              <div class="space-y-2.5 sm:space-y-3 relative">

                <div
                  class="relative p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-emerald-500/40 shadow-lg "
                >
                  <div
                    class="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm"
                  >
                    Em Andamento
                  </div>

                  <div class="flex items-center justify-between gap-3 mb-2">
                    <div class="flex items-center gap-2">
                      <span
                        class="text-[11px] sm:text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30"
                      >
                        14:30
                      </span>
                      <h3 class="text-white font-bold text-sm sm:text-base">
                        Maria Eduarda Santos
                      </h3>
                    </div>
                    <span class="text-sm sm:text-base font-black text-emerald-300">R$ 180,00</span>
                  </div>
                  <p
                    class="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 truncate"
                  >
                    <svg
                      class="w-3.5 h-3.5 text-slate-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    <span class="truncate">Rua das Flores, 142 — Casa 04</span>
                  </p>
                </div>

                <div
                  class="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/10 opacity-90 observe-animate animate-slide-up-2"
                >
                  <div class="flex items-center justify-between gap-3 mb-1">
                    <div class="flex items-center gap-2">
                      <span
                        class="text-[11px] sm:text-xs font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded"
                      >
                        16:00
                      </span>
                      <h3 class="text-slate-200 font-semibold text-xs sm:text-sm">
                        Carlos Henrique Lima
                      </h3>
                    </div>
                    <span class="text-xs sm:text-sm font-bold text-slate-200">R$ 250,00</span>
                  </div>
                  <p class="text-[10px] sm:text-[11px] text-slate-500">
                    Av. Central, 800 • Manutenção Preventiva
                  </p>
                </div>

                <div
                  class="p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/5 opacity-60 observe-animate animate-slide-up-3"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <span
                        class="text-[10px] sm:text-[11px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded"
                      >
                        17:30
                      </span>
                      <span class="text-slate-300 text-[11px] sm:text-xs font-medium"
                        >Ana Beatriz Souza</span
                      >
                    </div>
                    <span class="text-[11px] sm:text-xs text-slate-400 font-medium">R$ 120,00</span>
                  </div>
                </div>

                <div
                  class="p-2 sm:p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03] opacity-35 observe-animate animate-slide-up-4 hidden sm:block"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] text-slate-500 px-1.5 py-0.5">19:00</span>
                      <span class="text-slate-400 text-xs">Marcos Vinicius</span>
                    </div>
                    <span class="text-xs text-slate-500">R$ 90,00</span>
                  </div>
                </div>
              </div>

              <div
                class="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-medium"
              >
                <span>Filtros e busca em tempo real</span>
                <span class="text-emerald-400 hover:underline cursor-pointer"
                  >Ver histórico completo &rarr;</span
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
  0% {
    background-position: 250% center;
  }
  100% {
    background-position: -50% center;
  }
}



@keyframes cardPulseGlow {
  0%,
  100% {
    border-color: rgba(52, 211, 153, 0.4);
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.3),
      0 0 15px rgba(52, 211, 153, 0.1);
    transform: translateY(0);
  }
  50% {
    border-color: rgba(52, 211, 153, 0.8);
    box-shadow:
      0 14px 30px -5px rgba(0, 0, 0, 0.4),
      0 0 25px rgba(52, 211, 153, 0.22);
    transform: translateY(-2px);
  }
}

.observe-animate {
  opacity: 0;
  transform: translateY(24px);
  transition: none;
}

.observe-animate.is-visible.animate-step-1 {
  animation: fadeInUpStep 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.observe-animate.is-visible.animate-step-2 {
  animation: fadeInUpStep 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
}

.observe-animate.is-visible.animate-step-3 {
  animation: fadeInUpStep 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}

.observe-animate.is-visible.animate-step-4 {
  animation: fadeInUpStep 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
}

.observe-animate.is-visible.animate-step-5 {
  animation: fadeInUpStep 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
}

.observe-animate.is-visible.animate-panel-entry {
  animation: fadeInRightPanel 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

.observe-animate.is-visible.animate-slide-up-2 {
  animation: fadeInUpSoft 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both;
}

.observe-animate.is-visible.animate-slide-up-3 {
  animation: fadeInUpSoft 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both;
}

.observe-animate.is-visible.animate-slide-up-4 {
  animation: fadeInUpSoft 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.95s both;
}

@keyframes fadeInUpStep {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRightPanel {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUpSoft {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
