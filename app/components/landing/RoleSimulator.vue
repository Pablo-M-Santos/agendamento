<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const { isVisible } = useSectionReveal(sectionRef)
const selectedCard = ref(0)
const tabRefs = ref<HTMLElement[]>([])

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

// Linhas de métrica com count-up cancelável (conteúdo final sempre idêntico ao original)
const simulatorCards = reactive(
  cards.map((card) => ({
    ...card,
    rows: card.metrics.map((metric, mIndex) => ({
      label: metric.label,
      badge: metric.badge,
      count: useCountUp(metric.value, { duration: 1100, delay: mIndex * 120 })
    }))
  }))
)

const selectCard = (index: number) => {
  if (selectedCard.value === index) return
  selectedCard.value = index
}

const setTabRef = (el: Element | unknown, index: number) => {
  if (el instanceof HTMLElement) tabRefs.value[index] = el
}

const onSelectorKeydown = (event: KeyboardEvent) => {
  const total = cards.length
  let next: number | null = null

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      next = (selectedCard.value + 1) % total
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      next = (selectedCard.value - 1 + total) % total
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = total - 1
      break
    default:
      return
  }

  event.preventDefault()
  selectCard(next)
  tabRefs.value[next]?.focus()
}

// Count-ups das métricas da perspectiva ativa, ao revelar e ao trocar de perfil
const runActiveCounts = () => {
  const active = simulatorCards[selectedCard.value]
  if (!active) return
  active.rows.forEach((row) => row.count.run())
}

watch([isVisible, selectedCard], ([visible]) => {
  if (visible) runActiveCounts()
})
</script>

