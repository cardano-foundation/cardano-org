import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import clsx from "clsx";

import { Categories, Properties, Showcases } from "@site/src/data/apps";
import {
  getAppStats,
  isTrackable,
  formatTxCount,
  STATS_GENERATED_AT,
} from "@site/src/utils/appStats";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SiteHero from "@site/src/components/Layout/SiteHero";
import AppTile from "@site/src/components/AppTile";

import styles from "./styles.module.css";

const APPS_JS_GITHUB_URL =
  "https://github.com/cardano-foundation/cardano-org/blob/staging/src/data/apps.js";

function buildJsonLd(app) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.title,
    description: app.description,
    url: app.website,
    applicationCategory: Categories[app.category].label,
    ...(app.source ? { codeRepository: app.source } : {}),
    ...(app.x ? { sameAs: [`https://x.com/${app.x}`] } : {}),
  });
}

const RELATED_LIMIT = 4;

function getRelatedApps(currentApp) {
  return Showcases
    .filter((s) => s.category === currentApp.category && s.slug !== currentApp.slug)
    .sort((a, b) => {
      const txDiff = (getAppStats(b)?.txCount ?? 0) - (getAppStats(a)?.txCount ?? 0);
      return txDiff !== 0 ? txDiff : a.title.localeCompare(b.title);
    })
    .slice(0, RELATED_LIMIT);
}

export default function AppDetail({ app }) {
  const iconHref = useBaseUrl(app.icon || "");
  const categoryDef = Categories[app.category];
  const stats = isTrackable(app) ? getAppStats(app) : null;
  const showActivity = stats && stats.txCount > 0;
  const relatedApps = getRelatedApps(app);

  const pageTitle = `${app.title} on Cardano`;
  const pageDescription = app.description;

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <OpenGraphInfo
        pageName="apps"
        title={pageTitle}
        description={pageDescription}
      />
      <Head>
        <script type="application/ld+json">{buildJsonLd(app)}</script>
      </Head>
      <SiteHero title={app.title} description={app.tagline} bannerType="apps.js" />
      <main className={clsx("container", styles.detail)}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/apps">
            {translate({ id: "apps.detail.backToApps", message: "Back to apps" })}
          </Link>
        </nav>

        <header className={styles.header}>
          {app.icon ? (
            <img src={iconHref} alt="" className={styles.icon} aria-hidden />
          ) : (
            <div className={styles.iconFallback} aria-hidden>
              {app.title.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={styles.headerText}>
            <div className={styles.tagRow}>
              {categoryDef && (
                <span
                  className={styles.categoryChip}
                  style={{ backgroundColor: categoryDef.color }}
                  title={categoryDef.description}
                >
                  {categoryDef.label}
                </span>
              )}
              {app.properties.map((p) => {
                const def = Properties[p];
                if (!def) return null;
                return (
                  <span key={p} className={styles.propertyPill} title={def.description}>
                    <span
                      className={styles.propertyDot}
                      style={{ backgroundColor: def.color }}
                    />
                    {def.label}
                  </span>
                );
              })}
              {app.maintainerPick && (
                <span className={styles.pickBadge}>
                  {translate({
                    id: "apps.detail.maintainerPick",
                    message: "Maintainer pick",
                  })}
                </span>
              )}
            </div>
          </div>
        </header>

        <p className={styles.description}>{app.description}</p>

        {app.spotlight && (
          <Link
            href={app.spotlight.url}
            className={styles.spotlight}
            aria-label={translate({
              id: "apps.detail.spotlight.aria",
              message: "Open Developer Spotlight on developers.cardano.org",
            })}
          >
            <span className={styles.spotlightLabel}>
              {translate({
                id: "apps.detail.spotlight.label",
                message: "Developer Spotlight",
              })}
            </span>
            <span className={styles.spotlightTitle}>
              {app.spotlight.title}
            </span>
            <span className={styles.spotlightMeta}>
              {new Date(app.spotlight.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · developers.cardano.org
            </span>
          </Link>
        )}

        <div className={styles.actions}>
          <Link
            href={app.website}
            className={clsx("button button--primary button--lg", styles.actionButton)}
          >
            {translate(
              { id: "apps.detail.visit", message: "Visit {title}" },
              { title: app.title }
            )}
          </Link>
          {app.source && (
            <Link
              href={app.source}
              className={clsx(
                "button button--secondary button--lg",
                styles.actionButton
              )}
            >
              {translate({ id: "apps.detail.viewSource", message: "View source" })}
            </Link>
          )}
          {app.x && (
            <Link
              href={`https://x.com/${app.x}`}
              className={clsx("button button--secondary button--lg", styles.xButton)}
              aria-label={translate(
                {
                  id: "apps.detail.viewOnX.aria",
                  message: "View {title} on X (Twitter)",
                },
                { title: app.title }
              )}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </Link>
          )}
        </div>

        {showActivity && (
          <section className={styles.activity}>
            <h2 className={styles.sectionHeading}>
              {translate({ id: "apps.detail.activity", message: "Activity" })}
              <span className={styles.activityDot} aria-hidden />
            </h2>
            <p className={styles.activityCopy}>
              {translate(
                {
                  id: "apps.detail.activityBody",
                  message:
                    "{count} on-chain transactions in the last 30 days (snapshot {date}).",
                },
                {
                  count: formatTxCount(stats.txCount),
                  date: STATS_GENERATED_AT ?? "n/a",
                }
              )}
            </p>
          </section>
        )}

        {relatedApps.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.sectionHeading}>
              {translate({
                id: "apps.detail.related",
                message: "More in this category",
              })}
            </h2>
            <ul className={styles.relatedGrid}>
              {relatedApps.map((related) => (
                <li key={related.slug}>
                  <AppTile app={related} />
                </li>
              ))}
            </ul>
            <Link
              className={styles.relatedMore}
              to={`/apps?tags=${app.category}`}
            >
              {translate(
                {
                  id: "apps.detail.relatedMore",
                  message: "View all {category} apps",
                },
                { category: categoryDef?.label ?? app.category }
              )}
            </Link>
          </section>
        )}

        <footer className={styles.footer}>
          <Link href={APPS_JS_GITHUB_URL}>
            {translate({
              id: "apps.detail.editLink",
              message: "Improve this entry on GitHub",
            })}
          </Link>
        </footer>
      </main>
    </Layout>
  );
}
