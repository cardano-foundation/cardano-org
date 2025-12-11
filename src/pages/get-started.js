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
import WalletConnect from "@site/src/components/WalletConnect";
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

const steps = (onWalletConnect) => [
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
    checkboxLabel: "I downloaded a wallet.",
  },
  {
    title: "Set up your wallet",
    description: "Complete the initial setup of your wallet by creating or restoring an account.",
    content: (
      <div className={styles.stepContent}>
        <h3>Secure your wallet</h3>
        <p>When you first open your wallet, you'll need to either create a new wallet or restore an existing one:</p>
        <ul>
          <li>
            <strong>Recovery phrase (seed phrase):</strong> You'll receive a set of 12, 15, or 24 words. This is the master key to your wallet.
            <ul>
              <li>Write it down on paper and store it securely offline</li>
              <li>Never share it with anyone or store it digitally</li>
              <li>Anyone with your recovery phrase can access your funds</li>
            </ul>
          </li>
          <li>
            <strong>Spending password:</strong> Create a strong password to protect everyday transactions. This is different from your recovery phrase.
          </li>
          <li>
            <strong>Verify your backup:</strong> Most wallets will ask you to confirm your recovery phrase by selecting words in order.
          </li>
        </ul>
        <p className={styles.warningNote}>
          ⚠️ <strong>Important:</strong> Your recovery phrase is required to regain access to your wallet. Cardano wallets are non-custodial, which means there is no central service, help desk, or recovery mechanism. Loss or disclosure of this phrase results in irreversible loss of access to your funds.
        </p>
      </div>
    ),
    checkboxLabel: "I've set up and secured my wallet.",
  },
  {
    title: "Connect your wallet",
    description: "Connect your Cardano wallet to interact with the blockchain.",
    content: (
      <div className={styles.stepContent}>
        <WalletConnect onConnect={onWalletConnect} />
      </div>
    ),
    checkboxLabel: "I've connected my wallet.",
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
  const [walletConnected, setWalletConnected] = React.useState(false);

  const handleWalletConnect = () => {
    setWalletConnected(true);
  };

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
            <StepCard steps={steps(handleWalletConnect)} walletConnected={walletConnected} />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
