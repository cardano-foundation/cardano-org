import Layout from "@theme/Layout";
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

  return (
    <Layout
    title="Cardano - making the world work better for all"
    description="An open platform designed to empower billions without economic identity by offering decentralized applications for managing identity, value, and governance."
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
