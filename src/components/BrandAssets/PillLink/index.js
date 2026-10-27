import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

// Brand assets download button: a Cardano Blue pill with a Chivo Mono label, as
// in the Brand Hub Figma file. External links open in a new tab.
//
// Props:
//   href      - link target
//   children  - button label
//   fixed     - keep the light-mode colors in dark mode (for buttons that sit
//               on a fixed Clarity card)
//   className - extra class on the link

export default function PillLink({ href, children, fixed = false, className }) {
  const isExternal = /^https?:\/\//.test(href);

  return (
    <Link
      className={clsx(styles.pill, fixed && styles.pillFixed, className)}
      to={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}
