import React from "react";
import clsx from "clsx";
import { COMPARISON } from "@site/src/data/sustainability";
import styles from "./styles.module.css";

// Blockchain energy consumption comparison table for the /sustainability page.
// Renders a semantic, horizontally scrollable table inside a card: one row per
// network with its consensus mechanism, annual electricity consumption (with a
// proportional bar under the value), electric power, and annual CO2 emissions.
//
// All copy and figures come from COMPARISON in src/data/sustainability.js, so
// the component takes no props. Bars are scaled against COMPARISON.barMaxKwh
// (the largest non-overflow row); rows flagged `overflow` exceed the axis and
// draw a full-width faded bar instead. Missing values render an empty cell with
// a visually hidden "not available" label for screen readers.

// Percentage width of the electricity bar for a row, capped at 100.
function barPercent(row, maxKwh) {
  if (row.overflow) {
    return 100;
  }
  if (typeof row.electricityKwh !== "number" || !(maxKwh > 0)) {
    return 0;
  }
  return Math.min(100, (row.electricityKwh / maxKwh) * 100);
}

function barClassName(row) {
  if (row.overflow) {
    return styles.barOverflow;
  }
  if (row.highlight) {
    return styles.barHighlight;
  }
  return undefined;
}

// Right-aligned numeric cell. Null values become an empty cell that still
// announces "not available" to assistive technology.
function NumericCell({ value, notAvailable, className, children }) {
  return (
    <td className={clsx(styles.num, className)}>
      {value === null || value === undefined ? (
        <span className={styles.srOnly}>{notAvailable}</span>
      ) : (
        <>
          {value}
          {children}
        </>
      )}
    </td>
  );
}

export default function EnergyComparisonTable() {
  const { caption, columns, rows, barMaxKwh, notAvailable } = COMPARISON;

  return (
    <div className={styles.card}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>{caption}</caption>
          <thead>
            <tr>
              <th scope="col" className={clsx(styles.th, styles.colNetwork)}>
                {columns.network}
              </th>
              <th scope="col" className={clsx(styles.th, styles.colConsensus)}>
                {columns.consensus}
              </th>
              <th scope="col" className={clsx(styles.th, styles.num)}>
                {columns.electricity}
              </th>
              <th scope="col" className={clsx(styles.th, styles.num, styles.colPower)}>
                {columns.power}
              </th>
              <th scope="col" className={clsx(styles.th, styles.num, styles.colCo2)}>
                {columns.co2}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hasBar = row.electricity !== null && typeof row.electricityKwh === "number";
              return (
                <tr
                  key={row.network}
                  className={row.highlight ? styles.rowHighlight : undefined}
                >
                  <th scope="row" className={styles.network}>
                    {row.network}
                  </th>
                  <td className={styles.consensus}>{row.consensus}</td>
                  <NumericCell
                    value={
                      row.electricity === null ? null : (
                        <span className={styles.electricityValue}>{row.electricity}</span>
                      )
                    }
                    notAvailable={notAvailable}
                  >
                    {hasBar && (
                      <span className={styles.track} aria-hidden="true">
                        <span
                          className={clsx(styles.bar, barClassName(row))}
                          style={{ width: `${barPercent(row, barMaxKwh)}%` }}
                        />
                      </span>
                    )}
                  </NumericCell>
                  <NumericCell value={row.power} notAvailable={notAvailable} />
                  <NumericCell value={row.co2} notAvailable={notAvailable} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
