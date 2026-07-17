import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useCountUp from "@site/src/utils/useCountUp";
import { formatAdaValue } from "@site/src/utils/insights/numbers";
import useAccountabilityStats from "./useAccountabilityStats";
import styles from "./styles.module.css";

function IntFigure({ target, href, label }) {
  const animated = useCountUp(target);
  return (
    <Link href={href} className={styles.figure}>
      <span className={styles.value}>{target == null ? "..." : Math.round(animated).toLocaleString()}</span>
      <span className={styles.label}>{label}</span>
    </Link>
  );
}

function TreasuryFigure({ target, href, label }) {
  const animated = useCountUp(target);
  return (
    <Link href={href} className={styles.figure}>
      <span className={styles.value}>{target == null ? "..." : formatAdaValue(animated)}</span>
      <span className={styles.label}>{label}</span>
    </Link>
  );
}

function StaticFigure({ value, href, label }) {
  return (
    <Link href={href} className={styles.figure}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </Link>
  );
}

export default function AccountabilityStats() {
  const { dreps, committee, treasury } = useAccountabilityStats();
  return (
    <div className={styles.strip}>
      <IntFigure
        target={dreps}
        href="#dreps"
        label={translate({ id: "governance.accountability.stat.dreps", message: "Active DReps" })}
      />
      <IntFigure
        target={committee}
        href="#committee"
        label={translate({ id: "governance.accountability.stat.committee", message: "Committee members" })}
      />
      <StaticFigure
        value="1000+"
        href="#spos"
        label={translate({ id: "governance.accountability.stat.spos", message: "Active stake pools" })}
      />
      <TreasuryFigure
        target={treasury}
        href="#funding"
        label={translate({ id: "governance.accountability.stat.treasury", message: "Treasury" })}
      />
    </div>
  );
}
