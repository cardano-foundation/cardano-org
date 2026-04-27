import appStatsData from "@site/src/data/tx-stats.json";
import { Tags } from "@site/src/data/apps";

const TX_BY_LABEL = new Map(
  appStatsData.appStats.map((s) => [s.label, s])
);

export const STATS_GENERATED_AT = appStatsData.metadata?.generated ?? null;

if (process.env.NODE_ENV !== "production") {
  Object.entries(Tags).forEach(([key, def]) => {
    if (typeof def.trackable !== "boolean") {
      // eslint-disable-next-line no-console
      console.warn(`[appStats] Tag "${key}" is missing the 'trackable' boolean field`);
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
    return TX_BY_LABEL.get(app.statsLabel) || null;
  }
  return TX_BY_LABEL.get(normalizeTitle(app.title)) || null;
}

export function getTxCount(app) {
  return getAppStats(app)?.txCount ?? 0;
}

export function isTrackable(app) {
  return app.tags?.some((t) => Tags[t]?.trackable) ?? false;
}

export function formatTxCount(num) {
  return num.toLocaleString("en-US");
}

export function formatTxCountCompact(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
}
