import React from "react";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import GovernanceBlueSection from "@site/src/components/GovernanceBlueSection";
import GovernancePulse from "@site/src/components/GovernancePulse";
import GovernancePathsSection from "@site/src/components/GovernancePathsSection";
import TermExplainer from "@site/src/components/TermExplainer";
import QuizCard from "@site/src/components/QuizCard";
import FAQSection from "@site/src/components/FAQSection";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import DottedImageWithButton from "@site/src/components/Layout/DottedImageWithButton";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {translate} from '@docusaurus/Translate';
import styles from "./governance.module.css";
import governanceRoleQuiz from "@site/src/data/governanceRoleQuiz.json";
import governanceFAQ from "@site/src/data/governanceFAQ.json";

function GovernanceHero() {
  return (
    <SiteHero
      title={translate({id: 'governance.hero.title', message: 'Your ada, your voice'})}
      description={translate({id: 'governance.hero.description', message: "Every ada in your wallet is a vote. Thousands of people are already shaping Cardano's future. Join them."})}
      bannerType="braidBlue"
    />
  );
}

function GovernanceRolesSection() {
  return (
    <>
      <Divider text={translate({id: 'governance.divider.howItWorks', message: 'How Cardano governance works'})} id="how-it-works" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.onboarding.intro', message: 'Cardano is governed by its community. Three groups vote on proposals that shape the network. Together, they decide on everything from protocol upgrades to treasury funding.'})}
      </p>
      <SpacerBox size="small" />
      <div className="row">
        <div className="col col--4">
          <div className={styles.roleCard}>
            <img src={useBaseUrl('/img/dotted-icons/people.svg')} alt="DReps" className={styles.roleIcon} />
            <h3>{translate({id: 'governance.onboarding.dreps.title', message: 'Delegated Representatives'})}</h3>
            <p className="black-text">
              {translate({id: 'governance.onboarding.dreps.text', message: 'DReps vote on governance proposals on behalf of ada holders who delegate to them.'})}
            </p>
          </div>
        </div>
        <div className="col col--4">
          <div className={styles.roleCard}>
            <img src={useBaseUrl('/img/dotted-icons/decentralization.svg')} alt="SPOs" className={styles.roleIcon} />
            <h3>{translate({id: 'governance.onboarding.spos.title', message: 'Stake Pool Operators'})}</h3>
            <p className="black-text">
              {translate({id: 'governance.onboarding.spos.text', message: 'SPOs validate transactions and vote on technical changes like hard forks and protocol parameters.'})}
            </p>
          </div>
        </div>
        <div className="col col--4">
          <div className={styles.roleCard}>
            <img src={useBaseUrl('/img/dotted-icons/government.svg')} alt="Constitutional Committee" className={styles.roleIcon} />
            <h3>{translate({id: 'governance.onboarding.cc.title', message: 'Constitutional Committee'})}</h3>
            <p className="black-text">
              {translate({id: 'governance.onboarding.cc.text', message: 'The Constitutional Committee ensures that governance proposals align with Cardano\'s constitution.'})}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


function ImpactTimeline() {
  return (
    <>
      <Divider text={translate({id: 'governance.divider.impact', message: 'What governance has achieved'})} id="impact" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.impact.intro', message: 'Cardano governance is not theoretical. Real decisions are being made by the community every epoch.'})}
      </p>
      <SpacerBox size="small" />

      <DottedImageWithText
        imageName="government"
        title={translate({id: 'governance.impact.constitution.title', message: 'Constitution ratified'})}
        text={translate({id: 'governance.impact.constitution.text', message: 'The Cardano community ratified its constitution through an on-chain governance action, establishing the foundational rules for decentralized decision-making. [Read more](/blog/2026-01-22-update-cardano-constitution)'})}
      />

      <DottedImageWithText
        imageName="finance"
        title={translate({id: 'governance.impact.treasury.title', message: 'Treasury withdrawals enacted'})}
        text={translate({id: 'governance.impact.treasury.text', message: 'The community voted to fund projects directly from the Cardano treasury, directing resources toward ecosystem growth. [Read more](/blog/2025-08-07-treasury-withdrawal-actions)'})}
      />

      <DottedImageWithText
        imageName="chains"
        title={translate({id: 'governance.impact.hardfork.title', message: 'Hard fork proposals approved'})}
        text={translate({id: 'governance.impact.hardfork.text', message: 'Protocol upgrades including the Plomin hard fork were proposed and ratified through community governance. [Read more](/blog/2025-11-20-hard-fork-proposal)'})}
      />

      <DottedImageWithText
        imageName="innovation"
        title={translate({id: 'governance.impact.committee.title', message: 'Constitutional Committee elected'})}
        text={translate({id: 'governance.impact.committee.text', message: 'The first Constitutional Committee was elected by the community through an on-chain governance action. [Read more](/blog/2025-09-07-constitutional-committee-elections)'})}
      />

      <DottedImageWithText
        imageName="power-arrows"
        title={translate({id: 'governance.impact.params.title', message: 'Protocol parameters changed'})}
        text={translate({id: 'governance.impact.params.text', message: 'SPOs and DReps voted on protocol parameter changes, including stake pool economics and governance thresholds. [Read more](/blog/2026-02-10-call-to-action-spo-parameter-changes)'})}
      />
    </>
  );
}

const governanceTools = [
  { imageName: "government", labelId: "governance.tools.govtool", label: "GovTool", link: "https://gov.tools", descId: "governance.tools.govtool.description", desc: "Vote on proposals and register as a DRep" },
  { imageName: "people", labelId: "governance.tools.tempo", label: "Tempo", link: "https://tempo.vote", descId: "governance.tools.tempo.description", desc: "Find and compare DReps" },
  { imageName: "chains", labelId: "governance.tools.adastat", label: "AdaStat", link: "https://adastat.net/governances", descId: "governance.tools.adastat.description", desc: "Track all governance actions" },
  { imageName: "technology", labelId: "governance.tools.governancespace", label: "Governance Space", link: "https://governancespace.com", descId: "governance.tools.governancespace.description", desc: "Governance analytics and insights" },
  { imageName: "research", labelId: "governance.tools.charts", label: "Governance Charts", link: "/insights/governance-actions", descId: "governance.tools.charts.description", desc: "Interactive visual process guides" },
  { imageName: "opportunity", labelId: "governance.tools.constitution", label: "Constitution", link: "/constitution", descId: "governance.tools.constitution.description", desc: "Read the governing document" },
];

function ToolsGrid() {
  return (
    <>
      <Divider text={translate({id: 'governance.divider.tools', message: 'Governance tools'})} id="tools" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.tools.intro', message: 'Tools to help you participate in Cardano governance.'})}
      </p>
      <SpacerBox size="small" />
      {[0, 3].map((startIndex) => (
        <React.Fragment key={startIndex}>
          <div className={`row ${styles.toolsRow}`}>
            {governanceTools.slice(startIndex, startIndex + 3).map((tool) => (
              <div className="col col--4" key={tool.labelId}>
                <DottedImageWithButton
                  imageName={tool.imageName}
                  buttonLabel={translate({id: tool.labelId, message: tool.label})}
                  buttonLink={tool.link}
                />
                <p className={`black-text ${styles.toolDescription}`}>
                  {translate({id: tool.descId, message: tool.desc})}
                </p>
              </div>
            ))}
          </div>
          {startIndex === 0 && <SpacerBox size="small" />}
        </React.Fragment>
      ))}
    </>
  );
}

export default function Governance() {
  return (
    <Layout
      title={translate({id: 'governance.meta.title', message: 'Cardano Governance - Your ada, your voice'})}
      description={translate({id: 'governance.meta.description', message: "Cardano governance gives every ada holder a voice. Delegate to a DRep, vote on proposals, or register as a delegate representative to shape the network."})}
    >
      <OpenGraphInfo pageName="governance" />
      <GovernanceHero />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <GovernancePulse />
            <GovernanceRolesSection />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <GovernancePathsSection />
          <SpacerBox size="small" />
          <div className="row" style={{justifyContent: 'center'}}>
            <div className="col col--6">
              <QuizCard
                quizData={governanceRoleQuiz}
                title={translate({id: 'governance.quiz.title', message: 'Not sure where to start?'})}
                description={translate({id: 'governance.quiz.description', message: 'Answer a few questions to find out which governance role fits you best.'})}
                buttonText={translate({id: 'governance.quiz.buttonText', message: 'Find your role'})}
                questionCount={5}
                passingScore={0}
                allowRetry={false}
              />
            </div>
          </div>
          <SpacerBox size="medium" />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <ImpactTimeline />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"solidBlue"}>
          <BoundaryBox>
            <GovernanceBlueSection />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <ToolsGrid />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <FAQSection data={governanceFAQ} />
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
