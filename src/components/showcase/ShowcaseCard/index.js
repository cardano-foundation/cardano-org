/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { memo, forwardRef } from "react";
import clsx from "clsx";
import Image from "@theme/IdealImage";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";
import Tooltip from "../ShowcaseTooltip/index";
import { Tags as ShowcaseTags } from "../../../data/apps";
import {
  getAppStats,
  isTrackable,
  formatTxCountCompact,
  getAppAxes,
} from "@site/src/utils/appStats";
import Fav from "../../../svg/fav.svg";

const ACTIVITY_UNIT = translate({id: 'apps.card.activity.unit', message: 'tx · 30d'});
const ACTIVITY_TOOLTIP = translate({
  id: 'apps.card.activity.tooltip',
  message: 'Transactions in the last 30 days',
});
const GET_STARTED_LABEL = translate({id: 'apps.card.getStarted', message: 'Get Started'});
const SOURCE_LABEL = translate({id: 'apps.card.source', message: 'Source'});

const TagComp = forwardRef(({ label, color, description }, ref) => (
  <li className={styles.tag} title={description}>
    <span className={styles.textLabel}>{label.toLowerCase()}</span>
    <span className={styles.colorLabel} style={{ backgroundColor: color }} />
  </li>
));

function ShowcaseCardTag({ tags }) {
  const tagObjects = tags.map((tag) => ({ tag, ...ShowcaseTags[tag] }));

  return (
    <>
      {tagObjects.map((tagObject, index) => {
        const id = `showcase_card_tag_${tagObject.tag}`;

        return (
          <Tooltip
            key={index}
            text={tagObject.description}
            anchorEl="#__docusaurus"
            id={id}
          >
            <TagComp key={index} {...tagObject} />
          </Tooltip>
        );
      })}
    </>
  );
}

const ShowcaseCard = memo((card) => {
  const stats = isTrackable(card.showcase) ? getAppStats(card.showcase) : null;
  const showActivity = stats && stats.txCount > 0;

  return (
    <li className="card shadow--md">
      <div className={clsx("card__image", styles.showcaseCardImage)}>
        <Image img={card.showcase.preview} alt={card.showcase.title} />
      </div>
      <div className="card__body">
        <div className={clsx(styles.showcaseCardHeader)}>
          <h4 className={styles.showcaseCardTitle}>
            <Link href={card.showcase.website}>{card.showcase.title}</Link>
          </h4>
          {card.showcase.maintainerPick && (
            <Fav className={styles.svgIconFavorite} size="small" />
          )}
          {card.showcase.getstarted && (
            <Link
              href={card.showcase.getstarted}
              className={clsx(
                "button button--secondary button--sm",
                styles.showcaseCardSrcBtn
              )}
            >
              {GET_STARTED_LABEL}
            </Link>
          )}
          {card.showcase.source && (
            <Link
              href={card.showcase.source}
              className={clsx(
                "button button--secondary button--sm",
                styles.showcaseCardSrcBtn
              )}
            >
              {SOURCE_LABEL}
            </Link>
          )}
        </div>
        {showActivity && (
          <span className={styles.activityBadge} title={ACTIVITY_TOOLTIP}>
            {formatTxCountCompact(stats.txCount)} {ACTIVITY_UNIT}
          </span>
        )}
        <p className={styles.showcaseCardBody}>{card.showcase.description}</p>
      </div>
      <ul className={clsx("card__footer", styles.cardFooter)}>
        <ShowcaseCardTag tags={getAppAxes(card.showcase)} />
      </ul>
    </li>
  );
});

export default ShowcaseCard;
