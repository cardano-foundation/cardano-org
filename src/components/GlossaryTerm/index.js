import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

import {
  CATEGORIES,
  CATEGORY_DEFAULT_ICONS,
  FEATURED_ICONS,
} from '@site/src/data/glossaryCategories';
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

function pickTermIcon(term) {
  return FEATURED_ICONS[term.slug] || CATEGORY_DEFAULT_ICONS[term.category] || 'book-solid';
}

function MarkdownLink({ href, children }) {
  if (!href) return <>{children}</>;
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <Link to={href}>{children}</Link>;
}

const MARKDOWN_COMPONENTS = {
  a: MarkdownLink,
};

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  const onClick = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked; silently ignore
    }
  }, []);
  return (
    <button
      type="button"
      className={styles.copyLink}
      onClick={onClick}
      aria-label={translate({
        id: 'glossary.term.copyLinkAria',
        message: 'Copy link to this term',
      })}
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        aria-hidden
        focusable="false"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 13a5 5 0 0 0 7.07.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.07-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        />
      </svg>
      <span aria-live="polite">
        {copied
          ? translate({ id: 'glossary.term.copied', message: 'Copied' })
          : translate({ id: 'glossary.term.copyLink', message: 'Copy link' })}
      </span>
    </button>
  );
}

function SidebarRow({ icon, label, children }) {
  return (
    <div className={styles.sideRow}>
      <span className={styles.sideRowIcon} aria-hidden>{icon}</span>
      <div className={styles.sideRowText}>
        <span className={styles.sideRowLabel}>{label}</span>
        <span className={styles.sideRowValue}>{children}</span>
      </div>
    </div>
  );
}

const ICONS = {
  tag: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.07.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.07-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  alias: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="14" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
};

function ExploreNextCard({ term, glossaryBaseUrl, iconBasePath }) {
  const cat = CATEGORIES[term.category];
  const iconName = pickTermIcon(term);
  return (
    <Link
      to={`${glossaryBaseUrl}/${term.slug}`}
      className={styles.exploreCard}
      style={{ '--card-color': cat?.color || 'var(--ifm-color-emphasis-600)' }}
    >
      <span className={styles.exploreCardIcon} aria-hidden>
        <span
          className={styles.exploreCardIconGlyph}
          style={{ '--icon-url': `url(${iconBasePath}${iconName}.svg)` }}
        />
      </span>
      <span className={styles.exploreCardTitle}>{term.title}</span>
      <span className={styles.exploreCardShort}>{term.short}</span>
      <span className={styles.exploreCardCta}>
        {translate({ id: 'glossary.term.viewTerm', message: 'View term' })}
      </span>
    </Link>
  );
}

