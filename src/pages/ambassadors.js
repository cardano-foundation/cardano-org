import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import AmbassadorProgramSection from "@site/src/components/AmbassadorProgramSection";
import AmbassadorRolesSection from "@site/src/components/AmbassadorRolesSection";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Ambassadors"
      description="The Cardano Foundation established its Ambassador Program in 2018. The program 
      is designed to promote awareness and educate the wider community to drive 
      the adoption of Cardano for better use cases."
      bannerType="starburst"
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
        <AmbassadorProgramSection />
        <AmbassadorRolesSection />
      </main>
    </Layout>
  );
}
