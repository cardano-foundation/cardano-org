import React, { useMemo } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import worldOutline from "@site/src/data/worldOutline.json";
import centroids from "@site/src/data/countryCentroids.json";
import { project, VIEW_W } from "@site/src/utils/mapProjection";
import styles from "./styles.module.css";

// Stake pool bubble map for the network distribution section of the
// /sustainability page. Draws the shared world outline
// (src/data/worldOutline.json) and one bubble per country, placed at the
// country centroid and sized by its stake pool count. Bubble fills use the
// five-step ramp defined on the NetworkDistribution root class (see
// styles.module.css), so the map, the legend, and the table swatches share
// one scale.
//
// Bubbles are keyboard focusable and report hover / focus to the parent
// through onActiveChange, so the table row for the same country highlights
// in sync. The Figma map slot is an empty placeholder; a bubble map on the
// existing outline is the agreed interim until a choropleth asset exists.
//
// Props:
//   rows           - [{ code, name, pools }]: ISO 3166-1 alpha-2 code, translated
//                    country name, and block-producing pool count
//   activeCode     - code of the highlighted country, or null
//   onActiveChange - called with a code on hover / focus and with null on leave / blur
//   ariaLabel      - accessible name for the map

// The shared projection is 1000 x 500 and includes both poles. Crop to the
// inhabited band so the map sits closer to the 700 x 300 slot in the design.
const CROP_TOP = 20;
const CROP_HEIGHT = 420;
const MIN_RADIUS = 7;
const MAX_RADIUS = 30;
const RADIUS_SCALE = 1.25;

// Bucket a pool count onto the five-step ramp (1 = fewest, 5 = most).
export function poolBucket(pools) {
  if (pools >= 500) return 5;
  if (pools >= 200) return 4;
  if (pools >= 50) return 3;
  if (pools >= 30) return 2;
  return 1;
}

function bubbleRadius(pools) {
  return Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, Math.sqrt(pools) * RADIUS_SCALE));
}

// The outline never changes, so build the land paths once at module scope.
const POLYGON_PATHS = worldOutline.map((ring) => {
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    const [x, y] = project(lon, lat);
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
  }
  return d + "Z";
});

export default function StakePoolMap({ rows, activeCode, onActiveChange, ariaLabel }) {
  // Largest bubbles render first so smaller ones stay reachable on top of them.
  const bubbles = useMemo(
    () =>
      rows
        .filter((row) => Array.isArray(centroids[row.code]))
        .map((row) => {
          const [lon, lat] = centroids[row.code];
          const [x, y] = project(lon, lat);
          return { ...row, x, y, r: bubbleRadius(row.pools), bucket: poolBucket(row.pools) };
        })
        .sort((a, b) => b.pools - a.pools),
    [rows],
  );

  return (
    <div className={styles.mapWrap} role="group" aria-label={ariaLabel}>
      <svg
        viewBox={`0 ${CROP_TOP} ${VIEW_W} ${CROP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className={styles.mapSvg}
      >
        <g className={styles.landGroup}>
          {POLYGON_PATHS.map((d, i) => (
            <path key={i} d={d} className={styles.land} />
          ))}
        </g>
        {bubbles.map((bubble) => (
          <g
            key={bubble.code}
            className={styles.bubbleGroup}
            tabIndex={0}
            onMouseEnter={() => onActiveChange(bubble.code)}
            onMouseLeave={() => onActiveChange(null)}
            onFocus={() => onActiveChange(bubble.code)}
            onBlur={() => onActiveChange(null)}
          >
            <title>
              {translate(
                { id: "sustainability.network.bubbleTitle", message: "{name}: {pools} pools" },
                { name: bubble.name, pools: bubble.pools },
              )}
            </title>
            <circle
              cx={bubble.x}
              cy={bubble.y}
              r={bubble.r}
              className={clsx(
                styles.bubble,
                styles[`bucket${bubble.bucket}`],
                activeCode === bubble.code && styles.bubbleActive,
              )}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
