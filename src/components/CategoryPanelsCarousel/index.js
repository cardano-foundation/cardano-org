import React, { memo } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";

import AppRow from "@site/src/components/AppRow";
import HorizontalScroller from "@site/src/components/HorizontalScroller";
import { Categories, Showcases } from "@site/src/data/apps";
import { compareByTxDesc } from "@site/src/utils/appStats";

import styles from "./styles.module.css";

function selectPanelApps(category, limit) {
  // Three-tier sort: tracked tx desc, then maintainer picks, then random.
  // Random tiebreak gives non-tracked categories (Wallet, Explorer, etc.) some
  // freshness on each session start. Result is cached by PANEL_APPS_CACHE so the
  // order stays stable until the next full page load.
  return Showcases
    .filter((app) => app.category === category)
    .sort((a, b) => {
      const txDiff = compareByTxDesc(a, b);
      if (txDiff !== 0) return txDiff;
      if (a.maintainerPick !== b.maintainerPick) return a.maintainerPick ? -1 : 1;
      return Math.random() - 0.5;
    })
    .slice(0, limit);
}

// Showcases is static at module scope; precompute each panel's apps once at load
// time to avoid re-running the filter+sort on every parent re-render (every scroll
// event triggers one). Keyed by `${category}:${limit}`.
const PANEL_APPS_CACHE = new Map();
function getPanelApps(category, limit) {
  const key = `${category}:${limit}`;
  if (!PANEL_APPS_CACHE.has(key)) {
    PANEL_APPS_CACHE.set(key, selectPanelApps(category, limit));
  }
  return PANEL_APPS_CACHE.get(key);
}

const CategoryPanel = memo(function CategoryPanel({ category, limit }) {
  const def = Categories[category];
  if (!def) return null;
  const apps = getPanelApps(category, limit);
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
