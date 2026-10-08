<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

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
  <section ref="sectionRef" id="funcionalidades" class="features" :class="{ 'is-visible': isVisible }">
    <div class="features-inner">
      <header class="features-header animate-item">
        <h2 class="features-title">
          Tudo que sua operação precisa,<br>sem complexidade desnecessária.
        </h2>
        <p class="features-desc">
          Do agendamento ao relatório, cada etapa conectada
          para você focar no que importa: atender bem.
        </p>
      </header>

      <div class="features-grid">
        <div 
          class="feature-card feature-card--wide spotlight-card animate-item delay-1"
          @mousemove="handleMouseMove"
        >
          <div class="card-glow" />
          <div class="feature-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
            </svg>
          </div>
          <h3>Agendamento com pagamento integrado</h3>
          <p>O cliente escolhe o horário e o sistema já solicita — ou confirma — o pagamento. Sem trocas de mensagens, sem esquecimentos.</p>
        </div>

        <div 
          class="feature-card spotlight-card animate-item delay-2"
          @mousemove="handleMouseMove"
        >
          <div class="card-glow" />
          <div class="feature-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h3>Fluxo de caixa em tempo real</h3>
          <p>Cada entrada registrada automaticamente. Acompanhe o dia sem precisar fechar o caixa manualmente.</p>
        </div>

        <div 
          class="feature-card spotlight-card animate-item delay-3"
          @mousemove="handleMouseMove"
        >
          <div class="card-glow" />
          <div class="feature-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
          </div>
          <h3>Relatórios que fazem sentido</h3>
          <p>Faturamento, ticket médio e horários de maior demanda — tudo em um painel que você lê em segundos.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  position: relative;
  min-height: 100dvh;
  background: rgba(8, 13, 20, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: none;
  z-index: 30;
  box-shadow: 0 -50px 100px rgba(0, 0, 0, 0.95);
  margin-top: -6vh;
  padding: 8rem 1.5rem 6rem;
  border-top-left-radius: 2.5rem;
  border-top-right-radius: 2.5rem;
}

.features-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.features-header {
  max-width: 600px;
  margin-bottom: 4rem;
}

.features-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #f0fdf4;
  margin-bottom: 1rem;
}

.features-desc {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.7;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.spotlight-card {
  position: relative;
  background: #0c1422;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 2.25rem;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.spotlight-card:hover {
  border-color: rgba(52, 211, 153, 0.35);
  transform: translateY(-3px);
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5);
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

.spotlight-card:hover .card-glow {
  opacity: 1;
}

.feature-card--wide {
  grid-column: 1 / -1;
}

.feature-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
  margin-bottom: 1.5rem;
  transition: background 0.3s, border-color 0.3s;
}

.spotlight-card:hover .feature-card-icon {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
}

.feature-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.6rem;
  line-height: 1.3;
}

.feature-card p {
  font-size: 0.925rem;
  color: #94a3b8;
  line-height: 1.65;
}

/* Animações de entrada acionadas pelo Observer */
.animate-item {
  opacity: 0;
  transform: translateY(25px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.features.is-visible .animate-item {
  opacity: 1;
  transform: translateY(0);
}

.delay-1 { transition-delay: 0.15s; }
.delay-2 { transition-delay: 0.3s; }
.delay-3 { transition-delay: 0.45s; }

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .feature-card--wide {
    grid-column: 1;
  }
}
</style>