<template>
  <section
    id="deck-simulador"
    ref="sectionRef"
    class="deck-section"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="deck-inner">
      <header class="section-header animate-item">
        <span class="section-tag">Simulador Interativo</span>
        <h2 class="section-title">Escolha o perfil e veja o poder do sistema.</h2>
        <p class="section-desc">
          Clique nas cartas para alternar a perspectiva e projetar os indicadores de cada nível da
          sua operação.
        </p>
      </header>

      <div class="simulator animate-item delay-1">
        <!-- Seletor acessível de perspectivas (tablist com teclado) -->
        <div
          class="role-selector"
          role="tablist"
          aria-orientation="vertical"
          aria-label="Perspectivas do simulador"
          @keydown="onSelectorKeydown"
        >
          <button
            v-for="(card, index) in simulatorCards"
            :id="`role-tab-${index}`"
            :key="card.id"
            :ref="(el) => setTabRef(el, index)"
            class="role-tab"
            type="button"
            role="tab"
            aria-controls="role-panel"
            :aria-selected="selectedCard === index"
            :tabindex="selectedCard === index ? 0 : -1"
            @click="selectCard(index)"
          >
            <span class="role-icon" aria-hidden="true">
              <svg
                v-if="card.icon === 'chart'"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
              <svg
                v-else-if="card.icon === 'user'"
                width="22"
                height="22"
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
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </span>
            <span class="role-tab-info">
              <span class="role-tab-title">{{ card.role }}</span>
              <span class="role-tab-sub">{{ card.subtitle }}</span>
            </span>
            <span v-if="selectedCard === index" class="role-tab-flag" aria-hidden="true">
              ATIVO
            </span>
          </button>
        </div>

        <!-- Painel: viewport do produto + conteúdo real da perspectiva -->
        <div
          id="role-panel"
          class="simulator-panel"
          role="tabpanel"
          :aria-labelledby="`role-tab-${selectedCard}`"
          tabindex="0"
        >
          <div class="viewport-frame" aria-hidden="true">
            <div class="viewport-chrome">
              <div class="chrome-dots">
                <span class="dot red" />
                <span class="dot yellow" />
                <span class="dot green" />
              </div>
              <span class="chrome-tag">{{ simulatorCards[selectedCard]?.role }}</span>
            </div>

            <div class="viewport-stage">
              <Transition name="viewport" mode="out-in">
                <div :key="selectedCard" class="viewport-content">
                  <!-- Empreendedor: painel executivo -->
                  <div v-if="selectedCard === 0" class="vp vp-executive">
                    <div class="vp-toolbar">
                      <span class="vp-title">Painel do Proprietário</span>
                      <span class="live-pill"><span class="live-dot" /> Ao vivo</span>
                    </div>
                    <div class="vp-chart">
                      <svg
                        viewBox="0 0 400 120"
                        preserveAspectRatio="none"
                        role="presentation"
                        class="exec-svg"
                      >
                        <defs>
                          <linearGradient id="execFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#4FD1C5" stop-opacity="0.25" />
                            <stop offset="100%" stop-color="#4FD1C5" stop-opacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 96 C 44 88, 74 74, 110 80 S 176 52, 214 62 S 280 70, 316 44 S 368 30, 400 36 L400 120 L0 120 Z"
                          fill="url(#execFill)"
                        />
                        <path
                          d="M0 96 C 44 88, 74 74, 110 80 S 176 52, 214 62 S 280 70, 316 44 S 368 30, 400 36"
                          fill="none"
                          stroke="#4FD1C5"
                          stroke-width="2.5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    <div class="vp-chips">
                      <span class="vp-chip step" style="--i: 0">Faturamento</span>
                      <span class="vp-chip step" style="--i: 1">Comissões</span>
                      <span class="vp-chip step" style="--i: 2">Caixa</span>
                    </div>
                  </div>

                  <!-- Equipe: agenda multi-profissional -->
                  <div v-else-if="selectedCard === 1" class="vp vp-team">
                    <div class="vp-toolbar">
                      <span class="vp-title">Agenda da Equipe</span>
                      <span class="vp-meta">Hoje</span>
                    </div>
                    <div class="lanes">
                      <div class="lane step" style="--i: 0">
                        <span class="lane-name">Ana</span>
                        <div class="lane-track">
                          <span class="blk em" style="left: 4%; width: 26%">Corte</span>
                          <span class="blk teal" style="left: 42%; width: 30%">Avaliação</span>
                        </div>
                      </div>
                      <div class="lane step" style="--i: 1">
                        <span class="lane-name">Carlos</span>
                        <div class="lane-track">
                          <span class="blk teal" style="left: 12%; width: 32%">Consulta</span>
                          <span class="blk em" style="left: 58%; width: 24%">Retoque</span>
                        </div>
                      </div>
                      <div class="lane step" style="--i: 2">
                        <span class="lane-name">Bia</span>
                        <div class="lane-track">
                          <span class="blk em" style="left: 22%; width: 22%">Manicure</span>
                          <span class="blk mute" style="left: 64%; width: 14%">Livre</span>
                        </div>
                      </div>
                    </div>
                    <div class="lane-times step" style="--i: 3">
                      <span>08:00</span>
                      <span>12:00</span>
                      <span>17:00</span>
                    </div>
                  </div>

                  <!-- Cliente: reserva no celular -->
                  <div v-else class="vp vp-customer">
                    <div class="phone step" style="--i: 0">
                      <div class="phone-notch" />
                      <div class="phone-body">
                        <span class="phone-title">Novo agendamento</span>
                        <div class="phone-step" style="--i: 1">
                          <span class="step-num">1</span>
                          <span class="step-label">Serviço</span>
                          <span class="step-value">Corte</span>
                        </div>
                        <div class="phone-step" style="--i: 2">
                          <span class="step-num">2</span>
                          <span class="step-label">Horário</span>
                          <span class="step-value">14:30</span>
                        </div>
                        <div class="phone-step" style="--i: 3">
                          <span class="step-num">3</span>
                          <span class="step-label">Pagamento</span>
                          <span class="step-value">PIX • R$ 180,00</span>
                        </div>
                        <div class="phone-cta" style="--i: 4">Confirmar agendamento</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Conteúdo real da perspectiva (preservado do original) -->
          <div class="projection-panel">
            <div class="projection-top">
              <div class="projection-title-group">
                <span class="projection-badge"
                  >PERSPECTIVA DO {{ simulatorCards[selectedCard]?.role.toUpperCase() }}</span
                >
                <h3 class="projection-headline">{{ simulatorCards[selectedCard]?.headline }}</h3>
              </div>
              <p class="projection-desc">{{ simulatorCards[selectedCard]?.desc }}</p>
            </div>

            <div class="projection-metrics-grid">
              <div
                v-for="(row, mIdx) in simulatorCards[selectedCard]?.rows"
                :key="mIdx"
                class="metric-pill-card"
              >
                <span class="metric-label">{{ row?.label }}</span>
                <div class="metric-value-row">
                  <span class="metric-val">{{ row?.count.display }}</span>
                  <span class="metric-badge">{{ row?.badge }}</span>
                </div>
              </div>
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
  overflow: clip;
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

/* --- Simulador: seletor + painel --- */
.simulator {
  display: grid;
  grid-template-columns: minmax(260px, 4fr) minmax(0, 8fr);
  gap: 2.5rem;
  align-items: start;
}

.role-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-tab {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.1rem 1.25rem;
  background: rgba(13, 21, 34, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  color: inherit;
  transition:
    border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.role-tab:hover {
  border-color: rgba(52, 211, 153, 0.35);
  transform: translateX(4px);
}

.role-tab:focus-visible {
  outline: 2px solid rgba(52, 211, 153, 0.65);
  outline-offset: 3px;
}

.role-tab[aria-selected='true'] {
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.14) 0%, rgba(11, 18, 30, 0.95) 60%);
  border-color: rgba(52, 211, 153, 0.55);
  box-shadow: 0 12px 28px -12px rgba(52, 211, 153, 0.25);
}

