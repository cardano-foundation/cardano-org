import React from "react";
import { Showcases } from "@site/src/data/apps";
import appStats from "@site/src/data/app-stats.json";
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

function DexCard({ app, stats, dexRank }) {
  const hasStats = stats && stats.txCount > 0;
  const showRank = dexRank !== null && dexRank !== undefined;
  const isTop3 = showRank && dexRank <= 3;

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
    <div className={styles.dexCard}>
      <div className={styles.dexHeader}>
        {iconSrc ? (
          <img 
            src={iconSrc} 
            alt={app.title} 
            className={styles.dexLogo}
          />
        ) : (
          <div className={styles.dexLogoPlaceholder}>
            {initial}
          </div>
        )}
        <h4 className={styles.dexName}>{app.title}</h4>
      </div>

      {app.description && (
        <p className={styles.dexDescription}>
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
              #{dexRank}
            </div>
          )}
        </div>
      )}

      <a 
        href={app.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.dexLink}
      >
        Visit DEX
      </a>
    </div>
  );
}

export default function DexGrid({ 
  limit = null,
  showRank = true,
  showStats = true,
  gridTitle = null 
}) {
  // Filter apps with 'dex' tag
  const dexApps = Showcases.filter(app => app.tags.includes('dex'));
  
  // Sort by transaction count (highest first), then alphabetically
  const sortedDexApps = dexApps.sort((a, b) => {
    const statsA = getAppStats(a);
    const statsB = getAppStats(b);
    
    const txA = statsA?.txCount || 0;
    const txB = statsB?.txCount || 0;
    
    if (txA !== txB) {
      return txB - txA; // Descending order
    }
    
    return a.title.localeCompare(b.title);
  });

  // Calculate DEX-specific ranks
  const dexAppsWithRank = sortedDexApps.map((app, index) => ({
    app,
    stats: getAppStats(app),
    dexRank: index + 1 // DEX-specific rank (1-based)
  }));

  // Apply limit if specified
  const displayedDexApps = limit ? dexAppsWithRank.slice(0, limit) : dexAppsWithRank;
  const hasMore = limit && dexAppsWithRank.length > limit;

  if (dexApps.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.noData}>No DEX applications found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {gridTitle && <h3 className={styles.gridTitle}>{gridTitle}</h3>}
      <div className={styles.dexGrid}>
        {displayedDexApps.map(({ app, stats, dexRank }) => {
          return <DexCard key={app.title} app={app} stats={showStats ? stats : null} dexRank={showRank ? dexRank : null} />;
        })}
        {hasMore && (
          <a href="/apps?tags=dex" className={styles.moreDexCard}>
            <div className={styles.moreDexContent}>
              <svg className={styles.moreDexIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <h4 className={styles.moreDexTitle}>More DEXes</h4>
              <p className={styles.moreDexDescription}>
                Explore {dexAppsWithRank.length - limit} more decentralized exchanges
              </p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
