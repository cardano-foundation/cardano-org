/**
 * Milestones shown on the medusa timeline. Hard fork dates follow
 * src/pages/hardforks.js. Display texts live in
 * src/components/Medusa/milestoneText.js so this file stays importable in Node.
 */
export const MILESTONES = [
  { key: 'repoStart', date: '2018-09-24', group: 'other', kind: 'repo', link: 'https://github.com/IntersectMBO/cardano-ledger' },
  { key: 'shelley', date: '2020-07-29', group: 'shelley', kind: 'hardfork', link: '/hardforks' },
  { key: 'allegra', date: '2020-12-16', group: 'allegra', kind: 'hardfork', link: '/hardforks' },
  { key: 'mary', date: '2021-03-01', group: 'mary', kind: 'hardfork', link: '/hardforks' },
  { key: 'alonzo', date: '2021-09-12', group: 'alonzo', kind: 'hardfork', link: '/hardforks' },
  { key: 'restructure', date: '2021-10-01', group: 'libs', kind: 'repo', link: 'https://github.com/IntersectMBO/cardano-ledger' },
  { key: 'vasil', date: '2022-09-22', group: 'babbage', kind: 'hardfork', link: '/hardforks' },
  { key: 'chang', date: '2024-09-01', group: 'conway', kind: 'hardfork', link: '/hardforks' },
  { key: 'plomin', date: '2025-01-29', group: 'conway', kind: 'hardfork', link: '/hardforks' },
  { key: 'vanRossem', date: '2026-07-18', group: 'conway', kind: 'hardfork', link: '/hardforks' },
];

export const HARD_FORK_KEYS = MILESTONES.filter((m) => m.kind === 'hardfork').map((m) => m.key);
