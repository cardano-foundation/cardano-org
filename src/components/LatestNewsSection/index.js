import React from "react";
import Link from "@docusaurus/Link";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import {translate} from "@docusaurus/Translate";
import recentNews from "@site/src/data/recentNews.json";
import styles from "./styles.module.css";

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
            <p className={styles.cardDescription}>{post.description}</p>
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
