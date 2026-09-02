import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { translate } from "@docusaurus/Translate";
import { FaInfoCircle } from "react-icons/fa";
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
      title={translate({ id: "whatIsCardano.hero.title", message: "What is Cardano?" })}
      description={translate({
        id: "whatIsCardano.hero.description",
        message:
          "A proof-of-stake blockchain built on peer-reviewed research, run by more than a thousand independent stake pools and governed by the people who hold ada.",
      })}
      bannerType="starburst"
    />
  );
}

function WhatIsCardanoSection() {
  return (
    <>
      <Divider
        id="what-is-cardano"
        text={translate({ id: "whatIsCardano.divider.intro", message: "In short" })}
      />
      <HighlightCallout icon={<FaInfoCircle />}>
        {translate({
          id: "whatIsCardano.intro.callout",
          message:
            "Cardano is a public, proof-of-stake blockchain. Anyone can use it to send ada, create tokens, run applications and vote on how the network itself evolves.",
        })}
      </HighlightCallout>
      <SpacerBox size="small" />
      <TitleWithText
        title={translate({ id: "whatIsCardano.intro.title", message: "What is Cardano?" })}
        description={[
          translate({
            id: "whatIsCardano.intro.p1",
            message:
              "Cardano is a blockchain platform: a shared, public ledger that thousands of independent computers keep in sync without a company in the middle. It records who owns what, runs programs called smart contracts, and settles transactions in its own currency, ada. Development began in 2015 and the network went live in September 2017.",
          }),
          translate({
            id: "whatIsCardano.intro.p2",
            message:
              "Two things set Cardano apart from the start. Its consensus protocol, [Ouroboros](/ouroboros), was the first proof-of-stake protocol to be published and peer-reviewed at a major cryptography conference before it was deployed. And since 2025 the protocol's own rules, upgrades and treasury are decided on the chain itself by ada holders, stake pool operators and an elected committee, not by a foundation or a company.",
          }),
          translate({
            id: "whatIsCardano.intro.p3",
            message:
              "In plain terms: Cardano is a technology that lets people manage and exchange value, identity and governance over the internet, with rules that everyone can inspect and nobody can quietly change.",
          }),
        ]}
        headingDot={true}
      />
    </>
  );
}

function AdaSection() {
  return (
    <>
      <Divider id="ada" text={translate({ id: "whatIsCardano.divider.ada", message: "Ada" })} />
      <TitleWithText
        title={translate({ id: "whatIsCardano.ada.title", message: "What is ada?" })}
        description={[
          translate({
            id: "whatIsCardano.ada.p1",
            message:
              "Ada is the currency of the Cardano network, named after Ada Lovelace, the 19th-century mathematician often called the first computer programmer. You use ada to pay transaction fees, to stake and earn rewards, to vote in governance and to pay for services in applications built on Cardano. The supply is capped at 45 billion ada, and new ada enters circulation only as staking rewards drawn from a fixed reserve.",
          }),
          translate({
            id: "whatIsCardano.ada.p2",
            message:
              "Every ada also carries a stake in the network. You do not need to send it anywhere or lock it up to use that stake, which is one of the differences explained below.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "whatIsCardano.ada.button", message: "Learn more about ada" })}
        buttonLink="/what-is-ada"
      />
    </>
  );
}

function HowItWorksSection() {
  return (
    <>
      <Divider
        id="how-it-works"
        text={translate({ id: "whatIsCardano.divider.howItWorks", message: "How it works" })}
      />
      <TitleWithText
        title={translate({ id: "whatIsCardano.how.title", message: "How does Cardano work?" })}
        description={translate({
          id: "whatIsCardano.how.intro",
          message:
            "Three ideas explain most of what happens on Cardano: how the network agrees on the next block, how it keeps track of who owns what, and how tokens and programs fit in.",
        })}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="proof-of-stake"
        title={translate({ id: "whatIsCardano.how.consensus.title", message: "Consensus: Ouroboros" })}
        text={[
          translate({
            id: "whatIsCardano.how.consensus.text",
            message:
              "Time on Cardano is divided into slots of one second and epochs of five days. For each slot, the protocol picks one stake pool at random, weighted by how much ada is delegated to it, to produce the next block. Because the choice is based on stake rather than computing power, running the network needs ordinary servers, not warehouses of mining hardware.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="chains"
        title={translate({ id: "whatIsCardano.how.eutxo.title", message: "Accounting: the extended UTXO model" })}
        text={[
          translate({
            id: "whatIsCardano.how.eutxo.text",
            message:
              "Cardano tracks ownership the way cash works, not the way a bank balance works. Your wallet holds a set of unspent notes (UTXOs), and a transaction consumes some notes and creates new ones. The model, called extended UTXO or eUTXO, lets your wallet work out exactly what a transaction will do and what it will cost before you sign it. There is no bidding for block space, and a transaction that would fail is rejected before it is submitted, so you do not pay for failures.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="machine-squares"
        title={translate({ id: "whatIsCardano.how.programs.title", message: "Programs: native tokens and smart contracts" })}
        text={[
          translate({
            id: "whatIsCardano.how.programs.text",
            message:
              "Tokens on Cardano are built into the ledger. Creating or transferring a token uses the same rules as ada, with no smart contract needed. Smart contracts are validator scripts that approve or reject a transaction someone has already built, written in languages such as Plutus, Aiken and Marlowe.",
          }),
        ]}
        headingDot={true}
      />
      <TitleWithText
        description={translate({
          id: "whatIsCardano.how.outro",
          message: "Want the full picture, from slot leaders to the energy footprint? Start with the consensus protocol.",
        })}
        buttonLabel={translate({ id: "whatIsCardano.how.button", message: "Explore Ouroboros" })}
        buttonLink="/ouroboros"
      />
    </>
  );
}

export default function WhatIsCardano() {
  return (
    <Layout
      title={translate({
        id: "whatIsCardano.meta.title",
        message: "What Is Cardano? A Beginner's Guide to the Cardano Blockchain",
      })}
      description={translate({
        id: "whatIsCardano.meta.description",
        message:
          "Cardano is a proof-of-stake blockchain platform for money, identity and governance. Learn how it works, what makes it different, what it is used for and how to get started.",
      })}
    >
      <OpenGraphInfo pageName="what-is-cardano" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <WhatIsCardanoSection />
            <AdaSection />
            <HowItWorksSection />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
