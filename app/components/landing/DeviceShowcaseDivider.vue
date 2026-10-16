<template>
  <section ref="sectionRef" class="relative scroll-section">
    <div class="sticky top-0 flex h-screen flex-col overflow-hidden pt-20 lg:pt-24">
      <div class="absolute inset-0 bg-background" />

      <div class="relative z-10 flex flex-1 flex-col pb-12">
        <div class="flex flex-1 items-center">
          <div class="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div class="grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
              <!-- Left: animated step text -->
              <div class="space-y-6">
                <Transition name="step" mode="out-in">
                  <div :key="activeStep" class="space-y-4">
                    <div
                      class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      <UIcon :name="currentStep.icon" class="h-4 w-4" />
                      <span>{{ currentStep.tag }}</span>
                    </div>
                    <h2
                      class="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                      v-html="currentStep.title"
                    />
                    <p class="text-lg leading-relaxed text-muted-foreground">
                      {{ currentStep.desc }}
                    </p>
                  </div>
                </Transition>

                <Transition name="step-delay" mode="out-in">
                  <div :key="'feat-' + activeStep" class="grid gap-4 sm:grid-cols-2">
                    <div
                      v-for="feat in currentStep.features"
                      :key="feat.title"
                      class="flex items-start gap-3 rounded-xl border bg-card/50 p-4"
                    >
                      <div
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10"
                      >
                        <UIcon :name="feat.icon" class="h-5 w-5 text-primary" />
                      </div>
                      <div class="space-y-1">
                        <h3 class="font-semibold">{{ feat.title }}</h3>
                        <p class="text-sm text-muted-foreground">{{ feat.desc }}</p>
                      </div>
                    </div>
                  </div>
                </Transition>

                <!-- Step jump buttons -->
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-for="(step, i) in steps"
                    :key="i"
                    class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-500"
                    :class="
                      i === activeStep
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                    "
                    @click="jumpToStep(i)"
                  >
                    <UIcon :name="step.icon" class="h-3.5 w-3.5" />
                    {{ step.tag }}
                  </button>
                </div>
              </div>

              <!-- Right: CSS background image showcase com balões flutuantes animados -->
              <div class="relative isolate flex items-center justify-center">
                <div class="showcase-container">
                  <!-- Celular (Passo 0) -->
                  <div class="device-mockup phone-bg" :class="{ 'is-active': activeStep === 0 }">
                    <div class="floating-badge badge-phone-1">
                      <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UIcon name="lucide:zap" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight">Super Rápido</p>
                        <p class="text-[10px] text-muted-foreground">Menos de 1 min</p>
                      </div>
                    </div>

                    <div class="floating-badge badge-phone-2">
                      <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UIcon name="lucide:wallet" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight">Pix e Cartão</p>
                        <p class="text-[10px] text-muted-foreground">Pagamento seguro</p>
                      </div>
                    </div>

                    <div class="floating-badge badge-phone-3">
                      <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UIcon name="lucide:bell-ring" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight">Lembrete WhatsApp</p>
                        <p class="text-[10px] text-muted-foreground">Zero faltas</p>
                      </div>
                    </div>
                  </div>

                  <!-- Desktop (Passo 1) -->
                  <div class="device-mockup desktop-bg" :class="{ 'is-active': activeStep === 1 }">
                    <div class="floating-badge badge-desk-1">
                      <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UIcon name="lucide:trending-up" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight">+40% Faturamento</p>
                        <p class="text-[10px] text-muted-foreground">Relatórios em tempo real</p>
                      </div>
                    </div>

                    <div class="floating-badge badge-desk-2">
                      <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UIcon name="lucide:shield-check" class="h-4 w-4" />
                      </div>
                      <div>
                        <p class="text-xs font-bold leading-tight">Gestão Segura</p>
                        <p class="text-[10px] text-muted-foreground">Múltiplos profissionais</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll progress bar -->
        <div class="h-px w-full bg-border">
          <div
            class="h-full bg-primary transition-[width] duration-150 ease-out"
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
    title: 'Agende na palma<br><span class="text-primary">da mão</span>',
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
    title: 'Painel completo<br><span class="text-primary">no computador</span>',
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

/* Keyframes para a animação contínua de flutuação (subir e descer) */
@keyframes floatAnimation {
  0%, 100% {  
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Estilização e transição dos balões flutuantes */
.floating-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: hsl(var(--card) / 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.6);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(15px) scale(0.9);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 60;
}

/* Quando o dispositivo está ativo, o balão aparece e inicia a animação contínua de flutuação */
.device-mockup.is-active .floating-badge {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation: floatAnimation 4s ease-in-out infinite;
}

/* Atrasos individuais para cada balão flutuar de forma descentralizada/orgânica */
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

/* Transições dos textos */
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
</style>