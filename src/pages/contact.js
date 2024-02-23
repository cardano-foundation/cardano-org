import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from '@site/src/components/Layout/SiteHero';
import Heading from '@theme/Heading';

function HomepageHeader() {
  const {siteTitle} = "useDocusaurusContext()";
  return (
      <SiteHero
        title='Contact Cardano'
        description='Cardano is supported by the Cardano Foundation, IOHK, and EMURGO. Fill out the contact form below and we will put you in touch with the team best placed to assist you.'
        bannerType ='fluid'
      />
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
