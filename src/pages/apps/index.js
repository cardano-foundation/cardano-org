import React, { useState, useMemo, useCallback, useEffect } from "react";
import Head from '@docusaurus/Head';
import Layout from "@theme/Layout";
import ShowcaseTooltip from "@site/src/components/showcase/ShowcaseTooltip";
import ShowcaseTagSelect from "@site/src/components/showcase/ShowcaseTagSelect";
import ShowcaseCard from "@site/src/components/showcase/ShowcaseCard/";
import IntentChips from "@site/src/components/showcase/IntentChips";
import ShowcaseSort, {
  readSortOption,
  DEFAULT_SORT,
  SORT_IDS,
} from "@site/src/components/showcase/ShowcaseSort";
import OpenStickyButton from "../../components/buttons/openStickyButton";
import ShowcaseFilterToggle, {
  readOperator,
} from "@site/src/components/showcase/ShowcaseFilterToggle";
import clsx from "clsx";

import ShowcaseLatestToggle, {
  readLatestOperator,
} from "@site/src/components/showcase/ShowcaseLatestToggle";

import SiteHero from "@site/src/components/Layout/SiteHero";
import { toggleListItem } from "../../utils/jsUtils";
import { SortedShowcases, Tags, TagList, Showcases } from "../../data/apps";
import { getTxCount, STATS_GENERATED_AT, appHasTag } from "@site/src/utils/appStats";
import { useHistory, useLocation } from "@docusaurus/router";
import _debounce from 'lodash/debounce';
import styles from "./styles.module.css";

import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import Fav from "../../svg/fav.svg";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

const TITLE = translate({id: 'apps.hero.title', message: 'Cardano Apps and DApps, Explore the Ecosystem'});
const DESCRIPTION = translate({id: 'apps.hero.description', message: 'Explore curated applications that run on Cardano mainnet today'});
const CTA = translate({id: 'apps.cta', message: '₳dd your project'});
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

const maintainerPicks = SortedShowcases.filter((showcase) => showcase.maintainerPick);
const otherShowcases = SortedShowcases.filter((showcase) => !showcase.maintainerPick);

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

const TagQueryStringKey = "tags";

function readSearchTags(search) {
  return new URLSearchParams(search).getAll(TagQueryStringKey);
}

// Replace seach tags in the query
function replaceSearchTags(search, newTags) {
  const searchParams = new URLSearchParams(search);
  searchParams.delete(TagQueryStringKey);
  newTags.forEach((tag) => searchParams.append(TagQueryStringKey, tag));
  return searchParams.toString();
}

// Filter projects based on chosen project tags, toggle operator or searchbar value
function filterProjects(projects, selectedTags, latest, operator, searchName, unfilteredProjects) {
  // Check if "LAST" filter is applied to decide if to filter through all projects or only last ones
  if (latest === "LAST") {
    projects = unfilteredProjects.slice(-10);
  }

  if (searchName) {
    projects = projects.filter((project) =>
      project.title.toLowerCase().includes(searchName.toLowerCase())
    );
  }
  if (selectedTags.length === 0) {
    return projects;
  }

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

  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchName, setSearchName] = useState(null);
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);

  // Sync tags from QS to state (delayed on purpose to avoid SSR/Client hydration mismatch)
  useEffect(() => {
    setSelectedTags(readSearchTags(location.search));
    setOperator(readOperator(location.search));
    setLatest(readLatestOperator(location.search));
    setSearchName(readSearchName(location.search));
    setSortOption(readSortOption(location.search));
    // Only restore scroll position if it's not a search action
    if (ExecutionEnvironment.canUseDOM && location.state && !location.state.isSearch) {
      setTimeout(() => {
        restoreUserState(location.state);
      }, 0);
    }
  }, [location]);

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

  return { filtered, sortOption };
}

function useSelectedTags() {
  // The search query-string is the source of truth!
  const location = useLocation();
  const { push } = useHistory();

  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState([]);

  // Sync tags from URL
  useEffect(() => {
    setSelectedTags(readSearchTags(location.search));
  }, [location]);

  // Update the QS value
  const toggleTag = useCallback(
    (tag) => {
      const tags = readSearchTags(location.search);
      const newTags = toggleListItem(tags, tag);
      const newSearch = replaceSearchTags(location.search, newTags);
      push({ ...location, search: newSearch });
    },
    [location, push]
  );

  return { selectedTags, toggleTag };
}

