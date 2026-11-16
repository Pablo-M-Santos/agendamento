<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const { isVisible } = useSectionReveal(sectionRef)

const activeModule = ref(0)
const scrollProgress = ref(0)
const trackOffset = ref(0)

const modules = [
  {
    number: '01',
    title: 'Gestão Unificada',
    headline: 'Agenda, equipe e serviços em uma só tela.',
    description:
      'Controle horários, profissionais e serviços em uma interface simples, feita para o ritmo real da sua operação.',
    metrics: ['26.000+ agendamentos', '99,9% uptime', 'Zero faltas'],
    preview: 'agenda'
  },
  {
    number: '02',
    title: 'Dashboard Analítico',
    headline: 'O faturamento do dia, ao vivo.',
    description:
      'Transforme o movimento do negócio em decisões claras com métricas de faturamento e fluxo de caixa em tempo real.',
    metrics: ['R$ 148 mil movimentados', '+24% produtividade', 'Relatórios automáticos'],
    preview: 'analytics'
  },
  {
    number: '03',
    title: 'Módulo de Clientes',
    headline: 'Cada cliente com nome, histórico e preferência.',
    description:
      'Tenha o contexto de cada relacionamento à mão para oferecer um atendimento mais próximo e criar novas oportunidades.',
    metrics: ['4,8/5 satisfação média', 'Retenção elevada', 'Lembretes via WhatsApp'],
    preview: 'clients'
  }
]

const progressLabel = computed(() => `${String(activeModule.value + 1).padStart(2, '0')} / 03`)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const updateScrollState = () => {
  const section = sectionRef.value
  if (!section || typeof window === 'undefined') return

  const sectionTop = section.getBoundingClientRect().top + window.scrollY
  const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
  const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollableDistance))

  scrollProgress.value = progress
  activeModule.value = Math.min(modules.length - 1, Math.round(progress * (modules.length - 1)))

  if (window.innerWidth > 900) {
    const panelWidth = Math.min(1180, Math.max(window.innerWidth - 48, 0))
    const panelGap = Math.min(128, Math.max(window.innerWidth * 0.08, 32))
    trackOffset.value = progress * (modules.length - 1) * (panelWidth + panelGap)
  } else {
    trackOffset.value = 0
  }
}

const selectModule = (index: number) => {
  const section = sectionRef.value
  if (!section || typeof window === 'undefined') return

  if (window.innerWidth <= 900) {
    const panel = section.querySelectorAll<HTMLElement>('.module-panel')[index]
    panel?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start'
    })
    return
  }

  const sectionTop = section.getBoundingClientRect().top + window.scrollY
  const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
  const target = sectionTop + (index / (modules.length - 1)) * scrollableDistance

  window.scrollTo({
    top: target,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('resize', updateScrollState)
  updateScrollState()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('resize', updateScrollState)
})
</script>

