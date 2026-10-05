import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import AppTile from "@site/src/components/AppTile";
import { Showcases } from "@site/src/data/apps";
import appStatsData from "@site/src/data/tx-stats.json";
import {
  compareByTxDesc,
  getAppStats,
  getTopAppPerCategory,
  getTxCount,
  isTrackable,
} from "@site/src/utils/appStats";
import { yearsSinceMainnetLaunch } from "@site/src/utils/mainnetAge";
import styles from "./styles.module.css";

// Shows that the network is in use before it explains itself: three figures
// from the build-time transaction snapshot and the most active app of each
// category. No live requests, everything comes from src/data.

// Always three app cards. First the most active app of each trackable
// category whose leader clears MIN_CATEGORY_TX in the snapshot. If fewer
// than three categories qualify, the strongest remaining apps fill up,
// also from a category already shown: weak numbers are worse than a
// repeated category.
const MIN_CATEGORY_TX = 3000;
const TOP_APP_COUNT = 3;

function pickTopApps() {
  const picks = getTopAppPerCategory(Showcases)
    .filter((app) => getTxCount(app) >= MIN_CATEGORY_TX)
    .slice(0, TOP_APP_COUNT);
  const fill = Showcases.filter((app) => isTrackable(app) && getTxCount(app) > 0 && !picks.includes(app))
    .sort(compareByTxDesc)
    .slice(0, TOP_APP_COUNT - picks.length);
  return [...picks, ...fill].sort(compareByTxDesc);
}

const TOP_APPS = pickTopApps();
// The note above the cards may only claim "per category" while it holds.
const ONE_PER_CATEGORY = new Set(TOP_APPS.map((app) => app.category)).size === TOP_APPS.length;

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
  // The figures and apps come from a snapshot, so the note names its exact
  // window instead of "the last 30 days" (the start drops the year when both
  // ends fall in the same year).
  const snapshotWindow = appStatsData.metadata?.reportingWindow;
  // The stats file stores UTC timestamps without a zone suffix.
  const utc = (iso) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`);
  const formatDay = (date, withYear) =>
    date.toLocaleDateString(locale, {
      ...(withYear ? { year: "numeric" } : {}),
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  const windowLabel = snapshotWindow
    ? (() => {
        const start = utc(snapshotWindow.start);
        const end = utc(snapshotWindow.end);
        return {
          start: formatDay(start, start.getUTCFullYear() !== end.getUTCFullYear()),
          end: formatDay(end, true),
        };
      })()
    : null;

  const figures = [
    CHAIN_TX && {
      key: "chainTx",
      value: number.format(CHAIN_TX),
      label: translate({
        id: "home.activity.figure.chainTx",
        message: "transactions on Cardano in 30 days",
      }),
    },
    {
      key: "tx",
      value: number.format(LISTED_APP_TX),
      label: translate({
        id: "home.activity.figure.tx",
        message: "attributed to showcased apps",
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

      {windowLabel && (
        <p className={styles.figuresNote}>
          {translate(
            {
              id: "home.activity.window",
              message: "Snapshot of the 30 days from {start} to {end}.",
            },
            windowLabel
          )}
        </p>
      )}

      <p className={styles.carouselNote}>
        {ONE_PER_CATEGORY
          ? translate({
              id: "home.activity.topApps.note",
              message: "Most active app per category, by on-chain transactions in the same period.",
            })
          : translate({
              id: "home.activity.topApps.noteMixed",
              message: "Most active apps, by on-chain transactions in the same period.",
            })}
      </p>

      <ul
        className={styles.topApps}
        aria-label={translate({ id: "apps.mostActive.title", message: "Most active" })}
      >
        {TOP_APPS.map((app) => (
          <li key={app.slug}>
            <AppTile app={app} showProperties={false} />
          </li>
        ))}
      </ul>

      <p className={styles.ctaRow}>
        <Link className="button button--primary button--lg" to="/apps">
          {translate({ id: "home.featured.buttonLabel", message: "Use Cardano Apps" })}
        </Link>
      </p>
    </section>
  );
}
