<script setup lang="ts">
import { ref, onMounted, onUnmounted, type ComponentPublicInstance } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const { isVisible } = useSectionReveal(sectionRef)
const activeTab = ref(0)
const chapterRefs = ref<HTMLElement[]>([])

const modules = [
  {
    id: 0,
    title: 'Gestão Unificada',
    headline: 'Agenda, equipe e serviços em uma só tela.',
    subtitle:
      'Controle centralizado de horários, profissionais e serviços em uma única interface fluida.',
    metrics: ['26.000+ Agendamentos', '99.9% Uptime', 'Zero Faltas']
  },
  {
    id: 1,
    title: 'Dashboard Analítico',
    headline: 'O faturamento do dia, ao vivo.',
    subtitle: 'Métricas de faturamento e fluxo de caixa processadas e exibidas em tempo real.',
    metrics: ['R$ 148k+ Movimentados', '+24% Produtividade', 'Relatórios Automáticos']
  },
  {
    id: 2,
    title: 'Módulo de Clientes',
    headline: 'Cada cliente com nome, histórico e preferência.',
    subtitle:
      'Histórico de atendimento, preferências e CRM integrado para fidelizar seus pacientes ou clientes.',
    metrics: ['4.8/5 Satisfação Média', 'Retenção Elevada', 'Lembretes via WhatsApp']
  }
]

const agendaSlots = [
  { time: '09:00', label: 'Corte • Camila R.', kind: 'filled' },
  { time: '10:00', label: 'Horário livre', kind: 'free' },
  { time: '11:00', label: 'Avaliação • João M.', kind: 'outline' },
  { time: '14:00', label: 'Manicure • Ana P.', kind: 'filled' },
  { time: '15:00', label: 'Horário livre', kind: 'free' }
]

const crmRows = [
  { initials: 'CR', name: 'Camila Rocha', chip: 'Recorrente' },
  { initials: 'JM', name: 'João Martins', chip: 'WhatsApp • lembrete enviado' },
  { initials: 'AP', name: 'Ana Paula', chip: 'Primeiro agendamento' },
  { initials: 'RS', name: 'Ricardo Souza', chip: 'Fidelidade' }
]

const chartBars = [46, 62, 38, 78, 55, 88, 66]

let chapterObserver: IntersectionObserver | null = null

const setChapterRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el instanceof HTMLElement) chapterRefs.value[index] = el
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const goToChapter = (index: number) => {
  activeTab.value = index
  const el = chapterRefs.value[index]
  if (!el) return
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'center'
  })
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') return

  chapterObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const index = Number((entry.target as HTMLElement).dataset.index)
        if (!Number.isNaN(index)) activeTab.value = index
      }
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
  )

  chapterRefs.value.forEach((el) => el && chapterObserver?.observe(el))
})

onUnmounted(() => {
  if (chapterObserver) chapterObserver.disconnect()
})
</script>

