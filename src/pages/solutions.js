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

function HomepageHeader() {
  return (
    <SiteHero
      title="Enterprise Solutions"
      description="Proven blockchain solutions for supply chain, identity, and beyond."
      bannerType="fluidBlue"
    />
  );
}

export default function Solutions() {
  return (
    <Layout
      title="Enterprise Solutions | cardano.org"
      description="Discover proven enterprise blockchain solutions built on Cardano. From supply chain traceability to digital product passports, explore real-world implementations."
    >
      <OpenGraphInfo pageName="enterprise-solutions" />
      <HomepageHeader />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <TitleWithText
              description={[
                "Cardano powers enterprise solutions across industries, combining the security and transparency of blockchain with practical business applications. Our proven deployments demonstrate how organizations can leverage decentralized technology for supply chain management, product authentication, and sustainability tracking.",
              ]}
            />

            <SolutionsSection />

            <SpacerBox size="medium" />

            <Divider text="Explore Use Cases" id="explore" />
            <TitleWithText
              description={[
                "Looking for specific blockchain applications? Explore our comprehensive use case library covering identity, finance, supply chain, and more.",
              ]}
            />
            <p style={{ textAlign: "center", marginBottom: "2rem" }}>
              <Link
                to="/use-cases"
                className="button button--primary button--lg"
              >
                View All Use Cases
              </Link>
            </p>
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"gradientDark"}>
          <BoundaryBox>
            <CtaOneColumn
              title="Ready to build on Cardano? Connect with the Cardano Foundation to explore partnership opportunities."
              buttonLabel={"Contact Us"}
              buttonLink={"https://cardanofoundation.org/contact"}
            />
            
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
