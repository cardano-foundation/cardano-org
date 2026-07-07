// Formats an event's start/end into a short UTC range like "Sep 1", "Sep 1 to 2"
// or "Sep 30 to Oct 2". UTC throughout so server and client render the same.
export default function formatDateRange(startDate, endDate) {
  if (!startDate) return '';
  const opts = { timeZone: 'UTC', month: 'short', day: 'numeric' };
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return '';
  const startStr = start.toLocaleDateString('en-US', opts);
  if (!endDate) return startStr;
  const end = new Date(endDate);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();
  const sameDay = sameMonth && start.getUTCDate() === end.getUTCDate();
  if (Number.isNaN(end.getTime()) || sameDay) {
    return startStr;
  }
  const endStr = sameMonth
    ? String(end.getUTCDate())
    : end.toLocaleDateString('en-US', opts);
  return `${startStr} to ${endStr}`;
}

// Structured variant for the stacked date badge in the list: an uppercase month
// on top, the day (or day range) below, e.g. { month: 'JUN', day: '23-25' }.
// A cross-month range carries the second month in the day line ("30 - JUL 2").
// UTC throughout, matching formatDateRange.
export function formatDateParts(startDate, endDate) {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return null;
  const monthOf = (d) =>
    d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' }).toUpperCase();
  const month = monthOf(start);
  const startDay = start.getUTCDate();
  const single = { month, day: String(startDay) };
  if (!endDate) return single;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return single;
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();
  const endDay = end.getUTCDate();
  if (sameMonth && startDay === endDay) return single;
  if (sameMonth) return { month, day: `${startDay}-${endDay}` };
  return { month, day: `${startDay} - ${monthOf(end)} ${endDay}` };
}
