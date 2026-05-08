import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Translate, { translate } from "@docusaurus/Translate";

import SiteHero from "@site/src/components/Layout/SiteHero";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

import StablecoinGrid from "@site/src/components/StablecoinCard/StablecoinGrid";
import BridgeGrid from "@site/src/components/BridgeCard/BridgeGrid";

import StablecoinsHeroActions from "@site/src/components/Stablecoins/HeroActions";
import StablecoinsStatsBar from "@site/src/components/Stablecoins/StatsBar";
import GetStablecoinsSteps from "@site/src/components/Stablecoins/GetStablecoinsSteps";
import WhyCardanoGrid from "@site/src/components/Stablecoins/WhyCardanoGrid";
import ThreeTypesGrid from "@site/src/components/Stablecoins/ThreeTypesGrid";
import PullQuote from "@site/src/components/Stablecoins/PullQuote";
import LogoStack from "@site/src/components/Stablecoins/LogoStack";
import useStablecoinLiveData from "@site/src/components/Stablecoins/useStablecoinLiveData";

import pageStyles from "./stablecoins.module.css";

function StablecoinsHero({ liveData }) {
  return (
    <SiteHero
      bannerType="fluidBlue"
      title={translate({
        id: "stablecoins.hero.title",
        message: "Stablecoins on Cardano",
      })}
      description={translate({
        id: "stablecoins.hero.subtitle",
        message:
          "The dollar-pegged assets you need. All built on the most secure, predictable foundations in crypto.",
      })}
    >
      <StablecoinsHeroActions />
      <StablecoinsStatsBar liveData={liveData} />
    </SiteHero>
  );
}

