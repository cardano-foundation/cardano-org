import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import Divider from "@site/src/components/Layout/Divider";
import OneColumnBox from "@site/src/components/Layout/OneColumnBox";
import TwoColumnBox from "@site/src/components/Layout/TwoColumnBox";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import CtaTwoColumn from "@site/src/components/Layout/CtaTwoColumn";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import FAQSection from "@site/src/components/FAQSection";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title={[
        translate({id: 'stakePoolOperation.hero.title1', message: 'Designed For Mass Participation'}),
        <br key="line1" />, /*FIXME: too hacky */
        translate({id: 'stakePoolOperation.hero.title2', message: 'Built For Secure Decentralization'}),
      ]}
      description={translate({id: 'stakePoolOperation.hero.description', message: 'Become a stake pool operator, earn ada, and contribute to the decentralization of the Cardano network.'})}
      bannerType="zoomRedWhite"
    />
  );
}

export default function Home() {

  return (
    <Layout
      title={translate({id: 'stakePoolOperation.meta.title', message: 'Operate a stake pool | cardano.org'})}
      description={translate({id: 'stakePoolOperation.meta.description', message: 'Become a stake pool operator, earn ada, and contribute to the decentralization of the Cardano network.'})}
    >
      <OpenGraphInfo pageName="stake-pool-operation" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"solidGrey"}>
          <BoundaryBox>
            <Divider text={translate({id: 'stakePoolOperation.whatIsStaking.divider', message: 'What is staking?'})} />
            <TwoColumnBox
              leftText={[
                translate({id: 'stakePoolOperation.whatIsStaking.leftText', message: 'Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to the amount of ada held. The ability to delegate or pledge a stake is fundamental to how Cardano works.'}),
              ]}
              rightText={[
                translate({id: 'stakePoolOperation.whatIsStaking.rightText1', message: 'There are two ways an ada holder can earn rewards: by delegating their stake to a stake pool run by someone else, or by running their own stake pool.'}),
                translate({id: 'stakePoolOperation.whatIsStaking.rightText2', message: 'The amount of stake delegated to a given stake pool is the primary way the Ouroboros protocol chooses who should add the next block to the blockchain, and receive a monetary reward for doing so.'}),
                translate({id: 'stakePoolOperation.whatIsStaking.rightText3', message: 'The more stake is delegated to a stake pool (up to a certain point), the more likely it is to make the next block – and the rewards that it earns are shared between everyone who delegated their stake to that stake pool.'}),
              ]}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text={translate({id: 'stakePoolOperation.whatIsStakePool.divider', message: 'What is stake pool?'})} />
            <OneColumnBox
              text={[
                translate({id: 'stakePoolOperation.whatIsStakePool.text1', message: 'Stake pools may be either public or private. A public stake pool is a Cardano network node with a public address that other users can delegate to, and receive rewards. Private stake pools only deliver rewards to their owners.'}),
                translate({id: 'stakePoolOperation.whatIsStakePool.text2', message: 'Stake pools are run by a reliable operator: an individual or business with the knowledge and resources to run the node on a consistent basis. Ada holders can delegate to public stake pools if they wish to participate in the protocol and receive rewards, but do not wish to operate a Cardano network node themselves.'}),
                translate({id: 'stakePoolOperation.whatIsStakePool.text3', message: 'The more stake that is delegated to a stake pool, the greater chance it has of being selected as a slot leader. Each time it is selected and produces a block that is accepted onto the blockchain, it is rewarded, and these rewards are shared between the stake pool operator and stake pool delegators.'}),
                translate({id: 'stakePoolOperation.whatIsStakePool.text4', message: 'Extensive research and development has gone into ensuring a fair, competitive marketplace that proportionately incentivizes participation, and rewards the investment of time, energy, and resources. The key technical parameters influencing stake pools and the rewards received are:'}),
              ]}
            />
            <DottedImageWithText
              imageName="pledging"
              title={translate({id: 'stakePoolOperation.pledging.title', message: 'Pledging Mechanism'})}
              text={[
                translate({id: 'stakePoolOperation.pledging.text', message: 'While there is no required minimum pledge amount, pool operators can optionally pledge some or all of their stake to their pool to make their pool more attractive. The higher the amount of ada pledged, the more rewards the pool will receive, which will attract more delegation. The a0 protocol parameter defines the influence of the pledge on the pool reward.'}),
              ]}
            />
            <DottedImageWithText
              imageName="desireability"
              title={translate({id: 'stakePoolOperation.desirability.title', message: 'Desirability Index'})}
              text={[
                translate({id: 'stakePoolOperation.desirability.text', message: "The desirability of a pool is calculated by taking the pledged owner's stake, costs, and margin, and combining them with an influence from saturation and pool performance. This number will be used to rank pools in wallets, and indicates how 'desirable' or 'attractive' the pool is to potential delegators."}),
              ]}
            />
            <DottedImageWithText
              imageName="saturation"
              title={translate({id: 'stakePoolOperation.saturation.title', message: 'Saturation Parameter (K)'})}
              text={[
                translate({id: 'stakePoolOperation.saturation.text', message: 'Saturation is a term used to indicate that a particular stake pool has more stake delegated to it than is ideal for the network, while k is the targeted number of desired pools. Once a pool reaches the point of saturation, it will offer diminishing rewards. The saturation mechanism was designed to prevent centralization by encouraging delegators to delegate to different stake pools, and to incentivize operators to set up alternative pools so that they can continue earning maximum rewards. Saturation, therefore, exists to preserve the interests of both ada holders delegating their stake and stake pool operators, and to prevent any single pool from becoming too large.'}),
              ]}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"solidBlue"}>
          <BoundaryBox>
            <CtaTwoColumn
              leftTitle={translate({id: 'stakePoolOperation.setupCta.title', message: 'How do I set up a stake pool?'})}
              leftText={[
                translate({id: 'stakePoolOperation.setupCta.text1', message: "It's important to remember the role of a stake pool operator: to ensure reliable, 24/7 operation of a network node. As a stake pool operator, you have a responsibility to the ada holders who delegate to you but also to the health of the network itself. This requires a stable and reliable network infrastructure and, ideally, system operation and server administration skills along with experience in development and operations."}),
                translate({id: 'stakePoolOperation.setupCta.text2', message: 'Anybody can learn how to operate a stake pool, but a degree of technical familiarity and knowledge is required.'}),
              ]}
              leftHeadingDot={true}
              rightButtonLabel={translate({id: 'stakePoolOperation.setupCta.buttonLabel', message: 'Learn how'})}
              rightButtonLink={"https://developers.cardano.org/docs/operate-a-stake-pool/"}
              rightButtonAlign={"center"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"ada"}>
          <BoundaryBox>
            <CtaOneColumn
              title={translate({id: 'stakePoolOperation.calculatorCta.title', message: 'Try our staking calculator to see how much ada you could receive by running a stake pool.'})}
              buttonLabel={translate({id: 'stakePoolOperation.calculatorCta.buttonLabel', message: 'Try Out'})}
              buttonLink={"/calculator/?calculator=operator"}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <FAQSection jsonFileName="operationFAQ" />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
