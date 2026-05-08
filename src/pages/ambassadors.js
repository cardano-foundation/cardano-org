import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";

import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import CtaTwoColumn from "@site/src/components/Layout/CtaTwoColumn";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import AmbassadorBenefitsSection from "@site/src/components/AmbassadorBenefitsSection";

import AmbassadorsHero from "@site/src/components/Ambassadors/AmbassadorsHero";
import AmbassadorsProgramIntro from "@site/src/components/Ambassadors/AmbassadorsProgramIntro";
import AmbassadorsImpactOverview from "@site/src/components/Ambassadors/AmbassadorsImpactOverview";
import AmbassadorsContributions from "@site/src/components/Ambassadors/AmbassadorsContributions";
import AmbassadorsMilestones from "@site/src/components/Ambassadors/AmbassadorsMilestones";
import AmbassadorsDirectory from "@site/src/components/Ambassadors/AmbassadorsDirectory";
import AmbassadorsImpactStories from "@site/src/components/Ambassadors/AmbassadorsImpactStories";

export default function AmbassadorsPage() {
  return (
    <Layout
      title={translate({
        id: "ambassadors.layout.title",
        message: "Cardano Ambassador Program, Join the Community",
      })}
      description={translate({
        id: "ambassadors.layout.description",
        message:
          "The Cardano Ambassador Program recognizes community leaders who educate, engage, and raise awareness to drive Cardano's adoption.",
      })}
    >
      <OpenGraphInfo pageName="ambassadors" />
      <AmbassadorsHero />

      <main>
        <BoundaryBox>
          <AmbassadorsProgramIntro />
          <AmbassadorsImpactOverview />
          <AmbassadorsContributions />
          <AmbassadorsMilestones />
          <AmbassadorsDirectory />
          <AmbassadorsImpactStories />
          <AmbassadorBenefitsSection
            headline={translate({ id: "ambassadors.benefits.headline", message: "Ambassador Status" })}
            title={translate({ id: "ambassadors.benefits.title", message: "Ambassador Status" })}
            description={[
              translate({
                id: "ambassadors.benefits.description",
                message:
                  "Cardano Ambassadors are instrumental in increasing global awareness and deepening understanding of our ecosystem. Benefits include:",
              }),
            ]}
            benefits={[
              translate({
                id: "ambassadors.benefits.benefit1",
                message:
                  "Recognition and Visibility: Earn a unique badge and be featured on official Cardano social media channels, bolstering your reputation in the blockchain space.",
              }),
              translate({
                id: "ambassadors.benefits.benefit2",
                message:
                  "Exclusive Access and Information: Ambassadors receive early or exclusive access to important news, updates, and events, including private meetings, webinars, and briefings.",
              }),
              translate({
                id: "ambassadors.benefits.benefit3",
                message:
                  "Networking Opportunities: Being an Ambassador provides opportunities to connect with developers, entrepreneurs, and ecosystem leaders, opening doors for collaborations and partnerships within the Cardano community.",
              }),
              translate({
                id: "ambassadors.benefits.benefit4",
                message:
                  "Community Engagement & Support: Receive promotional materials, funding opportunities, and engagement tools designed to help you drive community growth.",
              }),
            ]}
            quote={translate({
              id: "ambassadors.benefits.quote",
              message: "Elevating communities, one block at a time.",
            })}
          />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <CtaTwoColumn
              leftTitle={translate({
                id: "ambassadors.cta.leftTitle",
                message: "Become a Cardano Ambassador",
              })}
              leftText={[
                translate({
                  id: "ambassadors.cta.leftText1",
                  message:
                    "The journey to becoming an Ambassador is built on dedication, collaboration, and meaningful contributions. Ambassadors emerge from the community by actively participating and making a lasting impact.",
                }),
                translate({
                  id: "ambassadors.cta.leftText2",
                  message:
                    "Your first step begins in the Cardano Forum, a dynamic space for collaboration, discussion, and knowledge sharing. By contributing valuable insights, engaging in conversations, and supporting fellow community members, you build a strong foundation of trust and influence. As you progress through different levels, new opportunities for deeper involvement and leadership open up.",
                }),
                translate({
                  id: "ambassadors.cta.leftText3",
                  message:
                    "Ambassadorship is a reflection of commitment and contribution. Those who actively support the community and help Cardano grow naturally step into this role.",
                }),
              ]}
              leftHeadingDot={true}
              rightButtonLabel={translate({
                id: "ambassadors.cta.rightButtonLabel",
                message: "Get Started",
              })}
              rightButtonLink={
                "https://forum.cardano.org/t/cardano-ambassadors-roles-and-responsibilities/154055"
              }
              rightButtonAlign={"center"}
            />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
