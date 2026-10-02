import React from 'react';
import clsx from 'clsx';
import { groupColor } from './groups.js';
import styles from './explorer.module.css';

// Hard forks carry the color of the era they start, repository events have no
// era and are drawn as a hollow ring instead.
export default function MilestoneDot({ milestone, className }) {
  if (milestone.kind !== 'hardfork') return <span className={clsx(styles.legendDot, styles.ringDot, className)} />;
  const color = groupColor(milestone.group);
  // currentColor drives the dot glow, so the era color is set as the text color too.
  return <span className={clsx(styles.legendDot, className)} style={{ background: color, color }} />;
}
