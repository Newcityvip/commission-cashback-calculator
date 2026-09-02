export const translations = {
  bn: {
    appName: 'হিসাব', tagline: 'কমিশন ও ক্যাশব্যাক ক্যালকুলেটর', commission: 'কমিশন', cashback: 'ক্যাশব্যাক', rates: 'রেট',
    eyebrow: 'দ্রুত • নির্ভুল • স্বচ্ছ', heroTitle: 'প্রতিটি লেনদেনের সঠিক আয়, মুহূর্তেই।', heroText: 'সিম এজেন্ট কমিশন ও ই-ওয়ালেট ক্যাশব্যাকের নির্ভরযোগ্য হিসাব—কোনো জটিলতা ছাড়াই।',
    commissionTitle: 'সিম এজেন্ট কমিশন', commissionDesc: 'মোট লেনদেন ও কমিশন রেট লিখুন। ফলাফল সঙ্গে সঙ্গে দেখুন।', totalAmount: 'মোট টাকা', commissionRate: 'কমিশন রেট', quickRate: 'দ্রুত রেট', commissionEarned: 'অর্জিত কমিশন', appliedRate: 'প্রযোজ্য রেট',
    cashbackTitle: 'ই-ওয়ালেট ক্যাশব্যাক', cashbackDesc: 'একটি লেনদেন বা একাধিক ওয়ালেটের মোট ভলিউম হিসাব করুন।', quick: 'দ্রুত হিসাব', multi: 'একাধিক ওয়ালেট', wallet: 'ওয়ালেট', transaction: 'লেনদেন', deposit: 'ডিপোজিট', withdrawal: 'উইথড্রয়াল', amount: 'টাকার পরিমাণ', cashbackAmount: 'ক্যাশব্যাক',
    depositCashback: 'ডিপোজিট ক্যাশব্যাক', withdrawalCashback: 'উইথড্রয়াল ক্যাশব্যাক', walletTotal: 'ওয়ালেট মোট', grandTotal: 'সর্বমোট ক্যাশব্যাক',
    combinedTitle: 'মোট আয়', combinedDesc: 'কমিশন ও ক্যাশব্যাকের সম্মিলিত সারাংশ', totalEarnings: 'সর্বমোট আয়',
    ratesTitle: 'বর্তমান ক্যাশব্যাক রেট', ratesDesc: 'হিসাবের প্রতিটি রেট এখানে স্পষ্টভাবে দেখানো হয়েছে।', depositRate: 'ডিপোজিট রেট', withdrawalRate: 'উইথড্রয়াল রেট', pending: 'এখনও নির্ধারিত নয়',
    reset: 'মুছুন', copy: 'ফলাফল কপি করুন', copied: 'কপি হয়েছে', enterValid: 'সঠিক শূন্য বা ধনাত্মক সংখ্যা লিখুন', notConfigured: 'এই ওয়ালেটের রেট এখনও নির্ধারিত হয়নি', noCalculation: 'হিসাব দেখতে টাকার পরিমাণ লিখুন', inputHint: 'কমাসহ বা ছাড়া লিখতে পারেন',
    footer: 'বাংলাদেশের এজেন্টদের জন্য সহজ, স্বচ্ছ হিসাব।', skip: 'মূল অংশে যান', language: 'ভাষা নির্বাচন', scrollRates: 'ক্যাশব্যাক রেট দেখুন',
  },
  en: {
    appName: 'Hishab', tagline: 'Commission & Cashback Calculator', commission: 'Commission', cashback: 'Cashback', rates: 'Rates',
    eyebrow: 'Fast • Accurate • Transparent', heroTitle: 'Know exactly what you earn, in seconds.', heroText: 'Reliable SIM agent commission and e-wallet cashback calculations—without the spreadsheet complexity.',
    commissionTitle: 'SIM Agent Commission', commissionDesc: 'Enter your total volume and commission rate. See the result instantly.', totalAmount: 'Total amount', commissionRate: 'Commission rate', quickRate: 'Quick rates', commissionEarned: 'Commission earned', appliedRate: 'Applied rate',
    cashbackTitle: 'E-Wallet Cashback', cashbackDesc: 'Calculate one transaction or the combined volume across multiple wallets.', quick: 'Quick calculator', multi: 'Multi-wallet', wallet: 'Wallet', transaction: 'Transaction', deposit: 'Deposit', withdrawal: 'Withdrawal', amount: 'Amount', cashbackAmount: 'Cashback amount',
    depositCashback: 'Deposit cashback', withdrawalCashback: 'Withdrawal cashback', walletTotal: 'Wallet total', grandTotal: 'Grand cashback total',
    combinedTitle: 'Combined earnings', combinedDesc: 'Your commission and cashback in one summary', totalEarnings: 'Total earnings',
    ratesTitle: 'Current cashback rates', ratesDesc: 'Every rate used by the calculator is shown transparently.', depositRate: 'Deposit rate', withdrawalRate: 'Withdrawal rate', pending: 'Not configured',
    reset: 'Clear', copy: 'Copy result', copied: 'Copied', enterValid: 'Enter a valid zero or positive number', notConfigured: 'Rates for this wallet are not configured yet', noCalculation: 'Enter an amount to see your result', inputHint: 'Commas are optional',
    footer: 'Simple, transparent calculations for Bangladesh agents.', skip: 'Skip to main content', language: 'Choose language', scrollRates: 'View cashback rates',
  },
} as const

export type Translation = typeof translations.en
