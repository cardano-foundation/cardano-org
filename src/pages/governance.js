import React from "react";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import GovernanceBlueSection from "@site/src/components/GovernanceBlueSection";
import GovernancePulse from "@site/src/components/GovernancePulse";
import GovernancePathsSection from "@site/src/components/GovernancePathsSection";
import TermExplainer from "@site/src/components/TermExplainer";
import SurveyCard from "@site/src/components/SurveyCard";
import GovernanceFAQ from "@site/src/components/GovernanceFAQ";
import DelegationFlow from "@site/src/components/DelegationFlow";
import RoleCard from "@site/src/components/Layout/RoleCard";
import ConnectionLine from "@site/src/components/Layout/ConnectionLine";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import AppTile, { StarBadge } from "@site/src/components/AppTile";
import { Showcases } from "@site/src/data/apps";
import { compareByActivityThenPick } from "@site/src/utils/appStats";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { FaUsers, FaServer, FaUniversity, FaShieldAlt, FaCompass } from "react-icons/fa";
import Translate, {translate} from '@docusaurus/Translate';
import styles from "./governance.module.css";
import { getGovernanceRoleSurvey } from "@site/src/data/governanceRoleSurvey";
import { getGovernanceFAQ } from "@site/src/data/governanceFAQ";
import { faqJsonLd } from "@site/src/utils/jsonLd";

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
  const drep = (
    <RoleCard
      accent="blue"
      icon={<FaUsers />}
      title={translate({id: 'governance.onboarding.dreps.title', message: 'Delegated Representatives'})}
    >
      {translate({id: 'governance.onboarding.dreps.text', message: 'DReps vote on governance proposals on behalf of ada holders who delegate to them.'})}
      <Link to="/governance/accountability#dreps" className={styles.roleLink}>
        {translate({id: 'governance.accountability.link.expectations', message: 'What is expected of them'})}
      </Link>
    </RoleCard>
  );
  const spo = (
    <RoleCard
      accent="violet"
      icon={<FaServer />}
      title={translate({id: 'governance.onboarding.spos.title', message: 'Stake Pool Operators'})}
    >
      {translate({id: 'governance.onboarding.spos.text', message: 'SPOs validate transactions and vote on hard forks, security-relevant parameters, and no-confidence motions.'})}
      <Link to="/governance/accountability#spos" className={styles.roleLink}>
        {translate({id: 'governance.accountability.link.expectations', message: 'What is expected of them'})}
      </Link>
    </RoleCard>
  );
  const committee = (
    <RoleCard
      accent="teal"
      icon={<FaUniversity />}
      title={translate({id: 'governance.onboarding.cc.title', message: 'Constitutional Committee'})}
    >
      {translate({id: 'governance.onboarding.cc.text', message: 'The Constitutional Committee ensures that governance proposals align with Cardano\'s constitution.'})}
      <Link to="/governance/accountability#committee" className={styles.roleLink}>
        {translate({id: 'governance.accountability.link.expectations', message: 'What is expected of them'})}
      </Link>
    </RoleCard>
  );

  return (
    <>
      <Divider text={translate({id: 'governance.divider.howItWorks', message: 'How Cardano governance works'})} id="how-it-works" />
      <SpacerBox size="small" />
      <p className="black-text">
        <Translate
          id="governance.onboarding.intro"
          values={{
            treasuryFunding: (
              <Link to="/governance/treasury">
                {translate({id: 'governance.onboarding.introTreasuryLink', message: 'treasury funding'})}
              </Link>
            ),
          }}
        >
          {'Cardano is governed by its community. Three groups vote on proposals that shape the network. Together, they decide on everything from protocol upgrades to {treasuryFunding}.'}
        </Translate>
      </p>
      <TitleWithText
        description={translate({id: 'governance.onboarding.background', message: "New to the topic? [Who created Cardano and who runs it now](/what-is-cardano#history) gives the background in plain language, and the glossary explains what a [DRep](/glossary/drep), a [governance action](/glossary/governance-action) and the [constitution](/glossary/constitution) are."})}
      />
      <SpacerBox size="small" />

      <div className={styles.rolesTriangle}>
        <div className={styles.areaDrep}>{drep}</div>
        <div className={styles.areaSpo}>{spo}</div>
        <div className={styles.areaCommittee}>{committee}</div>
        <svg
          className={styles.connections}
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="500" y1="210" x2="300" y2="430" className={styles.connLine} />
          <line x1="500" y1="210" x2="700" y2="430" className={styles.connLine} />
          <line x1="300" y1="430" x2="700" y2="430" className={styles.connLine} />
          <circle cx="500" cy="210" r="6" className={styles.connNode} />
          <circle cx="300" cy="430" r="6" className={styles.connNode} />
          <circle cx="700" cy="430" r="6" className={styles.connNode} />
        </svg>
        <ConnectionLine direction="vertical" className={styles.mobileVLine1} />
        <ConnectionLine direction="vertical" className={styles.mobileVLine2} />
      </div>

      <SpacerBox size="small" />
      <div className={styles.calloutWrap}>
        <HighlightCallout icon={<FaShieldAlt />}>
          {translate({id: 'governance.onboarding.together', message: 'Together, they represent, validate, and safeguard Cardano governance. No single group can make decisions alone.'})}
        </HighlightCallout>
      </div>
      <SpacerBox size="small" />
      <p className={styles.accountabilityCta}>
        <Link to="/governance/accountability" className="button button--primary">
          {translate({id: 'governance.onboarding.accountabilityCta', message: 'See what the community expects of them'})}
        </Link>
      </p>
    </>
  );
}


