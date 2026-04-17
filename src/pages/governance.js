import React from "react";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import GovernanceBlueSection from "@site/src/components/GovernanceBlueSection";
import GovernancePulse from "@site/src/components/GovernancePulse";
import GovernancePathsSection from "@site/src/components/GovernancePathsSection";
import TermExplainer from "@site/src/components/TermExplainer";
import SurveyCard from "@site/src/components/SurveyCard";
import FAQSection from "@site/src/components/FAQSection";
import StepCard from "@site/src/components/Layout/StepCard";
import AppGrid from "@site/src/components/AppGrid";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {translate} from '@docusaurus/Translate';
import styles from "./governance.module.css";
import governanceRoleSurvey from "@site/src/data/governanceRoleSurvey.json";
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
              {translate({id: 'governance.onboarding.spos.text', message: 'SPOs validate transactions and vote on hard forks, security-critical parameters, and no-confidence motions.'})}
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
    categoryId: "governance.impact.category.constitution",
    category: "Constitution",
  },
  {
    titleId: "governance.impact.committee.title",
    title: "Constitutional Committee elected",
    textId: "governance.impact.committee.text",
    text: "The first Constitutional Committee was elected by the community through an on-chain governance action.",
    date: "September 2025",
    blog: "/news/2025-09-07-constitutional-committee-elections",
    banner: "/img/governance/committee.webp",
    categoryId: "governance.impact.category.committee",
    category: "Committee",
  },
  {
    titleId: "governance.impact.treasury.title",
    title: "Treasury withdrawals enacted",
    textId: "governance.impact.treasury.text",
    text: "The community voted to fund projects directly from the Cardano treasury, directing resources toward ecosystem growth.",
    date: "August 2025",
    blog: "/news/2025-08-07-treasury-withdrawal-actions",
    banner: "/img/governance/treasury.webp",
    categoryId: "governance.impact.category.treasury",
    category: "Treasury",
  },
  {
    titleId: "governance.impact.hardfork.title",
    title: "Hard fork proposals approved",
    textId: "governance.impact.hardfork.text",
    text: "Protocol upgrades including the Plomin hard fork were proposed and ratified through community governance.",
    date: "November 2025",
    blog: "/news/2025-11-20-hard-fork-proposal",
    banner: "/img/governance/hardfork.webp",
    categoryId: "governance.impact.category.protocol",
    category: "Protocol",
  },
  {
    titleId: "governance.impact.params.title",
    title: "Protocol parameters changed",
    textId: "governance.impact.params.text",
    text: "SPOs and DReps voted on protocol parameter changes, including stake pool economics and governance thresholds.",
    date: "February 2026",
    blog: "/news/2026-02-10-call-to-action-spo-parameter-changes",
    banner: "/img/governance/params.webp",
    categoryId: "governance.impact.category.protocol",
    category: "Protocol",
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

      <div className={styles.timeline}>
        {milestones.map((m) => (
          <a href={m.blog} key={m.titleId} className={styles.milestoneCard}>
            <span className={styles.timelineDot} aria-hidden="true" />
            <div className={styles.milestoneBanner}>
              <img src={useBaseUrl(m.banner)} alt={translate({id: m.titleId, message: m.title})} />
            </div>
            <div className={styles.milestoneContent}>
              <span className={styles.milestoneDate}>{m.date}</span>
              <h3>{translate({id: m.titleId, message: m.title})}</h3>
              <p className="black-text">{translate({id: m.textId, message: m.text})}</p>
              <span className={styles.categoryPill}>
                {translate({id: m.categoryId, message: m.category})}
              </span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

function ToolsGrid() {
  return (
    <>
      <Divider text={translate({id: 'governance.divider.tools', message: 'Governance tools'})} id="tools" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.tools.intro', message: 'Tools to help you participate in Cardano governance.'})}
      </p>
      <SpacerBox size="small" />
      <AppGrid
        tags={['governance']}
        showRank={false}
        showStats={false}
        ctaText={translate({id: 'governance.tools.cta', message: 'Visit'})}
        moreTitle={translate({id: 'governance.tools.more', message: 'More tools'})}
      />
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
          <Link to="/governance/delegate" className="button button--outline button--primary">
            {translate({id: 'governance.delegation.step2.buttonText', message: 'Choose a DRep'})}
          </Link>
        </div>
      ),
      checkboxLabel: translate({id: 'governance.delegation.step2.checkbox', message: 'I have chosen a DRep'}),
    },
    {
      title: translate({id: 'governance.delegation.step3.title', message: 'Delegate your voting power'}),
      description: translate({id: 'governance.delegation.step3.description', message: 'Sign a delegation transaction directly on cardano.org or with another tool.'}),
      content: (
        <div>
          <p>{translate({id: 'governance.delegation.step3.text', message: 'Connect your wallet, pick your DRep, and sign one transaction. Your ada stays in your wallet at all times.'})}</p>
          <Link to="/governance/delegate" className="button button--outline button--primary">
            {translate({id: 'governance.delegation.step3.buttonText', message: 'Open delegation tool'})}
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
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": governanceFAQ.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer.join(" "),
              },
            })),
          })}
        </script>
      </Head>
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
          <Divider text={translate({id: 'governance.divider.paths', message: 'Choose your path'})} id="paths" />
          <SpacerBox size="small" />
          <GovernancePathsSection />
          <div className="row">
            <div className="col col--8">
              <FAQSection data={governanceFAQ} />
            </div>
            <div className="col col--4" style={{display: 'flex', alignItems: 'flex-end'}}>
              <SurveyCard
                surveyData={governanceRoleSurvey}
                title={translate({id: 'governance.survey.title', message: 'Not sure where to start?'})}
                description={translate({id: 'governance.survey.description', message: 'Answer a few questions to find out which governance role fits you best.'})}
                buttonText={translate({id: 'governance.survey.buttonText', message: 'Find your role'})}
              />
            </div>
          </div>
          <SpacerBox size="medium" />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"solidBlue"}>
          <BoundaryBox>
            <GovernanceBlueSection />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <ImpactTimeline />
            <SpacerBox size="medium" />
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
            <TermExplainer category="governance" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <ToolsGrid />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
