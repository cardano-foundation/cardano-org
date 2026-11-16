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
 * Shares text through the Web Share sheet where the browser has one, and
 * copies it otherwise. A share the reader dismissed ends as "cancelled" and
 * never falls through to a silent copy, any other share failure does.
 *
 * @param {string} text Text to share or copy.
 * @returns {Promise<"shared"|"cancelled"|"copied"|"failed">} What happened, so the button can say it.
 */
export async function shareOrCopy(text) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (e) {
      if (e?.name === "AbortError") return "cancelled";
      // Unsupported payload or other failure, fall through to the clipboard.
    }
  }
  return (await copyText(text)) ? "copied" : "failed";
}

/**
 * Copy button state: `copied` turns true after a successful copy and back to
 * false after `resetAfter` ms. A new copy restarts the timer, `reset` turns the
 * flag off at once (for example when the copied content changes), and a
 * running timer is cleared on unmount.
 *
 * @param {object} [options]
 * @param {number} [options.resetAfter=1500] How long `copied` stays true, in ms.
 * @returns {[boolean, (text: string) => Promise<boolean>, () => void]} The flag, the copy function (resolves to whether the copy worked), and `reset`.
 */
export default function useCopyToClipboard({ resetAfter = DEFAULT_RESET } = {}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = useCallback(
    async (text) => {
      const ok = await copyText(text);
      if (ok) {
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
