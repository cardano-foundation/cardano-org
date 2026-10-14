import { useEffect } from "react";
import { scrollToElement } from "@site/src/utils/jsUtils";
import { watchHashAnchor } from "@site/src/utils/hashAnchorWatch.mjs";

// Keeps a deep-linked anchor in view while the page's lazy sections load.
export default function useHashRescroll() {
  useEffect(
    () =>
      watchHashAnchor({
        win: window,
        doc: document,
        ResizeObserverImpl: typeof ResizeObserver === "undefined" ? null : ResizeObserver,
        scrollTo: scrollToElement,
      }),
    []
  );
}
