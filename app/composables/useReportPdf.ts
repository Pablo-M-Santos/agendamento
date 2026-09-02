import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Agendamento } from '~/composables/useAgendamentos'
import type { ReportsPeriod, StatusFilter } from '~/composables/useReportsPage'

type GerarPdfParams = {
  usuarioNome: string
  periodo: ReportsPeriod
  filtroStatus: StatusFilter
  agendamentos: Agendamento[]
  totalAgendamentos: number
  totalFinalizados: number
  totalNaoConcluidos: number
  totalMaterialPronto: number
  taxaConclusao: number
  materialResumo: { pronto: number; semMaterial: number; naoInformado: number }
}

const PERIOD_LABEL: Record<ReportsPeriod, string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  mes: 'Mês atual'
}

const STATUS_LABEL: Record<StatusFilter, string> = {
  todos: 'Todos',
  concluidos: 'Concluídos',
  abertos: 'Em aberto',
  atrasados: 'Atrasados'
}

const formatarData = (timestamp: { toDate: () => Date }) =>
  format(timestamp.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })

const statusTexto = (item: Agendamento) => {
  if (item.servicoConcluido === true) return 'Concluído'
  if (item.servicoConcluido === false) return 'Em aberto'
  return 'Sem status'
}

const materialTexto = (item: Agendamento) => {
  if (item.materialPronto === true) return 'Pronto'
  if (item.materialPronto === false) return 'Sem material'
  return 'Não informado'
}

