// Element id named by a location hash. A malformed escape such as "#%E0%A4%A"
// makes decodeURIComponent throw, which would crash the page from inside an
// effect, so it counts as no target.
export function hashTargetId(hash) {
  if (!hash || hash.length < 2) return null;
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return null;
  }
}
