export const formatarValor = (valor: number | string | null | undefined): string => {
  if (valor === null || valor === undefined) return ''
  const numero = typeof valor === 'string' ? Number(valor.replace(',', '.')) : valor
  if (Number.isNaN(numero)) return ''
  return numero.toFixed(2).replace('.', ',')
}

export const parseValor = (texto: string): number => {
  if (!texto) return 0
  const limpo = texto.replace(/[^\d,]/g, '').replace(',', '.')
  const numero = Number(limpo)
  return Number.isNaN(numero) ? 0 : numero
}

export const valorValido = (texto: string): boolean => {
  if (!texto || !texto.trim()) return true
  const numero = parseValor(texto)
  return !Number.isNaN(numero) && numero >= 0
}