.role-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.role-tab[aria-selected='true'] .role-icon {
  background: rgba(52, 211, 153, 0.15);
  border-color: rgba(52, 211, 153, 0.3);
  color: #34d399;
}

.role-tab-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.role-tab-title {
  font-size: 1rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

.role-tab-sub {
  font-size: 0.8rem;
  color: #94a3b8;
}

.role-tab-flag {
  margin-left: auto;
  font-family: monospace;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #34d399;
  background: rgba(52, 211, 153, 0.12);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

/* --- Viewport do produto --- */
.viewport-frame {
  background: rgba(11, 18, 30, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  overflow: hidden;
  margin-bottom: 1.25rem;
}

.viewport-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.chrome-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 9px;
  height: 9px;
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

.chrome-tag {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #34d399;
}

.viewport-stage {
  position: relative;
  height: 300px;
  overflow: hidden;
  padding: 1.35rem;
}

.viewport-content {
  display: block;
}

/* Transição de estado entre perspectivas */
.viewport-enter-active {
  transition:
    opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.viewport-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.viewport-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.viewport-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.vp {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vp-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vp-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e2e8f0;
}

.vp-meta {
  font-family: monospace;
  font-size: 0.68rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #4fd1c5;
  background: rgba(79, 209, 197, 0.1);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4fd1c5;
}

/* Cascata de entrada dos elementos do preview ativo */
.step {
  opacity: 0;
  transform: translateY(10px);
  animation: stepIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i, 0) * 90ms);
}

@keyframes stepIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Empreendedor */
.vp-chart {
  height: 130px;
}

.exec-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.vp-chips {
  display: flex;
  gap: 10px;
}

.vp-chip {
  font-size: 0.72rem;
  font-weight: 600;
  color: #a5b4fc;
  background: rgba(79, 209, 197, 0.08);
  border: 1px solid rgba(79, 209, 197, 0.25);
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
}

/* Equipe */
.lanes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lane {
  display: grid;
  grid-template-columns: 56px 1fr;
  align-items: center;
  gap: 12px;
}

.lane-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
}

.lane-track {
  position: relative;
  height: 30px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.blk {
  position: absolute;
  top: 3px;
  bottom: 3px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 0.64rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.blk.em {
  background: rgba(52, 211, 153, 0.22);
  border: 1px solid rgba(52, 211, 153, 0.45);
  color: #d1fae5;
}

.blk.teal {
  background: rgba(79, 209, 197, 0.16);
  border: 1px solid rgba(79, 209, 197, 0.4);
  color: #ccfbf1;
}

.blk.mute {
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  color: #64748b;
}

.lane-times {
  display: flex;
  justify-content: space-between;
  padding-left: 68px;
  font-family: monospace;
  font-size: 0.64rem;
  color: #475569;
}

/* Cliente */
.vp-customer {
  align-items: center;
}

.phone {
  width: min(260px, 100%);
  background: #0d1522;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 26px;
  padding: 0.75rem;
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.8);
}

.phone-notch {
  width: 72px;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0.15rem auto 0.75rem;
}

.phone-body {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.phone-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.2rem;
}

.phone-step {
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 0.5rem 0.65rem;
  opacity: 0;
  transform: translateY(8px);
  animation: stepIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i, 0) * 110ms);
}

.step-num {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(52, 211, 153, 0.16);
  border: 1px solid rgba(52, 211, 153, 0.4);
  color: #6ee7b7;
  font-size: 0.62rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-label {
  font-size: 0.68rem;
  color: #94a3b8;
}

.step-value {
  margin-left: auto;
  font-size: 0.7rem;
  font-weight: 700;
  color: #f1f5f9;
}

.phone-cta {
  margin-top: 0.25rem;
  text-align: center;
  font-size: 0.74rem;
  font-weight: 700;
  color: #052e24;
  background: #34d399;
  border-radius: 10px;
  padding: 0.6rem;
  opacity: 0;
  transform: translateY(8px);
  animation: stepIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--i, 0) * 110ms);
}

/* --- Painel de projeção (conteúdo real) --- */
.projection-panel {
  background: rgba(11, 18, 30, 0.9);
  border: 1px solid rgba(52, 211, 153, 0.2);
  border-radius: 22px;
  padding: 2rem;
}

.projection-top {
  margin-bottom: 1.75rem;
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
  font-size: 1.4rem;
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
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}

.metric-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: rgba(52, 211, 153, 0.1);
  color: #34d399;
  white-space: nowrap;
}

/* --- Entrada da seção --- */
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
  transition-delay: 0.2s;
}

@media (max-width: 900px) {
  .deck-section {
    padding: 5rem 1.25rem;
  }

  .simulator {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .role-selector {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.35rem;
    gap: 10px;
  }

  .role-tab {
    flex: 0 0 auto;
    min-width: 220px;
  }

  .role-tab:hover {
    transform: none;
  }

  .projection-metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
