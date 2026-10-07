<script setup lang="ts">

</script>

<template>
  <section id="funcionalidades" class="features">
    <div class="features-inner">
      <header class="features-header">
        <h2 class="features-title">
          Tudo que sua operação precisa,<br>sem complexidade desnecessária.
        </h2>
        <p class="features-desc">
          Do agendamento ao relatório, cada etapa conectada
          para você focar no que importa: atender bem.
        </p>
      </header>

      <div class="features-grid">
        <div class="feature-card feature-card--wide">
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

        <div class="feature-card">
          <div class="feature-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h3>Fluxo de caixa em tempo real</h3>
          <p>Cada entrada registrada automaticamente. Acompanhe o dia sem precisar fechar o caixa manualmente.</p>
        </div>

        <div class="feature-card">
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
  background: #080f1a;
  border-top: 1px solid rgba(52,211,153,0.2);
  z-index: 20;
  box-shadow: 0 -40px 80px rgba(0,0,0,0.95);
  padding: 7rem 1.5rem 6rem;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  margin-top: -3vh;
}

.features-inner {
  max-width: 1100px;
  margin: 0 auto;
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
  grid-template-rows: auto auto;
  gap: 16px;
}

.feature-card {
  background: #0c1422;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 2rem;
  transition: border-color 0.2s, transform 0.2s;
}

.feature-card:hover {
  border-color: rgba(52,211,153,0.3);
  transform: translateY(-2px);
}

.feature-card--wide {
  grid-column: 1 / -1;
}

.feature-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
  margin-bottom: 1.25rem;
}

.feature-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 0.6rem;
  line-height: 1.3;
}

.feature-card p {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.65;
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .feature-card--wide {
    grid-column: 1;
  }
}
</style>