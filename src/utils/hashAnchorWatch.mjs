// Keeps a deep-linked anchor such as /governance/treasury#donate in view
// while client-only sections load and grow the page. Plain module so node
// --test can drive it with fake window, document and ResizeObserver.
import { hashTargetId } from './hashTarget.mjs';

// Longer than the 10 s API timeout (src/utils/insights/api.js) plus the time
// to load a lazy chunk, so a slow but successful response still re-scrolls.
export const WATCH_MS = 15000;
const SETTLE_MS = 150;
// Any own interaction ends the watch, so opening a section or scrolling is
// never undone by a late re-scroll.
const STOP_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

export function watchHashAnchor({ win, doc, ResizeObserverImpl, scrollTo }) {
  const id = hashTargetId(win.location.hash);
  if (!id || !ResizeObserverImpl) return () => {};

  let settleTimer = null;
  let watchTimer = null;
  const observer = new ResizeObserverImpl(() => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      const target = doc.getElementById(id);
      if (target) scrollTo(target);
    }, SETTLE_MS);
  });
  const stop = () => {
    observer.disconnect();
    clearTimeout(settleTimer);
    clearTimeout(watchTimer);
    STOP_EVENTS.forEach((type) => win.removeEventListener(type, stop));
  };
  watchTimer = setTimeout(stop, WATCH_MS);
  STOP_EVENTS.forEach((type) => win.addEventListener(type, stop, { passive: true }));
  observer.observe(doc.body);
  return stop;
}
