import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import clsx from "clsx";

import { Categories, Properties } from "@site/src/data/apps";
import {
  getAppStats,
  isTrackable,
  formatTxCount,
  STATS_GENERATED_AT,
} from "@site/src/utils/appStats";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import AppGrid from "@site/src/components/AppGrid";

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
  });
}

export default function AppDetail({ app }) {
  const iconHref = useBaseUrl(app.icon || "");
  const categoryDef = Categories[app.category];
  const stats = isTrackable(app) ? getAppStats(app) : null;
  const showActivity = stats && stats.txCount > 0;

  const pageTitle = `${app.title} on Cardano`;
  const pageDescription = app.description || `${app.title} on Cardano.`;

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <OpenGraphInfo pageName="apps" />
      <Head>
        <script type="application/ld+json">{buildJsonLd(app)}</script>
      </Head>
      <main className={clsx("container", styles.detail)}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/apps">
            {translate({ id: "apps.detail.backToApps", message: "← All apps" })}
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
            <h1 className={styles.title}>{app.title}</h1>
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
              · developers.cardano.org →
            </span>
          </Link>
        )}

        <div className={styles.actions}>
          <Link
            href={app.website}
            className={clsx("button button--primary button--lg", styles.actionButton)}
          >
            {translate({ id: "apps.detail.visitWebsite", message: "Visit website" })}
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
        </div>

        {showActivity && (
          <section className={styles.activity}>
            <h2 className={styles.sectionHeading}>
              {translate({ id: "apps.detail.activity", message: "Activity" })}
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

        <section className={styles.related}>
          <h2 className={styles.sectionHeading}>
            {translate({
              id: "apps.detail.related",
              message: "More in this category",
            })}
          </h2>
          <AppGrid
            categories={[app.category]}
            limit={4}
            excludeSlug={app.slug}
            ctaText={translate({ id: "apps.detail.visit", message: "Visit" })}
            moreLink={`/apps?tags=${app.category}`}
          />
        </section>

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
