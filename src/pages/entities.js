import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import CompaniesShowcase from "@site/src/components/CompaniesShowcase";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
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
      title={translate({id: 'entities.meta.title', message: 'Organizations Building on Cardano'})}
      description={translate({id: 'entities.meta.description', message: 'Numerous independent entities, including companies actively building on Cardano, collaborate to advance the platform and ensure it remains aligned with its mission.'})}
    >
      <OpenGraphInfo pageName="entities" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <Divider text={translate({id: 'entities.entitiesSection.divider', message: 'Entities building on Cardano'})} id="entities" />
          <span id="companies" />
          <TitleWithText
            description={translate({id: 'entities.companiesSection.description', message: 'There is a growing number of entities that build on Cardano. Below are a few of them:'})}
            titleType="none"
            headingDot={false}
          />
          <CompaniesShowcase />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