function ShowcaseHeader() {
  return (
 
    <SiteHero
      title={TITLE}
      description={DESCRIPTION}
      bannerType={FILENAME}
    />
  );
}

function ShowcaseFilters() {
  const { filtered: filteredProjects } = useFilteredProjects();
  const { selectedTags, toggleTag } = useSelectedTags();
  const location = useLocation();
  const { push } = useHistory();
  const [showAllTags, setShowAllTags] = useState(false);

  const clearAllFilters = useCallback(() => {
    const newSearch = replaceSearchTags(location.search, []);
    push({ ...location, search: newSearch });
  }, [location, push]);

  // Count apps per tag (matches both category and properties)
  const tagCounts = useMemo(() => {
    const counts = {};
    TagList.forEach((tag) => {
      counts[tag] = SortedShowcases.filter((showcase) => appHasTag(showcase, tag)).length;
    });
    return counts;
  }, []);

  // Show only top tags initially (sorted by count)
  const initialTagCount = 10;
  const sortedTags = useMemo(() => {
    return [...TagList].sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0));
  }, [tagCounts]);
  
  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, initialTagCount);

  return (
    <BackgroundWrapper backgroundType="adaLight">
    <div className="margin-top--l margin-bottom--md container">
      <div className={clsx("margin-bottom--sm", styles.filterCheckbox)}>
        <div>
          <h2>
            {translate({id: 'apps.filters.title', message: 'Filters'})}
            {selectedTags.length > 0 && (
              <span className={styles.filterCount}> ({selectedTags.length})</span>
            )}
          </h2>
          <span>{filteredProjects.length === 1
            ? translate({id: 'apps.filters.projectCount.singular', message: '1 project'})
            : translate({id: 'apps.filters.projectCount.plural', message: '{count} projects'}).replace('{count}', filteredProjects.length)
          }</span>
        </div>
        <div className={styles.filterControls}>
          {selectedTags.length > 0 && (
            <button
              onClick={clearAllFilters}
              className={styles.clearButton}
            >
              {translate({id: 'apps.filters.clearButton', message: 'Clear filters'})}
            </button>
          )}
          <ShowcaseLatestToggle />
          <ShowcaseFilterToggle />
          <ShowcaseSort />
        </div>
      </div>
      <div className={styles.checkboxList}>
        {visibleTags.map((tag, i) => {
          const { label, description, color } = Tags[tag];
          const id = `showcase_checkbox_id_${tag}`;
          const count = tagCounts[tag] || 0;
          return (
              <div key={i} className={styles.checkboxListItem}>
                <ShowcaseTooltip
                  id={id}
                  text={description}
                  anchorEl="#__docusaurus"
                >
                  <ShowcaseTagSelect
                    tag={tag}
                    id={id}
                    label={`${label} (${count})`}
                    icon={
                      <span
                        style={{
                          backgroundColor: color,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          marginLeft: 8,
                        }}
                      />
                    }
                  />
                </ShowcaseTooltip>
              </div>
          );
        })}
      </div>
      {sortedTags.length > initialTagCount && (
        <div className={styles.showMoreContainer}>
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className={styles.showMoreButton}
          >
            {showAllTags
              ? translate({id: 'apps.filters.showLess', message: 'Show less filters'})
              : translate({id: 'apps.filters.showMore', message: 'Show {count} more filters'}).replace('{count}', sortedTags.length - initialTagCount)}
          </button>
        </div>
      )}
    </div>
    </BackgroundWrapper>
  );
}

