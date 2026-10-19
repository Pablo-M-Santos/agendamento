<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const { isVisible } = useSectionReveal(sectionRef)

const stats = [
  { value: 'R$ 2.5M+', label: 'Transacionados', desc: 'Processados em agendamentos' },
  { value: '99.8%', label: 'Uptime Garantido', desc: 'Disponibilidade e estabilidade' },
  { value: '150k+', label: 'Horários Marcados', desc: 'Sem necessidade de WhatsApp' },
  { value: '4.9/5', label: 'Satisfação Média', desc: 'Avaliação dos nossos clientes' }
] as const

const testimonials = [
  {
    quote:
      'Eliminamos completamente a necessidade de responder mensagens para agendar. O cliente escolhe, paga e o horário cai direto na agenda.',
    author: 'Ricardo Mendes',
    role: 'Proprietário',
    company: 'Studio Mendes Barber',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    quote:
      'O controle de caixa em tempo real mudou nossa operação. Antes perdíamos horas fechando o dia, hoje está tudo automatizado.',
    author: 'Camila Fernandes',
    role: 'Gestora de Operações',
    company: 'Clínica BioEstética',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
  },
  {
    quote:
      'A experiência de uso é impecável. Nossos clientes elogiam a facilidade do agendamento e a taxa de faltas caiu praticamente a zero.',
    author: 'Lucas Silveira',
    role: 'Fundador',
    company: 'Consultoria Silveira',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  }
] as const

const dominant = stats[0]

// Count-ups acessíveis e canceláveis; o valor final é sempre o texto original.
const dominantCount = useCountUp(dominant.value, { duration: 1500 })

const supportRows = reactive([
  {
    stat: stats[1],
    viz: 'ring',
    count: useCountUp(stats[1].value, { duration: 1500, delay: 150 })
  },
  {
    stat: stats[2],
    viz: 'dots',
    count: useCountUp(stats[2].value, { duration: 1500, delay: 300 })
  },
  {
    stat: stats[3],
    viz: 'score',
    count: useCountUp(stats[3].value, { duration: 1500, delay: 450 })
  }
])

const featured = testimonials[0]
const sideQuotes = testimonials.slice(1)

// Matriz honesta: 50 pontos × 3.000 horários = 150k+
const dotMatrix = Array.from({ length: 50 }, (_, i) => i)

watch(isVisible, (visible) => {
  if (!visible) return
  dominantCount.run()
  supportRows.forEach((row) => row.count.run())
})
</script>