<template>
  <section
    id="modulos"
    ref="sectionRef"
    class="modules-section"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="modules-inner">
      <header class="modules-header animate-item">
        <h2 class="modules-title">Arquitetura pensada para<br />a sua autonomia.</h2>
        <p class="modules-desc">
          Navegue pelos módulos que compõem o ecossistema e descubra como automatizamos cada rotina
          da sua empresa.
        </p>
      </header>

      <div class="journey animate-item delay-1">
        <!-- Coluna esquerda: espinha de capítulos (scroll narrative) -->
        <div class="journey-chapters">
          <div class="spine" aria-hidden="true">
            <span
              class="spine-fill"
              :style="{ height: ((activeTab + 1) / modules.length) * 100 + '%' }"
            />
          </div>

          <button
            v-for="(mod, index) in modules"
            :key="mod.id"
            :ref="(el) => setChapterRef(el, index)"
            :data-index="index"
            class="chapter"
            :class="{ active: activeTab === index }"
            :aria-current="activeTab === index ? 'step' : undefined"
            aria-controls="module-stage-viewport"
            type="button"
            @click="goToChapter(index)"
          >
            <span class="chapter-number">0{{ index + 1 }}</span>
            <div class="chapter-info">
              <h3 class="chapter-title">{{ mod.title }}</h3>
              <p class="chapter-headline">{{ mod.headline }}</p>
              <p class="chapter-subtitle">{{ mod.subtitle }}</p>
            </div>
          </button>
        </div>

        <!-- Coluna direita: palco sticky com previews reais do produto -->
        <div class="journey-stage">
          <div id="module-stage-viewport" class="stage-frame">
            <div class="stage-chrome" aria-hidden="true">
              <div class="preview-dots">
                <span class="dot red" />
                <span class="dot yellow" />
                <span class="dot green" />
              </div>
              <span class="preview-tag">{{ modules[activeTab]?.title }}</span>
            </div>

            <div class="stage-viewport" aria-hidden="true">
              <!-- Preview 1: Agenda de agendamentos -->
              <div class="preview preview-agenda" :class="{ 'is-active': activeTab === 0 }">
                <div class="mock-toolbar layer" style="--i: 0">
                  <span class="mock-toolbar-title">Esta semana</span>
                  <span class="mock-toolbar-meta">Outubro</span>
                </div>
                <div class="agenda-days layer" style="--i: 1">
                  <span
                    v-for="(day, d) in ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']"
                    :key="day"
                    class="agenda-day"
                    :class="{ active: d === 2 }"
                  >
                    {{ day }}
                  </span>
                </div>
                <div class="agenda-slots">
                  <div
                    v-for="(slot, sIndex) in agendaSlots"
                    :key="slot.time"
                    class="agenda-slot layer"
                    :style="{ '--i': 2 + sIndex }"
                  >
                    <span class="slot-time">{{ slot.time }}</span>
                    <span class="slot-block" :class="slot.kind">{{ slot.label }}</span>
                  </div>
                </div>
              </div>

              <!-- Preview 2: Dashboard analítico -->
              <div class="preview preview-analytics" :class="{ 'is-active': activeTab === 1 }">
                <div class="mock-toolbar layer" style="--i: 0">
                  <span class="mock-toolbar-title">Fluxo de caixa</span>
                  <span class="live-pill"><span class="live-dot" /> Tempo real</span>
                </div>
                <div class="chart-area layer" style="--i: 1">
                  <svg
                    class="chart-svg"
                    viewBox="0 0 400 140"
                    preserveAspectRatio="none"
                    role="presentation"
                  >
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#34d399" stop-opacity="0.28" />
                        <stop offset="100%" stop-color="#34d399" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      class="chart-area-fill"
                      d="M0 112 C 36 104, 60 88, 92 92 S 150 58, 188 66 S 252 84, 288 58 S 352 34, 400 42 L400 140 L0 140 Z"
                      fill="url(#chartFill)"
                    />
                    <path
                      class="chart-line"
                      pathLength="1"
                      d="M0 112 C 36 104, 60 88, 92 92 S 150 58, 188 66 S 252 84, 288 58 S 352 34, 400 42"
                      fill="none"
                      stroke="#34d399"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <div class="chart-bars layer" style="--i: 2">
                  <span
                    v-for="(height, bIndex) in chartBars"
                    :key="bIndex"
                    class="chart-bar"
                    :style="{ height: height + '%', '--i': bIndex }"
                  />
                </div>
                <p class="chart-caption layer" style="--i: 3">Últimos 7 dias</p>
              </div>

              <!-- Preview 3: CRM de clientes -->
              <div class="preview preview-crm" :class="{ 'is-active': activeTab === 2 }">
                <div class="mock-toolbar layer" style="--i: 0">
                  <span class="mock-toolbar-title">Base de clientes</span>
                  <span class="mock-search">Buscar cliente…</span>
                </div>
                <div class="crm-list">
                  <div
                    v-for="(row, rIndex) in crmRows"
                    :key="row.name"
                    class="crm-row layer"
                    :style="{ '--i': 1 + rIndex }"
                  >
                    <span class="crm-avatar">{{ row.initials }}</span>
                    <span class="crm-name">{{ row.name }}</span>
                    <span class="crm-chip">{{ row.chip }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="stage-metrics">
              <div
                v-for="(metric, mIndex) in modules[activeTab]?.metrics"
                :key="mIndex"
                class="metric-pill"
              >
                <svg
                  class="metric-check"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
  overflow: clip;
}

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

/* --- JORNADA: capítulos à esquerda + palco sticky à direita --- */
.journey {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(0, 1.15fr);
  gap: 4rem;
  align-items: start;
}

