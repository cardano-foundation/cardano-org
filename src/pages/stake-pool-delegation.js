
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

function getDelegationFAQData() {
  return [
    {
      question: translate({id: 'delegation.faq.q1', message: 'What is a stake pool?'}),
      answer: [
        translate({id: 'delegation.faq.a1.p1', message: 'Stake pools are run by stake pool operators. These are network participants with the skills to reliably ensure consistent uptime of a node, which is essential in ensuring the success of the Ouroboros protocol and the Cardano network as a whole.'}),
        translate({id: 'delegation.faq.a1.p2', message: "The protocol uses a probabilistic mechanism to select a leader for each slot, who will be expected to create the next block in the chain. The chance of a stake pool node being selected as slot leader increases proportionately to the amount of stake delegated to that node. Each time a stake pool node is selected as a slot leader and successfully creates a block, it receives a reward, which is shared with the pool proportionate to the amount each member has delegated. Stake pool operators can deduct their running costs from the awarded ada, as well as specify a profit margin for providing the service."}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q2', message: 'Can I re-delegate my stake to another pool?'}),
      answer: [
        translate({id: 'delegation.faq.a2.p1', message: "Delegated stake can be re-delegated to another pool at any time. Re-delegated stake will remain in the current pool until the epoch after next (from the point of re-delegation), after which your delegation preferences will be updated on the chain and your stake moved to the new stake pool. Rewards are distributed from the end of each epoch, so you'll continue to receive rewards from your original stake pool for two epochs before your new delegation preferences are applied."}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q3', message: 'Can I delegate to multiple stake pools?'}),
      answer: [
        translate({id: 'delegation.faq.a3.p1', message: 'Some wallets offer different solutions for delegating to different stake pools at the same time. [Discover wallets](/what-is-ada#wallets).'}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q4', message: 'What is stake pool performance?'}),
      answer: [
        translate({id: 'delegation.faq.a4.p1', message: "The performance metric is an indicator of how well a stake pool is performing. Considering that the slot leader election process is private, it is only possible to estimate how often the stake pool should be elected based on the number of actually produced blocks. A pool can be nominated more often than expected based on its stake. For example, if a pool only produces half the number of blocks that it was nominated for, its performance rating is 50%. This could happen because the pool has a poor network connection, or has been turned off by its operator."}),
        translate({id: 'delegation.faq.a4.p2', message: "Performance ratings make more sense over a longer period of time. If a pool has not yet been selected to produce a block in the current epoch, its performance rating will be 0%, even if it is likely to produce blocks later in the epoch. Performance ratings of over 100% are possible if a pool creates more blocks than it was nominated to produce."}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q5', message: 'What is stake pool saturation?'}),
      answer: [
        translate({id: 'delegation.faq.a5.p1', message: "Saturation is a term used to indicate that a particular stake pool has more stake delegated to it than is ideal for the network, and once a pool reaches the point of saturation it will offer diminishing rewards. The saturation mechanism was designed to prevent centralization by encouraging delegators to delegate to different stake pools, and operators to set up alternative pools so that they can continue earning maximum rewards. Saturation, therefore, exists to preserve the interests of both ada holders delegating their stake and stake pool operators."}),
        translate({id: 'delegation.faq.a5.p2', message: "The goal is to avoid any single pool becoming too large – thereby disincentivizing delegation to other pools – and receiving a disproportionate amount of the rewards. The health of the network is partly determined by having a high number of active stake pools with a balanced amount of stake delegated to them. The more numerous and geographically diverse the network's pools, the better. Each stake pool's saturation percentage is shown within the Daedalus stake pool selection menu."}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q6', message: 'What is stake pool desirability?'}),
      answer: [
        translate({id: 'delegation.faq.a6.p1', message: "Desirability measures how desirable a stake pool is to an ada holder seeking to delegate their stake. It is influenced by a number of factors – including a stake pool's margin, fee, performance, the total reward available in the current epoch, and saturation percentage – and contributes to determining a stake pool's ranking."}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q7', message: 'How are stake pools ranked?'}),
      answer: [
        translate({id: 'delegation.faq.a7.p1', message: 'Stake pools are ranked mainly through a combination of their desirability and performance, in addition to other factors. It is worth mentioning here that the wallet developers make this decision for their wallet. [Discover wallets](/what-is-ada#wallets).'}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q8', message: 'How should I choose a stake pool?'}),
      answer: [
        translate({id: 'delegation.faq.a8.p1', message: 'Choosing a stake pool involves several factors to consider to ensure you make a well-informed decision. So-called [pool tools](/apps?tags=pooltool) can help you choose a stake pool. Points to consider:'}),
        translate({id: 'delegation.faq.a8.p2', message: "**Performance:** Look at the pool's historical performance, which reflects its success rate in producing blocks. A consistently high performance is a good indicator of the pool's reliability and effective operation."}),
        translate({id: 'delegation.faq.a8.p3', message: "**Uptime:** Ensure the pool has high uptime. This means the pool's servers are running without interruption, increasing the chances of being selected to produce a block."}),
        translate({id: 'delegation.faq.a8.p4', message: '**Margin Fees:** Stake pools charge a percentage fee on the rewards earned. Lower fees can mean more rewards, but consider the balance between low fees and high pool performance.'}),
        translate({id: 'delegation.faq.a8.p5', message: '**Fixed Fees:** There is often a minimum fixed fee (set by the protocol) that pools will charge. Check what fixed fee the pool charges.'}),
        translate({id: 'delegation.faq.a8.p6', message: "**Saturation Point:** A pool becomes saturated when it has more stake than an optimal amount set by the protocol. Staking with a saturated pool can decrease your rewards, so it's advisable to choose a pool below this threshold."}),
        translate({id: 'delegation.faq.a8.p7', message: '**Community Engagement:** Look for pools that actively engage with the Cardano community. This can be through educational content, community support, or contributions to the Cardano ecosystem.'}),
        translate({id: 'delegation.faq.a8.p8', message: '**Mission-Driven Pools:** Some pools donate a portion of their fees to charitable causes or are dedicated to specific missions like environmental sustainability or education. If this aligns with your values, it might influence your choice.'}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q9', message: 'How much will I earn in rewards?'}),
      answer: [
        translate({id: 'delegation.faq.a9.p1', message: "You can use the [rewards calculator](/calculator) to get an idea of how much you will earn in rewards. It's important to note that the calculator produces only reward estimates and shouldn't be considered definitive or a guarantee of reward amounts. In the future, we will likely test different parameters that may affect reward margins. Amounts calculated are therefore subject to change, but represent a realistic and sensible level of return."}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q10', message: 'What wallets are supported and where do I find them?'}),
      answer: [
        translate({id: 'delegation.faq.a10.p1', message: 'There are various wallets to choose from. Please make sure that you only download wallets from trustworthy sites. [Discover wallets](/what-is-ada#wallets).'}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q11', message: 'Can I restore an ada balance from a hardware wallet?'}),
      answer: [
        translate({id: 'delegation.faq.a11.p1', message: 'Yes. You can use Daedalus to restore an ada balance from a hardware wallet. However, we advise caution doing so. Entering your hardware wallet recovery phrase in Daedalus can expose your hardware wallet private keys to additional security risks. Recommendations to minimize security issues are available via Daedalus during the hardware wallet recovery process.'}),
      ],
    },
    {
      question: translate({id: 'delegation.faq.q12', message: 'Will the ada rewards I earn be added to my delegated stake?'}),
      answer: [
        translate({id: 'delegation.faq.a12.p1', message: 'Yes. Rewards earned accrue with your original stake. When rewards are received, the balance of your reward account increases – and, consequently, the delegated stake is increased.'}),
      ],
    },
  ];
}

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
          <FAQSection data={getDelegationFAQData()} />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
