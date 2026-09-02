import { memo, useEffect, useMemo, useState } from 'react'
import { commissionPresets, configuredWallets, walletConfigs } from './config/rates'
import { translations } from './i18n/translations'
import type { Language, Theme, TransactionType, WalletConfig } from './types'
import { calculateCashback, calculateCommission, parseNumericInput } from './utils/calculations'
import { formatMoney, formatPercentInput, formatRate } from './utils/format'

type Volumes = Record<string, { deposit: string; withdrawal: string }>
type SimState = { depositAmount: string; depositRate: string; withdrawalAmount: string; withdrawalRate: string }
const createEmptyVolumes = () => Object.fromEntries(configuredWallets.map(({ id }) => [id, { deposit: '', withdrawal: '' }])) as Volumes
const defaultSim: SimState = { depositAmount: '', depositRate: '1.5', withdrawalAmount: '', withdrawalRate: '1' }

function App() {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('hishab-language') === 'en' ? 'en' : 'bn')
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('hishab-theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  const [sim, setSim] = useState<SimState>(defaultSim)
  const [cashbackMode, setCashbackMode] = useState<'quick' | 'multi'>('quick')
  const [walletId, setWalletId] = useState('bkash')
  const [quickVolumes, setQuickVolumes] = useState({ deposit: '', withdrawal: '' })
  const [volumes, setVolumes] = useState<Volumes>(createEmptyVolumes)
  const t = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = language === 'bn' ? 'হিসাব — কমিশন ও ক্যাশব্যাক ক্যালকুলেটর' : 'Hishab — Commission & Cashback Calculator'
    localStorage.setItem('hishab-language', language)
  }, [language])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f1f5f4' : '#07131f')
    localStorage.setItem('hishab-theme', theme)
  }, [theme])

  const depositCommission = calculateCommission(sim.depositAmount, sim.depositRate) ?? 0
  const withdrawalCommission = calculateCommission(sim.withdrawalAmount, sim.withdrawalRate) ?? 0
  const totalCommission = depositCommission + withdrawalCommission
  const selectedWallet = walletConfigs.find((wallet) => wallet.id === walletId) ?? walletConfigs[0]
  const quickDeposit = calculateCashback(quickVolumes.deposit, selectedWallet, 'deposit') ?? 0
  const quickWithdrawal = calculateCashback(quickVolumes.withdrawal, selectedWallet, 'withdrawal') ?? 0
  const quickTotal = quickDeposit + quickWithdrawal
  const multiRows = useMemo(() => configuredWallets.map((wallet) => {
    const deposit = calculateCashback(volumes[wallet.id]?.deposit ?? '', wallet, 'deposit') ?? 0
    const withdrawal = calculateCashback(volumes[wallet.id]?.withdrawal ?? '', wallet, 'withdrawal') ?? 0
    return { wallet, deposit, withdrawal, total: deposit + withdrawal }
  }), [volumes])
  const multiTotal = multiRows.reduce((sum, row) => sum + row.total, 0)
  const activeCashback = cashbackMode === 'quick' ? quickTotal : multiTotal

  return <div className="app-shell">
    <a className="skip-link" href="#main">{t.skip}</a>
    <Header language={language} onLanguage={setLanguage} theme={theme} onTheme={setTheme} />
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-identity" aria-hidden="true">৳</div>
        <div className="hero-copy"><h1 id="hero-title">{t.heroTitle}</h1><p>{t.heroText}</p></div>
        <div className="utility-badges"><span><i>✓</i>{t.instant}</span><span><i>✓</i>{t.noLogin}</span><span><i>✓</i>{t.browserNote}</span></div>
      </section>
      <div className="calculator-grid wrap">
        <CommissionCard language={language} state={sim} setState={setSim} depositResult={depositCommission} withdrawalResult={withdrawalCommission} total={totalCommission} />
        <CashbackCard language={language} mode={cashbackMode} setMode={setCashbackMode} walletId={walletId} setWalletId={setWalletId}
          quickVolumes={quickVolumes} setQuickVolumes={setQuickVolumes} selectedWallet={selectedWallet} quickDeposit={quickDeposit}
          quickWithdrawal={quickWithdrawal} quickTotal={quickTotal} volumes={volumes} setVolumes={setVolumes} multiRows={multiRows} multiTotal={multiTotal} />
      </div>
      {(totalCommission > 0 || activeCashback > 0) && <Combined language={language} commission={totalCommission} cashback={activeCashback} />}
      <RateReference language={language} />
    </main>
    <footer className="wrap"><div className="brand-symbol small">৳</div><p>{t.footer}</p><span>© {new Date().getFullYear()} Hishab</span></footer>
  </div>
}

