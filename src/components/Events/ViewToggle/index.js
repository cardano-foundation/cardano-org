import React from 'react';
import styles from './styles.module.css';

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M4 6h2v2H4V6m0 5h2v2H4v-2m0 5h2v2H4v-2m4-10h12v2H8V6m0 5h12v2H8v-2m0 5h12v2H8v-2Z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7M5 9h14v10H5V9Z"
      />
    </svg>
  );
}

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
        <ListIcon />
        {listLabel}
      </button>
      <button
        type="button"
        className={`${styles.btn} ${value === 'calendar' ? styles.active : ''}`}
        aria-pressed={value === 'calendar'}
        onClick={() => onChange('calendar')}
      >
        <CalendarIcon />
        {calendarLabel}
      </button>
    </div>
  );
}
