import React from "react";
import { translate } from "@docusaurus/Translate";
import { FaCoins } from "react-icons/fa";
import ExplainerPage from "@site/src/components/Layout/ExplainerPage";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import CategoryPanelsCarousel from "@site/src/components/CategoryPanelsCarousel";

function WhatSection() {
  return (
    <>
      <Divider id="what" text={translate({ id: "defi.divider.what", message: "Basics" })} />
      <TitleWithText
        title={translate({ id: "defi.what.title", message: "What is DeFi?" })}
        description={[
          translate({
            id: "defi.what.p1",
            message:
              "Decentralized finance, DeFi for short, is the collection of financial services that run as smart contracts on a public blockchain: exchanges, lending markets, stablecoins, and the tools built on top of them. Instead of a company holding your money and deciding who may trade, a script holds the funds and enforces the same rules for everyone.",
          }),
          translate({
            id: "defi.what.p2",
            message:
              "You use DeFi through DApps with your own wallet. The DApp builds the transaction, you check what it does and sign it, and the contract on chain settles it. Nobody in between can reject you, delay you or take a cut beyond the fee the contract charges. On Cardano that is also why the rest of this page keeps coming back to the wallet: it is your account, your login and your signature in one.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({
          id: "defi.what.button",
          message: "How smart contracts work on Cardano",
        })}
        buttonLink="/smart-contracts"
      />
    </>
  );
}

function ComparedSection() {
  return (
    <>
      <Divider id="compared" text={translate({ id: "defi.divider.compared", message: "Compared" })} />
      <TitleWithText
        title={translate({
          id: "defi.compared.title",
          message: "How does DeFi differ from a bank or an exchange?",
        })}
        description={{
          list: [
            translate({
              id: "defi.compared.custody",
              message:
                "**Custody.** A bank holds your money in its books and owes it to you. In DeFi the funds sit in your wallet or in a contract whose rules you can read, and only your signature moves them.",
            }),
            translate({
              id: "defi.compared.access",
              message:
                "**Access.** Opening an account needs an application and an approval. Using a DeFi protocol needs a wallet and some ada, whoever and wherever you are.",
            }),
            translate({
              id: "defi.compared.hours",
              message:
                "**Hours.** Markets on chain never close. There is no cut-off time, no settlement day and no bank holiday.",
            }),
            translate({
              id: "defi.compared.transparency",
              message:
                "**Transparency.** Every rate, every reserve and every transaction is on the ledger for anyone to check, instead of in a quarterly report.",
            }),
            translate({
              id: "defi.compared.recourse",
              message:
                "**Recourse.** If a bank makes a mistake, there is a complaints process and, in many countries, deposit insurance. If you sign the wrong transaction or a contract has a bug, there is usually no one to call. That trade-off is the heart of DeFi, and the reason to understand it before using it.",
            }),
          ],
        }}
        headingDot={true}
      />
    </>
  );
}

// Showcase categories the uses section walks through in prose (swap, lend,
// bridge), same carousel pattern as /smart-contracts.
const USE_CATEGORIES = ["dex", "lending", "bridge"];

function UsesSection() {
  const usesTitle = translate({ id: "defi.uses.title", message: "What can you do with DeFi on Cardano?" });
  return (
    <>
      <Divider id="uses" text={translate({ id: "defi.divider.uses", message: "What you can do" })} />
      <TitleWithText
        title={usesTitle}
        description={translate({
          id: "defi.uses.intro",
          message:
            "The building blocks are the same as anywhere else in DeFi. What differs is how they run on Cardano, which the next section explains.",
        })}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="finance"
        title={translate({ id: "defi.uses.swap.title", message: "Swap tokens" })}
        text={[
          translate({
            id: "defi.uses.swap.text",
            message:
              "A decentralized exchange, a [DEX](/glossary/dex), lets you trade ada for other native tokens without an order book run by a company. Prices come from liquidity pools that other users fund, and the swap settles in a single transaction you sign.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="opportunity"
        title={translate({ id: "defi.uses.lend.title", message: "Lend and borrow" })}
        text={[
          translate({
            id: "defi.uses.lend.text",
            message:
              "Lending protocols let you deposit tokens to earn interest paid by borrowers, or borrow against tokens you lock as collateral. Rates move with supply and demand, and a loan that falls below its collateral requirement is liquidated by the protocol, not by a person.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="chains"
        title={translate({ id: "defi.uses.stable.title", message: "Hold stable value" })}
        text={[
          translate({
            id: "defi.uses.stable.text",
            message:
              "Stablecoins are tokens designed to track a currency such as the US dollar, backed by reserves or by locked crypto. They are the unit most DeFi trading and lending is priced in. Cardano has several, each with a different backing model.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="dots-with-line"
        title={translate({ id: "defi.uses.liquidity.title", message: "Provide liquidity" })}
        text={[
          translate({
            id: "defi.uses.liquidity.text",
            message:
              "Depositing a pair of tokens into a DEX pool earns you a share of the trading fees. In return you take on the risk that the two tokens move apart in price, which can leave you with less than if you had simply held them.",
          }),
        ]}
        headingDot={true}
      />
      <DottedImageWithText
        imageName="power-arrows"
        title={translate({ id: "defi.uses.bridge.title", message: "Move assets across chains" })}
        text={[
          translate({
            id: "defi.uses.bridge.text",
            message:
              "A [bridge](/glossary/bridge) locks a token on one chain and issues a matching one on another, so value from other networks can be used on Cardano and back. Bridges are among the most attacked pieces of DeFi anywhere, so the choice of bridge matters as much as the token.",
          }),
        ]}
        headingDot={true}
      />
      <CategoryPanelsCarousel categories={USE_CATEGORIES} ariaLabel={usesTitle} />
      <TitleWithText
        description={translate({
          id: "defi.uses.outro",
          message:
            "[Stablecoins](/stablecoins) have their own page with the backing model of each one. The showcase lists every app we track, with on-chain activity where we have it.",
        })}
        buttonLabel={translate({ id: "defi.uses.button", message: "Explore all apps" })}
        buttonLink="/apps"
      />
    </>
  );
}

export default function Defi() {
  return (
    <ExplainerPage
      title={translate({
        id: "defi.meta.title",
        message: "DeFi on Cardano: Decentralized Finance Explained",
      })}
      description={translate({
        id: "defi.meta.description",
        message:
          "What decentralized finance is, how it compares to banks and exchanges, what you can do with DeFi on Cardano, how the eUTXO ledger changes it, the risks to understand and how to start.",
      })}
      hero={{
        title: translate({ id: "defi.hero.title", message: "DeFi on Cardano" }),
        description: translate({
          id: "defi.hero.description",
          message: "Trade, lend, borrow and earn with open applications, from a wallet you control.",
        }),
        bannerType: "fluidBlue",
      }}
    >
      <HighlightCallout icon={<FaCoins />}>
        {translate({
          id: "defi.intro.callout",
          message:
            "DeFi is finance run by smart contracts instead of companies. Anyone with a wallet can use it, the rules are public, and nobody can freeze your account. It also means nobody can undo your mistakes.",
        })}
      </HighlightCallout>
      <SpacerBox size="small" />
      <WhatSection />
      <ComparedSection />
      <UsesSection />
    </ExplainerPage>
  );
}
