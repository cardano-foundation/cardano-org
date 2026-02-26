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
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  return (
    <SiteHero
      title={translate({id: 'ouroboros.hero.title', message: 'Ouroboros'})}
      description={translate({id: 'ouroboros.hero.description', message: 'An environmentally sustainable, verifiably secure proof-of-stake protocol with rigorous security guarantees.'})}
      bannerType="ouroboros"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title={translate({id: 'ouroboros.meta.title', message: 'What is Ouroboros? | cardano.org'})}
    description={translate({id: 'ouroboros.meta.description', message: 'An environmentally sustainable, verifiably secure proof-of-stake protocol with rigorous security guarantees.'})}
    >
      <OpenGraphInfo pageName="ouroboros" />
      <HomepageHeader />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
            <Divider text={translate({id: 'ouroboros.divider.vision', message: 'Vision'})} />
            <TitleWithText
              title={translate({id: 'ouroboros.vision.title', message: 'The Blockchain Revolution Started With Bitcoin. It Continues Now With Ouroboros:'})}
              description={translate({id: 'ouroboros.vision.description', message: 'A proof-of-stake protocol that provides and improves the security guarantees of proof-of-work at a fraction of the energy cost. Ouroboros applies cryptography, combinatorics, and mathematical game theory to guarantee the protocol\'s integrity, longevity, and performance, and that of the distributed networks that depend upon it.'})}
              headingDot={true}
            />

        <FeaturedTitleWithText
            title={translate({id: 'ouroboros.whatIs.title', message: 'What Is Ouroboros?'})}
            description={[
              translate({id: 'ouroboros.whatIs.description1', message: 'Ouroboros is the first provably secure proof-of-stake protocol, and the first blockchain protocol to be based on peer-reviewed research. Ouroboros combines unique technology and mathematically-verified mechanisms - which, in turn, combine behavioral psychology and economic philosophy - to ensure the security and sustainability of the blockchains that depend upon it. The result is a protocol with proven security guarantees able to facilitate the propagation of global, permissionless networks with minimal energy requirements - of which Cardano is the first.'}),
              translate({id: 'ouroboros.whatIs.description2', message: 'At the heart of Ouroboros is the concept of infinity. Global networks must be able to grow sustainably and ethically: to provide greater opportunities to the world while also preserving it. This becomes possible with Ouroboros.'}),
              translate({id: 'ouroboros.whatIs.description3', message: 'Ouroboros facilitates the creation and fruition of distributed, permissionless networks capable of sustainably supporting new markets.'}),
            ]}
            quote={translate({id: 'ouroboros.whatIs.quote', message: 'Ouroboros exists to define the parameters of the new world: a protocol more secure, scalable, and energy-efficient than anything that has come before.'})}
            buttonLabel={translate({id: 'ouroboros.whatIs.buttonLabel', message: 'Explore the research'})}
            buttonLink="/research#byron"
            headingDot={false}
        />

        <Divider text={translate({id: 'ouroboros.divider.features', message: 'Features'})} />
        <DottedImageWithText
                imageName="dots-with-line"
                title={translate({id: 'ouroboros.features.provablySecure.title', message: 'Provably Secure'})}
                text={[
                  translate({id: 'ouroboros.features.provablySecure.text1', message: 'Ouroboros features mathematically verifiable security against attackers.'}),
                  translate({id: 'ouroboros.features.provablySecure.text2', message: 'The protocol is guaranteed to be secure so long as 51% of the stake – in the case of Cardano, ada – is held by honest participants, which, in addition to other novel concepts, is achieved through random leader selection. The protocol continues to evolve through new iterations and rigorous security analysis.'}),
                ]}
                headingDot={true}
              />
        <DottedImageWithText
                imageName="ada-upturned-hand"
                title={translate({id: 'ouroboros.features.incentivesRewards.title', message: 'Incentives & Rewards'})}
                text={[
                  translate({id: 'ouroboros.features.incentivesRewards.text1', message: 'To ensure the sustainability of the blockchain networks using Ouroboros, the protocol features an incentive mechanism that rewards network participants for their participation.'}),
                  translate({id: 'ouroboros.features.incentivesRewards.text2', message: 'This can either be operating a stake pool or delegating a stake in ada to a stake pool. Rewards (in the form of ada) can be earned by completing either of these activities.'}),
                ]}
                headingDot={true}
              />
        <DottedImageWithText
                imageName="machine-squares"
                title={translate({id: 'ouroboros.features.stakeDelegation.title', message: 'Stake Delegation And Stake Pools'})}
                text={[
                  translate({id: 'ouroboros.features.stakeDelegation.text1', message: 'Ouroboros is a proof-of-stake protocol. It distributes network control across stake pools: node operators with the infrastructure required to ensure a consistent and reliable connection to the network.'}),
                  translate({id: 'ouroboros.features.stakeDelegation.text2', message: 'For each slot, a stake pool is assigned as the slot leader, and is rewarded for adding a block to the chain. Ada holders may delegate their stake to a specific stake pool, increasing its chance of being selected as the slot leader, and share in the stake pool\'s rewards.'}),
                ]}
                headingDot={true}
              />
        <DottedImageWithText
                imageName="power-arrows"
                title={translate({id: 'ouroboros.features.energyEfficient.title', message: 'Energy Efficient'})}
                text={[
                  translate({id: 'ouroboros.features.energyEfficient.text1', message: 'Ouroboros solves the greatest challenge faced by existing blockchains: the need for more and more energy to achieve consensus. Using Ouroboros, Cardano is able to securely, sustainably, and ethically scale, with up to [four million times the energy efficiency of bitcoin](https://developers.cardano.org/docs/operate-a-stake-pool/basics/consensus-staking/#ouroboros-protocol).'}),
                ]}
                headingDot={true}
              />
        </BoundaryBox>
      </BackgroundWrapper>

      <ProofOfStakeSection />

      <BackgroundWrapper backgroundType={"gradientDark"}>
          <BoundaryBox>
            <CtaOneColumn
              title={translate({id: 'ouroboros.cta.title', message: 'Attack the protocol, fork the blockchain - or not. Explore the Ouroboros protocol firsthand in this interactive simulation.'})}
              buttonLabel={translate({id: 'ouroboros.cta.buttonLabel', message: 'Play the game'})}
              buttonLink={"https://ouroboros.iohk.io/ouroboros-game/"}
            />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>
    </Layout>
  );
}
