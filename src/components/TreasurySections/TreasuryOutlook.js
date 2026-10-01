import React, { useMemo } from "react";
import { translate } from "@docusaurus/Translate";
import { useColorMode } from "@docusaurus/theme-common";
import { TREASURY_PARAMS } from "@site/src/utils/insights/treasuryMath.mjs";
import useTreasuryModel, { OUTLOOK_YEARS } from "./useTreasuryModel";
import { AdaFigure, Skeleton, LiveDataError } from "./figures";
import TreasuryChart from "./TreasuryChart";
import { outlookOption } from "./chartOptions";
import styles from "./styles.module.css";

export default function TreasuryOutlook() {
  const { status, points, model } = useTreasuryModel();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

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
      {model ? (
        <TreasuryChart
          ariaLabel={translate({ id: "governance.treasury.overview.outlook.aria", message: "Reserves over time with a projection" })}
          option={outlookChart}
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
            label={String(year)}
            sub={translate({ id: "governance.treasury.overview.outlook.yearIncome", message: "Estimated income from reserves per epoch" })}
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
    </>
  );
}
