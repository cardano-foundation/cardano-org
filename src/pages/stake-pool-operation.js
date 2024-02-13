import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from "@site/src/components/SiteHero";

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
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