const Header = memo(function Header({ language, onLanguage, theme, onTheme }: { language: Language; onLanguage: (lang: Language) => void; theme: Theme; onTheme: (theme: Theme) => void }) {
  const t = translations[language]
  return <header className="site-header"><div className="wrap header-inner">
    <a className="brand" href="#main"><span className="brand-symbol">৳</span><span><strong>{t.appName}</strong><small>{t.tagline}</small></span></a>
    <nav aria-label={language === 'bn' ? 'প্রধান নেভিগেশন' : 'Main navigation'}><a href="#commission">{t.commission}</a><a href="#cashback">{t.cashback}</a><a href="#rates">{t.rates}</a></nav>
    <div className="header-controls"><div className="theme-toggle" role="group" aria-label={t.theme}><button className={theme === 'light' ? 'active' : ''} onClick={() => onTheme('light')} aria-pressed={theme === 'light'} aria-label={t.light}><span aria-hidden="true">☀</span><em>{t.light}</em></button><button className={theme === 'dark' ? 'active' : ''} onClick={() => onTheme('dark')} aria-pressed={theme === 'dark'} aria-label={t.dark}><span aria-hidden="true">◐</span><em>{t.dark}</em></button></div><div className="language-toggle" role="group" aria-label={t.language}><button className={language === 'bn' ? 'active' : ''} onClick={() => onLanguage('bn')} aria-pressed={language === 'bn'}>বাংলা</button><button className={language === 'en' ? 'active' : ''} onClick={() => onLanguage('en')} aria-pressed={language === 'en'}>EN</button></div></div>
  </div></header>
})

function CommissionCard({ language, state, setState, depositResult, withdrawalResult, total }: {
  language: Language; state: SimState; setState: React.Dispatch<React.SetStateAction<SimState>>; depositResult: number; withdrawalResult: number; total: number
}) {
  const t = translations[language]
  const update = (key: keyof SimState, value: string) => setState((current) => ({ ...current, [key]: value }))
  const depositInvalid = isInvalid(state.depositAmount) || isInvalid(state.depositRate)
  const withdrawalInvalid = isInvalid(state.withdrawalAmount) || isInvalid(state.withdrawalRate)
  const copyText = `${t.commissionTitle}\n\n${t.depositAmount}: ${formatMoney(parseNumericInput(state.depositAmount) ?? 0, language)}\n${t.depositRate}: ${formatPercentInput(state.depositRate)}\n${t.depositCommission}: ${formatMoney(depositResult, language)}\n\n${t.withdrawalAmount}: ${formatMoney(parseNumericInput(state.withdrawalAmount) ?? 0, language)}\n${t.withdrawalRate}: ${formatPercentInput(state.withdrawalRate)}\n${t.withdrawalCommission}: ${formatMoney(withdrawalResult, language)}\n\n${t.totalCommission}: ${formatMoney(total, language)}`
  return <section id="commission" className="calculator-card" aria-labelledby="commission-title">
    <CardHeader number="01" id="commission-title" title={t.commissionTitle} description={t.commissionDesc} hint={t.inputHint} />
    <TransactionSection title={t.deposit} tone="deposit"><MoneyInput id="sim-deposit" label={t.depositAmount} value={state.depositAmount} onChange={(v) => update('depositAmount', v)} language={language} /><RateInput id="sim-deposit-rate" language={language} value={state.depositRate} onChange={(v) => update('depositRate', v)} /></TransactionSection>
    <TransactionSection title={t.withdrawal} tone="withdrawal"><MoneyInput id="sim-withdrawal" label={t.withdrawalAmount} value={state.withdrawalAmount} onChange={(v) => update('withdrawalAmount', v)} language={language} /><RateInput id="sim-withdrawal-rate" language={language} value={state.withdrawalRate} onChange={(v) => update('withdrawalRate', v)} /></TransactionSection>
    {(depositInvalid || withdrawalInvalid) && <p className="validation" role="alert">{t.enterValid}</p>}
    <EarningsResult language={language} rows={[[t.depositCommission, depositResult], [t.withdrawalCommission, withdrawalResult]]} totalLabel={t.totalCommission} total={total} />
    <Actions language={language} copyText={copyText} disabled={total === 0 || depositInvalid || withdrawalInvalid} onReset={() => setState(defaultSim)} />
  </section>
}

