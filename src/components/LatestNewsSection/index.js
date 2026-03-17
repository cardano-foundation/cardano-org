import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {translate} from "@docusaurus/Translate";
import recentNews from "@site/src/data/recentNews.json";
import styles from "./styles.module.css";

export default function LatestNewsSection({ count = 3 }) {
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
        {posts.map((post, index) => (
          <Link key={post.permalink} to={post.permalink} className={`${styles.newsCard} ${index >= 3 ? styles.desktopOnly : ''}`}>
            <span className={styles.cardDate}>{formatDate(post.date)}</span>
            <h3 className={styles.cardTitle}>{post.title}</h3>
            <p className={styles.cardDescription}>{post.description}</p>
            <div className={styles.cardFooter}>
              <div className={styles.authorInfo}>
                {post.authors[0] && (
                  <>
                    <img
                      src={useBaseUrl(post.authors[0].imageUrl)}
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
        ))}
      </div>

      <div className={styles.ctaWrapper}>
        <Link to="/news" className="button button--primary button--lg">
          {translate({id: "latestNews.viewAll", message: "View all news"})}
        </Link>
      </div>
    </section>
  );
}
