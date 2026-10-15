<template>
  <section ref="sectionRef" class="relative" style="min-height: 200vh">
    <div class="sticky top-0 flex h-screen flex-col overflow-hidden pt-20 lg:pt-24">
      <!-- Ambient background -->
      <div class="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div
        class="absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl transition-all duration-700"
        :style="{
          opacity: activeStep === 1 ? 0.9 : 0.5,
          transform: `translateY(${activeStep * 24}px)`
        }"
      />
      <div
        class="absolute -bottom-40 left-0 h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl transition-all duration-700"
        :style="{ opacity: activeStep === 0 ? 0.9 : 0.4 }"
      />

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

              <!-- Right: device duo with sequential scroll reveal -->
              <div class="relative isolate flex items-center justify-center">
                <div
                  class="relative mx-auto flex h-[400px] w-full max-w-[600px] items-center justify-center overflow-visible sm:h-[460px] lg:h-[520px]"
                >
                  <!-- iPhone — Mobile (Passo 0) -->
                  <div
                    v-if="activeStep === 0"
                    class="absolute flex items-center justify-center transition-all duration-700 animate-in fade-in zoom-in-95"
                    :style="{ transform: `scale(${scales.phone})` }"
                  >
                    <div class="device device-iphone-14-pro">
                      <div class="device-frame">
                        <img
                          :src="phoneImage"
                          alt="Pré-visualização do agendamento no celular"
                          class="device-content h-full w-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                      <div class="device-stripe" />
                      <div class="device-header" />
                      <div class="device-sensors" />
                      <div class="device-btns" />
                      <div class="device-power" />
                      <div class="device-home" />
                    </div>
                  </div>

                  <!-- MacBook — Desktop (Passo 1) -->
                  <div
                    v-if="activeStep === 1"
                    class="absolute flex items-center justify-center transition-all duration-700 animate-in fade-in zoom-in-95"
                    :style="{ transform: `scale(${scales.desktop})` }"
                  >
                    <div class="device device-macbook">
                      <div class="device-frame">
                        <img
                          :src="desktopImage"
                          alt="Pré-visualização do painel no desktop"
                          class="device-content h-full w-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                      <div class="device-stripe" />
                      <div class="device-header" />
                      <div class="device-sensors" />
                      <div class="device-btns" />
                      <div class="device-power" />
                      <div class="device-home" />
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
const vw = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)

const phoneImage = '/images/mocks/mobile-agendar.png'
const desktopImage = '/images/mocks/desktop-dashboard.png'

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
type Device = 'phone' | 'desktop'

const deviceActiveIndex: Record<Device, number> = { phone: 0, desktop: 1 }

// Escalas ajustadas para apenas 2 dispositivos (Celular e Desktop)
const scales = computed(() => {
  const w = vw.value
  if (w >= 1280) return { desktop: 0.85, phone: 0.50 }
  if (w >= 1024) return { desktop: 0.75, phone: 0.45 }
  if (w >= 768) return { desktop: 0.62, phone: 0.38 }
  return { desktop: 0.50, phone: 0.32 }
})

function jumpToStep(step: number) {
  if (!sectionRef.value) return
  const sectionTop = sectionRef.value.getBoundingClientRect().top + window.scrollY
  const scrollable = sectionRef.value.offsetHeight - window.innerHeight
  window.scrollTo({ top: sectionTop + ((step + 0.5) / 2) * scrollable, behavior: 'smooth' })
}

function handleResize() {
  if (typeof window !== 'undefined') {
    vw.value = window.innerWidth
  }
}

function handleScroll() {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  const scrollable = sectionRef.value.offsetHeight - window.innerHeight
  const progress = Math.max(0, Math.min(1, -rect.top / scrollable))
  scrollProgress.value = progress
  // Como são apenas 2 passos (0 e 1), multiplicamos por 2
  activeStep.value = Math.min(1, Math.floor(progress * 2))
}

onMounted(async () => {
  await nextTick()
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Step text — sai pra cima, entra de baixo */
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

/* Features — mesmo comportamento, delay ligeiramente maior */
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