import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import SiteHero from "@site/src/components/SiteHero";
import Divider from '@site/src/components/Divider';
import OneColumnBox from '@site/src/components/OneColumnBox';
import TwoColumnBox from '@site/src/components/TwoColumnBox';
import BackgroundWrapper from '../components/BackgroundWrapper';
import CtaOneColumn from '../components/CtaOneColumn';
import CtaTwoColumn from '../components/CtaTwoColumn';

 

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title={[
          'Delegate Your Stake',
        ]}
        description='To build the network, earn rewards, and become part of the Cardano journey.'
        bannerType ='overlap'
      />
      <main>
        <BackgroundWrapper backgroundType={'solidGrey'}>
          <Divider headline='What is stake?' />
          <OneColumnBox
            text={[
              'Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to \
              the amount of ada held. The ability to delegate or pledge a stake is fundamental to how Cardano works.',
              <br key='line1' />,
              <br key='line2' />,
              'There are two ways an ada holder can earn rewards: by delegating their stake to a stake pool run by someone else, \
              or running their own stake pool. The amount of stake delegated to a given stake pool is the primary way the Ouroboros \
              protocol chooses who should add the next block to the blockchain, and receive a monetary reward for doing so.',
              <br key='line3' />,
              <br key='line4' />,
              'The more stake is delegated to a stake pool (up to a certain point), the more likely it is to make the next block – \
              and the rewards are shared between everyone who delegated their stake to that stake pool.'
            ]}
          />
        </BackgroundWrapper>
      
        <BackgroundWrapper backgroundType={'zoom'}>  
          <Divider headline='What is stake delegation?' />
          <TwoColumnBox
            leftText={[
              'Delegation is the process by which ada holders delegate the stake associated with their ada to a stake pool. It \
              allows ada holders that do not have the skills or desire to run a node to participate in the network and be rewarded \
              in proportion to the amount of stake delegated.',
            ]}
          />

        <Divider headline='Why incentives?' />
          <TwoColumnBox
            leftText={[
              'Incentives are used to ensure the longevity and health of the Cardano network and ecosystem. The incentive mechanism \
              is underpinned by scientific research that combines mathematics, economic theory, and game theory.',
            ]}

          />
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={'solidBlue'}>
            <CtaTwoColumn 
                title='Cardano Wallets'
                text='Discover a wide variety of wallets designed to facilitate your interaction with the Cardano ecosystem.'
                buttonLabel={'Discover Now'}
                buttonLink={'/what-is-ada#wallets'}
            />
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={'ada'}>
            <CtaOneColumn 
                title='Try our staking calculator to see how much ada you could be rewarded for delegating to a stake pool.'
                buttonLabel={'Try Out'}
                buttonLink={'/calculator/?calculator=delegator'}
            />
        </BackgroundWrapper>

      </main>
    </Layout>
  );
}
