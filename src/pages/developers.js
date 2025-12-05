import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";
import DottedImageWithText  from "@site/src/components/Layout/DottedImageWithText";
import SpacerBox  from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title="Start Building on Cardano"
      description="A curated list of resources and entry points to help you get started with building on Cardano."
      bannerType="fluidBlue"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Start Building on Cardano | cardano.org"
    description="A curated list of resources and entry points to help you get started with building on Cardano."
    >
      <OpenGraphInfo pageName="developers" />
      <HomepageHeader />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
            <Divider text="Developer Resources" />
            <DottedImageWithText
                imageName="education"
                title="Documentation"
                text={[
                  
                 "Access the essential resources and updates you need to build, integrate, and stay informed about the Cardano blockchain. Below you’ll find links to the developer portal, detailed documentation, integration guides, and the latest core development updates.",
                  
                  {
                  list: [
                    "[Developer Portal](https://developers.cardano.org)",
                    "[Cardano Docs](https://docs.cardano.org)",
                    "[Integrate Cardano](/exchanges)",
                    "[Core Development Updates](/news/tags/development)",
                  ],
                },

                ]}
                headingDot={true}
              />

            <DottedImageWithText
                imageName="proof-of-work"
                title="Developer Tools"
                text={[

                  "Explore the tools, projects, and updates that are shaping the Cardano ecosystem. Below you’ll find links to builder tools, a showcase of projects built on Cardano, and a technical updates tracker that aggregates commits within the last 7 days from all branches of Cardano development-related repos.",
                  
                  {
                    list: [
                      "[Builder Tools](https://developers.cardano.org/tools)",
                      "[Cardano Applications](/apps)",
                      "[Technical Update Tracker](https://cardanoupdates.com)",
                    ],
                  },

                ]}
                headingDot={false}
              />    

            <DottedImageWithText
                imageName="research"
                title="Support"
                text={[

                  "Join the vibrant Cardano developer community through various platforms. Below you’ll find links to the Cardano Stack Exchange, the Cardano Forum, and the official Telegram group. Connect with fellow developers, ask questions, and share insights in our decentralized ecosystem.",
                  
                  {
                    list: [
                      "[Cardano Stack Exchange](https://cardano.stackexchange.com)",
                      "[Cardano Forum](https://forum.cardano.org/c/developers/29)",
                      "[Telegram](https://t.me/CardanoDevelopersOfficial)",
                    ],
                  },

                  
                  
                  

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