<template>
  <section
    id="modulos"
    ref="sectionRef"
    class="modules-section"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="modules-scroll-area">
      <div class="modules-scene">
        <div class="modules-shell">
          <header class="modules-header">
            <div>
              <span class="modules-eyebrow">Arquitetura da operação</span>
              <h2 class="modules-title">Tudo conectado.<br /><em>Nada perdido.</em></h2>
            </div>
            <p class="modules-intro">
              Um sistema que acompanha cada decisão do negócio, do primeiro agendamento ao próximo
              relacionamento.
            </p>
          </header>

          <div class="modules-navigation" aria-label="Navegação dos módulos">
            <button
              v-for="(module, index) in modules"
              :key="module.number"
              class="navigation-item"
              :class="{ 'is-active': activeModule === index }"
              :aria-current="activeModule === index ? 'step' : undefined"
              type="button"
              @click="selectModule(index)"
            >
              <span>{{ module.number }}</span>
              <span>{{ module.title }}</span>
            </button>
            <span class="navigation-progress">{{ progressLabel }}</span>
          </div>

          <div
            class="modules-track"
            :style="{ transform: `translate3d(-${trackOffset}px, 0, 0)` }"
          >
            <article
              v-for="(module, index) in modules"
              :key="module.number"
              class="module-panel"
              :class="{ 'is-active': activeModule === index }"
            >
              <div class="module-copy">
                <span class="module-index">{{ module.number }}</span>
                <h3 class="module-title">{{ module.title }}</h3>
                <p class="module-headline">{{ module.headline }}</p>
                <p class="module-description">{{ module.description }}</p>

                <ul class="module-metrics">
                  <li v-for="metric in module.metrics" :key="metric">
                    <span class="metric-dot" />
                    {{ metric }}
                  </li>
                </ul>
              </div>

              <div class="module-preview" :class="`preview-${module.preview}`">
                <div class="preview-topbar">
                  <span class="preview-lights"><i /><i /><i /></span>
                  <span>{{ module.title }}</span>
                </div>

                <div v-if="module.preview === 'agenda'" class="agenda-preview">
                  <div class="preview-heading">
                    <strong>Esta semana</strong>
                    <span>OUTUBRO</span>
                  </div>
                  <div class="agenda-days">
                    <span v-for="day in ['SEG', 'TER', 'QUA', 'QUI', 'SEX']" :key="day">{{ day }}</span>
                  </div>
                  <div class="agenda-list">
                    <div class="agenda-row is-filled"><time>09:00</time><b>Corte · Camila R.</b></div>
                    <div class="agenda-row"><time>10:00</time><span>Horário livre</span></div>
                    <div class="agenda-row is-highlighted"><time>11:00</time><b>Avaliação · João M.</b></div>
                    <div class="agenda-row is-filled"><time>14:00</time><b>Manicure · Ana P.</b></div>
                  </div>
                </div>

                <div v-else-if="module.preview === 'analytics'" class="analytics-preview">
                  <div class="preview-heading">
                    <strong>Fluxo de caixa</strong>
                    <span class="live-status"><i /> TEMPO REAL</span>
                  </div>
                  <div class="analytics-total">R$ 148.240 <small>+24,8%</small></div>
                  <div class="chart">
                    <span v-for="height in [38, 52, 45, 70, 58, 84, 66]" :key="height" :style="{ height: `${height}%` }" />
                  </div>
                  <span class="chart-caption">Últimos 7 dias</span>
                </div>

                <div v-else class="clients-preview">
                  <div class="preview-heading">
                    <strong>Base de clientes</strong>
                    <span class="search-pill">Buscar cliente...</span>
                  </div>
                  <div class="client-list">
                    <div><i>CR</i><b>Camila Rocha</b><span>Recorrente</span></div>
                    <div><i>JM</i><b>João Martins</b><span>Lembrete enviado</span></div>
                    <div><i>AP</i><b>Ana Paula</b><span>Primeiro agendamento</span></div>
                    <div><i>RS</i><b>Ricardo Souza</b><span>Fidelidade</span></div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div class="scroll-hint">
            <span class="scroll-line"><i :style="{ width: `${scrollProgress * 100}%` }" /></span>
            <span>Continue rolando para explorar</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.modules-section {
  --module-bg: #0c1422;
  position: relative;
  background: var(--module-bg);
}

.modules-scroll-area {
  height: 300vh;
}

.modules-scene {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  min-height: 100svh;
  overflow: hidden;
  padding: clamp(5rem, 9vh, 8rem) 0 3rem;
}

.modules-shell {
  width: 100%;
  overflow: hidden;
}

.modules-header,
.modules-navigation,
.modules-track,
.scroll-hint {
  width: min(1180px, calc(100% - 3rem));
  margin-inline: auto;
}

.modules-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 3rem;
  margin-bottom: 2rem;
}

.modules-eyebrow {
  display: inline-block;
  margin-bottom: 1rem;
  color: #34d399;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.modules-title {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(2.2rem, 5vw, 4.6rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.96;
}

