import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import GovernanceBlueSection from "@site/src/components/GovernanceBlueSection";
import GovernanceWhyVoltaireSection from "@site/src/components/GovernanceWhyVoltaireSection";
import TermExplainer from "@site/src/components/TermExplainer";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox"; 
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import TextSectionWithCtaAndQuote from "@site/src/components/Layout/TextWithCtaAndQuote";

function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()";
  return (
    <SiteHero
      title={[
        "Built for the community",
        <br key="line1" />, /*FIXME: too hacky */
        "by the community",
      ]}
      description="Cardano is developing the most secure and decentralized governance model in the world. A model to give everybody a voice, and control over the future development of the platform and the applications and services that emerge from it."
      bannerType="braidBlue"
    />
  );
}

export default function Home() {

  return (
    <Layout
    title="Governance | cardano.org"
    description="Cardano is developing the most secure and decentralized governance model in the world. A model to give everybody a voice, and control over the future development of the platform and the applications and services that emerge from it."
    >
      <OpenGraphInfo pageName="governance" />
      <HomepageHeader />
      <main>
        
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>

            <Divider text="Governance Within Cardano" />
            <TextSectionWithCtaAndQuote 
            texts={[
              "Cardano is defined by its community. Its governance model shows that true democracy - in which individuals are incentivized to play a role and votes are immutably recorded - is possible. It is a way for token holders to decide the future of a platform, and for the community to dictate the use of Cardano’s treasury funds.",
              "This model and the pioneering technology that underpins it can be applied to any application, system, or even society. It is a blueprint for change that is decided by the many, as well as the few, and which will redistribute power, eliminating intermediaries, to improve the lives of all."
            ]}
            quoteText="Change begins with one voice. But is realized through the Combination of many."
            showButton={false}
          />

            <Divider text="Delegate your voting power" id="finddrep" />
            <TextSectionWithCtaAndQuote 
            texts={[
              "Delegation is the act of lending your voting power—equal to the ada balance in your wallet—to a Delegate Representative (DRep), who votes on your behalf like a parliamentary representative. Alternatively, you can use automatic voting options to abstain or signal “No Confidence” in all proposals."
            ]}
            
            showButton={true}
            buttonText="Find a DRep"
            buttonLink="https://gov.tools/drep_directory"
          />

            <Divider text="Become a DRep on Cardano"  id="becomedrep" />
            <TextSectionWithCtaAndQuote 
            texts={[
              "DReps are key participants in governing the Cardano network. They actively engage in governance and represent other Cardano members. DReps must stay informed on governance actions to make wise decisions.",
              "If you have the time and commitment to contribute to Cardano’s governance, register as a DRep. A refundable deposit of 500 ada is required and will be returned upon retirement."
            ]}
            
            showButton={true}
            buttonText="Become a DRep"
            buttonLink="https://docs.gov.tools/about/what-is-cardano-govtool/govtool-functions/dreps/register-as-a-drep"
          />

            <Divider text="View Governance Actions on Cardano"  id="govactions" />
            <TextSectionWithCtaAndQuote 
            texts={[
              "Stay informed and participate in Cardano’s decentralized governance. View all on-chain actions, including those recently submitted, ratified, enacted, expired, or dropped. Engage with ongoing proposals, track their progress, and understand their impact on the network. Your involvement helps shape the future of Cardano. Click below to see all current and past governance actions and make your voice heard.",
            ]}
            
            showButton={true}
            buttonText="Governance Actions"
            buttonLink="https://gov.tools/governance_actions"
          />


          </BoundaryBox>
        </BackgroundWrapper>

        

        <BackgroundWrapper backgroundType={"solidBlue"}>
          <BoundaryBox>
            <GovernanceBlueSection />
          </BoundaryBox>
      </BackgroundWrapper>


      <BoundaryBox>
        <Divider text="Why Voltaire" />
        <GovernanceWhyVoltaireSection />
         
        <SpacerBox size="medium" />
      </BoundaryBox>

         
        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <TermExplainer category="governance" />
          </BoundaryBox>
        </BackgroundWrapper>
        
      </main>
    </Layout>
  );
}
