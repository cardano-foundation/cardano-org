import React from "react";
import { translate } from "@docusaurus/Translate";
import { formatAdaValue } from "@site/src/utils/insights/numbers";
import { summarizeDonations } from "@site/src/utils/insights/treasuryMath.mjs";
import snapshot from "@site/src/data/treasury-donations.json";
import styles from "./styles.module.css";

// Donation figures from the committed snapshot, no network request. Headings
// and links live on the pages that use this block.
const s = summarizeDonations(snapshot);

function Figure({ value, label, children }) {
  return (
    <div className={styles.figure}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}

export default function TreasuryDonations() {
  return (
    <>
      <div className={styles.grid}>
        <Figure
          value={formatAdaValue(s.totalAda)}
          label={translate({ id: "governance.treasury.donations.total", message: "Received in total" })}
        />
        <Figure
          value={s.epochCount.toLocaleString()}
          label={translate({ id: "governance.treasury.donations.epochs", message: "Epochs with donations" })}
        />
        {s.largest && (
          <Figure
            value={formatAdaValue(s.largest.ada)}
            label={translate({ id: "governance.treasury.donations.largest", message: "Highest single epoch" })}
          >
            <span className={styles.sub}>
              {translate(
                { id: "governance.treasury.donations.largestDetail", message: "Epoch {epoch}, {share}% of the total" },
                { epoch: s.largest.epoch, share: Math.round(s.largest.sharePercent) }
              )}
            </span>
          </Figure>
        )}
      </div>
      {s.updatedEpoch != null && (
        <p className={styles.note}>
          {translate(
            { id: "governance.treasury.donations.updated", message: "Donations up to epoch {epoch}." },
            { epoch: s.updatedEpoch }
          )}
        </p>
      )}
    </>
  );
}
