import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";

import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";

import AmbassadorsHero from "@site/src/components/Ambassadors/AmbassadorsHero";
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
        </BoundaryBox>
      </main>
    </Layout>
  );
}
