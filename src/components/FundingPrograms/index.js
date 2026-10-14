import React from "react";
import { TabsRoot, TabList, Tab, TabPanel, useHashTab } from "@site/src/components/Layout/Tabs";
import { FaLightbulb, FaRocket, FaTools } from "react-icons/fa";
import { getFundingGroups, getFundingPrograms, getProgramsByGroup } from "@site/src/data/funding";
import { scrollToElement } from "@site/src/utils/jsUtils";
import ProgramCard from "./ProgramCard";
import styles from "./styles.module.css";

const ICONS = { grants: <FaLightbulb />, accelerators: <FaRocket />, contributors: <FaTools /> };

// Tab of a program hash (#program-orion), so a link to one program opens the
// group that lists it. -1 when the hash is something else.
function tabIndexForProgramHash(hash) {
  if (!hash.startsWith("program-")) return -1;
  const program = getFundingPrograms().find((p) => p.key === hash.slice("program-".length));
  return program ? getFundingGroups().findIndex((group) => group.key === program.group) : -1;
}

// Every panel renders (the Layout/Tabs default), so all programs are in the
// HTML, and Layout/Tabs hides the inactive panels.
/**
 * Tabbed overview of funding programs by group, synced with the URL hash. Takes no props.
 */
export default function FundingPrograms() {
  const groups = getFundingGroups();
  // Select the tab the URL hash points at, then scroll once the panel is
  // displayed (after the router's own scroll to top, like Divider does).
  const [selectedIndex, select] = useHashTab({
    ids: groups.map((group) => group.key),
    indexForHash: tabIndexForProgramHash,
    onHashSelect: (hash) => window.setTimeout(() => scrollToElement(document.getElementById(hash)), 100),
  });

  return (
    <TabsRoot
      selectedIndex={selectedIndex}
      onSelect={select}
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
        <TabPanel key={group.key}>
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
    </TabsRoot>
  );
}