.modules-title em {
  color: #34d399;
  font-style: normal;
}

.modules-intro {
  max-width: 31ch;
  margin: 0 0 0.25rem;
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1.65;
}

.modules-navigation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.navigation-item {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.8rem;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: #64748b;
  font: inherit;
  font-size: 0.72rem;
  cursor: pointer;
  transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.navigation-item span:first-child {
  color: #475569;
  font-family: monospace;
}

.navigation-item.is-active {
  border-color: rgba(52, 211, 153, 0.35);
  background: rgba(52, 211, 153, 0.1);
  color: #d1fae5;
}

.navigation-item.is-active span:first-child {
  color: #34d399;
}

.navigation-progress {
  margin-left: auto;
  color: #475569;
  font-family: monospace;
  font-size: 0.7rem;
}

.modules-track {
  display: flex;
  width: 300vw;
  max-width: none;
  margin-left: max(1.5rem, calc((100% - 1180px) / 2));
  transition: transform 0.15s linear;
  will-change: transform;
}

.module-panel {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(420px, 1.2fr);
  align-items: center;
  gap: clamp(2rem, 8vw, 8rem);
  width: min(1180px, calc(100vw - 3rem));
  min-width: min(1180px, calc(100vw - 3rem));
  margin-right: clamp(2rem, 8vw, 8rem);
  opacity: 0.55;
  transition: opacity 0.35s ease;
}

.module-panel.is-active {
  opacity: 1;
}

.module-copy {
  min-width: 0;
}

.module-index {
  display: block;
  margin-bottom: 1.5rem;
  color: #34d399;
  font-family: monospace;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.module-title {
  margin: 0 0 1rem;
  color: #f8fafc;
  font-size: clamp(1.8rem, 3.2vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1;
}

.module-headline {
  max-width: 29ch;
  margin: 0 0 1rem;
  color: #6ee7b7;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  font-weight: 600;
  line-height: 1.4;
}

.module-description {
  max-width: 39ch;
  margin: 0;
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.7;
}

.module-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}

.module-metrics li {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #cbd5e1;
  font-size: 0.75rem;
}

.metric-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: #34d399;
}

.module-preview {
  min-width: 0;
  min-height: 390px;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(20, 32, 50, 0.96), rgba(11, 20, 34, 0.84));
  box-shadow: 0 30px 80px -45px rgba(0, 0, 0, 0.9);
}

.preview-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  color: #64748b;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-lights {
  display: flex;
  gap: 0.35rem;
}

.preview-lights i {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #334155;
}

