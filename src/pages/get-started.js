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
import Link from "@docusaurus/Link";

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
          <p>
              Your recovery phrase is required to regain access to your wallet. Cardano wallets are non-custodial, which means there is no central service, help desk, or recovery mechanism.
            </p>
            <p>
              <strong>Loss or disclosure of this phrase results in irreversible loss of access to your funds.</strong>
            </p>
          {actions}
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: "I downloaded a wallet.",
  },
  {
    title: "Backup your recovery phrase",
    description: "Your recovery phrase is the master key to your wallet. Keep it safe!",
    content: (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/illustrations/recovery-phrase.png" alt="Example of a recovery phrase with 24 words" className={styles.recoveryPhraseImage} />
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
        centerVertically={true}
      >
        <div className={styles.stepContent}>
          <h3>Save your recovery phrase</h3>
          <p>When you create a new wallet, you'll receive a set of 12, 15, or 24 words. This is your recovery phrase (also called a seed phrase).</p>
          
          <p><strong>What to do:</strong></p>
          <ul>
            <li>Write it down on paper and store it securely offline</li>
            <li>Never share it with anyone or store it digitally</li>
            <li>Anyone with your recovery phrase can access your funds</li>
            <li>Keep multiple copies in different secure locations</li>
          </ul>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: "I've backed up my recovery phrase.",
  },
  {
    title: "Complete wallet setup",
    description: "Finish setting up your wallet with a password and verification.",
    content: (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/illustrations/complete-wallet-setup.png" alt="Complete your wallet setup illustration" className={styles.recoveryPhraseImage} />
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
        centerVertically={true}
      >
        <div className={styles.stepContent}>
          <h3>Final setup steps</h3>
          <p>After backing up your recovery phrase, complete these two important steps:</p>
          
          <p><strong>Spending password:</strong> Create a strong password to protect everyday transactions. This is different from your recovery phrase and secures your wallet on this device.</p>
          
          <p><strong>Verify your backup:</strong> Most wallets will ask you to confirm your recovery phrase by selecting words in order. This ensures you've correctly saved it.</p>
          
          <p>Once these steps are complete, your wallet is ready to use!</p>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: "I've completed the wallet setup.",
  },
  {
    title: "Get ada",
    description: "Obtain ada, Cardano's native cryptocurrency, to start using the blockchain.",
    content: (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/illustrations/get-ada.png" alt="Get ada illustration" className={styles.recoveryPhraseImage} />
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
        centerVertically={true}
      >
        <div className={styles.stepContent}>
          <h3>How to get ada</h3>
          <p>To use the Cardano blockchain, you'll need ada. There are several ways to obtain it:</p>
          
          <p><strong>Cryptocurrency exchanges:</strong> Buy ada from popular exchanges using fiat currency or other cryptocurrencies.</p>
          
          <p><strong>Peer-to-peer platforms:</strong> Trade directly with other users through P2P marketplaces.</p>
          
          <p><strong>Receive from others:</strong> Someone can send ada directly to your wallet address.</p>
          
          <p><Link to="/where-to-get-ada" className="button button--primary">View all options →</Link></p>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: "I have ada in my wallet.",
  },
  {
    title: "Connect your wallet",
    description: "Use your wallet as a single account for all apps and projects on Cardano. No separate accounts needed.",
    content: (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/illustrations/connect-wallet.png" alt="Connect wallet illustration" className={styles.recoveryPhraseImage} />
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
        centerVertically={true}
      >
        <div className={styles.stepContent}>
          <WalletConnect onConnect={onWalletConnect} />
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: "I've connected my wallet.",
  },
  {
    title: "Explore the ecosystem",
    description: "Now that you have a wallet and ada, you're ready to explore everything Cardano has to offer.",
    content: (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/illustrations/explore-ecosystem.png" alt="Explore Cardano ecosystem" className={styles.recoveryPhraseImage} />
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
        centerVertically={true}
      >
        <div className={styles.stepContent}>
          <h3>What's next?</h3>
          <ul>
            <li><strong><Link to="/stake-pool-delegation">Delegate your ada:</Link></strong> Help secure the network and earn rewards by delegating to a stake pool.</li>
            <li><strong><Link to="/apps">Explore apps:</Link></strong> Explore decentralized applications for DeFi, NFTs, gaming, and more.</li>
            <li><strong><Link to="/common-scams">Common scams:</Link></strong> Learn how to recognize and avoid common scams in the Cardano ecosystem.</li>
          </ul>
        </div>
      </TwoColumnLayout>
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
