import Layout from "@theme/Layout";
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import FeaturedTitleWithText from "@site/src/components/Layout/FeaturedTitleWithText";
import Divider from "@site/src/components/Layout/Divider";
import QuoteBox from "@site/src/components/Layout/QuoteBox";
import HomeBenefitsSection from "@site/src/components/HomeBenefitsSection";
import VisionBox from "@site/src/components/Layout/VisionBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import HomeDiscoverSection from "@site/src/components/HomeDiscoverSection";
import Logos from "@site/src/components/Layout/Logos";
import FollowCardanoSection from "@site/src/components/FollowCardanoSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function HomepageHeader() {
  const title = "Making the world Work Better For All";
  const description = "Cardano is a blockchain platform for changemakers, innovators, and visionaries, with the tools and technologies required to create possibility for the many, as well as the few, and bring about positive global change.";

  return (
    <div className="heroSectionWithAnimation">
      <div className="animationCanvasContainer">
        <BrowserOnly fallback={null}>
          {() => {
            const loadedModule = require('@newfound8ion/cardano-org-header');
            let ComponentToRender = null;

            if (loadedModule) {
              if (typeof loadedModule.default === 'function') {
                ComponentToRender = loadedModule.default;
              } else if (typeof loadedModule.CardanoOrgHeader === 'function') {
                ComponentToRender = loadedModule.CardanoOrgHeader;
              } else if (typeof loadedModule === 'function') {
                ComponentToRender = loadedModule;
              } else if (loadedModule && typeof loadedModule === 'object' && Object.keys(loadedModule).length > 0) {
                const potentialComponent = Object.values(loadedModule).find(
                  val => typeof val === 'function'
                );
                if (potentialComponent) {
                  ComponentToRender = potentialComponent;
                }
              }
            }

            if (!ComponentToRender) {
              console.error("CardanoOrgHeader Komponente konnte nicht geladen werden.");
              return <div>Animations-Komponente nicht gefunden.</div>;
            }
            return <ComponentToRender />;
          }}
        </BrowserOnly>
      </div>

      <div className="textContentOverlay">
        <h1 className="heroTitle">{title}</h1>
        <p className="heroDescription">{description}</p>
                <div className="heroButtons">
          <Link
            className="button button--custom-white button--lg"
            to="/where-to-get-ada">
            Where to get ada?
          </Link>
          <Link
            className="button button--custom-white button--lg"
            to="/developers">
            Start building
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout
      title="Home | cardano.org"
      description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <FeaturedTitleWithText
              title="Our World Is Changing. Together, We Can Change It For The Better."
              description={[
                "Cardano is a proof-of-stake blockchain platform: the first to be founded on [peer-reviewed research](/research) \
                and developed through evidence-based methods. It combines pioneering technologies \
                to provide unparalleled security and sustainability to decentralized applications, systems, \
                and societies.",

                "With a leading team of engineers, Cardano exists to redistribute power from unaccountable \
                structures to the margins – to individuals – and be an enabling force for positive change and progress.",
              ]}
              quote={[
                "A History Of Impossible,",
                <br key="line1" />, /* FIXME: too hacky */
                "Made Possible",
              ]}
              buttonLabel="Use Cases"
              buttonLink="/use-cases"
              headingDot={true}
            />

            <Divider text="Benefits" />
            <QuoteBox
              description="Cardano restores trust to global systems – creating, through science, a more secure, transparent, and sustainable foundation for individuals to transact and exchange, systems to govern, and enterprises to grow."
              quote="Cardano brings a new standard in technology – open and inclusive – to challenge the old and activate a new age of sustainable, globally-distributed innovation."
            />
            <HomeBenefitsSection />
          </BoundaryBox>
        </BackgroundWrapper>

       
          <VisionBox
            title={[
              "Define Your Possible.",
              "Change Your World.",
            ]}
          />

        <BoundaryBox>
          <Divider text="Make the Change" />
          <TitleWithText
            title="Discover Cardano"
            description={[
              "Cardano is the first blockchain platform to be built through [peer-reviewed research](/research), \
            to be secure enough to protect the data of billions, scalable enough to accommodate global systems, \
            and robust enough to support foundational change.",
            ]}
            titleType="black"
            headingDot={true}
          />

          <HomeDiscoverSection />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"solidGrey"}>
          <BoundaryBox>
            <Divider text="Entities" />
            <TitleWithText
              description="Multiple independent entities collaborate within a decentralized team framework to drive Cardano forward, ensuring that it remains aligned with its core mission as it progresses and develops. These are a few of them:"
              titleType="none"
              headingDot={false}
            />
            <Logos jsonFileName="logosEntities" /> 
          </BoundaryBox>
        </BackgroundWrapper>

        <FollowCardanoSection />
      </main>
    </Layout>
  );
}
