import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import Divider from "@site/src/components/Layout/Divider";
import OneColumnBox from "@site/src/components/Layout/OneColumnBox";
import TwoColumnBox from "@site/src/components/Layout/TwoColumnBox";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import FAQSection from "@site/src/components/FAQSection";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title={[
        "Designed For Mass Participation",
        <br key="line1" />, /*FIXME: too hacky */
        "Built For Secure Decentralization",
      ]}
      description="Become a stake pool operator, earn ada, and contribute to the decentralization of the Cardano network."
      bannerType="zoomRedWhite"
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
      <main>
        <BackgroundWrapper backgroundType={"solidGrey"}>
          <BoundaryBox>
            <Divider text="What is staking?" />
            <TwoColumnBox
              leftText={[
                "Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to \
                the amount of ada held. The ability to delegate or pledge a stake is fundamental to how Cardano works.",
              ]}
              rightText={[
                "There are two ways an ada holder can earn rewards: by delegating their stake to a stake pool run by someone else, \
                or by running their own stake pool.",

                "The amount of stake delegated to a given stake pool is the primary way the Ouroboros protocol chooses who should \
                add the next block to the blockchain, and receive a monetary reward for doing so.",

                "The more stake is delegated to a stake pool (up to a certain point), the more likely it is to make the next block \
                – and the rewards that it earns are shared between everyone who delegated their stake to that stake pool.",
              ]}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <Divider text="What is stake pool?" />
            <OneColumnBox
              text={[
                "Stake pools may be either public or private. A public stake pool is a Cardano network node with a public address that \
                other users can delegate to, and receive rewards. Private stake pools only deliver rewards to their owners.",

                "Stake pools are run by a reliable operator: an individual or business with the knowledge and resources to run the node \
                on a consistent basis. Ada holders can delegate to public stake pools if they wish to participate in the protocol and \
                receive rewards, but do not wish to operate a Cardano network node themselves.",

                "The more stake that is delegated to a stake pool, the greater chance it has of being selected as a slot leader. Each \
                time it is selected and produces a block that is accepted onto the blockchain, it is rewarded, and these rewards are \
                shared between the stake pool operator and stake pool delegators.",

                "Extensive research and development has gone into ensuring a fair, competitive marketplace that proportionately incentivizes \
                participation, and rewards the investment of time, energy, and resources. The key technical parameters influencing stake \
                pools and the rewards received are:",
              ]}
            />
            <DottedImageWithText
              imageName="pledging"
              title="Pledging Mechanism"
              text={[
                "While there is no required minimum pledge amount, pool operators can optionally pledge some or all of their stake \
              to their pool to make their pool more attractive. The higher the amount of ada pledged, the more rewards the pool will \
              receive, which will attract more delegation. The a0 protocol parameter defines the influence of the pledge on the pool reward.",
              ]}
            />
            <DottedImageWithText
              imageName="desireability"
              title="Desirability Index"
              text={[
                "The desirability of a pool is calculated by taking the pledged owner’s stake, costs, and margin, and combining them with \
                an influence from saturation and pool performance. This number will be used to rank pools in wallets, and indicates how \
                ‘desirable’ or ‘attractive’ the pool is to potential delegators.",
              ]}
            />
            <DottedImageWithText
              imageName="saturation"
              title="Saturation Parameter (K)"
              text={[
                "Saturation is a term used to indicate that a particular stake pool has more stake delegated to it than is ideal for the \
                network, while k is the targeted number of desired pools. Once a pool reaches the point of saturation, it will offer \
                diminishing rewards. The saturation mechanism was designed to prevent centralization by encouraging delegators to \
                delegate to different stake pools, and to incentivize operators to set up alternative pools so that they can continue \
                earning maximum rewards. Saturation, therefore, exists to preserve the interests of both ada holders delegating their \
                stake and stake pool operators, and to prevent any single pool from becoming too large.",
              ]}
            />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <FAQSection jsonFileName="operationFAQ" />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
