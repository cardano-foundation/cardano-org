import { useEffect, useRef, useState } from 'react';

// Shared localStorage-backed state, SSR-safe by design: the server render
// and the first client render both show `initialValue`, the stored value is
// loaded in an effect after mount. This avoids hydration mismatches on
// statically rendered pages at the cost of one extra paint.
// `validate` lets callers reject stale or tampered values on load.
// Nothing is written until the value actually changes: neither mounting nor
// loading stored state back into memory touches storage.
export default function useLocalStorage(key, initialValue, validate) {
  // Capture the first initialValue so callers may pass fresh objects per render
  const initialRef = useRef(initialValue);
  // What the load effect last read from storage: writing it back would be a no-op
  const lastLoadedRef = useRef(null);
  const loadedRef = useRef(false);
  // eslint-disable-next-line react-hooks/refs -- initialValue is captured once, not accessed on re-renders
  const [value, setValue] = useState(initialRef.current);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (!validate || validate(parsed)) {
          lastLoadedRef.current = parsed;
          // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate post-mount load from storage, keeps SSR and hydration render identical
          setValue(parsed);
        }
      }
    } catch (e) {
      // Unreadable storage: keep the initial value
    }
    loadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- validate is stable per call site, key changes are not supported
  }, [key]);

  useEffect(() => {
    // The mount flush runs this effect with the first render's value while
    // the load effect may already have queued the stored value. Guarding on
    // identity against BOTH the pristine initial value and the just-loaded
    // value means neither mounting nor the post-load echo render writes.
    if (!loadedRef.current) return;
    if (value === initialRef.current) return;
    if (value === lastLoadedRef.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Storage may be unavailable (private mode, quota). In-memory state still works.
    }
  }, [key, value]);

  const reset = () => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // ignore, see above
    }
    lastLoadedRef.current = null;
    setValue(initialRef.current);
  };

  return [value, setValue, reset];
}
