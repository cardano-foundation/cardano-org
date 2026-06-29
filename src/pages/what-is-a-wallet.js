import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

const META_TITLE = translate({
  id: "whatIsAWallet.meta.title",
  message: "What is a Cardano Wallet? Types, Keys, and Security Explained",
});
const META_DESCRIPTION = translate({
  id: "whatIsAWallet.meta.description",
  message:
    "Learn what a Cardano wallet is, how hot, cold, custodial, and non-custodial wallets differ, how keys and recovery phrases work, and how to keep your ada safe.",
});

export default function WhatIsAWallet() {
  return (
    <Layout title={META_TITLE} description={META_DESCRIPTION}>
      <OpenGraphInfo pageName="what-is-a-wallet" />
      <SiteHero
        title={translate({ id: "whatIsAWallet.hero.title", message: "What is a Wallet?" })}
        description={translate({
          id: "whatIsAWallet.hero.description",
          message:
            "A wallet is your key to Cardano. Understand how wallets work, the different types, and how to keep your ada safe.",
        })}
        bannerType="wallets"
      />
      <main>
        <BackgroundWrapper backgroundType="adaLight">
          <BoundaryBox>
            <SpacerBox size="medium" />
            <TitleWithText
              title={translate({ id: "whatIsAWallet.intro.title", message: "Your keys, not your coins" })}
              description={[
                translate({
                  id: "whatIsAWallet.intro.text1",
                  message:
                    "A wallet does not actually store your ada. Your coins live on the Cardano blockchain. What a wallet stores are the **keys** that prove the coins are yours and let you spend them.",
                }),
                translate({
                  id: "whatIsAWallet.intro.text2",
                  message:
                    "Each wallet has a **public key**, used to receive funds, much like an account number you can share, and a **private key**, used to sign transactions and spend funds. Anyone who holds the private key controls the funds, so keeping it secret is everything.",
                }),
              ]}
              titleType="black"
              headingDot={true}
            />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <SpacerBox size="large" />
          <Divider text={translate({ id: "whatIsAWallet.types.divider", message: "Wallet types" })} />
          <SpacerBox size="medium" />

          <TitleWithText
            title={translate({ id: "whatIsAWallet.hotcold.title", message: "Hot wallets vs cold wallets" })}
            description={[
              translate({
                id: "whatIsAWallet.hotcold.description",
                message: "Wallets differ by whether they are connected to the internet.",
              }),
            ]}
            titleType="black"
            headingDot={true}
          />
          <DottedImageWithText
            imageName="wallet-hot"
            text={translate({
              id: "whatIsAWallet.hotWallet.text",
              message:
                "A hot wallet is connected to the internet and can be accessed at any time with the requisite keys. Examples include mobile and software wallets, and funds stored on exchanges. They are convenient for everyday use.",
            })}
          />
          <DottedImageWithText
            imageName="wallet-cold"
            text={translate({
              id: "whatIsAWallet.coldWallet.text",
              message:
                "A cold wallet is offline. It is not connected to the internet and is used for securely storing funds that do not need to be accessed frequently. Examples include hardware wallets, secure devices that store the private keys, and paper wallets. Cardano is supported by both Trezor and Ledger hardware wallets.",
            })}
          />

          <SpacerBox size="large" />
          <TitleWithText
            title={translate({ id: "whatIsAWallet.custody.title", message: "Custodial vs non-custodial" })}
            description={[
              translate({
                id: "whatIsAWallet.custody.text1",
                message:
                  "With a **custodial** wallet, a third party such as an exchange holds your private keys for you. It is convenient, but you are trusting that party with your funds.",
              }),
              translate({
                id: "whatIsAWallet.custody.text2",
                message:
                  "With a **non-custodial** wallet, you alone hold the keys. No company can freeze your funds or lose them for you, but no one can recover them for you either. As the saying goes: not your keys, not your coins.",
              }),
            ]}
            titleType="black"
            headingDot={true}
          />

          <SpacerBox size="large" />
          <TitleWithText
            title={translate({ id: "whatIsAWallet.nodetype.title", message: "Light wallets vs full-node wallets" })}
            description={[
              translate({
                id: "whatIsAWallet.nodetype.text1",
                message:
                  "A **light** wallet connects to the blockchain through a remote service, so it is quick to install and runs on phones and browsers.",
              }),
              translate({
                id: "whatIsAWallet.nodetype.text2",
                message:
                  "A **full-node** wallet downloads and verifies a copy of the blockchain itself. It needs more disk space and time, but it relies on no third party to read the chain.",
              }),
            ]}
            titleType="black"
            headingDot={true}
          />
          <SpacerBox size="large" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
