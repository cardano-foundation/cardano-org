import React from "react";
import { translate } from "@docusaurus/Translate";
import { formatAdaValue } from "@site/src/utils/insights/numbers";
import { summarizeDonations } from "@site/src/utils/insights/treasuryMath.mjs";
import snapshot from "@site/src/data/treasury-donations.json";
import StatFigure, { StatStrip } from "@site/src/components/Layout/StatFigure";
import styles from "./styles.module.css";

// Donation figures from the committed snapshot, no network request. Headings
// and links live on the pages that use this block.
const s = summarizeDonations(snapshot);

export default function TreasuryDonations() {
  return (
    <>
      <StatStrip columns={3} mobileColumns={1} className={styles.grid}>
        <StatFigure
          compact
          value={formatAdaValue(s.totalAda)}
          label={translate({ id: "governance.treasury.donations.total", message: "Received in total" })}
        />
        <StatFigure
          compact
          value={s.epochCount.toLocaleString()}
          label={translate({ id: "governance.treasury.donations.epochs", message: "Epochs with donations" })}
        />
        {s.largest && (
          <StatFigure
            compact
            value={formatAdaValue(s.largest.ada)}
            label={translate({ id: "governance.treasury.donations.largest", message: "Highest single epoch" })}
            sub={translate(
              { id: "governance.treasury.donations.largestDetail", message: "Epoch {epoch}, {share}% of the total" },
              { epoch: s.largest.epoch, share: Math.round(s.largest.sharePercent) }
            )}
          />
        )}
      </StatStrip>
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
