import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import ResearchSection from "@site/src/components/ResearchSection";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
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
      title={translate({id: 'research.meta.title', message: 'Cardano Research, Peer-Reviewed Blockchain Science'})}
      description={translate({id: 'research.meta.description', message: 'Explore the peer-reviewed papers and formal specifications behind the Cardano blockchain, spanning cryptography, consensus, smart contracts, and governance.'})}
    >
      <OpenGraphInfo pageName="research" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            <TitleWithText
              description={translate({id: 'research.intro.description', message: "Cardano's design rests on peer-reviewed research, from the [Ouroboros](/ouroboros) family of [proof-of-stake](/glossary/proof-of-stake) protocols to the on-chain [governance](/governance) model. The papers and specifications below are grouped by development era. For a plain-language account of what they add up to, read [how Cardano works](/how-cardano-works)."})}
            />
            <ResearchSection />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
