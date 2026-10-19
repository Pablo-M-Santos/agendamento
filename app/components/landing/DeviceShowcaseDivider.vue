<template>
  <section ref="sectionRef" class="relative scroll-section">
    <div class="sticky top-0 flex h-screen flex-col overflow-hidden pt-20 lg:pt-24 text-white">
      <div class="wave-top" aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            class="wave-path wave-back"
            d="M0,50 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1380,70 1440,55 L1440,0 L0,0 Z"
            fill="#10B981"
            opacity="1"
          />
          <path
            class="wave-path wave-front"
            d="M0,62 C200,100 400,22 600,62 C800,100 1000,18 1200,62 C1320,82 1400,58 1440,66 L1440,0 L0,0 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
      <div class="absolute inset-0 bg-transition-layer" />

      <div class="relative z-10 flex flex-1 flex-col pb-12">
        <div class="flex flex-1 items-center">
          <div class="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div class="grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
              <div class="space-y-6">
                <Transition name="step" mode="out-in">
                  <div :key="activeStep" class="space-y-4">
                    <div
                      class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-400 border border-emerald-500/20"
                    >
                      <UIcon :name="currentStep.icon" class="h-4 w-4" />
                      <span>{{ currentStep.tag }}</span>
                    </div>
                    <h2
                      class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white"
                      v-html="currentStep.title"
                    />
                    <p class="text-lg leading-relaxed text-slate-400">
                      {{ currentStep.desc }}
                    </p>
                  </div>
                </Transition>

                <Transition name="step-delay" mode="out-in">
                  <div :key="'feat-' + activeStep" class="grid gap-4 sm:grid-cols-2">
                    <div
                      v-for="feat in currentStep.features"
                      :key="feat.title"
                      class="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4"
                    >
                      <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400"
                      >
                        <UIcon :name="feat.icon" class="h-5 w-5" />
                      </div>
                      <div class="space-y-1">
                        <h3 class="font-semibold text-white">{{ feat.title }}</h3>
                        <p class="text-sm text-slate-400">{{ feat.desc }}</p>
                      </div>
                    </div>
                  </div>
                </Transition>

                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-for="(step, i) in steps"
                    :key="i"
                    class="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300"
                    :class="
                      i === activeStep
                        ? 'bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                    "
                    @click="jumpToStep(i)"
                  >
                    <UIcon :name="step.icon" class="h-3.5 w-3.5" />
                    {{ step.tag }}
                  </button>
                </div>
              </div>

              <div class="relative isolate flex items-center justify-center">
                <div class="showcase-container">
                  <div class="device-mockup phone-bg" :class="{ 'is-active': activeStep === 0 }">
                    <div class="floating-badge badge-phone-1">
                      <div
                        class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                      >
                        <UIcon name="lucide:zap" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight text-white">Super Rápido</p>
                        <p class="text-[10px] text-slate-400">Menos de 1 min</p>
                      </div>
                    </div>

                    <div class="floating-badge badge-phone-2">
                      <div
                        class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                      >
                        <UIcon name="lucide:wallet" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight text-white">Pix e Cartão</p>
                        <p class="text-[10px] text-slate-400">Pagamento seguro</p>
                      </div>
                    </div>

                    <div class="floating-badge badge-phone-3">
                      <div
                        class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                      >
                        <UIcon name="lucide:bell-ring" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight text-white">Lembrete WhatsApp</p>
                        <p class="text-[10px] text-slate-400">Zero faltas</p>
                      </div>
                    </div>
                  </div>

                  <div class="device-mockup desktop-bg" :class="{ 'is-active': activeStep === 1 }">
                    <div class="floating-badge badge-desk-1">
                      <div
                        class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                      >
                        <UIcon name="lucide:trending-up" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight text-white">+40% Faturamento</p>
                        <p class="text-[10px] text-slate-400">Relatórios em tempo real</p>
                      </div>
                    </div>

                    <div class="floating-badge badge-desk-2">
                      <div
                        class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                      >
                        <UIcon name="lucide:shield-check" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight text-white">Gestão Segura</p>
                        <p class="text-[10px] text-slate-400">Múltiplos profissionais</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-px w-full bg-white/10">
          <div
            class="h-full bg-emerald-400 transition-[width] duration-150 ease-out"
            :style="{ width: `${scrollProgress * 100}%` }"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const activeStep = ref(0)
const scrollProgress = ref(0)

