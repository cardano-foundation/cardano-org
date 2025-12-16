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
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

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
        sidebar={<AppList tags={["wallet"]} limit={5} showTxCount={false} hideHeader={true} categoryTitle="Wallets" showTags={true} showDescription={false} />}
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
          <p className={styles.securityNote}>
              Your recovery phrase is required to regain access to your wallet. Cardano wallets are non-custodial, which means there is no central service, help desk, or recovery mechanism.
            </p>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: "I downloaded a wallet.",
  },
  {
    title: "Backup your recovery phrase",
    description: "When you create a new wallet, you'll receive a set of 12, 15, or 24 words. This is your recovery phrase, also called a seed phrase. It is the master key to your wallet. Keep it safe!",
    content: (
       <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/hero-header-braid-black.svg" alt="Backup your recovery phrase" className={styles.recoveryPhraseImage} />
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
      >
        
        <div className={styles.stepContent}>
          <h3>Save your recovery phrase</h3>
          
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
    hideActions: true,
    content: (actions) => (
       
        <div className={styles.stepContent}>
          <h3>Final setup steps</h3>
          <p>After backing up your recovery phrase, complete these two important steps:</p>
          
          <p><strong>Spending password:</strong> Create a strong password to protect everyday transactions. This password is different from your recovery phrase and secures your wallet on this device.</p>
          
          <p><strong>Verify your backup:</strong> Most wallets will ask you to confirm your recovery phrase by selecting words in order. This ensures you've correctly saved it.</p>
          
          <p>Once these steps are complete, your wallet is ready to use!</p>
           {actions}
           <p className={styles.securityNote}>
            If you forget your spending password, you can restore your wallet using your recovery phrase. <strong>However, anyone who obtains your recovery phrase can fully access and empty your wallet without needing the spending password.</strong>
           </p>
        </div>
       
    ),
    checkboxLabel: "I've completed the wallet setup.",
  },
   {
    title: "Connect your wallet",
    description: "Use your wallet as a single account for apps and projects on Cardano. A wallet connector, like the one shown below, lets websites securely connect to your wallet so you can interact without creating separate accounts or passwords.",
    hideActions: true,
    content: (actions) => (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/hero-header-braid-blue.svg" alt="Connect wallet illustration" className={styles.recoveryPhraseImage} />
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
      >
        <div className={styles.stepContent}>
          
          <WalletConnect onConnect={onWalletConnect} />
          {actions}
          <p className={styles.securityNote}>
            When you approve a connection or transaction, you are granting that site specific permissions. Always check the website address and review what you are asked to approve before continuing.
          </p>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: "I've connected my wallet.",
  },
  {
    title: "Get ada",
    description: "Obtain ada, Cardano's native cryptocurrency, to start using the blockchain.",
    content: (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <div className={styles.adaRoundWrap}>
              <ThemedImage
                alt="Ada Lovelace looking to the right"
                sources={{
                    light: useBaseUrl('/img/ada-round.webp'),
                    dark: useBaseUrl('/img/ada-round-dark.webp'),
                  }}
                />
               
            </div>
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
        centerVertically={true}
      >
        <div className={styles.stepContent}>
          <h3>Where to get ada</h3>
          <p>There are several ways to obtain ada, but the most common method is buying it on cryptocurrency exchanges using fiat currency or other cryptocurrencies.</p>
          
          <p><Link to="/where-to-get-ada" className="button button--primary">View all options →</Link></p>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: "I have ada in my wallet.",
  },
  {
    title: "Explore the ecosystem",
    description: "Now that you have a wallet and ada, you are ready to explore everything Cardano has to offer. A good place to start is by exploring popular apps.",
    content: (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            
 <ThemedImage
alt="title image"
sources={{
    light: useBaseUrl('/img/cardano-black.svg'),
    dark: useBaseUrl('/img/cardano-white.svg'),
  }}
/>
          </div>
            
        }
        sidebarSticky={false}
        ratio="3:2"
        centerVertically={false}
      >
        <AppList 
              tags={[]} 
              limit={5} 
              categoryTitle="Popular Apps" 
              showTxCount={true}
              showDescription={true}
            />
           
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
