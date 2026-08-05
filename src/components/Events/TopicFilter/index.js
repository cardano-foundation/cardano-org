import React from 'react';
import { translate } from '@docusaurus/Translate';
import { categoryLabel } from '@site/src/utils/events/categories';
import styles from './styles.module.css';

// Category topic chips: "All Topics" plus each present category.
export default function TopicFilter({ value, onChange, topics = [] }) {
  if (!topics.length) return null;
  const select = (category) => onChange({ ...value, category });

  return (
    <div
      className={styles.row}
      role="group"
      aria-label={translate({ id: 'events.filter.topicGroup', message: 'Topics' })}
    >
      <button
        type="button"
        className={`${styles.chip} ${!value.category ? styles.active : ''}`}
        aria-pressed={!value.category}
        onClick={() => select(null)}
      >
        {translate({ id: 'events.filter.allTopics', message: 'All Topics' })}
      </button>
      {topics.map((category) => (
        <button
          key={category}
          type="button"
          className={`${styles.chip} ${value.category === category ? styles.active : ''}`}
          aria-pressed={value.category === category}
          onClick={() => select(value.category === category ? null : category)}
        >
          {categoryLabel(category)}
        </button>
      ))}
    </div>
  );
}
