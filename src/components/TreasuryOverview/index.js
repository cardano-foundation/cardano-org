import React, { useEffect, useMemo, useState } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { useColorMode } from "@docusaurus/theme-common";
import { scrollToElement } from "@site/src/utils/jsUtils";
import useCountUp from "@site/src/utils/useCountUp";
import { formatAdaValue } from "@site/src/utils/insights/numbers";
import {
  TREASURY_PARAMS,
  incomeBySource,
  inEpochWindow,
  feeSharePercent,
  reserveToFeeRatio,
  effectiveDepletionRate,
  projectReserves,
  firstEpochOfYear,
  projectedReserveIncome,
  feesNeededToReplace,
} from "@site/src/utils/insights/treasuryMath.mjs";
import useTreasuryTotals from "./useTreasuryTotals";
import TreasuryChart from "./TreasuryChart";
import { incomeOption, outlookOption } from "./chartOptions";
import styles from "./styles.module.css";

const CHART_RANGE = 146;
const OUTLOOK_YEARS = [2030, 2035, 2040];

// "..." while loading, "n/a" only when the data is there but the figure
// cannot be computed.
function display(loading, value, format) {
  if (loading) return "...";
  return value == null ? "n/a" : format(value);
}

function AdaFigure({ loading, value, label }) {
  const animated = useCountUp(value);
  return (
    <div className={styles.figure}>
      <span className={styles.value}>{display(loading, value, () => formatAdaValue(animated))}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

function TextFigure({ loading, value, label }) {
  return (
    <div className={styles.figure}>
      <span className={styles.value}>{display(loading, value, (v) => v)}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

function Skeleton() {
  return <div className={styles.skeleton} aria-busy="true" />;
}

export default function TreasuryOverview() {
  const { status, points } = useTreasuryTotals();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [showAll, setShowAll] = useState(false);

  const model = useMemo(() => {
    if (status !== "ready") return null;
    const income = incomeBySource(points);
    const latest = points[points.length - 1];
    const rate = effectiveDepletionRate(points);
    const endEpoch = firstEpochOfYear(OUTLOOK_YEARS[OUTLOOK_YEARS.length - 1] + 1) - 1;
    const projection = projectReserves(latest.epoch, latest.reserves, rate, endEpoch);
    const byEpoch = new Map(projection.map((p) => [p.epoch, p.reserves]));
    const outlook = OUTLOOK_YEARS.map((year) => {
      const reserves = byEpoch.get(firstEpochOfYear(year));
      return { year, income: reserves == null ? null : projectedReserveIncome(reserves) };
    });
    return {
      income,
      latest,
      rate,
      projection,
      outlook,
      feeShare: feeSharePercent(income, latest.epoch),
      ratio: reserveToFeeRatio(income, latest.epoch),
      feesNeeded: feesNeededToReplace(income, latest.epoch),
      latestFees: latest.fees,
    };
  }, [status, points]);

  // The boards push the donation tool down once they render. Deep links such
  // as /governance/treasury#donate scrolled before that, so scroll once more.
  useEffect(() => {
    if (status === "loading" || !window.location.hash) return;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target) scrollToElement(target);
  }, [status]);

  if (status === "error") {
    return (
      <div className={styles.errorBox} role="alert">
        {translate({ id: "governance.treasury.overview.error", message: "Live treasury data is unavailable right now." })}{" "}
        <Link to="/insights/supply/summary#treasury">
          {translate({ id: "governance.treasury.overview.errorLink", message: "See the supply insights instead." })}
        </Link>
      </div>
    );
  }

  const epochLabel = translate({ id: "governance.treasury.overview.chart.epoch", message: "Epoch" });
  const loading = !model;
  const incomeShown = model ? (showAll ? model.income : inEpochWindow(model.income, model.latest.epoch, CHART_RANGE)) : [];

  return (
    <>
      <div className={styles.strip}>
        <AdaFigure
          loading={loading}
          value={model?.latest.treasury}
          label={translate({ id: "governance.treasury.overview.stat.treasury", message: "Treasury" })}
        />
        <AdaFigure
          loading={loading}
          value={model?.latest.reserves}
          label={translate({ id: "governance.treasury.overview.stat.reserves", message: "Reserves remaining" })}
        />
        <TextFigure
          loading={loading}
          value={model?.feeShare == null ? null : `${model.feeShare.toFixed(2)}%`}
          label={translate({ id: "governance.treasury.overview.stat.feeShare", message: "Share of income from fees" })}
        />
        <TextFigure
          loading={loading}
          value={model ? String(model.latest.epoch) : null}
          label={translate({ id: "governance.treasury.overview.stat.epoch", message: "Current epoch" })}
        />
      </div>
      <p className={styles.note}>
        {translate({
          id: "governance.treasury.overview.stat.note",
          message: "The fee share covers the treasury's reward income over the last 12 months, excluding donations.",
        })}
      </p>

      <section id="income" className={styles.board}>
        <h2>{translate({ id: "governance.treasury.overview.income.title", message: "Where the treasury's income comes from" })}</h2>
        <p>
          {translate({
            id: "governance.treasury.overview.income.intro",
            message: "Each bar is the treasury's share of one epoch's reward pot, split by source.",
          })}
        </p>
        <div className={styles.toggle} role="group">
          <button type="button" className={showAll ? styles.toggleButton : styles.toggleActive} onClick={() => setShowAll(false)}>
            {translate({ id: "governance.treasury.overview.income.range.recent", message: "Last 2 years" })}
          </button>
          <button type="button" className={showAll ? styles.toggleActive : styles.toggleButton} onClick={() => setShowAll(true)}>
            {translate({ id: "governance.treasury.overview.income.range.all", message: "All epochs" })}
          </button>
        </div>
        {model ? (
          <TreasuryChart
            ariaLabel={translate({ id: "governance.treasury.overview.income.aria", message: "Treasury income per epoch from reserves and from fees" })}
            option={incomeOption({
              income: incomeShown,
              isDark,
              labels: {
                epoch: epochLabel,
                reserves: translate({ id: "governance.treasury.overview.income.series.reserves", message: "From reserves" }),
                fees: translate({ id: "governance.treasury.overview.income.series.fees", message: "From fees" }),
                feeShare: translate({ id: "governance.treasury.overview.income.series.feeShare", message: "Fee share (%)" }),
              },
            })}
          />
        ) : (
          <Skeleton />
        )}
        <p className={styles.ratio}>
          {model?.ratio != null &&
            translate(
              {
                id: "governance.treasury.overview.income.ratio",
                message: "Over the last 12 months, the reserves contributed about {ratio} times as much to the treasury as transaction fees.",
              },
              { ratio: Math.round(model.ratio).toLocaleString() }
            )}
        </p>
        <p className={styles.note}>
          {translate({
            id: "governance.treasury.overview.income.method",
            message: "Calculated from the protocol parameters τ (treasury cut) and ρ (monetary expansion). Actual on-chain treasury changes match within a few percent in epochs without withdrawals or donations.",
          })}
        </p>
      </section>

      <section id="outlook" className={styles.board}>
        <h2>{translate({ id: "governance.treasury.overview.outlook.title", message: "Reserves outlook" })}</h2>
        <p>
          {translate({
            id: "governance.treasury.overview.outlook.intro",
            message: "The reserves shrink a little every epoch. The dashed line shows where they would be if the pace of the last 12 months continued.",
          })}
        </p>
        {model ? (
          <TreasuryChart
            ariaLabel={translate({ id: "governance.treasury.overview.outlook.aria", message: "Reserves over time with a projection" })}
            option={outlookOption({
              points,
              projection: model.projection,
              isDark,
              labels: {
                epoch: epochLabel,
                history: translate({ id: "governance.treasury.overview.outlook.series.history", message: "Reserves" }),
                projection: translate({ id: "governance.treasury.overview.outlook.series.projection", message: "Projection at the recent pace" }),
              },
            })}
          />
        ) : (
          <Skeleton />
        )}
        <div className={styles.outlookGrid}>
          {(model?.outlook || OUTLOOK_YEARS.map((year) => ({ year, income: null }))).map(({ year, income }) => (
            <AdaFigure
              key={year}
              loading={loading}
              value={income}
              label={translate(
                { id: "governance.treasury.overview.outlook.yearIncome", message: "Treasury income from reserves per epoch in {year}" },
                { year }
              )}
            />
          ))}
          <AdaFigure
            loading={loading}
            value={model?.feesNeeded}
            label={translate({ id: "governance.treasury.overview.outlook.feesNeeded", message: "Fees per epoch needed to match today's reserve income" })}
          />
          <AdaFigure
            loading={loading}
            value={model?.latestFees}
            label={translate({ id: "governance.treasury.overview.outlook.actualFees", message: "Actual fees in the last completed epoch" })}
          />
        </div>
        <details className={styles.method}>
          <summary>{translate({ id: "governance.treasury.overview.outlook.method.title", message: "How this projection works" })}</summary>
          <p>
            {translate(
              {
                id: "governance.treasury.overview.outlook.method.body",
                message: "The projection uses the median rate at which the reserves shrank per epoch over the last 12 months ({rate}%). That rate is lower than ρ ({rho}%) because rewards that are not paid out return to the reserves. It assumes the protocol parameters and staking behavior stay as they are and does not model any growth in fees. It illustrates the current trend and makes no prediction.",
              },
              {
                rate: model?.rate == null ? "n/a" : (model.rate * 100).toFixed(3),
                rho: (TREASURY_PARAMS.rho * 100).toFixed(1),
              }
            )}
          </p>
        </details>
      </section>
    </>
  );
}
