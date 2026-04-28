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
} from "@site/src/utils/appStats";
import AppIcon from "@site/src/components/AppIcon";

import styles from "./styles.module.css";

const ACTIVITY_UNIT = translate({
  id: "apps.activity.unit",
  message: "tx",
});
const NEW_LABEL = translate({ id: "apps.new", message: "NEW" });

// Compact list-row for the "All apps" section. Smaller icon, tighter layout, includes
// a NEW badge for recent submissions and a green dot when stats are tracked.
function AppRow({ app }) {
  const stats = isTrackable(app) ? getAppStats(app) : null;
  const showActivity = stats && stats.txCount > 0;
  const categoryDef = Categories[app.category];
  const recent = isRecent(app);

  return (
    <Link to={`/apps/${app.slug}`} className={styles.row}>
      <AppIcon app={app} size="row" className={styles.icon} />
      <div className={styles.content}>
        <h4 className={styles.title}>
          {app.title}
          {showActivity && <span className={clsx(styles.dot)} aria-hidden />}
          {recent && <span className={styles.newBadge}>{NEW_LABEL}</span>}
        </h4>
        {(app.tagline || app.description) && (
          <p className={styles.description}>{app.tagline || app.description}</p>
        )}
      </div>
      <div className={styles.metaRight}>
        {showActivity && (
          <span className={styles.activity}>
            {formatTxCountCompact(stats.txCount)} {ACTIVITY_UNIT}
          </span>
        )}
        {categoryDef && (
          <span className={styles.category}>{categoryDef.label}</span>
        )}
      </div>
    </Link>
  );
}

export default memo(AppRow);
