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
      title="Ouroboros"
      description="An environmentally sustainable, verifiably secure proof-of-stake protocol with rigorous security guarantees."
      bannerType="ouroboros"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="What is Ouroboros? | cardano.org"
    description="An environmentally sustainable, verifiably secure proof-of-stake protocol with rigorous security guarantees."
    >
      <OpenGraphImage pageName="ouroboros" />
      <HomepageHeader />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
            <Divider text="Vision" />
            <TitleWithText 
              title="The Blockchain Revolution Started With Bitcoin. It Continues Now With Ouroboros:"
              description="A proof-of-stake protocol that provides and improves the security guarantees of proof-of-work at a fraction of the energy cost. Ouroboros applies cryptography, combinatorics, and mathematical game theory to guarantee the protocol’s integrity, longevity, and performance, and that of the distributed networks that depend upon it."
              headingDot={true}
            />

        <FeaturedTitleWithText
            title="What Is Ouroboros?"
            description={[
              "Ouroboros is the first provably secure proof-of-stake protocol, and the first blockchain protocol to be based on \
              peer-reviewed research. Ouroboros combines unique technology and mathematically-verified mechanisms - which, in turn, \
              combine behavioral psychology and economic philosophy - to ensure the security and sustainability of the blockchains \
              that depend upon it. The result is a protocol with proven security guarantees able to facilitate the propagation of \
              global, permissionless networks with minimal energy requirements - of which Cardano is the first.",

              "At the heart of Ouroboros is the concept of infinity. Global networks must be able to grow sustainably and ethically: \
              to provide greater opportunities to the world while also preserving it. This becomes possible with Ouroboros.",
              
              "Ouroboros facilitates the creation and fruition of distributed, permissionless networks capable of sustainably supporting \
              new markets.",
            ]}
            quote="Ouroboros exists to define the parameters of the new world: a protocol more secure, scalable, and energy-efficient than anything that has come before."
            buttonLabel="Explore the research"
            buttonLink="/research#byron"
            headingDot={false}
        />

        <Divider text="Features" />
        <DottedImageWithText
                imageName="dots-with-line"
                title="Provably Secure"
                text={[
                  "Ouroboros features mathematically verifiable security against attackers.",

                  "The protocol is guaranteed to be secure so long as 51% of the stake – in the case of Cardano, ada – is held by honest \
                  participants, which, in addition to other novel concepts, is achieved through random leader selection. The protocol continues \
                  to evolve through new iterations and rigorous security analysis.",
                ]}
                headingDot={true}
              />
        <DottedImageWithText
                imageName="ada-upturned-hand"
                title="Incentives & Rewards"
                text={[
                  "To ensure the sustainability of the blockchain networks using Ouroboros, the protocol features an incentive mechanism that \
                  rewards network participants for their participation.",

                  "This can either be operating a stake pool or delegating a stake in ada to a stake pool. Rewards (in the form of ada) can be \
                  earned by completing either of these activities.",
                ]}
                headingDot={true}
              />
        <DottedImageWithText
                imageName="machine-squares"
                title="Stake Delegation And Stake Pools"
                text={[
                  "Ouroboros is a proof-of-stake protocol. It distributes network control across stake pools: node operators with the infrastructure \
                  required to ensure a consistent and reliable connection to the network.",

                  "For each slot, a stake pool is assigned as the slot leader, and is rewarded for adding a block to the chain. Ada holders may delegate \
                  their stake to a specific stake pool, increasing its chance of being selected as the slot leader, and share in the stake pool’s rewards.",
                ]}
                headingDot={true}
              />
        <DottedImageWithText
                imageName="power-arrows"
                title="Energy Efficient"
                text={[
                  "Ouroboros solves the greatest challenge faced by existing blockchains: the need for more and more energy to achieve consensus. Using \
                  Ouroboros, Cardano is able to securely, sustainably, and ethically scale, with up to [four million times the energy efficiency of bitcoin](https://iohk.io/en/blog/posts/2020/03/23/from-classic-to-hydra-the-implementations-of-ouroboros-explained/).",
                ]}
                headingDot={true}
              />
        </BoundaryBox>
      </BackgroundWrapper>

      <ProofOfStakeSection />

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
