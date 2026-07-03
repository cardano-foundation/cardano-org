// Category taxonomy for events: labels + colors for the calendar legend and
// filter chips, plus heuristics to derive a category when the source data has
// no explicit one. Pure module (no React, no @site alias) so eventModel can
// import it and still run under the plain node test.

export const EVENT_CATEGORIES = {
  Conference: { label: 'Conference', color: '#2f62d6' },
  Meetup: { label: 'Meetup', color: '#1aa179' },
  Governance: { label: 'Governance', color: '#e5820a' },
  Hackathon: { label: 'Hackathon', color: '#8b5cf6' },
  Workshop: { label: 'Workshop', color: '#14b8a6' },
  Developers: { label: 'Developers', color: '#4b5bd6' },
  Community: { label: 'Community', color: '#d6409f' },
  Other: { label: 'Other', color: '#94a3b8' },
};

export const DEFAULT_CATEGORY = 'Other';

export function categoryColor(category) {
  return (EVENT_CATEGORIES[category] || EVENT_CATEGORIES.Other).color;
}

export function categoryLabel(category) {
  return (EVENT_CATEGORIES[category] || EVENT_CATEGORIES.Other).label;
}

// Curated events are hand-picked conferences; only hackathons differ by title.
export function deriveCuratedCategory(title) {
  if (typeof title === 'string' && /hackathon/i.test(title)) return 'Hackathon';
  return 'Conference';
}

// Luma events carry free-form tags; map the meaningful ones to a category.
// Best-effort: the Luma feed has no explicit category.
export function deriveLumaCategory(tagNames) {
  const tags = Array.isArray(tagNames) ? tagNames : [];
  if (tags.some((t) => /developers?/i.test(t))) return 'Developers';
  if (tags.some((t) => /governance/i.test(t))) return 'Governance';
  if (tags.some((t) => /intersect/i.test(t))) return 'Governance';
  if (tags.some((t) => /meetup/i.test(t))) return 'Meetup';
  if (tags.some((t) => /workshop/i.test(t))) return 'Workshop';
  return 'Community';
}
