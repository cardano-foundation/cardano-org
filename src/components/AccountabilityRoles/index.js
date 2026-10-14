import React, { useRef, useMemo } from "react";
import clsx from "clsx";
import { TabsRoot, TabList, Tab, TabPanel, useHashTab } from "@site/src/components/Layout/Tabs";
import { translate } from "@docusaurus/Translate";
import AccountabilityRole from "@site/src/components/AccountabilityRole";
import { getAccountabilityRoles } from "@site/src/data/governanceAccountability";
import styles from "./styles.module.css";
import { scrollBehavior } from "@site/src/utils/jsUtils";

const STORAGE_KEY = "cardano-accountability-role";

export default function AccountabilityRoles() {
  const roles = useMemo(() => getAccountabilityRoles(), []);
  const wrapperRef = useRef(null);

  // Deep-link hashes (also used by the top stat strip) are the role ids, and
  // the chosen role is remembered by id so it survives any reordering.
  const [selectedIndex, select] = useHashTab({
    ids: roles.map((role) => role.id),
    storageKey: STORAGE_KEY,
    onHashSelect: () => wrapperRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" }),
  });

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

      <TabsRoot
        selectedIndex={selectedIndex}
        onSelect={select}
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
          <TabPanel key={role.id}>
            <AccountabilityRole role={role} />
          </TabPanel>
        ))}
      </TabsRoot>
    </div>
  );
}
