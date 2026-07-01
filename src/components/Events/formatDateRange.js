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
