import React, { useId, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

// PillTabs. A row of pill-shaped tab buttons above a content panel. The
// active pill is filled with the brand blue, the others sit on a neutral
// surface. Implements the WAI-ARIA tabs pattern: role="tablist" / "tab" /
// "tabpanel", roving tabindex, and Arrow Left / Right, Home, and End keys with
// automatic activation.
//
// Every panel is rendered on the server and the inactive ones are hidden with
// the `hidden` attribute, so all content stays in the HTML for search engines
// and for readers without JavaScript.
//
// Used for the regulatory frameworks per jurisdiction on the
// /programmable-tokens page.

/**
 * Row of pill-shaped tabs above a content panel, following the WAI-ARIA tabs pattern.
 *
 * @param {object} props
 * @param {Array<{id: string, label: React.ReactNode, content: React.ReactNode}>} [props.tabs=[]] Tabs. `id` must be unique within the component.
 * @param {string} [props.ariaLabel] Accessible name of the tab list, already translated.
 * @param {number} [props.defaultIndex=0] Index of the tab that starts active. Out of range values fall back to 0.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function PillTabs({ tabs = [], ariaLabel, defaultIndex = 0, className }) {
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(() =>
    defaultIndex >= 0 && defaultIndex < tabs.length ? defaultIndex : 0
  );
  const tabRefs = useRef([]);

  const tabId = (tab) => `${baseId}tab-${tab.id}`;
  const panelId = (tab) => `${baseId}panel-${tab.id}`;

  const activate = (index) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event) => {
    const last = tabs.length - 1;
    switch (event.key) {
      case "ArrowRight":
        activate(activeIndex === last ? 0 : activeIndex + 1);
        break;
      case "ArrowLeft":
        activate(activeIndex === 0 ? last : activeIndex - 1);
        break;
      case "Home":
        activate(0);
        break;
      case "End":
        activate(last);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  return (
    <div className={clsx(styles.pillTabs, className)}>
      <div className={styles.tabList} role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={tabId(tab)}
              aria-selected={isActive}
              aria-controls={panelId(tab)}
              tabIndex={isActive ? 0 : -1}
              className={clsx(styles.tab, isActive && styles.tabActive)}
              onClick={() => setActiveIndex(index)}
              onKeyDown={onKeyDown}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelId(tab)}
          aria-labelledby={tabId(tab)}
          tabIndex={0}
          hidden={index !== activeIndex}
          className={styles.panel}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
