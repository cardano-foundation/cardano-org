import React from 'react';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

// Search + time + place controls rendered inside the blue hero banner.
// `value` is the shared filter state { place, time, query, category }.
export default function EventHeroControls({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });

  const timeOptions = [
    { key: 'upcoming', label: translate({ id: 'events.filter.timeUpcoming', message: 'Upcoming' }) },
    { key: 'past', label: translate({ id: 'events.filter.timePast', message: 'Past' }) },
    { key: 'all', label: translate({ id: 'events.filter.timeAll', message: 'All' }) },
  ];
  // Place pills toggle on/off; clearing returns to "all".
  const placeOptions = [
    { key: 'inperson', label: translate({ id: 'events.filter.placeInPerson', message: 'In person' }) },
    { key: 'online', label: translate({ id: 'events.filter.placeOnline', message: 'Online' }) },
  ];

  return (
    <div className={styles.controls}>
      <input
        type="search"
        className={styles.search}
        placeholder={translate({
          id: 'events.filter.searchPlaceholder',
          message: 'Search events, locations, or topics',
        })}
        aria-label={translate({
          id: 'events.filter.searchPlaceholder',
          message: 'Search events, locations, or topics',
        })}
        value={value.query}
        onChange={(e) => set({ query: e.target.value })}
      />
      <div className={styles.pills}>
        {timeOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`${styles.pill} ${value.time === opt.key ? styles.active : ''}`}
            aria-pressed={value.time === opt.key}
            onClick={() => set({ time: opt.key })}
          >
            {opt.label}
          </button>
        ))}
        <span className={styles.divider} aria-hidden />
        {placeOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`${styles.pill} ${value.place === opt.key ? styles.active : ''}`}
            aria-pressed={value.place === opt.key}
            onClick={() => set({ place: value.place === opt.key ? 'all' : opt.key })}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
