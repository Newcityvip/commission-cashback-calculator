# Hishab — Commission & Cashback Calculator

A fast, bilingual (বাংলা + English), browser-only calculator for Bangladesh SIM agents. It calculates SIM agent commission, quick e-wallet cashback, multi-wallet cashback volume, and combined earnings without a backend or network request.

## Features

- Instant SIM commission with presets and unrestricted custom percentages
- Quick cashback for one wallet transaction
- Multi-wallet deposit/withdrawal calculation with wallet and grand totals
- Complete Bangla and English interface with locally saved language preference
- Transparent rate reference, pending-rate safeguards, copy, and reset actions
- Responsive layout designed for 320px through large desktop screens
- Lightweight Vite + React + TypeScript build, ready for GitHub Pages

## Formulas

```text
Commission = Total Amount × (Commission Percentage / 100)
Cashback   = Transaction Amount × Configured Decimal Rate
```

All output is rounded safely to two decimal places. Inputs support commas, decimals, zero, and large amounts. Negative or invalid values are rejected.

## Current verified cashback rates

| Wallet | Deposit | Withdrawal |
| --- | ---: | ---: |
| bKash | 0.40% | 0.375% |
| Nagad | 0.41% | 0.41% |
| Rocket | 0.42% | 0.475% |
| Upay | 0.41% | 0.41% |
| Tap Pay | Not configured | Not configured |
| SureCash | Not configured | Not configured |
| OK Wallet | Not configured | Not configured |

Unconfigured wallets are visible but cannot produce a misleading calculation.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run test
npm run build
```

## Updating wallet rates

All wallet configuration lives in [`src/config/rates.ts`](src/config/rates.ts). Rates are stored as exact decimals (`0.004` means `0.40%`). To update a rate, change only its configuration value. To add a wallet, add one object with a stable `id`, display `name`, and deposit/withdrawal rates. Use `null` for any unverified rate; never use zero as a placeholder.

Commission quick-rate presets are maintained in the same file.

## GitHub Pages deployment

Vite uses `/commission-cashback-calculator/` as its production base path. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) tests, builds, and deploys `dist` whenever `main` is pushed.

In the GitHub repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The site will be available at:

<https://newcityvip.github.io/commission-cashback-calculator/>
