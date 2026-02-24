import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import PartnersOverviewSection from "@site/src/components/PartnersOverviewSection";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import Logos from "@site/src/components/Layout/Logos";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import Link from "@docusaurus/Link";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title={translate({id: 'entities.hero.title', message: 'Entities building on Cardano'})}
      description={translate({id: 'entities.hero.description', message: 'Numerous independent entities, including companies actively building on Cardano, collaborate to advance the platform and ensure it remains aligned with its mission.'})}
      bannerType="zoomBlueRed"
    />
  );
}

export default function Home() {

  return (
    <Layout
      title={translate({id: 'entities.meta.title', message: 'Entities building on Cardano | cardano.org'})}
      description={translate({id: 'entities.meta.description', message: 'Numerous independent entities, including companies actively building on Cardano, collaborate to advance the platform and ensure it remains aligned with its mission.'})}
    >
      <OpenGraphInfo pageName="entities" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <Divider text={translate({id: 'entities.entitiesSection.divider', message: 'Entities advancing Cardano'})} id="entities" />
          <PartnersOverviewSection />
        </BoundaryBox>
        <SpacerBox size="medium" />
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text={translate({id: 'entities.companiesSection.divider', message: 'Companies, associations, and collaborations building on Cardano'})} id="companies" />
            <TitleWithText
              description={translate({id: 'entities.companiesSection.description', message: 'There is a growing number of entities that build on Cardano. Below are a few of them:'})}
              titleType="none"
              headingDot={false}
            />
            <Logos jsonFileName="logosCompanies" />
            <div className="centered-link">
              <Link to="/docs/get-involved/add-company">{translate({id: 'entities.companiesSection.addCompanyLink', message: 'add your company'})}</Link>
            </div>
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
