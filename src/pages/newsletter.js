import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import CommunityDigestForm from "@site/src/components/CommunityDigestFormHS";
import SpacerBox from "@site/src/components/Layout/SpacerBox";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Stay Informed"
      description="Get access to the latest Cardano news and content, and the hottest topics happening around the Cardano ecosystem."
      bannerType="overlap"
    />
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
    title="Cardano - making the world work better for all"
    description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
    >
      <HomepageHeader />
      <BoundaryBox>
          <Divider text="Stay informed" />
          <TitleWithText 
              title="Cardano Community Digest" 
              description={[
                "Get your bi-weekly dose of the latest hot topics, development updates, a list of upcoming meetups, delegation strategy updates, what our Cardano Ambassadors are up to, and much more."
              ]}
              headingDot={true} 
          />
          <CommunityDigestForm />
        </BoundaryBox>
        <SpacerBox size="medium" />
    </Layout>
  );
}
