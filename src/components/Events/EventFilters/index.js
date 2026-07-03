import React from 'react';
import { categoryLabel } from '@site/src/utils/events/categories';
import styles from './styles.module.css';

// Controlled filter bar. `value` is { place, time, query, category }; `onChange`
// receives the next value. `labels` carries pre-translated strings from the
// page. `topics` is the list of category keys to offer (empty hides the row).
export default function EventFilters({ value, onChange, labels, topics = [], hideTime = false }) {
  const set = (patch) => onChange({ ...value, ...patch });

  const placeOptions = [
    { key: 'all', label: labels.placeAll },
    { key: 'inperson', label: labels.placeInPerson },
    { key: 'online', label: labels.placeOnline },
  ];
  const timeOptions = [
    { key: 'upcoming', label: labels.timeUpcoming },
    { key: 'past', label: labels.timePast },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <input
          type="search"
          className={styles.search}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchPlaceholder}
          value={value.query}
          onChange={(e) => set({ query: e.target.value })}
        />
        {!hideTime && (
          <div className={styles.group} role="group" aria-label={labels.timeGroup}>
            {timeOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`${styles.chip} ${value.time === opt.key ? styles.active : ''}`}
                aria-pressed={value.time === opt.key}
                onClick={() => set({ time: opt.key })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        <div className={styles.group} role="group" aria-label={labels.placeGroup}>
          {placeOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`${styles.chip} ${value.place === opt.key ? styles.active : ''}`}
              aria-pressed={value.place === opt.key}
              onClick={() => set({ place: opt.key })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {topics.length > 0 && (
        <div className={styles.tagRow} role="group" aria-label={labels.topicGroup}>
          <button
            type="button"
            className={`${styles.chip} ${!value.category ? styles.active : ''}`}
            aria-pressed={!value.category}
            onClick={() => set({ category: null })}
          >
            {labels.allTopics}
          </button>
          {topics.map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.chip} ${value.category === category ? styles.active : ''}`}
              aria-pressed={value.category === category}
              onClick={() => set({ category: value.category === category ? null : category })}
            >
              {categoryLabel(category)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
