import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
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
import CategoryPanelsCarousel from "@site/src/components/CategoryPanelsCarousel";
import FAQSection from "@site/src/components/FAQSection";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import { faqJsonLd } from "@site/src/utils/jsonLd";
import { getSmartContractsFAQ } from "@site/src/data/smartContractsFAQ";

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({ id: "smartContracts.hero.title", message: "Smart contracts and DApps" })}
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
              "Take a buyer and a seller who do not know each other. Without a contract they either trust each other or pay an escrow agent. With a contract the payment sits in a script that releases it once the agreed condition is recorded. Neither can back out, and nobody in the middle takes a cut or changes the terms.",
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
              "When someone sends ada or tokens to a contract, the funds sit in an output, a chunk of value on the ledger, locked by the script instead of by a key. The output can carry a piece of data, the [datum](/glossary/datum), that records the state of the agreement, for example who owes what. To spend that output, a transaction presents an argument, the [redeemer](/glossary/redeemer), and the script checks whether the transaction is allowed.",
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
              "Script execution is paid for with a budget of memory and processing steps that is priced by protocol parameters, so the fee is fixed when the transaction is built, not discovered afterwards. If a script still fails on chain, which the wallet's own check makes rare, a [collateral](/glossary/collateral) of one and a half times the fee covers the network's work. Wallets typically set aside a few ada for that.",
          }),
        ]}
        headingDot={true}
      />
      <TitleWithText
        description={translate({
          id: "smartContracts.how.outro",
          message:
            "The full mechanics, from slots to ledger, are on the [how Cardano works](/how-cardano-works) page.",
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

function DappsSection() {
  return (
    <>
      <Divider
        id="dapps"
        text={translate({ id: "smartContracts.divider.dapps", message: "DApps" })}
      />
      <TitleWithText
        title={translate({ id: "smartContracts.dapps.title", message: "What is a DApp?" })}
        description={[
          translate({
            id: "smartContracts.dapps.p1",
            message:
              "A decentralized application, or DApp, is a website or app whose important actions run through smart contracts instead of a company's database. A decentralized exchange, for example, is a front end that builds swap transactions for you, plus the scripts on chain that hold the liquidity and enforce the prices.",
          }),
          translate({
            id: "smartContracts.dapps.p2",
            message:
              "You use a DApp with your own wallet. Connecting lets the app see your addresses and balance and ask you to sign transactions. It never holds your keys and it cannot move funds without a signature you give in your wallet. That connection follows a standard, [CIP-30](/glossary/cip-30), which is why one wallet works with many apps.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "smartContracts.dapps.button", message: "Browse Cardano apps" })}
        buttonLink="/apps"
      />
    </>
  );
}

function SafetySection() {
  return (
    <>
      <Divider
        id="safety"
        text={translate({ id: "smartContracts.divider.safety", message: "Safety" })}
      />
      <TitleWithText
        title={translate({ id: "smartContracts.safety.title", message: "How do I use a DApp safely?" })}
        description={[
          translate({
            id: "smartContracts.safety.p1",
            message:
              "Read what you are about to sign. Most Cardano wallets show the outputs of a transaction, that is, where ada and tokens will go, so a swap that suddenly sends your whole balance to an unknown address is visible before you confirm. There are no open-ended token approvals on Cardano: a DApp can only spend what the transaction you sign spends, and there is nothing to revoke later. What you do send to a contract stays under that contract's rules until those rules release it.",
          }),
          translate({
            id: "smartContracts.safety.p2",
            message:
              "Beyond that, the usual rules apply. Reach the app through a bookmark or the link on its official channels, not through a search ad or a message. Prefer apps whose contracts have been audited and whose code is public. Try a small amount first. And treat any request to enter your recovery phrase as an attack, no DApp needs it.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({
          id: "smartContracts.safety.button",
          message: "Common scams and how to spot them",
        })}
        buttonLink="/common-scams"
      />
    </>
  );
}

// Showcase categories whose apps run on smart contracts, in the order the
// intro paragraph names them. Same carousel as the /apps browse section.
const BUILT_CATEGORIES = ["dex", "lending", "marketplace", "game", "identity"];

function BuiltSection() {
  return (
    <>
      <Divider
        id="built"
        text={translate({ id: "smartContracts.divider.built", message: "Built on Cardano" })}
      />
      <TitleWithText
        title={translate({
          id: "smartContracts.built.title",
          message: "What runs on Cardano smart contracts today?",
        })}
        description={translate({
          id: "smartContracts.built.intro",
          message:
            "Trading, lending, stablecoins, marketplaces and games all run on contracts, and identity projects use them too. These are a few examples from the app showcase, ranked by on-chain activity where that data exists.",
        })}
        headingDot={true}
      />
      <CategoryPanelsCarousel
        categories={BUILT_CATEGORIES}
        ariaLabel={translate({ id: "smartContracts.built.title", message: "What runs on Cardano smart contracts today?" })}
      />
      <TitleWithText
        description={translate({
          id: "smartContracts.built.outro",
          message:
            "[Stablecoins](/stablecoins) have their own page, and the showcase lists more than a hundred apps across every category.",
        })}
        buttonLabel={translate({ id: "smartContracts.built.button", message: "Explore all apps" })}
        buttonLink="/apps"
      />
    </>
  );
}

function BuildSection() {
  return (
    <>
      <Divider
        id="build"
        text={translate({ id: "smartContracts.divider.build", message: "Build" })}
      />
      <TitleWithText
        title={translate({ id: "smartContracts.build.title", message: "How do I build one?" })}
        description={[
          translate({
            id: "smartContracts.build.p1",
            message:
              "The developer portal walks you from a first transaction to a deployed contract, with tutorials for Aiken and Plutus, the test networks to try things safely, and the tooling most teams use. A contract reaches the chain as part of a transaction, either attached to the transaction that uses it or stored once in an output that later transactions point to. There is no separate deployment step or registry.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "smartContracts.build.button", message: "Developer portal" })}
        buttonLink="https://developers.cardano.org"
      />
    </>
  );
}

export default function SmartContracts() {
  const faq = getSmartContractsFAQ();
  return (
    <Layout
      title={translate({
        id: "smartContracts.meta.title",
        message: "Smart Contracts on Cardano: How They Work and What They Power",
      })}
      description={translate({
        id: "smartContracts.meta.description",
        message:
          "What a smart contract is, how Cardano runs contracts as validator scripts on the eUTXO ledger, which languages developers use, what a DApp is and how to use one safely.",
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
            <DappsSection />
            <SafetySection />
            <BuiltSection />
            <BuildSection />
            <FAQSection data={faq} />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
        <BackgroundWrapper backgroundType="gradientDark">
          <BoundaryBox>
            <CtaOneColumn
              title={translate({ id: "smartContracts.cta.title", message: "Ready to test yourself? Take the technical quiz." })}
              buttonLabel={translate({ id: "smartContracts.cta.button", message: "Take the quiz" })}
              buttonLink="/quiz"
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
