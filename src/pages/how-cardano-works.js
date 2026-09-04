import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
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
import FAQSection from "@site/src/components/FAQSection";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import { faqJsonLd } from "@site/src/utils/jsonLd";
import { getHowCardanoWorksFAQ } from "@site/src/data/howCardanoWorksFAQ";

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
              "Time is divided into slots of one second and epochs of 432,000 slots, five days. For every slot, each stake pool runs a private lottery whose odds match its share of the delegated stake, and any pool that wins becomes a slot leader. On average only one slot in twenty has a leader at all, so a new block appears roughly every 20 seconds and most slots pass without a block. Now and then two pools qualify for the same slot, and only one of their blocks stays in the chain.",
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
              "The slot leader bundles pending transactions into a block of up to about 88 KB under current parameters, signs it and sends it to its peers, who verify every transaction before passing it on. Every block built on top makes a rollback less likely, which is why wallets and exchanges treat a transaction as settled after a handful of blocks. The protocol itself only rules out a rollback once a block is deep enough in the chain, a window of about 36 hours on mainnet set by its security parameters.",
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
              "Cardano uses the extended UTXO model, eUTXO for short. Instead of accounts with running balances, the ledger holds unspent transaction outputs: individual notes of value, each locked to an address. A transaction consumes whole notes as inputs and creates new notes as outputs, and the total in has to equal the total out plus the fee, with any remainder coming back to you as change. The spendable balance your wallet shows is simply the sum of the notes it can unlock. Staking rewards are the one exception: they accumulate in a separate reward account, and withdrawing them into a note is itself a transaction.",
          }),
          translate({
            id: "howCardanoWorks.ledger.p2",
            message:
              "Two consequences matter for users. First, everything a transaction will do is fixed when it is built, so your wallet can tell you the exact outcome and fee before you sign. Second, a note can only be spent once, so if two transactions try to spend the same note, only one of them can succeed. The other is rejected as a whole, even if it passed every check when it was built, and nothing is half-applied. Applications design around this by splitting value across many notes or by batching, which is why some Cardano apps process orders in rounds rather than one by one.",
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
              "A fee is a formula, not an auction: a fixed part plus a per-byte part, both set by protocol parameters. On mainnet, as of 2026, that is 155,381 lovelace plus 44 lovelace per byte, so a typical transfer of a few hundred bytes costs around 0.17 ada. Like every protocol parameter, these values can change through governance. Fees do not rise when the network is busy, transactions simply wait a little longer.",
          }),
          translate({
            id: "howCardanoWorks.transactions.p2",
            message:
              "Every output also has to hold a minimum amount of ada, so that the ledger does not fill up with dust. The minimum depends on the size of the output: roughly one ada for a plain ada-only output, more when it carries tokens or data. That ada is not a fee: it stays in the output and comes back when the output is spent. Registering a stake key takes a refundable deposit, currently 2 ada, for the same reason.",
          }),
          translate({
            id: "howCardanoWorks.transactions.p3",
            message:
              "A block is produced roughly every 20 seconds, so a transaction usually appears on the chain within a minute. Wallets and exchanges then wait for more blocks on top before treating it as settled, typically a few minutes for everyday use and longer for large transfers.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "howCardanoWorks.transactions.button", message: "Fee structure in the docs" })}
        buttonLink="https://docs.cardano.org/about-cardano/explore-more/fee-structure"
      />
    </>
  );
}

