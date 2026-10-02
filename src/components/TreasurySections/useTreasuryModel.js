import { useMemo } from "react";
import {
  incomeBySource,
  feeSharePercent,
  effectiveDepletionRate,
  projectReserves,
  firstEpochOfYear,
  projectedReserveIncome,
} from "@site/src/utils/insights/treasuryMath.mjs";
import { useTreasuryTotals } from "./useTreasuryData";

export const OUTLOOK_YEARS = [2030, 2035, 2040];

// Income split, fee share and reserves projection from /totals, shared by the
// income and outlook sections.
export default function useTreasuryModel() {
  const { status, data: points } = useTreasuryTotals();
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
  return { status, points, model };
}