const milestones = [
  {
    titleId: "governance.impact.amendmentPortal.title",
    title: "Constitutional Amendment Portal opened",
    textId: "governance.impact.amendmentPortal.text",
    text: "Intersect opened the Constitutional Amendment Portal for alpha testing, giving the community a structured place to propose, discuss and refine changes to the Cardano Constitution.",
    date: "August 2026",
    blog: "/news/2026-08-07-constitutional-amendment-portal",
    banner: "/img/governance/constitution.webp",
    categoryId: "governance.impact.category.constitution",
    category: "Constitution",
  },
  {
    titleId: "governance.impact.committee2026.title",
    title: "Second Constitutional Committee election",
    textId: "governance.impact.committee2026.text",
    text: "DReps and SPOs ratified the 2026 committee update in epoch 653, filling four seats of the Constitutional Committee. The new members take office in epoch 654.",
    date: "September 2026",
    blog: "/news/2026-07-16-media-constitutional-committee-election-2026",
    banner: "/img/governance/committee.webp",
    categoryId: "governance.impact.category.committee",
    category: "Committee",
  },
  {
    titleId: "governance.impact.params.title",
    title: "SPOs and DReps voted on Plutus limits",
    textId: "governance.impact.params.text",
    text: "The community voted on raising Plutus execution limits to expand smart contract capacity, letting DApps run more logic per transaction.",
    date: "February 2026",
    blog: "/news/2026-02-10-call-to-action-spo-parameter-changes",
    banner: "/img/governance/params.webp",
    categoryId: "governance.impact.category.protocol",
    category: "Protocol",
  },
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
    titleId: "governance.impact.hardfork.title",
    title: "Hard fork to Protocol v11 enacted",
    textId: "governance.impact.hardfork.text",
    text: "The van Rossem hard fork moved Cardano to Protocol Version 11 on 18 July 2026 after DReps, SPOs and the Constitutional Committee approved the hard fork initiation action on-chain.",
    date: "July 2026",
    blog: "/news/2026-07-17-weekly-development-report",
    banner: "/img/governance/hardfork.webp",
    categoryId: "governance.impact.category.protocol",
    category: "Protocol",
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
];

