/**
 * Client capability checks and dev flags for the medusa visualization.
 * Everything here must be safe to call only in the browser.
 */

export function medusaFlag(name) {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('medusa') === name;
}

export function canRunWebGL() {
  if (typeof window === 'undefined') return false;
  if (medusaFlag('fallback')) return false;
  const ua = navigator.userAgent || '';
  // Devices known to struggle with WebGL point clouds.
  const isOldDevice =
    /Android [1-7]\./i.test(ua) ||
    /iPhone OS [5-9]_/i.test(ua) ||
    /OS [5-9]_\d/i.test(ua) ||
    /BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (isOldDevice) return false;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  return Boolean(gl);
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isSmallViewport() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}
