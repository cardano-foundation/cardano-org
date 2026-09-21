import React, { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import clsx from "clsx";

import {
  readSearchTags,
  replaceSearchTags,
} from "@site/src/components/showcase/ShowcaseTagSelect";
import {
  SortQueryStringKey,
  SORT_IDS,
} from "@site/src/components/showcase/ShowcaseSort";

import styles from "./styles.module.css";

// Entry intents shared by /apps (filter chips) and the homepage (links into
// the pre-filtered /apps list). Order here is the display order.
export const INTENTS = [
  {
    id: "stake",
    tags: ["pooltool"],
    sort: SORT_IDS.MOST_ACTIVE,
    label: translate({ id: "apps.intent.stake", message: "Stake ada" }),
  },
  {
    id: "trade",
    tags: ["dex"],
    sort: SORT_IDS.MOST_ACTIVE,
    label: translate({ id: "apps.intent.trade", message: "Trade" }),
  },
  {
    id: "vote",
    tags: ["governance"],
    sort: SORT_IDS.MOST_ACTIVE,
    label: translate({ id: "apps.intent.vote", message: "Vote" }),
  },
  {
    id: "mintNfts",
    tags: ["minting"],
    sort: SORT_IDS.MOST_ACTIVE,
    label: translate({ id: "apps.intent.mintNfts", message: "Mint NFTs" }),
  },
  {
    id: "play",
    tags: ["game"],
    sort: SORT_IDS.ALPHABETICAL,
    label: translate({ id: "apps.intent.play", message: "Play" }),
  },
  {
    id: "useWallet",
    tags: ["wallet"],
    sort: SORT_IDS.ALPHABETICAL,
    label: translate({ id: "apps.intent.useWallet", message: "Use a wallet" }),
  },
  {
    id: "build",
    tags: ["opensource"],
    sort: SORT_IDS.ALPHABETICAL,
    label: translate({ id: "apps.intent.build", message: "Build" }),
  },
];

// Query string that opens /apps with the intent's tags and sort applied.
export function intentSearch(intent) {
  const params = new URLSearchParams(replaceSearchTags("", intent.tags));
  if (intent.sort) params.set(SortQueryStringKey, intent.sort);
  return params.toString();
}

function arraysEqualUnordered(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

// On /apps the chips toggle the filter of the current list. With `linkTo`
// (e.g. the homepage) they become plain links into that list instead.
// `ids` limits the rendered chips to a subset of INTENTS.
export default function IntentChips({ ids, linkTo, headingId = "apps-intent-title" }) {
  const location = useLocation();
  const history = useHistory();
  const intents = ids
    ? ids.map((id) => INTENTS.find((i) => i.id === id)).filter(Boolean)
    : INTENTS;

  const activeId = useMemo(() => {
    const currentTags = readSearchTags(location.search);
    const currentSort = new URLSearchParams(location.search).get(
      SortQueryStringKey
    );
    return INTENTS.find(
      (i) =>
        arraysEqualUnordered(currentTags, i.tags) && currentSort === i.sort
    )?.id;
  }, [location.search]);

  const applyIntent = useCallback(
    (intent) => {
      const isActive = intent.id === activeId;
      const search = replaceSearchTags(
        location.search,
        isActive ? [] : intent.tags
      );
      const next = new URLSearchParams(search);
      next.delete(SortQueryStringKey);
      if (!isActive && intent.sort) {
        next.set(SortQueryStringKey, intent.sort);
      }
      history.push({ ...location, search: next.toString() });
    },
    [activeId, location, history]
  );

  return (
    <section
      className={styles.intentSection}
      aria-labelledby={headingId}
    >
      <div className="container">
        <h2 id={headingId} className={styles.intentTitle}>
          {translate({ id: "apps.intent.label", message: "I want to" })}
        </h2>
        <ul className={styles.intentList}>
          {intents.map((intent) => {
            if (linkTo) {
              return (
                <li key={intent.id} className={styles.intentItem}>
                  <Link
                    to={`${linkTo}?${intentSearch(intent)}`}
                    className={styles.intentChip}
                  >
                    {intent.label}
                  </Link>
                </li>
              );
            }
            const isActive = intent.id === activeId;
            return (
              <li key={intent.id} className={styles.intentItem}>
                <button
                  type="button"
                  onClick={() => applyIntent(intent)}
                  className={clsx(styles.intentChip, {
                    [styles.intentChipActive]: isActive,
                  })}
                  aria-pressed={isActive}
                >
                  {intent.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
