import { useCallback, useEffect, useRef, useState } from "react";
import { hashTargetId } from "@site/src/utils/hashTarget.mjs";

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
  // Latest options for the hash listener, which is only added once.
  const options = useRef({ ids, indexForHash, storageKey, onHashSelect });
  useEffect(() => {
    options.current = { ids, indexForHash, storageKey, onHashSelect };
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

  useEffect(() => {
    const applyHash = () => {
      const { ids: tabIds, indexForHash: lookup, onHashSelect: onSelectHash } = options.current;
      const hash = (hashTargetId(window.location.hash) ?? "").toLowerCase();
      let index = tabIds.indexOf(hash);
      if (index < 0 && hash && lookup) index = lookup(hash);
      if (!(index >= 0)) return false;
      select(index);
      onSelectHash?.(hash, index);
      return true;
    };

    // A tab hash in the URL wins. Otherwise restore the stored tab, without
    // scrolling, so a normal page load stays at the top.
    const { ids: tabIds, storageKey: key } = options.current;
    if (!applyHash() && key) {
      try {
        const index = tabIds.indexOf(localStorage.getItem(key));
        if (index >= 0) setSelectedIndex(index);
      } catch (e) {
        // No storage, keep the first tab.
      }
    }

    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [select]);

  return [selectedIndex, select];
}
