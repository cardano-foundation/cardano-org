import React, { useState } from "react";
import clsx from "clsx";
import { NETWORK } from "@site/src/data/sustainability";
import StakePoolMap, { poolBucket } from "./StakePoolMap";
import styles from "./styles.module.css";

// Network distribution section of the /sustainability page: a two-line
// heading with the coral heading dot, a scope note, a stake pool bubble map
// with its legend, and the top 10 countries table, followed by the data
// source line.
//
// Owns the shared `activeCode` hover / focus state. Hovering a table row or
// hovering / focusing a map bubble highlights the same country in both
// places. Rows are mouse only; the map bubbles are the keyboard reachable
// controls. All copy comes from NETWORK in src/data/sustainability.js.
//
// No props.

const RAMP_STEPS = [1, 2, 3, 4, 5];

export default function NetworkDistribution() {
  const [activeCode, setActiveCode] = useState(null);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={clsx("headingDot", styles.title)}>
          <span className={styles.titleLine}>{NETWORK.titleLine1}</span>
          <span className={styles.titleLine}>{NETWORK.titleLine2}</span>
        </h2>
        <p className={styles.scopeNote}>{NETWORK.scopeNote}</p>
      </div>

      <div className={styles.body}>
        <div className={styles.mapColumn}>
          <StakePoolMap
            rows={NETWORK.rows}
            activeCode={activeCode}
            onActiveChange={setActiveCode}
            ariaLabel={NETWORK.mapAriaLabel}
          />
          <div className={styles.legend}>
            <span className={styles.legendLabel}>{NETWORK.legend.less}</span>
            <div className={styles.ramp} role="img" aria-label={NETWORK.legend.ariaLabel}>
              {RAMP_STEPS.map((step) => (
                <span key={step} className={clsx(styles.rampStep, styles[`bucket${step}`])} />
              ))}
            </div>
            <span className={styles.legendLabel}>{NETWORK.legend.more}</span>
          </div>
        </div>

        <div className={styles.tableColumn}>
          <p className={styles.eyebrow}>{NETWORK.tableEyebrow}</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">
                  {NETWORK.columns.country}
                </th>
                <th scope="col" className={styles.thPools}>
                  {NETWORK.columns.pools}
                </th>
                <th scope="col" className={styles.thStake}>
                  {NETWORK.columns.stake}
                </th>
              </tr>
            </thead>
            <tbody>
              {NETWORK.rows.map((row) => (
                <tr
                  key={row.code}
                  className={clsx(styles.row, activeCode === row.code && styles.rowActive)}
                  onMouseEnter={() => setActiveCode(row.code)}
                  onMouseLeave={() => setActiveCode(null)}
                >
                  <td className={styles.cellCountry}>
                    <span
                      className={clsx(styles.swatch, styles[`bucket${poolBucket(row.pools)}`])}
                      aria-hidden="true"
                    />
                    <span className={styles.countryName}>{row.name}</span>
                  </td>
                  <td className={styles.cellPools}>{row.pools}</td>
                  <td className={styles.cellStake}>{row.stake}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <th scope="row" className={styles.totalLabel}>
                  {NETWORK.totalLabel}
                </th>
                <td className={styles.totalValue}>{NETWORK.pools}</td>
                <td className={styles.totalValue}>{NETWORK.stakeMAda}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p className={styles.source}>
        <strong>{NETWORK.sourceLabel}</strong> {NETWORK.source}
      </p>
    </div>
  );
}