.journey-chapters {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Espinha luminosa que acompanha o capítulo ativo */
.spine {
  position: absolute;
  left: 0;
  top: 8vh;
  bottom: 8vh;
  width: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
}

.spine-fill {
  display: block;
  width: 100%;
  background: linear-gradient(180deg, #34d399, #10b981);
  border-radius: 999px;
  transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.chapter {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  min-height: 72vh;
  padding: 2rem 0 2rem 2.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: inherit;
  opacity: 0.45;
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.chapter:hover,
.chapter:focus-visible {
  opacity: 0.85;
}

.chapter.active {
  opacity: 1;
}

.chapter:focus-visible {
  outline: 2px solid rgba(52, 211, 153, 0.6);
  outline-offset: 6px;
  border-radius: 12px;
}

.chapter-number {
  flex-shrink: 0;
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  transition:
    background 0.35s ease,
    color 0.35s ease;
}

.chapter.active .chapter-number {
  background: rgba(52, 211, 153, 0.18);
  color: #6ee7b7;
}

.chapter-title {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.chapter-headline {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.45;
  color: #34d399;
  margin-bottom: 0.75rem;
}

.chapter-subtitle {
  font-size: 0.925rem;
  color: #94a3b8;
  line-height: 1.6;
  max-width: 420px;
}

/* --- PALCO STICKY --- */
.journey-stage {
  position: sticky;
  top: 110px;
  align-self: start;
}

.stage-frame {
  background: rgba(12, 20, 34, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.7);
}

.stage-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  transition: color 0.35s ease;
}

.stage-viewport {
  position: relative;
  height: clamp(320px, 44vh, 420px);
  overflow: hidden;
}

.preview {
  position: absolute;
  inset: 0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  opacity: 0;
  transform: translateX(24px);
  pointer-events: none;
  transition:
    opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.preview.is-active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

/* Revelação em cascata dos elementos dentro do preview ativo */
.layer {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--i, 0) * 70ms);
}

.preview.is-active .layer {
  opacity: 1;
  transform: translateY(0);
}

.mock-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mock-toolbar-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: -0.01em;
}

.mock-toolbar-meta {
  font-family: monospace;
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Preview 1: agenda */
.agenda-days {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.agenda-day {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  padding: 0.4rem 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.agenda-day.active {
  color: #052e24;
  background: #34d399;
  border-color: #34d399;
}

.agenda-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.agenda-slot {
  display: grid;
  grid-template-columns: 52px 1fr;
  align-items: center;
  gap: 12px;
}

.slot-time {
  font-family: monospace;
  font-size: 0.7rem;
  color: #64748b;
}

.slot-block {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
}

.slot-block.filled {
  color: #ecfdf5;
  background: rgba(52, 211, 153, 0.16);
  border: 1px solid rgba(52, 211, 153, 0.35);
}

.slot-block.outline {
  color: #a5f3fc;
  background: rgba(79, 209, 197, 0.08);
  border: 1px solid rgba(79, 209, 197, 0.3);
}

.slot-block.free {
  color: #64748b;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  font-weight: 500;
}

/* Preview 2: analytics */
.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.chart-area {
  flex: 1;
  min-height: 0;
}

.chart-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.chart-area-fill {
  opacity: 0;
  transition: opacity 0.6s ease 0.35s;
}

.preview-analytics.is-active .chart-area-fill {
  opacity: 1;
}

.chart-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.preview-analytics.is-active .chart-line {
  animation: drawChartLine 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
}

@keyframes drawChartLine {
  to {
    stroke-dashoffset: 0;
  }
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 56px;
}

.chart-bar {
  flex: 1;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(180deg, rgba(52, 211, 153, 0.85), rgba(16, 185, 129, 0.35));
  transform: scaleY(0.04);
  transform-origin: bottom;
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(0.25s + var(--i, 0) * 60ms);
}

.preview-analytics.is-active .chart-bar {
  transform: scaleY(1);
}

.chart-caption {
  font-family: monospace;
  font-size: 0.68rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Preview 3: CRM */
.mock-search {
  font-size: 0.72rem;
  color: #64748b;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
}

.crm-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.crm-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.7rem 0.85rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.crm-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 700;
  color: #6ee7b7;
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.25);
}

.crm-name {
  flex: 1;
  font-size: 0.82rem;
  font-weight: 600;
  color: #e2e8f0;
}

.crm-chip {
  font-size: 0.66rem;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.22rem 0.6rem;
  border-radius: 9999px;
  white-space: nowrap;
}

/* Métricas reais do módulo ativo */
.stage-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 1.25rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.metric-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #e2e8f0;
}

.metric-check {
  width: 16px;
  height: 16px;
  color: #34d399;
  flex-shrink: 0;
}

/* --- Entrada da seção --- */
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

@media (max-width: 968px) {
  .modules-section {
    padding: 5rem 1.25rem;
  }

  .journey {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  /* No mobile o palco fica sticky no topo e os capítulos rolam sob ele */
  .journey-stage {
    order: -1;
    top: 88px;
    z-index: 3;
  }

  .stage-viewport {
    height: clamp(300px, 42vh, 380px);
  }

  .chapter {
    min-height: 55vh;
    padding-left: 2rem;
  }

  .spine {
    top: 4vh;
    bottom: 4vh;
  }
}
</style>
