<script setup lang="ts">
import { format } from 'date-fns'
import type { StatusFilter } from '~/composables/useReportsPage'
import DashboardTopBar from '~/components/dashboard/DashboardTopBar.vue'
import DashboardSidebar from '~/components/DashboardSidebar.vue'
import ApexDonutChart from '~/components/charts/apex/ApexDonutChart.vue'
import ApexTrendChart from '~/components/charts/apex/ApexTrendChart.vue'
import ApexHorizontalBarsChart from '~/components/charts/apex/ApexHorizontalBarsChart.vue'
import ApexHourlyBarsChart from '~/components/charts/apex/ApexHourlyBarsChart.vue'
import ApexStatusStackedChart from '~/components/charts/apex/ApexStatusStackedChart.vue'
import ApexPeriodComparisonChart from '~/components/charts/apex/ApexPeriodComparisonChart.vue'
import type { Agendamento } from '~/composables/useAgendamentos'
import VueApexCharts from 'vue3-apexcharts'

definePageMeta({ middleware: 'auth', layout: 'app' })

const { t } = useAppI18n()
const toast = useToast()
const { user } = useAuth()
const { gerarPdfRelatorio, compartilharOuBaixarPdf } = useReportPdf()

const isSidebarOpen = ref(false)

onMounted(() => {
  isSidebarOpen.value = window.matchMedia('(min-width: 1024px)').matches
})

const saudacaoRelatorios = computed(() => t('reports.title'))

const inicialUsuario = computed(() => {
  const nome = user.value?.displayName?.trim()
  if (nome) return nome.charAt(0).toUpperCase()
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})

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
  topClientes,
  volumePorHorario,
  agendamentosFiltrados
} = useReportsPage()

const {
  buildStatusDonut,
  buildCompletionTrend,
  receitaTotal,
  ticketMedio,
  receitaPorMes,
  mediaMensal,
  statusPorDia,
  comparacaoPeriodo
} = useChartData(agendamentosFiltrados as Ref<Agendamento[]>)

const mesSelecionado = ref('')

const exporting = ref(false)

const opcoesStatus = computed<Array<{ key: StatusFilter; label: string }>>(() => [
  { key: 'todos', label: t('reports.filter.all') },
  { key: 'concluidos', label: t('reports.filter.completed') },
  { key: 'abertos', label: t('reports.filter.open') },
  { key: 'atrasados', label: t('reports.filter.late') }
])

const handleStatusSelect = (status: string) => {
  if (!['todos', 'concluidos', 'abertos', 'atrasados'].includes(status)) return
  filtroStatus.value = status as StatusFilter
}

const dadosReceita = computed(() => {
  if (!mesSelecionado.value) {
    return receitaPorMes.value.map((m) => ({ x: m.x, valor: m.valor }))
  }
  const [mesNum, ano] = mesSelecionado.value.split('/')
  const mesFilter = `${ano}-${mesNum}`
  const diasNoMes = new Date(parseInt(ano), parseInt(mesNum), 0).getDate()

  const mapa = new Map<string, number>()
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const diaStr = String(dia).padStart(2, '0')
    mapa.set(`${mesFilter}-${diaStr}`, 0)
  }

  agendamentosFiltrados.value.forEach((item) => {
    if (!item.data) return
    const chaveData = format(item.data.toDate(), 'yyyy-MM-dd')
    const chaveMes = chaveData.substring(0, 7)
    if (chaveMes !== mesFilter) return
    mapa.set(chaveData, (mapa.get(chaveData) || 0) + (item.valor || 0))
  })

  return Array.from(mapa.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([chave, valor]) => ({
      x: format(new Date(`${chave}T00:00:00`), 'dd/MM'),
      valor
    }))
})

const mesesDisponiveis = computed(() => receitaPorMes.value.map((m) => m.x))

