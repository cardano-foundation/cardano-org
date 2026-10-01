import React, { useMemo, useState } from "react";
import { translate } from "@docusaurus/Translate";
import { useColorMode } from "@docusaurus/theme-common";
import {
  TREASURY_PARAMS,
  EPOCHS_PER_YEAR,
  incomeBySource,
  inEpochWindow,
  feeSharePercent,
  effectiveDepletionRate,
  projectReserves,
  firstEpochOfYear,
  projectedReserveIncome,
} from "@site/src/utils/insights/treasuryMath.mjs";
import { useTreasuryTotals } from "./useTreasuryData";
import { AdaFigure, TextFigure, Skeleton, LiveDataError } from "./figures";
import TreasuryChart from "./TreasuryChart";
import { incomeOption, feeShareOption, outlookOption } from "./chartOptions";
import styles from "./styles.module.css";

// Two years of epochs for the default income chart range.
const CHART_RANGE = 2 * EPOCHS_PER_YEAR;
const OUTLOOK_YEARS = [2030, 2035, 2040];

export default function TreasuryFunding() {
  const { status, data: points } = useTreasuryTotals();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [showAll, setShowAll] = useState(false);
  // ECharts cannot size itself inside a closed <details>, so the outlook chart
  // mounts only while it is open.
  const [outlookOpen, setOutlookOpen] = useState(false);

  const model = useMemo(() => {
    if (status !== "ready") return null;
    const income = incomeBySource(points);
    const latest = points.at(-1);
    const rate = effectiveDepletionRate(points);
    const endEpoch = firstEpochOfYear(OUTLOOK_YEARS[OUTLOOK_YEARS.length - 1] + 1) - 1;
    const projection = projectReserves(latest.epoch, latest.reserves, rate, endEpoch);
    const byEpoch = new Map(projection.map((p) => [p.epoch, p.reserves]));
    const outlook = OUTLOOK_YEARS.map((year) => {
      const reserves = byEpoch.get(firstEpochOfYear(year));
      return { year, income: reserves == null ? null : projectedReserveIncome(reserves) };
    });
    return { income, latest, rate, projection, outlook, feeShare: feeSharePercent(income, latest.epoch) };
  }, [status, points]);

  // Rebuilt only when data, range or theme change, so re-renders do not
  // redraw the charts.
  const incomeShown = useMemo(() => {
    if (!model) return [];
    return showAll ? model.income : inEpochWindow(model.income, model.latest.epoch, CHART_RANGE);
  }, [model, showAll]);

  const incomeChart = useMemo(() => {
    if (!model) return null;
    return incomeOption({
      income: incomeShown,
      isDark,
      labels: {
        epoch: translate({ id: "governance.treasury.overview.chart.epoch", message: "Epoch" }),
        reserves: translate({ id: "governance.treasury.overview.income.series.reserves", message: "From reserves" }),
        fees: translate({ id: "governance.treasury.overview.income.series.fees", message: "From fees" }),
      },
    });
  }, [model, incomeShown, isDark]);

  const feeShareChart = useMemo(() => {
    if (!model) return null;
    return feeShareOption({
      income: incomeShown,
      isDark,
      labels: {
        epoch: translate({ id: "governance.treasury.overview.chart.epoch", message: "Epoch" }),
        feeShare: translate({ id: "governance.treasury.overview.income.series.feeShare", message: "Fee share (%)" }),
      },
    });
  }, [model, incomeShown, isDark]);

  const outlookChart = useMemo(() => {
    if (!model) return null;
    return outlookOption({
      points,
      projection: model.projection,
      isDark,
      labels: {
        epoch: translate({ id: "governance.treasury.overview.chart.epoch", message: "Epoch" }),
        history: translate({ id: "governance.treasury.overview.outlook.series.history", message: "Reserves" }),
        projection: translate({ id: "governance.treasury.overview.outlook.series.projection", message: "Projection based on the past 12 months" }),
      },
    });
  }, [model, points, isDark]);

  if (status === "error") {
    return <LiveDataError message={translate({ id: "governance.treasury.overview.error", message: "Live treasury data is unavailable right now." })} />;
  }

  const loading = !model;

  return (
    <>
      <div className={styles.fundingGrid}>
        <TextFigure
          loading={loading}
          value={model?.feeShare == null ? null : `${model.feeShare.toFixed(2)}%`}
          label={translate({ id: "governance.treasury.funding.feeShare", message: "Share of treasury income from fees, last 12 months" })}
        />
        <AdaFigure
          loading={loading}
          value={model?.latest.reserves}
          label={translate({ id: "governance.treasury.funding.reserves", message: "Protocol reserves, not part of the treasury" })}
        />
      </div>
      <p className={styles.note}>
        {translate({
          id: "governance.treasury.funding.context",
          message: "This share reflects how rewards are funded. Fees per transaction on Cardano are low by design, so the share says little about how much the network is used.",
        })}
      </p>

      <h3 className={styles.subTitle}>
        {translate({ id: "governance.treasury.funding.incomeTitle", message: "Treasury income per epoch by source" })}
      </h3>
      <p>
        {translate({
          id: "governance.treasury.overview.income.intro",
          message: "Each bar is the treasury's share of one epoch's reward pot, split by source.",
        })}
      </p>
      <div className={styles.toggle} role="group">
        <button type="button" className={showAll ? styles.toggleButton : styles.toggleActive} onClick={() => setShowAll(false)}>
          {translate({ id: "governance.treasury.overview.income.range.recent", message: "Last two years" })}
        </button>
        <button type="button" className={showAll ? styles.toggleActive : styles.toggleButton} onClick={() => setShowAll(true)}>
          {translate({ id: "governance.treasury.overview.income.range.all", message: "All epochs" })}
        </button>
      </div>
      {model ? (
        <TreasuryChart
          ariaLabel={translate({ id: "governance.treasury.overview.income.aria", message: "Treasury income per epoch from reserves and from fees" })}
          option={incomeChart}
        />
      ) : (
        <Skeleton />
      )}
      <h3 className={styles.subTitle}>
        {translate({ id: "governance.treasury.overview.feeShare.title", message: "Share of treasury income from fees (%)" })}
      </h3>
      {model ? (
        <TreasuryChart
          height={240}
          ariaLabel={translate({ id: "governance.treasury.overview.feeShare.aria", message: "Fee share of the treasury's income per epoch, in percent" })}
          option={feeShareChart}
        />
      ) : (
        <Skeleton height={240} />
      )}
      <p className={styles.note}>
        {translate({
          id: "governance.treasury.overview.income.method",
          message: "Calculated from transaction fees, the reserves and two protocol parameters: τ, the treasury's share of the reward pot, and ρ, the share of the reserves released each epoch. On-chain treasury changes match within a few percent in epochs without withdrawals or donations.",
        })}
      </p>

      <details className={styles.outlook} onToggle={(e) => setOutlookOpen(e.currentTarget.open)}>
        <summary>{translate({ id: "governance.treasury.funding.outlookSummary", message: "Long-term outlook for the reserves" })}</summary>
        <p>
          {translate({
            id: "governance.treasury.overview.outlook.intro",
            message: "The reserves shrink a little every epoch. The dashed line shows where they would be if the pace of the last 12 months continued.",
          })}
        </p>
        {outlookOpen &&
          (model ? (
            <TreasuryChart
              ariaLabel={translate({ id: "governance.treasury.overview.outlook.aria", message: "Reserves over time with a projection" })}
              option={outlookChart}
            />
          ) : (
            <Skeleton />
          ))}
        <div className={styles.outlookGrid}>
          {(model?.outlook || OUTLOOK_YEARS.map((year) => ({ year, income: null }))).map(({ year, income }) => (
            <AdaFigure
              key={year}
              loading={loading}
              value={income}
              label={translate(
                { id: "governance.treasury.overview.outlook.yearIncome", message: "Estimated treasury income from reserves per epoch at the start of {year}" },
                { year }
              )}
            />
          ))}
        </div>
        <p className={styles.note}>
          {translate(
            {
              id: "governance.treasury.overview.outlook.method.body",
              message: "The projection uses the median rate at which the reserves shrank per epoch over the last 12 months ({rate}%), the middle value of those epochs. That rate is lower than ρ ({rho}%) because rewards that are not paid out return to the reserves. It assumes that this rate, the protocol parameters and transaction fees stay as they are.",
            },
            {
              rate: model?.rate == null ? "n/a" : (model.rate * 100).toFixed(3),
              rho: (TREASURY_PARAMS.rho * 100).toFixed(1),
            }
          )}
        </p>
      </details>
    </>
  );
}
