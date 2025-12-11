import React from "react";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import StepCard from "@site/src/components/Layout/StepCard";
import TwoColumnLayout from "@site/src/components/TwoColumnLayout";
import AppList from "@site/src/components/AppList";
import styles from "./get-started.module.css";

function HomepageHeader() {
  return (
    <SiteHero
      title="Get started with Cardano"
      description="Step into the new world yourself and learn all the basics in just few steps."
      bannerType="fluidBlue"
    />
  );
}

const steps = [
  {
    title: "Download a wallet",
    description: "A wallet is an app that allows you to receive, send cryptocurrencies and manage your Cardano account.",
    hideHeader: true,
    hideActions: true,
    content: (actions) => (
      <TwoColumnLayout
        sidebar={<AppList tags={["wallet"]} limit={5} showTxCount={false} hideHeader={true} categoryTitle="Wallets" showTags={true} />}
        sidebarSticky={false}
        ratio="1:1"
      >
        <div className={styles.stepContent}>
          <h2>Download a wallet</h2>
          <p className={styles.stepDescription}>
            A Cardano wallet is your personal interface to the blockchain, much like a web browser is your interface to the internet. 
          </p>
          <p className={styles.stepDescription}>
            It lets you securely manage your ada, use dApps, and interact with the network. 
          </p>
          {actions}
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: "I have a wallet.",
  },
  {
    title: "Connect your wallet",
    description: "You can use your wallet to interact with Cardano.",
    content: (
      <div className={styles.stepContent}>
        <p>Placeholder:</p>
        <ul>
          <li>Show wallet connector</li>
          <li>Show wallet connector</li>
          <li>Show wallet connector</li>
        </ul>
        <p>Show wallet connector.</p>
      </div>
    ),
    checkboxLabel: "I have ada in my wallet.",
  },
  {
    title: "Explore the ecosystem",
    description: "Now that you have a wallet and ada, you're ready to explore everything Cardano has to offer.",
    content: (
      <div className={styles.stepContent}>
        <h3>What's next?</h3>
        <ul>
          <li><strong>Delegate your ada:</strong> Help secure the network and earn rewards by delegating to a stake pool.</li>
          <li><strong>Use dApps:</strong> Explore decentralized applications for DeFi, NFTs, gaming, and more.</li>
          <li><strong>Join the community:</strong> Connect with other Cardano enthusiasts in forums and social channels.</li>
          <li><strong>Learn more:</strong> Dive deeper into Cardano's technology and governance.</li>
        </ul>
      </div>
    ),
    finalStep: true,
  },
];

export default function Home() {

  return (
    <Layout
      title="Get started with Cardano | cardano.org"
      description="Step into the new world yourself and learn all the basics in just few steps."
    >
      <OpenGraphInfo pageName="get-started" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <SpacerBox size="small" />
            <StepCard steps={steps} />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