const donutSegments = computed(() => buildStatusDonut())
const trendPontos = computed(() => buildCompletionTrend(periodoSelecionado.value === '7d' ? 7 : 14))

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
    class="h-screen overflow-y-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 bg-[#0F1729] text-[#EDEFF4]"
    :class="{ 'lg:pl-[22rem]': isSidebarOpen }"
  >
    <DashboardTopBar
      :greeting="saudacaoRelatorios"
      :photo-url="user?.photoURL"
      :user-initial="inicialUsuario"
      :open-sidebar-label="t('dashboard.openSidebar')"
      :go-profile-label="t('dashboard.goProfile')"
      :sidebar-open="isSidebarOpen"
      @open-sidebar="isSidebarOpen = !isSidebarOpen"
    />

    <DashboardSidebar v-model="isSidebarOpen" />

    <ReportsPageHeader
      :title="t('reports.title')"
      :subtitle="t('reports.subtitle')"
    />

    <section
      v-if="carregando"
      class="rounded-2xl border p-6 text-center border-[#1E293B] bg-[#1A2338]"
    >
      <p class="font-black uppercase tracking-[0.16em] text-sm text-[#94A3B8]">{{ t('reports.loading') }}</p>
    </section>

    <template v-else>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div class="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="option in opcoesStatus"
            :key="option.key"
            class="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-[0.12em] whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            :class="
              option.key === 'todos'
                ? filtroStatus === option.key
                  ? 'bg-gradient-to-br from-[#233350] to-[#1C2A45] text-white border-[#33517F] shadow-lg shadow-[#33517F]/20'
                  : 'bg-gradient-to-br from-[#233350] to-[#1C2A45] text-white/80 border-[#33517F]/30'
                : option.key === 'concluidos'
                  ? filtroStatus === option.key
                    ? 'bg-gradient-to-br from-[#1B4F4A] to-[#153D39] text-white border-[#2C6E67] shadow-lg shadow-[#2C6E67]/20'
                    : 'bg-gradient-to-br from-[#1B4F4A] to-[#153D39] text-white/80 border-[#2C6E67]/30'
                  : option.key === 'abertos'
                    ? filtroStatus === option.key
                      ? 'bg-gradient-to-br from-[#4A3D2A] to-[#3A3020] text-white border-[#6E5A3A] shadow-lg shadow-[#6E5A3A]/20'
                      : 'bg-gradient-to-br from-[#4A3D2A] to-[#3A3020] text-white/80 border-[#6E5A3A]/30'
                    : filtroStatus === option.key
                      ? 'bg-gradient-to-br from-[#3D2A2A] to-[#332020] text-white border-[#5C3A3A] shadow-lg shadow-[#5C3A3A]/20'
                      : 'bg-gradient-to-br from-[#3D2A2A] to-[#332020] text-white/80 border-[#5C3A3A]/30'
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
        :revenue-label="'Receita no período'"
        :average-ticket-label="'Ticket médio'"
        :total-bookings="totalAgendamentos"
        :total-completed="totalFinalizados"
        :total-unfinished="totalNaoConcluidos"
        :total-material-ready="totalMaterialPronto"
        :total-revenue="receitaTotal"
        :average-ticket="ticketMedio"
      />

      <section class="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div class="lg:col-span-1 rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5">
          <h2 class="text-xs sm:text-sm font-black uppercase tracking-[0.16em] mb-3 sm:mb-4 text-[#F8FAFC]">
            Status dos serviços
          </h2>
          <ApexDonutChart :segments="donutSegments" />
        </div>

        <div class="lg:col-span-2 rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5">
          <h2 class="text-xs sm:text-sm font-black uppercase tracking-[0.16em] mb-3 sm:mb-4 text-[#F8FAFC]">
            Tendência diária
          </h2>
          <ApexTrendChart :points="trendPontos" />
        </div>
      </section>

      <section class="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h2 class="text-xs sm:text-sm font-black uppercase tracking-[0.16em] text-[#F8FAFC]">
              Receita mensal
            </h2>
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="text-right">
                <p class="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.12em] text-[#94A3B8]">
                  Média mensal
                </p>
                <p class="text-sm sm:text-base font-black text-[#F59E0B]">
                  {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mediaMensal) }}
                </p>
              </div>
              <select
                v-model="mesSelecionado"
                class="bg-[#233350] border border-[#33517F] rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] text-[#EDEFF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
              >
                <option value="">Todos os meses</option>
                <option
                  v-for="mes in mesesDisponiveis"
                  :key="mes"
                  :value="mes"
                >
                  {{ mes }}
                </option>
              </select>
            </div>
          </div>
          <div v-if="dadosReceita.length" class="overflow-x-auto no-scrollbar">
            <VueApexCharts
              type="area"
              height="260"
              width="100%"
              :options="{
                chart: {
                  type: 'area',
                  height: 260,
                  background: 'transparent',
                  foreColor: '#94A3B8',
                  toolbar: { show: false },
                  fontFamily: 'inherit',
                  animations: { enabled: true, easing: 'easeinout', speed: 500 }
                },
                theme: { mode: 'dark' },
                colors: ['#F59E0B'],
                stroke: { curve: 'smooth', width: 3 },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.35,
                    opacityTo: 0.05,
                    stops: [0, 90, 100]
                  }
                },
                dataLabels: { enabled: false },
                grid: {
                  borderColor: '#1E293B',
                  strokeDashArray: 3,
                  yaxis: { lines: { show: true } },
                  xaxis: { lines: { show: false } }
                },
                xaxis: {
                  categories: dadosReceita.map((m) => m.x),
                  labels: {
                    style: { colors: '#94A3B8', fontSize: '9px', fontWeight: 700 }
                  }
                },
                yaxis: {
                  labels: {
                    style: { colors: '#94A3B8', fontSize: '9px', fontWeight: 700 },
                    formatter: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
                  }
                },
                tooltip: {
                  theme: 'dark',
                  x: { show: true },
                  y: {
                    formatter: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
                  }
                },
                responsive: [
                  { breakpoint: 480, options: { chart: { height: 220 } } }
                ]
              }"
              :series="[{ name: 'Receita', data: dadosReceita.map((m) => m.valor) }]"
            />
          </div>
          <div v-else class="flex flex-col items-center justify-center py-10 text-center">
            <p class="text-sm text-[#F8FAFC] font-bold">Sem dados financeiros</p>
            <p class="text-xs text-[#94A3B8] mt-1">Adicione valores aos agendamentos</p>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5">
          <h2 class="text-xs sm:text-sm font-black uppercase tracking-[0.16em] mb-3 sm:mb-4 text-[#F8FAFC]">
            Top clientes
          </h2>
          <div class="overflow-x-auto no-scrollbar">
              <ApexHorizontalBarsChart
                :items="topClientes.map((c) => ({ label: c.cliente, value: c.total, color: '#F59E0B' }))"
                :value-label="'serviços'"
              />
          </div>
        </div>

        <div class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5">
          <h2 class="text-xs sm:text-sm font-black uppercase tracking-[0.16em] mb-3 sm:mb-4 text-[#F8FAFC]">
            Volume por horário
          </h2>
          <div class="overflow-x-auto no-scrollbar">
            <ApexHourlyBarsChart :items="volumePorHorario" />
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5">
          <h2 class="text-xs sm:text-sm font-black uppercase tracking-[0.16em] mb-3 sm:mb-4 text-[#F8FAFC]">
            Composição de status
          </h2>
          <div class="overflow-x-auto no-scrollbar">
            <ApexStatusStackedChart :points="statusPorDia" />
          </div>
        </div>

        <div class="rounded-2xl border border-[#1E293B] bg-[#1A2338] p-3 sm:p-4 md:p-5">
          <h2 class="text-xs sm:text-sm font-black uppercase tracking-[0.16em] mb-3 sm:mb-4 text-[#F8FAFC]">
            Comparação período atual x anterior
          </h2>
          <ApexPeriodComparisonChart :current="comparacaoPeriodo.atual" :previous="comparacaoPeriodo.anterior" />
        </div>
      </section>
    </template>
  </div>
</template>
