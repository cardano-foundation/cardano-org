import React, { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "@docusaurus/router";
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

const INTENTS = [
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

function arraysEqualUnordered(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

export default function IntentChips() {
  const location = useLocation();
  const history = useHistory();

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
      aria-labelledby="apps-intent-title"
    >
      <div className="container">
        <h2 id="apps-intent-title" className={styles.intentTitle}>
          {translate({ id: "apps.intent.label", message: "I want to" })}
        </h2>
        <ul className={styles.intentList}>
          {INTENTS.map((intent) => {
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
