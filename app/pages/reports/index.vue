<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import type { ReportsPeriod, StatusFilter } from '~/composables/useReportsPage'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { t } = useAppI18n()
const toast = useToast()
const { user } = useAuth()
const { gerarPdfRelatorio, compartilharOuBaixarPdf } = useReportPdf()

const {
  periodoSelecionado,
  filtroStatus,
  carregando,
  totalAgendamentos,
  totalFinalizados,
  totalNaoConcluidos,
  totalMaterialPronto,
  taxaConclusao,
  materialResumo,
  serieDiaria,
  topClientes,
  diaMaisCheio,
  agendamentosFiltrados
} = useReportsPage()

const { buildStatusDonut, buildCompletionTrend, buildHeatmap, totalAtrasados, totalProximos, taxaConclusao: taxaGeral } =
  useChartData(agendamentosFiltrados as Ref<Agendamento[]>)

const exporting = ref(false)

const opcoesPeriodo = computed<Array<{ key: string; label: string }>>(() => [
  { key: '7d', label: t('reports.period.7d') },
  { key: '30d', label: t('reports.period.30d') },
  { key: 'mes', label: t('reports.period.month') }
])

const opcoesStatus = computed<Array<{ key: StatusFilter; label: string }>>(() => [
  { key: 'todos', label: t('reports.filter.all') },
  { key: 'concluidos', label: t('reports.filter.completed') },
  { key: 'abertos', label: t('reports.filter.open') },
  { key: 'atrasados', label: t('reports.filter.late') }
])

const handlePeriodoSelect = (periodo: string) => {
  if (periodo !== '7d' && periodo !== '30d' && periodo !== 'mes') return
  periodoSelecionado.value = periodo as ReportsPeriod
}

const handleStatusSelect = (status: string) => {
  if (!['todos', 'concluidos', 'abertos', 'atrasados'].includes(status)) return
  filtroStatus.value = status as StatusFilter
}

const donutStatus = computed(() => buildStatusDonut())
const trendPontos = computed(() => buildCompletionTrend(periodoSelecionado.value === '7d' ? 7 : 14))
const heatmapDados = computed(() => buildHeatmap())

