import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaLightbulb, FaRocket, FaTools } from "react-icons/fa";
import { getFundingGroups, getFundingPrograms, getProgramsByGroup } from "@site/src/data/funding";
import { scrollToElement } from "@site/src/utils/jsUtils";
import ProgramCard from "./ProgramCard";
import styles from "./styles.module.css";

const ICONS = { grants: <FaLightbulb />, accelerators: <FaRocket />, contributors: <FaTools /> };

// Which tab a URL hash points at: a group key (#grants) or a program
// (#program-orion). -1 when the hash is something else.
function tabIndexForHash(hash) {
  const keys = getFundingGroups().map((group) => group.key);
  if (keys.includes(hash)) return keys.indexOf(hash);
  if (!hash.startsWith("program-")) return -1;
  const program = getFundingPrograms().find((p) => p.key === hash.slice("program-".length));
  return program ? keys.indexOf(program.group) : -1;
}

// Every panel renders (forceRenderTabPanel), so all programs are in the HTML;
// CSS hides the inactive panels.
export default function FundingPrograms() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const groups = getFundingGroups();

  useEffect(() => {
    // Select the tab the URL hash points at, then scroll once the panel is
    // displayed (after the router's own scroll to top, like Divider does).
    const selectFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "").toLowerCase();
      const index = tabIndexForHash(hash);
      if (index < 0) return;
      setSelectedIndex(index);
      window.setTimeout(() => scrollToElement(document.getElementById(hash)), 100);
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
              {getProgramsByGroup(group.key).map((program) => (
                <ProgramCard key={program.key} program={program} />
              ))}
            </div>
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
}
