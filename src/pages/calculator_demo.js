import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Staking Calculator"
      description="See how much you could potentially earn by staking ada and learn how rewards are calculated."
      bannerType="dots"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Staking Calculator | cardano.org"
    description="See how much rewards you can possibly earn by staking ada."
    >
      <OpenGraphImage pageName="calculator" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
        <TitleWithText
              title="Reward Calculator"
              titleType="black"
              description="Please allow the reward calculator a few seconds to load the necessary live data."
              headingDot={true}
            />
        </BoundaryBox>
        <iframe 
          src="/reward-calculator" 
          style={{ width: "100%", height: "100vh", border: "none" }} 
        ></iframe>
      </main>
    </Layout>
  );
}
