import React, { useMemo } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { usePluginData } from '@docusaurus/useGlobalData';
import { translate } from '@docusaurus/Translate';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

import { CATEGORIES } from '@site/src/data/glossaryCategories';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import SiteHero from '@site/src/components/Layout/SiteHero';

import styles from './styles.module.css';

// Escapes any literal `</` in JSON before it is embedded inside a <script>
// tag so a future term containing the substring cannot terminate the script
// element early (also covers the XSS shape if data ever becomes user-supplied).
function jsonLdString(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function buildJsonLd(term, siteUrl, termUrl, glossaryUrl) {
  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.title,
    description: term.short,
    url: termUrl,
    termCode: term.slug,
    inDefinedTermSet: glossaryUrl,
    ...(term.aliases && term.aliases.length ? { alternateName: term.aliases } : {}),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Cardano', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Glossary', item: glossaryUrl },
      { '@type': 'ListItem', position: 3, name: term.title, item: termUrl },
    ],
  };
  return [
    <script key="defined" type="application/ld+json">
      {jsonLdString(definedTerm)}
    </script>,
    <script key="crumb" type="application/ld+json">
      {jsonLdString(breadcrumb)}
    </script>,
  ];
}

// Returns the body markdown with the leading short sentence stripped if the
// body verbatim restates it (the migration script extracted `short` from the
// body's first sentence, so most terms have this duplication). Returns null
// when the body is just the short with no additional content.
function getDisplayBody(term) {
  if (!term.body) return null;
  const body = term.body.trim();
  const short = term.short.trim();
  if (body === short) return null;
  if (body.startsWith(short)) {
    const rest = body.slice(short.length).trim();
    return rest || null;
  }
  return body;
}

function MarkdownLink({ href, children }) {
  if (!href) return <>{children}</>;
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return <Link to={href}>{children}</Link>;
}

const MARKDOWN_COMPONENTS = {
  a: MarkdownLink,
};

export default function GlossaryTerm({ term }) {
  // usePluginData returns the plugin's globalData object; null-safe in case the
  // plugin failed to register (e.g. build error in loadContent — we still want
  // the page to render rather than crash the whole route).
  const glossaryData = usePluginData('glossary-routes') || {};
  const terms = glossaryData.terms || [];
  const categoryDef = CATEGORIES[term.category];

  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const siteUrl = siteConfig.url.replace(/\/$/, '');
  const termUrl = `${siteUrl}${location.pathname.replace(/\/$/, '')}`;
  const glossaryUrl = useBaseUrl('/glossary');
  const glossaryFullUrl = `${siteUrl}${glossaryUrl.replace(/\/$/, '')}`;

  const relatedTerms = useMemo(() => {
    if (!term.related || term.related.length === 0 || terms.length === 0) return [];
    return term.related
      .map(slug => terms.find(t => t.slug === slug))
      .filter(Boolean);
  }, [term.related, terms]);

  const displayBody = useMemo(() => getDisplayBody(term), [term]);

  const pageTitle = `${term.title} | Cardano Glossary`;
  const pageDescription = term.short;

  return (
    <Layout title={pageTitle} description={pageDescription}>
      {/* TODO: replace pageName with "glossary" once static/img/og/glossary.jpg exists */}
      <OpenGraphInfo
        pageName="default"
        title={pageTitle}
        description={pageDescription}
      />
      <Head>{buildJsonLd(term, siteUrl, termUrl, glossaryFullUrl)}</Head>
      <SiteHero
        title={term.title}
        description={term.short}
        bannerType="docs"
      />
      <main className={clsx('container', styles.detail)}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to={glossaryUrl}>
            {translate({ id: 'glossary.crumb.index', message: 'Glossary' })}
          </Link>
          {categoryDef && (
            <>
              <span className={styles.crumbSep} aria-hidden>/</span>
              <Link to={`${glossaryUrl}?category=${term.category}`}>
                {translate({ id: `glossary.category.${term.category}`, message: categoryDef.label })}
              </Link>
            </>
          )}
          <span className={styles.crumbSep} aria-hidden>/</span>
          <span className={styles.crumbCurrent}>{term.title}</span>
        </nav>

        {term.aliases && term.aliases.length > 0 && (
          <p className={styles.aliases}>
            <span className={styles.aliasesLabel}>
              {translate({ id: 'glossary.term.alsoKnownAs', message: 'Also known as' })}:
            </span>{' '}
            {term.aliases.join(', ')}
          </p>
        )}

        {term.link && (() => {
          const isExternal = /^https?:\/\//.test(term.link);
          const label = (
            <>
              <span className={styles.fullPageCtaLabel}>
                {translate({
                  id: 'glossary.term.openFullPage',
                  message: 'Open dedicated page',
                })}
              </span>
              <span className={styles.fullPageCtaArrow} aria-hidden>
                {isExternal ? '↗' : '→'}
              </span>
            </>
          );
          return isExternal ? (
            <a
              href={term.link}
              target="_blank"
              rel="noreferrer"
              className={styles.fullPageCta}
            >
              {label}
            </a>
          ) : (
            <Link to={term.link} className={styles.fullPageCta}>
              {label}
            </Link>
          );
        })()}

        {term.mentalModel && (
          <aside className={styles.mentalModel} aria-label="Mental model">
            <div className={styles.mentalModelIcon} aria-hidden>
              <svg viewBox="0 0 24 24" width="20" height="20" focusable="false">
                <path
                  fill="currentColor"
                  d="M9 21h6v-1H9zm3-19a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26A7 7 0 0012 2z"
                />
              </svg>
            </div>
            <div>
              <div className={styles.mentalModelLabel}>
                {translate({ id: 'glossary.term.mentalModel', message: 'Mental model' })}
              </div>
              <p className={styles.mentalModelBody}>{term.mentalModel}</p>
            </div>
          </aside>
        )}

        {displayBody ? (
          <section className={styles.body}>
            <ReactMarkdown components={MARKDOWN_COMPONENTS}>
              {displayBody}
            </ReactMarkdown>
          </section>
        ) : (
          /* When the body is empty or equals the short verbatim (handful of
           * 1-sentence terms like Hydra, Mainnet), still render the definition
           * in <main> so the landmark isn't empty for screen readers and the
           * page has SEO body content beyond breadcrumb + CTA. */
          <p className={styles.bodyFallback}>{term.short}</p>
        )}

        {term.sources && term.sources.length > 0 && (
          <section className={styles.sources}>
            <h2 className={styles.sectionHeading}>
              {translate({ id: 'glossary.term.sources', message: 'Sources' })}
            </h2>
            <ul className={styles.sourcesList}>
              {term.sources.map(source => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {relatedTerms.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.sectionHeading}>
              {translate({ id: 'glossary.term.related', message: 'Related terms' })}
            </h2>
            <ul className={styles.relatedList}>
              {relatedTerms.map(r => (
                <li key={r.slug}>
                  <Link to={`/glossary/${r.slug}`} className={styles.relatedCard}>
                    <span className={styles.relatedTitle}>{r.title}</span>
                    <span className={styles.relatedShort}>{r.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className={styles.improve}>
          <p className={styles.improveCopy}>
            {translate({
              id: 'glossary.term.improve',
              message: 'See an error or want to improve this definition?',
            })}
          </p>
          <a
            className={styles.improveButton}
            href={`https://github.com/cardano-foundation/cardano-org/edit/staging/glossary/${term.slug}.md`}
            target="_blank"
            rel="noreferrer"
          >
            {translate({
              id: 'glossary.term.improveButton',
              message: 'Edit on GitHub',
            })}
          </a>
        </aside>
      </main>
    </Layout>
  );
}
