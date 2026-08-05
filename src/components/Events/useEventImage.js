import useBaseUrl from '@docusaurus/useBaseUrl';

// Resolves an event's image to a renderable src, plus a branded fallback logo
// for events without a cover. Luma images are absolute URLs; curated images are
// bare filenames under /img/events and must go through useBaseUrl (locale
// prefixes). Both hooks run unconditionally per the rules of hooks.
export default function useEventImage(image) {
  const isExternal = Boolean(image) && /^https?:\/\//.test(image);
  const local = useBaseUrl(image && !isExternal ? `/img/events/${image}` : '');
  const fallback = useBaseUrl('/img/cardano-white.svg');
  return {
    src: image ? (isExternal ? image : local) : null,
    fallback,
  };
}
