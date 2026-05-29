// Category accents pulled toward the Cardano brand palette
// (see /brand-assets): Cardano Blue #0033AD, Red #ff5553, Green #3b7982.
// Tokens, wallets and network sit directly on brand colors; smart-contracts
// and governance use muted brand-adjacent tones; general stays neutral grey.
export const CATEGORIES = {
  general: { label: 'General Blockchain', color: '#6b7280' },
  tokens: { label: 'Tokens & Assets', color: '#0033AD' },
  consensus: { label: 'Consensus & Staking', color: '#1442b3' },
  'smart-contracts': { label: 'Smart Contracts', color: '#5b3eaa' },
  wallets: { label: 'Wallets & Keys', color: '#3b7982' },
  governance: { label: 'Governance', color: '#a16207' },
  network: { label: 'Network & Protocol', color: '#ff5553' },
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

// Default SVG icon name per category. Used in the term-page "Explore next"
// cards and the Definition badge when a more specific FEATURED_ICONS entry
// is not available for the term.
export const CATEGORY_DEFAULT_ICONS = {
  general: 'book-solid',
  tokens: 'coins-solid',
  consensus: 'database-solid',
  'smart-contracts': 'code-solid',
  wallets: 'wallet-solid',
  governance: 'scroll-solid',
  network: 'route-solid',
};

// Icons for the "Browse by category" chips on the glossary index. These lean
// more concrete/iconic than CATEGORY_DEFAULT_ICONS (which still drives the
// term-page surfaces) so the chip row reads at a glance.
export const CATEGORY_CHIP_ICONS = {
  general: 'database-solid',
  tokens: 'coins-solid',
  consensus: 'shield-solid',
  'smart-contracts': 'code-solid',
  wallets: 'key-solid',
  governance: 'building-columns-solid',
  network: 'globe-solid',
};

// Term-specific icons that override the per-category default in surfaces
// that render an icon next to a term (Definition card, Explore-next cards).
// Limit to the most recognizable terms to avoid bikeshedding 130+ icons.
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
  'mithril': 'shield-solid',
  'hydra': 'share-nodes-solid',
  'plutus-core': 'code-solid',
  'aiken': 'code-solid',
  'haskell': 'code-solid',
  'datum': 'newspaper-solid',
  'redeemer': 'certificate-solid',
  'oracle': 'chart-line-solid',
  'collateral': 'shield-solid',
  'governance-action': 'square-poll-vertical-solid',
  'cip-1694': 'scroll-solid',
  'constitution': 'scroll-solid',
  'constitutional-committee': 'building-solid',
  'voltaire': 'building-solid',
  'chang': 'code-branch-solid',
  'plomin': 'code-branch-solid',
  'hard-fork': 'code-branch-solid',
  'epoch': 'calendar-solid',
  'slot': 'calendar-solid',
  'block': 'database-solid',
  'genesis-block': 'database-solid',
  'native-token': 'coins-solid',
  'stablecoin': 'coins-solid',
  'lovelace': 'coins-solid',
  'nft': 'certificate-solid',
  'project-catalyst': 'people-group-solid',
  'treasury': 'coins-solid',
  'pos-attacks': 'shield-solid',
};

// "Learning paths" surfaced on the index. These are not internal paths through
// the glossary, just curated entry points into existing site sections. Each
// path defines a header icon plus a sequence of step icons (rendered as a
// connected row, first step filled and the rest outlined) and an audience
// label, mirroring the journey-card pattern in the cardano.org mockup.
export const LEARNING_PATHS = [
  {
    id: 'new-to-cardano',
    title: 'New to Cardano?',
    description: 'Start here if you are new to the ecosystem.',
    href: '/get-started',
    icon: 'shapes-solid',
    color: '#0033ad',
    audience: 'Beginner',
    steps: [
      { icon: 'wallet-solid' },
      { icon: 'coins-solid' },
      { icon: 'handshake-solid' },
      { icon: 'shapes-solid' },
      { icon: 'scroll-solid' },
    ],
  },
  {
    id: 'governance',
    title: 'Governance 101',
    description: 'Understand how governance on Cardano works.',
    href: '/governance',
    icon: 'users-solid',
    color: '#a16207',
    audience: 'Beginner',
    steps: [
      { icon: 'users-solid' },
      { icon: 'scroll-solid' },
      { icon: 'building-solid' },
      { icon: 'certificate-solid' },
    ],
  },
  {
    id: 'explore-apps',
    title: 'Explore Cardano Apps',
    description: 'Discover curated wallets, DEXs, governance tools, and more.',
    href: '/apps',
    icon: 'shapes-solid',
    color: '#3b7982',
    audience: 'Curated picks',
    steps: [
      { icon: 'wallet-solid' },
      { icon: 'coins-solid' },
      { icon: 'scroll-solid' },
      { icon: 'shapes-solid' },
      { icon: 'link-solid' },
      { icon: 'wrench-solid' },
    ],
  },
];
