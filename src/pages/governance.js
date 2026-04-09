import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import GovernanceBlueSection from "@site/src/components/GovernanceBlueSection";
import GovernancePulse from "@site/src/components/GovernancePulse";
import GovernancePathsSection from "@site/src/components/GovernancePathsSection";
import TermExplainer from "@site/src/components/TermExplainer";
import QuizCard from "@site/src/components/QuizCard";
import FAQSection from "@site/src/components/FAQSection";
import StepCard from "@site/src/components/Layout/StepCard";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
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
            <img src={useBaseUrl('/img/dotted-icons/dreps.png')} alt="DReps" className={styles.roleIcon} />
            <h3>{translate({id: 'governance.onboarding.dreps.title', message: 'Delegated Representatives'})}</h3>
            <p className="black-text">
              {translate({id: 'governance.onboarding.dreps.text', message: 'DReps vote on governance proposals on behalf of ada holders who delegate to them.'})}
            </p>
          </div>
        </div>
        <div className="col col--4">
          <div className={styles.roleCard}>
            <img src={useBaseUrl('/img/dotted-icons/spo.png')} alt="SPOs" className={styles.roleIcon} />
            <h3>{translate({id: 'governance.onboarding.spos.title', message: 'Stake Pool Operators'})}</h3>
            <p className="black-text">
              {translate({id: 'governance.onboarding.spos.text', message: 'SPOs validate transactions and vote on hard forks and critical protocol parameter changes.'})}
            </p>
          </div>
        </div>
        <div className="col col--4">
          <div className={styles.roleCard}>
            <img src={useBaseUrl('/img/dotted-icons/constitutional-committee.png')} alt="Constitutional Committee" className={styles.roleIcon} />
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


const milestones = [
  {
    titleId: "governance.impact.constitution.title",
    title: "Constitution updated with 79% support",
    textId: "governance.impact.constitution.text",
    text: "The Cardano community ratified an updated constitution through on-chain governance, introducing stricter standards for transparency and standalone accountability.",
    date: "January 2026",
    blog: "/news/2026-01-22-update-cardano-constitution",
    banner: "/img/governance/constitution.webp",
  },
  {
    titleId: "governance.impact.committee.title",
    title: "Constitutional Committee elected",
    textId: "governance.impact.committee.text",
    text: "The first Constitutional Committee was elected by the community through an on-chain governance action.",
    date: "September 2025",
    blog: "/news/2025-09-07-constitutional-committee-elections",
    banner: "/img/governance/committee.webp",
  },
  {
    titleId: "governance.impact.treasury.title",
    title: "Treasury withdrawals enacted",
    textId: "governance.impact.treasury.text",
    text: "The community voted to fund projects directly from the Cardano treasury, directing resources toward ecosystem growth.",
    date: "August 2025",
    blog: "/news/2025-08-07-treasury-withdrawal-actions",
    banner: "/img/governance/treasury.webp",
  },
  {
    titleId: "governance.impact.hardfork.title",
    title: "Hard fork proposals approved",
    textId: "governance.impact.hardfork.text",
    text: "Protocol upgrades including the Plomin hard fork were proposed and ratified through community governance.",
    date: "November 2025",
    blog: "/news/2025-11-20-hard-fork-proposal",
    banner: "/img/governance/hardfork.webp",
  },
  {
    titleId: "governance.impact.params.title",
    title: "Protocol parameters changed",
    textId: "governance.impact.params.text",
    text: "SPOs and DReps voted on protocol parameter changes, including stake pool economics and governance thresholds.",
    date: "February 2026",
    blog: "/news/2026-02-10-call-to-action-spo-parameter-changes",
    banner: "/img/governance/params.webp",
  },
];

