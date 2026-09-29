// Best-effort cache with a time-to-live for Web Storage. Any storage error
// or unexpected content counts as a miss, so callers simply fetch again.
export function readTimedCache(storage, key, ttlMs, now = Date.now()) {
  try {
    const raw = storage?.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || typeof entry.ts !== 'number' || !('value' in entry)) return null;
    if (now - entry.ts > ttlMs) return null;
    return entry.value;
  } catch {
    return null;
  }
}

export function writeTimedCache(storage, key, value, now = Date.now()) {
  try {
    storage?.setItem(key, JSON.stringify({ ts: now, value }));
  } catch {
    // Quota exceeded or storage disabled, the cache is optional.
  }
}
