import React, { memo } from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";

import { Categories, Properties } from "@site/src/data/apps";
import {
  getAppStats,
  isTrackable,
  formatTxCountCompact,
  getAppBlurb,
} from "@site/src/utils/appStats";
import { getHeading } from "@site/src/utils/heading";
import AppIcon from "@site/src/components/AppIcon";

import styles from "./styles.module.css";

const ACTIVITY_UNIT = translate({
  id: "apps.activity.unit",
  message: "tx",
});

/**
 * App card linking to its detail page, with icon, blurb, activity and category.
 *
 * @param {object} props
 * @param {object} props.app App entry from the showcase data.
 * @param {React.ReactNode} [props.badge=null] Badge shown next to the icon, e.g. StarBadge or RankBadge.
 * @param {boolean} [props.showProperties=true] Shows up to two property tags. Turn off where extra tags are noise, e.g. on the homepage.
 * @param {number} [props.headingLevel=3] Heading level of the title. The look stays the same.
 * @param {string} [props.className] Extra class on the card.
 */
function AppTile({ app, badge = null, showProperties = true, headingLevel, className }) {
  const { Tag, lookClassName } = getHeading(headingLevel, 3);
  const categoryDef = Categories[app.category];
  const stats = isTrackable(app) ? getAppStats(app) : null;
  const showActivity = stats && stats.txCount > 0;

  return (
    <Link to={`/apps/${app.slug}`} className={clsx(styles.tile, className)}>
      <div className={styles.header}>
        <AppIcon app={app} size="tile" />
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>
      <Tag className={clsx(styles.title, lookClassName)}>{app.title}</Tag>
      <p className={styles.description}>{getAppBlurb(app)}</p>
      <div className={styles.meta}>
        {showActivity && (
          <span className={styles.activity}>
            {formatTxCountCompact(stats.txCount)} {ACTIVITY_UNIT}
          </span>
        )}
        {categoryDef && (
          <span className={styles.category}>{categoryDef.label}</span>
        )}
        {showProperties && app.properties.slice(0, 2).map((p) => {
          const def = Properties[p];
          if (!def) return null;
          return (
            <span key={p} className={styles.property}>
              {def.label}
            </span>
          );
        })}
      </div>
    </Link>
  );
}

export default memo(AppTile);

/**
 * Star badge marking a maintainer pick. Takes no props.
 */
export function StarBadge() {
  return (
    <span className={clsx(styles.starBadge)} aria-label={translate({ id: "apps.detail.maintainerPick", message: "Maintainer pick" })}>
      ★
    </span>
  );
}

/**
 * Rank badge showing "#rank".
 *
 * @param {object} props
 * @param {number} props.rank Rank to display.
 */
export function RankBadge({ rank }) {
  return (
    <span className={clsx(styles.rankBadge)} aria-label={translate({ id: "apps.rankBadge", message: "Rank {rank}" }, { rank })}>
      #{rank}
    </span>
  );
}
