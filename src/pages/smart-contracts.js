import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import { FaFileContract } from "react-icons/fa";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({ id: "smartContracts.hero.title", message: "Smart contracts and dApps" })}
      description={translate({
        id: "smartContracts.hero.description",
        message: "What a smart contract is, how Cardano runs it, and what people build with it.",
      })}
      bannerType="braidBlue"
    />
  );
}

function WhatSection() {
  return (
    <>
      <Divider
        id="what"
        text={translate({ id: "smartContracts.divider.what", message: "Basics" })}
      />
      <TitleWithText
        title={translate({ id: "smartContracts.what.title", message: "What is a smart contract?" })}
        description={[
          translate({
            id: "smartContracts.what.p1",
            message:
              "A smart contract is a program stored on a blockchain that enforces an agreement without a middleman. The classic picture is a vending machine: you put in coins, you pick a product, and the machine hands it over. Nobody behind a counter decides whether you deserve the snack, the rules are built into the machine, and they work the same for everyone.",
          }),
          translate({
            id: "smartContracts.what.p2",
            message:
              "Take two friends betting on a race. Without a contract they either trust each other or pay a bookmaker. With a contract they lock their stakes in a script that pays out to whoever the recorded result favors. Neither can back out, and nobody in the middle takes a cut or changes the terms.",
          }),
          translate({
            id: "smartContracts.what.p3",
            message:
              "A contract only sees what is inside the transaction that calls it and what is already on the chain. Facts from the outside world, such as a race result or an exchange rate, have to be brought on chain by a service called an oracle, and the contract can only be as reliable as that feed.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({
          id: "smartContracts.what.button",
          message: "What is a smart contract, in the docs",
        })}
        buttonLink="https://docs.cardano.org/about-cardano/new-to-cardano/what-is-a-smart-contract"
      />
    </>
  );
}

function HowSection() {
  return (
    <>
      <Divider
        id="how"
        text={translate({ id: "smartContracts.divider.how", message: "On Cardano" })}
      />
      <TitleWithText
        title={translate({ id: "smartContracts.how.title", message: "How does Cardano run smart contracts?" })}
        description={translate({
          id: "smartContracts.how.intro",
          message:
            "On Cardano a contract is a validator: a script attached to funds on the ledger. Three things follow from that.",
        })}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="machine-squares"
        title={translate({ id: "smartContracts.how.guard.title", message: "The script guards the funds" })}
        text={[
          translate({
            id: "smartContracts.how.guard.text",
            message:
              "When someone sends ada or tokens to a contract, the funds sit in an output locked by the script instead of by a key. The output can carry a piece of data, the datum, that records the state of the agreement, for example who bet on what. To spend that output, a transaction presents an argument, the redeemer, and the script checks whether the transaction is allowed.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="chains"
        title={translate({
          id: "smartContracts.how.built.title",
          message: "The transaction is built before it runs",
        })}
        text={[
          translate({
            id: "smartContracts.how.built.text",
            message:
              "Your wallet or the app builds the complete transaction first, including every input, output and the data the script needs, and runs the script locally. Only a transaction that passes is signed and sent. The network then runs the same check, and because the inputs are fixed, the result is the same.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="power-arrows"
        title={translate({ id: "smartContracts.how.cost.title", message: "The cost is known before you sign" })}
        text={[
          translate({
            id: "smartContracts.how.cost.text",
            message:
              "Script execution is paid for with a budget of memory and processing steps that is priced by protocol parameters, so the fee is fixed when the transaction is built, not discovered afterwards. If a script still fails on chain, which the wallet's own check makes rare, a small collateral covers the network's work. Wallets set aside a few ada for that.",
          }),
        ]}
        headingDot={true}
      />
      <TitleWithText
        description={translate({
          id: "smartContracts.how.outro",
          message:
            "The full mechanics, from slots to ledger, are on the [how Cardano works](/how-cardano-works#smart-contracts) page.",
        })}
      />
    </>
  );
}

function LanguagesSection() {
  return (
    <>
      <Divider
        id="languages"
        text={translate({ id: "smartContracts.divider.languages", message: "Languages" })}
      />
      <TitleWithText
        title={translate({ id: "smartContracts.languages.title", message: "Which languages do developers use?" })}
        description={[
          translate({
            id: "smartContracts.languages.p1",
            message:
              "Contracts are written in a high-level language and compiled to Plutus Core, the small language the Cardano node executes. Plutus, embedded in Haskell, was the first and is still used for protocols that want the full power of Haskell's type system. Aiken is a newer language built only for Cardano, with a simpler syntax and tooling that most new projects now pick. Both produce the same kind of on-chain script.",
          }),
          translate({
            id: "smartContracts.languages.p2",
            message:
              "Not everything needs a full contract. Native scripts handle common cases such as multi-signature wallets and time locks without any Plutus code, and native tokens can be minted under such a script as well.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "smartContracts.languages.button", message: "Start building on Cardano" })}
        buttonLink="https://developers.cardano.org"
      />
    </>
  );
}

export default function SmartContracts() {
  return (
    <Layout
      title={translate({
        id: "smartContracts.meta.title",
        message: "Smart Contracts on Cardano: How They Work and What They Power",
      })}
      description={translate({
        id: "smartContracts.meta.description",
        message:
          "What a smart contract is, how Cardano runs them as validator scripts on the eUTXO ledger, which languages developers use, what a dApp is, how to use one safely and what is already built.",
      })}
    >
      <OpenGraphInfo />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <HighlightCallout icon={<FaFileContract />}>
              {translate({
                id: "smartContracts.intro.callout",
                message:
                  "A smart contract on Cardano is a script that decides whether a transaction may spend the funds it guards. It cannot act on its own and it cannot reach outside the chain. It can only say yes or no.",
              })}
            </HighlightCallout>
            <SpacerBox size="small" />
            <WhatSection />
            <HowSection />
            <LanguagesSection />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
