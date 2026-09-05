/**
 * Tuning values for the medusa visualization. This module deliberately has no
 * imports, so the dev panel can read the defaults without pulling three.js or
 * d3-force into the eager homepage bundle.
 */

export const ENGINE_DEFAULTS = {
  background: '#0b1030',
  pointSizeFile: 7.0,
  pointSizeDir: 16.0,
  pointAlpha: 0.9,
  lineAlpha: 0.22,
  trailDamp: 0.88,
  flashDuration: 1.5,
  fadeOutDuration: 0.8,
  cameraDistance: 1725,
  minDistance: 500,
  maxDistance: 2600,
  zSpread: 120,
  parallax: 40,
  ambientOffsetX: -0.28,
  dimFactor: 0.15,
  smoothing: 10,
};

export const LAYOUT_DEFAULTS = {
  chargeDir: -70,
  chargeFile: -5,
  linkDir: 15,
  linkFile: 15,
  center: 0.05,
  velocityDecay: 0.45,
  theta: 0.9,
  distanceMax: 550,
  spawnJitter: 10,
  reheat: 0.4,
  settleTicks: 300,
};
