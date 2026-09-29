import React, { useMemo, useState } from "react";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

// Treasury cut guardrails TC-01 and TC-02 from the constitution's appendix.
const TODAY = 20;
const PER_EPOCH_TODAY = 3.66; // million ada reaching the treasury per epoch at 20%

export default function GuardrailCheck() {
  const { i18n } = useDocusaurusContext();
  const oneDecimal = useMemo(
    () => new Intl.NumberFormat(i18n.currentLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    [i18n.currentLocale]
  );
  const [v, setV] = useState(TODAY);
  const ok1 = v >= 10;
  const ok2 = v <= 30;
  const dec = (v / 100).toFixed(2).replace(/0$/, "");

  const lines = [];
  if (!ok1 || !ok2) {
    lines.push(
      <span key="r">
        <span className={styles.conBad}>{translate({ id: "governance.howItWorks.rail.rejected", message: "Rejected." })}</span>{" "}
        <span className={styles.conHi}>
          {translate({
            id: "governance.howItWorks.rail.rejectedText",
            message: "The ledger refuses the transaction. No vote takes place.",
          })}
        </span>
      </span>
    );
  } else if (v === TODAY) {
    lines.push(
      <span key="t" className={styles.conHi}>
        {translate({ id: "governance.howItWorks.rail.today", message: "That is today's value. Nothing to change." })}
      </span>
    );
    lines.push(
      <span key="t2" className={styles.conMuted}>
        {translate({
          id: "governance.howItWorks.rail.todayFlow",
          message: "About 3.7 million ada reaches the treasury each epoch.",
        })}
      </span>
    );
  } else {
    lines.push(
      <span key="v">
        <span className={styles.conOk}>{translate({ id: "governance.howItWorks.rail.valid", message: "Valid." })}</span>{" "}
        <span className={styles.conHi}>
          {translate({
            id: "governance.howItWorks.rail.validText",
            message: "Now it needs 67% of active DRep stake and two thirds of the committee.",
          })}
        </span>
      </span>
    );
    lines.push(
      <span key="e" className={styles.conMuted}>
        {translate(
          {
            id: "governance.howItWorks.rail.estimate",
            message: "Estimate: about {amount} million ada per epoch to the treasury, against about 3.7 million today.",
          },
          { amount: oneDecimal.format((PER_EPOCH_TODAY * v) / TODAY) }
        )}
      </span>
    );
    if (v === 10) {
      lines.push(<span key="gap" />);
      lines.push(
        <span key="h" className={styles.conMuted}>
          {translate({
            id: "governance.howItWorks.rail.history",
            message:
              "February 2025: this exact change passed the guardrails and failed the vote. DReps 23.2%, and two of seven committee members.",
          })}
        </span>
      );
    }
  }

  return (
    <div className={styles.rail}>
      <div className={styles.railLeft}>
        <p className={styles.fieldLabel}>
          {translate({ id: "governance.howItWorks.rail.try", message: "Try it: propose a new treasury cut" })}
        </p>
        <p className={styles.railHelp}>
          {translate({
            id: "governance.howItWorks.rail.help",
            message: "The treasury cut is the share of each epoch's rewards that goes to the treasury. Today it is 20%.",
          })}
        </p>
        <output className={styles.railValue} htmlFor="gs-tc">
          {v}%
        </output>
        <div className={styles.track}>
          <div className={styles.zones} aria-hidden="true">
            <span className={styles.zoneBad} style={{ width: "20%" }} />
            <span className={styles.zoneOk} style={{ width: "40%" }} />
            <span className={styles.zoneBad} style={{ width: "40%" }} />
          </div>
          <span className={styles.mark} style={{ "--gs-at": 0.4 }} aria-hidden="true">
            {translate({ id: "governance.howItWorks.rail.markToday", message: "Today" })}
          </span>
          <span className={styles.markAlt} style={{ "--gs-at": 0.2 }} aria-hidden="true">
            {translate({ id: "governance.howItWorks.rail.markVote", message: "February 2025 vote" })}
          </span>
          <input
            type="range"
            id="gs-tc"
            min="0"
            max="50"
            step="1"
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label={translate({ id: "governance.howItWorks.rail.inputLabel", message: "Proposed treasury cut, in percent" })}
          />
          <div className={styles.scale} aria-hidden="true">
            {[0, 10, 20, 30, 40, 50].map((n) => (
              <span key={n}>{n}%</span>
            ))}
          </div>
        </div>
      </div>
      <span className={styles.srOnly} aria-live="polite">
        {!ok1 || !ok2
          ? translate({ id: "governance.howItWorks.rail.rejected", message: "Rejected." })
          : translate({ id: "governance.howItWorks.rail.valid", message: "Valid." })}
      </span>
      <pre className={styles.console}>
        <span className={styles.conMuted}>$ guardrails check treasuryCut = {dec}</span>
        {"\n"}
        <span className={ok1 ? styles.conOk : styles.conBad}>{ok1 ? "✓" : "✗"} TC-01</span>{" "}
        {translate({ id: "governance.howItWorks.rail.tc01", message: "must not be lower than 0.1 (10%)" })}
        {"\n"}
        <span className={ok2 ? styles.conOk : styles.conBad}>{ok2 ? "✓" : "✗"} TC-02</span>{" "}
        {translate({ id: "governance.howItWorks.rail.tc02", message: "must not exceed 0.3 (30%)" })}
        {"\n\n"}
        {lines.map((l, i) => (
          <React.Fragment key={i}>
            {l}
            {i < lines.length - 1 ? "\n" : null}
          </React.Fragment>
        ))}
      </pre>
    </div>
  );
}
