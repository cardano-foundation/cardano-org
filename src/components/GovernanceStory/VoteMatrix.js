import React, { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import { getVoteMatrix } from "@site/src/data/governanceStory";
import styles from "./styles.module.css";

const GROUPS = [
  { key: "drep", color: "var(--site-role-drep)", text: "var(--site-role-drep)" },
  { key: "spo", color: "var(--site-role-pool)", text: "var(--site-role-pool)" },
  { key: "cc", color: "var(--site-role-committee)", text: "var(--site-role-committee-text)" },
];

function Gauge({ frac, color, center, off }) {
  const c = 2 * Math.PI * 46;
  return (
    <svg className={styles.gaugeSvg} viewBox="0 0 112 112" aria-hidden="true">
      <circle cx="56" cy="56" r="46" fill="none" className={styles.gaugeTrack} strokeWidth="9" strokeDasharray={off ? "3 6" : undefined} />
      {!off && (
        <circle
          cx="56"
          cy="56"
          r="46"
          fill="none"
          style={{ stroke: color }}
          strokeWidth="9"
          strokeDasharray={`${(frac * c).toFixed(1)} ${c.toFixed(1)}`}
          transform="rotate(-90 56 56)"
        />
      )}
      <text x="56" y={off ? 61 : 65} textAnchor="middle" className={off ? styles.gaugeTextOff : styles.gaugeText}>
        {center}
      </text>
    </svg>
  );
}

export default function VoteMatrix() {
  const rows = useMemo(() => getVoteMatrix(), []);
  const [sel, setSel] = useState(0);
  const tabs = useRef([]);
  const d = rows[sel];

  const groupNames = {
    drep: translate({ id: "governance.howItWorks.group.dreps", message: "DReps" }),
    spo: translate({ id: "governance.howItWorks.group.pools", message: "Stake pools" }),
    cc: translate({ id: "governance.howItWorks.group.committee", message: "Committee" }),
  };

  const onKey = (e, idx) => {
    let n = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (idx + 1) % rows.length;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (idx + rows.length - 1) % rows.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = rows.length - 1;
    if (n === null) return;
    e.preventDefault();
    setSel(n);
    tabs.current[n]?.focus();
  };

  return (
    <div className={styles.matrix}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label={translate({ id: "governance.howItWorks.matrix.tabsLabel", message: "Governance action types" })}
      >
        {rows.map((row, idx) => {
          const who = row.info ? ["drep", "spo", "cc"] : GROUPS.map((g) => (row[g.key] ? g.key : ""));
          return (
            <button
              key={row.id}
              ref={(el) => {
                tabs.current[idx] = el;
              }}
              type="button"
              role="tab"
              id={`gs-tab-${row.id}`}
              aria-controls="gs-matrix-panel"
              aria-selected={idx === sel}
              tabIndex={idx === sel ? 0 : -1}
              className={styles.tab}
              onClick={() => setSel(idx)}
              onKeyDown={(e) => onKey(e, idx)}
            >
              <span>{row.name}</span>
              <span className={styles.who} aria-hidden="true">
                {who.map((k, j) => (
                  <i key={j} className={k ? styles[`who_${k}`] : undefined} />
                ))}
              </span>
            </button>
          );
        })}
      </div>
      <div className={styles.panel} role="tabpanel" id="gs-matrix-panel" aria-labelledby={`gs-tab-${d.id}`} tabIndex={0}>
        <div className={styles.panelHead}>
          <h3>{d.name}</h3>
          <p>{d.desc}</p>
        </div>
        <div className={styles.gauges}>
          {GROUPS.map((g) => {
            const rule = d.info ? null : d[g.key];
            const off = !d.info && !rule;
            let center;
            let line1;
            let line2;
            if (d.info) {
              center = translate({ id: "governance.howItWorks.matrix.votes", message: "votes" });
              line1 = translate({ id: "governance.howItWorks.matrix.canVote", message: "Can vote" });
              line2 = translate({ id: "governance.howItWorks.matrix.noThreshold", message: "No threshold. Never enacted." });
            } else if (off) {
              center = translate({ id: "governance.howItWorks.matrix.noVote", message: "no vote" });
              line1 = translate({ id: "governance.howItWorks.matrix.doesNotVote", message: "Does not vote" });
              line2 =
                g.key === "cc"
                  ? translate({ id: "governance.howItWorks.matrix.ownSeat", message: "The committee cannot judge its own seat." })
                  : translate({ id: "governance.howItWorks.matrix.notPart", message: "Not part of this decision." });
            } else {
              center = rule.t;
              line1 = translate({ id: "governance.howItWorks.matrix.needs", message: "Needs {value}" }, { value: rule.t });
              line2 = rule.note;
            }
            return (
              <div key={g.key} className={clsx(styles.gauge, (off || d.info) && styles.gaugeOff)}>
                <Gauge frac={rule ? rule.v : 0} color={g.color} center={center} off={off || d.info} />
                <div className={styles.gaugeText2}>
                  <span className={styles.gaugeName} style={off ? undefined : { color: g.text }}>
                    {groupNames[g.key]}
                  </span>
                  <span className={styles.gaugeRule}>
                    <b>{line1}</b>
                    <br />
                    {line2}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.example}>
          <span className={styles.stamp}>
            {translate({ id: "governance.howItWorks.fromLedger", message: "From the ledger" })}
          </span>
          <p>{d.ex}</p>
        </div>
      </div>
    </div>
  );
}
