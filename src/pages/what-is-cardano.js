import React from "react";
import { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import { FaInfoCircle, FaUser, FaBuilding, FaLandmark } from "react-icons/fa";
import ExplainerPage from "@site/src/components/Layout/ExplainerPage";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import RoleCard from "@site/src/components/Layout/RoleCard";
import ProofPointsList from "@site/src/components/ProofPointsList";
import { getProofPoints } from "@site/src/data/whatIsCardanoProofPoints";
import { getWhatIsCardanoFAQ } from "@site/src/data/whatIsCardanoFAQ";
import styles from "./what-is-cardano.module.css";

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
              "Two things set Cardano apart from the start. Its consensus protocol, [Ouroboros](/ouroboros), was the first provably secure proof-of-stake protocol, published and peer-reviewed before it was deployed. And since 2025 the protocol's own rules, upgrades and treasury are decided on the chain itself by ada holders, stake pool operators and an elected committee, not by a foundation or a company.",
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
              "Ada is the currency of the Cardano network, named after Ada Lovelace, the 19th-century mathematician often called the first computer programmer. You use ada to pay transaction fees, to stake and earn rewards, to vote in governance and to pay for services in applications built on Cardano. The supply is capped at 45 billion ada, and new ada enters circulation only from a fixed reserve, as staking rewards and treasury funding.",
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
              "Time on Cardano is divided into slots of one second and epochs of five days. Slots are assigned at random to stake pools, weighted by how much ada is delegated to them, and the chosen pool produces the next block. Most slots stay empty, so a block appears roughly every 20 seconds. Because the choice is based on stake rather than computing power, running the network needs ordinary servers, not warehouses of mining hardware.",
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
              "Cardano tracks ownership the way cash works, not the way a bank balance works. Your wallet holds a set of unspent notes (UTXOs), and a transaction consumes some notes and creates new ones. The model, called extended UTXO or eUTXO, lets your wallet work out exactly what a transaction will do and what it will cost before you sign it. There is no bidding for block space, and a simple transfer that would fail is rejected before it is submitted, so you do not pay for failures.",
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
              "Tokens on Cardano are built into the ledger. Creating or transferring a token uses the same rules as ada, with no smart contract needed. Smart contracts are validator scripts that approve or reject a transaction someone has already built, written in languages such as Plutus and Aiken.",
          }),
        ]}
        headingDot={true}
      />
      <TitleWithText
        description={translate({
          id: "whatIsCardano.how.outro",
          message: "Want the full picture, from slots to hard forks? Read how Cardano works step by step.",
        })}
        buttonLabel={translate({ id: "whatIsCardano.how.button", message: "Read how Cardano works" })}
        buttonLink="/how-cardano-works"
      />
    </>
  );
}

function DifferentSection() {
  return (
    <>
      <Divider
        id="what-makes-it-different"
        text={translate({ id: "whatIsCardano.divider.different", message: "Why Cardano" })}
      />
      <TitleWithText
        title={translate({ id: "whatIsCardano.different.title", message: "What makes Cardano different?" })}
        headingDot={true}
      />
      <ProofPointsList points={getProofPoints()} />
    </>
  );
}

function UsedForSection() {
  return (
    <>
      <Divider id="used-for" text={translate({ id: "whatIsCardano.divider.usedFor", message: "Use cases" })} />
      <TitleWithText
        title={translate({ id: "whatIsCardano.usedFor.title", message: "What is Cardano used for?" })}
        headingDot={true}
      />
      <div className={styles.cardGrid}>
        <RoleCard accent="blue" icon={<FaUser />} title={translate({ id: "whatIsCardano.usedFor.individuals.title", message: "For individuals" })}>
          {translate({
            id: "whatIsCardano.usedFor.individuals.text",
            message:
              "Send and receive value anywhere, hold stablecoins, stake ada for rewards, collect and trade digital assets, and vote on how the network is run. Everything from a wallet you control.",
          })}
          <Link to="/get-started" className={styles.cardLink}>
            {translate({ id: "whatIsCardano.usedFor.individuals.link", message: "See what you can do" })}
          </Link>
        </RoleCard>
        <RoleCard accent="violet" icon={<FaBuilding />} title={translate({ id: "whatIsCardano.usedFor.business.title", message: "For businesses" })}>
          {translate({
            id: "whatIsCardano.usedFor.business.text",
            message:
              "Issue tokens without writing a contract, settle payments with predictable fees, anchor documents and supply-chain data on a public ledger, and build applications on an open platform.",
          })}
          <Link to="/solutions" className={styles.cardLink}>
            {translate({ id: "whatIsCardano.usedFor.business.link", message: "Solutions for enterprise" })}
          </Link>
        </RoleCard>
        <RoleCard accent="teal" icon={<FaLandmark />} title={translate({ id: "whatIsCardano.usedFor.public.title", message: "For the public sector" })}>
          {translate({
            id: "whatIsCardano.usedFor.public.text",
            message:
              "Digital identity, verifiable credentials, transparent distribution of public funds and tamper-evident records, built on infrastructure no single vendor controls.",
          })}
          <Link to="/use-cases" className={styles.cardLink}>
            {translate({ id: "whatIsCardano.usedFor.public.link", message: "Explore use cases" })}
          </Link>
        </RoleCard>
      </div>
      <TitleWithText
        description={translate({
          id: "whatIsCardano.usedFor.outro",
          message: "More than a hundred applications already run on Cardano: wallets, exchanges, lending, identity, games and more.",
        })}
        buttonLabel={translate({ id: "whatIsCardano.usedFor.button", message: "Browse Cardano apps" })}
        buttonLink="/apps"
      />
    </>
  );
}

