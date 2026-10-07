import React, { memo } from "react";
import Link from "@docusaurus/Link";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { translate } from "@docusaurus/Translate";

import AppRow from "@site/src/components/AppRow";
import HorizontalScroller from "@site/src/components/Layout/HorizontalScroller";
import { Categories, Showcases } from "@site/src/data/apps";
import { compareByTxDesc } from "@site/src/utils/appStats";
import { shuffle } from "@site/src/utils/random";

import styles from "./styles.module.css";

// Random rank per app, drawn once per page load in the browser. Ties in the
// sort below fall back to this rank, which gives non-tracked categories
// (Wallet, Explorer, etc.) some freshness on each session start.
let randomRank = null;
function getRandomRank() {
  if (!randomRank) {
    randomRank = new Map(shuffle(Showcases.map((app) => app.slug)).map((slug, i) => [slug, i]));
  }
  return randomRank;
}

function selectPanelApps(category, limit, randomize) {
  // Three-tier sort: tracked tx desc, then maintainer picks, then a tiebreak.
  // The static build and the hydration render use the slug as tiebreak, so both
  // produce the same markup. The random tiebreak only applies after hydration.
  const rank = randomize ? getRandomRank() : null;
  return Showcases
    .filter((app) => app.category === category)
    .sort((a, b) => {
      const txDiff = compareByTxDesc(a, b);
      if (txDiff !== 0) return txDiff;
      if (a.maintainerPick !== b.maintainerPick) return a.maintainerPick ? -1 : 1;
      return rank ? rank.get(a.slug) - rank.get(b.slug) : a.slug.localeCompare(b.slug);
    })
    .slice(0, limit);
}

// Showcases is static at module scope, so each panel's apps are computed once
// to avoid re-running the filter+sort on every parent re-render (every scroll
// event triggers one). Keyed by `${category}:${limit}:${randomize}`.
const PANEL_APPS_CACHE = new Map();
function getPanelApps(category, limit, randomize) {
  const key = `${category}:${limit}:${randomize}`;
  if (!PANEL_APPS_CACHE.has(key)) {
    PANEL_APPS_CACHE.set(key, selectPanelApps(category, limit, randomize));
  }
  return PANEL_APPS_CACHE.get(key);
}

const CategoryPanel = memo(function CategoryPanel({ category, limit }) {
  const isBrowser = useIsBrowser();
  const def = Categories[category];
  if (!def) return null;
  const apps = getPanelApps(category, limit, isBrowser);
  if (apps.length === 0) return null;
  return (
    <article className={styles.panel}>
      <header className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>{def.label}</h3>
        <Link to={`/apps?tags=${category}`} className={styles.seeAll}>
          {translate({ id: "apps.browseByCategory.seeAll", message: "See all" })}
        </Link>
      </header>
      <ul className={styles.panelList}>
        {apps.map((app) => (
          <li key={app.slug}>
            <AppRow app={app} hideCategory />
          </li>
        ))}
      </ul>
    </article>
  );
});

// Thin wrapper over HorizontalScroller: renders category panels at the wider
// panel sizing. All scroll/arrow/dot behavior lives in HorizontalScroller.
function CategoryPanelsCarousel({ categories, ariaLabel, limit = 5 }) {
  return (
    <HorizontalScroller
      ariaLabel={ariaLabel}
      prevLabel={translate({ id: "apps.carousel.prev", message: "Previous" })}
      nextLabel={translate({ id: "apps.carousel.next", message: "Next" })}
      gap="1rem"
      itemWidth="340px"
      itemWidthMobile="280px"
    >
      {categories.map((cat) => (
        <CategoryPanel key={cat} category={cat} limit={limit} />
      ))}
    </HorizontalScroller>
  );
}

export default memo(CategoryPanelsCarousel);
