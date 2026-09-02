import React from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import { FaCogs } from "react-icons/fa";
import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import styles from "./how-cardano-works.module.css";

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({ id: "howCardanoWorks.hero.title", message: "How Cardano works" })}
      description={translate({
        id: "howCardanoWorks.hero.description",
        message: "Blocks, ledger, tokens, programs and upgrades, explained step by step.",
      })}
      bannerType="waves"
    />
  );
}

function BlockchainSection() {
  return (
    <>
      <Divider
        id="blockchain"
        text={translate({ id: "howCardanoWorks.divider.blockchain", message: "Basics" })}
      />
      <TitleWithText
        title={translate({ id: "howCardanoWorks.blockchain.title", message: "What is a blockchain?" })}
        description={translate({
          id: "howCardanoWorks.blockchain.p1",
          message:
            "A blockchain is a ledger that many computers keep in sync without a central operator. Transactions are collected into blocks, each block references the one before it, and every participant can check the whole history for themselves. Changing an old block would break every reference after it, which is what makes the record tamper-evident.",
        })}
        headingDot={true}
      />
      <SpacerBox size="small" />
      <TitleWithText
        description={translate({
          id: "howCardanoWorks.blockchain.p2",
          message:
            "What differs between blockchains is how they decide who writes the next block, how they represent ownership, and how they change their own rules. The rest of this page walks through Cardano's answers to those three questions, and then through the things you can do on top: tokens, programs and running the network yourself.",
        })}
        buttonLabel={translate({
          id: "howCardanoWorks.blockchain.button",
          message: "New to the idea? Start with what Cardano is",
        })}
        buttonLink="/what-is-cardano"
      />
    </>
  );
}

