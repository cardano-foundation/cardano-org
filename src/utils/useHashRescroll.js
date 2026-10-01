import { useEffect } from "react";
import { scrollToElement } from "@site/src/utils/jsUtils";
import { hashTargetId } from "@site/src/utils/hashTarget.mjs";

// How long the page keeps the anchor in view while live sections load.
const WATCH_MS = 8000;
const SETTLE_MS = 150;

// The live sections load as separate chunks and grow the page after the first
// paint, so a deep link such as /governance/treasury#donate scrolls too early.
// For a few seconds after load this re-scrolls to the anchor whenever the page
// height changes, and stops as soon as the visitor scrolls on their own.
export default function useHashRescroll() {
  useEffect(() => {
    const id = hashTargetId(window.location.hash);
    if (!id || typeof ResizeObserver === "undefined") return undefined;

    let settleTimer = null;
    const observer = new ResizeObserver(() => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        const target = document.getElementById(id);
        if (target) scrollToElement(target);
      }, SETTLE_MS);
    });
    const stop = () => {
      observer.disconnect();
      clearTimeout(settleTimer);
      clearTimeout(watchTimer);
      ["wheel", "touchstart", "keydown"].forEach((type) => window.removeEventListener(type, stop));
    };
    const watchTimer = setTimeout(stop, WATCH_MS);
    ["wheel", "touchstart", "keydown"].forEach((type) => window.addEventListener(type, stop, { passive: true }));
    observer.observe(document.body);
    return stop;
  }, []);
}
