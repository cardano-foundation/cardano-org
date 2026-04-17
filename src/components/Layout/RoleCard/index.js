import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const ACCENT_CLASS = {
  blue: styles.accentBlue,
  violet: styles.accentViolet,
  teal: styles.accentTeal,
};

export default function RoleCard({
  icon,
  title,
  children,
  accent = "blue",
  href,
  className,
}) {
  const Tag = href ? Link : "div";
  const tagProps = href ? { to: href } : {};
  return (
    <Tag
      {...tagProps}
      className={clsx(styles.card, ACCENT_CLASS[accent] || ACCENT_CLASS.blue, className)}
    >
      {icon && (
        <span className={styles.iconHalo} aria-hidden="true">
          <svg className={styles.orbit} viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="38" className={styles.orbitRing} />
            <g className={styles.orbitSpokes}>
              <line x1="60" y1="20" x2="60" y2="14" />
              <line x1="88" y1="32" x2="92" y2="28" />
              <line x1="100" y1="60" x2="106" y2="60" />
              <line x1="32" y1="88" x2="28" y2="92" />
              <line x1="20" y1="60" x2="14" y2="60" />
            </g>
            <g className={styles.orbitDots}>
              <circle cx="60" cy="10" r="2.8" />
              <circle cx="95" cy="25" r="3.1" />
              <circle cx="110" cy="60" r="2.6" />
              <circle cx="95" cy="95" r="3.3" />
              <circle cx="60" cy="110" r="2.8" />
              <circle cx="25" cy="95" r="3.1" />
              <circle cx="10" cy="60" r="2.6" />
              <circle cx="25" cy="25" r="3.3" />
              <circle cx="77" cy="19" r="1.5" />
              <circle cx="101" cy="43" r="1.5" />
              <circle cx="101" cy="77" r="1.5" />
              <circle cx="77" cy="101" r="1.5" />
              <circle cx="43" cy="101" r="1.5" />
              <circle cx="19" cy="77" r="1.5" />
              <circle cx="19" cy="43" r="1.5" />
              <circle cx="43" cy="19" r="1.5" />
            </g>
          </svg>
          <span className={styles.iconWrap}>{icon}</span>
        </span>
      )}
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{children}</div>
      </div>
    </Tag>
  );
}
