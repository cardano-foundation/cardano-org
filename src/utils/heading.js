// Shared logic for components with a configurable heading level.
//
// Components render their title with a fixed default level. A `headingLevel`
// prop changes the element for the document outline, for example from h1 to h2
// below a page hero. The heading keeps the look of the default level through a
// global `heading-look-hN` class from src/css/custom.css, so changing the level
// does not change the design.

/**
 * @param {number} [level] Requested heading level, 1 to 6, or 0 for no heading at all
 *   (a div with the same look). Falls back to `defaultLevel`.
 * @param {number} defaultLevel The level the component renders by default.
 * @returns {{ Tag: string, lookClassName: (string|undefined) }} The element to
 *   render and, when the level differs from the default, the class that keeps
 *   the default look.
 */
export function getHeading(level, defaultLevel) {
  const resolved = Number.isInteger(level) && level >= 0 && level <= 6 ? level : defaultLevel;
  return {
    Tag: resolved === 0 ? "div" : `h${resolved}`,
    lookClassName: resolved === defaultLevel ? undefined : `heading-look-h${defaultLevel}`,
  };
}
