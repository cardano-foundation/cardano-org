import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import FeaturedTitleWithText from "@site/src/components/Layout/FeaturedTitleWithText";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({
        id: "feesAndTransactions.hero.title",
        message: "Cardano Fees & Transaction Model",
      })}
      description={translate({
        id: "feesAndTransactions.hero.description",
        message:
          "How transaction fees are calculated, why they are predictable, what the minimum ada requirement means, and how Cardano's accounting model compares to account-based blockchains.",
      })}
      bannerType="fluidBlue"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({
        id: "feesAndTransactions.meta.title",
        message: "Cardano Fees & Transaction Model",
      })}
      description={translate({
        id: "feesAndTransactions.meta.description",
        message:
          "Learn how Cardano transaction fees are calculated from transaction size, how the minimum ada (min-UTxO) requirement works, and how the eUTXO model compares to account-based fee models.",
      })}
    >
      <OpenGraphInfo pageName="fees-and-transactions" />
      <HomepageHeader />

      <BackgroundWrapper backgroundType="none">
        <BoundaryBox>
          <Divider
            text={translate({
              id: "feesAndTransactions.divider.overview",
              message: "Overview",
            })}
          />
          <TitleWithText
            title={translate({
              id: "feesAndTransactions.overview.title",
              message: "What you pay for on Cardano",
            })}
            description={[
              translate({
                id: "feesAndTransactions.overview.description1",
                message:
                  "Every transaction on Cardano pays a small fee. The fee is not set by block producers in an open auction, and it does not depend on how much ada you move. Instead, it is calculated from the **size of the transaction in bytes** using public, network-wide protocol parameters.",
              }),
              translate({
                id: "feesAndTransactions.overview.description2",
                message:
                  "Because the size of a transaction is known before you submit it, the exact fee is knowable in advance. That predictability is one of Cardano's defining user-experience properties: you see the price before you sign.",
              }),
            ]}
            headingDot={true}
          />

          <FeaturedTitleWithText
            title={translate({
              id: "feesAndTransactions.how.title",
              message: "How the fee is calculated",
            })}
            description={[
              translate({
                id: "feesAndTransactions.how.description1",
                message:
                  "The minimum fee for a transaction is: **fee = a + b × size**, where *size* is the transaction's serialized size in bytes.",
              }),
              translate({
                id: "feesAndTransactions.how.description2",
                message:
                  "On mainnet, *a* (the fixed component, protocol parameter `minFeeB` / `txFeeFixed`) is **155,381 lovelace**. *b* (the per-byte component, protocol parameter `minFeeA` / `txFeePerByte`) is **44 lovelace per byte**. A simple ada transfer is typically 200–300 bytes, so the fee works out to a fraction of an ada, roughly 0.16–0.20 ada.",
              }),
              translate({
                id: "feesAndTransactions.how.description3",
                message:
                  "Both *a* and *b* are protocol parameters. They are not hardcoded constants, and they can be changed through the network's governance and parameter-update process.",
              }),
            ]}
            quote={translate({
              id: "feesAndTransactions.how.quote",
              message:
                "You pay for the space your transaction takes up on the chain, not for the value it moves.",
            })}
            buttonLabel={translate({
              id: "feesAndTransactions.how.buttonLabel",
              message: "Explore the protocol parameters (CIPs)",
            })}
            buttonLink={"https://github.com/cardano-foundation/CIPs/tree/master/CIP-0009"}
            headingDot={false}
          />

          <Divider
            text={translate({
              id: "feesAndTransactions.divider.deterministic",
              message: "Predictable by design",
            })}
          />
          <TitleWithText
            title={translate({
              id: "feesAndTransactions.deterministic.title",
              message: "Determinism: you know the price before you sign",
            })}
            description={[
              translate({
                id: "feesAndTransactions.deterministic.description1",
                message:
                  "Cardano's fee depends only on transaction size and two public parameters. The size is fixed at construction time, so the wallet can compute the exact fee and show it to you before you authorize the transaction.",
              }),
              translate({
                id: "feesAndTransactions.deterministic.description2",
                message:
                  "This contrasts with account-based models such as Ethereum, where fees are driven by computation (gas) inside the virtual machine (the on-chain execution environment) rather than by transaction size. There, the exact cost can depend on contract execution paths, so it is less directly tied to the bytes you publish.",
              }),
            ]}
            headingDot={true}
          />

          <HighlightCallout>
            <p>
              <strong>Why it matters:</strong> predictable fees mean no
              surprise overpayment, no bidding war to get included in a block,
              and a calmer user experience, especially for everyday payments.
            </p>
          </HighlightCallout>

          <SpacerBox size="small" />
        </BoundaryBox>
      </BackgroundWrapper>

      <BackgroundWrapper backgroundType="none">
        <BoundaryBox>
          <Divider
            text={translate({
              id: "feesAndTransactions.divider.minutxo",
              message: "Minimum ada (min-UTxO)",
            })}
          />
          <TitleWithText
            title={translate({
              id: "feesAndTransactions.minutxo.title",
              message: "The minimum ada requirement",
            })}
            description={[
              translate({
                id: "feesAndTransactions.minutxo.description1",
                message:
                  "Cardano uses the [UTXO model](/glossary/utxo) (extended, or [eUTXO](/glossary/eutxo)), where value lives in discrete outputs rather than in accounts with running balances. To stop the ledger from filling up with tiny dust outputs, every output must contain a minimum amount of ada.",
              }),
              translate({
                id: "feesAndTransactions.minutxo.description2",
                message:
                  "Since the Babbage era, that minimum is calculated as **(160 + serialized output size in bytes) × utxoCostPerByte**, where `utxoCostPerByte` (the `coinsPerUTxOByte` parameter) is **4,310 lovelace per byte** on mainnet. The fixed 160-byte overhead covers the transaction input and the output's entry in the UTxO set.",
              }),
              translate({
                id: "feesAndTransactions.minutxo.description3",
                message:
                  "A simple ada-only output therefore carries roughly **1 ada** as its minimum. Outputs that hold [native tokens](/glossary/native-token), a Plutus script (Cardano's smart contract language), or an inline datum (data attached directly to the output) are larger, so their minimum ada is higher. The ada is locked, not burned: it is returned in full when the output is later spent.",
              }),
            ]}
            headingDot={true}
          />

          <FeaturedTitleWithText
            title={translate({
              id: "feesAndTransactions.minutxo.calc.title",
              message: "Worked example",
            })}
            description={[
              translate({
                id: "feesAndTransactions.minutxo.calc.description1",
                message:
                  "A basic ada-only output serializes to about 67 bytes. At 4,310 lovelace per byte the locked minimum is (160 + 67) × 4,310 = 978,370 lovelace, or about **1 ada**.",
              }),
              translate({
                id: "feesAndTransactions.minutxo.calc.description2",
                message:
                  "Add a [native token](/glossary/native-token) or an inline datum (data attached directly to the output) and the serialized size grows, so the required minimum ada grows in step. This is the [UTxO cost per byte](/glossary/utxo-cost-per-byte) rule in action.",
              }),
            ]}
            quote={translate({
              id: "feesAndTransactions.minutxo.calc.quote",
              message:
                "Minimum ada is a refundable deposit that scales with how much space your output occupies.",
            })}
            headingDot={false}
          />

          <SpacerBox size="small" />
        </BoundaryBox>
      </BackgroundWrapper>

      <BackgroundWrapper backgroundType="gradientLight">
        <BoundaryBox>
          <Divider
            text={translate({
              id: "feesAndTransactions.divider.model",
              message: "UTxO vs account",
            })}
          />
          <TitleWithText
            title={translate({
              id: "feesAndTransactions.model.title",
              message: "Why the accounting model shapes fees",
            })}
            description={[
              translate({
                id: "feesAndTransactions.model.description1",
                message:
                  "In an account-based model, the chain tracks each address's balance and a transaction mutates it. Fees there are driven mainly by computation: the more work a transaction does inside the virtual machine (the on-chain execution environment), the more it costs.",
              }),
              translate({
                id: "feesAndTransactions.model.description2",
                message:
                  "In Cardano's extended UTxO model, a transaction consumes whole inputs and creates new outputs. Fees are driven by the **size** of what you publish to the chain. Scripts still have their own execution budget and cost (priced through separate protocol parameters), but the base fee reflects footprint, not the script's execution cost.",
              }),
            ]}
            headingDot={true}
          />

          <HighlightCallout>
            <p>
              <strong>Size, not steps:</strong> a large but simple transaction
              can cost more than a small transaction that runs a script, because
              the fee formula weights the bytes you add to the ledger.
            </p>
          </HighlightCallout>

          <SpacerBox size="small" />
        </BoundaryBox>
      </BackgroundWrapper>

      <BackgroundWrapper backgroundType="zoom">
        <BoundaryBox>
          <Divider
            text={translate({
              id: "feesAndTransactions.divider.markets",
              message: "Fee markets & MEV",
            })}
          />
          <TitleWithText
            title={translate({
              id: "feesAndTransactions.markets.title",
              message: "Fee markets and maximal extractable value",
            })}
            description={[
              translate({
                id: "feesAndTransactions.markets.description1",
                message:
                  "Unlike account-based chains with open gas bidding, Cardano has no general fee market where users outbid each other to be included. The per-byte fee plus the configurable minimum is the price; there is no auction for block space in the usual sense.",
              }),
              translate({
                id: "feesAndTransactions.markets.description2",
                message:
                  "Some [maximal extractable value (MEV)](/glossary/mev) still exists. Stake pools order the transactions in the blocks they produce, and arbitrage or liquidation opportunities can be captured by reordering or inserting transactions. The eUTXO concurrency model and more deterministic ordering keep this more limited than on account-based chains, but it is not zero.",
              }),
            ]}
            headingDot={true}
          />

          <SpacerBox size="small" />

          <FeaturedTitleWithText
            title={translate({
              id: "feesAndTransactions.cta.title",
              message: "Practical guidance: what to expect",
            })}
            description={[
              translate({
                id: "feesAndTransactions.cta.text",
                message:
                  "For a typical ada transfer, expect to pay a tiny, predictable fee, a fraction of an ada (around 0.16–0.20 ada at current mainnet parameters), plus the refundable minimum-ada deposit on any new output. Your wallet shows the exact fee before you sign.",
              }),
            ]}
            buttonLabel={translate({
              id: "feesAndTransactions.cta.buttonLabel",
              message: "Explore the UTXO model",
            })}
            buttonLink={"/glossary/utxo"}
            headingDot={false}
          />
          <SpacerBox size="small" />
        </BoundaryBox>
      </BackgroundWrapper>
    </Layout>
  );
}
