import React, { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import ThemedImage from "@theme/ThemedImage";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { FaArrowRight } from "react-icons/fa"; //
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
//import "react-tabs/style/react-tabs.css"; // Use default styling as a base
import { useLocation } from "@docusaurus/router";

//
// This component:
// Shows a tab list on the left with some swapable content on the right.
// FIXME: <br /><br /> are a bit hacky.

// Partners data
const partnersData = {
  partners: {
    partners_items: [
      {
        partners_item_label: "The Cardano Foundation",
        partners_item_category: "Not-for-profit organization",
        partners_item_image: "cardanofoundation",
        partners_item_link: "https://cardanofoundation.org",
        partners_item_body:
          "The Cardano Foundation is an independent, Swiss-based not-for-profit organization. The Foundation is tasked with advancing the public digital infrastructure Cardano and works to anchor it as a utility for financial and social systems, thus empowering the digital architects of the future.<br /><br />The Foundation facilitates the worldwide advancement of Cardano in enterprise applications. It develops infrastructure tooling—including where there may not be an immediate commercial use case—plus strengthens operational resilience, and drives diversity of on-infrastructure use cases as well as the development of sound and representative governance.<br /><br />Another significant part of the Cardano Foundation’s mission is to engage with and support the Cardano community. The Foundation assists the development of tools the community can use to leverage Cardano to solve problems in new ways.",
      },
      {
        partners_item_label: "EMURGO",
        partners_item_category: "For-profit arm of Cardano",
        partners_item_image: "emurgo",
        partners_item_link: "https://emurgo.io",
        partners_item_body:
          "EMURGO is a blockchain technology company and a founding entity of the Cardano blockchain that provides products and services to drive the adoption of Cardano’s Web3 ecosystem. Established in 2015 in Japan, EMURGO's mission is to facilitate commercial adoption through dynamic partnerships with existing ecosystem members and the seamless integration of new entrants.<br /><br />By prioritizing investments, delivering continuous education, and providing infrastructure services, EMURGO aims to unlock the full potential of the Cardano ecosystem.",
      },
      {
        partners_item_label: "Input Output",
        partners_item_category: "Research and engineering company",
        partners_item_image: "iog",
        partners_item_link: "https://iohk.io",
        partners_item_body:
          "Input Output is a research and engineering company and venture studio that builds blockchain and Web3 products to empower everyone, everywhere.<br /><br />Founded by Charles Hoskinson and Jeremy Wood, Input Output was one of the three pioneer entities behind Cardano,  originally contracted to design, build, and help maintain the Cardano platform. A fully decentralized company, Input Output is comprised of dynamic, innovative teams– based all over the world, collectively committed to innovation through delivering the highest standards in software engineering based on rigorous peer-to-peer reviewed science.<br /><br />Input Output is a leader in building distributed computing systems and decentralized technology solutions. The company continues to research and build new paradigms and products in the field of distributed ledger technology and the architecture of Web3. Input Output is committed to open-source principles, and ethical, purpose-driven business, creating technology to benefit the many, not the few. Just like the Cardano Foundation and EMURGO, driving blockchain education is core to Input Output’s philosophy. IO Research is focused on promoting the academic study of blockchain, supported by a team of educators, academic partners, and specially developed courses.",
          
      },
      {
        partners_item_label: "Intersect",
        partners_item_category: "Member based organization",
        partners_item_image: "intersect",
        partners_item_link: "https://intersectmbo.org",
        partners_item_body:
          "Intersect is a not-for-profit member-based organization for the Cardano ecosystem. Intersect acts as a champion for distributed development and is committed to empowering the Cardano community to build together and drive the blockchain forward. Our mission is to ensure, through our members, the lasting continuity and progressive development of Cardano - fostering a self-sustaining ecosystem that’s fit-for-purpose, perpetually future-proof, resilient, secure, and transparent.<br /><br />Enablement is a key foundation of this work, providing the necessary inclusive contributory opportunities to allow every member of Intersect to have their voice heard. By providing additional governance processes and structure, from maintenance to development and testing to fundraising, Intersect enables the community to continue to advance the protocol",
          
      },
    ],
  },
};

// shows a linked partner (svg) logo
function LogoWithLink({ imageName, label, link }) {
  return (
    <div className={styles.logoContainer}>
      <div className={styles.imageWrap}>
        <Link to={link} className={styles.link}>
          <ThemedImage
            alt={label}
            sources={{
              light: useBaseUrl(`/img/logos/${imageName}.svg`),
              dark: useBaseUrl(`/img/logos/${imageName}-dark.svg`),
            }}
          />
        </Link>
      </div>
    </div>
  );
}

// Define your main component
export default function PartnersOverviewSection() {
  const [selectedIndex, setSelectedIndex] = useState(0); // Initialize state to track selected tab index
  const [animationDirection, setAnimationDirection] = useState("in"); // 'in' or 'out'

  const location = useLocation(); // Use useLocation to access the location object

  useEffect(() => {
    // Function to parse the query string
    const queryParams = new URLSearchParams(location.search);
    const partner = queryParams.get("tab");

    // Find the index of the partner in the data array (based on image name)
    const partnerIndex = partnersData.partners.partners_items.findIndex(
      (item) =>
        item.partners_item_image.replace(/\s+/g, "-").toLowerCase() === partner
    );

    // If the partner exists, update the selectedIndex state
    if (partnerIndex !== -1) {
      setSelectedIndex(partnerIndex);
    }
  }, [location]);

  const handleSelect = (index) => {
    setSelectedIndex(index); // Update state when a new tab is selected
    const direction = index > selectedIndex ? "in" : "out";
    setAnimationDirection(direction);
    setSelectedIndex(index);
  };

  return (
    <div className={styles.partnersBoxWrap}>
      <Tabs
        className={styles.tabs}
        onSelect={handleSelect}
        selectedIndex={selectedIndex}
      >
        <div className={clsx("row")}>
          <div className={clsx("col col--4", styles.leftColumn)}>
            <TabList className={styles.tabList}>
              {partnersData.partners.partners_items.map((benefit, index) => (
                <Tab
                  className={clsx(styles.tab, {
                    [styles.tabSelected]: index === selectedIndex,
                  })}
                  key={index}
                >
                  <TabLabel isSelected={index === selectedIndex}>
                    {benefit.partners_item_label}
                  </TabLabel>
                  <p className={"tabCategory"}>
                    {benefit.partners_item_category}
                  </p>
                </Tab>
              ))}
            </TabList>
          </div>
          <div className={clsx("col col--8", styles.rightColumn)}>
            {partnersData.partners.partners_items.map((benefit, index) => (
              <TabPanel
                key={index}
                className={`${styles.tabPanel} ${
                  index === selectedIndex ? "swipeIn" : "swipeOut"
                }`}
              >
                <LogoWithLink
                  imageName={benefit.partners_item_image}
                  label={benefit.partners_item_label}
                  link={benefit.partners_item_link}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: benefit.partners_item_body,
                  }}
                />
              </TabPanel>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

// Custom component to render the tab label with the arrow for the selected tab
const TabLabel = ({ isSelected, children }) => (
  <div className={styles.tabLabel}>
    {isSelected && <FaArrowRight className="tabIcon" />}
    {children}
  </div>
);