<template>
  <section
    id="depoimentos"
    ref="sectionRef"
    class="social-proof-section"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="social-proof-inner">
      <!-- Cabeçalho -->
      <header class="social-proof-header animate-item">
        <span class="section-tag">Resultados Comprovados</span>
        <h2 class="social-proof-title">Confiado por quem busca<br />eficiência de verdade.</h2>
        <p class="social-proof-desc">
          Empresas e profissionais que otimizaram o tempo e escalaram suas operações com o nosso
          sistema.
        </p>
      </header>

      <!-- Faixa editorial: métrica dominante + métricas de apoio assimétricas -->
      <div class="proof-grid animate-item delay-1">
        <div class="proof-dominant">
          <span class="dominant-value">{{ dominantCount.display }}</span>
          <span class="dominant-rule" aria-hidden="true" />
          <span class="dominant-label">{{ dominant.label }}</span>
          <p class="dominant-desc">{{ dominant.desc }}</p>
        </div>

        <div class="proof-supporting">
          <div v-for="row in supportRows" :key="row.stat.value" class="support-row">
            <div class="support-info">
              <span class="support-value">{{ row.count.display }}</span>
              <span class="support-label">{{ row.stat.label }}</span>
              <span class="support-desc">{{ row.stat.desc }}</span>
            </div>

            <!-- Micro-viz: cada traço representa apenas o valor já declarado acima -->
            <div class="support-viz" aria-hidden="true">
              <!-- 99.8% → anel preenchido em 99.8% -->
              <svg v-if="row.viz === 'ring'" class="viz-ring" viewBox="0 0 64 64">
                <circle class="ring-track" cx="32" cy="32" r="26" />
                <circle class="ring-progress" cx="32" cy="32" r="26" pathLength="100" />
              </svg>

              <!-- 150k+ → 50 pontos, cada ponto = 3.000 horários -->
              <div v-else-if="row.viz === 'dots'" class="viz-dots-wrap">
                <div class="viz-dots">
                  <span
                    v-for="dot in dotMatrix"
                    :key="dot"
                    class="viz-dot"
                    :style="{ '--i': dot }"
                  />
                </div>
                <span class="viz-legend">cada ponto = 3.000 horários</span>
              </div>

              <!-- 4.9/5 → barra em 98% + estrelas -->
              <div v-else class="viz-score">
                <div class="score-stars">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#059669"
                  >
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                  </svg>
                </div>
                <div class="score-meter">
                  <span class="score-meter-fill" />
                </div>
                <span class="viz-legend">4,9 de 5,0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Depoimentos: destaque editorial + pull quotes secundárias -->
      <div class="testimonials-editorial animate-item delay-2">
        <figure class="quote-featured">
          <span class="quote-mark" aria-hidden="true">“</span>
          <div class="stars-rating" aria-hidden="true">
            <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="#059669">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </div>
          <blockquote class="quote-featured-text">"{{ featured.quote }}"</blockquote>
          <figcaption class="quote-user">
            <img :src="featured.avatar" :alt="featured.author" class="user-avatar" />
            <div class="user-info">
              <h4>{{ featured.author }}</h4>
              <p>{{ featured.role }} • {{ featured.company }}</p>
            </div>
          </figcaption>
        </figure>

        <div class="quote-side">
          <figure v-for="(item, qIndex) in sideQuotes" :key="qIndex" class="quote-side-item">
            <div class="stars-rating" aria-hidden="true">
              <svg
                v-for="i in 5"
                :key="i"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="#059669"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <blockquote class="quote-side-text">"{{ item.quote }}"</blockquote>
            <figcaption class="quote-user">
              <img :src="item.avatar" :alt="item.author" class="user-avatar" />
              <div class="user-info">
                <h4>{{ item.author }}</h4>
                <p>{{ item.role }} • {{ item.company }}</p>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* --- Faixa editorial clara: interrompe o ritmo escuro da landing --- */
.social-proof-section {
  position: relative;
  min-height: 100dvh;

  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 55%, #f8fafc 100%);
  border-top: 1px solid rgba(16, 185, 129, 0.35);

  z-index: 30;
  padding: 7rem 1.5rem 6rem;
  overflow: clip;
}

.social-proof-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.social-proof-header {
  max-width: 650px;
  margin-bottom: 4.5rem;
}

.section-tag {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #047857;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid rgba(16, 185, 129, 0.25);
  display: inline-block;
  margin-bottom: 1.25rem;
}

