import React from "react";
import styles from "./styles.module.css";

//
// This component:
// ensures consistent boundaries of its children on all screen sizes
// most of the time you do not want to put a <BackgroundWrapper> as a child of <BoundaryBox>
// while it is usually fine to have a <BoundaryBox as a child of a <BackgroundWrapper>

export default function BoundaryBox({ children }) {
  return <div className={styles.boundaryBox}>{children}</div>;
}
