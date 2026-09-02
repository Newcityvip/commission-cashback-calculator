import type { WalletConfig } from '../types'

// Change wallet rates only here. Rates are decimals: 0.004 = 0.40%.
export const walletConfigs: readonly WalletConfig[] = [
  { id: 'bkash', name: 'bKash', depositRate: 0.004, withdrawalRate: 0.00375 },
  { id: 'nagad', name: 'Nagad', depositRate: 0.0041, withdrawalRate: 0.0041 },
  { id: 'rocket', name: 'Rocket', depositRate: 0.0042, withdrawalRate: 0.00475 },
  { id: 'upay', name: 'Upay', depositRate: 0.0041, withdrawalRate: 0.0041 },
  { id: 'tap-pay', name: 'Tap Pay', depositRate: null, withdrawalRate: null },
  { id: 'surecash', name: 'SureCash', depositRate: null, withdrawalRate: null },
  { id: 'ok-wallet', name: 'OK Wallet', depositRate: null, withdrawalRate: null },
] as const

export const configuredWallets = walletConfigs.filter(
  (wallet) => wallet.depositRate !== null && wallet.withdrawalRate !== null,
)

export const commissionPresets = [0.5, 1, 1.5, 2] as const
