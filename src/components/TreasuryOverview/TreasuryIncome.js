import React, { useMemo, useState } from "react";
import { translate } from "@docusaurus/Translate";
import { useColorMode } from "@docusaurus/theme-common";
import { EPOCHS_PER_YEAR, inEpochWindow } from "@site/src/utils/insights/treasuryMath.mjs";
import useTreasuryModel from "./useTreasuryModel";
import { AdaFigure, TextFigure, Skeleton, LiveDataError } from "./figures";
import TreasuryChart from "./TreasuryChart";
import { incomeOption, feeShareOption } from "./chartOptions";
import styles from "./styles.module.css";

// Two years of epochs for the default income chart range.
const CHART_RANGE = 2 * EPOCHS_PER_YEAR;

export default function TreasuryIncome() {
  const { status, model } = useTreasuryModel();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [showAll, setShowAll] = useState(false);

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
          label={translate({ id: "governance.treasury.funding.feeShare", message: "Fee share" })}
          sub={translate({ id: "governance.treasury.funding.feeShareSub", message: "Of treasury income, last 12 months" })}
        />
        <AdaFigure
          loading={loading}
          value={model?.latest.reserves}
          label={translate({ id: "governance.treasury.funding.reserves", message: "Protocol reserves" })}
          sub={translate({ id: "governance.treasury.funding.reservesSub", message: "Not part of the treasury" })}
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
    </>
  );
}
