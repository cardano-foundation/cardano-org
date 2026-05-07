import React, { useState, useMemo, useCallback, useEffect } from "react";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { useHistory, useLocation } from "@docusaurus/router";
import { translate } from "@docusaurus/Translate";
import _debounce from "lodash/debounce";
import clsx from "clsx";

import IntentChips from "@site/src/components/showcase/IntentChips";
import PageCTA from "@site/src/components/PageCTA";
import ShowcaseSort, {
  readSortOption,
  DEFAULT_SORT,
  SORT_IDS,
} from "@site/src/components/showcase/ShowcaseSort";
import { readSearchTags } from "@site/src/components/showcase/ShowcaseTagSelect";
import { readOperator } from "@site/src/components/showcase/ShowcaseFilterToggle";
import { readLatestOperator } from "@site/src/components/showcase/ShowcaseLatestToggle";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import { StarBadge, RankBadge } from "@site/src/components/AppTile";
import AppTileCarousel from "@site/src/components/AppTileCarousel";
import CategoryPanelsCarousel from "@site/src/components/CategoryPanelsCarousel";
import AppRow from "@site/src/components/AppRow";
import AppFilterPanel from "@site/src/components/AppFilterPanel";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import { SortedShowcases, Showcases, RECENT_APPS_COUNT, Categories } from "@site/src/data/apps";
import {
  getTxCount,
  STATS_GENERATED_AT,
  appHasTag,
  countLiveTracking,
  getTopAppPerCategory,
  isTrackable,
  compareByTxDesc,
} from "@site/src/utils/appStats";

import styles from "./styles.module.css";

// SEO meta — long, optimized for SERP. Used by <Layout>.
const SEO_TITLE = translate({
  id: "apps.seo.title",
  message: "Cardano Apps Directory: Wallets, DEXes, NFTs & More",
});
const SEO_DESCRIPTION = translate(
  {
    id: "apps.seo.description",
    message:
      "Browse {count} curated Cardano apps live on mainnet. Wallets, DEXes, NFT marketplaces, lending, governance, and games. Filter by category or activity.",
  },
  { count: Showcases.length }
);

// Hero — short copy for the visible page banner. Used by <SiteHero>.
const HERO_TITLE = translate({
  id: "apps.hero.title",
  message: "Cardano Apps and dApps",
});
const HERO_DESCRIPTION = translate({
  id: "apps.hero.description",
  message:
    "Discover curated apps live on Cardano mainnet today. Wallets, DEXes, NFTs, lending, and more.",
});

const FILENAME = "apps.js";

export function prepareUserState() {
  if (ExecutionEnvironment.canUseDOM) {
    return {
      scrollTopPosition: window.scrollY,
      focusedElementId: document.activeElement?.id,
    };
  }
  return undefined;
}

// Most-recent additions, re-sorted by tx desc so trackable apps lead. Apps with
// no tx data keep their insertion order via Array.sort stability.
const recentApps = [...Showcases.slice(-RECENT_APPS_COUNT)].sort(compareByTxDesc);
const mostActiveByCategory = getTopAppPerCategory(Showcases);

const FILTERED_MOST_ACTIVE_LIMIT = 3;

// Browse-by-category panel order is derived at module load:
//   1. Anchors pinned at the top so newcomer-priority categories never fall.
//   2. Middle sorted by sum of on-chain tx within each category (desc); 0-tx
//      categories tie-broken by app count (desc).
//   3. `other` always last as the catch-all tail.
// Categories are split into two tiers via Categories[c].prominent: prominent
// ones lead "Browse by category", non-prominent ones are rendered separately
// in the lower "Tools, Trackers & Insights" section.
const ANCHOR_CATEGORIES = ["wallet", "dex"];
const TAIL_CATEGORIES = ["other"];

function deriveCategoryOrder(categoryFilter) {
  const txByCat = {};
  const countByCat = {};
  Showcases.forEach((app) => {
    if (!categoryFilter(app.category)) return;
    countByCat[app.category] = (countByCat[app.category] || 0) + 1;
    if (isTrackable(app)) {
      txByCat[app.category] = (txByCat[app.category] || 0) + getTxCount(app);
    }
  });
  const present = Object.keys(countByCat);
  const middle = present
    .filter((c) => !ANCHOR_CATEGORIES.includes(c) && !TAIL_CATEGORIES.includes(c))
    .sort((a, b) => {
      const txDiff = (txByCat[b] || 0) - (txByCat[a] || 0);
      if (txDiff !== 0) return txDiff;
      return (countByCat[b] || 0) - (countByCat[a] || 0);
    });
  return [
    ...ANCHOR_CATEGORIES.filter((c) => countByCat[c] > 0),
    ...middle,
    ...TAIL_CATEGORIES.filter((c) => countByCat[c] > 0),
  ];
}

