import React from 'react';
import { translate } from '@docusaurus/Translate';
import formatDateRange from '@site/src/components/Events/formatDateRange';
import styles from './styles.module.css';

function youtubeWatchUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}

function youtubeThumb(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// Past event with a recorded recap: YouTube thumbnail + play overlay, date and
// location, and a link to the recording.
export default function RecapCard({ event }) {
  const url = youtubeWatchUrl(event.recapVideo);
  const dateLabel = formatDateRange(event.startDate, event.endDate);
  const meta = [dateLabel, event.location?.label].filter(Boolean).join(' · ');

  return (
    <article className={styles.card}>
      <a className={styles.media} href={url} target="_blank" rel="noopener noreferrer">
        <img src={youtubeThumb(event.recapVideo)} alt={event.title} loading="lazy" />
        <span className={styles.play} aria-hidden>
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path fill="currentColor" d="M8 5v14l11-7z" />
          </svg>
        </span>
      </a>
      <div className={styles.body}>
        {meta && <span className={styles.meta}>{meta}</span>}
        <h3 className={styles.title}>{event.title}</h3>
        <a className={styles.watch} href={url} target="_blank" rel="noopener noreferrer">
          {translate({ id: 'events.recaps.watch', message: 'Watch recap' })}
        </a>
      </div>
    </article>
  );
}
