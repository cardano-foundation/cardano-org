import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import EnterpriseSection from "@site/src/components/EnterpriseSection";


function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Enterprise"
      description="A developing platform, Cardano is being built to 
      accommodate a broad range of use cases, solving problems across multiple 
      industry verticals."
      bannerType="fluid"
    />
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <EnterpriseSection />
      </main>
    </Layout>
  );
}
