// Guards a URL that comes from community-submitted data (app/exchange/wallet
// entries, glossary sources) before it is used as an href/to target.
//
// Returns the value only when it is a site-relative path ("/…" or "#…") or an
// http(s) URL; anything else (javascript:, data:, vbscript:, a scheme hidden
// behind embedded control characters, …) collapses to "#" so a malicious value
// can never become an executable link. The allowlist is fail-closed: any value
// that is not clearly relative or http(s) is rejected.
export function safeUrl(url) {
  if (typeof url !== "string") return "#";
  const trimmed = url.trim();
  // Reject protocol-relative "//host" (resolves off-site); allow on-site "/path".
  if (trimmed.startsWith("//")) return "#";
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "#";
}
