import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import {
  FaArrowRight,
  FaBullhorn,
  FaCog,
  FaPlus,
  FaMinus,
  FaRocket,
  FaStar,
  FaUniversity,
  FaUsers,
} from "react-icons/fa";
import { translate } from "@docusaurus/Translate";
import Divider from "@site/src/components/Layout/Divider";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
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

function renderAnswer(answerArray) {
  const elements = [];
  let currentList = [];

  answerArray.forEach((text, idx) => {
    if (text.startsWith("- ")) {
      currentList.push(text.substring(2).trim());
      return;
    }
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${idx}`}>
          {currentList.map((item, i) => (
            <li key={i}>{parseMarkdownLikeText(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
    elements.push(<p key={`p-${idx}`}>{parseMarkdownLikeText(text)}</p>);
  });

  if (currentList.length > 0) {
    elements.push(
      <ul key="list-end">
        {currentList.map((item, i) => (
          <li key={i}>{parseMarkdownLikeText(item)}</li>
        ))}
      </ul>
    );
  }

  return elements;
}

function AccordionItem({ question, answer, isOpen, onToggle, itemRef }) {
  return (
    <div ref={itemRef} className={clsx(styles.accordion, isOpen && styles.accordionOpen)}>
      <button type="button" className={styles.accordionTrigger} onClick={onToggle}>
        <span className={styles.accordionIcon} aria-hidden="true">
          {isOpen ? <FaMinus /> : <FaPlus />}
        </span>
        <span className={styles.accordionQuestion}>{question}</span>
      </button>
      {isOpen && <div className={styles.accordionAnswer}>{renderAnswer(answer)}</div>}
    </div>
  );
}

export default function GovernanceFAQ({ data }) {
  const categoryMeta = getCategoryMeta();
  const categories = CATEGORY_ORDER
    .map((key) => ({
      key,
      ...categoryMeta[key],
      items: data
        .map((entry, idx) => ({ ...entry, _index: idx }))
        .filter((entry) => entry.category === key),
    }))
    .filter((cat) => cat.items.length > 0);

  const popularItems = data
    .map((entry, idx) => ({ ...entry, _index: idx }))
    .filter((entry) => entry.popular);

  const [activeCategory, setActiveCategory] = useState(categories[0]?.key);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const sectionRefs = useRef({});
  const questionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveCategory(visible[0].target.dataset.category);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [categories.length]);

  const scrollToCategory = (key) => {
    const el = sectionRefs.current[key];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const openQuestion = (entry) => {
    setOpenQuestionIndex(entry._index);
    setActiveCategory(entry.category);
    requestAnimationFrame(() => {
      const el = questionRefs.current[entry._index];
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  return (
    <div className={styles.wrapper}>
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
                key={entry._index}
                type="button"
                className={styles.popularCard}
                onClick={() => openQuestion(entry)}
              >
                <span className={styles.popularNumber}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.popularQuestion}>{entry.question}</span>
                <span className={styles.popularSummary}>{entry.popular}</span>
                <FaArrowRight className={styles.popularArrow} aria-hidden="true" />
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
                  onClick={() => scrollToCategory(cat.key)}
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
              <div className={styles.panelAccordion}>
                {cat.items.map((entry) => (
                  <AccordionItem
                    key={entry._index}
                    itemRef={(el) => (questionRefs.current[entry._index] = el)}
                    question={entry.question}
                    answer={entry.answer}
                    isOpen={openQuestionIndex === entry._index}
                    onToggle={() =>
                      setOpenQuestionIndex(
                        openQuestionIndex === entry._index ? null : entry._index
                      )
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
