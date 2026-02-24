import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import SiteHero from "@site/src/components/Layout/SiteHero";
import SolutionsSection from "@site/src/components/SolutionsSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import Divider from "@site/src/components/Layout/Divider";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'solutions.hero.title', message: 'Enterprise Solutions'})}
      description={translate({id: 'solutions.hero.description', message: 'Proven blockchain solutions for supply chain, identity, and beyond.'})}
      bannerType="fluidBlue"
    />
  );
}

export default function Solutions() {
  return (
    <Layout
      title={translate({id: 'solutions.layout.title', message: 'Enterprise Solutions | cardano.org'})}
      description={translate({id: 'solutions.layout.description', message: 'Discover proven enterprise blockchain solutions built on Cardano. From supply chain traceability to digital product passports, explore real-world implementations.'})}
    >
      <OpenGraphInfo pageName="enterprise-solutions" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <TitleWithText
              description={[
                translate({id: 'solutions.intro.description', message: "Cardano powers enterprise solutions across industries, combining the security and transparency of blockchain with practical business applications. Our proven deployments demonstrate how organizations can leverage decentralized technology for supply chain management, product authentication, and sustainability tracking."}),
              ]}
            />

            <SolutionsSection />

            <SpacerBox size="medium" />

            <Divider text={translate({id: 'solutions.divider.explore', message: 'Explore Use Cases'})} id="explore" />
            <TitleWithText
              description={[
                translate({id: 'solutions.explore.description', message: "Looking for specific blockchain applications? Explore our comprehensive use case library covering identity, finance, supply chain, and more."}),
              ]}
            />
            <p style={{ textAlign: "center", marginBottom: "2rem" }}>
              <Link
                to="/use-cases"
                className="button button--primary button--lg"
              >
                {translate({id: 'solutions.explore.button', message: 'View All Use Cases'})}
              </Link>
            </p>
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"gradientDark"}>
          <BoundaryBox>
            <CtaOneColumn
              title={translate({id: 'solutions.cta.title', message: 'Ready to build on Cardano? Connect with the Cardano Foundation to explore partnership opportunities.'})}
              buttonLabel={translate({id: 'solutions.cta.button', message: 'Contact Us'})}
              buttonLink={"https://cardanofoundation.org/contact"}
            />

          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
