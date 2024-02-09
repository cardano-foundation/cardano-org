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
        title='Cardano'
        description='Making the world work better for all.'
        bannerType ='default'
      />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
