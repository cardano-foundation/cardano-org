import React from "react";
import clsx from "clsx";
import {
  Tabs as ReactTabs,
  TabList as ReactTabList,
  Tab as ReactTab,
  TabPanel as ReactTabPanel,
} from "react-tabs";
import styles from "./styles.module.css";

// Tabs built on react-tabs, which supplies the WAI-ARIA roles, the roving
// tabindex and the keyboard handling (arrows, Home, End). The parts below add
// base classes that hide inactive panels, so no global react-tabs stylesheet
// is needed. Every panel is rendered by default, so all content stays in the
// HTML for search engines and readers without JavaScript.

/**
 * Root of a custom tab layout. Wraps react-tabs' Tabs.
 *
 * @param {object} props
 * @param {number} [props.selectedIndex] Selected tab for controlled use, together with `onSelect`.
 * @param {number} [props.defaultIndex] Tab that starts selected when uncontrolled.
 * @param {Function} [props.onSelect] Called with `(index, lastIndex, event)`. Returning `false` cancels the change.
 * @param {boolean} [props.forceRenderTabPanel=true] Renders the content of every panel, not only the selected one.
 * @param {string} [props.className] Extra class on the root element.
 * @param {React.ReactNode} props.children `TabList` and `TabPanel` elements.
 */
export function TabsRoot({ selectedIndex, forceRenderTabPanel = true, className, ...rest }) {
  // Strip props that would replace the parts' base state classes.
  const { selectedTabClassName, selectedTabPanelClassName, ...props } = rest;
  return (
    <ReactTabs
      {...props}
      // react-tabs treats an explicit undefined as controlled mode
      {...(selectedIndex != null && { selectedIndex })}
      forceRenderTabPanel={forceRenderTabPanel}
      className={clsx(styles.root, className)}
    />
  );
}
TabsRoot.tabsRole = "Tabs";

/**
 * List that holds the `Tab` elements. Renders a `ul` with `role="tablist"`.
 *
 * @param {object} props
 * @param {string} [props.className] Extra class on the list.
 */
export function TabList({ className, ...rest }) {
  return <ReactTabList {...rest} className={clsx(styles.list, className)} />;
}
TabList.tabsRole = "TabList";

/**
 * One tab. Renders an `li` with `role="tab"`.
 *
 * @param {object} props
 * @param {string} [props.className] Extra class on the tab.
 * @param {string} [props.selectedClassName] Extra class while the tab is selected.
 */
export function Tab({ className, selectedClassName, ...rest }) {
  return (
    <ReactTab
      {...rest}
      className={clsx(styles.tab, className)}
      selectedClassName={clsx(styles.tabSelected, selectedClassName)}
    />
  );
}
Tab.tabsRole = "Tab";

/**
 * Content of one tab. Hidden while its tab is not selected.
 *
 * @param {object} props
 * @param {string} [props.className] Extra class on the panel.
 * @param {string} [props.selectedClassName] Extra class while the panel is shown.
 */
export function TabPanel({ className, selectedClassName, ...rest }) {
  return (
    <ReactTabPanel
      {...rest}
      className={clsx(styles.panel, className)}
      selectedClassName={clsx(styles.panelSelected, selectedClassName)}
    />
  );
}
TabPanel.tabsRole = "TabPanel";

const VARIANTS = { pill: styles.pill };

/**
 * Tabs from a list of items, in one of the shared looks.
 *
 * @param {object} props
 * @param {Array<{id: string, label: React.ReactNode, content: React.ReactNode}>} [props.items=[]] Tabs in display order. `id` must be unique within the component.
 * @param {string} [props.variant="pill"] Look of the tabs. Only `pill` exists so far.
 * @param {string} [props.ariaLabel] Accessible name of the tab list, already translated.
 * @param {number} [props.defaultIndex=0] Tab that starts selected when uncontrolled. Out of range values fall back to 0.
 * @param {number} [props.selectedIndex] Selected tab for controlled use, together with `onSelect`.
 * @param {Function} [props.onSelect] Called with `(index, lastIndex, event)`. Returning `false` cancels the change.
 * @param {boolean} [props.forceRenderTabPanel=true] Renders the content of every panel, not only the selected one.
 * @param {string} [props.className] Extra class on the wrapper.
 */
export default function Tabs({
  items = [],
  variant = "pill",
  ariaLabel,
  defaultIndex = 0,
  selectedIndex,
  onSelect,
  forceRenderTabPanel,
  className,
}) {
  const safeDefault = defaultIndex >= 0 && defaultIndex < items.length ? defaultIndex : 0;
  return (
    <TabsRoot
      className={clsx(VARIANTS[variant], className)}
      defaultIndex={selectedIndex == null ? safeDefault : undefined}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
      forceRenderTabPanel={forceRenderTabPanel}
    >
      <TabList aria-label={ariaLabel}>
        {items.map((item) => (
          <Tab key={item.id}>{item.label}</Tab>
        ))}
      </TabList>
      {items.map((item) => (
        <TabPanel key={item.id} tabIndex={0}>
          {item.content}
        </TabPanel>
      ))}
    </TabsRoot>
  );
}
