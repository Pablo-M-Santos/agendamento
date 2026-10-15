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
      <!-- Cabeçalho -->
      <header class="section-header animate-item">
        <span class="section-tag">Simulador Interativo</span>
        <h2 class="section-title">Escolha o perfil e veja o poder do sistema.</h2>
        <p class="section-desc">
          Clique nas cartas para alternar a perspectiva e projetar os indicadores de cada nível da
          sua operação.
        </p>
      </header>

      <!-- Deck de Cartas estilo "Yu-Gi-Oh / Seleção de Personagem" -->
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

      <!-- Painel de Resumo Inferior (Holograma/Terminal de Métricas do Card Ativo) -->
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

        <!-- Métricas em Linha -->
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
  background: linear-gradient(180deg, #080d14 0%, #0b121e 50%, #0d1726 100%);

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
  max-width: 600px;
  margin-bottom: 3.5rem;
}

.section-tag {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid rgba(52, 211, 153, 0.2);
  display: inline-block;
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
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

/* DECK DE CARTAS (ESTILO YU-GI-OH / DECK TECNOLÓGICO) */
.cards-deck-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  perspective: 1000px;
}

.deck-card {
  position: relative;
  background: rgba(12, 20, 34, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 1.75rem;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

/* Estado inativo/apagado */
.deck-card.is-dimmed {
  opacity: 0.45;
  filter: grayscale(40%);
  transform: scale(0.96) translateY(5px);
}

.deck-card.is-dimmed:hover {
  opacity: 0.8;
  filter: grayscale(0%);
  transform: scale(0.98) translateY(0);
  border-color: rgba(52, 211, 153, 0.25);
}

/* Estado Ativo/Selecionado */
.deck-card.is-selected {
  opacity: 1;
  filter: grayscale(0%);
  transform: scale(1.03) translateY(-8px);
  background: linear-gradient(
    145deg,
    rgba(52, 211, 153, 0.15) 0%,
    rgba(12, 20, 34, 0.9) 60%,
    rgba(8, 13, 20, 0.95) 100%
  );
  border-color: rgba(52, 211, 153, 0.6);
  box-shadow:
    0 20px 40px -15px rgba(0, 0, 0, 0.7),
    0 0 25px rgba(52, 211, 153, 0.18);
}

.card-top-type {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #64748b;
  font-family: monospace;
}

.deck-card.is-selected .card-top-type {
  color: #34d399;
}

.card-avatar-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(52, 211, 153, 0.08);
  border: 1px solid rgba(52, 211, 153, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
  margin-bottom: 1.25rem;
}

.card-role-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.card-role-sub {
  font-size: 0.825rem;
  color: #94a3b8;
}

.card-footer-indicator {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #475569;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.deck-card.is-selected .card-footer-indicator {
  color: #34d399;
}

/* PAINEL DE PROJEÇÃO INFERIOR */
.projection-panel {
  background: linear-gradient(135deg, rgba(12, 20, 34, 0.85) 0%, rgba(8, 13, 20, 0.95) 100%);
  border: 1px solid rgba(52, 211, 153, 0.25);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}

.projection-top {
  margin-bottom: 2rem;
}

.projection-badge {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.projection-headline {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  margin-bottom: 0.5rem;
}

.projection-desc {
  font-size: 0.975rem;
  color: #94a3b8;
  line-height: 1.65;
}

.projection-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.metric-pill-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.25rem;
  border-radius: 16px;
}

.metric-label {
  font-size: 0.8rem;
  color: #64748b;
  display: block;
  margin-bottom: 0.5rem;
}

.metric-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metric-val {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.02em;
}

.metric-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

/* Animações */
.animate-item {
  opacity: 0;
  transform: translateY(25px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.deck-section.is-visible .animate-item {
  opacity: 1;
  transform: translateY(0);
}

.delay-1 {
  transition-delay: 0.15s;
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
  animation: fadeIn 0.35s ease forwards;
}

@media (max-width: 868px) {
  .cards-deck-container,
  .projection-metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