function CashbackCard(props: {
  language: Language; mode: 'quick' | 'multi'; setMode: (m: 'quick' | 'multi') => void; walletId: string; setWalletId: (v: string) => void;
  quickVolumes: { deposit: string; withdrawal: string }; setQuickVolumes: React.Dispatch<React.SetStateAction<{ deposit: string; withdrawal: string }>>;
  selectedWallet: WalletConfig; quickDeposit: number; quickWithdrawal: number; quickTotal: number; volumes: Volumes; setVolumes: React.Dispatch<React.SetStateAction<Volumes>>;
  multiRows: { wallet: WalletConfig; deposit: number; withdrawal: number; total: number }[]; multiTotal: number
}) {
  const { language, mode, setMode, walletId, setWalletId, quickVolumes, setQuickVolumes, selectedWallet, quickDeposit, quickWithdrawal, quickTotal, volumes, setVolumes, multiRows, multiTotal } = props
  const t = translations[language]
  const unavailable = selectedWallet.depositRate === null || selectedWallet.withdrawalRate === null
  const invalid = isInvalid(quickVolumes.deposit) || isInvalid(quickVolumes.withdrawal)
  const copyText = `${selectedWallet.name} ${t.cashbackTitle}\n\n${t.depositAmount}: ${formatMoney(parseNumericInput(quickVolumes.deposit) ?? 0, language)}\n${t.depositRate}: ${formatRate(selectedWallet.depositRate)}\n${t.depositCashback}: ${formatMoney(quickDeposit, language)}\n\n${t.withdrawalAmount}: ${formatMoney(parseNumericInput(quickVolumes.withdrawal) ?? 0, language)}\n${t.withdrawalRate}: ${formatRate(selectedWallet.withdrawalRate)}\n${t.withdrawalCashback}: ${formatMoney(quickWithdrawal, language)}\n\n${t.totalCashback}: ${formatMoney(quickTotal, language)}`
  const multiCopy = `${t.grandTotal}\n${multiRows.map((row) => `${row.wallet.name}: ${formatMoney(row.total, language)}`).join('\n')}\n\n${t.grandTotal}: ${formatMoney(multiTotal, language)}`
  const updateVolume = (id: string, type: TransactionType, value: string) => setVolumes((current) => ({ ...current, [id]: { ...current[id], [type]: value } }))
  return <section id="cashback" className="calculator-card" aria-labelledby="cashback-title">
    <CardHeader number="02" id="cashback-title" title={t.cashbackTitle} description={t.cashbackDesc} hint={t.inputHint} />
    <div className={`cashback-controls ${mode === 'multi' ? 'multi-active' : ''}`}><div className="segmented" role="group" aria-label={t.cashbackTitle}><button className={mode === 'quick' ? 'active' : ''} onClick={() => setMode('quick')}>{t.quick}</button><button className={mode === 'multi' ? 'active' : ''} onClick={() => setMode('multi')}>{t.multi}</button></div>{mode === 'quick' && <div className="wallet-select"><label htmlFor="wallet">{t.wallet}</label><select id="wallet" value={walletId} onChange={(e) => setWalletId(e.target.value)}>{walletConfigs.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}{wallet.depositRate === null ? ` — ${t.pending}` : ''}</option>)}</select></div>}</div>
    {mode === 'quick' ? <>
      <TransactionSection title={t.deposit} tone="deposit" badge={<RateBadge label={t.depositRate} rate={selectedWallet.depositRate} />}><MoneyInput id="cashback-deposit" label={t.depositAmount} value={quickVolumes.deposit} onChange={(deposit) => setQuickVolumes((v) => ({ ...v, deposit }))} language={language} /></TransactionSection>
      <TransactionSection title={t.withdrawal} tone="withdrawal" badge={<RateBadge label={t.withdrawalRate} rate={selectedWallet.withdrawalRate} />}><MoneyInput id="cashback-withdrawal" label={t.withdrawalAmount} value={quickVolumes.withdrawal} onChange={(withdrawal) => setQuickVolumes((v) => ({ ...v, withdrawal }))} language={language} /></TransactionSection>
      {unavailable && <p className="unavailable" role="status">{t.notConfigured}</p>}{invalid && <p className="validation" role="alert">{t.enterValid}</p>}
      <EarningsResult language={language} rows={[[t.depositCashback, quickDeposit], [t.withdrawalCashback, quickWithdrawal]]} totalLabel={t.totalCashback} total={quickTotal} />
      <Actions language={language} copyText={copyText} disabled={quickTotal === 0 || invalid || unavailable} onReset={() => { setWalletId('bkash'); setQuickVolumes({ deposit: '', withdrawal: '' }) }} />
    </> : <>
      <div className="multi-list">{multiRows.map((row) => <div className="wallet-row" key={row.wallet.id}>
        <div className="wallet-name"><span>{row.wallet.name[0]}</span><strong>{row.wallet.name}</strong><small>{t.walletTotal}: {formatMoney(row.total, language)}</small></div>
        <MoneyInput compact id={`${row.wallet.id}-deposit`} label={`${t.deposit} (${formatRate(row.wallet.depositRate)})`} value={volumes[row.wallet.id]?.deposit ?? ''} onChange={(v) => updateVolume(row.wallet.id, 'deposit', v)} language={language} result={formatMoney(row.deposit, language)} />
        <MoneyInput compact id={`${row.wallet.id}-withdrawal`} label={`${t.withdrawal} (${formatRate(row.wallet.withdrawalRate)})`} value={volumes[row.wallet.id]?.withdrawal ?? ''} onChange={(v) => updateVolume(row.wallet.id, 'withdrawal', v)} language={language} result={formatMoney(row.withdrawal, language)} />
      </div>)}</div>
      <EarningsResult language={language} rows={multiRows.map((row) => [row.wallet.name, row.total])} totalLabel={t.grandTotal} total={multiTotal} />
      <Actions language={language} copyText={multiCopy} disabled={multiTotal === 0} onReset={() => setVolumes(createEmptyVolumes())} />
    </>}
  </section>
}

