import React from 'react';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { MILESTONES } from '@site/src/data/medusa/milestones.js';
import { frameIndexForDate, SPEEDS } from './playback.js';
import { milestoneText } from './milestoneText.js';
import styles from './explorer.module.css';

function formatMonth(date, locale) {
  const [y, m] = date.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, 1)));
}

export default function Controls({ frameDates, index, paused, speed, onSeek, onToggle, onStep, onSpeed, onFullscreen }) {
  const { i18n } = useDocusaurusContext();
  const last = Math.max(0, frameDates.length - 1);
  const markers = MILESTONES.map((m) => ({ ...m, frame: frameIndexForDate(frameDates, m.date) })).filter((m) => m.frame >= 0);
  const monthLabel = frameDates[index] ? formatMonth(frameDates[index], i18n.currentLocale) : '';
  return (
    <div className={styles.controls}>
      <button type="button" className={styles.controlButton} onClick={onToggle} aria-label={paused ? translate({ id: 'medusa.controls.play', message: 'Play' }) : translate({ id: 'medusa.controls.pause', message: 'Pause' })}>
        {paused ? '▶' : '❚❚'}
      </button>
      <button type="button" className={styles.controlButton} onClick={() => onStep(-1)} aria-label={translate({ id: 'medusa.controls.back', message: 'One month back' })}>‹</button>
      <button type="button" className={styles.controlButton} onClick={() => onStep(1)} aria-label={translate({ id: 'medusa.controls.forward', message: 'One month forward' })}>›</button>
      <div className={styles.timeline}>
        <input
          type="range"
          min={0}
          max={last}
          value={index}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label={translate({ id: 'medusa.controls.timeline', message: 'Timeline' })}
          aria-valuetext={monthLabel}
        />
        <div className={styles.markers} aria-hidden="true">
          {markers.map((m) => (
            <span key={m.key} className={styles.marker} style={{ left: `${(m.frame / last) * 100}%` }} title={milestoneText(m.key).name} />
          ))}
        </div>
      </div>
      <span className={styles.date}>{monthLabel}</span>
      <div className={styles.speeds} role="group" aria-label={translate({ id: 'medusa.controls.speed', message: 'Speed' })}>
        {SPEEDS.map((s) => (
          <button key={s} type="button" className={styles.controlButton} aria-pressed={speed === s} onClick={() => onSpeed(s)}>{s}x</button>
        ))}
      </div>
      <button type="button" className={styles.controlButton} onClick={onFullscreen} aria-label={translate({ id: 'medusa.controls.fullscreen', message: 'Fullscreen' })}>⛶</button>
    </div>
  );
}