const steps = [
  {
    tag: 'Celular',
    icon: 'lucide:smartphone',
    title: 'Agende na palma<br><span class="text-emerald-400">da mão</span>',
    desc: 'Seus clientes escolhem, confirmam e pagam pelo celular em menos de um minuto. Sem mensagens, sem ligações.',
    features: [
      {
        icon: 'lucide:calendar-check',
        title: 'Agendamento em segundos',
        desc: 'Fluxo otimizado para telas touch'
      },
      {
        icon: 'lucide:bell',
        title: 'Lembretes automáticos',
        desc: 'SMS e WhatsApp antes do horário'
      }
    ]
  },
  {
    tag: 'Desktop',
    icon: 'lucide:laptop',
    title: 'Painel completo<br><span class="text-emerald-400">no computador</span>',
    desc: 'Relatórios, controle financeiro e gestão de múltiplos profissionais — tudo no painel de administração.',
    features: [
      {
        icon: 'lucide:bar-chart-2',
        title: 'Relatórios em tempo real',
        desc: 'Faturamento, conversão e ocupação'
      },
      {
        icon: 'lucide:settings-2',
        title: 'Gestão avançada',
        desc: 'Serviços, preços e disponibilidade'
      }
    ]
  }
]

const currentStep = computed(() => steps[activeStep.value] ?? steps[0]!)

function jumpToStep(step: number) {
  if (!sectionRef.value) return
  const sectionTop = sectionRef.value.getBoundingClientRect().top + window.scrollY
  const scrollable = sectionRef.value.offsetHeight - window.innerHeight
  window.scrollTo({ top: sectionTop + ((step + 0.5) / 2) * scrollable, behavior: 'smooth' })
}

function handleScroll() {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  const scrollable = sectionRef.value.offsetHeight - window.innerHeight
  const progress = Math.max(0, Math.min(1, -rect.top / scrollable))
  scrollProgress.value = progress
  activeStep.value = Math.min(1, Math.floor(progress * 2))
}

onMounted(async () => {
  await nextTick()
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scroll-section {
  min-height: 300vh;
}

.bg-transition-layer {
  position: absolute;
  inset: 0;
  background-color: #080d14;
}

.showcase-container {
  position: relative;
  margin: 0 auto;
  display: flex;
  height: 480px;
  width: 100%;
  max-width: 750px;
  align-items: center;
  justify-content: center;
}

.device-mockup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  opacity: 0;
  pointer-events: none;
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.device-mockup.is-active {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: auto;
  z-index: 50;
}

.phone-bg {
  width: 487px;
  height: 752px;
  background-image: url('/mobile-agendar.png');
}

.desktop-bg {
  width: 800px;
  height: 550px;
  background-image: url('/desktop-dashboard.png');
}

@keyframes floatAnimation {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.floating-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #0a111c;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.4),
    0 8px 10px -6px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(15px) scale(0.9);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 60;
}

.device-mockup.is-active .floating-badge {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation: floatAnimation 4s ease-in-out infinite;
}

.badge-phone-1 {
  top: 15%;
  left: -130px;
  animation-delay: 0s !important;
}

.badge-phone-2 {
  top: 45%;
  right: -130px;
  animation-delay: 1.2s !important;
}

.badge-phone-3 {
  bottom: 15%;
  left: -120px;
  animation-delay: 2.4s !important;
}

.badge-desk-1 {
  top: 15%;
  left: -90px;
  animation-delay: 0s !important;
}

.badge-desk-2 {
  bottom: 20%;
  right: -90px;
  animation-delay: 1.8s !important;
}

.step-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.04s;
}
.step-leave-active {
  transition: all 0.28s ease;
}
.step-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.step-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.step-delay-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.12s;
}
.step-delay-leave-active {
  transition: all 0.22s ease;
}
.step-delay-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.step-delay-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.wave-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  pointer-events: none;
  overflow: hidden;
  height: 100px;
}

.wave-top svg {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #080d14;
}

@keyframes waveBack {
  0% {
    d: path(
      'M0,50 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1380,70 1440,55 L1440,0 L0,0 Z'
    );
  }
  50% {
    d: path(
      'M0,40 C180,10 360,88 540,42 C720,0 900,88 1080,42 C1260,0 1380,30 1440,45 L1440,0 L0,0 Z'
    );
  }
  100% {
    d: path(
      'M0,50 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1380,70 1440,55 L1440,0 L0,0 Z'
    );
  }
}

@keyframes waveFront {
  0% {
    d: path(
      'M0,62 C200,100 400,22 600,62 C800,100 1000,18 1200,62 C1320,82 1400,58 1440,66 L1440,0 L0,0 Z'
    );
  }
  50% {
    d: path(
      'M0,52 C200,20 400,98 600,50 C800,20 1000,96 1200,50 C1320,30 1400,74 1440,56 L1440,0 L0,0 Z'
    );
  }
  100% {
    d: path(
      'M0,62 C200,100 400,22 600,62 C800,100 1000,18 1200,62 C1320,82 1400,58 1440,66 L1440,0 L0,0 Z'
    );
  }
}

@media (prefers-reduced-motion: no-preference) {
  .wave-back {
    animation: waveBack 7s ease-in-out infinite;
  }
  .wave-front {
    animation: waveFront 5s ease-in-out infinite;
  }
}
</style>