function TokensSection() {
  return (
    <>
      <Divider
        id="tokens"
        text={translate({ id: "howCardanoWorks.divider.tokens", message: "Tokens" })}
      />
      <TitleWithText
        title={translate({ id: "howCardanoWorks.tokens.title", message: "How are tokens created?" })}
        description={[
          translate({
            id: "howCardanoWorks.tokens.p1",
            message:
              "Tokens on Cardano are native: the ledger tracks them directly, much as it tracks ada, so no smart contract is needed to create, send or hold them. A token is defined by a minting policy, a small script or key that says who may create or destroy it. Once minted, tokens travel inside ordinary transaction outputs, alongside ada, and a single transaction can carry many different assets. Ada keeps its special roles: only ada pays fees and deposits, only ada is paid out as staking rewards, and every output that carries tokens has to hold some ada as well.",
          }),
          translate({
            id: "howCardanoWorks.tokens.p2",
            message:
              "An NFT is simply a token minted with a quantity of one under a policy that will never mint that asset again. What the token stands for, an image or a name for example, is usually described by metadata, and standards such as CIP-25 and CIP-68 define how wallets and marketplaces read it.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "howCardanoWorks.tokens.button", message: "Native tokens in the docs" })}
        buttonLink="https://docs.cardano.org/developer-resources/native-tokens"
      />
    </>
  );
}

function SmartContractsSection() {
  return (
    <>
      <Divider
        id="smart-contracts"
        text={translate({ id: "howCardanoWorks.divider.contracts", message: "Smart contracts" })}
      />
      <TitleWithText
        title={translate({ id: "howCardanoWorks.contracts.title", message: "How do smart contracts run?" })}
        description={[
          translate({
            id: "howCardanoWorks.contracts.p1",
            message:
              "A smart contract on Cardano is a validator: a script that checks a transaction and answers one question, valid or not. Most often it guards outputs and decides whether a transaction may spend them, but scripts also govern minting and burning tokens, withdrawing rewards, certificates and, since the Chang upgrade, governance votes and proposals. The transaction itself is built by the user's wallet or the app, including every input, output and piece of data the script needs. The script cannot call other services or change its mind later, which keeps outcomes predictable.",
          }),
          translate({
            id: "howCardanoWorks.contracts.p2",
            message:
              "Scripts are written in languages such as Plutus and Aiken and compiled to Plutus Core, the language the node executes. Their execution is paid for with a separate budget of memory and steps that is priced in advance, so the cost is known before submission, exactly like the base fee. If a script fails on chain despite the wallet's own check, a small collateral covers the network's work, which is why wallets set aside a few ada for that purpose.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "howCardanoWorks.contracts.button", message: "Smart contracts explained" })}
        buttonLink="/smart-contracts"
      />
    </>
  );
}

function NetworkSection() {
  return (
    <>
      <Divider
        id="network"
        text={translate({ id: "howCardanoWorks.divider.network", message: "Network" })}
      />
      <TitleWithText
        title={translate({ id: "howCardanoWorks.network.title", message: "Who runs the network?" })}
        description={[
          translate({
            id: "howCardanoWorks.network.p1",
            message:
              "Anyone can run a Cardano node. Stake pools are nodes that produce blocks, operated by individuals, companies and communities. Delegating ada to a pool increases its chance of being chosen and earns you a share of its rewards, without moving your ada anywhere. Rewards are paid every epoch from newly released reserve ada and from transaction fees.",
          }),
          translate({
            id: "howCardanoWorks.network.p2",
            message:
              "The protocol rewards pools most when they stay below a saturation point, which discourages any single pool from growing too large, and pool operators pledge some of their own ada as a commitment. Close to three thousand pools are registered, and roughly a thousand produce blocks in a given epoch.",
          }),
          translate({
            id: "howCardanoWorks.network.p3",
            message:
              "New nodes catch up with the chain either by replaying its full history or by starting from a signed snapshot produced by Mithril, a network of signers backed by the same stake distribution. If you would rather help produce blocks than delegate, you can [run a stake pool yourself](/stake-pool-operation).",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "howCardanoWorks.network.button", message: "Delegate your ada" })}
        buttonLink="/stake-pool-delegation"
      />
    </>
  );
}

function UpgradesSection() {
  return (
    <>
      <Divider
        id="upgrades"
        text={translate({ id: "howCardanoWorks.divider.upgrades", message: "Upgrades" })}
      />
      <TitleWithText
        title={translate({ id: "howCardanoWorks.upgrades.title", message: "How does Cardano change?" })}
        description={[
          translate({
            id: "howCardanoWorks.upgrades.p1",
            message:
              "Cardano upgrades through hard forks, but without the chain splits the term usually implies. The hard fork combinator lets a single node understand every era of the protocol, so the switch from one set of rules to the next happens at an epoch boundary that everyone knows in advance. Each era added something: staking, native tokens, smart contracts, cheaper scripts, and on-chain governance.",
          }),
          translate({
            id: "howCardanoWorks.upgrades.p2",
            message:
              "Since 2025 a hard fork is itself a governance action: it is proposed on chain and enacted only after the constitutional committee, delegated representatives and stake pool operators have each approved it. Protocol parameters such as fees and block size change through the same on-chain process, though which of the three bodies has to vote depends on the type of action. See [how governance works](/governance).",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "howCardanoWorks.upgrades.button", message: "Every upgrade so far" })}
        buttonLink="/hardforks"
      />
    </>
  );
}

function TerminologySection() {
  return (
    <>
      <Divider
        id="terminology"
        text={translate({ id: "howCardanoWorks.divider.terminology", message: "Terminology" })}
      />
      <TitleWithText
        title={translate({ id: "howCardanoWorks.terminology.title", message: "What do these words mean?" })}
        description={[
          translate({
            id: "howCardanoWorks.terminology.intro",
            message: "The words this page uses, each linked to its glossary entry.",
          }),
          {
            list: [
              translate({
                id: "howCardanoWorks.terminology.item.utxo",
                message: "[UTXO](/glossary/utxo): an unspent output, one note of value.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.eutxo",
                message: "[eUTXO](/glossary/eutxo): the extended model with data and scripts on outputs.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.epoch",
                message: "[Epoch](/glossary/epoch): five days, 432,000 slots.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.slot",
                message: "[Slot](/glossary/slot): one second, the unit of time.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.slotLeader",
                message: "[Slot leader](/glossary/slot-leader): a pool that qualifies to produce the block for a slot.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.stakePool",
                message: "[Stake pool](/glossary/stake-pool): a block-producing node with delegated stake.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.nativeToken",
                message: "[Native token](/glossary/native-token): an asset the ledger tracks directly, alongside ada.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.plutusCore",
                message: "[Plutus Core](/glossary/plutus-core): the on-chain script language.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.collateral",
                message: "[Collateral](/glossary/collateral): ada set aside in case a script fails on chain.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.hardForkCombinator",
                message:
                  "[Hard fork combinator](/glossary/hard-fork-combinator): the mechanism that lets one node run every era.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.mithril",
                message: "[Mithril](/glossary/mithril): signed snapshots for fast node bootstrap.",
              }),
              translate({
                id: "howCardanoWorks.terminology.item.drep",
                message: "[DRep](/glossary/drep): a delegated representative in governance.",
              }),
            ],
          },
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "howCardanoWorks.terminology.button", message: "Open the glossary" })}
        buttonLink="/glossary"
      />
    </>
  );
}

export default function HowCardanoWorks() {
  const faq = getHowCardanoWorksFAQ();
  return (
    <Layout
      title={translate({
        id: "howCardanoWorks.meta.title",
        message: "How Cardano Works: Consensus, Ledger and Upgrades",
      })}
      description={translate({
        id: "howCardanoWorks.meta.description",
        message:
          "How Cardano works, in plain language: block production, the eUTXO ledger, transaction costs, native tokens, smart contracts and protocol upgrades.",
      })}
    >
      <Head>
        <script type="application/ld+json">{faqJsonLd(faq)}</script>
      </Head>
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
            <TokensSection />
            <SmartContractsSection />
            <NetworkSection />
            <UpgradesSection />
            <TerminologySection />
            <FAQSection data={faq} />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
        <BackgroundWrapper backgroundType="gradientDark">
          <BoundaryBox>
            <CtaOneColumn
              title={translate({ id: "howCardanoWorks.cta.title", message: "Ready to test yourself? Take the technical quiz." })}
              buttonLabel={translate({ id: "howCardanoWorks.cta.button", message: "Take the quiz" })}
              buttonLink="/quiz"
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
