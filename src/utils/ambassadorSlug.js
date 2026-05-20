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

const HASH_RE = /^#a=([a-z0-9-]+)/i;
export function parseAmbassadorHash(hash) {
  if (!hash) return null;
  const m = hash.match(HASH_RE);
  return m ? m[1].toLowerCase() : null;
}