.preview-lights i:first-child { background: #ef4444; }
.preview-lights i:nth-child(2) { background: #f59e0b; }
.preview-lights i:last-child { background: #10b981; }

.agenda-preview,
.analytics-preview,
.clients-preview {
  padding: 2rem 1rem 1rem;
}

.preview-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.preview-heading strong {
  color: #e2e8f0;
  font-size: 0.95rem;
}

.preview-heading > span {
  color: #64748b;
  font-family: monospace;
  font-size: 0.65rem;
}

.agenda-days {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.agenda-days span {
  padding: 0.55rem 0;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  font-size: 0.65rem;
  text-align: center;
}

.agenda-days span:nth-child(3) {
  background: #34d399;
  color: #052e24;
}

.agenda-list {
  display: grid;
  gap: 0.55rem;
}

.agenda-row {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  align-items: center;
  gap: 0.8rem;
  min-height: 2.6rem;
  padding: 0 0.75rem;
  border-radius: 0.7rem;
  background: rgba(255, 255, 255, 0.025);
  color: #64748b;
  font-size: 0.72rem;
}

.agenda-row time {
  font-family: monospace;
  font-size: 0.65rem;
}

.agenda-row.is-filled { color: #d1fae5; background: rgba(52, 211, 153, 0.13); }
.agenda-row.is-highlighted { color: #a5f3fc; background: rgba(79, 209, 197, 0.1); }

.live-status {
  color: #34d399 !important;
}

.live-status i {
  display: inline-block;
  width: 0.35rem;
  height: 0.35rem;
  margin-right: 0.3rem;
  border-radius: 50%;
  background: #34d399;
}

.analytics-total {
  color: #f8fafc;
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  font-weight: 800;
}

.analytics-total small {
  color: #34d399;
  font-size: 0.75rem;
  font-weight: 600;
}

.chart {
  display: flex;
  align-items: end;
  gap: 0.7rem;
  height: 190px;
  margin-top: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.chart span {
  flex: 1;
  border-radius: 0.35rem 0.35rem 0 0;
  background: linear-gradient(#34d399, rgba(52, 211, 153, 0.2));
}

.chart-caption {
  display: block;
  margin-top: 0.8rem;
  color: #64748b;
  font-family: monospace;
  font-size: 0.65rem;
}

.search-pill {
  padding: 0.35rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
}

.client-list {
  display: grid;
  gap: 0.7rem;
}

.client-list > div {
  display: grid;
  grid-template-columns: 2.2rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.025);
}

.client-list i {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: rgba(52, 211, 153, 0.14);
  color: #6ee7b7;
  font-size: 0.65rem;
  font-style: normal;
  font-weight: 700;
}

.client-list b {
  min-width: 0;
  color: #e2e8f0;
  font-size: 0.75rem;
}

.client-list span {
  max-width: 10rem;
  color: #94a3b8;
  font-size: 0.62rem;
  text-align: right;
}

.scroll-hint {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  color: #64748b;
  font-size: 0.68rem;
}

.scroll-line {
  display: block;
  width: 5rem;
  height: 1px;
  background: rgba(255, 255, 255, 0.13);
}

.scroll-line i {
  display: block;
  height: 100%;
  background: #34d399;
}

@media (max-width: 900px) {
  .modules-section { background: #0c1422; }
  .modules-scroll-area { height: auto; }
  .modules-scene {
    position: relative;
    display: block;
    min-height: 0;
    padding: 5rem 0;
    overflow: visible;
  }
  .modules-header {
    display: block;
    width: min(100% - 2.5rem, 680px);
    margin-bottom: 2rem;
  }
  .modules-intro {
    margin-top: 1.5rem;
  }
  .modules-navigation {
    width: min(100% - 2.5rem, 680px);
    margin-bottom: 1rem;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .modules-navigation::-webkit-scrollbar { display: none; }
  .navigation-progress { display: none; }
  .modules-track {
    display: grid;
    width: min(100% - 2.5rem, 680px);
    margin-inline: auto;
    transform: none !important;
  }
  .module-panel {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 2rem;
    width: 100%;
    min-width: 0;
    margin: 0 0 4rem;
    opacity: 1;
  }
  .module-index { margin-bottom: 1rem; }
  .module-title { font-size: 2rem; }
  .module-metrics { margin-top: 1.5rem; }
  .module-preview {
    min-height: 300px;
    padding: 1rem;
  }
  .agenda-preview,
  .analytics-preview,
  .clients-preview {
    padding: 1.5rem 0.5rem 0.5rem;
  }
  .chart { height: 140px; }
  .scroll-hint { display: none; }
}

@media (max-width: 480px) {
  .modules-header,
  .modules-navigation,
  .modules-track {
    width: min(100% - 2rem, 680px);
  }
  .modules-title { font-size: 2.3rem; }
  .module-title { font-size: 1.7rem; }
  .module-preview { border-radius: 18px; }
  .client-list > div { grid-template-columns: 2rem minmax(0, 1fr); }
  .client-list span { grid-column: 2; text-align: left; }
}

@media (prefers-reduced-motion: reduce) {
  .modules-track,
  .module-panel,
  .navigation-item {
    transition: none;
  }
}
</style>
