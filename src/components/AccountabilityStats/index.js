import React from "react";
import { CountFigure, StatStrip } from "@site/src/components/Layout/StatFigure";
import { translate } from "@docusaurus/Translate";
import { formatAdaValue } from "@site/src/utils/insights/numbers";
import useAccountabilityStats from "./useAccountabilityStats";
import styles from "./styles.module.css";

const formatInt = (v) => Math.round(v).toLocaleString();
// Approximate floor with a "+" suffix, e.g. "1000+".
const formatApprox = (v) => `${Math.round(v)}+`;

export default function AccountabilityStats() {
  const { dreps, committee, treasury } = useAccountabilityStats();
  return (
    <StatStrip mobileColumns={2} className={styles.strip}>
      <CountFigure
        target={dreps}
        format={formatInt}
        href="#dreps"
        label={translate({ id: "governance.accountability.stat.dreps", message: "Active DReps" })}
      />
      <CountFigure
        target={committee}
        format={formatInt}
        href="#committee"
        label={translate({ id: "governance.accountability.stat.committee", message: "Committee members" })}
      />
      <CountFigure
        target={1000}
        format={formatApprox}
        href="#spos"
        label={translate({ id: "governance.accountability.stat.spos", message: "Active stake pools" })}
      />
      <CountFigure
        target={treasury}
        format={formatAdaValue}
        href="#funding"
        label={translate({ id: "governance.accountability.stat.treasury", message: "Treasury" })}
      />
    </StatStrip>
  );
}
