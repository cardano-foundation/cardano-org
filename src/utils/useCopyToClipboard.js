import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_RESET = 1500;

/**
 * Copies text to the clipboard. Resolves to `true` when the text was written,
 * `false` when the Clipboard API is missing (server render, plain http, older
 * browsers) or the write was refused. Never throws.
 *
 * @param {string} text Text to copy.
 * @returns {Promise<boolean>}
 */
export async function copyText(text) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy button state: `copied` turns true after a successful copy and back to
 * false after `resetAfter` ms. A new copy restarts the timer, `reset` turns the
 * flag off at once (for example when the copied content changes), and the
 * timer is cleared on unmount.
 *
 * @param {object} [options]
 * @param {number} [options.resetAfter=1500] How long `copied` stays true, in ms.
 * @returns {[boolean, (text: string) => Promise<boolean>, () => void]} The flag, the copy function (resolves to whether the copy worked), and `reset`.
 */
export default function useCopyToClipboard({ resetAfter = DEFAULT_RESET } = {}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  // A copy can resolve after the button unmounted, then no timer is started.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text) => {
      const ok = await copyText(text);
      if (ok && mountedRef.current) {
        setCopied(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), resetAfter);
      }
      return ok;
    },
    [resetAfter]
  );

  const reset = useCallback(() => {
    clearTimeout(timerRef.current);
    setCopied(false);
  }, []);

  return [copied, copy, reset];
}
