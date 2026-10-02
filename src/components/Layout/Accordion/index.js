import React, { useId, useState } from "react";
import clsx from "clsx";
import { FaMinus, FaPlus } from "react-icons/fa";
import { renderAnswerArray } from "@site/src/utils/textUtils";
import styles from "./styles.module.css";

// Accordion. A plain list of expandable question and answer rows separated by
// hairlines: no card background, a semibold question on the left and a
// plus / minus icon on the right. Each row is a real <button> inside an <h3>
// with aria-expanded / aria-controls, and each answer is a labeled region that
// opens and closes with a height transition (instant with reduced motion).
//
// Used for the FAQ on the /programmable-tokens page. Use FAQSection instead when
// you want the "FAQ" Divider heading and the alternating row backgrounds.
//
// Props:
//   items            - array of { question, answer }. `answer` is either an
//                      array of strings (rendered through renderAnswerArray, so
//                      "- " bullets, [text](url) links and **bold** work) or a
//                      React node.
//   defaultOpenIndex - index of the item that starts open (default: none)
//   allowMultiple    - when true, opening a row no longer closes the others
//   className        - optional extra class for the wrapper

function AccordionItem({ question, answer, isOpen, onToggle }) {
  const baseId = useId();
  const triggerId = `${baseId}trigger`;
  const panelId = `${baseId}panel`;
  const content = Array.isArray(answer) ? renderAnswerArray(answer) : answer;

  return (
    <div className={clsx(styles.item, isOpen && styles.itemOpen)}>
      <h3 className={styles.heading}>
        <button
          type="button"
          id={triggerId}
          className={styles.trigger}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className={styles.question}>{question}</span>
          <span className={styles.icon} aria-hidden="true">
            {isOpen ? <FaMinus /> : <FaPlus />}
          </span>
        </button>
      </h3>
      {/* Always rendered so the height can animate (and the answers are in
          the HTML); a closed panel is hidden from the tab order and from
          assistive technology with visibility: hidden in the CSS. */}
      <div id={panelId} role="region" aria-labelledby={triggerId} className={styles.panel}>
        <div className={styles.panelInner}>
          <div className={styles.panelContent}>{content}</div>
        </div>
      </div>
    </div>
  );
}

function toIndexList(value) {
  const list = Array.isArray(value) ? value : [value];
  return list.filter((index) => Number.isInteger(index) && index >= 0);
}

export default function Accordion({
  items = [],
  defaultOpenIndex = null,
  allowMultiple = false,
  className,
}) {
  const [openIndexes, setOpenIndexes] = useState(() => toIndexList(defaultOpenIndex));

  const toggle = (index) => {
    setOpenIndexes((current) => {
      if (current.includes(index)) {
        return current.filter((openIndex) => openIndex !== index);
      }
      return allowMultiple ? [...current, index] : [index];
    });
  };

  return (
    <div className={clsx(styles.accordion, className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndexes.includes(index)}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  );
}