function GetStartedSection() {
  const steps = [
    { key: "wallet", href: "/what-is-a-wallet",
      title: translate({ id: "whatIsCardano.start.wallet.title", message: "Get a wallet" }),
      text: translate({ id: "whatIsCardano.start.wallet.text", message: "Your keys, your ada. Learn what a wallet is and pick one that fits you." }) },
    { key: "ada", href: "/where-to-get-ada",
      title: translate({ id: "whatIsCardano.start.ada.title", message: "Get ada" }),
      text: translate({ id: "whatIsCardano.start.ada.text", message: "Find trusted exchanges and other ways to get your first ada." }) },
    { key: "stake", href: "/stake-pool-delegation",
      title: translate({ id: "whatIsCardano.start.stake.title", message: "Stake your ada" }),
      text: translate({ id: "whatIsCardano.start.stake.text", message: "Delegate to a stake pool, help secure the network, earn rewards." }) },
    { key: "vote", href: "/governance",
      title: translate({ id: "whatIsCardano.start.vote.title", message: "Have your say" }),
      text: translate({ id: "whatIsCardano.start.vote.text", message: "Take part in governance and shape where Cardano goes next." }) },
    { key: "build", href: "https://developers.cardano.org",
      title: translate({ id: "whatIsCardano.start.build.title", message: "Build on Cardano" }),
      text: translate({ id: "whatIsCardano.start.build.text", message: "Head to the developer portal and ship your first project." }) },
  ];
  return (
    <>
      <Divider id="get-started" text={translate({ id: "whatIsCardano.divider.start", message: "Get started" })} />
      <TitleWithText
        title={translate({ id: "whatIsCardano.start.title", message: "How do I start using Cardano?" })}
        description={{ list: steps.map((step) => `[${step.title}](${step.href}): ${step.text}`) }}
        headingDot={true}
      />
      <TitleWithText
        description={translate({ id: "whatIsCardano.start.outro", message: "Prefer a guided walk-through? The getting started page takes you from download to first transaction, and the [learning path](/learn) continues from there." })}
        buttonLabel={translate({ id: "whatIsCardano.start.button", message: "Start step by step" })}
        buttonLink="/get-started"
      />
    </>
  );
}

function HistorySection() {
  return (
    <>
      <Divider id="history" text={translate({ id: "whatIsCardano.divider.history", message: "History" })} />
      <TitleWithText
        title={translate({ id: "whatIsCardano.history.title", message: "Who created Cardano and who runs it now?" })}
        description={translate({
          id: "whatIsCardano.history.p1",
          message:
            "Cardano was started in 2015 by Charles Hoskinson and Jeremy Wood and launched in September 2017. Three organizations shared the work at genesis: IOHK (now IOG) built the software, the Cardano Foundation was set up to oversee and promote the ecosystem, and Emurgo focused on commercial adoption.",
        })}
        headingDot={true}
        buttonLabel={translate({ id: "whatIsCardano.history.genesisButton", message: "Read about the genesis" })}
        buttonLink="/genesis"
      />
      <SpacerBox size="small" />
      <TitleWithText
        description={translate({
          id: "whatIsCardano.history.p2",
          message:
            "Today no single organization runs Cardano. Since the governance upgrades of 2024 and 2025, ada holders, delegated representatives, stake pool operators and a constitutional committee decide on protocol changes and treasury spending under a community-ratified [constitution](/constitution). Intersect, a member-based organization, coordinates development and maintenance. The network's evolution is recorded as a series of hard forks, each one an upgrade agreed by the community.",
        })}
        buttonLabel={translate({ id: "whatIsCardano.history.forksButton", message: "See every upgrade" })}
        buttonLink="/hardforks"
      />
    </>
  );
}

export default function WhatIsCardano() {
  const faq = getWhatIsCardanoFAQ();
  return (
    <ExplainerPage
      title={translate({
        id: "whatIsCardano.meta.title",
        message: "What Is Cardano? A Beginner's Guide to the Cardano Blockchain",
      })}
      description={translate({
        id: "whatIsCardano.meta.description",
        message:
          "Cardano is a proof-of-stake blockchain platform for money, identity and governance. Learn how it works, what makes it different, what it is used for and how to get started.",
      })}
      hero={{
        title: translate({ id: "whatIsCardano.hero.title", message: "What is Cardano?" }),
        description: translate({
          id: "whatIsCardano.hero.description",
          message:
            "A proof-of-stake blockchain built on peer-reviewed research, run by stake pools around the world and governed by the people who hold ada.",
        }),
        bannerType: "starburst",
      }}
      faq={faq}
      cta={{
        title: translate({ id: "whatIsCardano.cta.title", message: "Think you have the basics down? Take the Cardano basics quiz." }),
        buttonLabel: translate({ id: "whatIsCardano.cta.button", message: "Take the quiz" }),
        buttonLink: "/quiz",
      }}
    >
      <WhatIsCardanoSection />
      <AdaSection />
      <HowItWorksSection />
      <DifferentSection />
      <UsedForSection />
      <GetStartedSection />
      <HistorySection />
    </ExplainerPage>
  );
}
