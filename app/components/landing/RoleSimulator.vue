<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const selectedCard = ref(0)

const cards = [
  {
    id: 0,
    role: 'Empreendedor',
    subtitle: 'Gestão & Lucratividade',
    icon: 'chart',
    headline: 'Visão macro do faturamento e saúde financeira',
    desc: 'Sem planilhas ou fechamentos manuais. Acompanhe o fluxo de caixa, comissões de equipe e balanço consolidado em tempo real.',
    metrics: [
      { label: 'Faturamento do Dia', value: 'R$ 3.840,00', badge: '+24%' },
      { label: 'Caixa Consolidado', value: 'R$ 48.900,00', badge: 'Autônomo' },
      { label: 'Margem Líquida', value: '38.2%', badge: 'Otimizada' }
    ]
  },
  {
    id: 1,
    role: 'Equipe & Time',
    subtitle: 'Agenda & Alta Performance',
    icon: 'user',
    headline: 'Agendas sincronizadas sem choque de horários',
    desc: 'Cada profissional tem visibilidade total do seu dia. Lembretes automáticos reduzem o no-show (faltas) a praticamente zero.',
    metrics: [
      { label: 'Atendimentos Hoje', value: '18 Agendados', badge: '100% Confirmados' },
      { label: 'Taxa de Ocupação', value: '94%', badge: 'Horários Cheios' },
      { label: 'Prevenção de Faltas', value: 'Zero Faltas', badge: 'Via WhatsApp' }
    ]
  },
  {
    id: 2,
    role: 'Cliente Final',
    subtitle: 'Agendamento em 3 Clics',
    icon: 'sparkles',
    headline: 'Reserva e pagamento instantâneo pelo celular',
    desc: 'Zero espera e sem precisar baixar aplicativo. O cliente escolhe o serviço, seleciona o horário e quita via PIX em segundos.',
    metrics: [
      { label: 'Tempo de Reserva', value: '38 Segundos', badge: 'Sem Atrito' },
      { label: 'Pagamento PIX', value: 'Instantâneo', badge: 'Aprovação Direta' },
      { label: 'Satisfação Média', value: '4.9 / 5.0', badge: 'Avaliação Máxima' }
    ]
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
</script>

<template>
  <section
    id="deck-simulador"
    ref="sectionRef"
    class="deck-section"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="ambient-glow" aria-hidden="true" />

    <div class="deck-inner">
      <header class="section-header animate-item">
        <span class="section-tag">Simulador Interativo</span>
        <h2 class="section-title">Escolha o perfil e veja o poder do sistema.</h2>
        <p class="section-desc">
          Clique nas cartas para alternar a perspectiva e projetar os indicadores de cada nível da
          sua operação.
        </p>
      </header>

      <div class="cards-deck-container animate-item delay-1">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="deck-card"
          :class="{ 'is-selected': selectedCard === index, 'is-dimmed': selectedCard !== index }"
          @click="selectedCard = index"
        >
          <div class="card-glow-overlay" />
          <div class="card-top-type">CARD {{ index + 1 }}</div>

          <div class="card-body-content">
            <div class="card-avatar-icon">
              <svg
                v-if="card.icon === 'chart'"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
              <svg
                v-else-if="card.icon === 'user'"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <svg
                v-else
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>

            <h3 class="card-role-title">{{ card.role }}</h3>
            <p class="card-role-sub">{{ card.subtitle }}</p>
          </div>

          <div class="card-footer-indicator">
            <span>{{ selectedCard === index ? 'ATIVO' : 'SELECIONAR' }}</span>
          </div>
        </div>
      </div>

      <div :key="selectedCard" class="projection-panel animate-fade">
        <div class="projection-top">
          <div class="projection-title-group">
            <span class="projection-badge"
              >PERSPECTIVA DO {{ cards[selectedCard]?.role.toUpperCase() }}</span
            >
            <h3 class="projection-headline">{{ cards[selectedCard]?.headline }}</h3>
          </div>
          <p class="projection-desc">{{ cards[selectedCard]?.desc }}</p>
        </div>

        <div class="projection-metrics-grid">
          <div
            v-for="(metric, mIdx) in cards[selectedCard]?.metrics"
            :key="mIdx"
            class="metric-pill-card"
          >
            <span class="metric-label">{{ metric.label }}</span>
            <div class="metric-value-row">
              <span class="metric-val">{{ metric.value }}</span>
              <span class="metric-badge">{{ metric.badge }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.deck-section {
  position: relative;
  min-height: 95dvh;
  background: linear-gradient(180deg, #080D14 0%, #0b121e 50%, #0d1726 100%);
  z-index: 30;
  padding: 8rem 1.5rem;
  overflow: hidden;
}

.ambient-glow {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 500px;
  background: radial-gradient(
    ellipse at center,
    rgba(52, 211, 153, 0.05) 0%,
    rgba(15, 23, 42, 0) 70%
  );
  pointer-events: none;
  z-index: 1;
}

.deck-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.section-header {
  max-width: 650px;
  margin-bottom: 3.5rem;
  text-align: left;
}

.section-tag {
  display: inline-block;
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  margin-bottom: 1rem;
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #f0fdf4;
  margin-bottom: 1rem;
}

.section-desc {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.7;
}

.cards-deck-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 2.5rem;
}

.deck-card {
  position: relative;
  background: #0d1522;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2rem 1.75rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
}

.deck-card:hover {
  border-color: rgba(52, 211, 153, 0.4);
  transform: translateY(-4px);
}

.deck-card.is-selected {
  background: linear-gradient(135deg, #111e32 0%, #0d1726 100%);
  border-color: #34d399;
  box-shadow: 0 15px 35px -10px rgba(52, 211, 153, 0.25);
  transform: translateY(-6px);
}

.deck-card.is-dimmed {
  opacity: 0.65;
}

.card-top-type {
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #64748b;
  margin-bottom: 1rem;
}

.deck-card.is-selected .card-top-type {
  color: #34d399;
}

.card-body-content {
  margin-bottom: 1.5rem;
}

.card-avatar-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.deck-card.is-selected .card-avatar-icon {
  background: rgba(52, 211, 153, 0.15);
  border-color: rgba(52, 211, 153, 0.3);
  color: #34d399;
}

.card-role-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
}

.card-role-sub {
  font-size: 0.85rem;
  color: #94a3b8;
}

.card-footer-indicator {
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #64748b;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1rem;
}

.deck-card.is-selected .card-footer-indicator {
  color: #34d399;
}

.projection-panel {
  background: #0b121e;
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  position: relative;
  overflow: hidden;
}

.projection-top {
  margin-bottom: 2rem;
}

.projection-badge {
  display: inline-block;
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.projection-headline {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.projection-desc {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
  max-width: 800px;
}

.projection-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-pill-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #94a3b8;
}

.metric-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.metric-val {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.metric-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: rgba(52, 211, 153, 0.1);
  color: #34d399;
}

.animate-item {
  opacity: 0;
  transform: translateY(25px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.deck-section.is-visible .animate-item {
  opacity: 1;
  transform: translateY(0);
}

.delay-1 {
  transition-delay: 0.2s;
}

.animate-fade {
  animation: fadeInPanel 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInPanel {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .cards-deck-container,
  .projection-metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>