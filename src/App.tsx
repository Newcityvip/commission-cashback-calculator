import { memo, useEffect, useMemo, useState } from 'react'
import { commissionPresets, configuredWallets, walletConfigs } from './config/rates'
import { translations } from './i18n/translations'
import type { Language, TransactionType, WalletConfig } from './types'
import { calculateCashback, calculateCommission, parseNumericInput } from './utils/calculations'
import { formatMoney, formatPercentInput, formatRate } from './utils/format'

type CopyState = 'idle' | 'copied'
type Volumes = Record<string, { deposit: string; withdrawal: string }>

const emptyVolumes = Object.fromEntries(
  configuredWallets.map(({ id }) => [id, { deposit: '', withdrawal: '' }]),
) as Volumes

function App() {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('hishab-language') === 'en' ? 'en' : 'bn')
  const [commissionAmount, setCommissionAmount] = useState('')
  const [commissionRate, setCommissionRate] = useState('1.5')
  const [cashbackMode, setCashbackMode] = useState<'quick' | 'multi'>('quick')
  const [walletId, setWalletId] = useState('bkash')
  const [transaction, setTransaction] = useState<TransactionType>('deposit')
  const [quickAmount, setQuickAmount] = useState('')
  const [volumes, setVolumes] = useState<Volumes>(emptyVolumes)
  const t = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem('hishab-language', language)
  }, [language])

  const commissionResult = calculateCommission(commissionAmount, commissionRate) ?? 0
  const selectedWallet = walletConfigs.find((wallet) => wallet.id === walletId) ?? walletConfigs[0]
  const quickResult = calculateCashback(quickAmount, selectedWallet, transaction) ?? 0
  const multiRows = useMemo(() => configuredWallets.map((wallet) => {
    const deposit = calculateCashback(volumes[wallet.id]?.deposit ?? '', wallet, 'deposit') ?? 0
    const withdrawal = calculateCashback(volumes[wallet.id]?.withdrawal ?? '', wallet, 'withdrawal') ?? 0
    return { wallet, deposit, withdrawal, total: deposit + withdrawal }
  }), [volumes])
  const multiTotal = multiRows.reduce((sum, row) => sum + row.total, 0)
  const activeCashback = cashbackMode === 'quick' ? quickResult : multiTotal
  const combinedTotal = commissionResult + activeCashback

  function changeLanguage(next: Language) { setLanguage(next) }
  function resetCommission() { setCommissionAmount(''); setCommissionRate('1.5') }
  function resetCashback() { setQuickAmount(''); setWalletId('bkash'); setTransaction('deposit'); setVolumes(emptyVolumes) }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">{t.skip}</a>
      <Header language={language} onLanguage={changeLanguage} />
      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow"><span />{t.eyebrow}</p>
            <h1 id="hero-title">{t.heroTitle}</h1>
            <p className="hero-copy">{t.heroText}</p>
          </div>
          <div className="hero-proof" aria-hidden="true">
            <div className="proof-mark">৳</div>
            <div><strong>100%</strong><span>{language === 'bn' ? 'ব্রাউজারেই হিসাব' : 'Calculated locally'}</span></div>
          </div>
        </section>

        <div className="calculator-grid wrap">
          <CommissionCard language={language} amount={commissionAmount} rate={commissionRate} result={commissionResult}
            onAmount={setCommissionAmount} onRate={setCommissionRate} onReset={resetCommission} />
          <CashbackCard language={language} mode={cashbackMode} setMode={setCashbackMode} walletId={walletId}
            setWalletId={setWalletId} transaction={transaction} setTransaction={setTransaction} amount={quickAmount}
            setAmount={setQuickAmount} selectedWallet={selectedWallet} quickResult={quickResult} volumes={volumes}
            setVolumes={setVolumes} multiRows={multiRows} multiTotal={multiTotal} onReset={resetCashback} />
        </div>

        {(commissionResult > 0 || activeCashback > 0) && (
          <section className="combined wrap" aria-labelledby="combined-title">
            <div><p className="section-kicker">{t.combinedTitle}</p><h2 id="combined-title">{t.combinedDesc}</h2></div>
            <div className="combined-math">
              <SummaryLine label={t.commissionTitle} value={formatMoney(commissionResult, language)} />
              <span className="operator">+</span>
              <SummaryLine label={t.cashbackTitle} value={formatMoney(activeCashback, language)} />
              <span className="operator">=</span>
              <div className="combined-total"><span>{t.totalEarnings}</span><strong>{formatMoney(combinedTotal, language)}</strong></div>
            </div>
          </section>
        )}

        <RateReference language={language} />
      </main>
      <footer className="wrap"><div className="brand-symbol small">৳</div><p>{t.footer}</p><span>© {new Date().getFullYear()} Hishab</span></footer>
    </div>
  )
}

