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
import OpenStickyButton from "@site/src/components/buttons/openStickyButton";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import { StarBadge, RankBadge } from "@site/src/components/AppTile";
import AppTileCarousel from "@site/src/components/AppTileCarousel";
import AppRow from "@site/src/components/AppRow";
import AppFilterPanel from "@site/src/components/AppFilterPanel";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import { SortedShowcases, Showcases, RECENT_APPS_COUNT } from "@site/src/data/apps";
import {
  getTxCount,
  STATS_GENERATED_AT,
  appHasTag,
  countLiveTracking,
  getTopAppPerCategory,
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

const maintainerPicks = SortedShowcases.filter((s) => s.maintainerPick);

const recentApps = Showcases.slice(-RECENT_APPS_COUNT);
const mostActiveByCategory = getTopAppPerCategory(Showcases);

const FILTERED_MOST_ACTIVE_LIMIT = 10;

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

import { getCollections } from "@site/src/data/collections";

const COLLECTIONS_BANNER_LIMIT = 3;
const collections = getCollections({ limit: COLLECTIONS_BANNER_LIMIT });

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

  return { filtered, sortOption, isUnfiltered };
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

function MostActiveSection({ apps, isUnfiltered }) {
  if (apps.length === 0) return null;
  return (
    <section className={clsx("container", styles.section)}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.dot} aria-hidden /> {translate({ id: "apps.mostActive.title", message: "Most active" })}
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

function CollectionsBanner() {
  if (collections.length === 0) return null;
  return (
    <section className={clsx("container", styles.collectionsBanner)}>
      <div className={styles.collectionsHeader}>
        <h2 className={styles.collectionsTitle}>
          {translate({
            id: "apps.collections.banner.label",
            message: "Collections",
          })}
        </h2>
        <span className={styles.collectionsSubtitle}>
          {translate({
            id: "apps.collections.banner.subtitle",
            message: "Curated journeys",
          })}
        </span>
      </div>
      <ul className={styles.collectionChipList}>
        {collections.map((c) => (
          <li key={c.slug}>
            <Link
              to={`/apps/collections/${c.slug}`}
              className={styles.collectionChip}
            >
              {c.title} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AllAppsSection({ apps, sortOption, isUnfiltered }) {
  const visible = useMemo(
    () => (isUnfiltered ? sortProjects(SortedShowcases, sortOption) : apps),
    [isUnfiltered, sortOption, apps]
  );
  return (
    <section className={clsx("container", styles.section)}>
      <header className={clsx(styles.sectionHeader, styles.allAppsHeader)}>
        <h2 className={styles.sectionTitle}>
          {translate({ id: "apps.allApps.title", message: "All apps" })}
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
  const { filtered, sortOption, isUnfiltered } = useFilteredProjects();

  const filteredSlugs = useMemo(
    () => new Set(filtered.map((a) => a.slug)),
    [filtered]
  );

  const mostActiveApps = useMemo(() => {
    if (isUnfiltered) return mostActiveByCategory;
    return filtered
      .filter((a) => getTxCount(a) > 0)
      .sort((a, b) => getTxCount(b) - getTxCount(a))
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

  if (filtered.length === 0) {
    return (
      <section className="container margin-top--lg margin-bottom--xl text--center">
        <h2>{translate({ id: "apps.noResult", message: "No result" })}</h2>
      </section>
    );
  }

  return (
    <>
      <MostActiveSection apps={mostActiveApps} isUnfiltered={isUnfiltered} />
      <HighlightsSection apps={highlightApps} />
      {isUnfiltered && <CollectionsBanner />}
      <AllAppsSection
        apps={filtered}
        sortOption={sortOption}
        isUnfiltered={isUnfiltered}
      />
      <MaintainerPicksSection apps={pickApps} />
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
      <SubmitCTA />
      <OpenStickyButton />
    </Layout>
  );
}

export default Showcase;
