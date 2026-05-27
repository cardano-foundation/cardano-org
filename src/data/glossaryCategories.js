export const CATEGORIES = {
  general: { label: 'General Blockchain', color: '#6b7280' },
  tokens: { label: 'Tokens & Assets', color: '#0ea5e9' },
  consensus: { label: 'Consensus & Staking', color: '#1442b3' },
  'smart-contracts': { label: 'Smart Contracts', color: '#8b5cf6' },
  wallets: { label: 'Wallets & Keys', color: '#10b981' },
  governance: { label: 'Governance', color: '#f59e0b' },
  network: { label: 'Network & Protocol', color: '#ef4444' },
};

export const CATEGORY_ORDER = [
  'general',
  'tokens',
  'consensus',
  'smart-contracts',
  'wallets',
  'governance',
  'network',
];

// Icon name for each featured term (resolves to /img/icons/<name>.svg). Used in
// the Popular Terms grid on the glossary index. Slugs missing here fall back
// to a category-tinted dot.
export const FEATURED_ICONS = {
  'ada': 'ada',
  'cardano': 'ada',
  'ouroboros': 'code-branch-solid',
  'stake-pool': 'database-solid',
  'delegation': 'handshake-solid',
  'wallet': 'wallet-solid',
  'smart-contract': 'code-solid',
  'utxo': 'barcode-solid',
  'eutxo': 'scroll-solid',
  'drep': 'users-solid',
  'seed-phrase': 'shield-solid',
};

// "Learning paths" surfaced on the index — these are not internal paths through
// the glossary, just curated entry points into existing site sections. Keep the
// list short and grounded in pages that actually exist.
export const LEARNING_PATHS = [
  {
    id: 'new-to-cardano',
    title: 'New to Cardano?',
    description: 'Start here if you are new to the ecosystem.',
    href: '/get-started',
    icon: 'shapes-solid',
  },
  {
    id: 'governance',
    title: 'Governance 101',
    description: 'Understand how governance on Cardano works.',
    href: '/governance',
    icon: 'scroll-solid',
  },
  {
    id: 'explore-apps',
    title: 'Explore Cardano Apps',
    description: 'Discover curated wallets, DEXs, governance tools, and more.',
    href: '/apps',
    icon: 'shapes-solid',
  },
];
