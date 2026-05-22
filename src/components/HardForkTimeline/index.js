import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import styles from "./styles.module.css";

const useIsomorphicLayoutEffect = ExecutionEnvironment.canUseDOM
  ? React.useLayoutEffect
  : useEffect;

export default function HardForkTimeline({ items }) {
  const rowRefs = useRef([]);
  const timelineRef = useRef(null);
  const [eraSegments, setEraSegments] = useState([]);

  const eraGroups = useMemo(() => {
    const groups = [];
    items.forEach((item, idx) => {
      const last = groups[groups.length - 1];
      if (!last || last.era !== item.era) {
        groups.push({ era: item.era, start: idx, end: idx });
      } else {
        last.end = idx;
      }
    });
    return groups;
  }, [items]);

  useIsomorphicLayoutEffect(() => {
    function measure() {
      const container = timelineRef.current;
      if (!container) return;
      const containerTop = container.getBoundingClientRect().top;
      const DOT_MARGIN = 14;

      const dotCenters = rowRefs.current.map((row) => {
        if (!row) return null;
        const dot = row.querySelector(`.${styles.dot}`);
        if (!dot) return null;
        const r = dot.getBoundingClientRect();
        return r.top + r.height / 2 - containerTop;
      });

      const lastDot = dotCenters[dotCenters.length - 1];
      if (lastDot != null) {
        container.style.setProperty("--hf-line-end", `${lastDot}px`);
      }

      // Each era's region runs from the dot of its starting HF (g.end, oldest in the
      // group) UP TO the dot of the next-newer era's starting HF. We render the era
      // label in EVERY gap between consecutive dots inside that region, so it stays
      // obvious which era the timeline is in after each hard fork.
      const next = eraGroups.flatMap((g, gIdx) => {
        const bottomDot = dotCenters[g.end];
        if (bottomDot == null) return [];
        const prevGroup = eraGroups[gIdx - 1];
        const topBoundary = prevGroup ? dotCenters[prevGroup.end] : 0;
        if (topBoundary == null) return [];

        const insideDots = [];
        for (let i = g.start; i <= g.end; i++) {
          if (dotCenters[i] != null) insideDots.push(dotCenters[i]);
        }
        insideDots.sort((a, b) => a - b);

        const gaps = [];
        if (insideDots.length === 0) {
          gaps.push([topBoundary + DOT_MARGIN, bottomDot - DOT_MARGIN]);
        } else {
          gaps.push([topBoundary + DOT_MARGIN, insideDots[0] - DOT_MARGIN]);
          for (let i = 0; i < insideDots.length - 1; i++) {
            gaps.push([insideDots[i] + DOT_MARGIN, insideDots[i + 1] - DOT_MARGIN]);
          }
        }

        return gaps
          .filter(([a, b]) => b - a > 20)
          .map(([top, bottom]) => ({ era: g.era, top, height: bottom - top }));
      });
      setEraSegments(next);
    }
    measure();
    const observer = new ResizeObserver(measure);
    if (timelineRef.current) observer.observe(timelineRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [eraGroups]);

  return (
    <ol className={styles.timeline} ref={timelineRef}>
      {eraSegments.map((seg) => (
        <span
          key={`era-${seg.era}-${seg.top}`}
          className={styles.eraStripe}
          style={{ top: `${seg.top}px`, height: `${seg.height}px` }}
          aria-hidden="true"
        >
          <span className={styles.eraLabel}>{seg.era.replace(/\s+Era$/i, "")}</span>
        </span>
      ))}
      {items.map((item, index) => {
        const side = index % 2 === 0 ? "right" : "left";
        return (
          <li
            key={`${item.date}-${item.name}`}
            ref={(el) => (rowRefs.current[index] = el)}
            className={clsx(styles.row, styles[side], item.active && styles.activeRow)}
          >
            <div className={styles.axis} aria-hidden="true">
              <span className={clsx(styles.dot, item.active && styles.dotActive)} />
              <span className={styles.connector} />
            </div>
            <article className={clsx(styles.card, item.active && styles.cardActive)}>
              <header className={styles.cardHeader}>
                <div className={styles.cardHeaderText}>
                  <span className={styles.date}>{item.date}</span>
                  <h3 className={styles.name}>{item.name}</h3>
                </div>
                {item.epoch && (
                  <span className={styles.epochPill}>
                    <span className={styles.epochLabel}>{item.epochLabel}</span>
                    <span className={styles.epochValue}>{item.epoch}</span>
                  </span>
                )}
              </header>
              {item.description && (
                <p className={styles.description}>{item.description}</p>
              )}
              {item.meta?.length > 0 && (
                <>
                  <hr className={styles.divider} />
                  <dl className={styles.meta}>
                    {item.meta.map(({ label, value }) => (
                      <div className={styles.metaRow} key={label}>
                        <dt className={styles.metaLabel}>{label}</dt>
                        <dd className={styles.metaValue}>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
              <span className={styles.srEra}>{item.era}</span>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
