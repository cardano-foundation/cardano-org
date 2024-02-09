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
        title='What is ada?'
        description='A new type of currency. A new means of transaction. Direct. Secure. From Anywhere. For Everyone.'
        bannerType ='ada'
      />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