const Header = memo(function Header({ language, onLanguage }: { language: Language; onLanguage: (lang: Language) => void }) {
  const t = translations[language]
  return <header className="site-header"><div className="wrap header-inner">
    <a className="brand" href="#main" aria-label={t.appName}><span className="brand-symbol">৳</span><span><strong>{t.appName}</strong><small>{t.tagline}</small></span></a>
    <nav aria-label={language === 'bn' ? 'প্রধান নেভিগেশন' : 'Main navigation'}>
      <a href="#commission">{t.commission}</a><a href="#cashback">{t.cashback}</a><a href="#rates">{t.rates}</a>
    </nav>
    <div className="language-toggle" role="group" aria-label={t.language}>
      <button className={language === 'bn' ? 'active' : ''} onClick={() => onLanguage('bn')} aria-pressed={language === 'bn'}>বাংলা</button>
      <span>|</span><button className={language === 'en' ? 'active' : ''} onClick={() => onLanguage('en')} aria-pressed={language === 'en'}>English</button>
    </div>
  </div></header>
})

function CommissionCard({ language, amount, rate, result, onAmount, onRate, onReset }: {
  language: Language; amount: string; rate: string; result: number; onAmount: (v: string) => void; onRate: (v: string) => void; onReset: () => void
}) {
  const t = translations[language]
  const parsedAmount = parseNumericInput(amount)
  const parsedRate = parseNumericInput(rate)
  const invalid = (amount !== '' && parsedAmount === null) || (rate !== '' && parsedRate === null)
  const summary = `${t.commissionTitle}\n${t.totalAmount}: ${formatMoney(parsedAmount ?? 0, language)}\n${t.appliedRate}: ${formatPercentInput(rate)}\n${t.commissionEarned}: ${formatMoney(result, language)}`
  return <section id="commission" className="calculator-card" aria-labelledby="commission-title">
    <CardHeader number="01" title={t.commissionTitle} description={t.commissionDesc} />
    <div className="form-stack">
      <MoneyInput id="commission-amount" label={t.totalAmount} value={amount} onChange={onAmount} language={language} />
      <div className="field-group"><label htmlFor="commission-rate">{t.commissionRate}</label><div className="input-wrap suffix"><input id="commission-rate" inputMode="decimal" value={rate} onChange={(e) => onRate(e.target.value)} aria-invalid={invalid} /><span>%</span></div>
        <div className="preset-row"><span>{t.quickRate}</span>{commissionPresets.map((preset) => <button key={preset} className={Number(rate) === preset ? 'selected' : ''} onClick={() => onRate(String(preset))}>{preset}%</button>)}</div>
      </div>
      {invalid && <p className="validation" role="alert">{t.enterValid}</p>}
    </div>
    <ResultPanel label={t.commissionEarned} value={formatMoney(result, language)} muted={!amount || invalid}>
      <div className="result-breakdown"><span>{t.totalAmount}<strong>{formatMoney(parsedAmount ?? 0, language)}</strong></span><span>{t.appliedRate}<strong>{formatPercentInput(rate)}</strong></span></div>
      {parsedAmount !== null && parsedRate !== null && <p className="formula">{formatMoney(parsedAmount, language)} × {formatPercentInput(rate)} = {formatMoney(result, language)}</p>}
    </ResultPanel>
    <Actions copyText={summary} onReset={onReset} language={language} disabled={!amount || invalid} />
  </section>
}

