import { useEffect } from 'react';

const EDITABLE = /^(INPUT|TEXTAREA|SELECT)$/;

// Keyboard control for the explorer and for presentations. Handlers receive
// nothing, the caller closes over its own state.
export default function useMedusaKeys(handlers) {
  useEffect(() => {
    const onKey = (e) => {
      if (EDITABLE.test(e.target?.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      const h = handlers;
      const actions = {
        ' ': h.toggle,
        ArrowRight: () => h.step(1),
        ArrowLeft: () => h.step(-1),
        ArrowUp: () => h.speed(1),
        ArrowDown: () => h.speed(-1),
        l: h.toggleLabels,
        f: h.fullscreen,
        h: h.toggleUi,
        m: h.toggleCards,
        Escape: h.clear,
      };
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (/^[1-9]$/.test(key)) {
        h.milestone(Number(key) - 1);
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
  }, [handlers]);
}
