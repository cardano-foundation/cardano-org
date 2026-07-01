import React from 'react';
import useEventImage from '@site/src/components/Events/useEventImage';
import formatDateRange from '@site/src/components/Events/formatDateRange';
import styles from './styles.module.css';

export default function EventCard({ event, registerLabel, onlineLabel }) {
  const { src: imgSrc, fallback: fallbackLogo } = useEventImage(event.image);
  const dateLabel = formatDateRange(event.startDate, event.endDate);
  const place = event.online ? onlineLabel : event.location?.label;

  return (
    <li className={styles.card}>
      <div className={styles.media}>
        {imgSrc ? (
          <img src={imgSrc} alt={event.title} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <img src={fallbackLogo} alt="" className={styles.placeholderLogo} />
          </div>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          {dateLabel && <span className={styles.date}>{dateLabel}</span>}
          {place && <span className={styles.place}>{place}</span>}
        </div>
        <h3 className={styles.title}>{event.title}</h3>
        {event.organizer && (
          <p className={styles.organizer}>{event.organizer}</p>
        )}
        {event.description && (
          <p className={styles.description}>{event.description}</p>
        )}
        {Array.isArray(event.tags) && event.tags.length > 0 && (
          <ul className={styles.tags}>
            {event.tags.slice(0, 4).map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}
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
      </div>
    </li>
  );
}
