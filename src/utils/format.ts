import type { Language } from '../types'

export function formatMoney(value: number, language: Language, decimals = 'auto'): string {
  const hasFraction = Math.abs(value % 1) > Number.EPSILON
  const digits = decimals === 'auto' ? (hasFraction ? 2 : 0) : Number(decimals)
  return `৳${new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-BD', {
    minimumFractionDigits: digits,
    maximumFractionDigits: 2,
  }).format(value || 0)}`
}

export function formatRate(rate: number | null): string {
  if (rate === null) return '—'
  return `${Number((rate * 100).toFixed(4))}%`
}

export function formatPercentInput(value: string | number): string {
  const num = Number(value)
  return Number.isFinite(num) ? `${num}%` : '0%'
}
