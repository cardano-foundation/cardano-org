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
import { getDefiFAQ } from "@site/src/data/defiFAQ";

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
              "A decentralized exchange, a [DEX](/glossary/dex), lets you trade ada for other native tokens without an order book run by a company. On most DEXs prices come from liquidity pools that other users fund, and a swap starts with a single transaction you sign.",
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
              "Lending protocols let you deposit tokens to earn interest paid by borrowers, or borrow against tokens you lock as collateral. Rates move with supply and demand, and a loan that falls below its collateral requirement can be liquidated by anyone, under the rules the contract enforces rather than at someone's discretion.",
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
              "Stablecoins are tokens designed to track a currency such as the US dollar, backed by reserves or by locked crypto. They are the unit most DeFi trading and lending is priced in. Cardano has several, built on different backing models.",
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

function CardanoSection() {
  return (
    <>
      <Divider id="cardano" text={translate({ id: "defi.divider.cardano", message: "On Cardano" })} />
      <TitleWithText
        title={translate({
          id: "defi.cardano.title",
          message: "How is DeFi on Cardano different?",
        })}
        description={[
          translate({
            id: "defi.cardano.p1",
            message:
              "Cardano tracks value with the extended UTXO model instead of account balances, and that changes a few things a DeFi user notices. There are no token approvals: a DApp can only spend what the transaction you sign spends, so there is no standing permission to revoke and no risk of an old approval being drained later. The fee and the outcome of a transaction are fixed when it is built, so nothing about it can change after you sign: it either goes through as signed or fails.",
          }),
          translate({
            id: "defi.cardano.p2",
            message:
              "Tokens are native to the ledger, so a stablecoin or a DEX token is handled with the same rules as ada, without a wrapper contract that could fail. And ada delegated to a stake pool keeps earning rewards in your wallet, delegation never locks it, so holding ada and using DeFi are not in competition.",
          }),
          translate({
            id: "defi.cardano.p3",
            message:
              "The model also has a cost. A UTXO can be spent only once, so a pool that everyone wants to trade against cannot process every order in the same block. Cardano DEXs solve this by batching orders and settling them in rounds, or by splitting liquidity across many outputs. In practice that means a swap can take a block or two longer than you might expect, and the price you get is the price at settlement, within the limit you set.",
          }),
        ]}
        headingDot={true}
        buttonLabel={translate({ id: "defi.cardano.button", message: "The eUTXO model explained" })}
        buttonLink="/how-cardano-works#ledger"
      />
    </>
  );
}

function RisksSection() {
  return (
    <>
      <Divider id="risks" text={translate({ id: "defi.divider.risks", message: "Risks" })} />
      <TitleWithText
        title={translate({ id: "defi.risks.title", message: "What are the risks?" })}
        description={[
          translate({
            id: "defi.risks.intro",
            message:
              "DeFi removes the middleman and, with it, the safety net. These are the risks to understand before you put in more than you can afford to lose.",
          }),
          {
            list: [
              translate({
                id: "defi.risks.bugs",
                message:
                  "**Contract bugs.** A flaw in a protocol's code can lose funds for every user at once. Audits reduce the risk, they do not remove it.",
              }),
              translate({
                id: "defi.risks.price",
                message:
                  "**Price risk.** Tokens can lose most of their value quickly. Providing liquidity adds the risk of ending up with less than holding, and borrowing adds the risk of liquidation when your collateral drops.",
              }),
              translate({
                id: "defi.risks.depeg",
                message:
                  "**Depegs.** A stablecoin can trade below the currency it tracks if its reserves or its mechanism come under pressure.",
              }),
              translate({
                id: "defi.risks.oracles",
                message:
                  "**Oracles and bridges.** Protocols that rely on outside price feeds or on bridged tokens inherit the risks of those systems.",
              }),
              translate({
                id: "defi.risks.scams",
                message:
                  "**Scams.** Fake DApps, fake tokens with a real name, and links from strangers. The usual rules on [protecting your ada](/common-scams) apply twice here.",
              }),
              translate({
                id: "defi.risks.reversal",
                message: "**No reversal.** A transaction you signed is final, and there is no support line that can undo it.",
              }),
            ],
          },
          translate({
            id: "defi.risks.disclaimer",
            message:
              "This page is educational, not financial advice. Nothing here is a recommendation to use any protocol or to buy any asset.",
          }),
        ]}
        headingDot={true}
      />
    </>
  );
}

function StartSection() {
  return (
    <>
      <Divider id="start" text={translate({ id: "defi.divider.start", message: "Get started" })} />
      <TitleWithText
        title={translate({ id: "defi.start.title", message: "How do I start?" })}
        description={{
          list: [
            translate({
              id: "defi.start.wallet",
              message: "[Set up a wallet](/what-is-a-wallet) you control and back up the recovery phrase.",
            }),
            translate({
              id: "defi.start.ada",
              message:
                "[Get some ada](/where-to-get-ada). Every transaction needs a little for fees, and most DeFi is priced against ada or a stablecoin.",
            }),
            translate({
              id: "defi.start.dapp",
              message: "Pick a DApp from the [showcase](/apps), reach it through its official link, and connect your wallet.",
            }),
            translate({
              id: "defi.start.care",
              message:
                "Start with an amount you can afford to lose, read every transaction before you sign, and look for audits and open code.",
            }),
          ],
        }}
        headingDot={true}
        buttonLabel={translate({ id: "defi.start.button", message: "Learn to spot scams" })}
        buttonLink="/common-scams"
      />
    </>
  );
}

export default function Defi() {
  const faq = getDefiFAQ();
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
      faq={faq}
      cta={{
        title: translate({
          id: "defi.cta.title",
          message: "Ready to look around? Browse the DeFi apps in the showcase.",
        }),
        buttonLabel: translate({ id: "defi.cta.button", message: "Explore DeFi apps" }),
        buttonLink: "/apps?tags=dex",
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
      <CardanoSection />
      <RisksSection />
      <StartSection />
    </ExplainerPage>
  );
}