const isProminentCategory = (c) => Categories[c]?.prominent === true;
const isCompactCategory = (c) => Categories[c]?.prominent === false;

const PROMINENT_CATEGORY_ORDER = deriveCategoryOrder(isProminentCategory);
const COMPACT_CATEGORY_ORDER = deriveCategoryOrder(isCompactCategory);
// Combined order drives the maintainer-picks round-robin and other consumers
// that need to walk every category.
const CATEGORY_PANEL_ORDER = [...PROMINENT_CATEGORY_ORDER, ...COMPACT_CATEGORY_ORDER];

// Maintainer picks round-robin across categories so the section reads as a
// cross-section of the ecosystem rather than a wallet-heavy cluster. Within each
// round the highest-tx pick from each category leads, following CATEGORY_PANEL_ORDER
// for category sequence.
const maintainerPicks = (() => {
  const buckets = new Map(CATEGORY_PANEL_ORDER.map((c) => [c, []]));
  for (const app of SortedShowcases) {
    if (app.maintainerPick) buckets.get(app.category)?.push(app);
  }
  for (const list of buckets.values()) list.sort(compareByTxDesc);
  const lists = [...buckets.values()];
  const maxLen = Math.max(0, ...lists.map((l) => l.length));
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    for (const list of lists) if (list[i]) result.push(list[i]);
  }
  return result;
})();

const STATS_GENERATED_AT_LABEL = STATS_GENERATED_AT
  ? new Date(STATS_GENERATED_AT).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  : null;

const LIVE_TRACKING_COUNT = countLiveTracking(Showcases);

const ITEM_LIST_LIMIT = 30;
const APPS_ITEM_LIST_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Cardano apps and dApps",
  itemListElement: SortedShowcases.slice(0, ITEM_LIST_LIMIT).map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: s.website,
    name: s.title,
  })),
});

function sortProjects(projects, sortOption) {
  if (sortOption === SORT_IDS.ALPHABETICAL) {
    return [...projects].sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sortOption === SORT_IDS.MOST_ACTIVE) {
    return [...projects].sort((a, b) => {
      const txA = getTxCount(a);
      const txB = getTxCount(b);
      if (txA !== txB) return txB - txA;
      return a.title.localeCompare(b.title);
    });
  }
  return projects;
}

function restoreUserState(userState) {
  const { scrollTopPosition, focusedElementId } = userState ?? {
    scrollTopPosition: 0,
    focusedElementId: undefined,
  };
  document.getElementById(focusedElementId)?.focus();
  window.scrollTo({ top: scrollTopPosition });
}

const SearchNameQueryKey = "name";

function readSearchName(search) {
  return new URLSearchParams(search).get(SearchNameQueryKey);
}

function filterProjects(projects, selectedTags, latest, operator, searchName, unfilteredProjects) {
  if (latest === "LAST") {
    projects = unfilteredProjects.slice(-10);
  }
  if (searchName) {
    projects = projects.filter((project) =>
      project.title.toLowerCase().includes(searchName.toLowerCase())
    );
  }
  if (selectedTags.length === 0) return projects;
  return projects.filter((project) => {
    if (operator === "AND") {
      return selectedTags.every((tag) => appHasTag(project, tag));
    }
    return selectedTags.some((tag) => appHasTag(project, tag));
  });
}

function useFilteredProjects() {
  const location = useLocation();
  const [operator, setOperator] = useState("OR");
  const [latest, setLatest] = useState("ALL");
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchName, setSearchName] = useState(null);
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);

  useEffect(() => {
    setSelectedTags(readSearchTags(location.search));
    setOperator(readOperator(location.search));
    setLatest(readLatestOperator(location.search));
    setSearchName(readSearchName(location.search));
    setSortOption(readSortOption(location.search));
    if (ExecutionEnvironment.canUseDOM && location.state && !location.state.isSearch) {
      setTimeout(() => {
        restoreUserState(location.state);
      }, 0);
    }
    // location.search is the source of truth for filters; depending on the parent
    // location object would re-trigger on every push (filter-panel toggles, etc.).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const filtered = useMemo(
    () =>
      sortProjects(
        filterProjects(
          SortedShowcases,
          selectedTags,
          latest,
          operator,
          searchName,
          Showcases
        ),
        sortOption
      ),
    [selectedTags, latest, operator, searchName, sortOption]
  );

  const isUnfiltered =
    selectedTags.length === 0 && !searchName && latest !== "LAST";

  return { filtered, sortOption, isUnfiltered, selectedTags };
}

