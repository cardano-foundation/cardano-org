// Pure normalization and merge logic for the /events page. No React here so it
// can be unit tested with a plain node script.

import { categoryLabel, deriveCuratedCategory, deriveLumaCategory } from './categories.js';

// Titles that mark non-events pinned on the Luma calendar (e.g. a guidelines
// card). Matched case-insensitively. Real events legitimately run into future
// years (recurring working groups), so we key only on the title, not the date.
const PLACEHOLDER_TITLE_PATTERNS = [/event submission guidelines/i];

export function isPlaceholderEvent(evt) {
  if (!evt || !evt.title) return true;
  return PLACEHOLDER_TITLE_PATTERNS.some((re) => re.test(evt.title));
}

const LUMA_EVENT_BASE_URL = 'https://lu.ma/';

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}

// Luma event `url` is usually a short slug; some entries carry a full external
// link instead. Slugs are expanded to a lu.ma URL, full links pass through.
function lumaEventUrl(slug) {
  if (!slug) return null;
  return isHttpUrl(slug) ? slug : `${LUMA_EVENT_BASE_URL}${slug}`;
}

function lumaLocationLabel(geo, online) {
  if (online || !geo) return null;
  if (geo.city_state) return geo.city_state;
  const parts = [geo.city, geo.country].filter(Boolean);
  if (parts.length) return parts.join(', ');
  // Some entries stash a URL in `address`; a link is not a place, so skip it.
  if (geo.address && !isHttpUrl(geo.address)) return geo.address;
  return null;
}

// Maps one entry from the official Luma calendar API (calendars/events/list with
// access=view). Fields are flat on the entry. The API exposes no host name, so
// organizer is left null.
export function normalizeLumaEvent(raw) {
  if (!raw || !raw.name) return null;
  // Luma marks in person events as 'offline'; meet/discord/twitter are online.
  const online = raw.location_type !== 'offline';
  const geo = raw.geo_address_json || null;
  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((t) => t && t.name).filter(Boolean)
    : [];
  return {
    title: raw.name,
    description: raw.description || '',
    startDate: raw.start_at || null,
    endDate: raw.end_at || null,
    location: {
      city: (geo && geo.city) || null,
      country: (geo && geo.country) || null,
      label: lumaLocationLabel(geo, online),
    },
    online,
    url: lumaEventUrl(raw.url),
    image: raw.cover_url || null,
    organizer: null,
    tags,
    category: deriveLumaCategory(tags),
    source: 'luma',
    recapVideo: null,
  };
}

export function normalizeCuratedEvent(raw) {
  if (!raw || !raw.title) return null;
  return {
    title: raw.title,
    description: raw.description || '',
    startDate: raw.startDate || null,
    endDate: raw.endDate || null,
    location: {
      city: raw.location || null,
      country: null,
      label: raw.location || null,
    },
    online: Boolean(raw.online),
    url: raw.link || null,
    // Curated images are bare filenames under /img/events; the card resolves
    // them. Luma images are absolute URLs.
    image: raw.image || null,
    organizer: raw.organizer || null,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    category: raw.category || deriveCuratedCategory(raw.title),
    source: 'curated',
    recapVideo: raw.recapVideo || null,
  };
}

