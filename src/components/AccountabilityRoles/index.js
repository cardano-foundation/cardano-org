import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { translate } from "@docusaurus/Translate";
import AccountabilityRole from "@site/src/components/AccountabilityRole";
import { getAccountabilityRoles } from "@site/src/data/governanceAccountability";
import styles from "./styles.module.css";

// Map the deep-link hashes (also used by the top stat strip) to tab indexes.
const HASH_TO_INDEX = { dreps: 0, committee: 1, spos: 2, funding: 3 };

export default function AccountabilityRoles() {
  const roles = getAccountabilityRoles();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const applyHash = (scroll) => {
      const hash = window.location.hash.replace(/^#/, "").toLowerCase();
      const idx = HASH_TO_INDEX[hash];
      if (idx == null) return;
      setSelectedIndex(idx);
      if (scroll) {
        wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Select the tab addressed by the URL hash on mount (client-only).
    applyHash(true);

    // Incoming hash changes (stat strip links, in-page anchors) switch tabs.
    const onHashChange = () => applyHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

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
        onSelect={(index) => setSelectedIndex(index)}
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
            <AccountabilityRole role={role} liveValue={null} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
