// Auto-discovers collection MDX files under /src/pages/apps/collections/.
// Used by both /apps (inline 3-chip banner) and /apps/collections (full discovery page).
//
// require.context paths are relative to this file's directory; ../pages/apps/collections
// hits the same MDX files the route serves.

const req = require.context(
  "../pages/apps/collections",
  false,
  /\.mdx$/
);

function buildEntry(filePath) {
  const mod = req(filePath);
  const fm = mod?.frontMatter ?? null;
  if (!fm?.title) return null;
  const slug = filePath.replace(/^\.\//, "").replace(/\.mdx$/, "");
  return {
    slug,
    title: fm.title,
    description: fm.description ?? "",
    order: typeof fm.sidebar_position === "number" ? fm.sidebar_position : null,
    permalink: `/apps/collections/${slug}`,
  };
}

const ALL_COLLECTIONS = req
  .keys()
  .map(buildEntry)
  .filter(Boolean)
  .sort(
    (a, b) =>
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      a.title.localeCompare(b.title)
  );

export function getCollections({ limit } = {}) {
  return typeof limit === "number"
    ? ALL_COLLECTIONS.slice(0, limit)
    : ALL_COLLECTIONS;
}
