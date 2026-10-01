import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { formatAdaValue } from "@site/src/utils/insights/numbers";
import { withdrawalsInWindow } from "@site/src/utils/insights/treasuryMath.mjs";
import { useTreasuryTotals, useTreasuryWithdrawals } from "./useTreasuryData";
import { LiveDataError, Skeleton } from "./figures";
import styles from "./styles.module.css";

const RECENT_COUNT = 5;

export default function TreasuryFunded() {
  const withdrawals = useTreasuryWithdrawals();
  const totals = useTreasuryTotals();

  const allLink = (
    <Link to="/insights/supply/summary#treasury-withdrawals">
      {translate({ id: "governance.treasury.funded.all", message: "Browse treasury withdrawals by epoch" })}
    </Link>
  );

  if (withdrawals.status === "error") {
    return (
      <>
        <LiveDataError message={translate({ id: "governance.treasury.funded.error", message: "Treasury withdrawals are unavailable right now." })} />
        <p>{allLink}</p>
      </>
    );
  }
  if (withdrawals.status === "loading") return <Skeleton height={320} />;

  const recent = withdrawals.data.slice(0, RECENT_COUNT);
  // The 12-month line needs the latest epoch from /totals and is left out without it.
  const lastYear =
    totals.status === "ready" ? withdrawalsInWindow(withdrawals.data, totals.data[totals.data.length - 1].epoch) : null;

  return (
    <>
      <ul className={styles.fundedList}>
        {recent.map((w) => (
          <li key={w.id} className={styles.fundedItem}>
            <span className={styles.fundedTitle}>
              {w.title || translate({ id: "governance.treasury.funded.untitled", message: "Untitled withdrawal" })}
            </span>
            <span className={styles.fundedMeta}>
              {formatAdaValue(w.ada)}
              {" · "}
              {translate({ id: "governance.treasury.funded.epoch", message: "Epoch {epoch}" }, { epoch: w.epoch })}
              {" · "}
              <a href={`https://explorer.cardano.org/governance-action/${encodeURIComponent(w.id)}`} target="_blank" rel="noopener noreferrer">
                {translate({ id: "governance.treasury.funded.explorer", message: "View on explorer" })}
              </a>
            </span>
          </li>
        ))}
      </ul>
      <p>
        {lastYear &&
          translate(
            { id: "governance.treasury.funded.summary", message: "Withdrawals that took effect in the last 12 months: {count}, worth {amount} in total." },
            { count: lastYear.length, amount: formatAdaValue(lastYear.reduce((sum, w) => sum + w.ada, 0)) }
          )}{" "}
        {allLink}
      </p>
    </>
  );
}
