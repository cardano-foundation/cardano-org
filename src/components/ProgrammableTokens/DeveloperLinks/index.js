import React from "react";
import Link from "@docusaurus/Link";
import { FaArrowRight } from "react-icons/fa";
import styles from "./styles.module.css";

// Row of developer link cards for the /programmable-tokens page (label on the
// left, arrow on the right). Four equal columns on desktop, two on tablets,
// and one on phones. External hrefs open in a new tab.
//
// Props:
//   links - ARCHITECTURE.developer.links from src/data/programmable-tokens.js
//           ([{ label, href }])

export default function DeveloperLinks({ links }) {
  return (
    <ul className={styles.links}>
      {links.map((link) => {
        const isExternal = /^https?:\/\//.test(link.href);
        return (
          <li key={link.href}>
            <Link
              to={link.href}
              className={styles.link}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className={styles.label}>{link.label}</span>
              <span className={styles.arrow} aria-hidden="true">
                <FaArrowRight />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
