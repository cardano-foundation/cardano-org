import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from '@site/src/components/SiteHero';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import DiscoverItem from '../components/DiscoverItem';

 

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title='Discover Cardano'
        description='Cardano is the nexus of five principles: People, purpose, technology, research, 
        and opportunity. Explore and learn this new constellation of knowledge.'
        bannerType ='starburst'
      />
      <main>
         <DiscoverItem
          imageName={'people'}
          title={'People'}
          subtitle={'Working together, we achieve more for the many.'}
          text={[
            'Cardano is built by a decentralized community of scientists, engineers, and thought leaders united in a common \
          purpose: to create a technology platform that will ignite the positive change the world needs. We believe the future \
          should not be defined by the past, and that more is possible - and, through technology, can be made possible for all. \
          We measure the worth of a task not by its challenge, but by its results.',
          <br key='line1'/>,
          <br key='line2'/>,
          'Every ada holder also holds a stake in the Cardano network. Ada stored in a wallet can be delegated to a stake pool \
          to earn rewards – to participate in the successful running of the network – or pledged to a stake pool to increase the \
          pool’s likelihood of receiving rewards. In time, ada will also be usable for a variety of applications and services on \
          the Cardano platform.'
          ]}
         />
      </main>
    </Layout>
  );
}
