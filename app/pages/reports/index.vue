<script setup lang="ts">
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  subDays
} from 'date-fns'
import type { Agendamento } from '~/composables/useAgendamentos'

definePageMeta({ middleware: 'auth', layout: 'app' })

type Periodo = '7d' | '30d' | 'mes'

const { user } = useAuth()
const { listarAgendamentos } = useAgendamentos()
const { t } = useAppI18n()

const periodoSelecionado = ref<Periodo>('30d')
const carregando = ref(true)
const agendamentos = ref<Agendamento[]>([])

const opcoesPeriodo = computed<Array<{ key: Periodo; label: string }>>(() => [
  { key: '7d', label: t('reports.period.7d') },
  { key: '30d', label: t('reports.period.30d') },
  { key: 'mes', label: t('reports.period.month') }
])

const carregar = async () => {
  if (!user.value) {
    agendamentos.value = []
    carregando.value = false
    return
  }

  carregando.value = true

  try {
    agendamentos.value = await listarAgendamentos()
  } finally {
    carregando.value = false
  }
}

watch(
  () => user.value,
  async (newUser) => {
    if (newUser) {
      await carregar()
      return
    }

    agendamentos.value = []
    carregando.value = false
  },
  { immediate: true }
)

const intervaloSelecionado = computed(() => {
  const agora = new Date()
  const fim = startOfDay(agora)

  if (periodoSelecionado.value === '7d') {
    return {
      inicio: startOfDay(subDays(agora, 6)),
      fim
    }
  }

  if (periodoSelecionado.value === '30d') {
    return {
      inicio: startOfDay(subDays(agora, 29)),
      fim
    }
  }

  return {
    inicio: startOfDay(startOfMonth(agora)),
    fim: startOfDay(endOfMonth(agora))
  }
})

const agendamentosNoPeriodo = computed(() => {
  const { inicio, fim } = intervaloSelecionado.value

  return agendamentos.value.filter((item) => {
    if (!item.data) return false

    const diaItem = startOfDay(item.data.toDate())
    return isWithinInterval(diaItem, { start: inicio, end: fim })
  })
})

const totalAgendamentos = computed(() => agendamentosNoPeriodo.value.length)
const totalFinalizados = computed(
  () => agendamentosNoPeriodo.value.filter((item) => item.servicoConcluido === true).length
)
const totalNaoConcluidos = computed(
  () => agendamentosNoPeriodo.value.filter((item) => item.servicoConcluido !== true).length
)
const totalMaterialPronto = computed(
  () => agendamentosNoPeriodo.value.filter((item) => item.materialPronto === true).length
)

const taxaConclusao = computed(() => {
  if (!totalAgendamentos.value) return 0
  return (totalFinalizados.value / totalAgendamentos.value) * 100
})

const materialResumo = computed(() => {
  const pronto = agendamentosNoPeriodo.value.filter((item) => item.materialPronto === true).length
  const semMaterial = agendamentosNoPeriodo.value.filter(
    (item) => item.materialPronto === false
  ).length
  const naoInformado = agendamentosNoPeriodo.value.length - pronto - semMaterial

  return {
    pronto,
    semMaterial,
    naoInformado
  }
})

const serieDiaria = computed(() => {
  const { inicio, fim } = intervaloSelecionado.value
  const dias = eachDayOfInterval({ start: inicio, end: fim })

  const mapa = new Map<string, { total: number; finalizados: number }>()

  dias.forEach((dia) => {
    mapa.set(format(dia, 'yyyy-MM-dd'), { total: 0, finalizados: 0 })
  })

  agendamentosNoPeriodo.value.forEach((item) => {
    const chave = format(item.data.toDate(), 'yyyy-MM-dd')
    const atual = mapa.get(chave)
    if (!atual) return

    atual.total += 1
    if (item.servicoConcluido === true) atual.finalizados += 1
  })

  const maximo = Math.max(
    1,
    ...Array.from(mapa.values()).map((item) => Math.max(item.total, item.finalizados))
  )

  return Array.from(mapa.entries()).map(([chave, valor]) => ({
    chave,
    label: format(new Date(`${chave}T00:00:00`), 'dd/MM'),
    total: valor.total,
    finalizados: valor.finalizados,
    alturaTotal: Math.max(8, Math.round((valor.total / maximo) * 92)),
    alturaFinalizados: Math.max(6, Math.round((valor.finalizados / maximo) * 92))
  }))
})

