import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaTwoColumn from "@site/src/components/Layout/CtaTwoColumn";
import AmbassadorProgramSection from "@site/src/components/AmbassadorProgramSection";
import AmbassadorRolesSection from "@site/src/components/AmbassadorRolesSection";
import AmbassadorOverviewSection from "@site/src/components/AmbassadorOverviewSection";

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
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <AmbassadorProgramSection />
        <AmbassadorOverviewSection />
        <AmbassadorRolesSection />
        <BackgroundWrapper backgroundType={"solidBlue"}>
          <CtaTwoColumn
            title="Become a Cardano Ambassador"
            text={["Embark on your journey to becoming a Cardano Ambassador by diving into the Cardano Forum! It's \
            not just about holding a title; it's about action, involvement, and dedication. Start by engaging with \
            fellow enthusiasts, sharing insights, and contributing to discussions. As you climb through different \
            trust levels, you unlock new realms of interaction and collaboration.",
            
            "Consider each post, each interaction, and each contribution as a stepping stone towards ambassadorship. Remember, true ambassadors \
            are already making waves before the title comes their way. So, let your actions speak, become an integral part \
            of our community, and you might just find the title of Cardano Ambassador waiting for you at the end of your \
            journey."]}
            buttonLabel={"Join the Forum"}
            buttonLink={"https://forum.cardano.org/t/welcome-understanding-trust-levels-on-the-cardano-forum/117680"}
          />
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
