import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaLightbulb, FaRocket, FaTools } from "react-icons/fa";
import { getFundingGroups, getFundingVenues, getVenuesByGroup } from "@site/src/data/funding";
import ProgramCard from "./ProgramCard";
import styles from "./styles.module.css";

const ICONS = { grants: <FaLightbulb />, accelerators: <FaRocket />, contributors: <FaTools /> };

// Which tab a URL hash points at: a group key (#grants) or a program
// (#program-orion). -1 when the hash is something else.
function tabIndexForHash(hash) {
  const keys = getFundingGroups().map((group) => group.key);
  if (keys.includes(hash)) return keys.indexOf(hash);
  if (!hash.startsWith("program-")) return -1;
  const venue = getFundingVenues().find((v) => v.key === hash.slice("program-".length));
  return venue ? keys.indexOf(venue.group) : -1;
}

// Persona switcher for the grants and funding page: one tab per group
// ("I have an idea", ...) above one card grid. Every panel renders, so all
// programs are in the HTML; only the selected one is displayed. A hash in
// the URL selects the matching tab.
export default function FundingPrograms() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const groups = getFundingGroups();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    // Select the tab addressed by the URL hash, on mount and whenever the
    // hash changes, then scroll once the panel is displayed.
    const selectFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "").toLowerCase();
      const index = tabIndexForHash(hash);
      if (index < 0) return;
      setSelectedIndex(index);
      // After the router's own scroll-to-top has run.
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      }, 100);
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, []);

  return (
    <Tabs
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}
      forceRenderTabPanel
    >
      <TabList className={styles.tabList}>
        {groups.map((group) => (
          <Tab key={group.key} className={styles.tab} selectedClassName={styles.tabSelected}>
            <span className={styles.tabIcon} aria-hidden="true">{ICONS[group.key]}</span>
            {group.persona}
          </Tab>
        ))}
      </TabList>
      {groups.map((group) => (
        <TabPanel key={group.key} className={styles.panel} selectedClassName={styles.panelSelected}>
          <div id={group.key} className={styles.panelAnchor}>
            <h3 className={styles.panelTitle}>{group.title}</h3>
            <p className={styles.panelIntro}>{group.intro}</p>
            <div className={styles.grid}>
              {getVenuesByGroup(group.key).map((venue) => (
                <ProgramCard key={venue.key} venue={venue} />
              ))}
            </div>
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
}
