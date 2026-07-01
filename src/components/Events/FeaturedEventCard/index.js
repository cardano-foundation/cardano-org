import React, { useEffect, useState } from 'react';
import useEventImage from '@site/src/components/Events/useEventImage';
import formatDateRange from '@site/src/components/Events/formatDateRange';
import styles from './styles.module.css';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// One badge per card: an event within the next 7 days reads "This week",
// otherwise an online event reads "Online". Both are derived from real data.
function badgeFor(event, labels) {
  if (event.startDate) {
    const start = new Date(event.startDate).getTime();
    if (!Number.isNaN(start)) {
      const diff = start - Date.now();
      if (diff >= 0 && diff < WEEK_MS) return labels.thisWeek;
    }
  }
  return event.online ? labels.online : null;
}

export default function FeaturedEventCard({ event, labels }) {
  const { src, fallback } = useEventImage(event.image);
  const dateLabel = formatDateRange(event.startDate, event.endDate);
  const place = event.online ? labels.online : event.location?.label;
  // The "This week" badge depends on the current time, so compute it only after
  // mount. The first client render matches the server (no badge) to avoid a
  // hydration mismatch.
  const [mounted, setMounted] = useState(false);
  // One-shot flip after mount to reveal the time-based badge; not a render loop.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const badge = mounted ? badgeFor(event, labels) : null;

  return (
    <li className={styles.card}>
      <div className={styles.media}>
        {badge && <span className={styles.badge}>{badge}</span>}
        {src ? (
          <img src={src} alt={event.title} loading="lazy" className={styles.img} />
        ) : (
          <div className={styles.placeholder}>
            <img src={fallback} alt="" className={styles.placeholderLogo} />
          </div>
        )}
      </div>
      <div className={styles.body}>
        {dateLabel && <span className={styles.date}>{dateLabel}</span>}
        <h3 className={styles.title}>{event.title}</h3>
        {(place || event.organizer) && (
          <p className={styles.meta}>
            {[place, event.organizer].filter(Boolean).join(' · ')}
          </p>
        )}
        {event.url && (
          <a
            className={styles.cta}
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {labels.register}
          </a>
        )}
      </div>
    </li>
  );
}