function CashbackCard(props: {
  language: Language; mode: 'quick' | 'multi'; setMode: (m: 'quick' | 'multi') => void; walletId: string; setWalletId: (v: string) => void;
  transaction: TransactionType; setTransaction: (v: TransactionType) => void; amount: string; setAmount: (v: string) => void;
  selectedWallet: WalletConfig; quickResult: number; volumes: Volumes; setVolumes: React.Dispatch<React.SetStateAction<Volumes>>;
  multiRows: { wallet: WalletConfig; deposit: number; withdrawal: number; total: number }[]; multiTotal: number; onReset: () => void
}) {
  const { language, mode, setMode, walletId, setWalletId, transaction, setTransaction, amount, setAmount, selectedWallet, quickResult, volumes, setVolumes, multiRows, multiTotal, onReset } = props
  const t = translations[language]
  const parsedAmount = parseNumericInput(amount)
  const rate = transaction === 'deposit' ? selectedWallet.depositRate : selectedWallet.withdrawalRate
  const invalid = amount !== '' && parsedAmount === null
  const quickSummary = `${selectedWallet.name} ${t[transaction]}\n${t.amount}: ${formatMoney(parsedAmount ?? 0, language)}\n${t.appliedRate}: ${formatRate(rate)}\n${t.cashbackAmount}: ${formatMoney(quickResult, language)}`
  const multiSummary = `${t.grandTotal}\n${multiRows.map((row) => `${row.wallet.name}: ${formatMoney(row.total, language)}`).join('\n')}\n${t.grandTotal}: ${formatMoney(multiTotal, language)}`
  function updateVolume(id: string, type: TransactionType, value: string) { setVolumes((current) => ({ ...current, [id]: { ...current[id], [type]: value } })) }
  return <section id="cashback" className="calculator-card cashback-card" aria-labelledby="cashback-title">
    <CardHeader number="02" title={t.cashbackTitle} description={t.cashbackDesc} />
    <div className="segmented" role="group" aria-label={t.cashbackTitle}><button className={mode === 'quick' ? 'active' : ''} onClick={() => setMode('quick')}>{t.quick}</button><button className={mode === 'multi' ? 'active' : ''} onClick={() => setMode('multi')}>{t.multi}</button></div>
    {mode === 'quick' ? <>
      <div className="form-stack"><div className="field-group"><label htmlFor="wallet">{t.wallet}</label><select id="wallet" value={walletId} onChange={(e) => setWalletId(e.target.value)}>{walletConfigs.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}{wallet.depositRate === null ? ` — ${t.pending}` : ''}</option>)}</select></div>
        <div className="field-group"><span className="field-label">{t.transaction}</span><div className="transaction-toggle"><button className={transaction === 'deposit' ? 'active' : ''} onClick={() => setTransaction('deposit')}>{t.deposit}</button><button className={transaction === 'withdrawal' ? 'active' : ''} onClick={() => setTransaction('withdrawal')}>{t.withdrawal}</button></div></div>
        <MoneyInput id="quick-amount" label={t.amount} value={amount} onChange={setAmount} language={language} />
        {rate === null && <p className="unavailable" role="status">{t.notConfigured}</p>}{invalid && <p className="validation" role="alert">{t.enterValid}</p>}
      </div>
      <ResultPanel label={t.cashbackAmount} value={formatMoney(quickResult, language)} muted={!amount || invalid || rate === null}>
        <div className="result-breakdown"><span>{t.wallet}<strong>{selectedWallet.name}</strong></span><span>{t.appliedRate}<strong>{formatRate(rate)}</strong></span></div>
      </ResultPanel>
      <Actions copyText={quickSummary} onReset={onReset} language={language} disabled={!amount || invalid || rate === null} />
    </> : <>
      <div className="multi-list">{multiRows.map((row) => <div className="wallet-row" key={row.wallet.id}>
        <div className="wallet-name"><span>{row.wallet.name.slice(0, 1)}</span><strong>{row.wallet.name}</strong><small>{t.walletTotal}: {formatMoney(row.total, language)}</small></div>
        <MoneyInput compact id={`${row.wallet.id}-deposit`} label={`${t.deposit} (${formatRate(row.wallet.depositRate)})`} value={volumes[row.wallet.id]?.deposit ?? ''} onChange={(v) => updateVolume(row.wallet.id, 'deposit', v)} language={language} result={formatMoney(row.deposit, language)} />
        <MoneyInput compact id={`${row.wallet.id}-withdrawal`} label={`${t.withdrawal} (${formatRate(row.wallet.withdrawalRate)})`} value={volumes[row.wallet.id]?.withdrawal ?? ''} onChange={(v) => updateVolume(row.wallet.id, 'withdrawal', v)} language={language} result={formatMoney(row.withdrawal, language)} />
      </div>)}</div>
      <ResultPanel label={t.grandTotal} value={formatMoney(multiTotal, language)} muted={multiTotal === 0} />
      <Actions copyText={multiSummary} onReset={onReset} language={language} disabled={multiTotal === 0} />
    </>}
  </section>
}

