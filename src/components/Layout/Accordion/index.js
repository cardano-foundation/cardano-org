import React, { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { FaMinus, FaPlus } from "react-icons/fa";
import { renderAnswerArray } from "@site/src/utils/textUtils";
import { getHeading } from "@site/src/utils/heading";
import styles from "./styles.module.css";

// Accordion. A plain list of expandable question and answer rows separated by
// hairlines: no card background, a semibold question on the left and a
// plus / minus icon on the right. Each row is a real <button> inside a heading
// (an <h3> unless headingLevel says otherwise)
// with aria-expanded / aria-controls, and each answer is a labeled region that
// opens and closes with a height transition (instant with reduced motion).
//
// Used for the FAQ on the /programmable-tokens page and inside FAQSection, which
// adds the "FAQ" Divider heading above the rows.

function AccordionItem({ id, question, answer, isOpen, onToggle, headingTag: Heading }) {
  const baseId = useId();
  const triggerId = `${baseId}trigger`;
  const panelId = `${baseId}panel`;
  const content = Array.isArray(answer) ? renderAnswerArray(answer) : answer;
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  // A panel that closes, also from outside, would hide the element that has
  // focus. Move focus back to the row's trigger.
  useEffect(() => {
    if (!isOpen && panelRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div id={id} className={clsx(styles.item, isOpen && styles.itemOpen)}>
      <Heading className={styles.heading}>
        <button
          ref={triggerRef}
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
      </Heading>
      {/* Always rendered so the height can animate (and the answers are in
          the HTML); a closed panel is hidden from the tab order and from
          assistive technology with visibility: hidden in the CSS. */}
      <div ref={panelRef} id={panelId} role="region" aria-labelledby={triggerId} className={styles.panel}>
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

/**
 * List of expandable question and answer rows.
 *
 * @param {object} props
 * @param {Array<{id?: string, question: React.ReactNode, answer: (string[]|React.ReactNode)}>} [props.items=[]] Rows. A string array answer goes through renderAnswerArray, so bullets, links, and bold work. An `id` is set on the row, so it can be a scroll or link target, and is the row's key.
 * @param {number|number[]|null} [props.defaultOpenIndex=null] Index or indexes of the rows that start open. Ignored when `openKeys` is set.
 * @param {boolean} [props.allowMultiple=false] Keeps other rows open when a row opens. Ignored when `openKeys` is set.
 * @param {Array<string|number>} [props.openKeys] Open rows for controlled use, by `id` or else by index. With it, the page owns the state through `onToggle`.
 * @param {Function} [props.onToggle] Called with `(key, nextIsOpen)` when the reader opens or closes a row.
 * @param {number} [props.headingLevel=3] Heading level of each question, `0` renders it without heading semantics. The look stays the same.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function Accordion({
  items = [],
  defaultOpenIndex = null,
  allowMultiple = false,
  openKeys,
  onToggle,
  headingLevel,
  className,
}) {
  const [ownOpenKeys, setOwnOpenKeys] = useState(() => toIndexList(defaultOpenIndex));
  const controlled = openKeys !== undefined;
  const currentKeys = controlled ? openKeys : ownOpenKeys;
  const { Tag } = getHeading(headingLevel, 3);

  const toggle = (key) => {
    const nextIsOpen = !currentKeys.includes(key);
    onToggle?.(key, nextIsOpen);
    if (controlled) return;
    setOwnOpenKeys((current) => {
      if (!nextIsOpen) return current.filter((openKey) => openKey !== key);
      return allowMultiple ? [...current, key] : [key];
    });
  };

  return (
    <div className={clsx(styles.accordion, className)}>
      {items.map((item, index) => {
        const key = item.id ?? index;
        return (
          <AccordionItem
            key={key}
            id={item.id}
            question={item.question}
            answer={item.answer}
            headingTag={Tag}
            isOpen={currentKeys.includes(key)}
            onToggle={() => toggle(key)}
          />
        );
      })}
    </div>
  );
}