function ShowcaseCards() {
  const { filtered: filteredProjects, sortOption } = useFilteredProjects();
  const isUnfiltered = filteredProjects.length === SortedShowcases.length;

  const sortedPicks = useMemo(
    () => (isUnfiltered ? sortProjects(maintainerPicks, sortOption) : []),
    [isUnfiltered, sortOption]
  );
  const sortedOthers = useMemo(
    () => (isUnfiltered ? sortProjects(otherShowcases, sortOption) : []),
    [isUnfiltered, sortOption]
  );

  if (filteredProjects.length === 0) {
    return (
      <section className="margin-top--lg margin-bottom--xl">
        <div className="container padding-vert--md text--center">
          <h2>{translate({id: 'apps.noResult', message: 'No result'})}</h2>
          <SearchBar />
        </div>
      </section>
    );
  }

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {isUnfiltered ? (
        <>
          <div className={styles.showcaseFavorite}>
            <div className="container">
              <div
                className={clsx(
                  "margin-bottom--md",
                  styles.showcaseFavoriteHeader
                )}
              >
                <h2 className={styles.maintainerPicks}>{translate({id: 'apps.maintainerPicks', message: 'Maintainer picks'})}</h2>
                <Fav className={styles.svgIconFavorite} size="small" />
                <SearchBar />
              </div>
              <p className={styles.maintainerPicksSubtitle}>
                {translate({
                  id: 'apps.maintainerPicks.subtitle',
                  message: 'Curated by page maintainers as strong starting points. Selection criteria: see /docs/get-involved/maintainer-picks.',
                })}
              </p>
              <ul className={clsx("container", styles.showcaseList)}>
                {sortedPicks.map((showcase) => (
                  <ShowcaseCard key={showcase.title} showcase={showcase} />
                ))}
              </ul>
            </div>
          </div>
          {mostActiveShowcases.length > 0 && (
            <div className="container margin-top--lg">
              <h2 className={styles.showcaseHeader}>
                {translate({id: 'apps.mostActive.title', message: 'Most active'})}
              </h2>
              {STATS_GENERATED_AT_LABEL && (
                <p className={styles.maintainerPicksSubtitle}>
                  {translate(
                    {
                      id: 'apps.mostActive.subtitle',
                      message: 'Top apps by on-chain transactions over the last 30 days. Snapshot from {date}.',
                    },
                    {date: STATS_GENERATED_AT_LABEL}
                  )}
                </p>
              )}
              <ul className={styles.showcaseList}>
                {mostActiveShowcases.map((showcase) => (
                  <ShowcaseCard key={showcase.title} showcase={showcase} />
                ))}
              </ul>
            </div>
          )}
          <div className="container margin-top--lg">
            <h2 className={styles.showcaseHeader}>{translate({id: 'apps.allProjects', message: 'All Projects'})}</h2>
            <ul className={styles.showcaseList}>
              {sortedOthers.map((showcase) => (
                <ShowcaseCard key={showcase.title} showcase={showcase} />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="container">
          <div
            className={clsx("margin-bottom--md", styles.showcaseFavoriteHeader)}
          >
            <SearchBar />
          </div>
          <ul className={styles.showcaseList}>
            {filteredProjects.map((showcase) => (
              <ShowcaseCard key={showcase.title} showcase={showcase} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
const SearchNameQueryKey = "name";

function readSearchName(search) {
  return new URLSearchParams(search).get(SearchNameQueryKey);
}

function SearchBar() {
  const history = useHistory();
  const location = useLocation();
  const [value, setValue] = useState(() => readSearchName(location.search) || '');
  const inputRef = React.useRef(null);

  useEffect(() => {
    const newValue = readSearchName(location.search) || '';
    setValue(newValue);
    // Only restore focus if it was actually lost
    if (location.state?.isSearch && inputRef.current && document.activeElement !== inputRef.current) {
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
    <div className={styles.searchContainer}>
      <input
        ref={inputRef}
        id="searchbar"
        placeholder={translate({id: 'apps.searchPlaceholder', message: 'Search apps...'})}
        value={value}
        onInput={handleInput}
      />
    </div>
  );
}

 

function SubmitCTA() {
  return (
    <section className={styles.submitCTA}>
      <div className="container">
        <div className={styles.submitCTAInner}>
          <h2 className={styles.submitCTATitle}>
            {translate({
              id: 'apps.submit.title',
              message: 'Built something on Cardano?',
            })}
          </h2>
          <p className={styles.submitCTADescription}>
            {translate({
              id: 'apps.submit.description',
              message:
                'Add your app to this page. The submission process is open and lightweight.',
            })}
          </p>
          <a
            className={clsx('button button--primary button--lg', styles.submitCTAButton)}
            href="/docs/get-involved/add-app"
          >
            {translate({id: 'apps.submit.button', message: 'Submit your app'})}
          </a>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const { selectedTags, toggleTag } = useSelectedTags();

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <OpenGraphInfo pageName="apps" />
      <Head>
        <script type="application/ld+json">{APPS_ITEM_LIST_JSON_LD}</script>
      </Head>
      <ShowcaseHeader />
      <IntentChips />
      <ShowcaseFilters selectedTags={selectedTags} toggleTag={toggleTag} />
      <ShowcaseCards />
      <SubmitCTA />
      <OpenStickyButton />
    </Layout>
  );
}

export default Showcase;
