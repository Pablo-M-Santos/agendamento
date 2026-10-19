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
  <section
    id="funcionalidades"
    ref="sectionRef"
    class="features"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="features-inner">
      <header class="features-header animate-item">
        <span class="features-badge">Arquitetura de Alta Performance</span>
        <h2 class="features-title">
          Controle total da sua operação,<br />sem atrito ou planilhas.
        </h2>
        <p class="features-desc">
          Da reserva ao faturamento, uma plataforma unificada projetada para eliminar gargalos e
          acelerar o seu dia com precisão cirúrgica.
        </p>
      </header>

      <div class="features-bento">
        <div
          class="bento-card bento-hero spotlight-card animate-item delay-1"
          @mousemove="handleMouseMove"
        >
          <div class="card-glow" />
          <div class="bento-content">
            <div class="feature-card-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
              </svg>
            </div>
            <h3>Agendamento inteligente com pagamento garantido</h3>
            <p>
              O cliente agenda e quita o serviço em segundos. Zero trocas de mensagens no WhatsApp,
              zero horários vagos por esquecimento.
            </p>
          </div>
          <div class="bento-visual-preview">
            <div class="preview-pill">
              <span class="dot-live"></span>
              Pix Confirmado • R$ 180,00
            </div>
          </div>
        </div>

        <div class="bento-stack">
          <div class="bento-card spotlight-card animate-item delay-2" @mousemove="handleMouseMove">
            <div class="card-glow" />
            <div class="feature-card-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h3>Caixa automatizado</h3>
            <p>
              Cada transação entra direto no sistema. Esqueça o fechamento manual e tenha precisão
              absoluta.
            </p>
          </div>

          <div class="bento-card spotlight-card animate-item delay-3" @mousemove="handleMouseMove">
            <div class="card-glow" />
            <div class="feature-card-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
            </div>
            <h3>Métricas e Insights</h3>
            <p>
              Faturamento e horários de pico traduzidos em gráficos limpos compreendidos de relance.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  background: #f8fafc;
  min-height: 75vh;
}

.features-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.features-header {
  max-width: 700px;
  margin-bottom: 4rem;
}

.features-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-family: monospace;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #059669;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  margin-bottom: 1rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.features-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #0f172a;
  margin-bottom: 1rem;
}

.features-desc {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.7;
}

.features-bento {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
}

.bento-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.spotlight-card {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 24px;
  padding: 2.5rem;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.04);
  transition:
    border-color 0.3s,
    transform 0.3s,
    box-shadow 0.3s;
}

.spotlight-card:hover {
  border-color: rgba(16, 185, 129, 0.35);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -15px rgba(16, 185, 129, 0.1);
}

.bento-hero {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bento-visual-preview {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  display: flex;
  align-items: center;
}

.preview-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #065f46;
}

.dot-live {
  width: 7px;
  height: 7px;
  background-color: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.card-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: radial-gradient(
    400px circle at var(--mouse-x) var(--mouse-y),
    rgba(16, 185, 129, 0.08),
    transparent 80%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.spotlight-card:hover .card-glow {
  opacity: 1;
}

.feature-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  margin-bottom: 1.5rem;
  transition:
    background 0.3s,
    border-color 0.3s;
}

.spotlight-card:hover .feature-card-icon {
  background: #d1fae5;
  border-color: #6ee7b7;
}

.spotlight-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.6rem;
  letter-spacing: -0.01em;
}

.spotlight-card p {
  font-size: 0.925rem;
  color: #475569;
  line-height: 1.65;
}

.animate-item {
  opacity: 0;
  transform: translateY(25px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.features.is-visible .animate-item {
  opacity: 1;
  transform: translateY(0);
}

.delay-1 {
  transition-delay: 0.15s;
}
.delay-2 {
  transition-delay: 0.3s;
}
.delay-3 {
  transition-delay: 0.45s;
}

@media (max-width: 900px) {
  .features-bento {
    grid-template-columns: 1fr;
  }
}
</style>
