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
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'getStarted.hero.title', message: 'Get started with Cardano'})}
      description={translate({id: 'getStarted.hero.description', message: 'Step into the new world yourself and learn all the basics in just few steps.'})}
      bannerType="fluidBlue"
    />
  );
}

const steps = (onWalletConnect) => [
  {
    title: translate({id: 'getStarted.step1.title', message: 'Download a wallet'}),
    description: translate({id: 'getStarted.step1.description', message: 'A wallet is an app that allows you to receive, send cryptocurrencies and manage your Cardano account.'}),
    hideHeader: true,
    hideActions: true,
    content: (actions) => (
      <TwoColumnLayout
        sidebar={<AppList tags={["wallet"]} limit={5} showTxCount={false} hideHeader={true} categoryTitle="Wallets" showTags={true} showDescription={false} />}
        sidebarSticky={false}
        ratio="1:1"
      >
        <div className={styles.stepContent}>
          <h2>{translate({id: 'getStarted.step1.heading', message: 'Download a wallet'})}</h2>
          <p className={styles.stepDescription}>
            {translate({id: 'getStarted.step1.text1', message: 'A Cardano wallet is your personal interface to the blockchain, much like a web browser is your interface to the internet. It lets you securely manage your ada, use dApps, and interact with the network.'})}
          </p>
          <p className={styles.stepDescription}>
            {translate({id: 'getStarted.step1.text2', message: 'You will create your wallet in the next steps. Downloading alone does not create one.'})}
          </p>

          {actions}
          <p className={styles.securityNote}>
            {translate({id: 'getStarted.step1.securityNote', message: 'Your recovery phrase is required to regain access to your wallet. Cardano wallets are non-custodial, which means there is no central service, help desk, or recovery mechanism.'})} <Link to="/common-scams">{translate({id: 'getStarted.common.scamLink', message: 'Be aware of the most common scams.'})}</Link>
          </p>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: translate({id: 'getStarted.step1.checkbox', message: 'I downloaded a wallet.'}),
  },
  {
    title: translate({id: 'getStarted.step2.title', message: 'Backup your recovery phrase'}),
    description: translate({id: 'getStarted.step2.description', message: 'When you create a new wallet, you\'ll receive a set of 12, 15, or 24 words. This is your recovery phrase, also called a seed phrase. It is the master key to your wallet. Keep it safe!'}),
    content: (
       <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/hero-header-braid-black.svg" alt="Cardano decorative braid pattern" className={styles.sidebarImage} />
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
      >

        <div className={styles.stepContent}>
          <h3>{translate({id: 'getStarted.step2.heading', message: 'Save your recovery phrase'})}</h3>

          <p><strong>{translate({id: 'getStarted.step2.whatToDo', message: 'What to do:'})}</strong></p>
          <ul>
            <li>{translate({id: 'getStarted.step2.tip1', message: 'Write it down on paper and store it securely offline'})}</li>
            <li>{translate({id: 'getStarted.step2.tip2', message: 'Never share it with anyone or store it digitally'})}</li>
            <li>{translate({id: 'getStarted.step2.tip3', message: 'Anyone with your recovery phrase can access your funds'})}</li>
            <li>{translate({id: 'getStarted.step2.tip4', message: 'Keep multiple copies in different secure locations'})}</li>
          </ul>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: translate({id: 'getStarted.step2.checkbox', message: 'I\'ve backed up my recovery phrase.'}),
  },
  {
    title: translate({id: 'getStarted.step3.title', message: 'Complete wallet setup'}),
    description: translate({id: 'getStarted.step3.description', message: 'Finish setting up your wallet with a password and verification.'}),
    hideActions: true,
    content: (actions) => (

        <div className={styles.stepContent}>
          <h3>{translate({id: 'getStarted.step3.heading', message: 'Final setup steps'})}</h3>
          <p>{translate({id: 'getStarted.step3.intro', message: 'After backing up your recovery phrase, complete these two important steps:'})}</p>

          <p><strong>{translate({id: 'getStarted.step3.passwordLabel', message: 'Spending password:'})}</strong> {translate({id: 'getStarted.step3.passwordText', message: 'Create a strong password to protect everyday transactions. This password is different from your recovery phrase and secures your wallet on this device.'})}</p>

          <p><strong>{translate({id: 'getStarted.step3.verifyLabel', message: 'Verify your backup:'})}</strong> {translate({id: 'getStarted.step3.verifyText', message: 'Most wallets will ask you to confirm your recovery phrase by selecting words in order. This ensures you\'ve correctly saved it.'})}</p>

          <p>{translate({id: 'getStarted.step3.ready', message: 'Once these steps are complete, your wallet is ready to use!'})}</p>
           {actions}
           <p className={styles.securityNote}>
            {translate({id: 'getStarted.step3.securityNote', message: 'If you forget your spending password, you can restore your wallet using your recovery phrase.'})} <strong>{translate({id: 'getStarted.step3.securityWarning', message: 'However, anyone who obtains your recovery phrase can fully access and empty your wallet without needing the spending password.'})}</strong> <Link to="/common-scams">{translate({id: 'getStarted.common.scamLink', message: 'Be aware of the most common scams.'})}</Link>
           </p>
        </div>

    ),
    checkboxLabel: translate({id: 'getStarted.step3.checkbox', message: 'I\'ve completed the wallet setup.'}),
  },
   {
    title: translate({id: 'getStarted.step4.title', message: 'Connect your wallet'}),
    description: translate({id: 'getStarted.step4.description', message: 'Use your wallet as a single account for apps and projects on Cardano. A wallet connector, like the one shown below, lets websites securely connect to your wallet so you can interact without creating separate accounts or passwords.'}),
    hideActions: true,
    content: (actions) => (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/hero-header-braid-blue.svg" alt="Cardano decorative braid pattern" className={styles.sidebarImage} />
          </div>
        }
        sidebarSticky={false}
        ratio="1:1"
      >
        <div className={styles.stepContent}>

          <WalletConnect onConnect={onWalletConnect} />
          {actions}
          <p className={styles.securityNote}>
            {translate({id: 'getStarted.step4.securityNote', message: 'When you approve a connection or transaction, you are granting that site specific permissions. Always check the website address and review what you are asked to approve before continuing.'})} <Link to="/common-scams">{translate({id: 'getStarted.common.scamLink', message: 'Be aware of the most common scams.'})}</Link>
          </p>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: translate({id: 'getStarted.step4.checkbox', message: 'I\'ve connected my wallet.'}),
  },
  {
    title: translate({id: 'getStarted.step5.title', message: 'Get ada'}),
    description: translate({id: 'getStarted.step5.description', message: 'Obtain ada, Cardano\'s native cryptocurrency, to start using the blockchain.'}),
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
          <h3>{translate({id: 'getStarted.step5.heading', message: 'Where to get ada'})}</h3>
          <p>{translate({id: 'getStarted.step5.text', message: 'There are several ways to obtain ada, but the most common method is buying it on cryptocurrency exchanges using fiat currency or other cryptocurrencies.'})}</p>

          <p><Link to="/where-to-get-ada" className="button button--primary">{translate({id: 'getStarted.step5.button', message: 'View all options →'})}</Link></p>

          <p className={styles.securityNote}>
            {translate({id: 'getStarted.step5.securityNote', message: 'The cryptocurrency space is full of opportunities, but it\'s also a playground for scammers.'})} <Link to="/common-scams">{translate({id: 'getStarted.common.scamLink', message: 'Be aware of the most common scams.'})}</Link>
          </p>
        </div>
      </TwoColumnLayout>
    ),
    checkboxLabel: translate({id: 'getStarted.step5.checkbox', message: 'I have ada in my wallet.'}),
  },
  {
    title: translate({id: 'getStarted.step6.title', message: 'Explore the ecosystem'}),
    description: translate({id: 'getStarted.step6.description', message: 'Now that you have a wallet and ada, you are ready to explore everything Cardano has to offer. A good place to start is by exploring popular apps.'}),
    content: (
      <TwoColumnLayout
        sidebar={
          <div className={styles.centeredSidebar}>
            <img src="/img/hero-header-braid-red-blue.svg" alt="Cardano decorative braid pattern" className={styles.sidebarImage} />
          </div>

        }
        sidebarSticky={false}
        ratio="3:2"
        centerVertically={false}
      >
        <AppList
              tags={["goodForBeginners"]}
              limit={5}
              showTags={true}
              categoryTitle="Popular Apps"
              showTxCount={false}
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
      title={translate({id: 'getStarted.meta.title', message: 'Get started with Cardano | cardano.org'})}
      description={translate({id: 'getStarted.meta.description', message: 'Step into the new world yourself and learn all the basics in just few steps.'})}
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