export const useReportPdf = () => {
  const gerarPdfRelatorio = (params: GerarPdfParams): Blob => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 14
    const generatedAt = format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })

    doc.setFillColor(20, 26, 40)
    doc.rect(0, 0, pageWidth, 28, 'F')
    doc.setTextColor(237, 239, 244)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Relatório de Agendamentos', margin, 14)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(138, 147, 166)
    doc.text(`Usuário: ${params.usuarioNome}`, margin, 20)
    doc.text(`Gerado em: ${generatedAt}`, pageWidth - margin, 20, { align: 'right' })

    doc.setTextColor(237, 239, 244)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Período:', margin, 38)
    doc.setFont('helvetica', 'normal')
    doc.text(PERIOD_LABEL[params.periodo], margin + 18, 38)
    doc.setFont('helvetica', 'bold')
    doc.text('Filtro:', margin, 44)
    doc.setFont('helvetica', 'normal')
    doc.text(STATUS_LABEL[params.filtroStatus], margin + 18, 44)

    const cardY = 52
    const cardWidth = (pageWidth - margin * 2 - 6) / 4
    const cardHeight = 22

    const cards = [
      { label: 'Agendamentos', value: params.totalAgendamentos.toString(), color: [138, 147, 166] },
      { label: 'Concluídos', value: params.totalFinalizados.toString(), color: [127, 224, 204] },
      { label: 'Não finalizados', value: params.totalNaoConcluidos.toString(), color: [79, 209, 197] },
      { label: 'Material pronto', value: params.totalMaterialPronto.toString(), color: [35, 51, 80] }
    ]

    cards.forEach((card, i) => {
      const x = margin + i * (cardWidth + 2)
      doc.setFillColor(26, 33, 50)
      doc.roundedRect(x, cardY, cardWidth, cardHeight, 2, 2, 'F')
      doc.setTextColor(138, 147, 166)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(card.label.toUpperCase(), x + 3, cardY + 6)
      doc.setTextColor(...(card.color as [number, number, number]))
      doc.setFontSize(14)
      doc.text(card.value, x + 3, cardY + 16)
    })

    const taxaY = cardY + cardHeight + 8
    doc.setFillColor(26, 33, 50)
    doc.roundedRect(margin, taxaY, pageWidth - margin * 2, 14, 2, 2, 'F')
    doc.setTextColor(138, 147, 166)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('TAXA DE CONCLUSÃO', margin + 3, taxaY + 5)
    doc.setTextColor(127, 224, 204)
    doc.setFontSize(11)
    doc.text(`${params.taxaConclusao.toFixed(1)}%`, margin + 3, taxaY + 11)

    const barraX = margin + 50
    const barraWidth = pageWidth - margin * 2 - 53
    doc.setFillColor(20, 26, 40)
    doc.roundedRect(barraX, taxaY + 7, barraWidth, 4, 2, 2, 'F')
    doc.setFillColor(79, 209, 197)
    doc.roundedRect(
      barraX,
      taxaY + 7,
      (barraWidth * Math.min(100, params.taxaConclusao)) / 100,
      4,
      2,
      2,
      'F'
    )

    const materialY = taxaY + 22
    doc.setFillColor(26, 33, 50)
    doc.roundedRect(margin, materialY, pageWidth - margin * 2, 24, 2, 2, 'F')
    doc.setTextColor(237, 239, 244)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('MATERIAL', margin + 3, materialY + 5)

    const itemsMaterial = [
      { label: 'Material pronto', value: params.materialResumo.pronto, color: [79, 209, 197] },
      { label: 'Sem material', value: params.materialResumo.semMaterial, color: [35, 51, 80] },
      { label: 'Não informado', value: params.materialResumo.naoInformado, color: [38, 46, 66] }
    ]

    itemsMaterial.forEach((item, i) => {
      const y = materialY + 10 + i * 4
      doc.setTextColor(138, 147, 166)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.text(item.label, margin + 3, y)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(237, 239, 244)
      doc.text(item.value.toString(), margin + 60, y)
      doc.setFillColor(...(item.color as [number, number, number]))
      const totalItens =
        params.materialResumo.pronto + params.materialResumo.semMaterial + params.materialResumo.naoInformado
      const percent = totalItens > 0 ? item.value / totalItens : 0
      const barMaxW = 60
      doc.roundedRect(margin + 70, y - 2.5, barMaxW * percent, 2, 1, 1, 'F')
    })

    const tableY = materialY + 30

    const agendamentosLimitados = params.agendamentos.slice(0, 200)
    const linhasTabela = agendamentosLimitados.map((item) => [
      formatarData(item.data),
      item.cliente,
      item.endereco || '-',
      statusTexto(item),
      materialTexto(item)
    ])

    autoTable(doc, {
      startY: tableY,
      head: [['Data/Hora', 'Cliente', 'Endereço', 'Status', 'Material']],
      body: linhasTabela,
      theme: 'grid',
      headStyles: {
        fillColor: [27, 79, 74],
        textColor: [234, 251, 246],
        fontSize: 8,
        fontStyle: 'bold',
        lineColor: [38, 46, 66],
        lineWidth: 0.1
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [237, 239, 244],
        fillColor: [26, 33, 50],
        lineColor: [38, 46, 66],
        lineWidth: 0.1
      },
      alternateRowStyles: {
        fillColor: [20, 26, 40]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 32 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 22 },
        4: { cellWidth: 24 }
      },
      margin: { left: margin, right: margin },
      styles: { overflow: 'linebreak', cellPadding: 2 }
    })

    if (params.agendamentos.length > 200) {
      const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4
      doc.setTextColor(138, 147, 166)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'italic')
      doc.text(
        `(${params.agendamentos.length - 200} serviços adicionais omitidos)`,
        margin,
        finalY
      )
    }

    const totalPaginas = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages()
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i)
      doc.setTextColor(138, 147, 166)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Página ${i} de ${totalPaginas}`,
        pageWidth - margin,
        pageHeight - 6,
        { align: 'right' }
      )
      doc.text('Agendamento - Relatório', margin, pageHeight - 6)
    }

    return doc.output('blob')
  }

  const compartilharOuBaixarPdf = async (blob: Blob, nomeArquivo: string): Promise<'compartilhado' | 'baixado' | 'cancelado'> => {
    if (typeof window === 'undefined') return 'cancelado'
    if (typeof navigator === 'undefined') return 'cancelado'

    const arquivo = new File([blob], nomeArquivo, { type: 'application/pdf' })

    const podeCompartilharArquivo =
      typeof navigator.canShare === 'function' && navigator.canShare({ files: [arquivo] })

    if (typeof navigator.share === 'function' && podeCompartilharArquivo) {
      try {
        await navigator.share({
          files: [arquivo],
          title: nomeArquivo,
          text: 'Relatório de agendamentos'
        })
        return 'compartilhado'
      } catch (erro) {
        if (erro instanceof Error && erro.name === 'AbortError') {
          return 'cancelado'
        }
      }
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = nomeArquivo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return 'baixado'
  }

  return { gerarPdfRelatorio, compartilharOuBaixarPdf }
}