// Normalized title, shared by the day-level dedup and the recurring collapse.
function titleKey(evt) {
  return (evt.title || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function dedupKey(evt) {
  const day = evt.startDate ? String(evt.startDate).slice(0, 10) : '';
  return `${titleKey(evt)}|${day}`;
}

function startMs(evt) {
  return new Date(evt.startDate || 0).getTime();
}

export const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

// Start of the current UTC day, the reference point for upcoming versus past.
export function utcDayStartMs(nowMs = Date.now()) {
  const now = new Date(nowMs);
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function isDateOnly(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// Last moment an event still counts as running. A date-only value (curated
// entries) covers that whole UTC day, a timestamp (Luma) is exact. Events
// without an end fall back to their start, events without any date return 0.
function eventEndMs(evt) {
  const raw = evt.endDate || evt.startDate;
  if (!raw) return 0;
  const ms = new Date(raw).getTime();
  if (Number.isNaN(ms)) return 0;
  return isDateOnly(raw) ? ms + DAY_MS - 1 : ms;
}

// An event is upcoming until it is over, so a multi-day conference stays listed
// while it runs. `todayMs` is the start of the current UTC day, which also
// keeps a timed call visible for the rest of its day.
export function isUpcomingEvent(evt, todayMs) {
  return eventEndMs(evt) >= todayMs;
}

// Badge key for a highlighted card at the instant `nowMs`: 'live' while the
// event runs, 'thisWeek' when it starts within 7 days, else 'online' for
// online events, else null.
export function eventBadge(evt, nowMs) {
  // A missing or invalid start yields NaN, which fails both comparisons.
  const start = evt.startDate ? startMs(evt) : NaN;
  if (start <= nowMs && nowMs <= eventEndMs(evt)) return 'live';
  if (start > nowMs && start - nowMs < WEEK_MS) return 'thisWeek';
  return evt.online ? 'online' : null;
}

// Free-text search over everything a visitor can reasonably name: title, place,
// organizer, topic, tags and description. Every word of the query must occur.
export function matchesEventQuery(evt, query) {
  const terms = (query || '').toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const location = evt.location || {};
  const haystack = [
    evt.title,
    location.label,
    location.city,
    location.country,
    evt.organizer,
    evt.category && categoryLabel(evt.category),
    ...(evt.tags || []),
    evt.description,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function normalizeCuratedList(curatedRaw) {
  return (curatedRaw || []).map(normalizeCuratedEvent).filter(Boolean);
}

// Highlighted row: curated events that are running or still ahead, soonest
// first. Read from the curated data directly, because in the merged list a
// same-title Luma entry replaces the curated one.
export function selectFeatured(curatedRaw, todayMs, limit) {
  return normalizeCuratedList(curatedRaw)
    .filter((evt) => isUpcomingEvent(evt, todayMs))
    .sort((a, b) => startMs(a) - startMs(b))
    .slice(0, limit);
}

// Recap row: finished curated events with a recorded video, newest first.
export function selectRecaps(curatedRaw, todayMs) {
  return normalizeCuratedList(curatedRaw)
    .filter((evt) => evt.recapVideo && !isUpcomingEvent(evt, todayMs))
    .sort((a, b) => startMs(b) - startMs(a));
}

export function mergeEvents(curatedRaw, lumaRaw) {
  const curated = normalizeCuratedList(curatedRaw);
  const luma = (lumaRaw || []).map(normalizeLumaEvent).filter(Boolean);
  // Luma first so it wins ties on identical keys.
  const all = [...luma, ...curated].filter((e) => !isPlaceholderEvent(e));
  // Luma is first in `all`, so first-wins keeps the Luma entry on a collision.
  const byKey = new Map();
  for (const evt of all) {
    const key = dedupKey(evt);
    if (!byKey.has(key)) byKey.set(key, evt);
  }
  // `|| 0` keeps the comparator deterministic if a date is ever missing
  // (new Date(undefined) is NaN). Normalized events use null, already epoch
  // safe, but this hardens against any future caller.
  return [...byKey.values()].sort((a, b) => startMs(a) - startMs(b));
}

// List for one time view ('upcoming', 'past' or 'all'). The time filter runs
// before the recurring collapse, so a weekly call with a future date still
// shows in Past with its latest finished occurrence. Past reads newest first,
// the other views soonest first.
export function selectByTime(events, time, todayMs) {
  const inView = (events || []).filter((evt) => {
    if (time === 'upcoming') return isUpcomingEvent(evt, todayMs);
    if (time === 'past') return !isUpcomingEvent(evt, todayMs);
    return true;
  });
  const collapsed = collapseRecurringSeries(inView, todayMs);
  return time === 'past' ? collapsed.reverse() : collapsed;
}

// Recurring series (e.g. the weekly working-group calls from Luma) repeat under
// the same title on many dates and would otherwise flood the list. Keep one row
// per title: the next occurrence that is not over at `nowMs`, or the most recent
// past one if the whole series is over. The kept row carries `recurring` and
// `occurrences` so the UI can flag it. Single events pass through untouched.
export function collapseRecurringSeries(events, nowMs) {
  const byTitle = new Map();
  for (const evt of events || []) {
    const key = titleKey(evt);
    const group = byTitle.get(key) ?? [];
    group.push(evt);
    byTitle.set(key, group);
  }
  const collapsed = [];
  for (const group of byTitle.values()) {
    if (group.length === 1) {
      collapsed.push(group[0]);
      continue;
    }
    const sorted = [...group].sort((a, b) => startMs(a) - startMs(b));
    const next = sorted.find((e) => isUpcomingEvent(e, nowMs));
    const chosen = next || sorted[sorted.length - 1];
    collapsed.push({ ...chosen, recurring: true, occurrences: group.length });
  }
  return collapsed.sort((a, b) => startMs(a) - startMs(b));
}
