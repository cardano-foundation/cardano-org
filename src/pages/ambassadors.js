import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
 
import SiteHero from "@site/src/components/SiteHero";

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title='Ambassadors'
        description='The Cardano Foundation established its Ambassador Program in 2018. The program 
        is designed to promote awareness and educate the wider community to drive 
        the adoption of Cardano for better use cases.'
        bannerType ='fluid'
      />
      <main>
         FIXME: Ambassador page
      </main>
    </Layout>
  );
}
