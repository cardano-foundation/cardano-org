/**
 * Shared ecosystem group definitions.
 * Used by /apps filter UI and (future) ecosystem map.
 */
export const EcosystemGroups = [
  {
    key: 'defi',
    label: 'DeFi',
    color: '#3D5AFE',
    tags: ['dex', 'dexAggregator', 'lending', 'yield', 'stablecoin', 'synthetics', 'perpetuals', 'prediction'],
  },
  {
    key: 'consumer',
    label: 'Consumer',
    color: '#008080',
    tags: ['marketplace', 'minting', 'gaming', 'music', 'nft'],
  },
  {
    key: 'infrastructure',
    label: 'Infrastructure',
    color: '#1E88E5',
    tags: ['wallet', 'bridge', 'oracle', 'identity', 'privacy'],
  },
  {
    key: 'tools',
    label: 'Tools',
    color: '#7BC8A6',
    tags: ['analytics', 'accounting', 'explorer', 'payments', 'notary'],
  },
  {
    key: 'governance',
    label: 'Governance & Community',
    color: '#673AB7',
    tags: ['governance', 'dao', 'social', 'educational', 'funding'],
  },
];