export default function Stablecoins() {
  const liveData = useStablecoinLiveData();

  return (
    <Layout
      title={translate({
        id: "stablecoins.layout.title",
        message: "Stablecoins on Cardano",
      })}
      description={translate({
        id: "stablecoins.layout.description",
        message:
          "Discover the stablecoins available on Cardano — fiat-backed, overcollateralised, and synthetic. Learn how they work, where to get them, and why Cardano's predictable, low-fee foundation makes a difference.",
      })}
    >
      <OpenGraphInfo pageName="stablecoins" />
      <StablecoinsHero liveData={liveData} />
      <main>
        {/* Section 2: Ecosystem (anchored as #ecosystem for hero CTA) */}
        <BackgroundWrapper backgroundType="zoomBlueRight">
          <BoundaryBox>
            <div id="ecosystem" />
            <SpacerBox size="medium" />
            <div className={clsx("row", pageStyles.twoColIntro)}>
              <div className="col col--6">
                <h1 className="headingDot">
                  {translate({
                    id: "stablecoins.ecosystem.title",
                    message: "The Cardano Stablecoin Ecosystem",
                  })}
                </h1>
                <p className={pageStyles.lead}>
                  {translate({
                    id: "stablecoins.ecosystem.subtitle",
                    message: "Five stablecoins. One ecosystem. Choose yours.",
                  })}
                </p>
              </div>
              <div className={clsx("col col--6", pageStyles.twoColIntroRight)}>
                <p>
                  {translate({
                    id: "stablecoins.ecosystem.intro",
                    message:
                      "Whether you're looking for the trusted name of Circle, the transparency of on-chain reserves, or the clear decentralization of a formally verified algorithm, you'll find a stablecoin on Cardano built for your preferences and needs.",
                  })}
                </p>
              </div>
            </div>
            <StablecoinGrid liveData={liveData} />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Section 3: Bridges (cardano-blue gradient, centered text) */}
        <BackgroundWrapper backgroundType="gradientDark">
          <BoundaryBox>
            <div className={pageStyles.bridgesGrid}>
              <div className={pageStyles.centeredHeader}>
                <h1 className="white-text">
                  {translate({
                    id: "stablecoins.bridges.title",
                    message: "Stablecoins With Bridges to Cardano",
                  })}
                </h1>
                <p className={clsx("white-text", pageStyles.lead)}>
                  {translate({
                    id: "stablecoins.bridges.subtitle",
                    message:
                      "Five extra stablecoins. The same ecosystem. Even more options.",
                  })}
                </p>
                <p className="white-text">
                  {translate({
                    id: "stablecoins.bridges.intro",
                    message:
                      "The future is interoperable, and so are stablecoins. From PayPal to Moneta, several services allow you to access Cardano's advantages.",
                  })}
                </p>
              </div>
              <BridgeGrid />
            </div>
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Section 4: Get Started */}
        <BackgroundWrapper>
          <BoundaryBox>
            <div id="get-started" />
            <SpacerBox size="medium" />
            <div className={pageStyles.getStartedHeader}>
              <TitleWithText
                title={translate({
                  id: "stablecoins.getStarted.title",
                  message: "How to Get Stablecoins on Cardano",
                })}
                description={[
                  translate({
                    id: "stablecoins.getStarted.subtitle",
                    message: "Ready to start? You only need four simple steps.",
                  }),
                ]}
                headingDot={false}
              />
            </div>
            <GetStablecoinsSteps />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Section 5: Explainer */}
        <BoundaryBox>
          <div id="explainer" />
          <SpacerBox size="medium" />
          <div className={clsx("row", pageStyles.twoColExplainer)}>
            <div className="col col--7">
              <h1 className="headingDot">
                {translate({
                  id: "stablecoins.explainer.title",
                  message: "Understand Stablecoins",
                })}
              </h1>
              <p>
                {translate({
                  id: "stablecoins.explainer.intro1",
                  message:
                    "Cardano supports five active stablecoins issued natively on the chain — USDCx, USDM, USDA, DJED, and iUSD — alongside several more that reach Cardano via bridges from other ecosystems.",
                })}
              </p>
              <p>
                {translate({
                  id: "stablecoins.explainer.intro2",
                  message:
                    "Unlike most blockchains, Cardano stablecoins are native tokens, not smart contracts. They get treated as first-class citizens, similar to Cardano’s very own native asset, ada. This means lower fees, no hidden risk, and transfers that work as you expect, every time.",
                })}
              </p>
              <h2 className={pageStyles.subhead}>
                {translate({
                  id: "stablecoins.explainer.whatIs.title",
                  message: "What is a Stablecoin?",
                })}
              </h2>
              <p className={pageStyles.eyebrow}>
                {translate({
                  id: "stablecoins.explainer.whatIs.eyebrow",
                  message: "New to stablecoins? Start here.",
                })}
              </p>
              <p>
                {translate({
                  id: "stablecoins.explainer.whatIs.body1",
                  message:
                    "A stablecoin is a type of cryptocurrency designed to hold a steady value and typically pegged 1:1 to the US dollar. Whereas Bitcoin, Ether, or ada can rise and fall with the market, a stablecoin is engineered to stay put.",
                })}
              </p>
              <p>
                {translate({
                  id: "stablecoins.explainer.whatIs.body2",
                  message:
                    "That stability makes them useful in ways that other assets can’t match. For example, when sending money across borders, the receiver doesn’t get less than the original amount sent. Stablecoins also provide some protection from market volatility and quick price drops. This means DeFi users can lend, earn yield, and provide liquidity while limiting their exposure to price swings.",
                })}
              </p>
              <p>
                {translate({
                  id: "stablecoins.explainer.whatIs.body3",
                  message:
                    "Think of a stablecoin as digital cash: spendable, moveable, and programmable, but without the volatility.",
                })}
              </p>
            </div>
            <div className={clsx("col col--5", pageStyles.explainerImageCol)}>
              <LogoStack />
            </div>
          </div>
        </BoundaryBox>

        <BoundaryBox>
          <div className={pageStyles.pullQuoteBox}>
            <PullQuote
              text={translate({
                id: "stablecoins.explainer.pullQuote",
                message:
                  "A stablecoin lets you move the value of a dollar at the speed of the internet, without asking permission from a bank, and without the fees banks usually charge.",
              })}
            />
          </div>
        </BoundaryBox>

        <BackgroundWrapper backgroundType="zoomBlueCenter">
          <BoundaryBox>
            <SpacerBox size="medium" />
            <h2 className={pageStyles.threeTypesTitle}>
              {translate({
                id: "stablecoins.explainer.threeTypes.title",
                message: "The three types of stablecoins",
              })}
            </h2>
            <ThreeTypesGrid />
            <SpacerBox size="medium" />
            <div className={pageStyles.bridgesQBox}>
              <h2 className={pageStyles.bridgesQTitle}>
                {translate({
                  id: "stablecoins.explainer.bridgesQ.title",
                  message: "What are stablecoin bridges?",
                })}
              </h2>
              <p className={pageStyles.bridgesQBody}>
                {translate({
                  id: "stablecoins.explainer.bridgesQ.body",
                  message:
                    "Stablecoin bridges give you the possibility of moving your assets across chains, without losing value, and without complication. One authoritative entity oversees the stablecoin's minting process, everything else flows naturally.",
                })}
              </p>
            </div>
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Section 6: Why Cardano */}
        <BackgroundWrapper>
          <BoundaryBox>
            <div className={pageStyles.whyCardano}>
              <div id="why-cardano" />
              <SpacerBox size="medium" />
              <TitleWithText
                title={translate({
                  id: "stablecoins.whyCardano.title",
                  message:
                    "Why Cardano is a Perfect Fit for Stablecoins and Finance",
                })}
                description={[
                  translate({
                    id: "stablecoins.whyCardano.subtitle",
                    message:
                      "Because how financial assets move matters as much as what they’re worth.",
                  }),
                  translate({
                    id: "stablecoins.whyCardano.intro",
                    message:
                      "Cardano's built for resilience, freedom, and simplicity. From liquid staking to interoperability and no slashing because of validator errors, Cardano makes a difference where it matters most.",
                  }),
                ]}
                headingDot={false}
              />
              <WhyCardanoGrid />
            </div>
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <div className={pageStyles.dataAttribution}>
            <p>
              <Translate
                id="stablecoins.attribution.market"
                values={{
                  coingecko: (
                    <a
                      href="https://www.coingecko.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CoinGecko
                    </a>
                  ),
                }}
              >
                {"Market data powered by {coingecko}."}
              </Translate>
            </p>
            <p className={pageStyles.dataAttributionFresh}>
              {translate({
                id: "stablecoins.attribution.freshness",
                message:
                  "Values update automatically and may lag exchange tickers by a few minutes.",
              })}
            </p>
          </div>
        </BoundaryBox>
      </main>
    </Layout>
  );
}
