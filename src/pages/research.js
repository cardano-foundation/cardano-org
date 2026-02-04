import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import ResearchSection from "@site/src/components/ResearchSection";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title={translate({id: 'research.hero.title', message: 'Research'})}
      description={translate({id: 'research.hero.description', message: 'Cardano relevant research papers and specifications.'})}
      bannerType="starburst"
    />
  );
}

export default function Home() {

  return (
    <Layout
      title={translate({id: 'research.meta.title', message: 'Cardano Research | cardano.org'})}
      description={translate({id: 'research.meta.description', message: 'Cardano relevant research papers and specifications.'})}
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
