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
        title='Learn'
        description='Empowering the digital architects of the future.'
        bannerType ='default'
      />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