function ShowcaseHeader() {
  return <SiteHero title={HERO_TITLE} description={HERO_DESCRIPTION} bannerType={FILENAME} />;
}

function SearchBar() {
  const history = useHistory();
  const location = useLocation();
  const [value, setValue] = useState(
    () => readSearchName(location.search) || ""
  );
  const inputRef = React.useRef(null);

  useEffect(() => {
    const newValue = readSearchName(location.search) || "";
    setValue(newValue);
    if (
      location.state?.isSearch &&
      inputRef.current &&
      document.activeElement !== inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [location]);

  const debouncedHistoryPush = useCallback(
    _debounce((newSearchString) => {
      history.push({
        ...location,
        search: newSearchString,
        state: { isSearch: true },
      });
    }, 300),
    [history, location]
  );

  const handleInput = (e) => {
    const currentInputValue = e.currentTarget.value;
    setValue(currentInputValue);
    const newSearch = new URLSearchParams(location.search);
    newSearch.delete(SearchNameQueryKey);
    if (currentInputValue) {
      newSearch.set(SearchNameQueryKey, currentInputValue);
    }
    debouncedHistoryPush(newSearch.toString());
  };

  return (
    <div className={styles.searchInputWrap}>
      <input
        ref={inputRef}
        id="searchbar"
        className={styles.searchInput}
        placeholder={translate({
          id: "apps.searchPlaceholder",
          message: "Search apps...",
        })}
        value={value}
        onInput={handleInput}
      />
    </div>
  );
}

function SearchControls() {
  return (
    <section className={clsx("container", styles.controls)}>
      <SearchBar />
      <div className={styles.controlsRight}>
        <AppFilterPanel />
        <ShowcaseSort />
      </div>
    </section>
  );
}

function MaintainerPicksSection({ apps }) {
  if (apps.length === 0) return null;
  return (
    <section className={clsx("container", styles.section)}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          ★ {translate({ id: "apps.maintainerPicks", message: "Maintainer picks" })}
        </h2>
        <span className={styles.sectionSubtitle}>
          {translate({
            id: "apps.maintainerPicks.subtitleShort",
            message: "Selected by cardano.org maintainers",
          })}
        </span>
      </header>
      <AppTileCarousel
        apps={apps}
        ariaLabel={translate({
          id: "apps.maintainerPicks",
          message: "Maintainer picks",
        })}
        renderBadge={() => <StarBadge />}
      />
    </section>
  );
}

function MostActiveSection({ apps, isUnfiltered, scopeLabel }) {
  if (apps.length === 0) return null;
  const title = scopeLabel
    ? translate(
        { id: "apps.mostActive.titleScoped", message: "Most active {label}" },
        { label: scopeLabel }
      )
    : translate({ id: "apps.mostActive.title", message: "Most active" });
  return (
    <section className={clsx("container", styles.section)}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.dot} aria-hidden /> {title}
        </h2>
        <span className={styles.sectionSubtitle}>
          {STATS_GENERATED_AT_LABEL
            ? translate(
                {
                  id: "apps.mostActive.subtitle",
                  message:
                    "Top apps by on-chain transactions over the last 30 days. Snapshot from {date}.",
                },
                { date: STATS_GENERATED_AT_LABEL }
              )
            : translate({
                id: "apps.mostActive.title",
                message: "Most active",
              })}
        </span>
      </header>
      <p className={styles.leaderboardLink}>
        <Link to="/apps/leaderboard">
          {translate({
            id: "apps.mostActive.leaderboardLink",
            message: "Live from the transaction leaderboard",
          })}
        </Link>
      </p>
      <AppTileCarousel
        apps={apps}
        ariaLabel={translate({
          id: "apps.mostActive.title",
          message: "Most active",
        })}
        // Rank badges only on filtered view: unfiltered shows top-1-per-category, where a global rank would be misleading.
        renderBadge={isUnfiltered ? null : (_, i) => <RankBadge rank={i + 1} />}
      />
    </section>
  );
}

function HighlightsSection({ apps }) {
  if (apps.length === 0) return null;
  return (
    <section className={clsx("container", styles.section)}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {translate({ id: "apps.highlights.title", message: "Recently added" })}
        </h2>
        <span className={styles.sectionSubtitle}>
          {translate({
            id: "apps.highlights.subtitle",
            message: "The newest apps in the showcase",
          })}
        </span>
      </header>
      <AppTileCarousel
        apps={apps}
        ariaLabel={translate({
          id: "apps.highlights.title",
          message: "Recently added",
        })}
      />
    </section>
  );
}

function GuidedPathsBanner() {
  const paths = [
    {
      to: "/get-started",
      label: translate({
        id: "apps.guidedPaths.getStarted",
        message: "First steps with ada",
      }),
    },
    {
      to: "/governance#paths",
      label: translate({
        id: "apps.guidedPaths.governance",
        message: "Have a say in Cardano",
      }),
    },
    {
      to: "/developers",
      label: translate({
        id: "apps.guidedPaths.developers",
        message: "Build on Cardano",
      }),
    },
  ];
  return (
    <section className={clsx("container", styles.guidedPathsBanner)}>
      <div className={styles.guidedPathsHeader}>
        <h2 className={styles.guidedPathsTitle}>
          {translate({
            id: "apps.guidedPaths.label",
            message: "Guided paths",
          })}
        </h2>
        <span className={styles.guidedPathsSubtitle}>
          {translate({
            id: "apps.guidedPaths.subtitle",
            message: "Step-by-step on cardano.org",
          })}
        </span>
      </div>
      <ul className={styles.guidedPathChipList}>
        {paths.map((p) => (
          <li key={p.to}>
            <Link to={p.to} className={styles.guidedPathChip}>
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CategoryBrowseSection({ categories, title, subtitle, muted = false }) {
  if (categories.length === 0) return null;
  return (
    <section className={clsx("container", styles.section, muted && styles.sectionMuted)}>
      <header className={styles.sectionHeader}>
        <h2 className={clsx(styles.sectionTitle, muted && styles.sectionTitleMuted)}>
          {title}
        </h2>
        <span className={styles.sectionSubtitle}>{subtitle}</span>
      </header>
      <CategoryPanelsCarousel categories={categories} ariaLabel={title} />
    </section>
  );
}

function BrowseByCategorySection() {
  return (
    <CategoryBrowseSection
      categories={PROMINENT_CATEGORY_ORDER}
      title={translate({
        id: "apps.browseByCategory.title",
        message: "Browse apps by category",
      })}
      subtitle={translate({
        id: "apps.browseByCategory.subtitle",
        message: "A taste of each category. Top tracked apps first, then maintainer picks, then a random pick of the rest.",
      })}
    />
  );
}

function ToolsAndInsightsSection() {
  return (
    <CategoryBrowseSection
      categories={COMPACT_CATEGORY_ORDER}
      title={translate({
        id: "apps.toolsAndInsights.title",
        message: "Browse tools by category",
      })}
      subtitle={translate({
        id: "apps.toolsAndInsights.subtitle",
        message: "Utilities, dashboards, and explorers for tracking and analytics.",
      })}
      muted
    />
  );
}

function AllAppsReveal() {
  const [shown, setShown] = useState(false);
  if (shown) {
    // AllAppsSection ignores `apps` when isUnfiltered=true and sorts SortedShowcases itself.
    return (
      <AllAppsSection
        apps={null}
        sortOption={SORT_IDS.ALPHABETICAL}
        isUnfiltered={true}
        heading={translate(
          { id: "apps.allApps.heading", message: "All {count} apps, A to Z" },
          { count: SortedShowcases.length }
        )}
      />
    );
  }
  return (
    <section className={clsx("container", styles.section, styles.allAppsReveal)}>
      <button
        type="button"
        className={clsx("button button--secondary", styles.showAllButton)}
        onClick={() => setShown(true)}
      >
        {translate(
          { id: "apps.allApps.show", message: "View all {count} apps alphabetically" },
          { count: SortedShowcases.length }
        )}
      </button>
    </section>
  );
}

function AllAppsSection({ apps, sortOption, isUnfiltered, heading }) {
  const visible = useMemo(
    () => (isUnfiltered ? sortProjects(SortedShowcases, sortOption) : apps),
    [isUnfiltered, sortOption, apps]
  );
  return (
    <section className={clsx("container", styles.section)}>
      <header className={clsx(styles.sectionHeader, styles.allAppsHeader)}>
        <h2 className={styles.sectionTitle}>
          {heading}
          <span className={styles.countMuted}>
            {" · "}
            {visible.length}
          </span>
        </h2>
        <span className={styles.sectionSubtitle}>
          {translate(
            {
              id: "apps.allApps.tracked",
              message: "{count} with live tracking",
            },
            { count: LIVE_TRACKING_COUNT }
          )}
        </span>
      </header>
      <ul className={styles.rowGrid}>
        {visible.map((app) => (
          <li key={app.slug}>
            <AppRow app={app} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ShowcaseSections() {
  const { filtered, sortOption, isUnfiltered, selectedTags } = useFilteredProjects();

  const filteredSlugs = useMemo(
    () => new Set(filtered.map((a) => a.slug)),
    [filtered]
  );

  const mostActiveApps = useMemo(() => {
    if (isUnfiltered) return mostActiveByCategory;
    return filtered
      .filter((a) => getTxCount(a) > 0)
      .sort(compareByTxDesc)
      .slice(0, FILTERED_MOST_ACTIVE_LIMIT);
  }, [filtered, isUnfiltered]);

  const highlightApps = useMemo(() => {
    if (isUnfiltered) return recentApps;
    return recentApps.filter((a) => filteredSlugs.has(a.slug));
  }, [filteredSlugs, isUnfiltered]);

  const pickApps = useMemo(() => {
    if (isUnfiltered) return maintainerPicks;
    return maintainerPicks.filter((a) => filteredSlugs.has(a.slug));
  }, [filteredSlugs, isUnfiltered]);

  // Filtered "All …" list: drop entries already shown in Most active above and
  // sort the remainder by tx desc so the highest-activity apps lead the bulk list.
  const restApps = useMemo(() => {
    if (isUnfiltered) return filtered;
    const shownSlugs = new Set(mostActiveApps.map((a) => a.slug));
    return filtered
      .filter((a) => !shownSlugs.has(a.slug))
      .sort((a, b) => compareByTxDesc(a, b) || a.title.localeCompare(b.title));
  }, [filtered, mostActiveApps, isUnfiltered]);

  if (filtered.length === 0) {
    return (
      <section className="container margin-top--lg margin-bottom--xl text--center">
        <h2>{translate({ id: "apps.noResult", message: "No result" })}</h2>
      </section>
    );
  }

  const scopeLabel = !isUnfiltered && selectedTags.length === 1
    ? Categories[selectedTags[0]]?.label
    : null;
  const restHeadingId = scopeLabel
    ? mostActiveApps.length > 0
      ? "apps.allApps.titleOther"
      : "apps.allApps.titleScoped"
    : "apps.allApps.title";
  const restHeadingMessage = scopeLabel
    ? mostActiveApps.length > 0
      ? "Other {label}"
      : "All {label}"
    : "All apps";
  const restHeading = scopeLabel
    ? translate({ id: restHeadingId, message: restHeadingMessage }, { label: scopeLabel })
    : translate({ id: restHeadingId, message: restHeadingMessage });

  return (
    <>
      <MostActiveSection
        apps={mostActiveApps}
        isUnfiltered={isUnfiltered}
        scopeLabel={scopeLabel}
      />
      <HighlightsSection apps={highlightApps} />
      {isUnfiltered && <GuidedPathsBanner />}
      {isUnfiltered ? (
        <BrowseByCategorySection />
      ) : (
        <AllAppsSection
          apps={restApps}
          sortOption={sortOption}
          isUnfiltered={isUnfiltered}
          heading={restHeading}
        />
      )}
      <MaintainerPicksSection apps={pickApps} />
      {isUnfiltered && <ToolsAndInsightsSection />}
      {isUnfiltered && <AllAppsReveal />}
      <SubmitCTA />
    </>
  );
}

function SubmitCTA() {
  return (
    <PageCTA
      title={translate({
        id: "apps.submit.title",
        message: "Built something on Cardano?",
      })}
      description={translate({
        id: "apps.submit.description",
        message:
          "Add your app to this page. The submission process is open and lightweight.",
      })}
      href="/docs/get-involved/add-app"
      buttonText={translate({
        id: "apps.submit.button",
        message: "Submit your app",
      })}
      secondaryButton={{
        href: "/docs/get-involved/tx-rankings",
        label: translate({
          id: "apps.submit.enableTracking",
          message: "Enable tracking",
        }),
      }}
      variant="primary"
    />
  );
}

function Showcase() {
  return (
    <Layout title={SEO_TITLE} description={SEO_DESCRIPTION}>
      <OpenGraphInfo pageName="apps" />
      <Head>
        <script type="application/ld+json">{APPS_ITEM_LIST_JSON_LD}</script>
      </Head>
      <ShowcaseHeader />
      <IntentChips />
      <SearchControls />
      <ShowcaseSections />
    </Layout>
  );
}

export default Showcase;
