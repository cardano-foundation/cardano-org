import appStatsData from "@site/src/data/tx-stats.json";
import {
  Categories,
  Showcases,
  RECENT_APPS_COUNT,
} from "@site/src/data/apps";

const RECENT_SLUGS = new Set(
  Showcases.slice(-RECENT_APPS_COUNT).map((s) => s.slug)
);

const TX_BY_LABEL = new Map(
  appStatsData.appStats.map((s) => [s.label, s])
);

const TX_BY_METADATA_LABEL = new Map(
  (appStatsData.metadataLabelStats || []).map((s) => [s.label, s])
);

export const STATS_GENERATED_AT = appStatsData.metadata?.generated ?? null;

if (process.env.NODE_ENV !== "production") {
  Object.entries(Categories).forEach(([key, def]) => {
    if (typeof def.trackable !== "boolean") {
      console.warn(`[appStats] Category "${key}" is missing the 'trackable' boolean field`);
    }
  });
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/dex$/i, "")
    .trim();
}

export function getAppStats(app) {
  if (app.statsLabel) {
    const hit = TX_BY_LABEL.get(app.statsLabel);
    if (hit) return hit;
  }
  if (typeof app.metadataLabel === "number") {
    return TX_BY_METADATA_LABEL.get(app.metadataLabel) || null;
  }
  return TX_BY_LABEL.get(normalizeTitle(app.title)) || null;
}

export function getTxCount(app) {
  return getAppStats(app)?.txCount ?? 0;
}

export function compareByTxDesc(a, b) {
  return getTxCount(b) - getTxCount(a);
}

export function isTrackable(app) {
  return Categories[app.category]?.trackable ?? false;
}

export function getAppBlurb(app) {
  return app.tagline || app.description || "";
}

export function isRecent(app) {
  return RECENT_SLUGS.has(app.slug);
}

export function countLiveTracking(apps) {
  return apps.filter((app) => isTrackable(app) && app.statsLabel).length;
}

export function getTopAppPerCategory(apps) {
  const byCategory = new Map();
  for (const app of apps) {
    if (!isTrackable(app)) continue;
    const tx = getTxCount(app);
    if (tx <= 0) continue;
    const current = byCategory.get(app.category);
    if (!current || tx > current.tx) {
      byCategory.set(app.category, { app, tx });
    }
  }
  return [...byCategory.values()]
    .sort((a, b) => b.tx - a.tx)
    .map((entry) => entry.app);
}

export function getAppAxes(app) {
  return [app.category, ...(app.properties || [])];
}

export function appHasTag(app, tag) {
  return app.category === tag || (app.properties || []).includes(tag);
}

export function formatTxCount(num) {
  return num.toLocaleString("en-US");
}

export function formatTxCountCompact(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
}