function TransactionSection({ title, tone, badge, children }: { title: string; tone: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return <div className={`transaction-section ${tone}`}><div className="transaction-heading"><span className="transaction-icon" aria-hidden="true">{tone === 'deposit' ? '↓' : '↑'}</span><h3>{title}</h3>{badge}</div><div className="transaction-fields">{children}</div></div>
}
function RateInput({ id, language, value, onChange }: { id: string; language: Language; value: string; onChange: (v: string) => void }) {
  const t = translations[language]
  return <div className="field-group rate-field"><label htmlFor={id}>{t.commissionRate}</label><div className="input-wrap suffix"><input id={id} inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} /><span>%</span></div><div className="preset-row"><span>{t.quickRate}</span>{commissionPresets.map((preset) => <button key={preset} className={Number(value) === preset ? 'selected' : ''} onClick={() => onChange(String(preset))}>{preset}%</button>)}</div></div>
}
function MoneyInput({ id, label, value, onChange, compact, result }: { id: string; label: string; value: string; onChange: (v: string) => void; language: Language; compact?: boolean; result?: string }) {
  return <div className={`field-group ${compact ? 'compact-field' : ''}`}><label htmlFor={id}>{label}</label><div className="input-wrap"><span>৳</span><input id={id} inputMode="decimal" placeholder="0" value={value} onChange={(e) => onChange(e.target.value)} /></div>{compact && <small className="inline-result">{result}</small>}</div>
}
function RateBadge({ label, rate }: { label: string; rate: number | null }) { return <span className="rate-badge"><small>{label}</small><strong>{formatRate(rate)}</strong></span> }
function CardHeader({ number, id, title, description, hint }: { number: string; id: string; title: string; description: string; hint: string }) { return <div className="card-header"><span>{number}</span><div><h2 id={id}>{title}</h2><p>{description}</p><small>{hint}</small></div></div> }
function isInvalid(value: string) { return value !== '' && parseNumericInput(value) === null }

