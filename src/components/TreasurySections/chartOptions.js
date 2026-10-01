import { epochStartMs, EPOCHS_PER_YEAR } from "@site/src/utils/insights/treasuryMath.mjs";

// Slots 1 and 2 of the validated categorical palette (blue, orange), stepped
// per mode. Reserves are blue in every chart, fees orange.
const COLORS = {
  light: { reserves: "#2a78d6", fees: "#eb6834", grid: "#e5e5e3" },
  dark: { reserves: "#3987e5", fees: "#d95926", grid: "#3a3a38" },
};

function palette(isDark) {
  return isDark ? COLORS.dark : COLORS.light;
}

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

// Stacked bars for the two sources, one axis in ada.
export function incomeOption({ income, isDark, labels }) {
  const c = axisColor(isDark);
  const colors = palette(isDark);
  return {
    tooltip: {
      trigger: "axis",
      // Keep the box inside the chart so it is never cut off on narrow screens.
      confine: true,
      formatter: (params) => {
        const epoch = params[0]?.axisValue;
        const lines = params.map((p) => `${p.marker}${p.seriesName}: ${fmtAda(p.value)}`);
        return [`${labels.epoch} ${epoch}`, ...lines].join("<br/>");
      },
    },
    legend: legend(c),
    grid: { left: "3%", right: "4%", bottom: "3%", top: GRID_TOP, containLabel: true },
    xAxis: { type: "category", data: income.map((e) => e.epoch), axisLabel: { color: c } },
    yAxis: {
      type: "value",
      name: "ada",
      nameTextStyle: { color: c },
      axisLabel: { color: c, formatter: (v) => v.toLocaleString() },
      splitLine: { lineStyle: { color: colors.grid } },
    },
    series: [
      { name: labels.reserves, type: "bar", stack: "income", data: income.map((e) => e.reserveShare), itemStyle: { color: colors.reserves } },
      { name: labels.fees, type: "bar", stack: "income", data: income.map((e) => e.feeShare), itemStyle: { color: colors.fees } },
    ],
  };
}

// Fee share of each epoch's treasury income in percent, its own chart so it
// never shares an axis with the ada bars.
export function feeShareOption({ income, isDark, labels }) {
  const c = axisColor(isDark);
  const colors = palette(isDark);
  return {
    tooltip: {
      trigger: "axis",
      // Keep the box inside the chart so it is never cut off on narrow screens.
      confine: true,
      formatter: (params) => `${labels.epoch} ${params[0]?.axisValue}<br/>${params[0].marker}${labels.feeShare}: ${params[0].value.toFixed(3)}%`,
    },
    grid: { left: "3%", right: "4%", bottom: "3%", top: 32, containLabel: true },
    xAxis: { type: "category", data: income.map((e) => e.epoch), axisLabel: { color: c } },
    yAxis: {
      type: "value",
      name: "%",
      nameTextStyle: { color: c },
      axisLabel: { color: c, formatter: (v) => `${v.toFixed(2)}%` },
      splitLine: { lineStyle: { color: colors.grid } },
    },
    series: [
      {
        name: labels.feeShare,
        type: "line",
        showSymbol: false,
        lineStyle: { width: 2 },
        data: income.map((e) => (e.feeShare / (e.feeShare + e.reserveShare)) * 100),
        itemStyle: { color: colors.fees },
      },
    ],
  };
}

// Reserves history as a solid line, the projection dashed, x axis in epochs
// labelled with calendar years.
export function outlookOption({ points, projection, isDark, labels }) {
  const c = axisColor(isDark);
  const colors = palette(isDark);
  return {
    tooltip: {
      trigger: "axis",
      // Keep the box inside the chart so it is never cut off on narrow screens.
      confine: true,
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
    yAxis: {
      type: "value",
      name: "ada",
      nameTextStyle: { color: c },
      axisLabel: { color: c, formatter: (v) => `${(v / 1e9).toFixed(1)}B` },
      splitLine: { lineStyle: { color: colors.grid } },
    },
    series: [
      { name: labels.history, type: "line", showSymbol: false, data: points.map((p) => [p.epoch, p.reserves]), itemStyle: { color: colors.reserves } },
      {
        name: labels.projection,
        type: "line",
        showSymbol: false,
        data: projection.map((p) => [p.epoch, p.reserves]),
        lineStyle: { type: "dashed" },
        itemStyle: { color: colors.reserves },
      },
    ],
  };
}
