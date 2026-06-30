import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

function formatDateRange(startDate, endDate) {
  if (!startDate) return '';
  const opts = { timeZone: 'UTC', month: 'short', day: 'numeric' };
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return '';
  const startStr = start.toLocaleDateString('en-US', opts);
  if (!endDate) return startStr;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime()) || start.toDateString() === end.toDateString()) {
    return startStr;
  }
  const sameMonth =
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCFullYear() === end.getUTCFullYear();
  const endStr = sameMonth
    ? String(end.getUTCDate())
    : end.toLocaleDateString('en-US', opts);
  return `${startStr} to ${endStr}`;
}

export default function EventCard({ event, registerLabel, onlineLabel }) {
  const isExternalImg = Boolean(event.image) && /^https?:\/\//.test(event.image);
  // useBaseUrl must run unconditionally; pass a harmless path when there is no
  // local image. The result is only used for curated (non-http) images.
  const localImg = useBaseUrl(
    event.image && !isExternalImg ? `/img/events/${event.image}` : '/',
  );
  const imgSrc = event.image ? (isExternalImg ? event.image : localImg) : null;
  const dateLabel = formatDateRange(event.startDate, event.endDate);
  const place = event.online ? onlineLabel : event.location.label;

  return (
    <li className={styles.card}>
      {imgSrc && (
        <div className={styles.media}>
          <img src={imgSrc} alt={event.title} loading="lazy" />
        </div>
      )}
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