function ImpactTimeline() {
  return (
    <>
      <Divider text={translate({id: 'governance.divider.impact', message: 'What governance has achieved'})} id="impact" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.impact.intro', message: 'Cardano governance is not theoretical. Real decisions are being made by the community every epoch.'})}
      </p>
      <SpacerBox size="small" />

      {milestones.map((m) => (
        <a href={m.blog} key={m.titleId} className={styles.milestoneCard}>
          <div className={styles.milestoneBanner}>
            <img src={useBaseUrl(m.banner)} alt={translate({id: m.titleId, message: m.title})} />
          </div>
          <div className={styles.milestoneContent}>
            <span className={styles.milestoneDate}>{m.date}</span>
            <h3>{translate({id: m.titleId, message: m.title})}</h3>
            <p className="black-text">{translate({id: m.textId, message: m.text})}</p>
          </div>
        </a>
      ))}
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

function getDelegationSteps() {
  return [
    {
      title: translate({id: 'governance.delegation.step1.title', message: 'Get a compatible wallet'}),
      description: translate({id: 'governance.delegation.step1.description', message: 'You need a Cardano wallet that supports governance features.'}),
      content: (
        <div>
          <p>{translate({id: 'governance.delegation.step1.text', message: 'Most popular Cardano wallets support governance delegation. If you already have a wallet with ada, you are ready to go.'})}</p>
          <Link to="/wallets" className="button button--outline button--primary">
            {translate({id: 'governance.delegation.step1.buttonText', message: 'Browse wallets'})}
          </Link>
        </div>
      ),
      checkboxLabel: translate({id: 'governance.delegation.step1.checkbox', message: 'I have a wallet with ada'}),
    },
    {
      title: translate({id: 'governance.delegation.step2.title', message: 'Find a DRep'}),
      description: translate({id: 'governance.delegation.step2.description', message: 'Browse DReps and find one whose values align with yours.'}),
      content: (
        <div>
          <p>{translate({id: 'governance.delegation.step2.text', message: 'DReps publish their platform and voting intentions. Choose one whose priorities match yours, or use an automatic voting option (Abstain or No Confidence).'})}</p>
          <Link to="https://tempo.vote/dreps" className="button button--outline button--primary">
            {translate({id: 'governance.delegation.step2.buttonText', message: 'Find a DRep on Tempo'})}
          </Link>
        </div>
      ),
      checkboxLabel: translate({id: 'governance.delegation.step2.checkbox', message: 'I have chosen a DRep'}),
    },
    {
      title: translate({id: 'governance.delegation.step3.title', message: 'Delegate your voting power'}),
      description: translate({id: 'governance.delegation.step3.description', message: 'Use your wallet or GovTool to delegate to your chosen DRep.'}),
      content: (
        <div>
          <p>{translate({id: 'governance.delegation.step3.text', message: 'Open your wallet\'s governance section or use GovTool to delegate. You will need to sign a transaction. Your ada stays in your wallet at all times.'})}</p>
          <Link to="https://gov.tools" className="button button--outline button--primary">
            {translate({id: 'governance.delegation.step3.buttonText', message: 'Open GovTool'})}
          </Link>
        </div>
      ),
      checkboxLabel: translate({id: 'governance.delegation.step3.checkbox', message: 'I have delegated my voting power'}),
    },
    {
      title: translate({id: 'governance.delegation.step4.title', message: 'You\'re done!'}),
      description: translate({id: 'governance.delegation.step4.description', message: 'Your delegation will become active in the next epoch.'}),
      content: (
        <div>
          <p>{translate({id: 'governance.delegation.step4.text', message: 'Your voting power is now represented by your DRep. You can change your delegation at any time, and your ada remains fully under your control.'})}</p>
        </div>
      ),
      finalStep: true,
    },
  ];
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
            <SpacerBox size="small" />
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

        <BoundaryBox>
          <Divider text={translate({id: 'governance.divider.delegation', message: 'Delegate in 3 steps'})} id="delegate-walkthrough" />
          <SpacerBox size="small" />
          <StepCard steps={getDelegationSteps()} storageKey="cardano-governance-delegation-step" />
          <SpacerBox size="medium" />
        </BoundaryBox>

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
