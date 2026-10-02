/**
 * Date formatting for the medusa timeline. Frames carry a month (YYYY-MM),
 * milestones a full day (YYYY-MM-DD). Both are read as UTC so the label never
 * shifts by a day in a western time zone.
 */

const parts = (date) => date.split('-').map(Number);

export function formatMonth(date, locale) {
  const [y, m] = parts(date);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, 1)));
}

export function formatDay(date, locale) {
  const [y, m, d] = parts(date);
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
}
