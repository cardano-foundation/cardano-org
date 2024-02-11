import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

 
 

function HomepageHeader() {
  const {siteTitle} = "useDocusaurusContext()";
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Stay Informed
        </Heading>
        <p className="hero__subtitle">Get access to the latest Cardano news and content, 
        and the hottest topics happening around the Cardano ecosystem.</p>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        
            
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
