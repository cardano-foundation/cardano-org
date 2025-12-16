import React from "react";
import Link from "@docusaurus/Link";
import { Showcases, Tags } from "@site/src/data/apps";
import appStats from "@site/src/data/app-stats.json";
import styles from "./styles.module.css";

// Helper function to find app stats by label
function getAppStats(app) {
  // Use explicit statsLabel if provided
  if (app.statsLabel) {
    return appStats.appStats.find(stat => stat.label === app.statsLabel);
  }
  
  // Fallback: try exact match with normalized title
  const normalized = app.title.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/dex$/i, '')
    .trim();
  
  return appStats.appStats.find(stat => stat.label === normalized);
}

// Helper function to format numbers with commas
function formatTxCount(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString('en-US');
}

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
  
  const iconSrc = getIconSrc();
  const initial = app.title.charAt(0).toUpperCase();
  
  // Filter out 'favorite' tag if showing tags
  const visibleTags = showTags 
    ? app.tags.filter(tag => tag !== 'favorite')
    : [];

  return (
    <a 
      href={app.website} 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.appListItem}
    >
      <div className={styles.iconContainer}>
        {iconSrc ? (
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

export default function AppList({ tags = [], limit = 5, categoryTitle = "Apps", showTxCount = false, hideHeader = false, showTags = false, showDescription = true }) {
  // Filter apps by tags
  let filteredApps = Showcases.filter(app => 
    tags.length === 0 || tags.some(tag => app.tags.includes(tag))
  );

  // Attach stats and sort
  const appsWithStats = filteredApps.map(app => ({
    app,
    stats: getAppStats(app),
    hasTxData: !!getAppStats(app)?.txCount,
    isFavorite: app.tags?.includes('favorite') || false
  }));

  // Sort: Apps with tx data first (by count), then favorites, then alphabetically
  appsWithStats.sort((a, b) => {
    // First priority: apps with transaction data
    if (a.hasTxData && !b.hasTxData) return -1;
    if (!a.hasTxData && b.hasTxData) return 1;
    
    // If both have tx data, sort by count descending
    if (a.hasTxData && b.hasTxData) {
      return (b.stats?.txCount || 0) - (a.stats?.txCount || 0);
    }
    
    // Second priority: favorites (among apps without tx data)
    if (!a.hasTxData && !b.hasTxData) {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
    }
    
    // Final: alphabetical
    return a.app.title.localeCompare(b.app.title);
  });

  // Limit the results
  const displayedApps = limit ? appsWithStats.slice(0, limit) : appsWithStats;
  const hasMore = limit && appsWithStats.length > limit;

  // Build the "See all" link
  const seeAllUrl = tags.length > 1 
    ? `/apps?${tags.map(tag => `tags=${tag}`).join('&')}&operator=OR`
    : tags.length === 1
    ? `/apps?tags=${tags[0]}`
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
          <Link to={seeAllUrl} className={styles.seeAllButton}>
            See all
          </Link>
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
