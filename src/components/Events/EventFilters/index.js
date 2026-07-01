import React from 'react';
import styles from './styles.module.css';

// Controlled filter bar. `value` is { place, time, query, tag }; `onChange`
// receives the next value. `labels` carries pre-translated strings from the
// page. `tags` is the list of topic tags to offer (empty hides the tag row).
export default function EventFilters({ value, onChange, labels, tags = [] }) {
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

      {tags.length > 0 && (
        <div className={styles.tagRow} role="group" aria-label={labels.tagGroup}>
          <button
            type="button"
            className={`${styles.chip} ${!value.tag ? styles.active : ''}`}
            aria-pressed={!value.tag}
            onClick={() => set({ tag: null })}
          >
            {labels.tagAll}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`${styles.chip} ${value.tag === tag ? styles.active : ''}`}
              aria-pressed={value.tag === tag}
              onClick={() => set({ tag: value.tag === tag ? null : tag })}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
