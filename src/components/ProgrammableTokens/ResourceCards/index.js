import React from "react";
import Link from "@docusaurus/Link";
import { FaArrowRight } from "react-icons/fa";
import HorizontalScroller from "@site/src/components/Layout/HorizontalScroller";
import styles from "./styles.module.css";

// Resources for the /programmable-tokens page. One link card per resource
// (title at the top, arrow pinned to the bottom). External hrefs open in a
// new tab.
//
// Up to CAROUSEL_THRESHOLD resources always fit side by side on desktop, so
// they render as a plain row that stacks on phones. More than that go into
// the shared HorizontalScroller for arrows and snap scrolling. The choice
// depends only on the number of items, so the server and the browser render
// the same layout.
//
// Props:
//   resources - COMPLIANCE.resources from src/data/programmable-tokens.js
//               ({ ariaLabel, prevLabel, nextLabel, items: [{ title, href }] })

const CAROUSEL_THRESHOLD = 3;

function ResourceCard({ title, href }) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <Link
      to={href}
      className={styles.card}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={styles.title}>{title}</span>
      <span className={styles.arrow} aria-hidden="true">
        <FaArrowRight />
      </span>
    </Link>
  );
}

export default function ResourceCards({ resources }) {
  if (resources.items.length <= CAROUSEL_THRESHOLD) {
    return (
      <ul className={styles.row} aria-label={resources.ariaLabel}>
        {resources.items.map((item) => (
          <li key={item.href}>
            <ResourceCard title={item.title} href={item.href} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <HorizontalScroller
      ariaLabel={resources.ariaLabel}
      prevLabel={resources.prevLabel}
      nextLabel={resources.nextLabel}
      gap="32px"
      itemWidth="280px"
      itemWidthMobile="260px"
    >
      {resources.items.map((item) => (
        <ResourceCard key={item.href} title={item.title} href={item.href} />
      ))}
    </HorizontalScroller>
  );
}
