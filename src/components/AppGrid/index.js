import React from "react";
import { Showcases } from "@site/src/data/apps";
import appStats from "@site/src/data/tx-stats.json";
import styles from "./styles.module.css";

// Helper function to format numbers with commas
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

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

function AppCard({ app, stats, appRank, ctaText }) {
  const hasStats = stats && stats.txCount > 0;
  const showRank = appRank !== null && appRank !== undefined;
  const isTop3 = showRank && appRank <= 3;

  // Get the image source, handling both require() objects and string URLs
  const getIconSrc = () => {
    if (!app.icon) return null;

    // Handle string URLs (for SVGs in static directory)
    if (typeof app.icon === 'string') {
      return app.icon;
    }

    // Handle require() objects (for PNG/WebP in src directory)
    if (typeof app.icon === 'object') {
      return app.icon.default || app.icon.src || null;
    }

    return null;
  };

  const iconSrc = getIconSrc();

  // Get initial letter for fallback
  const initial = app.title.charAt(0).toUpperCase();

  return (
    <div className={styles.appCard}>
      <div className={styles.appHeader}>
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={app.title}
            className={styles.appLogo}
          />
        ) : (
          <div className={styles.appLogoPlaceholder}>
            {initial}
          </div>
        )}
        <h4 className={styles.appName}>{app.title}</h4>
      </div>

      {app.description && (
        <p className={styles.appDescription}>
          {app.description}
        </p>
      )}

      {hasStats && (
        <div className={styles.statsContainer}>
          <svg className={styles.statsIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v8H3v-8zm4-6h2v14H7V7zm4-4h2v18h-2V3zm4 9h2v9h-2v-9zm4-5h2v14h-2V7z"/>
          </svg>
          <div className={styles.statsText}>
            <span className={styles.statsLabel}>Last 30 days</span>
            <span className={styles.statsValue}>{formatNumber(stats.txCount)} tx</span>
          </div>
          {showRank && (
            <div className={`${styles.rankBadge} ${isTop3 ? styles.top3 : ''}`}>
              #{appRank}
            </div>
          )}
        </div>
      )}

      <a
        href={app.website}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.appLink}
      >
        {ctaText}
      </a>
    </div>
  );
}

export default function AppGrid({
  tags = ['dex'],
  limit = null,
  showRank = true,
  showStats = true,
  gridTitle = null,
  ctaText = "Visit",
  moreLink = null,
  moreTitle = "More Apps"
}) {
  // Filter apps that have ANY of the specified tags
  const filteredApps = Showcases.filter(app =>
    tags.some(tag => app.tags.includes(tag))
  );

  // Sort by transaction count (highest first), then alphabetically
  const sortedApps = filteredApps.sort((a, b) => {
    const statsA = getAppStats(a);
    const statsB = getAppStats(b);

    const txA = statsA?.txCount || 0;
    const txB = statsB?.txCount || 0;

    if (txA !== txB) {
      return txB - txA; // Descending order
    }

    return a.title.localeCompare(b.title);
  });

  // Calculate category-specific ranks
  const appsWithRank = sortedApps.map((app, index) => ({
    app,
    stats: getAppStats(app),
    appRank: index + 1 // Category-specific rank (1-based)
  }));

  // Apply limit if specified
  const displayedApps = limit ? appsWithRank.slice(0, limit) : appsWithRank;
  const hasMore = limit && appsWithRank.length > limit;

  // Generate default more link if not provided
  const defaultMoreLink = `/apps?tags=${tags.join(',')}`;
  const finalMoreLink = moreLink || defaultMoreLink;

  // Generate tag label for display
  const tagLabel = tags.length === 1
    ? tags[0].toUpperCase()
    : 'apps';

  if (filteredApps.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.noData}>No applications found with the specified tags.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {gridTitle && <h3 className={styles.gridTitle}>{gridTitle}</h3>}
      <div className={styles.appGrid}>
        {displayedApps.map(({ app, stats, appRank }) => {
          return (
            <AppCard
              key={app.title}
              app={app}
              stats={showStats ? stats : null}
              appRank={showRank ? appRank : null}
              ctaText={ctaText}
            />
          );
        })}
        {hasMore && (
          <a href={finalMoreLink} className={styles.moreAppCard}>
            <div className={styles.moreAppContent}>
              <svg className={styles.moreAppIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <h4 className={styles.moreAppTitle}>{moreTitle}</h4>
              <p className={styles.moreAppDescription}>
                Explore {appsWithRank.length - limit} more {tagLabel === 'apps' ? 'apps' : tagLabel + 's'}
              </p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