function MoneyInput({ id, label, value, onChange, language, compact, result }: { id: string; label: string; value: string; onChange: (v: string) => void; language: Language; compact?: boolean; result?: string }) {
  const t = translations[language]
  return <div className={`field-group ${compact ? 'compact-field' : ''}`}><label htmlFor={id}>{label}</label><div className="input-wrap"><span>৳</span><input id={id} inputMode="decimal" placeholder="0" value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={`${id}-hint`} /></div>{compact ? <small className="inline-result">{result}</small> : <small id={`${id}-hint`}>{t.inputHint}</small>}</div>
}

function CardHeader({ number, title, description }: { number: string; title: string; description: string }) { return <div className="card-header"><span>{number}</span><div><h2 id={number === '01' ? 'commission-title' : 'cashback-title'}>{title}</h2><p>{description}</p></div></div> }
function ResultPanel({ label, value, muted, children }: { label: string; value: string; muted: boolean; children?: React.ReactNode }) { return <div className={`result-panel ${muted ? 'muted' : ''}`} aria-live="polite"><div className="result-main"><span>{label}</span><strong>{value}</strong></div>{children}</div> }
function SummaryLine({ label, value }: { label: string; value: string }) { return <div className="summary-line"><span>{label}</span><strong>{value}</strong></div> }

function Actions({ copyText, onReset, language, disabled }: { copyText: string; onReset: () => void; language: Language; disabled: boolean }) {
  const [copyState, setCopyState] = useState<CopyState>('idle'); const t = translations[language]
  async function copy() { try { await navigator.clipboard.writeText(copyText); setCopyState('copied'); window.setTimeout(() => setCopyState('idle'), 1800) } catch { /* Clipboard can be unavailable in non-secure previews. */ } }
  return <div className="actions"><button className="button secondary" onClick={onReset}><span aria-hidden="true">↻</span>{t.reset}</button><button className="button primary" onClick={copy} disabled={disabled}><span aria-hidden="true">{copyState === 'copied' ? '✓' : '⧉'}</span>{copyState === 'copied' ? t.copied : t.copy}</button></div>
}

function RateReference({ language }: { language: Language }) {
  const t = translations[language]
  return <section id="rates" className="rates-section wrap" aria-labelledby="rates-title"><div className="rates-heading"><div><p className="section-kicker">{t.rates}</p><h2 id="rates-title">{t.ratesTitle}</h2><p>{t.ratesDesc}</p></div><div className="rate-legend"><span /><p>{language === 'bn' ? 'সর্বশেষ যাচাইকৃত রেট' : 'Latest verified rates'}</p></div></div>
    <div className="rate-table-wrap"><table><thead><tr><th>{t.wallet}</th><th>{t.depositRate}</th><th>{t.withdrawalRate}</th><th>{language === 'bn' ? 'অবস্থা' : 'Status'}</th></tr></thead><tbody>{walletConfigs.map((wallet) => <tr key={wallet.id}><th>{wallet.name}</th><td>{formatRate(wallet.depositRate)}</td><td>{formatRate(wallet.withdrawalRate)}</td><td><span className={wallet.depositRate === null ? 'status pending' : 'status live'}>{wallet.depositRate === null ? t.pending : (language === 'bn' ? 'চালু' : 'Active')}</span></td></tr>)}</tbody></table></div>
  </section>
}

export default App
