import React from "react";
import Link from "@docusaurus/Link";
import {
  FaServer,
  FaProjectDiagram,
  FaDatabase,
  FaBookOpen,
  FaUserPlus,
  FaSatelliteDish,
  FaLayerGroup,
  FaPaperPlane,
  FaCoins,
  FaMoneyBillWave,
  FaUserShield,
  FaBroadcastTower,
} from "react-icons/fa";
import { translate } from "@docusaurus/Translate";

import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import RoleCard from "@site/src/components/Layout/RoleCard";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import CtaTwoColumn from "@site/src/components/Layout/CtaTwoColumn";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";

const CARD_COL_STYLE = { marginBottom: "1.5rem", display: "flex" };

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({
        id: "exchanges.hero.heading",
        message: "Integrate Cardano",
      })}
      description={translate({
        id: "exchanges.hero.tagline",
        message:
          "A starting point for exchanges, custodians, and listing platforms adding support for ada and native assets.",
      })}
      bannerType="fluidBlue"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({
        id: "exchanges.meta.title",
        message: "Integrate Cardano, a guide for exchanges and custodians",
      })}
      description={translate({
        id: "exchanges.meta.description",
        message:
          "Integrate ada and native assets into your exchange, custodial wallet, or payment platform. A non-technical introduction linking to the full developer documentation.",
      })}
    >
      <OpenGraphInfo pageName="integrate-cardano" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <SpacerBox size="small" />
          <TitleWithText
            titleType="black"
            headingDot={true}
            description={[
              translate({
                id: "exchanges.intro.p1",
                message:
                  "Integrating Cardano means accepting ada deposits, processing withdrawals, and monitoring the chain for customer activity. Cardano also supports [native tokens](https://developers.cardano.org/docs/build/integrate/exchange-integrations/#native-assets) directly at the ledger level, so an integration covers both ada and a wide range of other assets.",
              }),
            ]}
          />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider
              text={translate({
                id: "exchanges.movingParts.divider",
                message: "The moving parts",
              })}
              id="moving-parts"
            />
            <SpacerBox size="small" />
            <div className="row">
              <div className="col col--6" style={CARD_COL_STYLE}>
                <RoleCard
                  accent="blue"
                  icon={<FaServer />}
                  title={translate({
                    id: "exchanges.components.node.title",
                    message: "cardano-node",
                  })}
                >
                  {translate({
                    id: "exchanges.components.node.text",
                    message:
                      "The underlying Cardano node that participates in the network. Every integration runs on top of it, directly or through a managed provider.",
                  })}
                </RoleCard>
              </div>
              <div className="col col--6" style={CARD_COL_STYLE}>
                <RoleCard
                  accent="violet"
                  icon={<FaProjectDiagram />}
                  title={translate({
                    id: "exchanges.components.rosetta.title",
                    message: "cardano-rosetta-java",
                  })}
                >
                  {translate({
                    id: "exchanges.components.rosetta.text",
                    message:
                      "The Cardano Foundation's recommended path for exchanges. A standardized Mesh API that bundles the node, submit API, and indexer in one package. cardano-wallet is an alternative for smaller operators but is currently in maintenance-only mode.",
                  })}
                </RoleCard>
              </div>
              <div className="col col--6" style={CARD_COL_STYLE}>
                <RoleCard
                  accent="teal"
                  icon={<FaDatabase />}
                  title={translate({
                    id: "exchanges.components.dbgraphql.title",
                    message: "cardano-db-sync and cardano-graphql",
                  })}
                >
                  {translate({
                    id: "exchanges.components.dbgraphql.text",
                    message:
                      "Queryable blockchain data for balances, transaction history, and confirmations. Useful for dashboards, monitoring, and back-office reporting.",
                  })}
                </RoleCard>
              </div>
              <div className="col col--6" style={CARD_COL_STYLE}>
                <RoleCard
                  accent="blue"
                  icon={<FaBookOpen />}
                  title={translate({
                    id: "exchanges.components.registry.title",
                    message: "Cardano Token Registry",
                  })}
                >
                  {translate({
                    id: "exchanges.components.registry.text",
                    message:
                      "Off-chain metadata for native assets, including ticker, decimals, and logo. Needed for accurate display and correct fractional accounting.",
                  })}
                </RoleCard>
              </div>
            </div>
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <SpacerBox size="small" />
          <TitleWithText
            title={translate({
              id: "exchanges.flow.title",
              message: "How the flow looks",
            })}
            titleType="black"
            headingDot={true}
            description={[
              translate({
                id: "exchanges.flow.description",
                message:
                  "A typical exchange keeps individual deposit addresses per customer and consolidates funds into a centralized withdrawal wallet. Four phases summarize the lifecycle.",
              }),
            ]}
          />
          <SpacerBox size="small" />
          <div className="row">
            <div className="col col--6" style={CARD_COL_STYLE}>
              <RoleCard
                accent="blue"
                icon={<FaUserPlus />}
                title={translate({
                  id: "exchanges.flow.step1.title",
                  message: "1. Generate deposit addresses",
                })}
              >
                {translate({
                  id: "exchanges.flow.step1.text",
                  message:
                    "One address per customer, created from the exchange's own keys, so every incoming transaction maps to a single account.",
                })}
              </RoleCard>
            </div>
            <div className="col col--6" style={CARD_COL_STYLE}>
              <RoleCard
                accent="violet"
                icon={<FaSatelliteDish />}
                title={translate({
                  id: "exchanges.flow.step2.title",
                  message: "2. Monitor the chain",
                })}
              >
                {translate({
                  id: "exchanges.flow.step2.text",
                  message:
                    "Watch for incoming transactions to those addresses, wait for the expected confirmation depth, and credit customer balances.",
                })}
              </RoleCard>
            </div>
            <div className="col col--6" style={CARD_COL_STYLE}>
              <RoleCard
                accent="teal"
                icon={<FaLayerGroup />}
                title={translate({
                  id: "exchanges.flow.step3.title",
                  message: "3. Consolidate funds",
                })}
              >
                {translate({
                  id: "exchanges.flow.step3.text",
                  message:
                    "Periodically move deposits into a centralized withdrawal wallet, so outgoing traffic can be served from a single, well-controlled location.",
                })}
              </RoleCard>
            </div>
            <div className="col col--6" style={CARD_COL_STYLE}>
              <RoleCard
                accent="blue"
                icon={<FaPaperPlane />}
                title={translate({
                  id: "exchanges.flow.step4.title",
                  message: "4. Process withdrawals",
                })}
              >
                {translate({
                  id: "exchanges.flow.step4.text",
                  message:
                    "Build, sign, and submit outgoing transactions on customer request. Signing stays offline when using cardano-rosetta-java together with a dedicated signing library.",
                })}
              </RoleCard>
            </div>
          </div>
          <p className="black-text" style={{ textAlign: "center" }}>
            <Link to="https://developers.cardano.org/docs/build/integrate/exchange-integrations/#wallet-management">
              {translate({
                id: "exchanges.flow.learnMore",
                message: "Read the wallet management workflow in detail →",
              })}
            </Link>
          </p>
          <SpacerBox size="small" />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <SpacerBox size="small" />
            <HighlightCallout icon={<FaCoins style={{ color: "#ffffff" }} />}>
              <span style={{ color: "#ffffff" }}>
                {translate({
                  id: "exchanges.nativeAssets.text",
                  message:
                    "Cardano supports native tokens directly at the ledger level, with no smart contract required. Deposit addresses can receive ada and tokens in the same transaction, so an integration should be ready to recognize and credit both. ",
                })}
                <Link
                  to="https://developers.cardano.org/docs/build/integrate/exchange-integrations/#native-assets"
                  style={{ color: "#ffffff", textDecoration: "underline" }}
                >
                  {translate({
                    id: "exchanges.nativeAssets.linkLabel",
                    message: "Learn how to handle native assets →",
                  })}
                </Link>
              </span>
            </HighlightCallout>
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <CtaTwoColumn
              leftTitle={translate({
                id: "exchanges.learnMore.leftTitle",
                message: "Exchange integration guide",
              })}
              leftText={translate({
                id: "exchanges.learnMore.leftText",
                message:
                  "Step-by-step guidance for custodians and listing platforms. Covers the accounting model, transaction handling, native assets, and upgrade practices.",
              })}
              leftButtonLabel={translate({
                id: "exchanges.learnMore.leftButtonLabel",
                message: "Read the full guide",
              })}
              leftButtonLink={
                "https://developers.cardano.org/docs/build/integrate/exchange-integrations/"
              }
              leftHeadingDot={false}
              rightTitle={translate({
                id: "exchanges.learnMore.rightTitle",
                message: "Integration components overview",
              })}
              rightText={translate({
                id: "exchanges.learnMore.rightText",
                message:
                  "A shorter reference listing the components used to integrate Cardano into websites, services, and back-office systems.",
              })}
              rightButtonLabel={translate({
                id: "exchanges.learnMore.rightButtonLabel",
                message: "Browse the components",
              })}
              rightButtonLink={
                "https://developers.cardano.org/docs/build/integrate/overview/"
              }
              rightHeadingDot={false}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <SpacerBox size="small" />
          <TitleWithText
            title={translate({
              id: "exchanges.exploreMore.title",
              message: "Explore more integrations",
            })}
            titleType="black"
            headingDot={true}
            description={[
              translate({
                id: "exchanges.exploreMore.description",
                message:
                  "Exchange integration is one of several paths. The developer portal also covers adjacent use cases that often come up alongside custody.",
              }),
            ]}
          />
          <SpacerBox size="small" />
          <div className="row">
            <div className="col col--4" style={CARD_COL_STYLE}>
              <RoleCard
                accent="violet"
                icon={<FaMoneyBillWave />}
                title={translate({
                  id: "exchanges.exploreMore.payments.title",
                  message: "Payments",
                })}
                href="https://developers.cardano.org/docs/build/integrate/overview/"
              >
                {translate({
                  id: "exchanges.exploreMore.payments.text",
                  message:
                    "Accepting ada and tokens at the point of sale, in-app, or through a merchant gateway.",
                })}
              </RoleCard>
            </div>
            <div className="col col--4" style={CARD_COL_STYLE}>
              <RoleCard
                accent="violet"
                icon={<FaUserShield />}
                title={translate({
                  id: "exchanges.exploreMore.auth.title",
                  message: "Wallet authentication",
                })}
                href="https://developers.cardano.org/docs/build/integrate/overview/"
              >
                {translate({
                  id: "exchanges.exploreMore.auth.text",
                  message:
                    "Using a Cardano wallet to sign in to applications without storing passwords.",
                })}
              </RoleCard>
            </div>
            <div className="col col--4" style={CARD_COL_STYLE}>
              <RoleCard
                accent="violet"
                icon={<FaBroadcastTower />}
                title={translate({
                  id: "exchanges.exploreMore.oracles.title",
                  message: "Oracles",
                })}
                href="https://developers.cardano.org/docs/build/integrate/overview/"
              >
                {translate({
                  id: "exchanges.exploreMore.oracles.text",
                  message:
                    "Bringing off-chain data, such as prices and events, on-chain for smart contracts to consume.",
                })}
              </RoleCard>
            </div>
          </div>
          <SpacerBox size="small" />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <CtaOneColumn
              title={translate({
                id: "exchanges.support.title",
                message:
                  "Talk to the Cardano Foundation's Core Integrations team",
              })}
              text={translate({
                id: "exchanges.support.text",
                message:
                  "Reach out for tailored support, real-time updates, and integration queries.",
              })}
              buttonLabel={translate({
                id: "exchanges.support.buttonLabel",
                message: "Contact the Core Integrations team",
              })}
              buttonLink={"mailto:integrations@cardanofoundation.org"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
