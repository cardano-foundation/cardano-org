// Random helpers for components that are rendered on the server first.
//
// Anything random must not run during the first render: the static build and
// the browser would pick different values and React reports a hydration
// mismatch. Render a deterministic order first and randomize once
// `useIsBrowser()` from @docusaurus/useIsBrowser returns true, or inside an effect.

/**
 * Unbiased Fisher-Yates shuffle. Returns a new array and leaves the input untouched.
 *
 * @template T
 * @param {T[]} items Items to shuffle.
 * @param {() => number} [random] Source of numbers in [0, 1), Math.random by default.
 * @returns {T[]} A shuffled copy.
 */
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