export default function GlossaryTerm({ term }) {
  // usePluginData returns the plugin's globalData object; null-safe in case the
  // plugin failed to register (e.g. build error in loadContent); we still want
  // the page to render rather than crash the whole route.
  const glossaryData = usePluginData('glossary-routes') || {};
  const terms = glossaryData.terms || [];
  const categoryDef = CATEGORIES[term.category];

  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  const siteUrl = siteConfig.url.replace(/\/$/, '');
  const termUrl = `${siteUrl}${location.pathname.replace(/\/$/, '')}`;
  const glossaryUrl = useBaseUrl('/glossary');
  const glossaryBaseUrl = glossaryUrl.replace(/\/$/, '');
  const glossaryFullUrl = `${siteUrl}${glossaryBaseUrl}`;
  const iconBasePath = useBaseUrl('/img/icons/');

  const relatedTerms = useMemo(() => {
    if (!term.related || term.related.length === 0 || terms.length === 0) return [];
    return term.related
      .map(slug => terms.find(t => t.slug === slug))
      .filter(Boolean);
  }, [term.related, terms]);

  const displayBody = useMemo(() => getDisplayBody(term), [term]);

  const definitionIconName = pickTermIcon(term);

  const pageTitle = `${term.title} | Cardano Glossary`;
  const pageDescription = term.short;

  const linkIsExternal = term.link && /^https?:\/\//.test(term.link);

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
      <main
        className={clsx('container', styles.detail)}
        style={{ '--term-color': categoryDef?.color || 'var(--ifm-color-primary)' }}
      >
        <div className={styles.crumbRow}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link to={glossaryUrl}>
              {translate({ id: 'glossary.crumb.index', message: 'Glossary' })}
            </Link>
            {categoryDef && (
              <>
                <span className={styles.crumbSep} aria-hidden>/</span>
                <Link to={`${glossaryUrl}?category=${term.category}`}>
                  {translate({
                    id: `glossary.category.${term.category}`,
                    message: categoryDef.label,
                  })}
                </Link>
              </>
            )}
            <span className={styles.crumbSep} aria-hidden>/</span>
            <span className={styles.crumbCurrent}>{term.title}</span>
          </nav>
          <CopyLinkButton />
        </div>

        <div className={styles.detailBody}>
          <div className={styles.detailMain}>
            <aside className={styles.definitionCard} aria-label="Definition">
              <span className={styles.definitionIcon} aria-hidden>
                <span
                  className={styles.definitionIconGlyph}
                  style={{ '--icon-url': `url(${iconBasePath}${definitionIconName}.svg)` }}
                />
              </span>
              <div className={styles.definitionText}>
                <span className={styles.definitionLabel}>
                  {translate({ id: 'glossary.term.definition', message: 'Definition' })}
                </span>
                <p className={styles.definitionShort}>{term.short}</p>
              </div>
            </aside>

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

            {displayBody && (
              <section className={styles.body}>
                <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                  {displayBody}
                </ReactMarkdown>
              </section>
            )}

            {term.sources && term.sources.length > 0 && (
              <section className={styles.sources}>
                <h2 className={styles.sectionHeading}>
                  {translate({ id: 'glossary.term.sources', message: 'Sources' })}
                </h2>
                <ul className={styles.sourcesList}>
                  {term.sources.map(source => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className={styles.detailSidebar}>
            {(categoryDef || (term.aliases && term.aliases.length > 0) || relatedTerms.length > 0) && (
              <div className={styles.sideCard}>
                {categoryDef && (
                  <SidebarRow
                    icon={ICONS.tag}
                    label={translate({ id: 'glossary.term.category', message: 'Category' })}
                  >
                    <Link to={`${glossaryUrl}?category=${term.category}`}>
                      {translate({
                        id: `glossary.category.${term.category}`,
                        message: categoryDef.label,
                      })}
                    </Link>
                  </SidebarRow>
                )}
                {term.aliases && term.aliases.length > 0 && (
                  <SidebarRow
                    icon={ICONS.alias}
                    label={translate({ id: 'glossary.term.alsoKnownAs', message: 'Also known as' })}
                  >
                    {term.aliases.join(', ')}
                  </SidebarRow>
                )}
                {relatedTerms.length > 0 && (
                  <SidebarRow
                    icon={ICONS.link}
                    label={translate({ id: 'glossary.term.relatedConcepts', message: 'Related concepts' })}
                  >
                    {relatedTerms.map((r, i) => (
                      <React.Fragment key={r.slug}>
                        {i > 0 && ', '}
                        <Link to={`${glossaryBaseUrl}/${r.slug}`}>{r.title}</Link>
                      </React.Fragment>
                    ))}
                  </SidebarRow>
                )}
              </div>
            )}

            {term.link && (
              <div className={styles.sideCta}>
                <h2 className={styles.sideCtaTitle}>
                  {translate({
                    id: 'glossary.term.learnMoreTitle',
                    message: 'Learn more on Cardano.org',
                  })}
                </h2>
                <p className={styles.sideCtaCopy}>
                  {translate({
                    id: 'glossary.term.learnMoreCopy',
                    message: 'Open the dedicated page that goes deeper on this topic.',
                  })}
                </p>
                {linkIsExternal ? (
                  <a
                    className={styles.sideCtaBtn}
                    href={term.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {translate({
                      id: 'glossary.term.readFullArticle',
                      message: 'Read full article',
                    })}
                    <span className={styles.visuallyHidden}>
                      {translate({
                        id: 'glossary.term.opensInNewTab',
                        message: ' (opens in a new tab)',
                      })}
                    </span>
                  </a>
                ) : (
                  <Link className={styles.sideCtaBtn} to={term.link}>
                    {translate({
                      id: 'glossary.term.readFullArticle',
                      message: 'Read full article',
                    })}
                  </Link>
                )}
              </div>
            )}
          </aside>
        </div>

        {relatedTerms.length > 0 && (
          <section className={styles.exploreNext}>
            <h2 className={styles.exploreNextHeading}>
              {translate({ id: 'glossary.term.exploreNext', message: 'Explore next' })}
            </h2>
            <ul className={styles.exploreNextGrid}>
              {relatedTerms.map(r => (
                <li key={r.slug}>
                  <ExploreNextCard
                    term={r}
                    glossaryBaseUrl={glossaryBaseUrl}
                    iconBasePath={iconBasePath}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className={styles.cantFind}>
          <div className={styles.cantFindIcon} aria-hidden>{ICONS.compass}</div>
          <div className={styles.cantFindText}>
            <h2 className={styles.cantFindTitle}>
              {translate({
                id: 'glossary.term.cantFindTitle',
                message: "Can't find what you're looking for?",
              })}
            </h2>
            <p className={styles.cantFindLead}>
              {translate({
                id: 'glossary.term.cantFindLead',
                message: 'Suggest a term or explore the documentation for in-depth guides.',
              })}
            </p>
          </div>
          <div className={styles.cantFindActions}>
            <a
              href="https://docs.cardano.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cantFindSecondary}
            >
              {translate({ id: 'glossary.term.exploreDocs', message: 'Explore docs' })}
              <span className={styles.visuallyHidden}>
                {translate({
                  id: 'glossary.term.opensInNewTab',
                  message: ' (opens in a new tab)',
                })}
              </span>
            </a>
            <a
              href="https://github.com/cardano-foundation/cardano-org/issues/new?labels=glossary&title=Suggest+glossary+term%3A+"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cantFindPrimary}
            >
              {translate({ id: 'glossary.term.suggestTerm', message: 'Suggest a term' })}
              <span className={styles.visuallyHidden}>
                {translate({
                  id: 'glossary.term.opensInNewTab',
                  message: ' (opens in a new tab)',
                })}
              </span>
            </a>
          </div>
        </aside>

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
