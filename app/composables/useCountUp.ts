import { ref, onScopeDispose, isRef, type Ref } from 'vue'

interface ParsedNumber {
  prefix: string
  suffix: string
  target: number
  decimals: number
  decimalSep: string
  groupSep: string
}

interface UseCountUpOptions {
  /** Animation duration in ms. Default: 1400 */
  duration?: number
  /** Delay before starting, in ms. Default: 0 */
  delay?: number
}

const NUMERIC_RE = /\d+(?:[.,]\d+)*/

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Parses the first numeric chunk of a formatted string such as
 * "R$ 3.840,00", "99.8%", "150k+" or "26.000+ Agendamentos", keeping the
 * original separators so the animated output matches the source exactly.
 * Returns null when the string has no number (e.g. "Zero Faltas").
 */
function parseNumeric(raw: string): ParsedNumber | null {
  const match = NUMERIC_RE.exec(raw)
  if (!match || match.index === undefined) return null

  const numeric = match[0]
  const lastDot = numeric.lastIndexOf('.')
  const lastComma = numeric.lastIndexOf(',')

  let decimalSep = ''
  if (lastDot >= 0 && lastComma >= 0) {
    decimalSep = lastDot > lastComma ? '.' : ','
  } else if (lastDot >= 0 || lastComma >= 0) {
    const sep = lastDot >= 0 ? '.' : ','
    const tail = numeric.slice(Math.max(lastDot, lastComma) + 1)
    // A tail of exactly 3 digits is grouping ("26.000"), anything else is decimal ("2.5").
    decimalSep = tail.length === 3 ? '' : sep
  }

  const groupSep = decimalSep === '.' ? ',' : decimalSep === ',' ? '.' : ''
  let normalized = numeric
  if (groupSep) normalized = normalized.split(groupSep).join('')
  if (decimalSep) normalized = normalized.replace(decimalSep, '.')
  const target = Number(normalized)
  if (Number.isNaN(target)) return null

  return {
    prefix: raw.slice(0, match.index),
    suffix: raw.slice(match.index + numeric.length),
    target,
    decimals: decimalSep ? (numeric.split(decimalSep)[1]?.length ?? 0) : 0,
    decimalSep,
    groupSep
  }
}

function formatNumber(
  value: number,
  decimals: number,
  decimalSep: string,
  groupSep: string
): string {
  const fixed = Math.max(0, value).toFixed(decimals)
  const [intPart = '0', fracPart] = fixed.split('.')

  let grouped = intPart
  if (groupSep && intPart.length > 3) {
    grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep)
  }

  if (decimals > 0 && fracPart !== undefined) {
    return grouped + (decimalSep || '.') + fracPart
  }
  return grouped
}

/**
 * Animates the first number found in `raw` from 0 up to its final value.
 *
 * - `display` starts (and SSRs) as the untouched original string; the final
 *   animation frame also writes the original string back, so content is
 *   never altered.
 * - `run()` is cancellable/re-entrant: calling it again cancels any frame in
 *   flight before restarting.
 * - Under `prefers-reduced-motion: reduce` it jumps straight to the final
 *   value without animating.
 * - Strings without numbers render statically.
 */
export function useCountUp(
  raw: string | Ref<string>,
  options: UseCountUpOptions = {}
): { display: Ref<string>; run: () => void; stop: () => void } {
  const initial = isRef(raw) ? raw.value : raw
  const display = ref(initial)

  const resolve = () => (isRef(raw) ? raw.value : raw)

  let frame: number | null = null
  let startTs: number | null = null
  let delayTimer: ReturnType<typeof setTimeout> | null = null

  const stop = () => {
    if (frame !== null) {
      cancelAnimationFrame(frame)
      frame = null
    }
    if (delayTimer !== null) {
      clearTimeout(delayTimer)
      delayTimer = null
    }
    startTs = null
  }

  const run = () => {
    stop()
    const text = resolve()
    const parsed = parseNumeric(text)

    if (!parsed || prefersReducedMotion()) {
      display.value = text
      return
    }

    const { target, decimals, decimalSep, groupSep, prefix, suffix } = parsed
    const duration = options.duration ?? 1400

    const start = () => {
      delayTimer = null
      const tick = (ts: number) => {
        if (startTs === null) startTs = ts
        const progress = Math.min(1, (ts - startTs) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        display.value =
          prefix + formatNumber(target * eased, decimals, decimalSep, groupSep) + suffix
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          display.value = text
          frame = null
        }
      }
      frame = requestAnimationFrame(tick)
    }

    if (options.delay && options.delay > 0) {
      delayTimer = setTimeout(start, options.delay)
    } else {
      start()
    }
  }

  onScopeDispose(stop)

  return { display, run, stop }
}
