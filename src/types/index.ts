export type Language = 'bn' | 'en'
export type Theme = 'light' | 'dark'
export type TransactionType = 'deposit' | 'withdrawal'

export interface WalletConfig {
  id: string
  name: string
  depositRate: number | null
  withdrawalRate: number | null
}
