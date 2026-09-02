export const translations = {
  bn: {
    appName: 'হিসাব', tagline: 'কমিশন ও ক্যাশব্যাক ক্যালকুলেটর', commission: 'কমিশন', cashback: 'ক্যাশব্যাক', rates: 'রেট',
    heroTitle: 'হিসাব করুন সহজে ও নির্ভুলভাবে', heroText: 'ডিপোজিট ও উইথড্রয়ের পরিমাণ লিখুন। কমিশন ও ক্যাশব্যাক সঙ্গে সঙ্গে দেখুন।', browserNote: 'হিসাব তাৎক্ষণিকভাবে আপনার ব্রাউজারেই হয়',
    commissionTitle: 'সিম এজেন্ট কমিশন', commissionDesc: 'ডিপোজিট ও উইথড্রয়ের পরিমাণ এবং আলাদা কমিশন রেট লিখুন।', commissionRate: 'কমিশন রেট', quickRate: 'দ্রুত রেট',
    deposit: 'ডিপোজিট', withdrawal: 'উইথড্রয়াল', depositAmount: 'ডিপোজিটের পরিমাণ', withdrawalAmount: 'উইথড্রয়ের পরিমাণ', depositCommission: 'ডিপোজিট কমিশন', withdrawalCommission: 'উইথড্র কমিশন', totalCommission: 'মোট কমিশন',
    cashbackTitle: 'ই-ওয়ালেট ক্যাশব্যাক', cashbackDesc: 'একটি ওয়ালেট নির্বাচন করে ডিপোজিট ও উইথড্রয়ের মোট ক্যাশব্যাক দেখুন।', quick: 'একটি ওয়ালেট', multi: 'একাধিক ওয়ালেট', wallet: 'ওয়ালেট',
    depositCashback: 'ডিপোজিট ক্যাশব্যাক', withdrawalCashback: 'উইথড্র ক্যাশব্যাক', totalCashback: 'মোট ক্যাশব্যাক', walletTotal: 'ওয়ালেট মোট', grandTotal: 'সর্বমোট ক্যাশব্যাক',
    combinedTitle: 'সম্মিলিত আয়', combinedDesc: 'কমিশন ও ক্যাশব্যাকের সংক্ষিপ্ত সারাংশ', totalEarnings: 'সর্বমোট আয়',
    ratesTitle: 'বর্তমান ক্যাশব্যাক রেট', ratesDesc: 'ক্যালকুলেটরে ব্যবহৃত যাচাইকৃত রেটগুলো এক নজরে দেখুন।', depositRate: 'ডিপোজিট রেট', withdrawalRate: 'উইথড্রয়াল রেট', pending: 'অপেক্ষমাণ', active: 'চালু', status: 'অবস্থা',
    reset: 'রিসেট', copy: 'ফলাফল কপি করুন', copied: 'কপি হয়েছে', enterValid: 'সঠিক শূন্য বা ধনাত্মক সংখ্যা লিখুন', notConfigured: 'এই ওয়ালেটের রেট এখনও নির্ধারিত হয়নি', inputHint: 'কমাসহ বা ছাড়া লিখতে পারেন',
    footer: 'বাংলাদেশের এজেন্টদের জন্য সহজ, স্বচ্ছ হিসাব।', skip: 'মূল অংশে যান', language: 'ভাষা নির্বাচন',
  },
  en: {
    appName: 'Hishab', tagline: 'Commission & Cashback Calculator', commission: 'Commission', cashback: 'Cashback', rates: 'Rates',
    heroTitle: 'Calculate Commission & Cashback', heroText: 'Enter deposit and withdrawal amounts and instantly see your total earnings.', browserNote: 'Calculations happen instantly in your browser',
    commissionTitle: 'SIM Agent Commission', commissionDesc: 'Enter deposit and withdrawal amounts with independent commission rates.', commissionRate: 'Commission Rate', quickRate: 'Quick rates',
    deposit: 'Deposit', withdrawal: 'Withdrawal', depositAmount: 'Deposit Amount', withdrawalAmount: 'Withdrawal Amount', depositCommission: 'Deposit Commission', withdrawalCommission: 'Withdrawal Commission', totalCommission: 'Total Commission',
    cashbackTitle: 'E-Wallet Cashback', cashbackDesc: 'Select one wallet and calculate cashback for both deposit and withdrawal.', quick: 'Single wallet', multi: 'Multi-wallet', wallet: 'Wallet',
    depositCashback: 'Deposit Cashback', withdrawalCashback: 'Withdrawal Cashback', totalCashback: 'Total Cashback', walletTotal: 'Wallet total', grandTotal: 'Grand Cashback Total',
    combinedTitle: 'Combined Earnings', combinedDesc: 'A concise summary of commission and cashback', totalEarnings: 'Total Earnings',
    ratesTitle: 'Current Cashback Rates', ratesDesc: 'See every verified rate used by the calculator at a glance.', depositRate: 'Deposit Rate', withdrawalRate: 'Withdrawal Rate', pending: 'Pending', active: 'Active', status: 'Status',
    reset: 'Reset', copy: 'Copy Result', copied: 'Copied', enterValid: 'Enter a valid zero or positive number', notConfigured: 'Rates for this wallet are not configured yet', inputHint: 'Commas are optional',
    footer: 'Simple, transparent calculations for Bangladesh agents.', skip: 'Skip to main content', language: 'Choose language',
  },
} as const

export type Translation = typeof translations.en
