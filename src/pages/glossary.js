import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { useHistory, useLocation } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import { translate } from '@docusaurus/Translate';
import clsx from 'clsx';

import { CATEGORIES, CATEGORY_ORDER } from '@site/src/data/glossaryCategories';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import SiteHero from '@site/src/components/Layout/SiteHero';

import styles from './glossary.module.css';

const SITE_URL = 'https://cardano.org';

function buildJsonLd(terms) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Cardano Glossary',
    description: 'Definitions of key terms and concepts in the Cardano ecosystem.',
    url: `${SITE_URL}/glossary`,
    hasDefinedTerm: terms.map(t => ({
      '@type': 'DefinedTerm',
      name: t.title,
      description: t.short,
      url: `${SITE_URL}/glossary/${t.slug}`,
      termCode: t.slug,
    })),
  });
}

function normalize(s) {
  return s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
}

function termMatchesQuery(term, q) {
  if (!q) return true;
  const haystack = normalize(
    [term.title, term.short, ...(term.aliases || [])].join(' '),
  );
  return haystack.includes(q);
}

function TermCard({ term }) {
  const cat = CATEGORIES[term.category];
  return (
    <Link to={`/glossary/${term.slug}`} className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{term.title}</span>
        {cat && (
          <span
            className={styles.cardCategoryDot}
            style={{ background: cat.color }}
            aria-hidden
          />
        )}
      </div>
      <span className={styles.cardShort}>{term.short}</span>
    </Link>
  );
}

function CategoryChip({ category, label, color, active, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.chip, active && styles.chipActive)}
      style={
        active
          ? {
              backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`,
              borderColor: color,
              color: `color-mix(in srgb, ${color} 75%, black)`,
            }
          : undefined
      }
      aria-pressed={active}
    >
      <span className={styles.chipDot} style={{ background: color }} aria-hidden />
      {label}
      <span className={styles.chipCount}>{count}</span>
    </button>
  );
}

export default function GlossaryIndex() {
  const { terms } = usePluginData('glossary-routes');
  const history = useHistory();
  const location = useLocation();

  // Read initial filter state from URL so deep-links (e.g. /glossary?category=consensus)
  // and breadcrumb links from term pages land users on the right view.
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('q') || '');
    setActiveCategory(params.get('category') || null);
  }, [location.search]);

  const syncUrl = (next) => {
    const params = new URLSearchParams();
    if (next.q) params.set('q', next.q);
    if (next.category) params.set('category', next.category);
    const qs = params.toString();
    history.replace({
      pathname: location.pathname,
      search: qs ? `?${qs}` : '',
    });
  };

  const onQueryChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    syncUrl({ q: v, category: activeCategory });
  };

  const onCategoryClick = (slug) => {
    const next = activeCategory === slug ? null : slug;
    setActiveCategory(next);
    syncUrl({ q: query, category: next });
  };

  const normalizedQuery = normalize(query.trim());
  const featured = useMemo(() => terms.filter(t => t.featured), [terms]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const t of terms) counts[t.category] = (counts[t.category] || 0) + 1;
    return counts;
  }, [terms]);

  const filteredTerms = useMemo(() => {
    return terms.filter(
      t =>
        (!activeCategory || t.category === activeCategory) &&
        termMatchesQuery(t, normalizedQuery),
    );
  }, [terms, activeCategory, normalizedQuery]);

  // Group filtered terms by category when no specific category is selected
  // (and no query) — gives the page structure when browsing the full list.
  const grouped = useMemo(() => {
    if (activeCategory || normalizedQuery) return null;
    const map = new Map();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const t of filteredTerms) {
      if (!map.has(t.category)) map.set(t.category, []);
      map.get(t.category).push(t);
    }
    return map;
  }, [filteredTerms, activeCategory, normalizedQuery]);

  const pageTitle = translate({
    id: 'glossary.index.pageTitle',
    message: 'Cardano Glossary',
  });
  const pageDescription = translate({
    id: 'glossary.index.pageDescription',
    message: 'Definitions of key terms and concepts in the Cardano ecosystem.',
  });

  return (
    <Layout title={pageTitle} description={pageDescription}>
      {/* TODO: replace pageName with "glossary" once static/img/og/glossary.jpg exists */}
      <OpenGraphInfo
        pageName="default"
        title={pageTitle}
        description={pageDescription}
      />
      <Head>
        <script type="application/ld+json">{buildJsonLd(terms)}</script>
      </Head>
      <SiteHero
        title={pageTitle}
        description={translate({
          id: 'glossary.index.lead',
          message:
            'Definitions of key terms and concepts in the Cardano ecosystem. Search, browse by category, or dive into the most-asked-about terms.',
        })}
        bannerType="starburst"
      />
      <main className={clsx('container', styles.page)}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden
              className={styles.searchIcon}
            >
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
              onChange={onQueryChange}
              placeholder={translate({
                id: 'glossary.index.searchPlaceholder',
                message: 'Search terms…',
              })}
              className={styles.searchInput}
              aria-label={translate({
                id: 'glossary.index.searchAria',
                message: 'Search glossary terms',
              })}
            />
            {query && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => {
                  setQuery('');
                  syncUrl({ q: '', category: activeCategory });
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
        </div>

        {featured.length > 0 && !normalizedQuery && !activeCategory && (
          <section className={styles.featuredSection}>
            <h2 className={styles.sectionHeading}>
              {translate({
                id: 'glossary.index.popularHeading',
                message: 'Popular terms',
              })}
            </h2>
            <ul className={styles.cardGrid}>
              {featured.map(t => (
                <li key={t.slug}>
                  <TermCard term={t} />
                </li>
              ))}
            </ul>
          </section>
        )}

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
                  category={slug}
                  label={translate({
                    id: `glossary.category.${slug}`,
                    message: def.label,
                  })}
                  color={def.color}
                  active={activeCategory === slug}
                  count={categoryCounts[slug] || 0}
                  onClick={() => onCategoryClick(slug)}
                />
              );
            })}
          </div>
        </section>

        {grouped ? (
          <>
            {Array.from(grouped.entries()).map(([cat, items]) => {
              if (items.length === 0) return null;
              const def = CATEGORIES[cat];
              if (!def) return null;
              return (
                <section key={cat} className={styles.group}>
                  <div className={styles.groupHeader}>
                    <span
                      className={styles.groupDot}
                      style={{ background: def.color }}
                      aria-hidden
                    />
                    <h3 className={styles.groupTitle}>
                      {translate({ id: `glossary.category.${cat}`, message: def.label })}
                    </h3>
                    <span className={styles.groupCount}>{items.length}</span>
                  </div>
                  <ul className={styles.cardGrid}>
                    {items.map(t => (
                      <li key={t.slug}>
                        <TermCard term={t} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </>
        ) : (
          <section className={styles.results}>
            {filteredTerms.length === 0 ? (
              <p className={styles.empty}>
                {translate({
                  id: 'glossary.index.noResults',
                  message: 'No terms match your search.',
                })}
              </p>
            ) : (
              <>
                <p className={styles.resultsMeta}>
                  {translate(
                    {
                      id: 'glossary.index.resultsCount',
                      message: '{count} terms',
                    },
                    { count: filteredTerms.length },
                  )}
                </p>
                <ul className={styles.cardGrid}>
                  {filteredTerms.map(t => (
                    <li key={t.slug}>
                      <TermCard term={t} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </main>
    </Layout>
  );
}
