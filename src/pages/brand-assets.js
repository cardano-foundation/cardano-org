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
        title='Brand Assets'
        description='Our brand is a reflection of everything that we create. Here are 
        some of the things that make up our brand and how you can use them.'
        bannerType ='overlap'
      />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
