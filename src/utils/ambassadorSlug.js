export function ambassadorSlug(name) {
  if (!name) return "";
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ambassadorHref(name) {
  return `#a=${ambassadorSlug(name)}`;
}

export function ambassadorElementId(slug) {
  return `a-${slug}`;
}

// Slug from the id a hash such as #a=jane-doe names ("a=jane-doe").
const TARGET_RE = /^a=([a-z0-9-]+)/i;
export function parseAmbassadorTarget(id) {
  if (!id) return null;
  const m = id.match(TARGET_RE);
  return m ? m[1].toLowerCase() : null;
}
