import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import CommunityDigestForm from "@site/src/components/CommunityDigestFormHS";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import FollowCardanoSection from "@site/src/components/FollowCardanoSection";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'newsletter.hero.title', message: 'Stay Informed'})}
      description={translate({id: 'newsletter.hero.description', message: 'Get access to the latest Cardano news and content, and the hottest topics happening around the Cardano ecosystem.'})}
      bannerType="overlap"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title={translate({id: 'newsletter.layout.title', message: 'Cardano Community Digest | cardano.org'})}
    description={translate({id: 'newsletter.layout.description', message: 'Get access to the latest Cardano news and content, and the hottest topics happening around the Cardano ecosystem.'})}
    >
      <OpenGraphInfo pageName="newsletter" />
      <HomepageHeader />
      <BoundaryBox>
          <Divider text={translate({id: 'newsletter.divider.text', message: 'Stay informed'})} />
          <TitleWithText
              title={translate({id: 'newsletter.content.title', message: 'Cardano Community Digest'})}
              description={[
                translate({id: 'newsletter.content.description', message: 'Get your bi-weekly dose of the latest hot topics, development updates, a list of upcoming meetups, delegation strategy updates, what our Cardano Ambassadors are up to, and much more.'})
              ]}
              headingDot={true}
          />
          <CommunityDigestForm />
        </BoundaryBox>
        <SpacerBox size="medium" />

        <FollowCardanoSection />
    </Layout>
  );
}
