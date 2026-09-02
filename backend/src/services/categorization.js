// Rule-based transaction categorization — merchant category code (MCC)
// first, merchant-name keyword matching as a fallback. Deliberately simple:
// this is a prototype, not an ML classifier.

export const CATEGORIES = ['Hotel', 'Flight', 'Meals', 'Transport', 'Other'];

// A representative (not exhaustive) slice of the standard ISO 18245 MCC
// ranges, grouped into SeeSight's five categories.
const MCC_RULES = [
  { category: 'Hotel', codes: ['7011'] },
  {
    category: 'Flight',
    // 3000-3299 is the classic airline MCC block; 4511 is "airlines, air carriers".
    test: (mcc) => {
      const n = Number(mcc);
      return (n >= 3000 && n <= 3299) || n === 4511 || n === 4582;
    },
  },
  { category: 'Meals', codes: ['5812', '5813', '5814'] },
  {
    category: 'Transport',
    codes: ['4121', '4111', '4112', '7512', '7513', '7514', '5541', '5542', '4131'],
  },
];

const KEYWORD_RULES = [
  {
    category: 'Hotel',
    keywords: ['hotel', 'inn', 'suites', 'marriott', 'hilton', 'hyatt', 'hostel', 'resort', 'lodge'],
  },
  {
    category: 'Flight',
    keywords: ['air', 'airlines', 'airways', 'flight', 'aviation'],
  },
  {
    category: 'Meals',
    keywords: ['restaurant', 'cafe', 'café', 'coffee', 'bistro', 'bar', 'grill', 'diner', 'eatery', 'starbucks', 'khinkali', 'bakery'],
  },
  {
    category: 'Transport',
    keywords: ['uber', 'lyft', 'bolt', 'taxi', 'transit', 'metro', 'rail', 'rental', 'car hire', 'parking', 'gas', 'fuel', 'yandex'],
  },
];

function byMcc(mcc) {
  if (!mcc) return null;
  for (const rule of MCC_RULES) {
    if (rule.codes?.includes(String(mcc))) return rule.category;
    if (rule.test?.(mcc)) return rule.category;
  }
  return null;
}

function byMerchantName(merchantName) {
  const name = (merchantName || '').toLowerCase();
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => name.includes(kw))) return rule.category;
  }
  return null;
}

/**
 * Auto-categorize a transaction. MCC match wins; falls back to a merchant
 * name keyword match; defaults to "Other".
 */
export function categorize({ merchantName, mcc }) {
  return byMcc(mcc) || byMerchantName(merchantName) || 'Other';
}
