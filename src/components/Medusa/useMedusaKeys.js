import { useEffect } from 'react';

const EDITABLE = /^(INPUT|TEXTAREA|SELECT)$/;

// Keyboard control for the explorer and for presentations. Handlers receive
// nothing, the caller closes over its own state. The keys are only claimed
// while the visualization is enabled and on screen, so the rest of the page
// keeps its normal scrolling.
export default function useMedusaKeys(handlers, enabled = true, containerRef = null) {
  useEffect(() => {
    if (!enabled) return undefined;
    const actions = {
      ' ': handlers.toggle,
      ArrowRight: () => handlers.step(1),
      ArrowLeft: () => handlers.step(-1),
      ArrowUp: () => handlers.speed(1),
      ArrowDown: () => handlers.speed(-1),
      l: handlers.toggleLabels,
      f: handlers.fullscreen,
      h: handlers.toggleUi,
      m: handlers.toggleCards,
      Escape: handlers.clear,
    };
    const onKey = (e) => {
      if (EDITABLE.test(e.target?.tagName) || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      // The browser already activates a focused button on space, so handling
      // it here as well would toggle playback twice.
      if (e.key === ' ' && e.target?.tagName === 'BUTTON') return;
      // Key repeat would queue one seek per repeat and the worker cannot keep
      // up, so a held arrow steps once and waits for the next press.
      if (e.repeat && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
      const box = containerRef?.current?.getBoundingClientRect();
      // A viewport height of zero means the page is not laid out yet or is not
      // being displayed, and then the box says nothing about visibility.
      const viewport = window.innerHeight || document.documentElement.clientHeight || 0;
      if (box && viewport > 0 && (box.bottom < 0 || box.top > viewport)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (/^[1-9]$/.test(key)) {
        handlers.milestone(Number(key) - 1);
        e.preventDefault();
        return;
      }
      if (actions[key]) {
        actions[key]();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers, enabled, containerRef]);
}
