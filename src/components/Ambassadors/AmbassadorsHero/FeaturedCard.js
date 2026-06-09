import React, { useEffect, useState, useCallback } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { HiX } from "react-icons/hi";

import AmbassadorAvatar, { Flag } from "@site/src/components/Ambassadors/AmbassadorAvatar";
import { present } from "@site/src/utils/ambassadorLanguages";
import { ambassadorHref } from "@site/src/utils/ambassadorSlug";
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
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || paused || dismissed || prefersReducedMotion()) return undefined;
    const pending = new Set();
    function schedule(fn, delay) {
      const id = window.setTimeout(() => {
        pending.delete(id);
        fn();
      }, delay);
      pending.add(id);
    }
    const tick = window.setInterval(() => {
      // 4-stage swap so the connector line is gone before the card moves:
      // line out → card out → snap position+content → line in.
      if (onLineHiddenChange) onLineHiddenChange(true);
      schedule(() => setFading(true), LINE_FADE_MS);
      schedule(() => {
        setIndex((n) => (n + 1) % items.length);
        setFading(false);
      }, LINE_FADE_MS + FADE_MS);
      schedule(() => {
        if (onLineHiddenChange) onLineHiddenChange(false);
      }, LINE_FADE_MS + FADE_MS * 2);
    }, ROTATE_MS);
    return () => {
      window.clearInterval(tick);
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, [items.length, paused, dismissed, onLineHiddenChange]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!items.length || !onActiveChange || dismissed) return;
    onActiveChange(items[index % items.length].country);
  }, [index, items, onActiveChange, dismissed]);

  const onEnter = useCallback(() => setPaused(true), []);
  const onLeave = useCallback(() => setPaused(false), []);
  const onDismiss = useCallback(() => {
    setDismissed(true);
    if (onActiveChange) onActiveChange(null);
    if (onLineHiddenChange) onLineHiddenChange(true);
  }, [onActiveChange, onLineHiddenChange]);

  if (!items.length || dismissed) return null;

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
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onDismiss}
        aria-label={translate({
          id: "ambassadors.hero.featured.dismiss",
          message: "Dismiss featured ambassador",
        })}
      >
        <HiX aria-hidden="true" />
      </button>
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
        {tags[0] && (
          <span className={`${styles.tag} ${styles[`tone_${tags[0].tone}`] || ""}`}>
            {tags[0].label}
          </span>
        )}
        <Link to={ambassadorHref(current.name)} className={styles.viewLink}>
          {translate({ id: "ambassadors.hero.featured.viewProfile", message: "View profile" })}
        </Link>
      </div>
    </aside>
  );
}
