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
        title='Enterprise'
        description='A developing platform, Cardano is being built to 
        accommodate a broad range of use cases, solving problems across multiple 
        industry verticals.'
        bannerType ='fluid'
      />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
