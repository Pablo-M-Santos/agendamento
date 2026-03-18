<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'
import type { ReportsPeriod } from '~/composables/useReportsPage'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { t } = useAppI18n()

const {
  isLightTheme,
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
    class="h-screen overflow-y-auto p-5 transition-colors"
    :class="isLightTheme ? 'bg-[#F4F8FF] text-[#0B1F3A]' : 'bg-[#003D7A] text-white'"
  >
    <ReportsPageHeader
      :is-light-theme="isLightTheme"
      :title="t('reports.title')"
      :subtitle="t('reports.subtitle')"
      :back-to-dashboard-label="t('common.backToDashboard')"
      :period-options="opcoesPeriodo"
      :selected-period="periodoSelecionado"
      @select-period="handlePeriodoSelect"
    />

    <section
      v-if="carregando"
      class="rounded-3xl border p-6 text-center"
      :class="
        isLightTheme ? 'border-white/20 bg-[#003D7A] text-white' : 'border-white/20 bg-white/8'
      "
    >
      <p class="font-black uppercase tracking-[0.16em] text-sm">{{ t('reports.loading') }}</p>
    </section>

    <template v-else>
      <ReportsSummaryCards
        :is-light-theme="isLightTheme"
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
        class="rounded-3xl border p-5 mb-6"
        :class="
          isLightTheme ? 'border-white/20 bg-[#003D7A] text-white' : 'border-white/20 bg-white/10'
        "
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p
              class="text-[10px] uppercase tracking-[0.16em] font-black"
              :class="isLightTheme ? 'text-white/70' : 'text-white/70'"
            >
              {{ t('reports.completionRate') }}
            </p>
            <p class="text-3xl font-black mt-1">{{ taxaConclusao.toFixed(1) }}%</p>
          </div>
          <span
            class="w-10 h-10 rounded-xl bg-[#00D3B8]/25 border border-[#00D3B8]/40 flex items-center justify-center"
          >
            <CheckBadgeIcon class="w-5 h-5 text-[#B5FFF6]" />
          </span>
        </div>

        <div
          class="mt-4 h-3 rounded-full overflow-hidden"
          :class="isLightTheme ? 'bg-white/20' : 'bg-white/15'"
        >
          <div
            class="h-full bg-gradient-to-r from-[#00D3B8] to-[#24E6CE]"
            :style="{ width: `${Math.min(100, taxaConclusao)}%` }"
          />
        </div>
      </section>

      <section
        class="rounded-3xl border p-5 mb-6"
        :class="
          isLightTheme ? 'border-white/20 bg-[#003D7A] text-white' : 'border-white/20 bg-white/8'
        "
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-black uppercase tracking-[0.16em]">
            {{ t('reports.dailyEvolution') }}
          </h2>
          <span
            class="text-[10px] uppercase tracking-[0.16em]"
            :class="isLightTheme ? 'text-white/70' : 'text-white/70'"
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
                  class="w-3 rounded-md"
                  :class="isLightTheme ? 'bg-white/35' : 'bg-white/35'"
                  :style="{ height: `${dia.alturaTotal}px` }"
                />
                <div
                  class="w-3 rounded-md bg-[#00D3B8]"
                  :style="{ height: `${dia.alturaFinalizados}px` }"
                />
              </div>
              <span
                class="text-[10px] font-bold"
                :class="isLightTheme ? 'text-white/70' : 'text-white/70'"
                >{{ dia.label }}</span
              >
            </div>
          </div>
        </div>
      </section>

      <section
        class="rounded-3xl border p-5 mb-7"
        :class="
          isLightTheme ? 'border-white/20 bg-[#003D7A] text-white' : 'border-white/20 bg-white/8'
        "
      >
        <h2 class="text-sm font-black uppercase tracking-[0.16em] mb-4">
          {{ t('reports.material') }}
        </h2>

        <div class="space-y-4 text-xs font-bold">
          <div>
            <div
              class="flex justify-between mb-1"
              :class="isLightTheme ? 'text-white/80' : 'text-white/80'"
            >
              <span>{{ t('reports.materialReady') }}</span
              ><span>{{ materialResumo.pronto }}</span>
            </div>
            <div
              class="h-2 rounded-full overflow-hidden"
              :class="isLightTheme ? 'bg-white/20' : 'bg-white/15'"
            >
              <div
                class="h-full bg-[#00D3B8]"
                :style="{
                  width: `${totalAgendamentos ? (materialResumo.pronto / totalAgendamentos) * 100 : 0}%`
                }"
              />
            </div>
          </div>

          <div>
            <div
              class="flex justify-between mb-1"
              :class="isLightTheme ? 'text-white/80' : 'text-white/80'"
            >
              <span>{{ t('reports.noMaterial') }}</span
              ><span>{{ materialResumo.semMaterial }}</span>
            </div>
            <div
              class="h-2 rounded-full overflow-hidden"
              :class="isLightTheme ? 'bg-white/20' : 'bg-white/15'"
            >
              <div
                class="h-full bg-[#F7C65E]"
                :style="{
                  width: `${totalAgendamentos ? (materialResumo.semMaterial / totalAgendamentos) * 100 : 0}%`
                }"
              />
            </div>
          </div>

          <div>
            <div
              class="flex justify-between mb-1"
              :class="isLightTheme ? 'text-white/80' : 'text-white/80'"
            >
              <span>{{ t('reports.notInformed') }}</span
              ><span>{{ materialResumo.naoInformado }}</span>
            </div>
            <div
              class="h-2 rounded-full overflow-hidden"
              :class="isLightTheme ? 'bg-white/20' : 'bg-white/15'"
            >
              <div
                class="h-full bg-white/45"
                :style="{
                  width: `${totalAgendamentos ? (materialResumo.naoInformado / totalAgendamentos) * 100 : 0}%`
                }"
              />
            </div>
          </div>
        </div>
      </section>

      <ReportsQuickInsights
        :is-light-theme="isLightTheme"
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
