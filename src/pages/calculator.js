import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Staking Calculator"
      description="See how much rewards you can possibly earn by staking ada."
      bannerType="dots"
    />
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <BoundaryBox>
        {/* FIXME: Reward Calculator */}  
        <TitleWithText
              title="The Reward Calculator is being revised"
              description={[
                "We're currently enhancing our calculator to bring you a more robust and user-friendly \
                experience. It's temporarily unavailable as we make these improvements. Please check \
                back soon to access the updated tool. We appreciate your patience and are excited to \
                share the improvements with you."
              ]}
              titleType="black"
              headingDot={true}
            />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
