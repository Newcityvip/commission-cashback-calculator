import type { WalletConfig, TransactionType } from '../types'

export function parseNumericInput(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const cleaned = String(value).replace(/,/g, '').trim()
  if (cleaned === '') return null
  if (!/^\d*\.?\d+$/.test(cleaned)) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

export function calculateCommission(amount: string | number, percentage: string | number): number | null {
  const safeAmount = parseNumericInput(amount)
  const safePercentage = parseNumericInput(percentage)
  if (safeAmount === null || safePercentage === null) return null
  return roundMoney(safeAmount * (safePercentage / 100))
}

export function calculateCashback(
  amount: string | number,
  wallet: WalletConfig,
  type: TransactionType,
): number | null {
  const safeAmount = parseNumericInput(amount)
  const rate = type === 'deposit' ? wallet.depositRate : wallet.withdrawalRate
  if (safeAmount === null || rate === null) return null
  return roundMoney(safeAmount * rate)
}

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return 0
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100
  return Object.is(rounded, -0) ? 0 : rounded
}
