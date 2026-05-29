import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { useHistory, useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import { translate } from '@docusaurus/Translate';
import clsx from 'clsx';

import {
  CATEGORIES,
  CATEGORY_CHIP_ICONS,
  CATEGORY_ORDER,
  LEARNING_PATHS,
} from '@site/src/data/glossaryCategories';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import SiteHero from '@site/src/components/Layout/SiteHero';

import styles from './glossary.module.css';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const POPULAR_PILL_SLUGS = ['eutxo', 'stake-pool', 'drep', 'governance-action', 'smart-contract', 'treasury'];
const SEARCH_DROPDOWN_LIMIT = 6;

// Escapes any literal `</` so a future term containing the substring cannot
// terminate the embedded <script type="application/ld+json"> early.
function jsonLdString(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function buildJsonLd(terms, glossaryFullUrl) {
  return jsonLdString({
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Cardano Glossary',
    description: 'Definitions of key terms and concepts in the Cardano ecosystem.',
    url: glossaryFullUrl,
    hasDefinedTerm: terms.map(t => ({
      '@type': 'DefinedTerm',
      name: t.title,
      description: t.short,
      url: `${glossaryFullUrl}/${t.slug}`,
      termCode: t.slug,
    })),
  });
}

function normalize(s) {
  return s.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '');
}

function getMatchScore(term, normalizedQuery) {
  if (!normalizedQuery) return 0;
  const title = normalize(term.title);
  if (title === normalizedQuery) return 100;
  if (title.startsWith(normalizedQuery)) return 80;
  if (title.includes(normalizedQuery)) return 60;
  for (const alias of term.aliases || []) {
    const a = normalize(alias);
    if (a === normalizedQuery) return 70;
    if (a.startsWith(normalizedQuery)) return 50;
    if (a.includes(normalizedQuery)) return 30;
  }
  if (normalize(term.short).includes(normalizedQuery)) return 10;
  return 0;
}

function TermCard({ term, glossaryBaseUrl }) {
  const cat = CATEGORIES[term.category];
  const categoryLabel = cat
    ? translate({ id: `glossary.category.${term.category}`, message: cat.label })
    : null;
  const levelLabel =
    term.level === 'beginner'
      ? translate({ id: 'glossary.term.level.beginner', message: 'Beginner' })
      : term.level === 'advanced'
        ? translate({ id: 'glossary.term.level.advanced', message: 'Advanced' })
        : null;
  return (
    <Link to={`${glossaryBaseUrl}/${term.slug}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{term.title}</span>
        {levelLabel && (
          <span
            className={clsx(styles.cardLevel, styles[`cardLevel_${term.level}`])}
          >
            {levelLabel}
          </span>
        )}
      </div>
      <span className={styles.cardShort}>{term.short}</span>
      {categoryLabel && (
        <span className={styles.cardCategory}>
          <span className={styles.cardCategoryLabel}>{categoryLabel}</span>
        </span>
      )}
    </Link>
  );
}

function CategoryChip({ label, icon, iconBasePath, active, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.chip, active && styles.chipActive)}
      aria-pressed={active}
    >
      {icon && (
        <span
          className={styles.chipIcon}
          style={{ '--chip-icon-url': `url(${iconBasePath}${icon}.svg)` }}
          aria-hidden
        />
      )}
      {label}
      <span className={styles.chipCount}>{count}</span>
    </button>
  );
}

// Search input + autocomplete dropdown. Lives inside the SiteHero's children
// slot. Clicking a suggestion navigates straight to the term page; pressing
// Enter on a non-matching query falls through to the page-level filter via
// onSubmitQuery.
function GlossarySearch({
  terms,
  query,
  setQuery,
  onSubmitQuery,
  glossaryBaseUrl,
}) {
  const history = useHistory();
  const wrapRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const normalizedQuery = normalize(query.trim());

  const suggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    return terms
      .map(t => ({ term: t, score: getMatchScore(t, normalizedQuery) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score || a.term.title.localeCompare(b.term.title))
      .slice(0, SEARCH_DROPDOWN_LIMIT)
      .map(x => x.term);
  }, [normalizedQuery, terms]);

  useEffect(() => {
    setHighlight(0);
  }, [normalizedQuery]);

  useEffect(() => {
    if (!focused) return undefined;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [focused]);

  const goToTerm = useCallback((slug) => {
    history.push(`${glossaryBaseUrl}/${slug}`);
    setFocused(false);
  }, [history, glossaryBaseUrl]);

  const onKeyDown = (e) => {
    if (suggestions.length === 0) {
      if (e.key === 'Enter' && normalizedQuery) {
        onSubmitQuery();
        setFocused(false);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(h => (h + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(h => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      goToTerm(suggestions[highlight].slug);
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  };

  const showDropdown = focused && suggestions.length > 0;

  return (
    <div ref={wrapRef} className={styles.heroSearchWrap}>
      <div className={styles.heroSearchInputWrap}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden className={styles.heroSearchIcon}>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
          placeholder={translate({
            id: 'glossary.index.searchPlaceholder',
            message: 'Search terms, concepts, or topics…',
          })}
          className={styles.heroSearchInput}
          aria-label={translate({
            id: 'glossary.index.searchAria',
            message: 'Search glossary terms',
          })}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? 'glossary-search-listbox' : undefined}
          role="combobox"
        />
        {query && (
          <button
            type="button"
            className={styles.heroSearchClear}
            onClick={() => {
              setQuery('');
              setFocused(false);
            }}
            aria-label={translate({
              id: 'glossary.index.searchClear',
              message: 'Clear search',
            })}
          >
            ×
          </button>
        )}
      </div>
      {showDropdown && (
        <ul
          id="glossary-search-listbox"
          className={styles.heroSearchDropdown}
          role="listbox"
        >
          {suggestions.map((t, i) => (
            <li
              key={t.slug}
              role="option"
              aria-selected={i === highlight}
              className={clsx(
                styles.heroSearchOption,
                i === highlight && styles.heroSearchOptionActive,
              )}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                goToTerm(t.slug);
              }}
            >
              <span className={styles.heroSearchOptionTitle}>{t.title}</span>
              <span className={styles.heroSearchOptionShort}>{t.short}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PopularPills({ popularTerms, glossaryBaseUrl }) {
  if (popularTerms.length === 0) return null;
  return (
    <div className={styles.heroPills}>
      <span className={styles.heroPillsLabel}>
        {translate({ id: 'glossary.index.popularSearches', message: 'Popular:' })}
      </span>
      {popularTerms.map(t => (
        <Link
          key={t.slug}
          to={`${glossaryBaseUrl}/${t.slug}`}
          className={styles.heroPill}
        >
          {t.title}
        </Link>
      ))}
    </div>
  );
}

function AlphabetBar({ letters, activeLetter, onLetterClick }) {
  return (
    <nav
      className={styles.alphabet}
      aria-label={translate({
        id: 'glossary.index.alphabetNav',
        message: 'Jump to letter',
      })}
    >
      {ALPHABET.map(letter => {
        const has = letters.has(letter);
        return (
          <button
            key={letter}
            type="button"
            disabled={!has}
            onClick={() => has && onLetterClick(letter)}
            className={clsx(
              styles.alphabetLetter,
              activeLetter === letter && styles.alphabetLetterActive,
              !has && styles.alphabetLetterDisabled,
            )}
            aria-label={translate(
              {
                id: 'glossary.index.alphabetLetter',
                message: 'Jump to {letter}',
              },
              { letter },
            )}
          >
            {letter}
          </button>
        );
      })}
    </nav>
  );
}

function PathStepsRow({ steps, iconBasePath }) {
  return (
    <ol className={styles.pathSteps} aria-hidden>
      {steps.map((s, i) => (
        <li
          key={i}
          className={clsx(
            styles.pathStepItem,
            i === steps.length - 1 && styles.pathStepItemLast,
          )}
        >
          <span
            className={clsx(
              styles.pathStep,
              i === 0 ? styles.pathStepFilled : styles.pathStepOutlined,
            )}
          >
            <span
              className={styles.pathStepIcon}
              style={{ '--step-icon-url': `url(${iconBasePath}${s.icon}.svg)` }}
            />
          </span>
          {i < steps.length - 1 && <span className={styles.pathConnector} />}
        </li>
      ))}
    </ol>
  );
}

function LearningPathsSection({ iconBasePath }) {
  return (
    <section className={styles.pathsSection}>
      <div className={styles.pathsHeader}>
        <h2 className={styles.sectionHeading}>
          {translate({ id: 'glossary.index.pathsHeading', message: 'Learning paths' })}
        </h2>
        <p className={styles.pathsLead}>
          {translate({
            id: 'glossary.index.pathsLead',
            message: 'Curated guides to help you understand Cardano step by step.',
          })}
        </p>
      </div>
      <ul className={styles.pathsGrid}>
        {LEARNING_PATHS.map(p => (
          <li key={p.id}>
            <Link
              to={p.href}
              className={styles.pathCard}
              style={{ '--path-color': p.color }}
            >
              <div className={styles.pathHead}>
                <span className={styles.pathHeadIcon} aria-hidden>
                  <span
                    className={styles.pathHeadIconGlyph}
                    style={{ '--step-icon-url': `url(${iconBasePath}${p.icon}.svg)` }}
                  />
                </span>
                <div className={styles.pathHeadText}>
                  <span className={styles.pathTitle}>
                    {translate({ id: `glossary.path.${p.id}.title`, message: p.title })}
                  </span>
                  <span className={styles.pathDesc}>
                    {translate({ id: `glossary.path.${p.id}.desc`, message: p.description })}
                  </span>
                </div>
              </div>
              <PathStepsRow steps={p.steps} iconBasePath={iconBasePath} />
              <div className={styles.pathFooter}>
                <span className={styles.pathMeta}>
                  {translate(
                    {
                      id: 'glossary.path.meta',
                      message: '{count} steps · {audience}',
                    },
                    {
                      count: p.steps.length,
                      audience: translate({
                        id: `glossary.path.${p.id}.audience`,
                        message: p.audience,
                      }),
                    },
                  )}
                </span>
                <span className={styles.pathArrow} aria-hidden>
                  <svg viewBox="0 0 24 24" width="20" height="20" focusable="false">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function GlossaryIndex() {
  // Null-safe in case the plugin failed to register; the page still renders an
  // empty index instead of crashing.
  const glossaryData = usePluginData('glossary-routes') || {};
  const terms = glossaryData.terms || [];
  const history = useHistory();
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url.replace(/\/$/, '');
  const glossaryBaseUrl = useBaseUrl('/glossary').replace(/\/$/, '');
  const glossaryFullUrl = `${siteUrl}${glossaryBaseUrl}`;
  const iconBasePath = useBaseUrl('/img/icons/');

  // URL is the source of truth for shareable filter state; React state mirrors
  // it for controlled inputs.
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('q') || '');
    setActiveCategory(params.get('category') || null);
  }, [location.search]);

  const syncUrl = useCallback((next) => {
    const params = new URLSearchParams();
    if (next.q) params.set('q', next.q);
    if (next.category) params.set('category', next.category);
    const qs = params.toString();
    history.replace({
      pathname: location.pathname,
      search: qs ? `?${qs}` : '',
    });
  }, [history, location.pathname]);

  // Setters that also push the value into the URL (debounce-free; with 87 items
  // and history.replace this is cheap).
  const setQueryAndUrl = useCallback((v) => {
    setQuery(v);
    syncUrl({ q: v, category: activeCategory });
  }, [activeCategory, syncUrl]);

  const onCategoryClick = (slug) => {
    const next = activeCategory === slug ? null : slug;
    setActiveCategory(next);
    syncUrl({ q: query, category: next });
  };

  const normalizedQuery = normalize(query.trim());

  // Memoize the JSON-LD payload: it serializes all terms (~18 KB) and would
  // otherwise rebuild on every keystroke / category click.
  const jsonLd = useMemo(
    () => buildJsonLd(terms, glossaryFullUrl),
    [terms, glossaryFullUrl],
  );

  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const t of terms) counts[t.category] = (counts[t.category] || 0) + 1;
    return counts;
  }, [terms]);

  const popularPillTerms = useMemo(() => {
    const bySlug = new Map(terms.map(t => [t.slug, t]));
    return POPULAR_PILL_SLUGS.map(s => bySlug.get(s)).filter(Boolean);
  }, [terms]);

  const filteredTerms = useMemo(() => {
    return terms.filter(
      t =>
        (!activeCategory || t.category === activeCategory) &&
        (!normalizedQuery || getMatchScore(t, normalizedQuery) > 0),
    );
  }, [terms, activeCategory, normalizedQuery]);

  const hasActiveFilter = Boolean(activeCategory || normalizedQuery);

  // When browsing the unfiltered list, group by first letter so the alphabet
  // bar has something to jump to. When filtering, render a flat result list.
  const letterGroups = useMemo(() => {
    if (hasActiveFilter) return null;
    const groups = new Map();
    for (const t of terms) {
      const first = (t.title[0] || '').toUpperCase();
      const key = /[A-Z]/.test(first) ? first : '#';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(t);
    }
    return groups;
  }, [terms, hasActiveFilter]);

  const presentLetters = useMemo(() => {
    const set = new Set();
    for (const t of terms) {
      const first = (t.title[0] || '').toUpperCase();
      if (/[A-Z]/.test(first)) set.add(first);
    }
    return set;
  }, [terms]);

  const onLetterClick = (letter) => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(`glossary-letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pageTitle = translate({
    id: 'glossary.index.pageTitle',
    message: 'Cardano Glossary',
  });
  const pageDescription = translate({
    id: 'glossary.index.pageDescription',
    message: 'Definitions of key terms and concepts in the Cardano ecosystem.',
  });
  const heroDescription = translate({
    id: 'glossary.index.lead',
    message: 'Definitions of key terms and concepts in the Cardano ecosystem.',
  });

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <OpenGraphInfo
        pageName="default"
        title={pageTitle}
        description={pageDescription}
      />
      <Head>
        <script type="application/ld+json">{jsonLd}</script>
      </Head>
      <SiteHero
        title={pageTitle}
        description={heroDescription}
        bannerType="starburst"
      >
        <GlossarySearch
          terms={terms}
          query={query}
          setQuery={setQueryAndUrl}
          onSubmitQuery={() => {
            if (typeof document === 'undefined') return;
            const el = document.getElementById('glossary-results');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          glossaryBaseUrl={glossaryBaseUrl}
        />
        <PopularPills popularTerms={popularPillTerms} glossaryBaseUrl={glossaryBaseUrl} />
      </SiteHero>
      <main className={clsx('container', styles.page)}>
        <section className={styles.categoriesSection}>
          <h2 className={styles.sectionHeading}>
            {translate({
              id: 'glossary.index.browseHeading',
              message: 'Browse by category',
            })}
          </h2>
          <div className={styles.chipRow}>
            {CATEGORY_ORDER.map(slug => {
              const def = CATEGORIES[slug];
              if (!def) return null;
              return (
                <CategoryChip
                  key={slug}
                  label={translate({
                    id: `glossary.category.${slug}`,
                    message: def.label,
                  })}
                  icon={CATEGORY_CHIP_ICONS[slug]}
                  iconBasePath={iconBasePath}
                  active={activeCategory === slug}
                  count={categoryCounts[slug] || 0}
                  onClick={() => onCategoryClick(slug)}
                />
              );
            })}
          </div>
        </section>

        <section className={styles.results} id="glossary-results">
          <div className={styles.resultsHeader}>
            <h2 className={styles.sectionHeading}>
              {hasActiveFilter
                ? translate(
                    { id: 'glossary.index.resultsCount', message: '{count} terms' },
                    { count: filteredTerms.length },
                  )
                : translate(
                    { id: 'glossary.index.allTerms', message: 'All terms' },
                  )}
            </h2>
          </div>

          <div className={styles.allTermsLayout}>
            {!hasActiveFilter && (
              <AlphabetBar
                letters={presentLetters}
                activeLetter={null}
                onLetterClick={onLetterClick}
              />
            )}
            <div className={styles.allTermsBody}>
              {letterGroups ? (
                (() => {
                  // Sort the letter groups alphabetically, then find the
                  // midpoint by cumulative term count so we can splice in the
                  // Learning Paths block as an editorial break around the half
                  // of the list.
                  const sortedEntries = Array.from(letterGroups.entries()).sort(
                    (a, b) => a[0].localeCompare(b[0]),
                  );
                  const totalTerms = terms.length;
                  let cumulative = 0;
                  let pathsAfterIdx = -1;
                  for (let i = 0; i < sortedEntries.length; i++) {
                    cumulative += sortedEntries[i][1].length;
                    if (cumulative >= totalTerms / 2 && pathsAfterIdx === -1) {
                      pathsAfterIdx = i;
                      break;
                    }
                  }
                  const nodes = [];
                  sortedEntries.forEach(([letter, items], i) => {
                    nodes.push(
                      <div
                        key={letter}
                        id={`glossary-letter-${letter}`}
                        className={styles.letterGroup}
                      >
                        <h3 className={styles.letterHeading}>{letter}</h3>
                        <ul className={styles.cardGrid}>
                          {items.map(t => (
                            <li key={t.slug}>
                              <TermCard
                                term={t}
                                glossaryBaseUrl={glossaryBaseUrl}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>,
                    );
                    if (i === pathsAfterIdx) {
                      nodes.push(
                        <LearningPathsSection
                          key="learning-paths"
                          iconBasePath={iconBasePath}
                        />,
                      );
                    }
                  });
                  return nodes;
                })()
              ) : filteredTerms.length === 0 ? (
                <p className={styles.empty}>
                  {translate({
                    id: 'glossary.index.noResults',
                    message: 'No terms match your search.',
                  })}
                </p>
              ) : (
                <ul className={styles.cardGrid}>
                  {filteredTerms.map(t => (
                    <li key={t.slug}>
                      <TermCard term={t} glossaryBaseUrl={glossaryBaseUrl} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <aside className={styles.cantFind}>
          <div>
            <h2 className={styles.cantFindTitle}>
              {translate({
                id: 'glossary.index.cantFindTitle',
                message: "Can't find what you're looking for?",
              })}
            </h2>
            <p className={styles.cantFindLead}>
              {translate({
                id: 'glossary.index.cantFindLead',
                message: 'Suggest a term or explore the documentation for in-depth guides.',
              })}
            </p>
          </div>
          <div className={styles.cantFindActions}>
            <a
              href="https://github.com/cardano-foundation/cardano-org/issues/new?labels=glossary&title=Suggest+glossary+term%3A+"
              target="_blank"
              rel="noreferrer"
              className={styles.cantFindPrimary}
            >
              {translate({ id: 'glossary.index.suggestTerm', message: 'Suggest a term' })}
            </a>
          </div>
        </aside>
      </main>
    </Layout>
  );
}
