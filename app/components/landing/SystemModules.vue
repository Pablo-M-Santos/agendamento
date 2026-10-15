<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const activeTab = ref(0)

const modules = [
  {
    id: 0,
    title: 'Gestão Unificada',
    subtitle:
      'Controle centralizado de horários, profissionais e serviços em uma única interface fluida.',
    metrics: ['26.000+ Agendamentos', '99.9% Uptime', 'Zero Faltas']
  },
  {
    id: 1,
    title: 'Dashboard Analítico',
    subtitle: 'Métricas de faturamento e fluxo de caixa processadas e exibidas em tempo real.',
    metrics: ['R$ 148k+ Movimentados', '+24% Produtividade', 'Relatórios Automáticos']
  },
  {
    id: 2,
    title: 'Módulo de Clientes',
    subtitle:
      'Histórico de atendimento, preferências e CRM integrado para fidelizar seus pacientes ou clientes.',
    metrics: ['4.8/5 Satisfação Média', 'Retenção Elevada', 'Lembretes via WhatsApp']
  }
]

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting) {
        isVisible.value = true
        if (observer && sectionRef.value) {
          observer.unobserve(sectionRef.value)
        }
      }
    },
    { threshold: 0.15 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const handleMouseMove = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
}
</script>

<template>
  <section
    id="modulos"
    ref="sectionRef"
    class="modules-section"
    :class="{ 'is-visible': isVisible }"
  >
    <!-- Luz ambiente de fundo -->
    <div class="gradient-ambient-glow" aria-hidden="true" />

    <!-- Camada de Estrelas e Espaço Sutil -->
    <div class="stars-container" aria-hidden="true">
      <div class="stars-layer stars-small" />
      <div class="stars-layer stars-medium" />

      <!-- Cometa Suave / Estrela Cadente Branca (Disparo Imediato) -->
      <div class="subtle-comet" />
    </div>

    <div class="modules-inner">
      <header class="modules-header animate-item">
        <h2 class="modules-title">Arquitetura pensada para<br />a sua autonomia.</h2>
        <p class="modules-desc">
          Navegue pelos módulos que compõem o ecossistema e descubra como automatizamos cada rotina
          da sua empresa.
        </p>
      </header>

      <!-- Layout em Grid: Abas à esquerda e Preview interativo à direita -->
      <div class="modules-container animate-item delay-1">
        <!-- Navegação / Abas -->
        <div class="modules-tabs">
          <button
            v-for="(mod, index) in modules"
            :key="mod.id"
            class="tab-button"
            :class="{ active: activeTab === index }"
            @click="activeTab = index"
          >
            <span class="tab-number">0{{ index + 1 }}</span>
            <div class="tab-info">
              <h3>{{ mod.title }}</h3>
              <p>{{ mod.subtitle }}</p>
            </div>
          </button>
        </div>

        <!-- Vitrine / Preview Interativo -->
        <div class="modules-preview spotlight-card" @mousemove="handleMouseMove">
          <div class="card-glow" />

          <div class="preview-header">
            <div class="preview-dots">
              <span class="dot red" />
              <span class="dot yellow" />
              <span class="dot green" />
            </div>
            <span class="preview-tag">{{ modules[activeTab]?.title }}</span>
          </div>

          <div class="preview-body">
            <div class="preview-main-content animate-fade">
              <h4>{{ modules[activeTab]?.title }} em Ação</h4>
              <p>{{ modules[activeTab]?.subtitle }}</p>
            </div>

            <div class="preview-metrics">
              <div
                v-for="(metric, mIndex) in modules[activeTab]?.metrics"
                :key="mIndex"
                class="metric-pill"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{{ metric }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.modules-section {
  position: relative;
  min-height: 80dvh;

  background: linear-gradient(180deg, #080d14 0%, #0b121e 50%, #0d1726 100%);

  z-index: 30;
  padding: 8rem 1.5rem;
  overflow: hidden;
}

.gradient-ambient-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70vw;
  height: 400px;
  background: radial-gradient(
    ellipse at center,
    rgba(52, 211, 153, 0.05) 0%,
    rgba(15, 23, 42, 0) 70%
  );
  pointer-events: none;
  z-index: 1;
}

/* --- CAMADA DE ESTRELAS --- */
.stars-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.stars-layer {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
}

.stars-small {
  background-image:
    radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 150px 80px, rgba(52, 211, 153, 0.6), rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 280px 120px, rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0)),
    radial-gradient(1.5px 1.5px at 420px 200px, rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 600px 60px, rgba(52, 211, 153, 0.5), rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 730px 180px, rgba(255, 255, 255, 0.6), rgba(0, 0, 0, 0));
  background-size: 950px 350px;
  opacity: 0.55;
  animation: starsTwinkle 8s ease-in-out infinite alternate;
}

