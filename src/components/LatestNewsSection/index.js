import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import {translate} from "@docusaurus/Translate";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import recentNews from "@site/src/data/recentNews.json";
import styles from "./styles.module.css";

// useLayoutEffect warns during server-side rendering; fall back to useEffect there.
const useIsoLayoutEffect = ExecutionEnvironment.canUseDOM ? useLayoutEffect : useEffect;

// Number of lines the description is allowed to occupy (kept in sync with the
// -webkit-line-clamp value in styles.module.css).
const DESCRIPTION_LINES = 3;

// Truncates the text to whole words that fit within `lines`, then appends an
// ellipsis. A plain CSS line-clamp clips line 3 at the pixel edge, which lands
// mid-word (e.g. "withdrawal of" becomes "withdrawal o…"). Measuring the actual
// rendered width lets us always cut on a word boundary at any card size.
function CardDescription({ text }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const compute = () => {
      const width = el.clientWidth;
      if (!width) return;

      const cs = window.getComputedStyle(el);
      const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6;
      const maxHeight = lineHeight * DESCRIPTION_LINES + 1;

      // Off-screen probe that mirrors the paragraph's typography but wraps
      // freely, so scrollHeight reveals the true multi-line height.
      const probe = document.createElement("div");
      probe.style.cssText =
        "position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;white-space:normal;";
      probe.style.width = `${width}px`;
      probe.style.fontFamily = cs.fontFamily;
      probe.style.fontSize = cs.fontSize;
      probe.style.fontWeight = cs.fontWeight;
      probe.style.lineHeight = cs.lineHeight;
      probe.style.letterSpacing = cs.letterSpacing;
      probe.style.overflowWrap = cs.overflowWrap;
      probe.style.wordBreak = cs.wordBreak;
      document.body.appendChild(probe);

      const fits = (candidate) => {
        probe.textContent = candidate;
        return probe.scrollHeight <= maxHeight;
      };

      let result = text;
      if (!fits(text)) {
        const words = text.split(/\s+/);
        // Binary-search the largest word count whose text plus ellipsis fits.
        let lo = 1;
        let hi = words.length - 1;
        let best = words[0];
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          const candidate = words.slice(0, mid).join(" ").replace(/[,;:.\s]+$/, "") + "…";
          if (fits(candidate)) {
            best = candidate;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }
        result = best;
      }

      document.body.removeChild(probe);
      setDisplay((prev) => (prev === result ? prev : result));
    };

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(compute);
    };

    compute();
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [text]);

  return (
    <p ref={ref} className={styles.cardDescription}>
      {display}
    </p>
  );
}

// Display labels for the canonical tags defined in blog/tags.yml. Posts store
// their tags in priority order, so tags[0] is the primary category. Colors are
// keyed off the tag slug in styles.module.css.
const CATEGORY_LABELS = {
  development: "Development",
  research: "Research",
  governance: "Governance",
  community: "Community",
  ecosystem: "Ecosystem",
  education: "Education",
  events: "Events",
};

// On-brand category tiles (the site's Open Graph images) used as the thumbnail
// when a post has no banner of its own.
const CATEGORY_IMAGES = {
  development: "/img/og/developers.jpg",
  research: "/img/og/research.jpg",
  governance: "/img/og/governance.jpg",
  community: "/img/og/ambassadors.jpg",
  ecosystem: "/img/og/cardano-news.jpg",
  education: "/img/og/get-started.jpg",
  events: "/img/og/events.jpg",
};

const DEFAULT_IMAGE = "/img/og/default.jpg";

export default function LatestNewsSection({ count = 3 }) {
  const { withBaseUrl } = useBaseUrlUtils();
  const posts = recentNews.slice(0, count);

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <section className={styles.newsSection}>
      <div className={styles.cardsGrid}>
        {posts.map((post, index) => {
          const category = post.tags?.[0];
          const imageSrc = post.image || CATEGORY_IMAGES[category] || DEFAULT_IMAGE;
          const categoryLabel = CATEGORY_LABELS[category];
          return (
          <Link key={post.permalink} to={post.permalink} className={`${styles.newsCard} ${index >= 3 ? styles.desktopOnly : ''}`}>
            <div className={styles.cardImageWrapper}>
              <img
                src={withBaseUrl(imageSrc)}
                alt=""
                className={styles.cardImage}
                loading="lazy"
              />
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.cardDate}>{formatDate(post.date)}</span>
              {categoryLabel && (
                <span className={styles.categoryBadge} data-category={category}>
                  {categoryLabel}
                </span>
              )}
            </div>
            <h3 className={styles.cardTitle}>{post.title}</h3>
            <CardDescription text={post.description} />
            <div className={styles.cardFooter}>
              <div className={styles.authorInfo}>
                {post.authors[0] && (
                  <>
                    <img
                      src={withBaseUrl(post.authors[0].imageUrl)}
                      alt={post.authors[0].name}
                      className={styles.authorAvatar}
                      loading="lazy"
                    />
                    <span className={styles.authorName}>{post.authors[0].name}</span>
                  </>
                )}
              </div>
              <span className={styles.readMore}>
                {translate({id: "latestNews.readMore", message: "Read more"})}
              </span>
            </div>
          </Link>
          );
        })}
      </div>

      <div className={styles.ctaWrapper}>
        <Link to="/news" className="button button--primary button--lg">
          {translate({id: "latestNews.viewAll", message: "View all news"})}
        </Link>
      </div>
    </section>
  );
}
