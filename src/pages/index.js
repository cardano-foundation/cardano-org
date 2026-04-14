import Layout from "@theme/Layout";
import WelcomeHero from "@site/src/components/Layout/WelcomeHero";
import FeaturedTitleWithText from "@site/src/components/Layout/FeaturedTitleWithText";
import Divider from "@site/src/components/Layout/Divider";
import QuoteBox from "@site/src/components/Layout/QuoteBox";
import HomeBenefitsSection from "@site/src/components/HomeBenefitsSection";
import VisionBox from "@site/src/components/Layout/VisionBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import HomeDiscoverSection from "@site/src/components/HomeDiscoverSection";
import FollowCardanoSection from "@site/src/components/FollowCardanoSection";
import LatestNewsSection from "@site/src/components/LatestNewsSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <WelcomeHero
      title={[translate({id: 'home.hero.title', message: 'Making the World Work Better for All'})]}
      description={translate({id: 'home.hero.description', message: 'Cardano is a blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility for the many, as well as the few, and bring about positive global change.'})}
    />
  );
}

export default function Home() {

  return (
    <Layout
      title={translate({id: 'home.meta.title', message: 'Cardano, Secure Decentralized Blockchain Platform'})}
      description={translate({id: 'home.meta.description', message: 'Cardano is a decentralized blockchain platform built through peer-reviewed research. Explore ada, staking, governance, DApps, and a global open-source community.'})}
    >
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <FeaturedTitleWithText
              title={translate({id: 'home.featured.title', message: 'Our World Is Changing. Together, We Can Change It For The Better.'})}
              description={[
                translate({id: 'home.featured.description1', message: 'Cardano is a proof-of-stake blockchain platform: the first to be founded on [peer-reviewed research](/research) and developed through evidence-based methods. It combines pioneering technologies to provide unparalleled security and sustainability to decentralized applications, systems, and societies.'}),
                translate({id: 'home.featured.description2', message: 'With a leading team of engineers, Cardano exists to redistribute power from unaccountable structures to the margins – to individuals – and be an enabling force for positive change and progress.'}),
              ]}
              quote={[
                translate({id: 'home.featured.quote1', message: 'A History Of Impossible,'}),
                <br key="line1" />,
                translate({id: 'home.featured.quote2', message: 'Made Possible'}),
              ]}
              buttonLabel={translate({id: 'home.featured.buttonLabel', message: 'Use Cardano Apps'})}
              buttonLink="/apps"
              headingDot={true}
            />

            <Divider text={translate({id: 'home.divider.benefits', message: 'Benefits'})} />
            <QuoteBox
              description={translate({id: 'home.quoteBox.description', message: 'Cardano restores trust to global systems – creating, through science, a more secure, transparent, and sustainable foundation for individuals to transact and exchange, systems to govern, and enterprises to grow.'})}
              quote={translate({id: 'home.quoteBox.quote', message: 'Cardano brings a new standard in technology – open and inclusive – to challenge the old and activate a new age of sustainable, globally-distributed innovation.'})}
            />
            <HomeBenefitsSection />
          </BoundaryBox>
        </BackgroundWrapper>


          <VisionBox
            title={[
              translate({id: 'home.vision.title1', message: 'Define Your Possible.'}),
              translate({id: 'home.vision.title2', message: 'Change Your World.'}),
            ]}
          />

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
          <Divider text={translate({id: 'home.divider.makeTheChange', message: 'Make the Change'})} />
          <TitleWithText
            title={translate({id: 'home.discover.title', message: 'Discover Cardano'})}
            description={[
              translate({id: 'home.discover.description', message: 'Cardano is the first blockchain platform to be built through [peer-reviewed research](/research), to be secure enough to protect the data of billions, scalable enough to accommodate global systems, and robust enough to support foundational change.'}),
            ]}
            titleType="black"
            headingDot={true}
          />

          <HomeDiscoverSection />
        </BoundaryBox>


        <FollowCardanoSection />
      </main>
    </Layout>
  );
}
