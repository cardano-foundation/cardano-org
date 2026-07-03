import React from 'react';
import styles from './styles.module.css';

// Small List / Calendar switch.
export default function ViewToggle({ value, onChange, listLabel, calendarLabel }) {
  return (
    <div className={styles.toggle} role="group" aria-label="View">
      <button
        type="button"
        className={`${styles.btn} ${value === 'list' ? styles.active : ''}`}
        aria-pressed={value === 'list'}
        onClick={() => onChange('list')}
      >
        {listLabel}
      </button>
      <button
        type="button"
        className={`${styles.btn} ${value === 'calendar' ? styles.active : ''}`}
        aria-pressed={value === 'calendar'}
        onClick={() => onChange('calendar')}
      >
        {calendarLabel}
      </button>
    </div>
  );
}
