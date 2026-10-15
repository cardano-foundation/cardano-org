import { useCallback, useEffect, useRef, useState } from "react";
import useHashTarget from "@site/src/utils/useHashTarget";

/**
 * Selected tab state that follows the URL hash, for deep links such as
 * `/governance#delegate`. On load and on every hash change, a hash that names
 * a tab selects it. With `storageKey`, the reader's last choice is kept in
 * localStorage and restored on the next visit when the URL has no tab hash.
 *
 * Returns `[selectedIndex, select]` for `TabsRoot`'s `selectedIndex` and
 * `onSelect`.
 *
 * @param {object} [options]
 * @param {string[]} [options.ids=[]] Hash id of each tab, in tab order.
 * @param {Function} [options.indexForHash] Maps other hashes (lowercase, without `#`) to a tab index, for example a program id to the tab that lists it. Return -1 for no match.
 * @param {string} [options.storageKey] localStorage key that remembers the chosen tab id.
 * @param {Function} [options.onHashSelect] Called with `(hash, index)` after a hash selected a tab, for example to scroll to it.
 * @returns {[number, Function]} The selected index and a setter for `onSelect`.
 */
export default function useHashTab({ ids = [], indexForHash, storageKey, onHashSelect } = {}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Latest options for the stable select callback.
  const options = useRef({ ids, storageKey });
  useEffect(() => {
    options.current = { ids, storageKey };
  });

  const select = useCallback((index) => {
    setSelectedIndex(index);
    const { ids: tabIds, storageKey: key } = options.current;
    if (!key) return;
    try {
      localStorage.setItem(key, tabIds[index] ?? "");
    } catch (e) {
      // Storage is a convenience, private mode simply does not remember.
    }
  }, []);

  useHashTarget((id, initial) => {
    const hash = (id ?? "").toLowerCase();
    let index = ids.indexOf(hash);
    if (index < 0 && hash && indexForHash) index = indexForHash(hash);
    if (index >= 0) {
      select(index);
      onHashSelect?.(hash, index);
      return;
    }
    // A tab hash in the URL wins. Otherwise restore the stored tab on load,
    // without scrolling, so a normal page load stays at the top.
    if (!initial || !storageKey) return;
    try {
      const stored = ids.indexOf(localStorage.getItem(storageKey));
      if (stored >= 0) setSelectedIndex(stored);
    } catch (e) {
      // No storage, keep the first tab.
    }
  });

  return [selectedIndex, select];
}