const topClientes = computed(() => {
  const mapa = new Map<string, { total: number; finalizados: number }>()

  agendamentosNoPeriodo.value.forEach((item) => {
    const nome = (item.cliente || 'Cliente nao informado').trim() || 'Cliente nao informado'
    const atual = mapa.get(nome) || { total: 0, finalizados: 0 }
    atual.total += 1
    if (item.servicoConcluido === true) atual.finalizados += 1
    mapa.set(nome, atual)
  })

  return Array.from(mapa.entries())
    .map(([cliente, dados]) => ({
      cliente,
      total: dados.total,
      finalizados: dados.finalizados
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
})

const diaMaisCheio = computed(() => {
  if (!serieDiaria.value.length) return null

  return [...serieDiaria.value].sort((a, b) => b.total - a.total)[0] || null
})
</script>

<template>
  <div class="h-screen overflow-y-auto bg-[#003D7A] text-white p-5">
    <header class="mb-7">
      <div class="grid grid-cols-3 items-center mb-4">
        <NuxtLink
          to="/dashboard"
          class="justify-self-start p-2 rounded-xl hover:bg-white/10 transition"
          :aria-label="t('common.backToDashboard')"
        >
          <ArrowLeftIcon class="w-7 h-7" />
        </NuxtLink>

        <h1 class="text-base font-black text-center">{{ t('reports.title') }}</h1>

        <div />
      </div>

      <div class="flex items-center gap-3">
        <span
          class="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center"
        >
          <ChartBarIcon class="w-5 h-5" />
        </span>
        <div>
          <h2 class="text-xl font-black tracking-wide">{{ t('reports.title') }}</h2>
          <p class="text-xs text-white/70 uppercase tracking-[0.16em]">
            {{ t('reports.subtitle') }}
          </p>
        </div>
      </div>

      <div class="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          v-for="opcao in opcoesPeriodo"
          :key="opcao.key"
          class="px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-[0.16em] whitespace-nowrap transition"
          :class="
            periodoSelecionado === opcao.key
              ? 'bg-[#00D3B8] text-[#003D7A] border-[#00D3B8]'
              : 'bg-white/10 border-white/25 text-white'
          "
          @click="periodoSelecionado = opcao.key"
        >
          {{ opcao.label }}
        </button>
      </div>
    </header>

    <section
      v-if="carregando"
      class="rounded-3xl border border-white/20 bg-white/8 p-6 text-center"
    >
      <p class="font-black uppercase tracking-[0.16em] text-sm">{{ t('reports.loading') }}</p>
    </section>

    <template v-else>
      <section class="grid grid-cols-2 gap-3 mb-6">
        <article class="rounded-2xl bg-white/95 text-[#0B1F3A] p-4 shadow-sm">
          <p class="text-[10px] uppercase tracking-[0.16em] font-black text-[#56709A]">
            {{ t('reports.card.bookings') }}
          </p>
          <p class="text-2xl font-black mt-1">{{ totalAgendamentos }}</p>
        </article>

        <article class="rounded-2xl bg-[#00D3B8] text-[#003D7A] p-4 shadow-sm">
          <p class="text-[10px] uppercase tracking-[0.16em] font-black">
            {{ t('reports.card.completedService') }}
          </p>
          <p class="text-2xl font-black mt-1">{{ totalFinalizados }}</p>
        </article>

        <article class="rounded-2xl bg-white/12 border border-white/20 p-4 shadow-sm">
          <p class="text-[10px] uppercase tracking-[0.16em] font-black text-white/75">
            {{ t('reports.card.unfinishedService') }}
          </p>
          <p class="text-2xl font-black mt-1">{{ totalNaoConcluidos }}</p>
        </article>

        <article class="rounded-2xl bg-[#E8F1FF] text-[#3F5170] p-4 shadow-sm">
          <p class="text-[10px] uppercase tracking-[0.16em] font-black">
            {{ t('reports.card.materialReady') }}
          </p>
          <p class="text-2xl font-black mt-1">{{ totalMaterialPronto }}</p>
        </article>
      </section>

      <section class="rounded-3xl border border-white/20 bg-white/10 p-5 mb-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[10px] uppercase tracking-[0.16em] font-black text-white/70">
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

        <div class="mt-4 h-3 rounded-full bg-white/15 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-[#00D3B8] to-[#24E6CE]"
            :style="{ width: `${Math.min(100, taxaConclusao)}%` }"
          />
        </div>
      </section>

      <section class="rounded-3xl border border-white/20 bg-white/8 p-5 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-black uppercase tracking-[0.16em]">
            {{ t('reports.dailyEvolution') }}
          </h2>
          <span class="text-[10px] text-white/70 uppercase tracking-[0.16em]">{{
            t('reports.totalVsCompleted')
          }}</span>
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
                  class="w-3 rounded-md bg-white/35"
                  :style="{ height: `${dia.alturaTotal}px` }"
                />
                <div
                  class="w-3 rounded-md bg-[#00D3B8]"
                  :style="{ height: `${dia.alturaFinalizados}px` }"
                />
              </div>
              <span class="text-[10px] text-white/70 font-bold">{{ dia.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-white/20 bg-white/8 p-5 mb-7">
        <h2 class="text-sm font-black uppercase tracking-[0.16em] mb-4">
          {{ t('reports.material') }}
        </h2>

        <div class="space-y-4 text-xs font-bold">
          <div>
            <div class="flex justify-between text-white/80 mb-1">
              <span>{{ t('reports.materialReady') }}</span
              ><span>{{ materialResumo.pronto }}</span>
            </div>
            <div class="h-2 rounded-full bg-white/15 overflow-hidden">
              <div
                class="h-full bg-[#00D3B8]"
                :style="{
                  width: `${totalAgendamentos ? (materialResumo.pronto / totalAgendamentos) * 100 : 0}%`
                }"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between text-white/80 mb-1">
              <span>{{ t('reports.noMaterial') }}</span
              ><span>{{ materialResumo.semMaterial }}</span>
            </div>
            <div class="h-2 rounded-full bg-white/15 overflow-hidden">
              <div
                class="h-full bg-[#F7C65E]"
                :style="{
                  width: `${totalAgendamentos ? (materialResumo.semMaterial / totalAgendamentos) * 100 : 0}%`
                }"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between text-white/80 mb-1">
              <span>{{ t('reports.notInformed') }}</span
              ><span>{{ materialResumo.naoInformado }}</span>
            </div>
            <div class="h-2 rounded-full bg-white/15 overflow-hidden">
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

      <section class="rounded-3xl border border-white/20 bg-white/8 p-5 mb-10">
        <h2 class="text-sm font-black uppercase tracking-[0.16em] mb-4">
          {{ t('reports.quickInsights') }}
        </h2>

        <div class="space-y-3 text-sm font-semibold">
          <p class="flex items-start gap-2">
            <CalendarDaysIcon class="w-4 h-4 mt-0.5 text-[#B5FFF6]" />
            <span>
              {{ t('reports.busyDay') }} <strong>{{ diaMaisCheio?.label || '--/--' }}</strong> ({
              diaMaisCheio?.total || 0 }} {{ t('reports.bookingsSuffix') }})
            </span>
          </p>

          <p class="flex items-start gap-2">
            <CheckBadgeIcon class="w-4 h-4 mt-0.5 text-[#B5FFF6]" />
            <span>
              {{ t('reports.bestClient') }}
              <strong>{{ topClientes[0]?.cliente || t('reports.noData') }}</strong>
              ({{ topClientes[0]?.total || 0 }} {{ t('reports.servicesSuffix') }})
            </span>
          </p>
        </div>

        <div class="mt-5" v-if="topClientes.length">
          <p class="text-[10px] uppercase tracking-[0.16em] text-white/70 font-black mb-2">
            {{ t('reports.topClients') }}
          </p>
          <div class="space-y-3">
            <div
              v-for="cliente in topClientes"
              :key="cliente.cliente"
              class="bg-white/8 border border-white/15 rounded-xl p-3 flex items-center justify-between"
            >
              <span class="font-bold text-sm truncate pr-3">{{ cliente.cliente }}</span>
              <span class="text-xs font-black uppercase tracking-[0.14em] text-[#B5FFF6]">
                {{
                  t('reports.totalCompleted', {
                    total: cliente.total,
                    completed: cliente.finalizados
                  })
                }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