.social-proof-title {
  font-size: clamp(1.9rem, 4.2vw, 2.9rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #0f172a;
  margin-bottom: 1rem;
}

.social-proof-desc {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.7;
}

/* --- Grid assimétrico: dominante + apoio --- */
.proof-grid {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 3.5rem;
  align-items: stretch;
  margin-bottom: 5rem;
}

.proof-dominant {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 1rem;
}

.dominant-value {
  font-size: clamp(3.5rem, 7.5vw, 6.5rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
}

.dominant-rule {
  display: block;
  width: 100%;
  max-width: 340px;
  height: 4px;
  margin: 1.5rem 0 1.25rem;
  border-radius: 999px;
  background: linear-gradient(90deg, #10b981, rgba(16, 185, 129, 0.15));
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s;
}

.social-proof-section.is-visible .dominant-rule {
  transform: scaleX(1);
}

.dominant-label {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.35rem;
}

.dominant-desc {
  font-size: 0.95rem;
  color: #64748b;
}

.proof-supporting {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.support-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 2rem;
  padding: 1.6rem 0;
  border-top: 1px solid rgba(15, 23, 42, 0.1);
}

.support-row:last-child {
  border-bottom: 1px solid rgba(15, 23, 42, 0.1);
}

.support-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.support-value {
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: #047857;
  font-variant-numeric: tabular-nums;
}

.support-label {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.support-desc {
  font-size: 0.85rem;
  color: #64748b;
}

.support-viz {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* Anel de uptime (99.8%) */
.viz-ring {
  width: 64px;
  height: 64px;
  transform: rotate(-90deg);
}

.ring-track {
  fill: none;
  stroke: rgba(15, 23, 42, 0.08);
  stroke-width: 7;
}

.ring-progress {
  fill: none;
  stroke: #10b981;
  stroke-width: 7;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  transition: stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
}

.social-proof-section.is-visible .ring-progress {
  stroke-dashoffset: 0.2;
}

/* Matriz de pontos (150k+ horários) */
.viz-dots-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.viz-dots {
  display: grid;
  grid-template-columns: repeat(10, 8px);
  gap: 5px;
}

.viz-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  opacity: 0;
  transform: scale(0.4);
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(0.4s + var(--i, 0) * 14ms);
}

.social-proof-section.is-visible .viz-dot {
  opacity: 1;
  transform: scale(1);
}

.viz-legend {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #94a3b8;
  text-transform: uppercase;
}

/* Pontuação (4.9/5) */
.viz-score {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.score-stars {
  display: flex;
  gap: 3px;
}

.score-meter {
  width: 130px;
  height: 6px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.score-meter-fill {
  display: block;
  height: 100%;
  width: 98%;
  border-radius: 999px;
  background: linear-gradient(90deg, #059669, #10b981);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
}

.social-proof-section.is-visible .score-meter-fill {
  transform: scaleX(1);
}

/* --- Depoimentos editoriais --- */
.testimonials-editorial {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 3.5rem;
  align-items: start;
}

.quote-featured {
  position: relative;
  padding-top: 1rem;
}

.quote-mark {
  position: absolute;
  top: -2.5rem;
  left: -0.75rem;
  font-size: 9rem;
  line-height: 1;
  font-family: Georgia, serif;
  color: rgba(16, 185, 129, 0.18);
  pointer-events: none;
  user-select: none;
}

.stars-rating {
  display: flex;
  gap: 4px;
  margin-bottom: 1.25rem;
}

.quote-featured-text {
  font-size: clamp(1.25rem, 2.2vw, 1.6rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: #1e293b;
  margin: 0 0 2rem;
}

.quote-side {
  display: flex;
  flex-direction: column;
}

.quote-side-item {
  padding: 1.75rem 0;
  border-top: 1px solid rgba(15, 23, 42, 0.1);
}

.quote-side-item:last-child {
  border-bottom: 1px solid rgba(15, 23, 42, 0.1);
}

.quote-side-item .stars-rating {
  margin-bottom: 0.875rem;
}

.quote-side-text {
  font-size: 0.975rem;
  line-height: 1.65;
  color: #475569;
  margin: 0 0 1.25rem;
  font-style: italic;
}

.quote-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(5, 150, 105, 0.45);
}

.user-info h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.user-info p {
  font-size: 0.8rem;
  color: #64748b;
}

/* --- Entrada da seção --- */
.animate-item {
  opacity: 0;
  transform: translateY(25px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.social-proof-section.is-visible .animate-item {
  opacity: 1;
  transform: translateY(0);
}

.delay-1 {
  transition-delay: 0.15s;
}
.delay-2 {
  transition-delay: 0.3s;
}

@media (max-width: 900px) {
  .social-proof-section {
    padding: 5rem 1.25rem 4.5rem;
  }

  .proof-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    margin-bottom: 3.5rem;
  }

  .proof-dominant {
    padding-right: 0;
  }

  .testimonials-editorial {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 640px) {
  .support-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .support-viz {
    justify-content: flex-start;
  }

  .viz-dots-wrap,
  .viz-score {
    align-items: flex-start;
  }

  .quote-mark {
    font-size: 6rem;
    top: -1.75rem;
    left: -0.5rem;
  }
}
</style>
