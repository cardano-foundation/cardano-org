import React, { useState } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { FaArrowRight } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

function getPathsData() {
  return [
    {
      label: translate({ id: "governance.paths.understand.label", message: "Understand" }),

      title: translate({ id: "governance.paths.understand.title", message: "Learn how governance works" }),
      body: translate({
        id: "governance.paths.understand.body",
        message:
          "New to Cardano governance? Read the constitution, explore governance action charts, or browse the governance tools to understand how proposals move from submission to enactment.",
      }),
      ctaLink: "/insights/governance-actions/?category=General#charts",
      ctaTitle: translate({ id: "governance.paths.understand.buttonText2", message: "Governance Action Charts" }),
      secondaryCtaLink: "/constitution",
      secondaryCtaTitle: translate({ id: "governance.paths.understand.buttonText", message: "Read the Constitution" }),
    },
    {
      label: translate({ id: "governance.paths.delegate.label", message: "Delegate" }),

      title: translate({ id: "governance.paths.delegate.title", message: "Delegate your voting power" }),
      body: translate({
        id: "governance.paths.delegate.body",
        message:
          "You already have voting power. Delegation lends your vote to a Delegated Representative (DRep) who votes on your behalf. Your ada never leaves your wallet, it costs nothing extra, and you can change your DRep at any time.",
      }),
      ctaLink: "https://tempo.vote/dreps",
      ctaTitle: translate({ id: "governance.paths.delegate.buttonText", message: "Find a DRep" }),
    },
    {
      label: translate({ id: "governance.paths.lead.label", message: "Lead" }),

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

export default function GovernancePathsSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const paths = getPathsData();
  return (
    <div className={styles.wrapper}>
      <Tabs
        className={styles.tabs}
        onSelect={(index) => setSelectedIndex(index)}
        selectedIndex={selectedIndex}
      >
        <div className="row">
          <div className={clsx("col col--4", styles.leftColumn)}>
            <TabList className={styles.tabList}>
              {paths.map((path, index) => (
                <Tab
                  className={clsx(styles.tab, {
                    [styles.tabSelected]: index === selectedIndex,
                  })}
                  key={path.label}
                >
                  <div className={styles.tabLabel}>
                    {index === selectedIndex && <FaArrowRight className={styles.tabIcon} />}
                    {path.label}
                  </div>
                </Tab>
              ))}
            </TabList>
          </div>
          <div className={clsx("col col--8", styles.rightColumn)}>
            {paths.map((path) => (
              <TabPanel key={path.label}>
                <div className={styles.panelContent}>
                  <h2>{path.title}</h2>
                  <p>{path.body}</p>
                  <div className={styles.buttonWrap}>
                    <Link className="button button--primary button--lg" to={path.ctaLink}>
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
