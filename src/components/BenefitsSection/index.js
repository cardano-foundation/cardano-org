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
// Shows a tab list on the left with some swapable content on the right.

// Benefit data
const benefitsData = {
  benefits: {
    benefits_items: [
      {
        benefits_item_label: "Proof-of-stake and Ouroboros",
        benefits_item_category: "Protocol",
        benefits_item_title: "Proof-Of-Stake And Ouroboros: The Most Environmentally Sustainable Blockchain Protocol",
        benefits_item_body: "Ouroboros is the first peer-reviewed, verifiably secure blockchain protocol, and Cardano is the first blockchain \
        to implement it. Ouroboros enables the Cardano network’s decentralization, and allows it to sustainably scale to global requirements \
        without, crucially, compromising security.<br /><br />The protocol is the culmination of tireless effort, building on foundational \
        research, and is propelled by a vision for more secure and transparent global payment systems, and a means to redistribute, more fairly, \
        power and control.",
        benefits_item_cta_link: "/ouroboros",
        benefits_item_cta_title: "Learn about Ouroboros"
      },
      {
        benefits_item_label: "Evidence-based development",
        benefits_item_category: "Research",
        benefits_item_title: "The Highest Standards In Development, Rooted In Science",
        benefits_item_body: "Cardano is developed using evidence-based methods: a novel combination of formal methods, which are normally \
        found in critical high-stake applications, and an agile approach, which helps the project remain adaptable and responsive to emerging \
        requirements and new innovations. To support global applications, systems, and solutions, we believe security assurance is not a \
        choice: it’s a requirement. Our protocol implementations and platform integrations are first researched, challenged, and mathematically \
        modeled and tested before they are specified. These specifications then inform development which, in turn, is independently audited. \
        The result is a codebase offering an unrivaled level of assurance.",
        benefits_item_cta_link: "/research",
        benefits_item_cta_title: "Discover the research"
      },
      {
        benefits_item_label: "Secure",
        benefits_item_category: "Transact",
        benefits_item_title: "Unparalleled Security - And The Makings Of A Trustless World",
        benefits_item_body: "Cardano makes it possible for any actors that do not know each other - and have no reason to trust one another \
        - to interact and transact, securely. It’s a platform for building trust where none might naturally exist, opening up whole new markets \
        and opportunities. Through Ouroboros, Cardano is provably secure against bad actors and Sybil attacks. Every transaction, interaction, \
        and exchange is immutably and transparently recovered, and securely validated using multi-signature and a pioneering extended UTXO model.",
        benefits_item_cta_link: "https://roadmap.cardano.org/",
        benefits_item_cta_title: "Visit the roadmap"
      },
      {
        benefits_item_label: "Incentivized participation",
        benefits_item_category: "Open",
        benefits_item_title: "Open And Incentivized Participation",
        benefits_item_body: "With a committed community at its core, Cardano is an open-source project developed through open \
        participation. To ensure the longevity and health of the network, Cardano features an incentive mechanism that rewards \
        users - either as stake pool operators or stake delegators - for their participation. The platform is built and expanded \
        through enhancement and improvement protocols. Cardano’s governance system gives everyone a democratic voice; ada holders \
        can submit or vote on proposals to upgrade the platform or help determine the direction of development. The governance model \
        uniquely positions Cardano for future growth and development, and allows it to introduce new capability tailored to its \
        user’s needs. It ensures Cardano and its community can continuously fund and decide upon platform and ecosystem improvements.",
        benefits_item_cta_link: "/governance",
        benefits_item_cta_title: "Learn about governance"
      },
      {
        benefits_item_label: "Scalable and sustainable",
        benefits_item_category: "Ecosystem",
        benefits_item_title: "Extremely Scalable And Environmentally Sustainable",
        benefits_item_body: "Ouroboros allows Cardano to scale to global requirements with minimal energy requirements. Unlike other \
        blockchains, Cardano does not require exponentially more energy to increase performance and add blocks. The performance-sustainability \
        balance is achieved through a combination of novel approaches, including multi-ledger, side chains, and parallel transaction \
        processing through multi-party state channels.<br /><br />The network proliferates as the number of stake pools increases, while \
        parameters are set and adjusted to measure the attractiveness of specific stake pools. This is a network that rewards participation \
        directly. Cardano is designed to ensure that those who act in the best interests of the network are also acting in their own best \
        interests. This ensures the development of a healthy ecosystem, and, in turn, the endurance, health, and robustness of the network, \
        now and into the future. The combination of sustainability and scalability allows Cardano to achieve the throughput required to meet \
        the evolving demands of global systems: financial, logistics, identity, societal.",
        benefits_item_cta_link: "https://iohk.io/en/research/library/papers/hydrafast-isomorphic-state-channels/",
        benefits_item_cta_title: "Learn about Hydra"
      },
    ]
  }
};

// Define your main component
export default function BenefitsSection () {
 
  const [selectedIndex, setSelectedIndex] = useState(0); // Initialize state to track selected tab index
  const [animationDirection, setAnimationDirection] = useState('in'); // 'in' or 'out'

  const handleSelect = (index) => {
    setSelectedIndex(index); // Update state when a new tab is selected
    const direction = index > selectedIndex ? 'in' : 'out';
    setAnimationDirection(direction);
    setSelectedIndex(index);
  };

  return (
    <div className={styles.benefitsBoxWrap}>
      <Tabs className={styles.tabs} onSelect={handleSelect} selectedIndex={selectedIndex}>
      <div className={clsx('row', styles.container)}> 
        <div className={clsx('col col--4', styles.leftColumn)}>
          <TabList className={styles.tabList}>
            {benefitsData.benefits.benefits_items.map((benefit, index) => (
              <Tab 
              className={clsx(styles.tab, { [styles.tabSelected]: index === selectedIndex })} 
              key={index}
            >
              <TabLabel isSelected={index === selectedIndex}>{benefit.benefits_item_label}</TabLabel>
              <p className={styles.tabCategory}>{benefit.benefits_item_category}</p>
            </Tab>
            ))}
          </TabList>
        </div>
        <div className={clsx('col col--8', styles.rightColumn)}>
          {benefitsData.benefits.benefits_items.map((benefit, index) => (
            <TabPanel key={index} className={`${styles.tabPanel} ${index === selectedIndex ? styles.swipeIn : styles.swipeOut}`}>
              <h2>{benefit.benefits_item_title}</h2>
              <p dangerouslySetInnerHTML={{ __html: benefit.benefits_item_body }} />
              <p className={styles.buttonWrap}>
                <Link className="button button--primary button--lg" to={benefit.benefits_item_cta_link}>
                {benefit.benefits_item_cta_title} 
                </Link>
              </p>
            </TabPanel>
          ))}
        </div>
        </div>
      </Tabs>
    </div>
  );
};


// Custom component to render the tab label with the arrow for the selected tab
const TabLabel = ({ isSelected, children }) => (
  <div className={styles.tabLabel}>
    {isSelected && <FaArrowRight className={styles.tabIcon} />}
    {children}
  </div>
);