import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useCountUp from "@site/src/utils/useCountUp";
import styles from "./styles.module.css";

/**
 * One key figure: a large value above a short uppercase label, with an
 * optional line of context below. Count-up and number formatting stay with
 * the caller (`useCountUp`), because the formats differ between pages.
 *
 * @param {object} props
 * @param {React.ReactNode} props.value The formatted value.
 * @param {React.ReactNode} props.label Short label below the value, one to three words.
 * @param {React.ReactNode} [props.sub] Optional line of context below the label.
 * @param {boolean} [props.loading=false] Shows "..." instead of the value.
 * @param {string} [props.href] Turns the figure into a link with a hover surface.
 * @param {boolean} [props.compact=false] Less inner padding, the same on all screen sizes.
 * @param {string} [props.className] Extra class on the figure.
 */
export default function StatFigure({ value, label, sub, loading = false, href, compact = false, className }) {
  const classes = clsx(styles.figure, compact && styles.compact, href && styles.link, className);
  const content = (
    <>
      <span className={styles.value}>{loading ? "..." : value}</span>
      <span className={styles.label}>{label}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </>
  );
  return href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}

/**
 * StatFigure whose number counts up from 0 once it is known, with "..." until then.
 *
 * @param {object} props
 * @param {number} [props.target] The final number. `null` while loading.
 * @param {Function} props.format Formats the animated number for display.
 * @param {React.ReactNode} props.label Short label below the value.
 * @param {React.ReactNode} [props.sub] Optional line of context below the label.
 * @param {string} [props.href] Turns the figure into a link.
 * @param {boolean} [props.compact=false] Less inner padding.
 * @param {string} [props.className] Extra class on the figure.
 */
export function CountFigure({ target, format, ...rest }) {
  const animated = useCountUp(target);
  return <StatFigure {...rest} value={target == null ? null : format(animated)} loading={target == null} />;
}

/**
 * Row of StatFigures in equal columns.
 *
 * @param {object} props
 * @param {number} [props.columns] Columns on wide screens.
 * @param {number} [props.mobileColumns] Columns at 768px width and below. Defaults to `columns`.
 * @param {string} [props.className] Extra class, for example for the outer spacing or the page's own variables.
 * @param {object} [props.style] Inline styles, merged with the strip variables.
 * @param {React.ReactNode} props.children The figures.
 */
export function StatStrip({ columns, mobileColumns, className, style, children }) {
  return (
    <div
      className={clsx(styles.strip, className)}
      // Unset props leave the variables to the page class, React drops undefined values.
      style={{ "--stat-cols": columns, "--stat-cols-mobile": mobileColumns, ...style }}
    >
      {children}
    </div>
  );
}
