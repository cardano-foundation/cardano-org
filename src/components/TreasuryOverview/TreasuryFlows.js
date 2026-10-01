import React, { useMemo } from "react";
import { translate } from "@docusaurus/Translate";
import { flowsOverWindow } from "@site/src/utils/insights/treasuryMath.mjs";
import snapshot from "@site/src/data/treasury-donations.json";
import { useTreasuryTotals, useTreasuryWithdrawals } from "./useTreasuryData";
import { AdaFigure, LiveDataError } from "./figures";
import styles from "./styles.module.css";

function leadSentence(netChange) {
  if (netChange < 0) {
    return translate({
      id: "governance.treasury.flows.contextSpending",
      message: "Over this period the treasury paid out more than it took in, as the community approved funding for a number of projects.",
    });
  }
  if (netChange > 0) {
    return translate({ id: "governance.treasury.flows.contextSaving", message: "Over this period the treasury took in more than it paid out." });
  }
  return translate({ id: "governance.treasury.flows.contextEven", message: "Over this period the treasury paid out as much as it took in." });
}

function contextSentence(netChange) {
  const caveat = translate({
    id: "governance.treasury.flows.caveat",
    message: "Income is estimated and withdrawals count in the epoch they took effect, so the figures do not add up exactly.",
  });
  return `${leadSentence(netChange)} ${caveat}`;
}

export default function TreasuryFlows() {
  const totals = useTreasuryTotals();
  const withdrawals = useTreasuryWithdrawals();

  const flows = useMemo(() => {
    if (totals.status !== "ready" || withdrawals.status !== "ready") return null;
    return flowsOverWindow({ points: totals.data, withdrawals: withdrawals.data, donations: snapshot, latestEpoch: totals.data.at(-1).epoch });
  }, [totals, withdrawals]);

  if (totals.status === "error" || withdrawals.status === "error") {
    return <LiveDataError message={translate({ id: "governance.treasury.flows.error", message: "Live treasury figures are unavailable right now." })} />;
  }

  const loading = totals.status === "loading" || withdrawals.status === "loading";
  const balance = totals.status === "ready" ? totals.data.at(-1).treasury : null;

  return (
    <>
      <div className={styles.flowGrid}>
        <AdaFigure loading={loading} value={balance} label={translate({ id: "governance.treasury.flows.balance", message: "Treasury balance" })} />
        <AdaFigure loading={loading} value={flows?.netChange} signed label={translate({ id: "governance.treasury.flows.change", message: "Change over 12 months" })} />
        <AdaFigure loading={loading} value={flows?.income} label={translate({ id: "governance.treasury.flows.income", message: "Income from reserves and fees (estimated)" })} />
        <AdaFigure loading={loading} value={flows?.paidOut} label={translate({ id: "governance.treasury.flows.withdrawn", message: "Withdrawn from the treasury" })} />
        <AdaFigure loading={loading} value={flows?.returned} label={translate({ id: "governance.treasury.flows.received", message: "Received through treasury donations" })} />
      </div>
      <p className={styles.context}>{flows?.netChange != null && contextSentence(flows.netChange)}</p>
    </>
  );
}
