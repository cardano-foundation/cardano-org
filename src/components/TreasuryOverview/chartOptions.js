import { epochStartMs, EPOCHS_PER_YEAR } from "@site/src/utils/insights/treasuryMath.mjs";

const RESERVE_COLOR = "#9a60b4";
const FEE_COLOR = "#91cc75";
const SHARE_COLOR = "#fac858";
const HISTORY_COLOR = "#5470c6";

function axisColor(isDark) {
  return isDark ? "#fff" : "#000";
}

function yearOf(epoch) {
  return new Date(epochStartMs(epoch)).getUTCFullYear();
}

const fmtAda = (v) => `${Math.round(v).toLocaleString()} ada`;

// Labels every second year on the outlook axis.
const EPOCHS_PER_TICK = 2 * EPOCHS_PER_YEAR;

// Room above the plot for the one-row legend plus the y axis name.
const GRID_TOP = 64;

// Single scrollable row so a narrow screen never wraps it over the axis names.
function legend(color) {
  return { type: "scroll", top: 0, textStyle: { color }, pageTextStyle: { color } };
}

// Stacked bars for the two sources plus the fee share as a line on its own axis.
export function incomeOption({ income, isDark, labels }) {
  const c = axisColor(isDark);
  return {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const epoch = params[0]?.axisValue;
        const lines = params.map((p) =>
          `${p.marker}${p.seriesName}: ${p.seriesIndex === 2 ? `${p.value.toFixed(3)}%` : fmtAda(p.value)}`
        );
        return [`${labels.epoch} ${epoch}`, ...lines].join("<br/>");
      },
    },
    legend: legend(c),
    grid: { left: "3%", right: "6%", bottom: "3%", top: GRID_TOP, containLabel: true },
    xAxis: { type: "category", data: income.map((e) => e.epoch), axisLabel: { color: c } },
    yAxis: [
      { type: "value", name: "ada", nameTextStyle: { color: c }, axisLabel: { color: c, formatter: (v) => v.toLocaleString() } },
      { type: "value", name: "%", position: "right", nameTextStyle: { color: SHARE_COLOR }, axisLabel: { color: SHARE_COLOR, formatter: (v) => `${v.toFixed(2)}%` }, splitLine: { show: false } },
    ],
    series: [
      { name: labels.reserves, type: "bar", stack: "income", data: income.map((e) => e.reserveShare), itemStyle: { color: RESERVE_COLOR } },
      { name: labels.fees, type: "bar", stack: "income", data: income.map((e) => e.feeShare), itemStyle: { color: FEE_COLOR } },
      {
        name: labels.feeShare,
        type: "line",
        yAxisIndex: 1,
        showSymbol: false,
        data: income.map((e) => (e.feeShare / (e.feeShare + e.reserveShare)) * 100),
        itemStyle: { color: SHARE_COLOR },
      },
    ],
  };
}

// Reserves history as a solid line, the projection dashed, x axis in epochs
// labelled with calendar years.
export function outlookOption({ points, projection, isDark, labels }) {
  const c = axisColor(isDark);
  return {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const epoch = params[0]?.value?.[0];
        const lines = params.map((p) => `${p.marker}${p.seriesName}: ${fmtAda(p.value[1])}`);
        return [`${labels.epoch} ${epoch} (${yearOf(epoch)})`, ...lines].join("<br/>");
      },
    },
    legend: legend(c),
    grid: { left: "3%", right: "4%", bottom: "3%", top: GRID_TOP, containLabel: true },
    xAxis: {
      type: "value",
      min: points[0]?.epoch,
      max: projection[projection.length - 1]?.epoch,
      // Ticks every two years of epochs, the partial last step is not labelled
      // so it cannot collide with the one before it.
      interval: EPOCHS_PER_TICK,
      axisLabel: { color: c, formatter: (v) => String(yearOf(v)), showMaxLabel: false, hideOverlap: true },
    },
    yAxis: { type: "value", name: "ada", nameTextStyle: { color: c }, axisLabel: { color: c, formatter: (v) => `${(v / 1e9).toFixed(1)}B` } },
    series: [
      { name: labels.history, type: "line", showSymbol: false, data: points.map((p) => [p.epoch, p.reserves]), itemStyle: { color: HISTORY_COLOR } },
      {
        name: labels.projection,
        type: "line",
        showSymbol: false,
        data: projection.map((p) => [p.epoch, p.reserves]),
        lineStyle: { type: "dashed" },
        itemStyle: { color: HISTORY_COLOR },
      },
    ],
  };
}
