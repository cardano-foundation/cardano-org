import React, { useMemo, useState } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { getRoles } from "@site/src/data/governanceStory";
import styles from "./styles.module.css";

export default function RoleFinder() {
  const roles = useMemo(() => getRoles(), []);
  const [sel, setSel] = useState(0);
  const r = roles[sel];
  return (
    <div className={styles.roles}>
      <div
        className={styles.roleOpts}
        role="group"
        aria-label={translate({ id: "governance.howItWorks.roles.groupLabel", message: "Choose how you want to take part" })}
      >
        {roles.map((role, i) => (
          <button key={role.id} type="button" className={styles.roleOpt} aria-pressed={i === sel} onClick={() => setSel(i)}>
            <small>{role.who}</small>
            {role.time}
          </button>
        ))}
      </div>
      <article className={styles.roleCard} aria-live="polite">
        <p className={styles.eyebrow}>
          <b>{r.time}</b>
        </p>
        <h3>{r.title}</h3>
        <ul>
          {r.points.map((p) => (
            <li key={p}>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <Link className="button button--primary" to={r.to}>
          {r.cta}
        </Link>
      </article>
    </div>
  );
}
