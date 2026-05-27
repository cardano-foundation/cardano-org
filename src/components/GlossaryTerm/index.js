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

        {term.link && (/^https?:\/\//.test(term.link) ? (
          <a
            href={term.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fullPageCta}
          >
            {translate({
              id: 'glossary.term.openFullPage',
              message: 'Open dedicated page',
            })}
            <span className={styles.visuallyHidden}>
              {translate({
                id: 'glossary.term.opensInNewTab',
                message: ' (opens in a new tab)',
              })}
            </span>
          </a>
        ) : (
          <Link to={term.link} className={styles.fullPageCta}>
            {translate({
              id: 'glossary.term.openFullPage',
              message: 'Open dedicated page',
            })}
          </Link>
        ))}

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
          <div className={styles.improveIcon} aria-hidden>
            <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
              <path
                fill="currentColor"
                d="M12 3 2 8l10 5 10-5-10-5zm-8 9.5L12 17l8-4.5 2 1L12 19 2 13.5l2-1zm0 4L12 21l8-4.5 2 1L12 23 2 17.5l2-1z"
              />
            </svg>
          </div>
          <h2 className={styles.improveHeading}>
            {translate({
              id: 'glossary.term.improveHeading',
              message: 'Spotted something off?',
            })}
          </h2>
          <p className={styles.improveCopy}>
            {translate({
              id: 'glossary.term.improveCopy',
              message:
                'This glossary is open source. Submit a pull request to update or correct this definition.',
            })}
          </p>
          <a
            className={styles.improveButton}
            href={`https://github.com/cardano-foundation/cardano-org/edit/staging/glossary/${term.slug}.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
              <path
                fill="currentColor"
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.05c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.94 10.94 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.05.78 2.13v3.16c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
              />
            </svg>
            {translate(
              {
                id: 'glossary.term.improveButton',
                message: 'Edit {title} on GitHub',
              },
              { title: term.title },
            )}
          </a>
        </aside>
      </main>
    </Layout>
  );
}
