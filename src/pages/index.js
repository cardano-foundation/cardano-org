import Layout from "@theme/Layout";
import WelcomeHero from "@site/src/components/Layout/WelcomeHero";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import HomeProofPointsSection from "@site/src/components/HomeProofPointsSection";
import HomeActivitySection from "@site/src/components/HomeActivitySection";
import AdopterLogos from "@site/src/components/AdopterLogos";
import IntentChips from "@site/src/components/showcase/IntentChips";
import HomeTracking from "@site/src/components/HomeTracking";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import FollowCardanoSection from "@site/src/components/FollowCardanoSection";
import LatestNewsSection from "@site/src/components/LatestNewsSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import {translate} from '@docusaurus/Translate';

// Entry intents surfaced on the homepage, a subset of the /apps chips.
const HOME_INTENTS = ["useWallet", "stake", "trade", "vote", "play"];

// Order: one entry decision in the hero (Get Started or an intent), then proof
// that the network is in use, then the explanation, then news. Only links
// inside a data-section wrapper are tracked (see HomeTracking).
export default function Home() {

  return (
    <Layout
      title={translate({id: 'home.meta.title', message: 'Cardano, Secure Decentralized Blockchain Platform'})}
      description={translate({id: 'home.meta.description', message: 'Cardano is a decentralized blockchain platform built through peer-reviewed research. Explore ada, staking, governance, DApps, and a global open-source community.'})}
    >
      <HomeTracking />
      <div data-section="hero">
        <WelcomeHero
          title={[
            translate({id: 'home.hero.title', message: 'Made for Trust.'}),
            translate({id: 'home.hero.title2', message: 'Reliable by Design.'}),
          ]}
          description={translate({id: 'home.hero.description', message: 'Cardano is a public blockchain bringing assurance to critical operations. Secure, sustainable, and with predictable costs to scale with confidence. Built on peer-reviewed research, ready for the needs of today and tomorrow.'})}
          showWhatIsCardano={false}
        >
          <div data-section="intents">
            <IntentChips ids={HOME_INTENTS} linkTo="/apps" headingId="home-intent-title" variant="hero" />
          </div>
        </WelcomeHero>
      </div>
      <main>
        <BoundaryBox>
          <AdopterLogos />
          <div data-section="activity">
            <HomeActivitySection />
          </div>
          <SpacerBox size="medium" />
        </BoundaryBox>

        <BoundaryBox>
          <div data-section="proof-points">
            <HomeProofPointsSection />
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
          <SpacerBox size="medium" />
        </BoundaryBox>

        <FollowCardanoSection />
      </main>
    </Layout>
  );
}
