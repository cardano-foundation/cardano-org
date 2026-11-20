/**
 * Milestones shown on the medusa timeline. Hard fork dates follow
 * src/data/hardforks.js. Display texts live in
 * src/components/Medusa/milestoneText.js so this file stays importable in Node.
 */
export const MILESTONES = [
  { key: 'repoStart', date: '2018-09-24', group: 'other', kind: 'repo', link: 'https://github.com/IntersectMBO/cardano-ledger' },
  { key: 'shelley', date: '2020-07-29', group: 'shelley', kind: 'hardfork', link: '/roadmap#protocol-version-2' },
  { key: 'allegra', date: '2020-12-16', group: 'allegra', kind: 'hardfork', link: '/roadmap#protocol-version-3' },
  { key: 'mary', date: '2021-03-01', group: 'mary', kind: 'hardfork', link: '/roadmap#protocol-version-4' },
  { key: 'alonzo', date: '2021-09-12', group: 'alonzo', kind: 'hardfork', link: '/roadmap#protocol-version-5' },
  { key: 'restructure', date: '2021-10-01', group: 'libs', kind: 'repo', link: 'https://github.com/IntersectMBO/cardano-ledger' },
  { key: 'vasil', date: '2022-09-22', group: 'babbage', kind: 'hardfork', link: '/roadmap#protocol-version-7' },
  { key: 'chang', date: '2024-09-01', group: 'conway', kind: 'hardfork', link: '/roadmap#protocol-version-9' },
  { key: 'plomin', date: '2025-01-29', group: 'conway', kind: 'hardfork', link: '/roadmap#protocol-version-10' },
  { key: 'vanRossem', date: '2026-07-18', group: 'conway', kind: 'hardfork', link: '/roadmap#protocol-version-11' },
];

export const HARD_FORK_KEYS = MILESTONES.filter((m) => m.kind === 'hardfork').map((m) => m.key);
