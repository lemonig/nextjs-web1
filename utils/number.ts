export function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function formatMoney(value: unknown, decimals = 2): string {
  const n = toNumber(value)
  return n.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function round(value: unknown, decimals = 2): number {
  const n = toNumber(value)
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
