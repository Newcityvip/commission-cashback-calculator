import { describe, expect, it } from 'vitest'
import { walletConfigs } from '../config/rates'
import { calculateCashback, calculateCommission, parseNumericInput } from './calculations'

const wallet = (id: string) => walletConfigs.find((item) => item.id === id)!

describe('SIM commission', () => {
  it.each([[100000, 1.5, 1500], [100000, 0.5, 500], [100000, 0.65, 650], ['15,000,000', 1.25, 187500], [1000.5, 1.5, 15.01]])('calculates %s at %s%%', (amount, rate, expected) => expect(calculateCommission(amount, rate)).toBe(expected))
  it('handles zero and blank safely', () => { expect(calculateCommission(0, 1.5)).toBe(0); expect(calculateCommission('', 1.5)).toBeNull() })
  it('combines independent deposit and withdrawal rates', () => {
    const deposit = calculateCommission('1,000,000', 1.5) ?? 0
    const withdrawal = calculateCommission('500,000', 1) ?? 0
    expect(deposit).toBe(15000)
    expect(withdrawal).toBe(5000)
    expect(deposit + withdrawal).toBe(20000)
  })
  it('supports deposit-only and withdrawal-only flows', () => {
    expect((calculateCommission(1000, 1.5) ?? 0) + (calculateCommission('', 1) ?? 0)).toBe(15)
    expect((calculateCommission('', 1.5) ?? 0) + (calculateCommission(1000, 1) ?? 0)).toBe(10)
  })
  it('keeps both blank inputs at zero when totals use safe fallbacks', () => {
    expect((calculateCommission('', 1.5) ?? 0) + (calculateCommission('', 1) ?? 0)).toBe(0)
  })
})

describe('cashback rates', () => {
  it.each([
    ['bkash', 'deposit', 4000], ['bkash', 'withdrawal', 3750], ['nagad', 'deposit', 4100], ['nagad', 'withdrawal', 4100],
    ['rocket', 'deposit', 4200], ['rocket', 'withdrawal', 4750], ['upay', 'deposit', 4100], ['upay', 'withdrawal', 4100],
  ] as const)('%s %s', (id, type, expected) => expect(calculateCashback(1_000_000, wallet(id), type)).toBe(expected))
  it('combines bKash deposit and withdrawal', () => expect((calculateCashback(1_000_000, wallet('bkash'), 'deposit') ?? 0) + (calculateCashback(1_000_000, wallet('bkash'), 'withdrawal') ?? 0)).toBe(7750))
  it.each([
    ['nagad', 8200],
    ['rocket', 8950],
    ['upay', 8200],
  ] as const)('combines %s deposit and withdrawal', (id, expected) => {
    const total = (calculateCashback(1_000_000, wallet(id), 'deposit') ?? 0) + (calculateCashback(1_000_000, wallet(id), 'withdrawal') ?? 0)
    expect(total).toBe(expected)
  })
  it('supports deposit-only and withdrawal-only cashback', () => {
    expect((calculateCashback(1_000_000, wallet('bkash'), 'deposit') ?? 0) + (calculateCashback('', wallet('bkash'), 'withdrawal') ?? 0)).toBe(4000)
    expect((calculateCashback('', wallet('bkash'), 'deposit') ?? 0) + (calculateCashback(1_000_000, wallet('bkash'), 'withdrawal') ?? 0)).toBe(3750)
  })
  it('keeps both blank cashback inputs at zero with safe fallbacks', () => {
    expect((calculateCashback('', wallet('bkash'), 'deposit') ?? 0) + (calculateCashback('', wallet('bkash'), 'withdrawal') ?? 0)).toBe(0)
  })
  it('refuses unavailable rates', () => expect(calculateCashback(1000, wallet('tap-pay'), 'deposit')).toBeNull())
  it('accepts comma and decimal input', () => expect(calculateCashback('1,000.50', wallet('bkash'), 'deposit')).toBe(4))
})

describe('input sanitation', () => {
  it('accepts large and comma-separated values', () => expect(parseNumericInput('15,000,000')).toBe(15000000))
  it.each(['', '-1', 'abc', '1,2x', 'Infinity'])('rejects %s', (value) => expect(parseNumericInput(value)).toBeNull())
})
