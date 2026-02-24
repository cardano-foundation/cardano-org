import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaTwoColumn from "@site/src/components/Layout/CtaTwoColumn";
import AmbassadorProgramSection from "@site/src/components/AmbassadorProgramSection";
import AmbassadorRolesSection from "@site/src/components/AmbassadorRolesSection";
import AmbassadorOverviewSection from "@site/src/components/AmbassadorOverviewSection";
import AmbassadorBenefitsSection from "@site/src/components/AmbassadorBenefitsSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'ambassadors.hero.title', message: 'Ambassadors'})}
      description={translate({id: 'ambassadors.hero.description', message: 'The Cardano Ambassador Program celebrates community leaders driving the expansion of the Cardano ecosystem. Established in 2018 and continuously refined by the Cardano Foundation, it empowers dedicated contributors to make a global impact.'})}
      bannerType="fluidRed"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title={translate({id: 'ambassadors.layout.title', message: 'Ambassador Program | cardano.org'})}
    description={translate({id: 'ambassadors.layout.description', message: 'The Cardano Ambassador Program recognizes community leaders who educate, engage, and raise awareness to drive Cardano\'s adoption.'})}
    >
      <OpenGraphInfo pageName="ambassadors" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <AmbassadorProgramSection />
          <AmbassadorOverviewSection />
          <AmbassadorRolesSection />
          <AmbassadorBenefitsSection
              headline={translate({id: 'ambassadors.benefits.headline', message: 'Ambassador Status'})}
              title={translate({id: 'ambassadors.benefits.title', message: 'Ambassador Status'})}
              description={[
                translate({id: 'ambassadors.benefits.description', message: 'Cardano Ambassadors are instrumental in increasing global awareness and deepening understanding of our ecosystem. Benefits include:'}),
              ]}
              benefits={[
                translate({id: 'ambassadors.benefits.benefit1', message: 'Recognition and Visibility: Earn a unique badge and be featured on official Cardano social media channels, bolstering your reputation in the blockchain space.'}),

                translate({id: 'ambassadors.benefits.benefit2', message: 'Exclusive Access and Information: Ambassadors receive early or exclusive access to important news, updates, and events, including private meetings, webinars, and briefings.'}),

                translate({id: 'ambassadors.benefits.benefit3', message: 'Networking Opportunities: Being an Ambassador provides opportunities to connect with developers, entrepreneurs, and ecosystem leaders, opening doors for collaborations and partnerships within the Cardano community.'}),

                translate({id: 'ambassadors.benefits.benefit4', message: 'Community Engagement & Support: Receive promotional materials, funding opportunities, and engagement tools designed to help you drive community growth.'}),
              ]}
              quote={translate({id: 'ambassadors.benefits.quote', message: 'Elevating communities, one block at a time.'})}
          />
          </BoundaryBox>

          <BackgroundWrapper backgroundType={"gradientLight"}>
            <BoundaryBox>
            <CtaTwoColumn
              leftTitle={translate({id: 'ambassadors.cta.leftTitle', message: 'Become a Cardano Ambassador'})}
              leftText={[
                translate({id: 'ambassadors.cta.leftText1', message: 'The journey to becoming an Ambassador is built on dedication, collaboration, and meaningful contributions. Ambassadors emerge from the community by actively participating and making a lasting impact.'}),

                translate({id: 'ambassadors.cta.leftText2', message: 'Your first step begins in the Cardano Forum, a dynamic space for collaboration, discussion, and knowledge sharing. By contributing valuable insights, engaging in conversations, and supporting fellow community members, you build a strong foundation of trust and influence. As you progress through different levels, new opportunities for deeper involvement and leadership open up.'}),

                translate({id: 'ambassadors.cta.leftText3', message: 'Ambassadorship is a reflection of commitment and contribution. Those who actively support the community and help Cardano grow naturally step into this role.'})
              ]}
              leftHeadingDot={true}
              rightButtonLabel={translate({id: 'ambassadors.cta.rightButtonLabel', message: 'Get Started'})}
              rightButtonLink={"https://forum.cardano.org/t/welcome-understanding-trust-levels-on-the-cardano-forum/117680"}
              rightButtonAlign={"center"}
            />
            </BoundaryBox>
          </BackgroundWrapper>

      </main>
    </Layout>
  );
}