.stars-medium {
  background-image:
    radial-gradient(2px 2px at 90px 140px, rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 340px 260px, rgba(52, 211, 153, 0.7), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 680px 40px, rgba(255, 255, 255, 0.7), rgba(0, 0, 0, 0));
  background-size: 1000px 400px;
  opacity: 0.4;
  animation: starsTwinkle 11s ease-in-out infinite alternate-reverse;
}

@keyframes starsTwinkle {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.65;
  }
  100% {
    opacity: 0.35;
  }
}

/* --- COMETA ÚNICO BRANCO DISPARANDO IMEDIATAMENTE NO MOUNT --- */
.subtle-comet {
  position: absolute;
  top: -5%;
  right: -5%;
  width: 160px;
  height: 1.5px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.3) 45%,
    transparent 100%
  );
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.85));
  border-radius: 999px;
  opacity: 0;
  transform: rotate(-32deg);
  pointer-events: none;
  animation: subtleCometPass 12s cubic-bezier(0.25, 1, 0.35, 1) infinite;
}

@keyframes subtleCometPass {
  0% {
    transform: translateX(0) translateY(0) rotate(-32deg);
    opacity: 0.95;
  }
  15% {
    transform: translateX(-125vw) translateY(100vh) rotate(-32deg);
    opacity: 0;
  }
  100% {
    transform: translateX(-125vw) translateY(100vh) rotate(-32deg);
    opacity: 0;
  }
}

/* --- ESTILOS DO CONTEÚDO --- */
.modules-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.modules-header {
  max-width: 600px;
  margin-bottom: 4rem;
}

.modules-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #f0fdf4;
  margin-bottom: 1rem;
}

.modules-desc {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.7;
}

.modules-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 3rem;
  align-items: center;
}

.modules-tabs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tab-button {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  background: rgba(12, 20, 34, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.tab-button:hover {
  background: linear-gradient(
    135deg,
    rgba(52, 211, 153, 0.12) 0%,
    rgba(13, 23, 38, 0.85) 50%,
    rgba(8, 13, 20, 0.95) 100%
  );
  border-color: rgba(52, 211, 153, 0.35);
  transform: translateX(6px);
  box-shadow:
    0 10px 25px -8px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(52, 211, 153, 0.08);
}

.tab-button.active {
  background: linear-gradient(
    135deg,
    rgba(52, 211, 153, 0.18) 0%,
    rgba(11, 18, 30, 0.95) 60%,
    rgba(8, 13, 20, 0.98) 100%
  );
  border-color: rgba(52, 211, 153, 0.5);
  box-shadow: 0 12px 30px -10px rgba(52, 211, 153, 0.15);
}

.tab-number {
  font-size: 0.85rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
}

.tab-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.35rem;
}

.tab-info p {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.5;
}

.modules-preview {
  position: relative;
  background: rgba(12, 20, 34, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border-radius: 24px;
  padding: 2.5rem;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: all 0.4s ease;
}

.modules-preview:hover {
  background: linear-gradient(
    145deg,
    rgba(52, 211, 153, 0.1) 0%,
    rgba(11, 18, 30, 0.9) 50%,
    rgba(8, 13, 20, 0.95) 100%
  );
  border-color: rgba(52, 211, 153, 0.35);
  box-shadow:
    0 20px 40px -15px rgba(0, 0, 0, 0.6),
    0 0 25px rgba(52, 211, 153, 0.08);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
}

.preview-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red {
  background: #ef4444;
}
.dot.yellow {
  background: #f59e0b;
}
.dot.green {
  background: #10b981;
}

.preview-tag {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.preview-main-content h4 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
}

.preview-main-content p {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.6;
}

.preview-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 2rem;
}

.metric-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #e2e8f0;
}

.card-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: radial-gradient(
    400px circle at var(--mouse-x) var(--mouse-y),
    rgba(52, 211, 153, 0.08),
    transparent 80%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.modules-preview:hover .card-glow {
  opacity: 1;
}

.animate-item {
  opacity: 0;
  transform: translateY(25px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.modules-section.is-visible .animate-item {
  opacity: 1;
  transform: translateY(0);
}

.delay-1 {
  transition-delay: 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade {
  animation: fadeIn 0.4s ease forwards;
}

@media (max-width: 968px) {
  .modules-container {
    grid-template-columns: 1fr;
  }
}
</style>
