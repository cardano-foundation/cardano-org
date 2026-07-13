import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Showcases, Tags } from "@site/src/data/apps";
import { getAppStats, formatTxCountCompact as formatTxCount, getAppAxes } from "@site/src/utils/appStats";
import { safeUrl } from "@site/src/utils/safeUrl";
import styles from "./styles.module.css";

function AppListItem({ app, stats, showTxCount, showTags, showDescription = true }) {
  const hasTxData = stats && stats.txCount > 0;

  // Get the image source
  const getIconSrc = () => {
    if (!app.icon) return null;

    if (typeof app.icon === 'string') {
      return app.icon;
    }

    if (typeof app.icon === 'object') {
      return app.icon.default || app.icon.src || null;
    }

    return null;
  };

  const rawIconSrc = getIconSrc();
  const iconSrc = useBaseUrl(rawIconSrc || '');
  const initial = app.title.charAt(0).toUpperCase();
  
  const visibleTags = showTags ? getAppAxes(app) : [];

  return (
    <a 
      href={safeUrl(app.website)}
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.appListItem}
    >
      <div className={styles.iconContainer}>
        {rawIconSrc ? (
          <img src={iconSrc} alt={app.title} className={styles.appIcon} />
        ) : (
          <div className={styles.appInitial}>{initial}</div>
        )}
      </div>
      <div className={styles.appContent}>
        <h4 className={styles.appTitle}>{app.title}</h4>
        {showDescription && <p className={styles.appDescription}>{app.description}</p>}
        {showTags && visibleTags.length > 0 && (
          <ul className={styles.tagList}>
            {visibleTags.map((tag, index) => {
              const tagInfo = Tags[tag];
              if (!tagInfo) return null;
              return (
                <li key={index} className={styles.tag} title={tagInfo.description}>
                  <span className={styles.textLabel}>{tagInfo.label.toLowerCase()}</span>
                  <span className={styles.colorLabel} style={{ backgroundColor: tagInfo.color }} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {showTxCount && hasTxData && (
        <div className={styles.txCount}>
          <div className={styles.txNumber}>{formatTxCount(stats.txCount)}</div>
          <div className={styles.txLabel}>transactions</div>
        </div>
      )}
    </a>
  );
}

export default function AppList({ categories = [], beginnerFriendly = false, slugs = null, limit = 5, categoryTitle = "Apps", showTxCount = false, hideHeader = false, showTags = false, showDescription = true }) {
  // Explicit slug list (used by curated Collections) bypasses category/beginner filtering
  // and preserves the curator's chosen order.
  const isExplicit = Array.isArray(slugs) && slugs.length > 0;

  let filteredApps = isExplicit
    ? slugs
        .map((slug) => {
          const found = Showcases.find((app) => app.slug === slug);
          if (!found && process.env.NODE_ENV !== 'production') {
            console.warn(`[AppList] Unknown slug "${slug}" — no matching app in Showcases.`);
          }
          return found;
        })
        .filter(Boolean)
    : Showcases.filter((app) => {
        if (categories.length > 0 && !categories.includes(app.category)) return false;
        if (beginnerFriendly && !app.beginnerFriendly) return false;
        return true;
      });

  const appsWithStats = filteredApps.map(app => {
    const stats = getAppStats(app);
    return {
      app,
      stats,
      hasTxData: !!stats?.txCount,
      isFavorite: app.maintainerPick || false,
    };
  });

  if (!isExplicit) {
    // Default sort: tx-data first (by count), then maintainer picks, then alphabetical.
    // Curated lists keep the order they were authored in.
    appsWithStats.sort((a, b) => {
      if (a.hasTxData && !b.hasTxData) return -1;
      if (!a.hasTxData && b.hasTxData) return 1;
      if (a.hasTxData && b.hasTxData) {
        return (b.stats?.txCount || 0) - (a.stats?.txCount || 0);
      }
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.app.title.localeCompare(b.app.title);
    });
  }

  const displayedApps = limit ? appsWithStats.slice(0, limit) : appsWithStats;

  const seeAllUrl = isExplicit
    ? null
    : categories.length > 1
    ? `/apps?${categories.map((c) => `tags=${c}`).join('&')}&operator=OR`
    : categories.length === 1
    ? `/apps?tags=${categories[0]}`
    : '/apps';

  return (
    <div className={styles.appList}>
      {!hideHeader && (
        <div className={styles.header}>
          <div className={styles.categoryIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
            </svg>
          </div>
          <h3 className={styles.categoryTitle}>{categoryTitle}</h3>
          {seeAllUrl && (
            <Link to={seeAllUrl} className={styles.seeAllButton}>
              See all
            </Link>
          )}
        </div>
      )}

      <div className={styles.listContainer}>
        {displayedApps.map(({ app, stats }) => (
          <AppListItem key={app.title} app={app} stats={stats} showTxCount={showTxCount} showTags={showTags} showDescription={showDescription} />
        ))}
      </div>
    </div>
  );
}
