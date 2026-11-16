import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

//
// This component:
// ensures consistent boundaries of its children on all screen sizes
// most of the time you do not want to put a <BackgroundWrapper> as a child of <BoundaryBox>
// while it is usually fine to have a <BoundaryBox as a child of a <BackgroundWrapper>

/**
 * Keeps its children inside the page boundary with consistent horizontal padding.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children Content to constrain.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function BoundaryBox({ children, className, ...rest }) {
  return (
    <div className={clsx(styles.boundaryBox, className)} {...rest}>
      {children}
    </div>
  );
}
