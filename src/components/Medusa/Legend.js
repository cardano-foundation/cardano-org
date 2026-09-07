import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import { GROUPS } from './groups.js';
import { groupLabel } from './groupLabels.js';
import styles from './explorer.module.css';

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
          {groupLabel(g.key)}
        </button>
      ))}
    </aside>
  );
}
