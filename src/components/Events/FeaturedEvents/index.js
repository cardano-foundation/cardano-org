import React from 'react';
import FeaturedEventCard from '@site/src/components/Events/FeaturedEventCard';
import styles from './styles.module.css';

// Grid of highlighted (curated) events shown above the full list.
export default function FeaturedEvents({ events, labels }) {
  if (!events.length) return null;
  return (
    <ul className={styles.grid}>
      {events.map((event) => (
        <FeaturedEventCard
          key={`${event.title}-${event.startDate}`}
          event={event}
          labels={labels}
        />
      ))}
    </ul>
  );
}
