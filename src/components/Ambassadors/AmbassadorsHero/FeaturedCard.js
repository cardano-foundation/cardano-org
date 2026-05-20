import React, { useEffect, useState, useCallback } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";

import AmbassadorAvatar, { Flag } from "@site/src/components/Ambassadors/AmbassadorAvatar";
import { present } from "@site/src/utils/ambassadorLanguages";
import { ambassadorSlug } from "@site/src/utils/ambassadorSlug";
import { VIEW_W, VIEW_H } from "@site/src/utils/mapProjection";
import styles from "./FeaturedCard.module.css";

const ROTATE_MS = 5000;
const FADE_MS = 350;
const LINE_FADE_MS = 250;
const CLAMP_X_MIN_PCT = 20;
const CLAMP_X_MAX_PCT = 80;
const CARD_OFFSET_VIEWBOX_Y = 50;

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function positionStyle(item) {
  const xPct = Math.max(
    CLAMP_X_MIN_PCT,
    Math.min(CLAMP_X_MAX_PCT, (item.x / VIEW_W) * 100),
  );
  const yPct = ((item.y + CARD_OFFSET_VIEWBOX_Y) / VIEW_H) * 100;
  return {
    left: `${xPct}%`,
    top: `${yPct}%`,
  };
}

export default function FeaturedCard({ items, onActiveChange, onLineHiddenChange }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || paused || prefersReducedMotion()) return undefined;
    const timers = [];
    const tick = window.setInterval(() => {
      // 1. line fades out first
      if (onLineHiddenChange) onLineHiddenChange(true);
      // 2. card fades out once the line is gone
      timers.push(window.setTimeout(() => setFading(true), LINE_FADE_MS));
      // 3. swap content + position while card is invisible (line stays hidden)
      timers.push(window.setTimeout(() => {
        setIndex((n) => (n + 1) % items.length);
        setFading(false);
      }, LINE_FADE_MS + FADE_MS));
      // 4. line fades back in at the new pin after the card has re-appeared
      timers.push(window.setTimeout(() => {
        if (onLineHiddenChange) onLineHiddenChange(false);
      }, LINE_FADE_MS + FADE_MS * 2));
    }, ROTATE_MS);
    return () => {
      window.clearInterval(tick);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [items.length, paused, onLineHiddenChange]);

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
  const tagline = present(current.tagline) ? current.tagline : null;

  return (
    <aside
      className={`${styles.card} ${fading ? styles.fading : ""}`}
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
      {tagline && <p className={styles.bio}>{tagline}</p>}
      <div className={styles.footer}>
        {tags[0] ? (
          <span className={`${styles.tag} ${styles[`tone_${tags[0].tone}`] || ""}`}>
            {tags[0].label}
          </span>
        ) : (
          <span />
        )}
        <Link to={`#a=${ambassadorSlug(current.name)}`} className={styles.viewLink}>
          {translate({ id: "ambassadors.hero.featured.viewProfile", message: "View profile" })}
        </Link>
      </div>
    </aside>
  );
}
