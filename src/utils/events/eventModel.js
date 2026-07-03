// Pure normalization and merge logic for the /events page. No React here so it
// can be unit tested with a plain node script.

import { deriveCuratedCategory, deriveLumaCategory } from './categories.js';

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

function dedupKey(evt) {
  const title = (evt.title || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const day = evt.startDate ? String(evt.startDate).slice(0, 10) : '';
  return `${title}|${day}`;
}

export function mergeEvents(curatedRaw, lumaRaw) {
  const curated = (curatedRaw || []).map(normalizeCuratedEvent).filter(Boolean);
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
  return [...byKey.values()].sort(
    (a, b) => new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime(),
  );
}
