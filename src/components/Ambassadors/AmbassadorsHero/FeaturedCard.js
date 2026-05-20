import React, { useEffect, useState, useCallback } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";

import AmbassadorAvatar, { Flag } from "@site/src/components/Ambassadors/AmbassadorAvatar";
import { VIEW_W, VIEW_H } from "@site/src/utils/mapProjection";
import styles from "./FeaturedCard.module.css";

const ROTATE_MS = 5000;
const CLAMP_X_MIN_PCT = 20;
const CLAMP_X_MAX_PCT = 80;
const CARD_OFFSET_PX = 16;

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function positionStyle(item) {
  const xPct = Math.max(
    CLAMP_X_MIN_PCT,
    Math.min(CLAMP_X_MAX_PCT, (item.x / VIEW_W) * 100),
  );
  const yPct = (item.y / VIEW_H) * 100;
  return {
    left: `${xPct}%`,
    top: `calc(${yPct}% + ${CARD_OFFSET_PX}px)`,
  };
}

export default function FeaturedCard({ items, onActiveChange }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || paused || prefersReducedMotion()) return undefined;
    const id = window.setInterval(
      () => setIndex((n) => (n + 1) % items.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [items.length, paused]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!items.length || !onActiveChange) return;
    onActiveChange(items[index % items.length].country);
  }, [index, items, onActiveChange]);

  const onEnter = useCallback(() => setPaused(true), []);
  const onLeave = useCallback(() => setPaused(false), []);

  if (!items.length) return null;

  const current = items[index % items.length];
  const tags = current.tags || [];

  return (
    <aside
      className={styles.card}
      style={positionStyle(current)}
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
          <AmbassadorAvatar
            ambassador={current}
            photoClassName={styles.photo}
            initialClassName={styles.initial}
          />
          <Flag country={current.country} className={styles.flag} />
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
    </aside>
  );
}
