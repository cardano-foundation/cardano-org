import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import WelcomeHero from "@site/src/components/Layout/WelcomeHero";
import Divider from "@site/src/components/Layout/Divider";
import HomeBenefitsSection from "@site/src/components/HomeBenefitsSection";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import HomeProofPointsSection from "@site/src/components/HomeProofPointsSection";
import IntentChips from "@site/src/components/showcase/IntentChips";
import HomeTracking from "@site/src/components/HomeTracking";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import FollowCardanoSection from "@site/src/components/FollowCardanoSection";
import LatestNewsSection from "@site/src/components/LatestNewsSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import {translate} from '@docusaurus/Translate';

// Entry intents surfaced on the homepage, a subset of the /apps chips.
const HOME_INTENTS = ["useWallet", "stake", "trade", "vote", "play"];

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <WelcomeHero
      title={[
        translate({id: 'home.hero.title', message: 'Made for Trust.'}),
        translate({id: 'home.hero.title2', message: 'Reliable by Design.'}),
      ]}
      description={translate({id: 'home.hero.description', message: 'Cardano is a decentralized blockchain ecosystem built on solid scientific research. It focuses on providing a secure, scalable and sustainable public digital platform for individual and enterprise projects to build real-world solutions of trust.'})}
    />
  );
}

// Section order is under test (see HomeTracking): the differentiation block
// and the entry intents sit directly below the hero, the benefits tabs follow
// the news. Only links inside a data-section wrapper are tracked.
export default function Home() {

  return (
    <Layout
      title={translate({id: 'home.meta.title', message: 'Cardano, Secure Decentralized Blockchain Platform'})}
      description={translate({id: 'home.meta.description', message: 'Cardano is a decentralized blockchain platform built through peer-reviewed research. Explore ada, staking, governance, DApps, and a global open-source community.'})}
    >
      <HomeTracking />
      <div data-section="hero">
        <HomepageHeader />
      </div>
      <main>
        <BoundaryBox>
          <HomeProofPointsSection />
          <div data-section="intents">
            <IntentChips ids={HOME_INTENTS} linkTo="/apps" headingId="home-intent-title" />
            <p className="container">
              <Link className="button button--primary button--lg" to="/apps">
                {translate({id: 'home.featured.buttonLabel', message: 'Use Cardano Apps'})}
              </Link>
            </p>
          </div>
          <SpacerBox size="medium" />
        </BoundaryBox>

        <BoundaryBox>
          <Divider text={translate({id: 'home.divider.news', message: 'News'})} />
          <TitleWithText
            title={translate({id: 'home.news.title', message: 'Latest News'})}
            description={[
              translate({id: 'home.news.description', message: 'Stay up to date with the latest developments, announcements, and community updates from the Cardano ecosystem.'}),
            ]}
            titleType="black"
            headingDot={true}
          />
          <LatestNewsSection count={6} />
        </BoundaryBox>

        <BoundaryBox>
          <HomeBenefitsSection />
          <SpacerBox size="medium" />
        </BoundaryBox>

        <FollowCardanoSection />
      </main>
    </Layout>
  );
}
