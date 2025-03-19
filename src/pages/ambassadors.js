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
      description="The Cardano Ambassador Program celebrates community leaders driving the expansion of the Cardano ecosystem. Established in 2018 and continuously refined by the Cardano Foundation, it empowers dedicated contributors to make a global impact."
      bannerType="fluidRed"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Ambassador Program | cardano.org"
    description="The Cardano Ambassador Program recognizes community leaders who educate, engage, and raise awareness to drive Cardano’s adoption."
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
                "Cardano Ambassadors are instrumental in increasing global awareness and deepening understanding of our ecosystem. Benefits include:",
              ]}
              benefits={[
                "Recognition and Visibility: Earn a unique badge and be featured on official Cardano social media channels, bolstering your reputation in the blockchain space.",

                "Exclusive Access and Information: Ambassadors receive early or exclusive access to important news, updates, and events, including private meetings, webinars, and briefings.",

                "Networking Opportunities: Being an Ambassador provides opportunities to connect with developers, entrepreneurs, and ecosystem leaders, opening doors for collaborations and partnerships within the Cardano community.",

                "Community Engagement & Support: Receive promotional materials, funding opportunities, and engagement tools designed to help you drive community growth.",
              ]}
              quote="Elevating communities, one block at a time."
          />
          </BoundaryBox>

          <BackgroundWrapper backgroundType={"gradientLight"}>
            <BoundaryBox>
            <CtaTwoColumn
              leftTitle="Become a Cardano Ambassador"
              leftText={["The journey to becoming an Ambassador is built on dedication, collaboration, and meaningful contributions. Ambassadors emerge from the community by actively participating and making a lasting impact.",
              
              "Your first step begins in the Cardano Forum, a dynamic space for collaboration, discussion, and knowledge sharing. By contributing valuable insights, engaging in conversations, and supporting fellow community members, you build a strong foundation of trust and influence. As you progress through different levels, new opportunities for deeper involvement and leadership open up.",
              
              "Ambassadorship is a reflection of commitment and contribution. Those who actively support the community and help Cardano grow naturally step into this role."
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
