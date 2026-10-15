import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

/**
 * Row of link cards, centered and wrapping, for the "where to go next" links
 * at the end of a page. Each card is a plain text link.
 *
 * @param {object} props
 * @param {Array<{to: string, label: React.ReactNode}>} props.items Cards in order: target and translated label.
 * @param {string} [props.className] Extra class on the row.
 */
export default function LinkCardRow({ items, className }) {
  return (
    <div className={clsx(styles.row, className)}>
      {items.map((item) => (
        <Link key={item.to} className={styles.card} to={item.to}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
