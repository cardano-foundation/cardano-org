import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { translate } from "@docusaurus/Translate";
import clsx from "clsx";

import AppTile from "@site/src/components/AppTile";

import styles from "./styles.module.css";

const SCROLL_TILE_OFFSET = 276;

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"
      />
    </svg>
  );
}

function AppTileCarousel({ apps, ariaLabel, renderBadge }) {
  const scrollerRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setCanScrollPrev(node.scrollLeft > 1);
    setCanScrollNext(node.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const node = scrollerRef.current;
    if (!node) return undefined;
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, apps.length]);

  const scrollBy = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * SCROLL_TILE_OFFSET, behavior: "smooth" });
  };

  return (
    <div className={styles.carousel} aria-label={ariaLabel} role="region">
      <button
        type="button"
        className={clsx(styles.arrow, styles.arrowPrev)}
        onClick={() => scrollBy(-1)}
        disabled={!canScrollPrev}
        aria-label={translate({ id: "apps.carousel.prev", message: "Previous" })}
      >
        <ChevronLeft />
      </button>
      <ul ref={scrollerRef} className={styles.scroller}>
        {apps.map((app) => (
          <li key={app.slug} className={styles.item}>
            <AppTile app={app} badge={renderBadge ? renderBadge(app) : null} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={clsx(styles.arrow, styles.arrowNext)}
        onClick={() => scrollBy(1)}
        disabled={!canScrollNext}
        aria-label={translate({ id: "apps.carousel.next", message: "Next" })}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default memo(AppTileCarousel);
