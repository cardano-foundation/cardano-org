const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_AGE_DAYS = 45;

// The forum topics come from a committed snapshot. Past this age the page
// drops the list instead of presenting old posts as current.
export function isSnapshotFresh(fetchedAt, nowMs) {
  const fetched = Date.parse(fetchedAt);
  return Number.isFinite(fetched) && nowMs - fetched <= MAX_AGE_DAYS * DAY_MS;
}

// Totals are shown rounded down ("30,000+"), so the committed number stays
// true while the forum grows. Below 1000 there is nothing worth rounding.
export function floorToThousand(n) {
  return Number.isFinite(n) && n >= 1000 ? Math.floor(n / 1000) * 1000 : null;
}
