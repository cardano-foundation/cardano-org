import React from "react";
import Link from "@docusaurus/Link";
import { FaArrowRight } from "react-icons/fa";
import HorizontalScroller from "@site/src/components/HorizontalScroller";
import { RESOURCES } from "@site/src/data/sustainability";
import styles from "./styles.module.css";

// Sustainability resources carousel. Renders one link card per entry in
// RESOURCES.items (title, short description, and an arrow) inside the shared
// HorizontalScroller, which provides the prev/next arrows and snap scrolling.
//
// The section heading is rendered by the /sustainability page; this component
// only renders the scroller. External hrefs open in a new tab.
//
// Props: none (reads RESOURCES from src/data/sustainability.js)

function ResourceCard({ title, description, href }) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <Link
      to={href}
      className={styles.card}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={styles.top}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        <FaArrowRight />
      </span>
    </Link>
  );
}

export default function ResourceCards() {
  return (
    <HorizontalScroller
      ariaLabel={RESOURCES.ariaLabel}
      prevLabel={RESOURCES.prevLabel}
      nextLabel={RESOURCES.nextLabel}
      gap="32px"
      itemWidth="280px"
      itemWidthMobile="260px"
    >
      {RESOURCES.items.map((item) => (
        <ResourceCard
          key={item.href}
          title={item.title}
          description={item.description}
          href={item.href}
        />
      ))}
    </HorizontalScroller>
  );
}
