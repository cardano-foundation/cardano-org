import { useEffect } from "react";

// Homepage instrumentation for the reorder experiment. Sends two GA4 events:
// - home_scroll_depth: once per pageview for each 25% threshold reached
// - home_cta_click: clicks on links inside a data-section wrapper (hero
//   CTAs, intent chips, "Use Cardano Apps"), with section, text and href
// Renders nothing. gtag is provided by the gtag plugin in production and by
// the stub in docusaurus.config.js headTags during local development.

const SCROLL_STEPS = [25, 50, 75, 100];

function sendEvent(name, params) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export default function HomeTracking() {
  useEffect(() => {
    const reached = new Set();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      for (const step of SCROLL_STEPS) {
        if (percent >= step && !reached.has(step)) {
          reached.add(step);
          sendEvent("home_scroll_depth", { percent_scrolled: step });
        }
      }
    };

    const onClick = (event) => {
      const link = event.target.closest("a[href]");
      const section = link?.closest("[data-section]")?.dataset.section;
      if (!section) return;
      sendEvent("home_cta_click", {
        cta_section: section,
        cta_text: (link.textContent || "").trim().slice(0, 100),
        cta_href: link.getAttribute("href"),
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
