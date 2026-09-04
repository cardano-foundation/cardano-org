import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import { GROUPS } from './groups.js';
import styles from './explorer.module.css';

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

export default function Legend({ present, active, onToggle }) {
  return (
    <aside className={styles.legend} aria-label={translate({ id: 'medusa.legend.title', message: 'Eras' })}>
      {GROUPS.filter((g) => present.has(g.key)).map((g) => (
        <button
          key={g.key}
          type="button"
          className={clsx(styles.legendItem, active === g.key && styles.legendItemActive)}
          aria-pressed={active === g.key}
          onClick={() => onToggle(g.key)}
        >
          <span className={styles.legendDot} style={{ background: g.color }} />
          {LABELS[g.key]}
        </button>
      ))}
    </aside>
  );
}