function EarningsResult({ language, rows, totalLabel, total }: { language: Language; rows: (readonly [string, number])[]; totalLabel: string; total: number }) {
  return <div className={`earnings-result ${total === 0 ? 'muted' : ''}`} aria-live="polite"><div className="earning-rows">{rows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{formatMoney(value, language)}</strong></div>)}</div><div className="earning-total"><span>{totalLabel}</span><strong>{formatMoney(total, language)}</strong></div></div>
}
function Actions({ copyText, onReset, language, disabled }: { copyText: string; onReset: () => void; language: Language; disabled: boolean }) {
  const [copied, setCopied] = useState(false); const t = translations[language]
  async function copy() { try { await navigator.clipboard.writeText(copyText); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { /* unavailable in some non-secure previews */ } }
  return <div className="actions"><button className="button secondary" onClick={onReset}><span aria-hidden="true">↻</span>{t.reset}</button><button className="button primary" onClick={copy} disabled={disabled}><span aria-hidden="true">{copied ? '✓' : '⧉'}</span>{copied ? t.copied : t.copy}</button></div>
}
function Combined({ language, commission, cashback }: { language: Language; commission: number; cashback: number }) {
  const t = translations[language]
  return <section className="combined wrap" aria-labelledby="combined-title"><div><p className="section-kicker">{t.combinedTitle}</p><h2 id="combined-title">{t.combinedDesc}</h2></div><div className="combined-math"><SummaryLine label={t.commissionTitle} value={formatMoney(commission, language)} /><span className="operator">+</span><SummaryLine label={t.cashbackTitle} value={formatMoney(cashback, language)} /><span className="operator">=</span><div className="combined-total"><span>{t.totalEarnings}</span><strong>{formatMoney(commission + cashback, language)}</strong></div></div></section>
}
function SummaryLine({ label, value }: { label: string; value: string }) { return <div className="summary-line"><span>{label}</span><strong>{value}</strong></div> }
function RateReference({ language }: { language: Language }) {
  const t = translations[language]
  return <section id="rates" className="rates-section wrap" aria-labelledby="rates-title"><div className="rates-heading"><div><p className="section-kicker">{t.rates}</p><h2 id="rates-title">{t.ratesTitle}</h2><p>{t.ratesDesc}</p></div></div><div className="rate-table-wrap"><table><thead><tr><th>{t.wallet}</th><th>{t.depositRate}</th><th>{t.withdrawalRate}</th><th>{t.status}</th></tr></thead><tbody>{walletConfigs.map((wallet) => <tr key={wallet.id}><th>{wallet.name}</th><td>{formatRate(wallet.depositRate)}</td><td>{formatRate(wallet.withdrawalRate)}</td><td><span className={wallet.depositRate === null ? 'status pending' : 'status live'}>{wallet.depositRate === null ? t.pending : t.active}</span></td></tr>)}</tbody></table></div></section>
}

export default App
