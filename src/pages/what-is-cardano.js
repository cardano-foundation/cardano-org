import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { FaInfoCircle, FaUser, FaBuilding, FaLandmark, FaWallet, FaShoppingCart, FaLayerGroup, FaVoteYea, FaCode, FaBitcoin, FaEthereum } from "react-icons/fa";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import RoleCard from "@site/src/components/Layout/RoleCard";
import ProofPointsList from "@site/src/components/ProofPointsList";
import FAQSection from "@site/src/components/FAQSection";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import { getProofPoints } from "@site/src/data/whatIsCardanoProofPoints";
import { jsonLdString } from "@site/src/utils/jsonLd";
import { getWhatIsCardanoFAQ } from "@site/src/data/whatIsCardanoFAQ";
import styles from "./what-is-cardano.module.css";

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

function DifferentSection() {
  return (
    <>
      <Divider
        id="what-makes-it-different"
        text={translate({ id: "whatIsCardano.divider.different", message: "Why Cardano" })}
      />
      <ProofPointsList
        title={translate({ id: "whatIsCardano.different.title", message: "What makes Cardano different?" })}
        points={getProofPoints()}
      />
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
          message: "Hundreds of applications already run on Cardano: wallets, exchanges, lending, identity, games and more.",
        })}
        buttonLabel={translate({ id: "whatIsCardano.usedFor.button", message: "Browse Cardano apps" })}
        buttonLink="/apps"
      />
    </>
  );
}

function GetStartedSection() {
  const steps = [
    { key: "wallet", icon: <FaWallet />, accent: "blue", to: "/what-is-a-wallet",
      title: translate({ id: "whatIsCardano.start.wallet.title", message: "Get a wallet" }),
      text: translate({ id: "whatIsCardano.start.wallet.text", message: "Your keys, your ada. Learn what a wallet is and pick one that fits you." }) },
    { key: "ada", icon: <FaShoppingCart />, accent: "violet", to: "/where-to-get-ada",
      title: translate({ id: "whatIsCardano.start.ada.title", message: "Get ada" }),
      text: translate({ id: "whatIsCardano.start.ada.text", message: "Find trusted exchanges and other ways to get your first ada." }) },
    { key: "stake", icon: <FaLayerGroup />, accent: "teal", to: "/stake-pool-delegation",
      title: translate({ id: "whatIsCardano.start.stake.title", message: "Stake your ada" }),
      text: translate({ id: "whatIsCardano.start.stake.text", message: "Delegate to a stake pool, help secure the network, earn rewards." }) },
    { key: "vote", icon: <FaVoteYea />, accent: "blue", to: "/governance",
      title: translate({ id: "whatIsCardano.start.vote.title", message: "Have your say" }),
      text: translate({ id: "whatIsCardano.start.vote.text", message: "Take part in governance and shape where Cardano goes next." }) },
    { key: "build", icon: <FaCode />, accent: "violet", href: "https://developers.cardano.org",
      title: translate({ id: "whatIsCardano.start.build.title", message: "Build on Cardano" }),
      text: translate({ id: "whatIsCardano.start.build.text", message: "Head to the developer portal and ship your first project." }) },
  ];
  return (
    <>
      <Divider id="get-started" text={translate({ id: "whatIsCardano.divider.start", message: "Get started" })} />
      <TitleWithText
        title={translate({ id: "whatIsCardano.start.title", message: "How do I start using Cardano?" })}
        headingDot={true}
      />
      <div className={styles.cardGrid}>
        {steps.map((step) => (
          <RoleCard key={step.key} accent={step.accent} icon={step.icon} title={step.title} href={step.to || step.href}>
            {step.text}
          </RoleCard>
        ))}
      </div>
      <TitleWithText
        description={translate({ id: "whatIsCardano.start.outro", message: "Prefer a guided walk-through? The getting started page takes you from download to first transaction." })}
        buttonLabel={translate({ id: "whatIsCardano.start.button", message: "Start step by step" })}
        buttonLink="/get-started"
      />
    </>
  );
}

function ComparedSection() {
  const cardanoLogo = useBaseUrl("/img/cardano-logo-blue.svg");
  return (
    <>
      <Divider id="compared" text={translate({ id: "whatIsCardano.divider.compared", message: "Compared" })} />
      <TitleWithText
        title={translate({ id: "whatIsCardano.compared.title", message: "How does Cardano compare to Bitcoin and Ethereum?" })}
        description={translate({
          id: "whatIsCardano.compared.intro",
          message: "Cardano is often described as a third-generation blockchain. The label is a simplification, but it explains the design goals.",
        })}
        headingDot={true}
      />
      <div className={styles.cardGrid}>
        <RoleCard accent="blue" icon={<FaBitcoin />} title={translate({ id: "whatIsCardano.compared.bitcoin.title", message: "Bitcoin, first generation" })}>
          {translate({
            id: "whatIsCardano.compared.bitcoin.text",
            message: "Digital money with a fixed supply, secured by proof of work. Deliberately limited to transfers of value.",
          })}
        </RoleCard>
        <RoleCard accent="violet" icon={<FaEthereum />} title={translate({ id: "whatIsCardano.compared.ethereum.title", message: "Ethereum, second generation" })}>
          {translate({
            id: "whatIsCardano.compared.ethereum.text",
            message: "Added programmable smart contracts, which made decentralized applications possible. Moved from proof of work to proof of stake in 2022.",
          })}
        </RoleCard>
        <RoleCard accent="teal" icon={<img src={cardanoLogo} alt="" width="20" height="20" />} title={translate({ id: "whatIsCardano.compared.cardano.title", message: "Cardano, third generation" })}>
          {translate({
            id: "whatIsCardano.compared.cardano.text",
            message:
              "Started with the questions the first two raised: how to secure proof of stake with a proof, how to keep fees predictable under load, how to fund and govern a network for decades. Cardano's answers are Ouroboros, the eUTXO model, a treasury and on-chain governance.",
          })}
        </RoleCard>
      </div>
      <TitleWithText
        description={translate({
          id: "whatIsCardano.compared.outro",
          message: "Each network makes different trade-offs, and they increasingly work together through bridges and shared standards. The comparison is about design goals, not a ranking.",
        })}
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
      <Head>
        <script type="application/ld+json">
          {jsonLdString({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq.map((item) => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": { "@type": "Answer", "text": item.answer.join(" ") },
            })),
          })}
        </script>
      </Head>
      <OpenGraphInfo pageName="what-is-cardano" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <WhatIsCardanoSection />
            <AdaSection />
            <HowItWorksSection />
            <DifferentSection />
            <UsedForSection />
            <GetStartedSection />
            <ComparedSection />
            <HistorySection />
            <FAQSection data={faq} />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
        <BackgroundWrapper backgroundType="gradientDark">
          <BoundaryBox>
            <CtaOneColumn
              title={translate({ id: "whatIsCardano.cta.title", message: "Think you have the basics down? Take the Cardano basics quiz." })}
              buttonLabel={translate({ id: "whatIsCardano.cta.button", message: "Take the quiz" })}
              buttonLink="/quiz"
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
