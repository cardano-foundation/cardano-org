import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from '@site/src/components/SiteHero';

import Heading from '@theme/Heading';
import styles from './index.module.css';

 

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
         
      </main>
    </Layout>
  );
}
