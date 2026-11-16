import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

/**
 * Responsive grid of cards or tiles. Columns wrap by a minimum item width, so
 * the number of columns follows the available space.
 *
 * @param {object} props
 * @param {string} [props.minItemWidth="240px"] Minimum width of a column. A container narrower than this gets one full width column.
 * @param {string} [props.gap="1rem"] Space between items.
 * @param {boolean} [props.fit=false] Stretches the items over empty tracks (`auto-fit`). By default empty tracks stay (`auto-fill`), so a single item does not span the whole row.
 * @param {boolean} [props.stackOnMobile=false] One column at 768px width and below.
 * @param {string} [props.as="div"] Element to render, for example `ul` for a list of items.
 * @param {string} [props.className] Extra class, for example for the outer margin.
 * @param {object} [props.style] Inline styles, merged with the grid variables.
 * @param {React.ReactNode} props.children The items.
 */
export default function Grid({
  minItemWidth,
  gap,
  fit = false,
  stackOnMobile = false,
  as: Tag = "div",
  className,
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      {...rest}
      className={clsx(styles.grid, fit && styles.fit, stackOnMobile && styles.stack, className)}
      // Unset props leave the variables to the page class, React drops undefined values.
      style={{ "--grid-min": minItemWidth, "--grid-gap": gap, ...style }}
    >
      {children}
    </Tag>
  );
}
