import { useEffect, useRef, useState } from "react";

function readCookie(name) {
  const prefix = `${name}=`;
  const entry = document.cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : null;
}

function writeCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

/**
 * Epoch range that is remembered in a cookie. Loads the saved range once the
 * latest epoch is known, falls back to the last `defaultSpan` epochs, and
 * saves every change.
 *
 * @param {object} options
 * @param {string} options.cookieName Cookie that stores the range, one per page.
 * @param {number} options.min Lowest selectable epoch.
 * @param {number} [options.max] Latest epoch. The range stays `null` until it is known.
 * @param {number} [options.defaultSpan=100] Number of epochs selected when nothing valid is saved.
 * @param {number} [options.days=1] Days the cookie is kept.
 * @returns {[{start: number, end: number}|null, Function]} The range and a setter taking `{ start, end }`.
 */
export default function useEpochRange({ cookieName, min, max, defaultSpan = 100, days = 1 }) {
  const [range, setRange] = useState(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !max) return;
    loaded.current = true;
    let start;
    let end;
    try {
      // Field names kept so ranges saved by earlier versions still load.
      const saved = JSON.parse(readCookie(cookieName));
      if (saved && saved.startEpoch >= min && saved.endEpoch <= max && saved.startEpoch < saved.endEpoch) {
        start = saved.startEpoch;
        end = saved.endEpoch;
      }
    } catch (e) {
      // An invalid cookie falls back to the default range.
    }
    if (!start || !end) {
      start = Math.max(min, max - defaultSpan + 1);
      end = max;
    }
    setRange({ start, end });
  }, [cookieName, min, max, defaultSpan]);

  useEffect(() => {
    if (range) writeCookie(cookieName, JSON.stringify({ startEpoch: range.start, endEpoch: range.end }), days);
  }, [range, cookieName, days]);

  return [range, setRange];
}
