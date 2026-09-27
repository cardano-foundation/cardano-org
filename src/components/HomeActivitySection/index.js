import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import AppTileCarousel from "@site/src/components/AppTileCarousel";
import { Showcases } from "@site/src/data/apps";
import appStatsData from "@site/src/data/tx-stats.json";
import {
  getAppStats,
  getTopAppPerCategory,
  STATS_GENERATED_AT,
} from "@site/src/utils/appStats";
import { yearsSinceMainnetLaunch } from "@site/src/utils/mainnetAge";
import styles from "./styles.module.css";

// Shows that the network is in use before it explains itself: three figures
// from the build-time transaction snapshot and the most active app of each
// category. No live requests, everything comes from src/data.

// Most active app per trackable category, like the unfiltered /apps view.
const TOP_APPS = getTopAppPerCategory(Showcases).slice(0, 10);

// All mainnet transactions in the snapshot window (six full epochs). Shown
// next to the app figure so the app share is not read as the whole chain.
const CHAIN_TX = appStatsData.metadata?.totalTxCount ?? null;

// Transactions of all listed apps in the snapshot window. Several apps can
// share one stats row, so each row is counted once.
const LISTED_APP_TX = [...new Set(Showcases.map(getAppStats).filter(Boolean))].reduce(
  (sum, row) => sum + row.txCount,
  0
);

export default function HomeActivitySection() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.localeConfigs[i18n.currentLocale]?.htmlLang || i18n.currentLocale;
  const number = new Intl.NumberFormat(locale);
  const snapshotDate = STATS_GENERATED_AT
    ? new Date(`${STATS_GENERATED_AT}T00:00:00Z`).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : null;

  const figures = [
    CHAIN_TX && {
      key: "chainTx",
      value: number.format(CHAIN_TX),
      label: translate({
        id: "home.activity.figure.chainTx",
        message: "transactions on Cardano in the last 30 days",
      }),
    },
    {
      key: "tx",
      value: number.format(LISTED_APP_TX),
      label: translate({
        id: "home.activity.figure.tx",
        message: "of them by showcased apps",
      }),
    },
    {
      key: "apps",
      value: number.format(Showcases.length),
      label: translate({ id: "home.activity.figure.apps", message: "curated apps to explore" }),
    },
    {
      key: "years",
      value: number.format(yearsSinceMainnetLaunch()),
      label: translate({ id: "home.activity.figure.years", message: "years on mainnet" }),
    },
  ].filter(Boolean);

  return (
    <section className={styles.section}>
      <TitleWithText
        title={translate({ id: "home.activity.title", message: "Cardano in use" })}
        description={
          snapshotDate
            ? [
                translate(
                  {
                    id: "apps.mostActive.subtitle",
                    message: "Top apps by on-chain transactions over the last 30 days. Snapshot from {date}.",
                  },
                  { date: snapshotDate }
                ),
              ]
            : undefined
        }
        titleType="black"
        headingDot={true}
      />

      <dl className={styles.figures}>
        {figures.map((figure) => (
          <div key={figure.key} className={styles.figure}>
            <dt className={styles.figureLabel}>{figure.label}</dt>
            <dd className={styles.figureValue}>{figure.value}</dd>
          </div>
        ))}
      </dl>

      <AppTileCarousel
        apps={TOP_APPS}
        ariaLabel={translate({ id: "apps.mostActive.title", message: "Most active" })}
      />

      <p className={styles.ctaRow}>
        <Link className="button button--primary button--lg" to="/apps">
          {translate({ id: "home.featured.buttonLabel", message: "Use Cardano Apps" })}
        </Link>
      </p>
    </section>
  );
}
