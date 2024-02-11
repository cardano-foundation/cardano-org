import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from "@site/src/components/Basic/sitehero";

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title='Our Partners'
        description='A decentralized team works across many entities to 
        ensure that Cardano stays true to its purpose as we advance and evolve.'
        bannerType ='dots'
      />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
