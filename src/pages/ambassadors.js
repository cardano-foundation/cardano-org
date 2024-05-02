import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaTwoColumn from "@site/src/components/Layout/CtaTwoColumn";
import AmbassadorProgramSection from "@site/src/components/AmbassadorProgramSection";
import AmbassadorRolesSection from "@site/src/components/AmbassadorRolesSection";
import AmbassadorOverviewSection from "@site/src/components/AmbassadorOverviewSection";
import AmbassadorBenefitsSection from "@site/src/components/AmbassadorBenefitsSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Ambassadors"
      description="The Cardano Foundation established its Ambassador Program in 2018. The program 
      is designed to promote awareness and educate the wider community to drive 
      the adoption of Cardano for better use cases."
      bannerType="starburst"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Ambassador Program | cardano.org"
    description="The Ambassador Program is designed to promote awareness and educate the wider community to drive the adoption of Cardano for better use cases."
    >
      <OpenGraphImage pageName="ambassadors" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <AmbassadorProgramSection />
          <AmbassadorOverviewSection />
          <AmbassadorRolesSection />
          <AmbassadorBenefitsSection
              headline="Ambassador Status"
              title="Ambassador Status"
              description={[
                "Ambassadors are vital in increasing Cardano’s awareness; to explain what the project is all about \
                to a worldwide audience and provide insights into specific aspects of Cardano.",
              ]}
              benefits={[
                "Recognition and Visibility: Ambassadors are recognized within the community for their contributions, \
                which can enhance their reputation and visibility in the cryptocurrency and blockchain space.",

                "Exclusive Access and Information: Ambassadors may receive early or exclusive access to news, updates, \
                and events. This can include private meetings, webinars, or briefings.",

                "Networking Opportunities: Being an ambassador can provide opportunities to network with other members of \
                the Cardano community, including developers, entrepreneurs, and enthusiasts. This can lead to collaborations \
                and partnerships.",

                "Educational Resources: Ambassadors may get early access to educational materials and resources to help them \
                better understand and explain the technology or upcoming updates.",

                "Support and Resources: Ambassadors may receive support from the Cardano Foundation, IOG and EMURGO in terms of promotional \
                materials, information, and ways of funding for community events or initiatives.",
              ]}
              quote="Elevating communities, one block at a time."
          />
          </BoundaryBox>

          <BackgroundWrapper backgroundType={"solidBlue"}>
            <BoundaryBox>
            <CtaTwoColumn
              leftTitle="Become a Cardano Ambassador"
              leftText={["Embark on your journey to becoming a Cardano Ambassador by diving into the Cardano Forum! It's \
              not just about holding a title; it's about action, involvement, and dedication. Start by engaging with \
              fellow enthusiasts, sharing insights, and contributing to discussions. As you climb through different \
              trust levels, you unlock new realms of interaction and collaboration.",
              
              "Each post, each interaction, and each contribution acts as a stepping stone towards ambassadorship. Remember, true ambassadors \
              are already making waves before the title comes their way. So, let your actions speak, become an integral part \
              of our community, and you might just find the title of Cardano Ambassador waiting for you."
              ]}
              leftHeadingDot={true}
              rightButtonLabel={"Get Started"}
              rightButtonLink={"https://forum.cardano.org/t/welcome-understanding-trust-levels-on-the-cardano-forum/117680"}
              rightButtonAlign={"center"}
            />
            </BoundaryBox>
          </BackgroundWrapper>
        
      </main>
    </Layout>
  );
}
