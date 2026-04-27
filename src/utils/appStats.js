import appStatsData from "@site/src/data/tx-stats.json";

const TX_BY_LABEL = new Map(
  appStatsData.appStats.map((s) => [s.label, s])
);

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

export function formatTxCount(num) {
  return num.toLocaleString("en-US");
}
