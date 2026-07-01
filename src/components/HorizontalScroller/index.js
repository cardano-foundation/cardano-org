import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import clsx from "clsx";

import styles from "./styles.module.css";

const useIsomorphicLayoutEffect = ExecutionEnvironment.canUseDOM
  ? useLayoutEffect
  : useEffect;

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
      <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
      <path fill="currentColor" d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
    </svg>
  );
}

// Generic horizontal scroll-snap track with prev/next arrows (desktop) and
// progress dots (mobile), mirroring the /apps category carousel. Each child is
// rendered as one snap item.
function HorizontalScroller({ children, ariaLabel, prevLabel, nextLabel }) {
  const items = React.Children.toArray(children);
  const scrollerRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScrollState = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setCanScrollPrev(node.scrollLeft > 1);
    setCanScrollNext(node.scrollLeft < max - 1);
    const lastIndex = items.length - 1;
    if (max <= 0 || lastIndex <= 0) {
      setActiveIndex(0);
      return;
    }
    const progress = node.scrollLeft / max;
    setActiveIndex(Math.round(progress * lastIndex));
  }, [items.length]);

  useIsomorphicLayoutEffect(() => {
    const node = scrollerRef.current;
    if (!node) return undefined;
    node.scrollLeft = 0;
    updateScrollState();
    const frame = requestAnimationFrame(updateScrollState);
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, items.length]);

  const scrollByItem = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    const firstItem = node.firstElementChild;
    const itemWidth = firstItem ? firstItem.getBoundingClientRect().width : 320;
    const gap = parseFloat(getComputedStyle(node).columnGap) || 16;
    node.scrollBy({ left: direction * (itemWidth + gap), behavior: "smooth" });
    requestAnimationFrame(updateScrollState);
  };

  return (
    <div className={styles.carousel} aria-label={ariaLabel} role="region">
      <button
        type="button"
        className={clsx(styles.arrow, styles.arrowPrev)}
        onClick={() => scrollByItem(-1)}
        disabled={!canScrollPrev}
        aria-label={prevLabel}
      >
        <ChevronLeft />
      </button>
      <ul
        ref={scrollerRef}
        className={clsx(
          styles.scroller,
          canScrollPrev && styles.canPrev,
          canScrollNext && styles.canNext,
        )}
      >
        {items.map((child, i) => (
          <li key={i} className={styles.item}>
            {child}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={clsx(styles.arrow, styles.arrowNext)}
        onClick={() => scrollByItem(1)}
        disabled={!canScrollNext}
        aria-label={nextLabel}
      >
        <ChevronRight />
      </button>
      <div className={styles.dots} aria-hidden>
        {items.map((child, i) => (
          <span
            key={i}
            className={clsx(styles.dot, i === activeIndex && styles.dotActive)}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(HorizontalScroller);
