import { useEffect, useRef } from "react";
import { hashTargetId } from "@site/src/utils/hashTarget.mjs";

/**
 * Follows the URL hash for deep links such as `/governance#faq-lose-ada`.
 * Calls `onHash` once after mount and again on every hash change, with the
 * id the hash names (decoded, `null` for no hash or a malformed one) and
 * whether this is the call on mount. The latest `onHash` is used, so the
 * listener is added only once and the callback needs no memoizing.
 *
 * @param {(id: string|null, initial: boolean) => void} onHash
 */
export default function useHashTarget(onHash) {
  const latest = useRef(onHash);
  useEffect(() => {
    latest.current = onHash;
  });

  useEffect(() => {
    const apply = (initial) => latest.current(hashTargetId(window.location.hash), initial);
    const onChange = () => apply(false);
    apply(true);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
}
