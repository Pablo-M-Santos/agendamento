<script setup lang="ts"></script>

<template>
  <section
    class="relative min-h-[90vh] lg:min-h-dvh flex items-center py-20 overflow-hidden bg-[#080D14]"
  >
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-[140px]"
      />
    </div>

    <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full relative z-10">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        <div class="flex flex-col items-start text-left z-20 w-full lg:w-1/2">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.07] border border-white/10 mb-6 backdrop-blur-md shadow-sm"
          >
            <span class="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span class="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              Plataforma completa para negócios
            </span>
          </div>

          <h1
            class="text-4xl sm:text-5xl xl:text-[3.25rem] font-extrabold tracking-[-0.03em] text-white mb-6 leading-[1.08]"
          >
            Controle total do seu<br />
            <span class="text-shimmer-sweep relative inline-block">agendamento e caixa</span>
          </h1>

          <p class="text-base sm:text-lg text-slate-400 mb-8 max-w-[540px] leading-[1.7]">
            A infraestrutura completa para profissionais e negócios locais organizarem a agenda e
            gerenciarem os atendimentos sem complicações.
          </p>

          <div class="flex flex-wrap items-center gap-4 mb-8">
            <NuxtLink
              to="/register"
              class="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-base bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-emerald-500/15 group"
            >
              <span>Criar conta grátis</span>
              <svg
                class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </NuxtLink>

            <NuxtLink
              to="/manifesto"
              class="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-medium text-base text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 backdrop-blur-sm"
            >
              <svg
                class="w-4 h-4 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Ver demonstração</span>
            </NuxtLink>
          </div>

          <div
            class="grid grid-cols-3 gap-3 w-full max-w-[540px] p-4 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-md"
          >
            <div>
              <p class="text-[11px] font-medium text-slate-400 mb-0.5">Zero Furos</p>
              <p class="text-base sm:text-lg font-extrabold text-emerald-400">Lembretes</p>
            </div>
            <div class="border-x border-white/10 px-3">
              <p class="text-[11px] font-medium text-slate-400 mb-0.5">Histórico</p>
              <p class="text-base sm:text-lg font-extrabold text-white">Clientes</p>
            </div>
            <div class="pl-1">
              <p class="text-[11px] font-medium text-slate-400 mb-0.5">Agilidade</p>
              <p class="text-base sm:text-lg font-extrabold text-teal-300">Em segundos</p>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/2 relative flex items-center justify-center">
          <div class="relative w-full max-w-[500px]">
            <div class="absolute -inset-2 -z-10 rounded-3xl blur-[50px] bg-emerald-500/15" />

            <div
              class="rounded-2xl border border-white/15 bg-[#0D1522]/90 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden"
            >
              <div class="flex items-center justify-between pb-5 mb-5 border-b border-white/10">
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span class="text-xs font-bold tracking-wider text-slate-200 uppercase"
                    >Agenda do Dia</span
                  >
                </div>
                <span
                  class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
                  Tempo Real
                </span>
              </div>

              <div class="space-y-4">
                <div
                  class="relative p-4.5 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-emerald-500/30 shadow-lg"
                >
                  <div
                    class="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider"
                  >
                    Em Andamento
                  </div>

                  <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-start gap-3">
                      <div
                        class="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span
                            class="text-xs font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30"
                            >14:30</span
                          >
                          <h3 class="text-white font-bold text-base">Maria Eduarda Santos</h3>
                        </div>
                        <p class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <svg
                            class="w-3 h-3 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Rua das Flores, 142 — Casa 04
                        </p>
                      </div>
                    </div>
                    <span class="text-base font-black text-white">R$ 180,00</span>
                  </div>

                  <div class="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
                    <span
                      class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30"
                    >
                      <svg
                        class="w-3 h-3 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Material Separado
                    </span>
                    <span
                      class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-300 bg-teal-950/50 px-2.5 py-1 rounded-full border border-teal-500/20"
                    >
                      <svg
                        class="w-3 h-3 text-teal-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Horário Confirmado
                    </span>
                  </div>
                </div>

                <div
                  class="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all opacity-85"
                >
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-3">
                      <span class="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded"
                        >16:00</span
                      >
                      <div>
                        <p class="text-sm font-semibold text-white">Carlos Henrique Lima</p>
                        <p class="text-[11px] text-slate-400">
                          Manutenção Preventiva • Av. Central
                        </p>
                      </div>
                    </div>
                    <span class="text-sm font-bold text-slate-200">R$ 250,00</span>
                  </div>
                </div>
              </div>

              <div
                class="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium"
              >
                <span>Organização simples e rápida</span>
                <span class="text-emerald-400 hover:underline cursor-pointer"
                  >Ver agenda completa &rarr;</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-shimmer-sweep {
  background: linear-gradient(
    90deg,
    #34d399 0%,
    #34d399 35%,
    #ffffff 50%,
    #34d399 65%,
    #34d399 100%
  );
  background-size: 250% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: lightSweep 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes lightSweep {
  0% {
    background-position: 250% center;
  }
  100% {
    background-position: -50% center;
  }
}
</style>
