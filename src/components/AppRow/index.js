import React, { memo } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import clsx from "clsx";

import { Categories } from "@site/src/data/apps";
import {
  getAppStats,
  isTrackable,
  isRecent,
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
const NEW_LABEL = translate({ id: "apps.new", message: "NEW" });
const PICK_LABEL = translate({ id: "apps.maintainerPick", message: "Maintainer picks" });

/**
 * Single app as a full-width row linking to its detail page.
 *
 * @param {object} props
 * @param {object} props.app App entry from the showcase data.
 * @param {boolean} [props.hideCategory=false] Hides the category label on the right.
 * @param {number} [props.headingLevel=4] Heading level of the title. The look stays the same.
 * @param {string} [props.className] Extra class on the row.
 */
function AppRow({ app, hideCategory = false, headingLevel, className }) {
  const { Tag, lookClassName } = getHeading(headingLevel, 4);
  const stats = isTrackable(app) ? getAppStats(app) : null;
  const showActivity = stats && stats.txCount > 0;
  const categoryDef = Categories[app.category];
  const recent = isRecent(app);

  return (
    <Link to={`/apps/${app.slug}`} className={clsx(styles.row, className)}>
      <AppIcon app={app} size="row" className={styles.icon} />
      <div className={styles.content}>
        <Tag className={clsx(styles.title, lookClassName)}>
          {app.title}
          {app.maintainerPick && (
            <span className={styles.pickStar} aria-label={PICK_LABEL}>
              ★
            </span>
          )}
          {showActivity && <span className={clsx(styles.dot)} aria-hidden />}
          {recent && <span className={styles.newBadge}>{NEW_LABEL}</span>}
        </Tag>
        <p className={styles.description}>{getAppBlurb(app)}</p>
      </div>
      <div className={styles.metaRight}>
        {showActivity && (
          <span className={styles.activity}>
            {formatTxCountCompact(stats.txCount)} {ACTIVITY_UNIT}
          </span>
        )}
        {!hideCategory && categoryDef && (
          <span className={styles.category}>{categoryDef.label}</span>
        )}
      </div>
    </Link>
  );
}

export default memo(AppRow);
