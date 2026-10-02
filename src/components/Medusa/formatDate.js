/**
 * Date formatting for the medusa timeline. Frames carry a month (YYYY-MM),
 * milestones a full day (YYYY-MM-DD). Both are read as UTC so the label never
 * shifts by a day in a western time zone.
 */

const parts = (date) => date.split('-').map(Number);

// The timeline labels are formatted on every animation frame, and building a
// formatter costs far more than using one.
const formatters = new Map();
function formatter(locale, withDay) {
  const key = `${locale}|${withDay}`;
  if (!formatters.has(key)) {
    const options = { month: 'long', year: 'numeric', timeZone: 'UTC' };
    if (withDay) options.day = 'numeric';
    formatters.set(key, new Intl.DateTimeFormat(locale, options));
  }
  return formatters.get(key);
}

export function formatMonth(date, locale) {
  const [y, m] = parts(date);
  return formatter(locale, false).format(new Date(Date.UTC(y, m - 1, 1)));
}

export function formatDay(date, locale) {
  const [y, m, d] = parts(date);
  return formatter(locale, true).format(new Date(Date.UTC(y, m - 1, d)));
}
