import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

export default function AccountabilityRole({ role, liveValue }) {
  return (
    <section id={role.id} aria-labelledby={`${role.id}-title`} className={clsx(styles.role, styles[`accent_${role.accent}`])}>
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

      <h3>{translate({ id: "governance.accountability.label.benchmarks", message: "Benchmarks" })}</h3>
      <div className={styles.benchmarks}>
        {role.benchmarks.liveKey && liveValue != null && (
          <div className={styles.liveStat}>
            <span className={styles.liveValue}>{liveValue}</span>
          </div>
        )}
        <ul className={styles.curated}>
          {role.benchmarks.curated.map((c, i) => (
            <li key={i}><strong>{c.value}</strong> {c.label}</li>
          ))}
        </ul>
        {role.benchmarks.checkIndividuals && (
          <Link to={role.benchmarks.checkIndividuals.href} className={styles.checkLink}>
            {role.benchmarks.checkIndividuals.label}
          </Link>
        )}
      </div>

      <h3>{translate({ id: "governance.accountability.label.verifyAndAct", message: "Verify and act" })}</h3>
      <div className={styles.actions}>
        {role.verifyAndAct.map((a, i) => (
          <Link key={i} to={a.href} className={styles.actionBtn}>{a.label}</Link>
        ))}
      </div>
    </section>
  );
}
