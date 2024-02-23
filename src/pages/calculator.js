import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from "@site/src/components/Layout/SiteHero";

function HomepageHeader() {
  const {siteTitle} = "useDocusaurusContext()";
  return (
    <SiteHero
        title='Staking Calculator'
        description='See how much rewards you can possibly earn by staking ada.'
        bannerType ='dots'
      />
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader/>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
