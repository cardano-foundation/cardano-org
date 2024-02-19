import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import SiteHero from "@site/src/components/SiteHero";
import Divider from '@site/src/components/Divider';
import OneColumnBox from '@site/src/components/OneColumnBox';
import TwoColumnBox from '@site/src/components/TwoColumnBox';


export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title={[
          'Designed For Mass Participation',
          <br key="line1"/>,
          'Built For Secure Decentralization',
        ]}
        description='Become a stake pool operator, earn ada, and contribute to the decentralization of the Cardano network.'
        bannerType ='zoomRedWhite'
      />
      <main>
        <Divider headline='What is staking?' />
        <TwoColumnBox
          leftText={[
            'Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to \
            the amount of ada held. The ability to delegate or pledge a stake is fundamental to how Cardano works.'
          ]}
          rightText={[
            'There are two ways an ada holder can earn rewards: by delegating their stake to a stake pool run by someone else, \
            or by running their own stake pool.',
            <br key='line1' />,
            <br key='line2' />,
            'The amount of stake delegated to a given stake pool is the primary way the Ouroboros protocol chooses who should \
            add the next block to the blockchain, and receive a monetary reward for doing so.',
            <br key='line3' />,
            <br key='line4' />,
            'The more stake is delegated to a stake pool (up to a certain point), the more likely it is to make the next block \
            – and the rewards that it earns are shared between everyone who delegated their stake to that stake pool.'
          ]}
        />

        <Divider headline='What is stake pool?' />
        <OneColumnBox
          text={[
            'Stake pools may be either public or private. A public stake pool is a Cardano network node with a public address that \
            other users can delegate to, and receive rewards. Private stake pools only deliver rewards to their owners.',
            <br key='line1' />,
            <br key='line2' />,
            'Stake pools are run by a reliable operator: an individual or business with the knowledge and resources to run the node \
            on a consistent basis. Ada holders can delegate to public stake pools if they wish to participate in the protocol and \
            receive rewards, but do not wish to operate a Cardano network node themselves.',
            <br key='line2' />,
            <br key='line3' />,
            'The more stake that is delegated to a stake pool, the greater chance it has of being selected as a slot leader. Each \
            time it is selected and produces a block that is accepted onto the blockchain, it is rewarded, and these rewards are \
            shared between the stake pool operator and stake pool delegators.',
            <br key='line4' />,
            <br key='line5' />,
            'Extensive research and development has gone into ensuring a fair, competitive marketplace that proportionately incentivizes \
            participation, and rewards the investment of time, energy, and resources. The key technical parameters influencing stake \
            pools and the rewards received are:'
          ]}
        />
      </main>
    </Layout>
  );
}
