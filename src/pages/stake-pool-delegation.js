
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import Divider from "@site/src/components/Layout/Divider";
import OneColumnBox from "@site/src/components/Layout/OneColumnBox";
import TwoColumnBox from "@site/src/components/Layout/TwoColumnBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import CtaTwoColumn from "@site/src/components/Layout/CtaTwoColumn";
import FAQSection from "@site/src/components/FAQSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title={[translate({id: 'stakePoolDelegation.hero.title', message: 'Delegate Your Stake'})]}
      description={translate({id: 'stakePoolDelegation.hero.description', message: 'To build the network, earn rewards, and become part of the Cardano journey.'})}
      bannerType="overlap"
    />
  );
}

export default function Home() {

  return (
    <Layout
      title={translate({id: 'stakePoolDelegation.meta.title', message: 'Delegate your stake | cardano.org'})}
      description={translate({id: 'stakePoolDelegation.meta.description', message: 'Delegate your stake to build the network, earn rewards, and become part of the Cardano journey.'})}
    >
      <OpenGraphInfo pageName="stake-pool-delegation" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"solidGrey"}>
          <BoundaryBox>
            <Divider text={translate({id: 'stakePoolDelegation.whatIsStake.divider', message: 'What is stake?'})} />
            <OneColumnBox
              text={[
                translate({id: 'stakePoolDelegation.whatIsStake.text1', message: 'Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to the amount of ada held. The ability to delegate or pledge a stake is fundamental to how Cardano works.'}),
                translate({id: 'stakePoolDelegation.whatIsStake.text2', message: 'There are two ways an ada holder can earn rewards: by delegating their stake to a stake pool run by someone else, or running their own stake pool. The amount of stake delegated to a given stake pool is the primary way the Ouroboros protocol chooses who should add the next block to the blockchain, and receive a monetary reward for doing so.'}),
                translate({id: 'stakePoolDelegation.whatIsStake.text3', message: 'The more stake is delegated to a stake pool (up to a certain point), the more likely it is to make the next block – and the rewards are shared between everyone who delegated their stake to that stake pool.'}),
              ]}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text={translate({id: 'stakePoolDelegation.whatIsDelegation.divider', message: 'What is stake delegation?'})} />
            <TwoColumnBox
              leftText={[
                translate({id: 'stakePoolDelegation.whatIsDelegation.text', message: 'Delegation is the process by which ada holders delegate the stake associated with their ada to a stake pool. It allows ada holders that do not have the skills or desire to run a node to participate in the network and be rewarded in proportion to the amount of stake delegated.'}),
              ]}
            />

            <Divider text={translate({id: 'stakePoolDelegation.whyIncentives.divider', message: 'Why incentives?'})} />
            <TwoColumnBox
              leftText={[
                translate({id: 'stakePoolDelegation.whyIncentives.text', message: 'Incentives are used to ensure the longevity and health of the Cardano network and ecosystem. The incentive mechanism is underpinned by scientific research that combines mathematics, economic theory, and game theory.'}),
              ]}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"solidBlue"}>
          <BoundaryBox>
            <CtaTwoColumn
              leftTitle={translate({id: 'stakePoolDelegation.walletsCta.title', message: 'Cardano Wallets'})}
              leftText={translate({id: 'stakePoolDelegation.walletsCta.text', message: 'Discover a wide variety of wallets designed to facilitate your interaction with the Cardano ecosystem.'})}
              leftHeadingDot={true}
              rightButtonLabel={translate({id: 'stakePoolDelegation.walletsCta.buttonLabel', message: 'Discover Now'})}
              rightButtonLink={"/what-is-ada#wallets"}
              rightButtonAlign={"center"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"ada"}>
          <BoundaryBox>
            <CtaOneColumn
              title={translate({id: 'stakePoolDelegation.calculatorCta.title', message: 'Try our staking calculator to see how much ada you could be rewarded for delegating to a stake pool.'})}
              buttonLabel={translate({id: 'stakePoolDelegation.calculatorCta.buttonLabel', message: 'Try Out'})}
              buttonLink={"/calculator/?calculator=delegator"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <FAQSection jsonFileName="delegationFAQ" />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
