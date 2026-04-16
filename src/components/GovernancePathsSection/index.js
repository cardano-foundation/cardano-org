import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { FaArrowRight } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

function getPathsData() {
  return [
    {
      label: translate({ id: "governance.paths.understand.label", message: "Understand" }),
      subtitle: translate({
        id: "governance.paths.understand.subtitle",
        message: "Learn how governance works",
      }),
      title: translate({ id: "governance.paths.understand.title", message: "Learn how governance works" }),
      body: translate({
        id: "governance.paths.understand.body",
        message:
          "New to Cardano governance? Read the constitution, explore governance action charts, or browse the governance tools to understand how proposals move from submission to enactment.",
      }),
      ctaLink: "/insights/governance-actions/?category=General&chart=General%3AHard-Fork%20Initiation#charts",
      ctaTitle: translate({ id: "governance.paths.understand.buttonText2", message: "Action Charts" }),
      secondaryCtaLink: "/constitution",
      secondaryCtaTitle: translate({ id: "governance.paths.understand.buttonText", message: "Read the Constitution" }),
    },
    {
      label: translate({ id: "governance.paths.delegate.label", message: "Delegate" }),
      subtitle: translate({
        id: "governance.paths.delegate.subtitle",
        message: "Give voting power to a DRep",
      }),
      title: translate({ id: "governance.paths.delegate.title", message: "Delegate your voting power" }),
      body: translate({
        id: "governance.paths.delegate.body",
        message:
          "You already have voting power. Delegation lends your vote to a Delegated Representative (DRep) who votes on your behalf. Your ada never leaves your wallet, only a small transaction fee applies, and you can change your DRep at any time.",
      }),
      ctaLink: "/governance/delegate",
      ctaTitle: translate({ id: "governance.paths.delegate.buttonText", message: "Choose a DRep" }),
    },
    {
      label: translate({ id: "governance.paths.lead.label", message: "Lead" }),
      subtitle: translate({
        id: "governance.paths.lead.subtitle",
        message: "Run for a governance role",
      }),
      title: translate({ id: "governance.paths.lead.title", message: "Become a DRep" }),
      body: translate({
        id: "governance.paths.lead.body",
        message:
          "Represent your community and shape Cardano policy. DReps actively engage in governance, stay informed on proposals, and vote on behalf of those who delegate to them. A refundable deposit of 500 ada is required and will be returned upon retirement.",
      }),
      ctaLink: "https://docs.gov.tools/about/what-is-cardano-govtool/govtool-functions/dreps/register-as-a-drep",
      ctaTitle: translate({ id: "governance.paths.lead.buttonText", message: "Register as a DRep" }),
    },
  ];
}

const HASH_TO_INDEX = { understand: 0, delegate: 1, lead: 2 };

export default function GovernancePathsSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const paths = getPathsData();
  const wrapperRef = useRef(null);

  const iconUrls = [
    useBaseUrl("/img/dotted-icons/governance-charts.png"),
    useBaseUrl("/img/dotted-icons/dreps.png"),
    useBaseUrl("/img/dotted-icons/constitutional-committee.png"),
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "").toLowerCase();
    const idx = HASH_TO_INDEX[hash];
    if (idx == null) return;
    setSelectedIndex(idx);
    wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Tabs
        className={styles.tabs}
        onSelect={(index) => setSelectedIndex(index)}
        selectedIndex={selectedIndex}
      >
        <div className={clsx("row", styles.row)}>
          <div className={clsx("col col--5", styles.leftColumn)}>
            <TabList className={styles.tabList}>
              <span className={styles.stepperLine} aria-hidden="true" />
              {paths.map((path, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <Tab
                    className={clsx(styles.tab, { [styles.tabSelected]: isSelected })}
                    selectedClassName={styles.tabSelected}
                    key={path.label}
                  >
                    <div
                      className={clsx(styles.stepCircle, {
                        [styles.stepCircleActive]: isSelected,
                      })}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    {isSelected && (
                      <FaArrowRight className={styles.stepArrow} aria-hidden="true" />
                    )}
                    <div className={styles.stepText}>
                      <div className={styles.tabLabel}>{path.label}</div>
                      <div className={styles.tabSubtitle}>{path.subtitle}</div>
                    </div>
                  </Tab>
                );
              })}
            </TabList>
          </div>
          <div className={clsx("col col--7", styles.rightColumn)}>
            {paths.map((path, index) => (
              <TabPanel key={path.label}>
                <div className={styles.panelContent}>
                  <div className={styles.iconTile}>
                    <img src={iconUrls[index]} alt="" className={styles.iconImage} />
                  </div>
                  <h2 className={styles.panelTitle}>{path.title}</h2>
                  <p className={styles.panelBody}>{path.body}</p>
                  <div className={styles.buttonWrap}>
                    <Link
                      className="button button--primary button--lg"
                      to={path.ctaLink}
                    >
                      {path.ctaTitle}
                    </Link>
                    {path.secondaryCtaLink && (
                      <Link
                        className="button button--outline button--primary button--lg"
                        to={path.secondaryCtaLink}
                      >
                        {path.secondaryCtaTitle}
                      </Link>
                    )}
                  </div>
                </div>
              </TabPanel>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