const handleExportarPdf = async () => {
  if (exporting.value) return
  if (totalAgendamentos.value === 0) {
    toast.add({
      title: t('reports.export.empty') || 'Sem dados para exportar',
      color: 'warning'
    })
    return
  }

  try {
    exporting.value = true
    await nextTick()

    const blob = gerarPdfRelatorio({
      usuarioNome: user.value?.displayName || user.value?.email || 'Usuário',
      periodo: periodoSelecionado.value,
      filtroStatus: filtroStatus.value,
      agendamentos: agendamentosFiltrados.value,
      totalAgendamentos: totalAgendamentos.value,
      totalFinalizados: totalFinalizados.value,
      totalNaoConcluidos: totalNaoConcluidos.value,
      totalMaterialPronto: totalMaterialPronto.value,
      taxaConclusao: taxaConclusao.value,
      materialResumo: materialResumo.value
    })

    const hoje = format(new Date(), 'yyyyMMdd-HHmm')
    const nomeArquivo = `relatorio-${periodoSelecionado.value}-${hoje}.pdf`
    const resultado = await compartilharOuBaixarPdf(blob, nomeArquivo)

    if (resultado === 'compartilhado') {
      toast.add({
        title: t('reports.export.shared') || 'PDF pronto para compartilhar',
        color: 'success'
      })
    } else if (resultado === 'baixado') {
      toast.add({
        title: t('reports.export.success') || 'PDF exportado com sucesso',
        description: nomeArquivo,
        color: 'success'
      })
    }
  } catch (erro) {
    console.error('Erro ao exportar PDF:', erro)
    toast.add({
      title: t('reports.export.error') || 'Erro ao exportar PDF',
      color: 'error'
    })
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div
    class="h-screen overflow-y-auto px-5 sm:px-8 lg:px-12 py-5 sm:py-8 bg-[#141A28] text-[#EDEFF4]"
  >
    <div class="max-w-7xl mx-auto">
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
        class="rounded-2xl border p-6 text-center border-[#262E42] bg-[#1A2132]"
      >
        <p class="font-black uppercase tracking-[0.16em] text-sm text-[#8A93A6]">{{ t('reports.loading') }}</p>
      </section>

      <template v-else>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div class="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              v-for="option in opcoesStatus"
              :key="option.key"
              class="px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-[0.12em] whitespace-nowrap transition"
              :class="
                filtroStatus === option.key
                  ? 'bg-[#1B4F4A] text-[#EAFBF6] border-[#2C6E67]'
                  : 'bg-[#1E2A3D] border-[#262E42] text-[#EDEFF4]'
              "
              @click="handleStatusSelect(option.key)"
            >
              {{ option.label }}
            </button>
          </div>

          <ReportsExportButton
            :loading="exporting"
            :label="t('reports.export.pdf') || 'Exportar PDF'"
            :loading-label="t('reports.export.generating') || 'Gerando...'"
            @export="handleExportarPdf"
          />
        </div>

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

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <section
            class="rounded-2xl border p-5 lg:col-span-1 border-[#262E42] bg-[#1A2132]"
          >
            <div class="flex items-center justify-between mb-4">
              <div>
                <p
                  class="text-[10px] uppercase tracking-[0.16em] font-black text-[#8A93A6]"
                >
                  {{ t('reports.completionRate') }}
                </p>
                <p class="text-3xl sm:text-4xl font-black mt-1 text-[#EDEFF4]">
                  {{ taxaConclusao.toFixed(1) }}%
                </p>
              </div>
              <DonutChart
                v-if="donutStatus.length > 0"
                :segments="donutStatus"
                :size="80"
                :stroke-width="10"
              />
              <div
                v-else
                class="w-20 h-20 rounded-full border-[6px] border-[#262E42]"
              />
            </div>

            <div
              class="h-3 rounded-full overflow-hidden bg-[#141A28]"
            >
              <div
                class="h-full bg-gradient-to-r from-[#1B4F4A] to-[#4FD1C5]"
                :style="{ width: `${Math.min(100, taxaConclusao)}%` }"
              />
            </div>

            <div v-if="donutStatus.length > 0" class="mt-4 space-y-1.5">
              <div
                v-for="seg in donutStatus"
                :key="seg.label"
                class="flex items-center justify-between text-[11px]"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-2.5 h-2.5 rounded-full"
                    :style="{ backgroundColor: seg.color }"
                  />
                  <span class="text-[#EDEFF4] font-bold">{{ seg.label }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="font-black tabular-nums"
                    :style="{ color: seg.color }"
                  >
                    {{ seg.value }}
                  </span>
                  <span class="text-[#8A93A6] tabular-nums">
                    {{ Math.round((seg.value / Math.max(1, totalAgendamentos)) * 100) }}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          <ReportsActionableInsights
            class="lg:col-span-2"
            :title="t('reports.insights.title') || 'Insights acionáveis'"
            :proximos-label="t('reports.insights.upcoming') || 'Próximos'"
            :atrasados-label="t('reports.insights.late') || 'Atrasados'"
            :sem-material-label="t('reports.noMaterial') || 'Sem material'"
            :taxa-label="t('reports.completionRate') || 'Taxa'"
            :proximos="totalProximos"
            :atrasados="totalAtrasados"
            :sem-material="materialResumo.semMaterial"
            :taxa="taxaGeral"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <section
            class="rounded-2xl border p-5 lg:col-span-2 border-[#262E42] bg-[#1A2132]"
          >
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-black uppercase tracking-[0.16em] text-[#EDEFF4]">
                {{ t('reports.charts.completionTrend') || 'Tendência de conclusão' }}
              </h2>
              <span class="text-[10px] uppercase tracking-[0.16em] text-[#8A93A6]">
                {{ t('reports.totalVsCompleted') }}
              </span>
            </div>

            <div v-if="trendPontos.length > 0">
              <LineChart
                :points="trendPontos"
                :height="200"
              />
            </div>
            <div
              v-else
              class="flex flex-col items-center justify-center py-12 text-center"
            >
              <CheckBadgeIcon class="w-10 h-10 text-[#262E42] mb-2" />
              <p class="text-sm text-[#8A93A6]">Sem dados de tendência</p>
            </div>
          </section>

          <section
            class="rounded-2xl border p-5 lg:col-span-1 border-[#262E42] bg-[#1A2132]"
          >
            <h2 class="text-sm font-black uppercase tracking-[0.16em] mb-3 text-[#EDEFF4]">
              {{ t('reports.dailyEvolution') }}
            </h2>

            <div v-if="serieDiaria.length > 0" class="overflow-x-auto no-scrollbar">
              <div class="flex items-end gap-1 min-w-max pb-2 h-32">
                <div
                  v-for="dia in serieDiaria.slice(-14)"
                  :key="dia.chave"
                  class="flex flex-col items-center gap-1 w-5"
                >
                  <div class="h-24 flex items-end gap-[2px]">
                    <div
                      class="w-2 rounded-sm bg-[#262E42]"
                      :style="{ height: `${dia.alturaTotal}px` }"
                    />
                    <div
                      class="w-2 rounded-sm bg-[#4FD1C5]"
                      :style="{ height: `${dia.alturaFinalizados}px` }"
                    />
                  </div>
                  <span
                    class="text-[8px] font-bold text-[#8A93A6] whitespace-nowrap"
                    >{{ dia.label }}</span
                  >
                </div>
              </div>
            </div>
            <p
              v-else
              class="text-sm text-[#8A93A6] text-center py-8"
            >
              Sem dados
            </p>
          </section>
        </div>

        <section
          class="rounded-2xl border p-5 mb-6 sm:mb-8 border-[#262E42] bg-[#1A2132]"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-black uppercase tracking-[0.16em] text-[#EDEFF4]">
              {{ t('reports.charts.heatmap') || 'Atendimentos por dia e horário' }}
            </h2>
            <div class="flex items-center gap-2 text-[10px] text-[#8A93A6]">
              <span>Menos</span>
              <div class="flex gap-1">
                <div class="w-3 h-3 rounded-sm bg-[#262E42]" />
                <div class="w-3 h-3 rounded-sm" style="background: rgba(79, 209, 197, 0.3)" />
                <div class="w-3 h-3 rounded-sm" style="background: rgba(79, 209, 197, 0.55)" />
                <div class="w-3 h-3 rounded-sm" style="background: rgba(79, 209, 197, 0.8)" />
                <div class="w-3 h-3 rounded-sm" style="background: rgba(79, 209, 197, 1)" />
              </div>
              <span>Mais</span>
            </div>
          </div>

          <HeatmapChart
            v-if="heatmapDados.rows.length > 0"
            :rows="heatmapDados.rows"
            :columns="heatmapDados.columns"
          />
          <p
            v-else
            class="text-sm text-[#8A93A6] text-center py-8"
          >
            Sem dados para exibir
          </p>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <section
            class="rounded-2xl border p-5 lg:col-span-1 border-[#262E42] bg-[#1A2132]"
          >
            <h2 class="text-sm font-black uppercase tracking-[0.16em] mb-4 text-[#EDEFF4]">
              {{ t('reports.material') }}
            </h2>

            <div class="space-y-4 text-xs font-bold">
              <div>
                <div class="flex justify-between mb-1 text-[#8A93A6]">
                  <span>{{ t('reports.materialReady') }}</span>
                  <span>{{ materialResumo.pronto }}</span>
                </div>
                <div class="h-2 rounded-full overflow-hidden bg-[#141A28]">
                  <div
                    class="h-full bg-[#4FD1C5]"
                    :style="{
                      width: `${totalAgendamentos ? (materialResumo.pronto / totalAgendamentos) * 100 : 0}%`
                    }"
                  />
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-1 text-[#8A93A6]">
                  <span>{{ t('reports.noMaterial') }}</span>
                  <span>{{ materialResumo.semMaterial }}</span>
                </div>
                <div class="h-2 rounded-full overflow-hidden bg-[#141A28]">
                  <div
                    class="h-full bg-[#233350]"
                    :style="{
                      width: `${totalAgendamentos ? (materialResumo.semMaterial / totalAgendamentos) * 100 : 0}%`
                    }"
                  />
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-1 text-[#8A93A6]">
                  <span>{{ t('reports.notInformed') }}</span>
                  <span>{{ materialResumo.naoInformado }}</span>
                </div>
                <div class="h-2 rounded-full overflow-hidden bg-[#141A28]">
                  <div
                    class="h-full bg-[#262E42]"
                    :style="{
                      width: `${totalAgendamentos ? (materialResumo.naoInformado / totalAgendamentos) * 100 : 0}%`
                    }"
                  />
                </div>
              </div>
            </div>
          </section>

          <div class="lg:col-span-2">
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
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
