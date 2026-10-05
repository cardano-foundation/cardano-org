import { translate } from '@docusaurus/Translate';

/**
 * Translated names for the era and directory groups. Shared by the legend and
 * the pin card so both call the same group the same way.
 */
const LABELS = {
  byron: translate({ id: 'medusa.legend.byron', message: 'Byron' }),
  shelley: translate({ id: 'medusa.legend.shelley', message: 'Shelley' }),
  allegra: translate({ id: 'medusa.legend.allegra', message: 'Allegra' }),
  mary: translate({ id: 'medusa.legend.mary', message: 'Mary' }),
  alonzo: translate({ id: 'medusa.legend.alonzo', message: 'Alonzo' }),
  babbage: translate({ id: 'medusa.legend.babbage', message: 'Babbage' }),
  conway: translate({ id: 'medusa.legend.conway', message: 'Conway' }),
  dijkstra: translate({ id: 'medusa.legend.dijkstra', message: 'Dijkstra' }),
  libs: translate({ id: 'medusa.legend.libs', message: 'Shared libraries' }),
  docs: translate({ id: 'medusa.legend.docs', message: 'Documentation' }),
  other: translate({ id: 'medusa.legend.other', message: 'Everything else' }),
};

export function groupLabel(key) {
  return LABELS[key] ?? key;
}
