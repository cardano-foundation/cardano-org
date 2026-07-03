import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import { extractToc } from "@site/scripts/lib/constitution-toc.js";
import styles from "./styles.module.css";

export default function ConstitutionToc({ content }) {
  // Display levels 2-3 (Articles and Sections); the h1 doc title is skipped.
  const items = useMemo(
    () => extractToc(content).filter((h) => h.level === 2 || h.level === 3),
    [content]
  );
  const [activeSlug, setActiveSlug] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!items.length) return undefined;
    const headings = items
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean);
    if (!headings.length) return undefined;

    // Mark the heading whose top is closest to (but above) a line ~120px
    // below the viewport top as active.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          setActiveSlug(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav className={clsx(styles.toc, collapsed && styles.tocCollapsed)} aria-label={translate({ id: "constitution.toc.title", message: "Contents" })}>
      <button
        type="button"
        className={styles.tocToggle}
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
      >
        {translate({ id: "constitution.toc.title", message: "Contents" })}
      </button>
      <div className={styles.tocTitle}>
        {translate({ id: "constitution.toc.title", message: "Contents" })}
      </div>
      <ul className={styles.tocList}>
        {items.map((h) => (
          <li key={h.slug} className={styles.tocItem}>
            <a
              href={`#${h.slug}`}
              className={clsx(
                styles.tocLink,
                h.level === 3 && styles.tocLinkSection,
                activeSlug === h.slug && styles.tocLinkActive
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
