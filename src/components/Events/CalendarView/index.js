import React, { useMemo, useState } from 'react';
import { translate } from '@docusaurus/Translate';
import {
  EVENT_CATEGORIES,
  categoryColor,
  categoryLabel,
} from '@site/src/utils/events/categories';
import styles from './styles.module.css';

const DAY_MS = 24 * 60 * 60 * 1000;

// YYYY-MM-DD in UTC, matching how event startDate strings are keyed elsewhere.
function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function startOfTodayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// 42-day (6 week) grid starting on the Monday on or before the 1st.
function buildGrid(year, month) {
  const first = new Date(Date.UTC(year, month, 1));
  const mondayOffset = (first.getUTCDay() + 6) % 7; // 0 = Monday
  const start = new Date(first.getTime() - mondayOffset * DAY_MS);
  return Array.from({ length: 42 }, (_, i) => new Date(start.getTime() + i * DAY_MS));
}

function weekdayLabels() {
  // Locale-aware short weekday names, Monday first. 2024-01-01 is a Monday.
  const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone: 'UTC' });
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(Date.UTC(2024, 0, 1 + i))),
  );
}

function monthLabel(year, month) {
  return new Date(Date.UTC(year, month, 1)).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function dayNumber(date) {
  return date.toLocaleDateString(undefined, { day: 'numeric', timeZone: 'UTC' });
}

function sidebarDate(startDate) {
  return new Date(startDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function CalendarEntry({ event }) {
  return (
    <a
      className={styles.entry}
      href={event.url || undefined}
      target="_blank"
      rel="noopener noreferrer"
      title={event.title}
    >
      <span className={styles.dot} style={{ background: categoryColor(event.category) }} />
      <span className={styles.entryText}>
        <span className={styles.entryTitle}>{event.title}</span>
        {(event.online || event.location?.label) && (
          <span className={styles.entrySub}>
            {event.online
              ? translate({ id: 'events.card.online', message: 'Online' })
              : event.location.label}
          </span>
        )}
      </span>
    </a>
  );
}

export default function CalendarView({ events }) {
  const today = startOfTodayUtc();
  const [cursor, setCursor] = useState({ year: today.getUTCFullYear(), month: today.getUTCMonth() });

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const event of events) {
      if (!event.startDate) continue;
      const key = String(event.startDate).slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(event);
    }
    return map;
  }, [events]);

  const upcoming = useMemo(() => {
    const todayTs = today.getTime();
    return events
      .filter((e) => e.startDate && new Date(e.startDate).getTime() >= todayTs)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 6);
  }, [events, today]);

  const usedCategories = useMemo(() => {
    const set = new Set(events.map((e) => e.category).filter(Boolean));
    return Object.keys(EVENT_CATEGORIES).filter((c) => set.has(c));
  }, [events]);

  const grid = buildGrid(cursor.year, cursor.month);
  const weekdays = weekdayLabels();
  const todayKey = dayKey(today);
  const MAX_PER_DAY = 3;

  const shiftMonth = (delta) => {
    setCursor((c) => {
      const d = new Date(Date.UTC(c.year, c.month + delta, 1));
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
    });
  };
  const goToday = () => setCursor({ year: today.getUTCFullYear(), month: today.getUTCMonth() });

  return (
    <div className={styles.layout}>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => shiftMonth(-1)}
              aria-label={translate({ id: 'events.carousel.prev', message: 'Previous' })}
            >
              ‹
            </button>
            <span className={styles.monthLabel}>{monthLabel(cursor.year, cursor.month)}</span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => shiftMonth(1)}
              aria-label={translate({ id: 'events.carousel.next', message: 'Next' })}
            >
              ›
            </button>
          </div>
          <button type="button" className={styles.todayBtn} onClick={goToday}>
            {translate({ id: 'events.calendar.today', message: 'Today' })}
          </button>
        </div>

        <div className={styles.weekdays}>
          {weekdays.map((w) => (
            <div key={w} className={styles.weekday}>
              {w}
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {grid.map((date) => {
            const key = dayKey(date);
            const inMonth = date.getUTCMonth() === cursor.month;
            const dayEvents = eventsByDay.get(key) || [];
            return (
              <div
                key={key}
                className={`${styles.cell} ${inMonth ? '' : styles.outside} ${
                  key === todayKey ? styles.today : ''
                }`}
              >
                <span className={styles.dayNum}>{dayNumber(date)}</span>
                <div className={styles.entries}>
                  {dayEvents.slice(0, MAX_PER_DAY).map((event) => (
                    <CalendarEntry key={`${event.title}-${event.source}`} event={event} />
                  ))}
                  {dayEvents.length > MAX_PER_DAY && (
                    <span className={styles.more}>+{dayEvents.length - MAX_PER_DAY}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {usedCategories.length > 0 && (
          <div className={styles.legend}>
            {usedCategories.map((c) => (
              <span key={c} className={styles.legendItem}>
                <span className={styles.dot} style={{ background: categoryColor(c) }} />
                {categoryLabel(c)}
              </span>
            ))}
          </div>
        )}

        <p className={styles.tzNote}>
          {translate({
            id: 'events.calendar.tzNote',
            message:
              'Dates are shown in UTC and events may change. Check the event page for the latest details.',
          })}
        </p>
      </div>

      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>
          {translate({ id: 'events.calendar.upcoming', message: 'Upcoming events' })}
        </h3>
        <ul className={styles.sidebarList}>
          {upcoming.map((event) => (
            <li key={`${event.title}-${event.startDate}`} className={styles.sidebarItem}>
              <span className={styles.sidebarWhen} style={{ color: categoryColor(event.category) }}>
                {sidebarDate(event.startDate)}
              </span>
              <a
                className={styles.sidebarEvent}
                href={event.url || undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.title}
              </a>
              <span className={styles.sidebarPlace}>
                {event.online
                  ? translate({ id: 'events.card.online', message: 'Online' })
                  : event.location?.label}
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
