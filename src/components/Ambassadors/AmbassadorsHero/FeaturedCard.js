import React, { useEffect, useState, useCallback } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";

import { avatarColor } from "@site/src/utils/ambassadorColors";
import styles from "./FeaturedCard.module.css";

const ROTATE_MS = 5000;
const PLACEHOLDER = "SOON...";

function present(value) {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed.length > 0 && trimmed !== PLACEHOLDER;
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function AvatarOrInitial({ ambassador }) {
  const [errored, setErrored] = useState(false);
  const showPhoto = present(ambassador.profilePicture) && !errored;
  if (showPhoto) {
    return (
      <img
        src={ambassador.profilePicture}
        alt=""
        className={styles.photo}
        onError={() => setErrored(true)}
      />
    );
  }
  return (
    <div
      className={styles.initial}
      style={{ backgroundColor: avatarColor(ambassador.name) }}
      aria-hidden="true"
    >
      {ambassador.name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

function Flag({ country }) {
  const flag = useBaseUrl(`img/flags/${country}.svg`);
  return <img src={flag} alt="" className={styles.flag} />;
}

export default function FeaturedCard({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || paused || prefersReducedMotion()) return undefined;
    const id = window.setInterval(
      () => setIndex((n) => (n + 1) % items.length),
      ROTATE_MS
    );
    return () => window.clearInterval(id);
  }, [items.length, paused]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onEnter = useCallback(() => setPaused(true), []);
  const onLeave = useCallback(() => setPaused(false), []);

  if (!items.length) return null;

  const current = items[index % items.length];
  const tags = current.tags || [];

  return (
    <aside
      className={styles.card}
      aria-label={translate({
        id: "ambassadors.hero.featured.aria",
        message: "Featured ambassador",
      })}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <div className={styles.head}>
        <div className={styles.avatarWrap}>
          <AvatarOrInitial ambassador={current} />
          <Flag country={current.country} />
        </div>
        <div className={styles.meta}>
          <div className={styles.name}>{current.name}</div>
          <div className={styles.role}>{current.role}</div>
        </div>
      </div>
      {tags.length > 0 && (
        <div className={styles.tagRow}>
          {tags.map((t) => (
            <span key={t.label} className={`${styles.tag} ${styles[`tone_${t.tone}`] || ""}`}>
              {t.label}
            </span>
          ))}
        </div>
      )}
      <Link to={current.link} className={styles.viewLink} target="_blank" rel="noopener noreferrer">
        {translate({ id: "ambassadors.hero.featured.viewProfile", message: "View profile →" })}
      </Link>
      {items.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Rotation indicators">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ambassador ${i + 1} of ${items.length}`}
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
