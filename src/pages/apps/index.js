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
import AppTile, { StarBadge, RankBadge } from "@site/src/components/AppTile";
import AppRow from "@site/src/components/AppRow";
import AppFilterPanel from "@site/src/components/AppFilterPanel";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import { SortedShowcases, Showcases } from "@site/src/data/apps";
import {
  getTxCount,
  STATS_GENERATED_AT,
  appHasTag,
  countLiveTracking,
} from "@site/src/utils/appStats";

import styles from "./styles.module.css";

const TITLE = translate({
  id: "apps.hero.title",
  message: "Cardano Apps and DApps, Explore the Ecosystem",
});
const DESCRIPTION = translate({
  id: "apps.hero.description",
  message: "Explore curated applications that run on Cardano mainnet today",
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
const otherShowcases = SortedShowcases.filter((s) => !s.maintainerPick);

const PICKS_INITIAL_VISIBLE = 3;

const MOST_ACTIVE_LIMIT = 3;
const mostActiveShowcases = Showcases
  .map((s) => ({ s, tx: getTxCount(s) }))
  .filter(({ tx }) => tx > 0)
  .sort((a, b) => b.tx - a.tx)
  .slice(0, MOST_ACTIVE_LIMIT)
  .map(({ s }) => s);

const STATS_GENERATED_AT_LABEL = STATS_GENERATED_AT
  ? new Date(STATS_GENERATED_AT).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  : null;

const TOTAL_APPS = Showcases.length;
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
  const subtitle = translate(
    {
      id: "apps.hero.subtitle",
      message: "{count} curated applications running on mainnet today",
    },
    { count: TOTAL_APPS }
  );
  return (
    <SiteHero
      title={translate({ id: "apps.hero.titleShort", message: "Cardano apps" })}
      description={subtitle}
      bannerType={FILENAME}
    />
  );
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

function MaintainerPicksSection() {
  const [showAll, setShowAll] = useState(false);
  const visiblePicks = showAll
    ? maintainerPicks
    : maintainerPicks.slice(0, PICKS_INITIAL_VISIBLE);
  const canExpand = maintainerPicks.length > PICKS_INITIAL_VISIBLE;

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
      <ul className={styles.tileGrid}>
        {visiblePicks.map((app) => (
          <li key={app.slug}>
            <AppTile app={app} badge={<StarBadge />} />
          </li>
        ))}
      </ul>
      {canExpand && (
        <div className={styles.sectionFooter}>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll
              ? translate({
                  id: "apps.maintainerPicks.showLess",
                  message: "Show fewer ←",
                })
              : translate(
                  {
                    id: "apps.maintainerPicks.showAll",
                    message: "Show all {count} →",
                  },
                  { count: maintainerPicks.length }
                )}
          </button>
        </div>
      )}
    </section>
  );
}

function MostActiveSection() {
  if (mostActiveShowcases.length === 0) return null;
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
      <ul className={styles.tileGrid}>
        {mostActiveShowcases.map((app, i) => (
          <li key={app.slug}>
            <AppTile app={app} badge={<RankBadge rank={i + 1} />} />
          </li>
        ))}
      </ul>
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
  // Unfiltered view shows the non-pick subset (Picks already render in their own section).
  // Filtered view shows whatever survived the filter pipeline (already sorted upstream).
  const visible = useMemo(
    () => (isUnfiltered ? sortProjects(otherShowcases, sortOption) : apps),
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

  if (filtered.length === 0) {
    return (
      <section className="container margin-top--lg margin-bottom--xl text--center">
        <h2>{translate({ id: "apps.noResult", message: "No result" })}</h2>
      </section>
    );
  }

  if (!isUnfiltered) {
    return (
      <AllAppsSection apps={filtered} sortOption={sortOption} isUnfiltered={false} />
    );
  }

  return (
    <>
      <MaintainerPicksSection />
      <MostActiveSection />
      <CollectionsBanner />
      <AllAppsSection apps={filtered} sortOption={sortOption} isUnfiltered={true} />
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
    <Layout title={TITLE} description={DESCRIPTION}>
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
