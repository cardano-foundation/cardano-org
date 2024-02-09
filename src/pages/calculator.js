import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import PortalHero from "./portalhero";

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <PortalHero
        title='Staking Calculator'
        description='See how much rewards you can possibly earn by staking ada.'
        bannerType ='dots'
      />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
