import React from 'react';
import useEventImage from '@site/src/components/Events/useEventImage';
import { formatDateParts } from '@site/src/components/Events/formatDateRange';
import { categoryColor, categoryLabel } from '@site/src/utils/events/categories';
import styles from './styles.module.css';

// Compact list row: thumbnail, date, title + organizer, category, location and
// a register link. No long description, to keep rows uniform.
export default function EventCard({ event, registerLabel, onlineLabel }) {
  const { src: imgSrc, fallback: fallbackLogo } = useEventImage(event.image);
  const date = formatDateParts(event.startDate, event.endDate);
  const place = event.online ? onlineLabel : event.location?.label;

  return (
    <li className={styles.row}>
      <div className={styles.thumb}>
        {imgSrc ? (
          <img src={imgSrc} alt={event.title} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <img src={fallbackLogo} alt="" className={styles.placeholderLogo} />
          </div>
        )}
      </div>

      {date && (
        <span className={styles.date}>
          <span className={styles.dateMonth}>{date.month}</span>
          <span className={styles.dateDay}>{date.day}</span>
        </span>
      )}

      <div className={styles.main}>
        <h3 className={styles.title}>{event.title}</h3>
        {event.organizer && <p className={styles.org}>{event.organizer}</p>}
      </div>

      {event.category && (
        <span className={styles.tag}>
          <span className={styles.dot} style={{ background: categoryColor(event.category) }} />
          {categoryLabel(event.category)}
        </span>
      )}

      {place && <span className={styles.place}>{place}</span>}

      {event.url && (
        <a
          className={styles.cta}
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {registerLabel}
        </a>
      )}
    </li>
  );
}
