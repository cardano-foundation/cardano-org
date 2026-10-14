/**
 * Era and directory groups for the medusa visualization. Shared by the data
 * script (scripts/medusa-history.js), the renderer and the legend, so that
 * names, order and colors have a single source.
 */

export const ERA_KEYS = ['byron', 'shelley', 'allegra', 'mary', 'alonzo', 'babbage', 'conway', 'dijkstra'];

// Directory names that are not an era name but belong to one.
const ERA_ALIASES = { 'shelley-ma': 'mary' };

const ERA_COLORS = {
  byron: '#7f9cff',
  shelley: '#31d5c8',
  allegra: '#ffd166',
  mary: '#ff7ab6',
  alonzo: '#ff5a5f',
  babbage: '#b98cff',
  conway: '#ffffff',
  dijkstra: '#7dffa1',
};

export const GROUPS = [
  ...ERA_KEYS.map((key) => ({ key, color: ERA_COLORS[key], era: true })),
  { key: 'libs', color: '#52639c', era: false },
  { key: 'docs', color: '#46557f', era: false },
  { key: 'other', color: '#3a466b', era: false },
];

const INDEX = new Map(GROUPS.map((g, i) => [g.key, i]));

export function groupForPath(path) {
  if (!path || path === '/') return 'other';
  const segments = path.toLowerCase().split('/').filter(Boolean);
  for (const segment of segments) {
    if (ERA_ALIASES[segment]) return ERA_ALIASES[segment];
    if (ERA_KEYS.includes(segment)) return segment;
  }
  const top = segments[0];
  if (top === 'libs' || top === 'docs') return top;
  return 'other';
}

export function groupIndex(key) {
  return INDEX.has(key) ? INDEX.get(key) : INDEX.get('other');
}

export function groupColor(key) {
  return GROUPS[groupIndex(key)].color;
}
