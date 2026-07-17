import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import clsx from "clsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { translate } from "@docusaurus/Translate";
import AccountabilityRole from "@site/src/components/AccountabilityRole";
import { getAccountabilityRoles } from "@site/src/data/governanceAccountability";
import styles from "./styles.module.css";

const STORAGE_KEY = "cardano-accountability-role";

export default function AccountabilityRoles() {
  const roles = useMemo(() => getAccountabilityRoles(), []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef(null);

  // Map the deep-link hashes (also used by the top stat strip) to tab indexes,
  // derived from the roles data so it stays in sync with any reordering.
  const idToIndex = useMemo(() => Object.fromEntries(roles.map((r, i) => [r.id, i])), [roles]);

  // Remember the chosen role in client-only localStorage (stored by role id so
  // it survives any reordering of the roles).
  const persist = useCallback((index) => {
    try {
      localStorage.setItem(STORAGE_KEY, roles[index]?.id ?? "");
    } catch (e) {}
  }, [roles]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const applyHash = (scroll) => {
      const hash = window.location.hash.replace(/^#/, "").toLowerCase();
      const idx = idToIndex[hash];
      if (idx == null) return false;
      setSelectedIndex(idx);
      persist(idx);
      if (scroll) {
        wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return true;
    };

    // Priority on mount: a URL hash (deep link) always wins and scrolls into
    // view. Otherwise restore the last chosen role from localStorage without
    // scrolling, so a normal page load stays at the top.
    if (!applyHash(true)) {
      try {
        const idx = idToIndex[localStorage.getItem(STORAGE_KEY)];
        // Restore the saved role on mount (client-only).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (idx != null) setSelectedIndex(idx);
      } catch (e) {}
    }

    // Incoming hash changes (stat strip links, in-page anchors) switch tabs.
    const onHashChange = () => applyHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [persist, idToIndex]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    persist(index);
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.heading}>
        <h2 className={styles.title}>
          {translate({
            id: "governance.accountability.roles.title",
            message: "Who keeps Cardano governance accountable?",
          })}
        </h2>
        <p className={styles.subtitle}>
          {translate({
            id: "governance.accountability.roles.subtitle",
            message:
              "Select a role to understand its mandate, responsibilities, and how the community can verify its work.",
          })}
        </p>
      </div>

      <Tabs
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        forceRenderTabPanel
      >
        <TabList className={styles.tabList}>
          {roles.map((role, index) => (
            <Tab
              key={role.id}
              className={clsx(styles.card, styles[`accent_${role.accent}`])}
              selectedClassName={styles.cardSelected}
            >
              <span className={styles.cardIcon} aria-hidden="true">{role.icon}</span>
              <span className={styles.cardTitle}>{role.title}</span>
              <span className={styles.cardTeaser}>{role.teaser}</span>
            </Tab>
          ))}
        </TabList>

        {roles.map((role) => (
          <TabPanel key={role.id} className={styles.panel} selectedClassName={styles.panelSelected}>
            <AccountabilityRole role={role} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
