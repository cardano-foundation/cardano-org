/**
 * Path helpers shared by the hover label and the pin card.
 */

// The dataset stores the repository root as a bare slash, which reads as
// nothing on screen, so the repository name stands in for it.
const ROOT_NAME = 'cardano-ledger';

// Splits a node path into the parent directory (with a trailing slash) and the
// last segment.
export function splitPath(path) {
  if (!path || path === '/') return { dir: '', name: ROOT_NAME };
  const segments = path.split('/').filter(Boolean);
  const name = segments.pop() ?? ROOT_NAME;
  return { dir: segments.length ? `${segments.join('/')}/` : '', name };
}
