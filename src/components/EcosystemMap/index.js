import React, { useMemo, useRef, useCallback, useState } from "react";
import { toPng } from "html-to-image";
import { Showcases } from "@site/src/data/apps";
import { EcosystemGroups } from "@site/src/data/ecosystem-categories";
import appStats from "@site/src/data/tx-stats.json";
import styles from "./styles.module.css";

// Meta tags that should not be used for grouping
const META_TAGS = new Set([
  "favorite",
  "goodForBeginners",
  "opensource",
  "mobile",
]);

// Build a fast lookup: tag → group key
function buildTagToGroupMap() {
  const map = {};
  for (const group of EcosystemGroups) {
    for (const tag of group.tags) {
      map[tag] = group.key;
    }
  }
  return map;
}

// Tag labels from apps.js Tags — import lazily to avoid circular deps
// We'll derive labels from the tag key itself as a simple fallback
function tagLabel(tag) {
  return tag
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function getIconSrc(app) {
  if (!app.icon) return null;
  if (typeof app.icon === "string") return app.icon;
  if (typeof app.icon === "object") return app.icon.default || app.icon.src || null;
  return null;
}

function getAppStats(app) {
  if (app.statsLabel) {
    return appStats.appStats.find((s) => s.label === app.statsLabel);
  }
  const normalized = app.title
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/dex$/i, "")
    .trim();
  return appStats.appStats.find((s) => s.label === normalized);
}

// Deterministic color from string
function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 45%, 40%)`;
}

export default function EcosystemMap() {
  const posterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const { groupedData, totalApps } = useMemo(() => {
    const tagToGroup = buildTagToGroupMap();
    const assigned = new Set();

    // Structure: { groupKey: { tag: [app, ...] } }
    const groups = {};
    for (const g of EcosystemGroups) {
      groups[g.key] = {};
    }
    groups["other"] = {};

    for (const app of Showcases) {
      if (assigned.has(app.title)) continue;

      const nonMetaTags = (app.tags || []).filter((t) => !META_TAGS.has(t));
      let placed = false;

      for (const tag of nonMetaTags) {
        const groupKey = tagToGroup[tag];
        if (groupKey) {
          if (!groups[groupKey][tag]) groups[groupKey][tag] = [];
          groups[groupKey][tag].push(app);
          assigned.add(app.title);
          placed = true;
          break;
        }
      }

      if (!placed) {
        const fallbackTag = nonMetaTags[0] || "uncategorized";
        if (!groups["other"][fallbackTag]) groups["other"][fallbackTag] = [];
        groups["other"][fallbackTag].push(app);
        assigned.add(app.title);
      }
    }

    // Sort apps within each sub-category
    for (const groupKey of Object.keys(groups)) {
      for (const tag of Object.keys(groups[groupKey])) {
        groups[groupKey][tag].sort((a, b) => {
          const statsA = getAppStats(a);
          const statsB = getAppStats(b);
          const txA = statsA?.txCount || 0;
          const txB = statsB?.txCount || 0;

          // Tracked apps first (by tx count desc)
          if (txA > 0 && txB > 0) return txB - txA;
          if (txA > 0) return -1;
          if (txB > 0) return 1;
          // Then alphabetically
          return a.title.localeCompare(b.title);
        });
      }
    }

    return { groupedData: groups, totalApps: assigned.size };
  }, []);

  const downloadPng = useCallback(() => {
    if (!posterRef.current || downloading) return;
    setDownloading(true);

    toPng(posterRef.current, {
      backgroundColor: "#1b1b1d",
      pixelRatio: 2,
      filter: (node) => {
        return !node.classList || !node.classList.contains(styles.downloadButton);
      },
    })
      .then((dataUrl) => {
        const today = new Date().toISOString().slice(0, 10);
        const link = document.createElement("a");
        link.download = `cardano-ecosystem-map-${today}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => console.error("PNG export failed:", err))
      .finally(() => setDownloading(false));
  }, [downloading]);

  // Build group configs including "Other" if needed
  const allGroups = useMemo(() => {
    const result = EcosystemGroups.map((g) => ({
      ...g,
      tags: Object.keys(groupedData[g.key] || {}),
      data: groupedData[g.key] || {},
    })).filter((g) => g.tags.length > 0);

    const otherTags = Object.keys(groupedData["other"] || {});
    if (otherTags.length > 0) {
      result.push({
        key: "other",
        label: "Other",
        color: "#757575",
        tags: otherTags,
        data: groupedData["other"],
      });
    }

    return result;
  }, [groupedData]);

  // Split groups into two columns for poster layout
  const LEFT_KEYS = new Set(["defi", "consumer"]);
  const { leftGroups, rightGroups } = useMemo(() => {
    const left = [];
    const right = [];
    for (const g of allGroups) {
      if (LEFT_KEYS.has(g.key)) {
        left.push(g);
      } else {
        right.push(g);
      }
    }
    return { leftGroups: left, rightGroups: right };
  }, [allGroups]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.posterScroll}>
        <div className={styles.poster} ref={posterRef}>
          {/* Header */}
          <div className={styles.header}>
            <img
              src="/img/cardano-logo-white.svg"
              alt="Cardano"
              className={styles.logo}
            />
            <h1 className={styles.title}>Cardano Ecosystem</h1>
            <span className={styles.count}>{totalApps} apps</span>
          </div>

          {/* Category sections — 2-column layout */}
          <div className={styles.categoriesGrid}>
            {[leftGroups, rightGroups].map((column, colIdx) => (
              <div key={colIdx} className={styles.column}>
                {column.map((group) => (
                  <div
                    key={group.key}
                    className={styles.categorySection}
                    style={{ "--cat-color": group.color }}
                  >
                    <h2 className={styles.categoryHeader}>{group.label}</h2>
                    {group.tags.map((tag) => (
                      <div key={tag} className={styles.subCategoryRow}>
                        <span className={styles.subCategoryLabel}>
                          {tagLabel(tag)}
                        </span>
                        {group.data[tag].map((app) => {
                          const iconSrc = getIconSrc(app);
                          const initial = app.title.charAt(0).toUpperCase();
                          return (
                            <span key={app.title} className={styles.appTile}>
                              {iconSrc ? (
                                <img
                                  src={iconSrc}
                                  alt=""
                                  className={styles.appIcon}
                                />
                              ) : (
                                <span
                                  className={styles.firstLetterFallback}
                                  style={{ background: hashColor(app.title) }}
                                >
                                  {initial}
                                </span>
                              )}
                              <span className={styles.appName}>{app.title}</span>
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={styles.footerDate}>
              Data as of {new Date().toISOString().slice(0, 10)}
            </span>
            <span className={styles.footerSite}>cardano.org</span>
          </div>
        </div>
      </div>

      <button
        className={`button button--primary ${styles.downloadButton}`}
        onClick={downloadPng}
        disabled={downloading}
      >
        {downloading ? "Downloading..." : "Download PNG"}
      </button>
    </div>
  );
}
