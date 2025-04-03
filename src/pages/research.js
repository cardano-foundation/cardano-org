import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import ResearchSection from "@site/src/components/ResearchSection";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Research"
      description="Cardano relevant research papers and specifications."
      bannerType="starburst"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Cardano Research | cardano.org"
    description="Cardano relevant research papers and specifications."
    >
      <OpenGraphInfo pageName="research" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <ResearchSection />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
