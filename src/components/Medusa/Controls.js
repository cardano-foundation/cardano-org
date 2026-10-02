import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { SPEEDS } from './playback.js';
import { milestoneText } from './milestoneText.js';
import { formatMonth } from './formatDate.js';
import { MilestoneDot } from './MilestoneCard.js';
import styles from './explorer.module.css';

// Markers this close to either end get a tooltip that opens inward, a centred
// one would run out of the controls bar.
const EDGE = 0.12;

export default function Controls({ frameDates, markers, chapterKey, index, paused, speed, onSeek, onToggle, onStep, onSpeed, onMilestone, onFullscreen }) {
  const { i18n } = useDocusaurusContext();
  const last = Math.max(0, frameDates.length - 1);
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
        <div className={styles.markers}>
          {markers.map((m) => {
            const pos = last ? m.frame / last : 0;
            const name = milestoneText(m.key).name;
            const month = formatMonth(m.date, i18n.currentLocale);
            return (
              <button
                key={m.key}
                type="button"
                className={clsx(
                  styles.marker,
                  m.frame > index && styles.markerAhead,
                  m.key === chapterKey && styles.markerCurrent,
                  pos < EDGE && styles.markerStart,
                  pos > 1 - EDGE && styles.markerEnd,
                )}
                style={{ left: `${pos * 100}%` }}
                aria-label={`${name}, ${month}`}
                onClick={() => onMilestone(m)}
              >
                <MilestoneDot milestone={m} />
                <span className={styles.markerTip} aria-hidden="true">
                  <strong>{name}</strong> {month}
                </span>
              </button>
            );
          })}
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
