import React from 'react';
import styles from './styles.module.css';

export default function PullQuote({ text }) {
  return <p className={styles.quote}>{text}</p>;
}
