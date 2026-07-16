import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

export default function AccountabilityRole({ role, liveValue }) {
  return (
    <section
      id={role.id}
      aria-labelledby={`${role.id}-title`}
      className={clsx(styles.role, styles[`accent_${role.accent}`])}
    >
      <div className={styles.detailGrid}>
        <div className={styles.detailMain}>
          <header className={styles.head}>
            <span className={styles.icon} aria-hidden="true">{role.icon}</span>
            <h2 id={`${role.id}-title`}>{role.title}</h2>
          </header>
          <p className={styles.power}>{role.power}</p>

          <h3>{translate({ id: "governance.accountability.label.accountableFor", message: "Accountable for" })}</h3>
          <ul className={styles.obligations}>
            {role.obligations.map((o, i) => (
              <li key={i}>
                {o.text} <Link to={o.href} className={styles.source}>({o.source})</Link>
              </li>
            ))}
          </ul>

          <h3>{translate({ id: "governance.accountability.label.goodLooksLike", message: "What good looks like" })}</h3>
          <ul className={styles.expectations}>
            {role.expectations.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>

        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>
            {translate({ id: "governance.accountability.label.verifyAndAct", message: "Verify and act" })}
          </h3>

          <div className={styles.sidebarRow}>
            <span className={styles.sidebarLabel}>
              {translate({ id: "governance.accountability.label.evidence", message: "Evidence" })}
            </span>
            <span className={styles.sidebarValue}>{role.evidence}</span>
          </div>

          <div className={styles.sidebarRow}>
            <span className={styles.sidebarLabel}>
              {translate({ id: "governance.accountability.label.benchmark", message: "Benchmark" })}
            </span>
            <span className={styles.sidebarValue}>
              {role.benchmarks.liveKey && liveValue != null && (
                <span className={styles.liveValue}>{liveValue}</span>
              )}
              {role.benchmarks.curated.map((c, i) => (
                <span key={i} className={styles.benchmarkItem}>
                  {c.label}: <span className={styles.curatedValue}>{c.value}</span>
                </span>
              ))}
            </span>
          </div>

          <div className={styles.sidebarButtons}>
            {role.verifyAndAct.map((a, i) => (
              <Link key={i} to={a.href} className={styles.primaryBtn}>{a.label}</Link>
            ))}
            {role.benchmarks.checkIndividuals && (
              <Link to={role.benchmarks.checkIndividuals.href} className={styles.secondaryBtn}>
                {role.benchmarks.checkIndividuals.label}
              </Link>
            )}
          </div>

          <p className={styles.sidebarFooter}>
            <Translate
              id="governance.accountability.label.groundedIn"
              values={{
                groundedIn: (
                  <Link to={role.groundedInHref ?? "/constitution"} className={styles.sidebarFooterLink}>
                    {role.groundedIn}
                  </Link>
                ),
              }}
            >
              {"Grounded in {groundedIn}."}
            </Translate>
          </p>
        </aside>
      </div>
    </section>
  );
}
