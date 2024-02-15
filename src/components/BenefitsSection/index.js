import React from "react";
import clsx from "clsx";
import styles from './styles.module.css';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { FaArrowRight } from 'react-icons/fa'; //  
import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Use default styling as a base

//
// This component:
// fixme

// Example benefits data structured as needed by the component
const benefitsData = {
  benefits: {
    benefits_items: [
      {
        benefits_item_label: "Proof-of-stake and Ouroboros",
        benefits_item_category: "Protocol",
        benefits_item_title: "Proof-Of-Stake And Ouroboros: The Most Environmentally Sustainable Blockchain Protocol",
        benefits_item_body: "Cardano is develOuroboros is the first peer-reviewed, verifiably secure blockchain protocol, and Cardano ....",
        benefits_item_cta_link: "/research",
        benefits_item_cta_title: "Learn about"
      },
      {
        benefits_item_label: "Evidence-based development",
        benefits_item_category: "Research",
        benefits_item_title: "The Highest Standards In Development, Rooted In Science",
        benefits_item_body: "Cardano is developed using evidence-based methods: a novel combination of formal methods...",
        benefits_item_cta_link: "/research",
        benefits_item_cta_title: "Discover the research"
      },
      {
        benefits_item_label: "Secure",
        benefits_item_category: "Transact",
        benefits_item_title: "Unparalleled Security - And The Makings Of A Trustless World",
        benefits_item_body: "Cardano makes it possible for any actors that do not know each other - and have no reason to trust one another - to interact and transact, securely....",
        benefits_item_cta_link: "/research",
        benefits_item_cta_title: "Visit the roadmap"
      },
    ]
  }
};

// Define your main component
const BenefitsSection = ({  }) => {
 
  const [selectedIndex, setSelectedIndex] = useState(0); // Initialize state to track selected tab index

  const handleSelect = (index) => {
    setSelectedIndex(index); // Update state when a new tab is selected
  };

  return (
    
      <Tabs className={styles.tabs} onSelect={handleSelect} selectedIndex={selectedIndex}>
      <div className={clsx('row', styles.container)}> 
        <div className={clsx('col col--4', styles.leftColumn)}>
          <TabList className={styles.tabList}>
            {benefitsData.benefits.benefits_items.map((benefit, index) => (
              <Tab className={styles.tab} key={index}>
                <TabLabel isSelected={index === selectedIndex}>{benefit.benefits_item_label}</TabLabel>
                <p className={styles.tabCategory}>{benefit.benefits_item_category}</p>
              </Tab>
            ))}
          </TabList>
        </div>
        <div className={clsx('col col--8', styles.rightColumn)}>
          {benefitsData.benefits.benefits_items.map((benefit, index) => (
            <TabPanel key={index} className={styles.tabPanel}>
              <h2>{benefit.benefits_item_title}</h2>
              <p dangerouslySetInnerHTML={{ __html: benefit.benefits_item_body }} />
              <p>
                <Link className="button button--primary button--lg" to={benefit.benefits_item_cta_link}>
                {benefit.benefits_item_cta_title} 
                </Link>
              </p>
            </TabPanel>
          ))}
        </div>
        </div>
      </Tabs>
    
  );
};


// Custom component to render the tab label with the arrow for the selected tab
const TabLabel = ({ isSelected, children }) => (
  <div className={styles.tabLabel}>
    {isSelected && <FaArrowRight className={styles.tabIcon} />}
    {children}
  </div>
);

export default BenefitsSection;