// Resolve an app's icon to a usable image src.
//
// `app.icon` comes in two shapes:
//   - a string path (SVGs kept in static/img/app-icons)
//   - a require() module object (PNG/WebP imported from src/), which exposes the
//     final URL on `.default` or `.src` depending on the loader
//
// Returns null when there is no usable icon, so callers can render a fallback.
export function resolveIconSrc(app) {
  if (!app?.icon) return null;
  if (typeof app.icon === "string") return app.icon;
  if (typeof app.icon === "object") return app.icon.default || app.icon.src || null;
  return null;
}