function ImpactTimeline() {
  const { withBaseUrl } = useBaseUrlUtils();
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
          <Link to={m.blog} key={m.titleId} className={styles.milestoneCard}>
            <span className={styles.timelineDot} aria-hidden="true" />
            <div className={styles.milestoneBanner}>
              <img src={withBaseUrl(m.banner)} alt={translate({id: m.titleId, message: m.title})} />
            </div>
            <div className={styles.milestoneContent}>
              <span className={styles.milestoneDate}>{m.date}</span>
              <h3>{translate({id: m.titleId, message: m.title})}</h3>
              <p className="black-text">{translate({id: m.textId, message: m.text})}</p>
              <span className={styles.categoryPill}>
                {translate({id: m.categoryId, message: m.category})}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

// Same tiles and ordering as the /apps category panels: most active by
// on-chain transactions first, maintainer pick as tiebreaker (star badge),
// then alphabetically for a stable order.
const GOVERNANCE_TOOLS = Showcases
  .filter((app) => app.category === 'governance')
  .sort(compareByActivityThenPick);

function ToolsGrid() {
  return (
    <>
      <Divider text={translate({id: 'governance.divider.tools', message: 'Governance tools'})} id="tools" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.tools.intro', message: 'Tools to help you participate in Cardano governance.'})}
      </p>
      <SpacerBox size="small" />
      <div className={styles.toolsGrid}>
        {GOVERNANCE_TOOLS.map((app) => (
          <AppTile key={app.slug} app={app} badge={app.maintainerPick ? <StarBadge /> : null} />
        ))}
      </div>
      <SpacerBox size="small" />
      <p>
        <Link to="/apps?tags=governance">
          {translate({id: 'governance.tools.more', message: 'More tools'})}
        </Link>
      </p>
    </>
  );
}

function getOptionsCompareData() {
  // Row order of every card. The row count is mirrored by the grid-row spans
  // of .compareCard and .compareList in governance.module.css.
  const aspects = [
    { key: "time", label: translate({ id: "governance.compare.aspect.time", message: "Time" }) },
    { key: "cost", label: translate({ id: "governance.compare.aspect.cost", message: "Cost" }) },
    { key: "gain", label: translate({ id: "governance.compare.aspect.gain", message: "What you get" }) },
    { key: "watch", label: translate({ id: "governance.compare.aspect.watch", message: "Keep in mind" }) },
    { key: "visibility", label: translate({ id: "governance.compare.aspect.visibility", message: "Who can see it" }) },
  ];
  const options = [
    {
      key: "none",
      title: translate({ id: "governance.compare.none.title", message: "Don't delegate" }),
      cells: {
        time: translate({ id: "governance.compare.none.time", message: "Nothing to set up." }),
        cost: translate({ id: "governance.compare.none.cost", message: "Nothing." }),
        gain: translate({ id: "governance.compare.none.gain", message: "No decisions to make." }),
        watch: translate({ id: "governance.compare.none.watch", message: "Governance decisions are made without your stake." }),
        visibility: translate({ id: "governance.compare.none.visibility", message: "Nothing new is recorded on the chain." }),
      },
    },
    {
      key: "delegate",
      title: translate({ id: "governance.compare.delegate.title", message: "Delegate" }),
      subtitle: translate({ id: "governance.compare.delegate.subtitle", message: "To a DRep, Abstain or No Confidence" }),
      cells: {
        time: translate({ id: "governance.compare.delegate.time", message: "A few minutes to set up. If you pick a DRep, look at their votes now and then." }),
        cost: translate({ id: "governance.compare.delegate.cost", message: "A transaction fee, typically less than 0.2 ada. No deposit." }),
        gain: translate({ id: "governance.compare.delegate.gain", message: "Your stake takes part in governance through the option you choose, and you can switch at any time." }),
        watch: translate({ id: "governance.compare.delegate.watch", message: "A DRep may vote differently than you would, or stop voting. Abstain and No Confidence apply a fixed rule to every vote." }),
        visibility: translate({ id: "governance.compare.delegate.visibility", message: "Your choice is recorded on the chain and linked to your stake address." }),
      },
    },
    {
      key: "drep",
      title: translate({ id: "governance.compare.drep.title", message: "Become a DRep" }),
      cells: {
        time: translate({ id: "governance.compare.drep.time", message: "Regular time to read proposals, vote and explain your votes." }),
        cost: translate({ id: "governance.compare.drep.cost", message: "A deposit of 500 ada, returned when you retire, plus transaction fees." }),
        gain: translate({ id: "governance.compare.drep.gain", message: "A direct vote on treasury withdrawals, protocol changes and the constitution, weighted by the stake delegated to you." }),
        watch: translate({ id: "governance.compare.drep.watch", message: "The protocol does not pay DReps. Delegators expect you to explain your votes." }),
        visibility: translate({ id: "governance.compare.drep.visibility", message: "Every vote is recorded on the chain under your DRep ID, with a link to any rationale you publish." }),
      },
    },
  ];
  return { aspects, options };
}

// Side-by-side view of the participation options. The tabs above show one
// path at a time, this block is the only place where they sit next to each
// other. Rows line up across cards through CSS subgrid.
function GovernanceOptionsCompare() {
  const { aspects, options } = getOptionsCompareData();
  return (
    <section aria-labelledby="compare-options-title">
      <Divider text={translate({ id: "governance.compare.divider", message: "Compare your options" })} id="compare" />
      <h2 id="compare-options-title" className={styles.compareTitle}>
        {translate({ id: "governance.compare.title", message: "What each option involves" })}
      </h2>
      <p className={styles.compareIntro}>
        {translate({ id: "governance.compare.intro", message: "Here is what each choice asks of you and what it gives you in return." })}
      </p>
      {/* role="list" keeps list semantics in Safari/VoiceOver despite list-style: none */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul role="list" className={styles.compareGrid}>
        {options.map((option) => (
          <li key={option.key} className={styles.compareCard}>
            <div>
              <h3 className={styles.compareCardTitle}>{option.title}</h3>
              {option.subtitle && <p className={styles.compareSubtitle}>{option.subtitle}</p>}
            </div>
            <dl className={styles.compareList}>
              {aspects.map(({ key, label }) => (
                <div key={key} className={styles.compareRow}>
                  <dt className={styles.compareLabel}>{label}</dt>
                  <dd className={styles.compareValue}>{option.cells[key]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Governance() {
  const governanceFAQ = getGovernanceFAQ();
  return (
    <Layout
      title={translate({id: 'governance.meta.title', message: 'Cardano Governance - Your ada, your voice'})}
      description={translate({id: 'governance.meta.description', message: "Cardano governance gives every ada holder a voice. Delegate to a DRep, vote on proposals, or register as a delegate representative to shape the network."})}
    >
      <OpenGraphInfo pageName="governance" />
      <Head>
        <script type="application/ld+json">{faqJsonLd(governanceFAQ)}</script>
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
          <SpacerBox size="medium" />
          <GovernanceOptionsCompare />
          <SpacerBox size="medium" />
          <GovernanceFAQ data={governanceFAQ} />
          <SpacerBox size="medium" />
          <SurveyCard
            surveyData={getGovernanceRoleSurvey()}
            icon={<FaCompass />}
            title={translate({id: 'governance.survey.title', message: 'Not sure where to start?'})}
            description={translate({id: 'governance.survey.description', message: 'Take a short guided path to understand your options and find the governance role that fits you best.'})}
            buttonText={translate({id: 'governance.survey.buttonText', message: 'Find your role'})}
          />
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
          <Divider text={translate({id: 'governance.divider.delegation', message: 'How to delegate'})} id="delegate-walkthrough" />
          <SpacerBox size="small" />
          <DelegationFlow storageKey="cardano-governance-delegation-step" />
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