function ConsensusSection() {
  return (
    <>
      <Divider
        id="consensus"
        text={translate({ id: "howCardanoWorks.divider.consensus", message: "Consensus" })}
      />
      <TitleWithText
        title={translate({ id: "howCardanoWorks.consensus.title", message: "How does Cardano reach agreement?" })}
        description={translate({
          id: "howCardanoWorks.consensus.intro",
          message:
            "Cardano uses Ouroboros, a proof-of-stake protocol. Instead of competing with computing power, participants are chosen to produce blocks in proportion to the ada delegated to them.",
        })}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="dots-with-line"
        title={translate({ id: "howCardanoWorks.consensus.slots.title", message: "Slots and epochs" })}
        text={[
          translate({
            id: "howCardanoWorks.consensus.slots.text",
            message:
              "Time is divided into slots of one second and epochs of 432,000 slots, five days. For every slot, each stake pool runs a private lottery whose odds match its share of the delegated stake. On average one pool in twenty slots wins, so a new block appears roughly every 20 seconds, and most slots pass without a block.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="chains"
        title={translate({ id: "howCardanoWorks.consensus.blocks.title", message: "Blocks" })}
        text={[
          translate({
            id: "howCardanoWorks.consensus.blocks.text",
            message:
              "The winning pool bundles pending transactions into a block of up to about 88 KB, signs it and sends it to its peers, who verify every transaction before passing it on. Blocks are final in practice after a few more blocks have been built on top, and provably final after a longer window that the protocol's security proofs define.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="proof-of-stake"
        title={translate({ id: "howCardanoWorks.consensus.secure.title", message: "Why it is secure" })}
        text={[
          translate({
            id: "howCardanoWorks.consensus.secure.text",
            message:
              "Ouroboros was published and peer-reviewed before it was deployed, and its guarantees hold as long as honest participants control the majority of the stake. There is no slashing: a pool that misbehaves earns no rewards, but delegated ada is never at risk.",
          }),
        ]}
        headingDot={true}
      />
      <TitleWithText
        buttonLabel={translate({ id: "howCardanoWorks.consensus.button", message: "Explore Ouroboros" })}
        buttonLink="/ouroboros"
      />
    </>
  );
}

function LedgerSection() {
  return (
    <>
      <Divider
        id="ledger"
        text={translate({ id: "howCardanoWorks.divider.ledger", message: "Ledger" })}
      />
      <TitleWithText
        title={translate({
          id: "howCardanoWorks.ledger.title",
          message: "How does Cardano keep track of who owns what?",
        })}
        description={[
          translate({
            id: "howCardanoWorks.ledger.p1",
            message:
              "Cardano uses the extended UTXO model, eUTXO for short. Instead of accounts with running balances, the ledger holds unspent transaction outputs: individual notes of value, each locked to an address. A transaction consumes whole notes as inputs and creates new notes as outputs, and the total in must cover the total out plus the fee. Your wallet balance is simply the sum of the notes you can unlock.",
          }),
          translate({
            id: "howCardanoWorks.ledger.p2",
            message:
              "Two consequences matter for users. First, everything a transaction will do is fixed when it is built, so your wallet can tell you the exact outcome and fee before you sign. Second, a note can only be spent once, so two transactions cannot both spend the same note in the same block. Applications design around this by splitting value across many notes or by batching, which is why some Cardano apps process orders in rounds rather than one by one.",
          }),
          translate({
            id: "howCardanoWorks.ledger.p3",
            message:
              "The extended part is what makes programs possible: an output can carry data and be locked by a script instead of a key, and the script decides whether a transaction may spend it.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "howCardanoWorks.ledger.button", message: "The eUTXO model explained" })}
        buttonLink="https://docs.cardano.org/about-cardano/learn/eutxo-explainer"
      />
    </>
  );
}

function TransactionsSection() {
  return (
    <>
      <Divider
        id="transactions"
        text={translate({ id: "howCardanoWorks.divider.transactions", message: "Transactions" })}
      />
      <TitleWithText
        title={translate({
          id: "howCardanoWorks.transactions.title",
          message: "What does a transaction cost, and how long does it take?",
        })}
        description={[
          translate({
            id: "howCardanoWorks.transactions.p1",
            message:
              "A fee is a formula, not an auction: a fixed part plus a per-byte part, both set by protocol parameters. On mainnet today that is 155,381 lovelace plus 44 lovelace per byte, so a typical transfer of a few hundred bytes costs around 0.17 ada. Fees do not rise when the network is busy, transactions simply wait a little longer.",
          }),
          translate({
            id: "howCardanoWorks.transactions.p2",
            message:
              "Every output also has to hold a minimum amount of ada, roughly one ada for a simple output, so that the ledger does not fill up with dust. That ada is not a fee: it stays in the output and comes back when the output is spent. Registering a stake key takes a refundable 2 ada deposit for the same reason.",
          }),
          translate({
            id: "howCardanoWorks.transactions.p3",
            message:
              "A transaction usually appears in a block within about 20 seconds. Wallets and exchanges then wait for more blocks on top before treating it as settled, typically a few minutes for everyday use and longer for large transfers.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "howCardanoWorks.transactions.button", message: "Fee structure in the docs" })}
        buttonLink="https://docs.cardano.org/about-cardano/explore-more/fee-structure"
      />
    </>
  );
}

export default function HowCardanoWorks() {
  return (
    <Layout
      title={translate({
        id: "howCardanoWorks.meta.title",
        message: "How Cardano Works: Consensus, Ledger, Tokens and Upgrades Explained",
      })}
      description={translate({
        id: "howCardanoWorks.meta.description",
        message:
          "A plain-language tour of the Cardano blockchain: how blocks are produced, how the extended UTXO ledger tracks ownership, what transactions cost, how native tokens and smart contracts run, who operates the network and how it upgrades.",
      })}
    >
      <OpenGraphInfo />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <HighlightCallout icon={<FaCogs />}>
              {translate({
                id: "howCardanoWorks.intro.callout",
                message:
                  "Stake pools produce the blocks, a UTXO ledger records who owns what, tokens and smart contracts run on that ledger, and the whole system upgrades through hard forks that the community decides on.",
              })}
            </HighlightCallout>
            <SpacerBox size="small" />
            <BlockchainSection />
            <ConsensusSection />
            <LedgerSection />
            <TransactionsSection />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
