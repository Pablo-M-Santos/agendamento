<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

const stats = [
  { value: 'R$ 2.5M+', label: 'Transacionados', desc: 'Processados em agendamentos' },
  { value: '99.8%', label: 'Uptime Garantido', desc: 'Disponibilidade e estabilidade' },
  { value: '150k+', label: 'Horários Marcados', desc: 'Sem necessidade de WhatsApp' },
  { value: '4.9/5', label: 'Satisfação Média', desc: 'Avaliação dos nossos clientes' }
]

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

      <!-- Métricas em Destaque (Grid de Stats) -->
      <div class="stats-grid animate-item delay-1">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="stat-card spotlight-card"
          @mousemove="handleMouseMove"
        >
          <div class="card-glow" />
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-desc">{{ stat.desc }}</div>
        </div>
      </div>

      <!-- Depoimentos de Clientes -->
      <div class="testimonials-grid animate-item delay-2">
        <div
          v-for="(item, tIndex) in testimonials"
          :key="tIndex"
          class="testimonial-card spotlight-card"
          @mousemove="handleMouseMove"
        >
          <div class="card-glow" />

          <div class="stars-rating">
            <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="#34d399">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </div>

          <p class="testimonial-quote">"{{ item.quote }}"</p>

          <div class="testimonial-user">
            <img :src="item.avatar" :alt="item.author" class="user-avatar" />
            <div class="user-info">
              <h4>{{ item.author }}</h4>
              <p>{{ item.role }} • {{ item.company }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.social-proof-section {
  position: relative;
  min-height: 100dvh;

  background: linear-gradient(180deg, #0d1726 0%, #0b121e 50%, #080d14 100%);

  z-index: 30;
  padding: 8rem 1.5rem 6rem;
  overflow: hidden;
}
.social-proof-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.social-proof-header {
  max-width: 650px;
  margin-bottom: 4rem;
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

.social-proof-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #f0fdf4;
  margin-bottom: 1rem;
}

.social-proof-desc {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.7;
}

/* Grid de Métricas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 4rem;
}

.stat-card {
  position: relative;
  background: rgba(12, 20, 34, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  overflow: hidden;
  transition: all 0.35s ease;
}

.stat-card:hover {
  background: linear-gradient(
    135deg,
    rgba(52, 211, 153, 0.1) 0%,
    rgba(13, 23, 38, 0.85) 50%,
    rgba(8, 13, 20, 0.95) 100%
  );
  border-color: rgba(52, 211, 153, 0.35);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5);
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 800;
  color: #34d399;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.stat-desc {
  font-size: 0.85rem;
  color: #64748b;
}

/* Grid de Depoimentos */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.testimonial-card {
  position: relative;
  background: rgba(12, 20, 34, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 2.25rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.35s ease;
}

.testimonial-card:hover {
  background: linear-gradient(
    135deg,
    rgba(52, 211, 153, 0.12) 0%,
    rgba(13, 23, 38, 0.85) 50%,
    rgba(8, 13, 20, 0.95) 100%
  );
  border-color: rgba(52, 211, 153, 0.35);
  transform: translateY(-4px);
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.6);
}

.stars-rating {
  display: flex;
  gap: 4px;
  margin-bottom: 1.25rem;
}

.testimonial-quote {
  font-size: 0.975rem;
  color: #cbd5e1;
  line-height: 1.65;
  margin-bottom: 2rem;
  font-style: italic;
}

.testimonial-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(52, 211, 153, 0.4);
}

.user-info h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
}

.user-info p {
  font-size: 0.8rem;
  color: #64748b;
}

/* Efeito Spotlight Glow */
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

.spotlight-card:hover .card-glow {
  opacity: 1;
}

/* Animações de Entrada com IntersectionObserver */
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

@media (max-width: 640px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
