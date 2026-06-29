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
import FAQSection from "@site/src/components/FAQSection";

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

        <BackgroundWrapper backgroundType="adaLight">
          <BoundaryBox>
            <SpacerBox size="large" />
            <Divider text={translate({ id: "whatIsAWallet.keys.divider", message: "Keys and recovery" })} />
            <SpacerBox size="medium" />
            <TitleWithText
              title={translate({ id: "whatIsAWallet.recovery.title", message: "Your recovery phrase is the master key" })}
              description={[
                translate({
                  id: "whatIsAWallet.recovery.text1",
                  message:
                    "When you create a non-custodial wallet you receive a list of 12, 15, or 24 words. This is your **recovery phrase**, also called a seed phrase. It is a human-readable form of your private key.",
                }),
                translate({
                  id: "whatIsAWallet.recovery.text2",
                  message:
                    "Anyone with these words can restore your wallet on any device and take your funds. Write the phrase down and store it offline. Never type it into a website, never store it in a photo or cloud note, and never share it with anyone.",
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
          <Divider text={translate({ id: "whatIsAWallet.security.divider", message: "Staying secure" })} />
          <SpacerBox size="medium" />
          <TitleWithText
            title={translate({ id: "whatIsAWallet.security.title", message: "Security basics" })}
            description={{
              list: [
                translate({
                  id: "whatIsAWallet.security.item1",
                  message: "Keep your recovery phrase offline, on paper or metal, in more than one safe place.",
                }),
                translate({
                  id: "whatIsAWallet.security.item2",
                  message:
                    "For larger amounts, use a hardware wallet such as Ledger or Trezor so your keys never touch an internet-connected device.",
                }),
                translate({
                  id: "whatIsAWallet.security.item3",
                  message:
                    "No legitimate person or support team will ever ask for your recovery phrase. [Be aware of the most common scams.](/common-scams)",
                }),
              ],
            }}
            titleType="black"
            headingDot={true}
          />
          <SpacerBox size="large" />

          <Divider text={translate({ id: "whatIsAWallet.dapps.divider", message: "Wallets and apps" })} />
          <SpacerBox size="medium" />
          <TitleWithText
            title={translate({ id: "whatIsAWallet.dapps.title", message: "Connecting to apps" })}
            description={[
              translate({
                id: "whatIsAWallet.dapps.text1",
                message:
                  "Most Cardano wallets include a **dApp connector**. It lets a website ask your wallet to sign a transaction without ever seeing your private keys.",
              }),
              translate({
                id: "whatIsAWallet.dapps.text2",
                message:
                  "You stay in control: the wallet shows you exactly what you are approving, and nothing happens until you confirm. Always check the site address and review each request before you sign.",
              }),
            ]}
            titleType="black"
            headingDot={true}
          />
          <SpacerBox size="large" />
        </BoundaryBox>

        <BackgroundWrapper backgroundType="adaLight">
          <BoundaryBox>
            <SpacerBox size="large" />
            <TitleWithText
              title={translate({ id: "whatIsAWallet.choose.title", message: "How to choose a wallet" })}
              description={{
                list: [
                  translate({
                    id: "whatIsAWallet.choose.item1",
                    message:
                      "Does it support hardware wallets? Connecting a device like Ledger or Trezor adds an extra layer of security.",
                  }),
                  translate({
                    id: "whatIsAWallet.choose.item2",
                    message:
                      "Is it open source? Open-source code lets the community review and verify the wallet's security.",
                  }),
                  translate({
                    id: "whatIsAWallet.choose.item3",
                    message:
                      "How long has it been on the market? Established wallets have a longer track record of reliability.",
                  }),
                ],
              }}
              titleType="black"
              headingDot={true}
              buttonLabel={translate({ id: "whatIsAWallet.choose.cta", message: "Open the Wallet Finder" })}
              buttonLink="/wallets"
            />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <SpacerBox size="large" />
          <FAQSection
            data={[
              {
                question: translate({
                  id: "whatIsAWallet.faq.q1",
                  message: "Are my coins stored inside the wallet?",
                }),
                answer: [
                  translate({
                    id: "whatIsAWallet.faq.a1",
                    message:
                      "No. Your ada lives on the Cardano blockchain. The wallet stores the keys that let you access and spend it.",
                  }),
                ],
              },
              {
                question: translate({
                  id: "whatIsAWallet.faq.q2",
                  message: "What happens if I lose my recovery phrase?",
                }),
                answer: [
                  translate({
                    id: "whatIsAWallet.faq.a2",
                    message:
                      "With a non-custodial wallet there is no help desk and no reset. If you lose the recovery phrase and the device, the funds are gone. Back the phrase up offline in more than one place.",
                  }),
                ],
              },
              {
                question: translate({
                  id: "whatIsAWallet.faq.q3",
                  message: "Do I need ada to set up a wallet?",
                }),
                answer: [
                  translate({
                    id: "whatIsAWallet.faq.a3",
                    message: "No. Creating a wallet is free. You only need ada once you want to transact.",
                  }),
                ],
              },
              {
                question: translate({
                  id: "whatIsAWallet.faq.q4",
                  message: "Should I use a hot or a cold wallet?",
                }),
                answer: [
                  translate({
                    id: "whatIsAWallet.faq.a4",
                    message:
                      "Use a hot wallet for small amounts you spend often, and a cold or hardware wallet for larger savings you rarely touch. Many people use both.",
                  }),
                ],
              },
            ]}
          />
          <SpacerBox size="medium" />
          <TitleWithText
            titleType="black"
            headingDot={false}
            slightText={[
              translate({
                id: "whatIsAWallet.disclaimer",
                message:
                  "This page is for educational purposes only and is not financial or security advice. Always do your own research.",
              }),
            ]}
          />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
