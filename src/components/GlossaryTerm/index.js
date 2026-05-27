import React, { useMemo } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { translate } from '@docusaurus/Translate';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

import { CATEGORIES } from '@site/src/data/glossaryCategories';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';

import styles from './styles.module.css';

const SITE_URL = 'https://cardano.org';

function buildJsonLd(term, allTerms) {
  const termUrl = `${SITE_URL}/glossary/${term.slug}`;
  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.title,
    description: term.short,
    url: termUrl,
    termCode: term.slug,
    inDefinedTermSet: `${SITE_URL}/glossary`,
    ...(term.aliases && term.aliases.length ? { alternateName: term.aliases } : {}),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Cardano', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Glossary', item: `${SITE_URL}/glossary` },
      { '@type': 'ListItem', position: 3, name: term.title, item: termUrl },
    ],
  };
  return [
    <script key="defined" type="application/ld+json">
      {JSON.stringify(definedTerm)}
    </script>,
    <script key="crumb" type="application/ld+json">
      {JSON.stringify(breadcrumb)}
    </script>,
  ];
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
  const { terms } = usePluginData('glossary-routes');
  const categoryDef = CATEGORIES[term.category];

  const relatedTerms = useMemo(() => {
    if (!term.related || term.related.length === 0) return [];
    const bySlug = new Map(terms.map(t => [t.slug, t]));
    return term.related
      .map(slug => bySlug.get(slug))
      .filter(Boolean);
  }, [term.related, terms]);

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
      <Head>{buildJsonLd(term, terms)}</Head>
      <main className={clsx('container', styles.detail)}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/glossary">
            {translate({ id: 'glossary.crumb.index', message: 'Glossary' })}
          </Link>
          {categoryDef && (
            <>
              <span className={styles.crumbSep} aria-hidden>/</span>
              <Link to={`/glossary?category=${term.category}`}>
                {translate({ id: `glossary.category.${term.category}`, message: categoryDef.label })}
              </Link>
            </>
          )}
          <span className={styles.crumbSep} aria-hidden>/</span>
          <span className={styles.crumbCurrent}>{term.title}</span>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>{term.title}</h1>
          {term.aliases && term.aliases.length > 0 && (
            <p className={styles.aliases}>
              <span className={styles.aliasesLabel}>
                {translate({ id: 'glossary.term.alsoKnownAs', message: 'Also known as' })}:
              </span>{' '}
              {term.aliases.join(', ')}
            </p>
          )}
        </header>

        <p className={styles.short}>{term.short}</p>

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

        {term.body && term.body !== term.short && (
          <section className={styles.body}>
            <ReactMarkdown components={MARKDOWN_COMPONENTS}>
              {term.body}
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
          <Link
            className={styles.improveButton}
            href={`https://github.com/cardano-foundation/cardano-org/edit/staging/glossary/${term.slug}.md`}
          >
            {translate({
              id: 'glossary.term.improveButton',
              message: 'Edit on GitHub',
            })}
          </Link>
        </aside>
      </main>
    </Layout>
  );
}
