import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import clsx from "clsx";
import {
  FaBullhorn,
  FaCog,
  FaRocket,
  FaStar,
  FaUniversity,
  FaUsers,
} from "react-icons/fa";
import { translate } from "@docusaurus/Translate";
import Divider from "@site/src/components/Layout/Divider";
import Accordion, { whenSettled } from "@site/src/components/Layout/Accordion";
import { scrollToElement } from "@site/src/utils/jsUtils";
import useHashTarget from "@site/src/utils/useHashTarget";
import styles from "./styles.module.css";

const CATEGORY_ORDER = [
  "getting-started",
  "delegation",
  "technical",
  "drep-role",
  "governance-basics",
];

function getCategoryMeta() {
  return {
    "getting-started": {
      label: translate({ id: "governance.faq.category.getting-started", message: "Getting started" }),
      Icon: FaRocket,
    },
    delegation: {
      label: translate({ id: "governance.faq.category.delegation", message: "Delegation" }),
      Icon: FaUsers,
    },
    technical: {
      label: translate({ id: "governance.faq.category.technical", message: "Technical" }),
      Icon: FaCog,
    },
    "drep-role": {
      label: translate({ id: "governance.faq.category.drep-role", message: "DRep role" }),
      Icon: FaBullhorn,
    },
    "governance-basics": {
      label: translate({ id: "governance.faq.category.governance-basics", message: "Governance basics" }),
      Icon: FaUniversity,
    },
  };
}

export default function GovernanceFAQ({ data }) {
  const { categories, popularItems } = useMemo(() => {
    const categoryMeta = getCategoryMeta();
    return {
      categories: CATEGORY_ORDER
        .map((key) => ({
          key,
          ...categoryMeta[key],
          items: data.filter((entry) => entry.category === key),
        }))
        .filter((cat) => cat.items.length > 0),
      popularItems: data.filter((entry) => entry.popular),
    };
  }, [data]);

  const [activeCategory, setActiveCategory] = useState(categories[0]?.key);
  // One open question across all category lists, keyed by the entry id.
  const [openId, setOpenId] = useState(null);
  const sectionRefs = useRef({});
  const wrapperRef = useRef(null);
  const intersectingKeys = useRef(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.dataset.category;
          if (entry.isIntersecting) intersectingKeys.current.add(key);
          else intersectingKeys.current.delete(key);
        });
        const topmost = CATEGORY_ORDER.find((key) => intersectingKeys.current.has(key));
        if (topmost) setActiveCategory(topmost);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  const goToCategory = (key) => {
    setActiveCategory(key);
    scrollToElement(sectionRefs.current[key]);
  };

  // Opens a question from outside the lists (popular card, URL hash), scrolls
  // to it and moves focus to its button. An answer that was open above it
  // collapses with a transition and pulls the row up while it runs, so the
  // scroll waits for that collapse to finish.
  const openQuestion = useCallback((entry) => {
    const previous = wrapperRef.current?.querySelector('section [aria-expanded="true"]');
    setOpenId(entry.id);
    setActiveCategory(entry.category);
    requestAnimationFrame(() => {
      const row = document.getElementById(entry.id);
      if (!row) return;
      const above = previous && previous.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING;
      whenSettled(above ? previous.closest("section") : null).then(() => {
        scrollToElement(row);
        row.querySelector("button")?.focus({ preventScroll: true });
      });
    });
  }, []);

  // A link such as /governance#faq-lose-ada opens that question, on load and
  // when the hash changes.
  useHashTarget((target) => {
    const entry = data.find((item) => item.id === target);
    if (entry) openQuestion(entry);
  });

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Divider text={translate({ id: "governance.faq.divider", message: "FAQ" })} id="faq" />

      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>
          {translate({
            id: "governance.faq.title",
            message: "Answers to common questions about delegation and governance.",
          })}
        </h2>
        <p className={styles.heroSubtitle}>
          {translate({
            id: "governance.faq.subtitle",
            message: "Everything you need to know to participate with confidence.",
          })}
        </p>
      </div>

      {popularItems.length > 0 && (
        <>
          <div className={styles.popularLabel}>
            <FaStar aria-hidden="true" />
            {translate({ id: "governance.faq.popular", message: "Popular questions" })}
          </div>
          <div className={styles.popularGrid}>
            {popularItems.map((entry, i) => (
              <button
                key={entry.id}
                type="button"
                className={styles.popularCard}
                onClick={() => openQuestion(entry)}
              >
                <span className={styles.popularNumber}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.popularQuestion}>{entry.question}</span>
                <span className={styles.popularSummary}>{entry.popular}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className={clsx("row", styles.row)}>
        <div className={clsx("col col--4", styles.leftColumn)}>
          <nav className={styles.tabList} aria-label={translate({ id: "governance.faq.categoriesNav", message: "FAQ categories" })}>
            <span className={styles.stepperLine} aria-hidden="true" />
            {categories.map((cat) => {
              const Icon = cat.Icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  className={clsx(styles.tab, isActive && styles.tabSelected)}
                  onClick={() => goToCategory(cat.key)}
                >
                  <span className={styles.tabIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className={styles.tabText}>
                    <span className={styles.tabLabel}>{cat.label}</span>
                    <span className={styles.tabCount}>
                      {cat.items.length === 1
                        ? translate(
                            { id: "governance.faq.questionCount.one", message: "1 question" }
                          )
                        : translate(
                            {
                              id: "governance.faq.questionCount.other",
                              message: "{count} questions",
                            },
                            { count: cat.items.length }
                          )}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className={clsx("col col--8", styles.rightColumn)}>
          {categories.map((cat) => (
            <section
              key={cat.key}
              ref={(el) => (sectionRefs.current[cat.key] = el)}
              data-category={cat.key}
              className={clsx(
                styles.categorySection,
                activeCategory === cat.key && styles.categorySectionActive
              )}
            >
              <div className={styles.panelLabel}>{cat.label}</div>
              <Accordion
                items={cat.items}
                openKeys={openId !== null ? [openId] : []}
                onToggle={(key, isOpen) => setOpenId(isOpen ? key : null)}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
