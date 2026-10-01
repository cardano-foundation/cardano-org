import { useEffect } from "react";
import { scrollToElement } from "@site/src/utils/jsUtils";
import { hashTargetId } from "@site/src/utils/hashTarget.mjs";

// The live sections grow the page after the first paint, so a deep link such
// as /governance/treasury#donate has scrolled too early. Called once, by the
// section that waits for both data sources, so the page jumps only one time.
export default function useHashRescroll(settled) {
  useEffect(() => {
    if (!settled) return;
    const id = hashTargetId(window.location.hash);
    const target = id && document.getElementById(id);
    if (target) scrollToElement(target);
  }, [settled]);
}
