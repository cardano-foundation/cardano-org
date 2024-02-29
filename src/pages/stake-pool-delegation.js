import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import Divider from "@site/src/components/Layout/Divider";
import OneColumnBox from "@site/src/components/Layout/OneColumnBox";
import TwoColumnBox from "@site/src/components/Layout/TwoColumnBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import CtaTwoColumn from "@site/src/components/Layout/CtaTwoColumn";
import FAQDelegationSection from "@site/src/components/FAQDelegationSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title={["Delegate Your Stake"]}
      description="To build the network, earn rewards, and become part of the Cardano journey."
      bannerType="overlap"
    />
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"solidGrey"}>
          <BoundaryBox>
            <Divider text="What is stake?" />
            <OneColumnBox
              text={[
                "Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to \
                the amount of ada held. The ability to delegate or pledge a stake is fundamental to how Cardano works.",

                "There are two ways an ada holder can earn rewards: by delegating their stake to a stake pool run by someone else, \
                or running their own stake pool. The amount of stake delegated to a given stake pool is the primary way the Ouroboros \
                protocol chooses who should add the next block to the blockchain, and receive a monetary reward for doing so.",

                "The more stake is delegated to a stake pool (up to a certain point), the more likely it is to make the next block – \
                and the rewards are shared between everyone who delegated their stake to that stake pool.",
              ]}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text="What is stake delegation?" />
            <TwoColumnBox
              leftText={[
                "Delegation is the process by which ada holders delegate the stake associated with their ada to a stake pool. It \
                allows ada holders that do not have the skills or desire to run a node to participate in the network and be rewarded \
                in proportion to the amount of stake delegated.",
              ]}
            />

            <Divider text="Why incentives?" />
            <TwoColumnBox
              leftText={[
                "Incentives are used to ensure the longevity and health of the Cardano network and ecosystem. The incentive mechanism \
                is underpinned by scientific research that combines mathematics, economic theory, and game theory.",
              ]}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"solidBlue"}>
          <BoundaryBox>
            <CtaTwoColumn
              leftTitle="Cardano Wallets"
              leftText="Discover a wide variety of wallets designed to facilitate your interaction with the Cardano ecosystem."
              leftHeadingDot={true}
              rightButtonLabel={"Discover Now"}
              rightButtonLink={"/what-is-ada#wallets"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"ada"}>
          <BoundaryBox>
            <CtaOneColumn
              title="Try our staking calculator to see how much ada you could be rewarded for delegating to a stake pool."
              buttonLabel={"Try Out"}
              buttonLink={"/calculator/?calculator=delegator"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <FAQDelegationSection />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
