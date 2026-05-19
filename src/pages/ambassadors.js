import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";

import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import AmbassadorBenefitsSection from "@site/src/components/AmbassadorBenefitsSection";

import AmbassadorsHero from "@site/src/components/Ambassadors/AmbassadorsHero";
import AmbassadorsProgramIntro from "@site/src/components/Ambassadors/AmbassadorsProgramIntro";
import AmbassadorsImpactOverview from "@site/src/components/Ambassadors/AmbassadorsImpactOverview";
import AmbassadorsContributions from "@site/src/components/Ambassadors/AmbassadorsContributions";
import AmbassadorsMilestones from "@site/src/components/Ambassadors/AmbassadorsMilestones";
import AmbassadorsDirectory from "@site/src/components/Ambassadors/AmbassadorsDirectory";
import AmbassadorsImpactStories from "@site/src/components/Ambassadors/AmbassadorsImpactStories";
import AmbassadorsCallToAction from "@site/src/components/Ambassadors/AmbassadorsCallToAction";

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
          <AmbassadorsImpactOverview />
          <AmbassadorsContributions />
          <AmbassadorsMilestones />
          <AmbassadorsDirectory />
          <AmbassadorsImpactStories />
          <AmbassadorsCallToAction />
          <AmbassadorsProgramIntro />
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
      </main>
    </Layout>
  );
}
