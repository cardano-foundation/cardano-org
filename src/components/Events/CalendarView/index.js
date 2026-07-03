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

function toDayKey(dateStr) {
  return String(dateStr).slice(0, 10);
}

function isMultiDay(event) {
  return Boolean(
    event.startDate &&
      event.endDate &&
      toDayKey(event.startDate) !== toDayKey(event.endDate),
  );
}

// Places a week's multi-day events into non-overlapping horizontal lanes, each
// bar spanning the columns (0..6) it covers within the week.
function layoutWeekBars(weekDays, multiDayEvents) {
  const startKey = dayKey(weekDays[0]);
  const endKey = dayKey(weekDays[6]);
  const keys = weekDays.map(dayKey);
  const bars = [];
  for (const event of multiDayEvents) {
    const s = toDayKey(event.startDate);
    const e = toDayKey(event.endDate);
    if (e < startKey || s > endKey) continue; // no overlap this week
    let colStart = s < startKey ? 0 : keys.indexOf(s);
    let colEnd = e > endKey ? 6 : keys.indexOf(e);
    if (colStart < 0) colStart = 0;
    if (colEnd < 0) colEnd = 6;
    bars.push({ event, colStart, colEnd, startsHere: s >= startKey });
  }
  bars.sort((a, b) => a.colStart - b.colStart || b.colEnd - a.colEnd);
  const laneEnds = [];
  for (const bar of bars) {
    let lane = 0;
    while (lane < laneEnds.length && laneEnds[lane] >= bar.colStart) lane += 1;
    laneEnds[lane] = bar.colEnd;
    bar.lane = lane;
  }
  return { bars, laneCount: laneEnds.length };
}

function chunkWeeks(days) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
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

  // Single-day events sit in day cells; multi-day events render as spanning bars.
  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const event of events) {
      if (!event.startDate || isMultiDay(event)) continue;
      const key = toDayKey(event.startDate);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(event);
    }
    return map;
  }, [events]);

  const multiDayEvents = useMemo(() => events.filter(isMultiDay), [events]);

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
          {chunkWeeks(grid).map((weekDays) => {
            const { bars, laneCount } = layoutWeekBars(weekDays, multiDayEvents);
            return (
              <div
                key={dayKey(weekDays[0])}
                className={styles.week}
                style={{ '--lanes': laneCount }}
              >
                <div className={styles.days}>
                  {weekDays.map((date) => {
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
                {bars.length > 0 && (
                  <div className={styles.bars}>
                    {bars.map((bar) => (
                      <a
                        key={`${bar.event.title}-${bar.event.startDate}`}
                        className={styles.bar}
                        href={bar.event.url || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={bar.event.title}
                        style={{
                          gridColumn: `${bar.colStart + 1} / ${bar.colEnd + 2}`,
                          gridRow: bar.lane + 1,
                          background: categoryColor(bar.event.category),
                        }}
                      >
                        {bar.startsHere ? bar.event.title : `… ${bar.event.title}`}
                      </a>
                    ))}
                  </div>
                )}
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
