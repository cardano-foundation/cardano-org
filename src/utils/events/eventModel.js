// Pure normalization and merge logic for the /events page. No React here so it
// can be unit tested with a plain node script.

// Titles that mark non-events pinned on the Luma calendar (e.g. a guidelines
// card). Matched case-insensitively.
const PLACEHOLDER_TITLE_PATTERNS = [/event submission guidelines/i];

// Events at or beyond this year are treated as placeholders/pins, not real
// events. The Cardano Luma calendar uses a 2027 date for its guidelines pin.
const FAR_FUTURE_YEAR = 2027;

export function isPlaceholderEvent(evt) {
  if (!evt || !evt.title) return true;
  if (PLACEHOLDER_TITLE_PATTERNS.some((re) => re.test(evt.title))) return true;
  if (evt.startDate) {
    const start = new Date(evt.startDate);
    if (!Number.isNaN(start.getTime()) && start.getUTCFullYear() >= FAR_FUTURE_YEAR) {
      return true;
    }
  }
  return false;
}

function lumaLocationLabel(geo, online) {
  if (online || !geo) return null;
  if (geo.city_state) return geo.city_state;
  const parts = [geo.city, geo.country].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

export function normalizeLumaEvent(raw) {
  if (!raw || !raw.name) return null;
  // Luma uses location_type 'offline' for in person; anything else (online,
  // zoom, etc.) is treated as online.
  const online = raw.location_type !== 'offline';
  const geo = raw.geo_address_json || null;
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
    url: raw.url || null,
    image: raw.cover_url || null,
    organizer: null,
    tags: Array.isArray(raw.tags)
      ? raw.tags.map((t) => t && t.name).filter(Boolean)
      : [],
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
  return [...byKey.values()].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
}
