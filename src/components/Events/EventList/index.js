import React from 'react';
import styles from './styles.module.css';

// Renders a list of events using the provided renderCard function, or an empty
// message when there are none. Pagination stays in the page so this component
// has a single responsibility.
export default function EventList({ events, emptyLabel, renderCard }) {
  if (!events.length) {
    return <p>{emptyLabel}</p>;
  }
  return <ul className={styles.list}>{events.map(renderCard)}</ul>;
}
