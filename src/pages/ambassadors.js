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
        title='Ambassadors'
        description='The Cardano Foundation established its Ambassador Program in 2018. The program 
        is designed to promote awareness and educate the wider community to drive 
        the adoption of Cardano for better use cases.'
        bannerType ='fluid'
      />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
