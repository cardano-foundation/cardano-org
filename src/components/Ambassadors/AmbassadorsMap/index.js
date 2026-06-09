import React, { useMemo, useState } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import worldOutline from "@site/src/data/worldOutline.json";
import AmbassadorAvatar from "@site/src/components/Ambassadors/AmbassadorAvatar";
import { ambassadorHref } from "@site/src/utils/ambassadorSlug";
import { project, VIEW_W, VIEW_H } from "@site/src/utils/mapProjection";
import styles from "./styles.module.css";

const CARD_CLAMP_MIN_X = 200;
const CARD_CLAMP_MAX_X = 800;
const CARD_TOP_OFFSET_Y = 50;
const LINE_GAP_Y = 8;

function cardAnchor(country, centroids) {
  if (!country || !centroids[country]) return null;
  const [lon, lat] = centroids[country];
  const [px, py] = project(lon, lat);
  const cx = Math.max(CARD_CLAMP_MIN_X, Math.min(CARD_CLAMP_MAX_X, px));
  const cy = Math.min(VIEW_H - 20, py + CARD_TOP_OFFSET_Y - LINE_GAP_Y);
  return { px, py, cx, cy };
}

const POLYGON_PATHS = worldOutline.map((ring) => {
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    const [x, y] = project(lon, lat);
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
  }
  return d + "Z";
});

function PinTooltip({ entry }) {
  // Position the tooltip as percent of the viewBox so it tracks SVG layout when the
  // container resizes. Right anchor prevents overflow at the right edge of the world.
  const xPct = (entry.x / VIEW_W) * 100;
  const yPct = (entry.y / VIEW_H) * 100;
  const anchorRight = xPct > 70;
  const anchorBottom = yPct > 60;

  const style = {
    left: anchorRight ? "auto" : `calc(${xPct}% + 14px)`,
    right: anchorRight ? `calc(${100 - xPct}% + 14px)` : "auto",
    top: anchorBottom ? "auto" : `calc(${yPct}% - 8px)`,
    bottom: anchorBottom ? `calc(${100 - yPct}% - 8px)` : "auto",
  };

  return (
    <div className={styles.tooltip} style={style}>
      <div className={styles.tooltipHead}>
        <span className={styles.tooltipCountry}>{entry.role}</span>
        <span className={styles.tooltipCount}>
          {translate(
            { id: "ambassadors.map.countLabel", message: "{n} Ambassadors" },
            { n: entry.ambassadors.length }
          )}
        </span>
      </div>
      <ul className={styles.tooltipList}>
        {entry.ambassadors.map((a) => (
          <li key={a.name + a.country}>
            <Link to={ambassadorHref(a.name)} className={styles.tooltipItem}>
              <AmbassadorAvatar ambassador={a} className={styles.tooltipAvatar} />
              <span className={styles.tooltipName}>{a.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AmbassadorsMap({ ambassadors, centroids, activeCountry, connectorHidden = false }) {
  const [hovered, setHovered] = useState(null);
  const connector = cardAnchor(activeCountry, centroids);

  const pins = useMemo(() => {
    const byCountry = new Map();
    ambassadors.forEach((a) => {
      if (!byCountry.has(a.country)) {
        byCountry.set(a.country, { code: a.country, role: a.role, ambassadors: [] });
      }
      byCountry.get(a.country).ambassadors.push(a);
    });
    const list = [];
    byCountry.forEach((entry) => {
      const c = centroids[entry.code];
      if (!c) return;
      const [x, y] = project(c[0], c[1]);
      // Sort ambassadors alphabetically for the tooltip list.
      entry.ambassadors.sort((a, b) => a.name.localeCompare(b.name));
      list.push({ ...entry, x, y });
    });
    return list;
  }, [ambassadors, centroids]);

  const hoveredEntry = pins.find((p) => p.code === hovered);

  return (
    <div
      className={styles.mapWrap}
      role="img"
      aria-label={translate({
        id: "ambassadors.map.aria",
        message: "World map showing Cardano Ambassadors across countries",
      })}
      onMouseLeave={() => setHovered(null)}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className={styles.mapSvg}
      >
        <defs>
          <pattern id="ambLandDots" x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="1.6" cy="1.6" r="1.1" className={styles.landDot} />
          </pattern>
          <radialGradient id="ambPinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6688" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ff6688" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className={styles.continents}>
          {POLYGON_PATHS.map((d, i) => (
            <path key={i} d={d} className={styles.land} />
          ))}
        </g>

        {connector && (
          <line
            x1={connector.px}
            y1={connector.py}
            x2={connector.cx}
            y2={connector.cy}
            className={`${styles.connector} ${connectorHidden ? styles.connectorHidden : ""}`}
          />
        )}

        {pins.map((p) => {
          const isHovered = hovered === p.code;
          const count = p.ambassadors.length;
          const r = Math.min(4 + count * 1.6, 16);
          return (
            <g
              key={p.code}
              transform={`translate(${p.x},${p.y})`}
              className={`${styles.pinGroup} ${isHovered ? styles.pinHovered : ""}`}
              onMouseEnter={() => setHovered(p.code)}
              onClick={() => setHovered(p.code)}
            >
              <circle r={r * 3} fill="url(#ambPinGlow)" className={styles.pinGlow} />
              <circle r={r + 4} className={styles.pinHit} />
              <circle r={r} className={styles.pin} />
              <circle r={Math.max(r - 2.5, 1.5)} className={styles.pinInner} />
              {count >= 4 && (
                <text textAnchor="middle" y="3.5" className={styles.pinCount}>
                  {count}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hoveredEntry && <PinTooltip entry={hoveredEntry} />}
    </div>
  );
}

export default React.memo(AmbassadorsMap);
