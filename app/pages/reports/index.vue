<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'
import type { ReportsPeriod } from '~/composables/useReportsPage'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { t } = useAppI18n()

const {
  periodoSelecionado,
  carregando,
  totalAgendamentos,
  totalFinalizados,
  totalNaoConcluidos,
  totalMaterialPronto,
  taxaConclusao,
  materialResumo,
  serieDiaria,
  topClientes,
  diaMaisCheio
} = useReportsPage()

const opcoesPeriodo = computed<Array<{ key: string; label: string }>>(() => [
  { key: '7d', label: t('reports.period.7d') },
  { key: '30d', label: t('reports.period.30d') },
  { key: 'mes', label: t('reports.period.month') }
])

const handlePeriodoSelect = (periodo: string) => {
  if (periodo !== '7d' && periodo !== '30d' && periodo !== 'mes') return
  periodoSelecionado.value = periodo as ReportsPeriod
}
</script>

<template>
  <div
    class="h-screen overflow-y-auto p-5 bg-gradient-to-br from-[#002e29] via-[#001a17] to-[#001a17] text-white"
  >
    <ReportsPageHeader
      :title="t('reports.title')"
      :subtitle="t('reports.subtitle')"
      :back-to-dashboard-label="t('common.backToDashboard')"
      :period-options="opcoesPeriodo"
      :selected-period="periodoSelecionado"
      @select-period="handlePeriodoSelect"
    />

    <section
      v-if="carregando"
      class="rounded-2xl border p-6 text-center border-[#4da69c]/20 bg-[#003733]/50"
    >
      <p class="font-black uppercase tracking-[0.16em] text-sm text-[#80bfb8]">{{ t('reports.loading') }}</p>
    </section>

    <template v-else>
      <ReportsSummaryCards
        :bookings-label="t('reports.card.bookings')"
        :completed-label="t('reports.card.completedService')"
        :unfinished-label="t('reports.card.unfinishedService')"
        :material-ready-label="t('reports.card.materialReady')"
        :total-bookings="totalAgendamentos"
        :total-completed="totalFinalizados"
        :total-unfinished="totalNaoConcluidos"
        :total-material-ready="totalMaterialPronto"
      />

      <section
        class="rounded-2xl border p-5 mb-6 border-[#4da69c]/20 bg-[#003733]/50"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p
              class="text-[10px] uppercase tracking-[0.16em] font-black text-[#80bfb8]"
            >
              {{ t('reports.completionRate') }}
            </p>
            <p class="text-3xl font-black mt-1 text-white">{{ taxaConclusao.toFixed(1) }}%</p>
          </div>
          <span
            class="w-10 h-10 rounded-xl bg-[#4da69c]/20 border border-[#4da69c]/30 flex items-center justify-center"
          >
            <CheckBadgeIcon class="w-5 h-5 text-[#80bfb8]" />
          </span>
        </div>

        <div
          class="mt-4 h-3 rounded-full overflow-hidden bg-[#002e29]"
        >
          <div
            class="h-full bg-gradient-to-r from-[#4da69c] to-[#80bfb8]"
            :style="{ width: `${Math.min(100, taxaConclusao)}%` }"
          />
        </div>
      </section>

      <section
        class="rounded-2xl border p-5 mb-6 border-[#4da69c]/20 bg-[#003733]/50"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-black uppercase tracking-[0.16em] text-white">
            {{ t('reports.dailyEvolution') }}
          </h2>
          <span
            class="text-[10px] uppercase tracking-[0.16em] text-[#80bfb8]"
            >{{ t('reports.totalVsCompleted') }}</span
          >
        </div>

        <div class="overflow-x-auto no-scrollbar">
          <div class="flex items-end gap-2 min-w-max pb-2">
            <div
              v-for="dia in serieDiaria"
              :key="dia.chave"
              class="flex flex-col items-center gap-1 w-9"
            >
              <div class="h-24 flex items-end gap-[3px]">
                <div
                  class="w-3 rounded-md bg-white/20"
                  :style="{ height: `${dia.alturaTotal}px` }"
                />
                <div
                  class="w-3 rounded-md bg-[#4da69c]"
                  :style="{ height: `${dia.alturaFinalizados}px` }"
                />
              </div>
              <span
                class="text-[10px] font-bold text-[#80bfb8]"
                >{{ dia.label }}</span
              >
            </div>
          </div>
        </div>
      </section>

      <section
        class="rounded-2xl border p-5 mb-7 border-[#4da69c]/20 bg-[#003733]/50"
      >
        <h2 class="text-sm font-black uppercase tracking-[0.16em] mb-4 text-white">
          {{ t('reports.material') }}
        </h2>

        <div class="space-y-4 text-xs font-bold">
          <div>
            <div
              class="flex justify-between mb-1 text-white/80"
            >
              <span>{{ t('reports.materialReady') }}</span
              ><span>{{ materialResumo.pronto }}</span>
            </div>
            <div
              class="h-2 rounded-full overflow-hidden bg-[#002e29]"
            >
              <div
                class="h-full bg-[#4da69c]"
                :style="{
                  width: `${totalAgendamentos ? (materialResumo.pronto / totalAgendamentos) * 100 : 0}%`
                }"
              />
            </div>
          </div>

          <div>
            <div
              class="flex justify-between mb-1 text-white/80"
            >
              <span>{{ t('reports.noMaterial') }}</span
              ><span>{{ materialResumo.semMaterial }}</span>
            </div>
            <div
              class="h-2 rounded-full overflow-hidden bg-[#002e29]"
            >
              <div
                class="h-full bg-amber-500"
                :style="{
                  width: `${totalAgendamentos ? (materialResumo.semMaterial / totalAgendamentos) * 100 : 0}%`
                }"
              />
            </div>
          </div>

          <div>
            <div
              class="flex justify-between mb-1 text-white/80"
            >
              <span>{{ t('reports.notInformed') }}</span
              ><span>{{ materialResumo.naoInformado }}</span>
            </div>
            <div
              class="h-2 rounded-full overflow-hidden bg-[#002e29]"
            >
              <div
                class="h-full bg-white/30"
                :style="{
                  width: `${totalAgendamentos ? (materialResumo.naoInformado / totalAgendamentos) * 100 : 0}%`
                }"
              />
            </div>
          </div>
        </div>
      </section>

      <ReportsQuickInsights
        :title="t('reports.quickInsights')"
        :busy-day-label="t('reports.busyDay')"
        :best-client-label="t('reports.bestClient')"
        :bookings-suffix="t('reports.bookingsSuffix')"
        :services-suffix="t('reports.servicesSuffix')"
        :no-data-label="t('reports.noData')"
        :top-clients-label="t('reports.topClients')"
        :total-completed-label="(payload) => t('reports.totalCompleted', payload)"
        :day-busiest="diaMaisCheio"
        :top-clients="topClientes"
      />
    </template>
  </div>
</template>