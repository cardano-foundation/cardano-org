import React, { useEffect, useState } from 'react';
import useEventImage from '@site/src/components/Events/useEventImage';
import formatDateRange from '@site/src/components/Events/formatDateRange';
import { eventBadge } from '@site/src/utils/events/eventModel';
import styles from './styles.module.css';

// One badge per card: a running event reads "Happening now", one within the
// next 7 days reads "This week", otherwise an online event reads "Online".
// All are derived from real data.
function badgeFor(event, labels) {
  const key = eventBadge(event, Date.now());
  return key ? labels[key] : null;
}

export default function FeaturedEventCard({ event, labels }) {
  const { src, fallback } = useEventImage(event.image);
  const dateLabel = formatDateRange(event.startDate, event.endDate);
  const place = event.online ? labels.online : event.location?.label;
  // The time-based badges depend on the current time, so compute them only after
  // mount. The first client render matches the server (no badge) to avoid a
  // hydration mismatch.
  const [mounted, setMounted] = useState(false);
  // One-shot flip after mount to reveal the time-based badge; not a render loop.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const badge = mounted ? badgeFor(event, labels) : null;

  return (
    <article className={styles.card}>
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
    </article>
  );
}
