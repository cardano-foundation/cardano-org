import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import FeaturedTitleWithText from "@site/src/components/Layout/FeaturedTitleWithText";
import DottedImageWithText  from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox  from "@site/src/components/Layout/SpacerBox";
import ProofOfStakeSection from "@site/src/components/ProofOfStakeSection";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Start Building on Cardano"
      description="A curated list of resources and entry points to help you get started with building on Cardano."
      bannerType="fluid"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Start Building on Cardano | cardano.org"
    description="A curated list of resources and entry points to help you get started with building on Cardano."
    >
      <OpenGraphImage pageName="developers" />
      <HomepageHeader />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
            <Divider text="Developer Resources" />
            <DottedImageWithText
                imageName="education"
                title="Documentation"
                text={[
                  "[Developer Portal](https://developers.cardano.org)",
                  "[Cardano Docs](https://docs.cardano.org)",
                  "[Integrate Cardano](/exchanges)",
                  "[Core Development Updates](/news/tags/development)"

                ]}
                headingDot={true}
              />

            <DottedImageWithText
                imageName="proof-of-work"
                title="Developer Tools"
                text={[
                  
                  "[Builder Tools](https://developers.cardano.org/tools)",
                  "[Project Showcase](https://developers.cardano.org/showcase)",
                  "[Developer Updates](https://cardanoupdates.com)",

                ]}
                headingDot={false}
              />    

            <DottedImageWithText
                imageName="research"
                title="Support"
                text={[
                  
                  "[Cardano Stack Exchange](https://cardano.stackexchange.com)",
                  "[Cardano Forum](https://forum.cardano.org/c/developers/29)",
                  "[Telegram](https://t.me/CardanoDevelopersOfficial)",

                ]}
                headingDot={false}
              />  
         </BoundaryBox>
      </BackgroundWrapper>

      <BackgroundWrapper backgroundType={"gradientDark"}>
          <BoundaryBox>
            <CtaOneColumn
              title="Attack the protocol, fork the blockchain - or not. Explore the Ouroboros protocol firsthand in this interactive simulation."
              buttonLabel={"Play the game"}
              buttonLink={"https://ouroboros.iohk.io/ouroboros-game/"}
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
    </Layout>
  );
}
