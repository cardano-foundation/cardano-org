// Small utilities shared by the wallet delegation tools (DRep and stake pool).

// Unbiased shuffle of a copy, the input array is left untouched so callers
// can pass arrays they still need in their original order.
export function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// sessionStorage cache with a TTL. Every failure (private mode, quota, bad
// JSON) reads as a miss, callers then simply refetch.
export function readCache(key, ttlMs) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { ts, value } = JSON.parse(raw);
    if (typeof ts !== "number" || Date.now() - ts > ttlMs) return null;
    return value ?? null;
  } catch {
    return null;
  }
}

export function writeCache(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), value }));
  } catch {
    // Cache is best effort.
  }
}
