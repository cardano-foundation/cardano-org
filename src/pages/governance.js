import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import GovernanceBlueSection from "@site/src/components/GovernanceBlueSection";
import TermExplainer from "@site/src/components/TermExplainer";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import DottedImageWithText from "@site/src/components/Layout/DottedImageWithText";
import DottedImageWithButton from "@site/src/components/Layout/DottedImageWithButton";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {translate} from '@docusaurus/Translate';

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
    <div>
      <Divider text={translate({id: 'governance.divider.howItWorks', message: 'How Cardano governance works'})} id="how-it-works" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.onboarding.intro', message: 'Cardano is governed by its community. Three groups vote on proposals that shape the network. Together, they decide on everything from protocol upgrades to treasury funding.'})}
      </p>
      <SpacerBox size="small" />
      <div className="row">
        <div className="col col--4">
          <div style={{textAlign: 'center', padding: '1rem'}}>
            <img src={useBaseUrl('/img/dotted-icons/people.svg')} alt="DReps" style={{width: '80px', height: '80px'}} />
            <h3>{translate({id: 'governance.onboarding.dreps.title', message: 'Delegated Representatives'})}</h3>
            <p className="black-text">
              {translate({id: 'governance.onboarding.dreps.text', message: 'DReps vote on governance proposals on behalf of ada holders who delegate to them.'})}
            </p>
          </div>
        </div>
        <div className="col col--4">
          <div style={{textAlign: 'center', padding: '1rem'}}>
            <img src={useBaseUrl('/img/dotted-icons/decentralization.svg')} alt="SPOs" style={{width: '80px', height: '80px'}} />
            <h3>{translate({id: 'governance.onboarding.spos.title', message: 'Stake Pool Operators'})}</h3>
            <p className="black-text">
              {translate({id: 'governance.onboarding.spos.text', message: 'SPOs validate transactions and vote on technical changes like hard forks and protocol parameters.'})}
            </p>
          </div>
        </div>
        <div className="col col--4">
          <div style={{textAlign: 'center', padding: '1rem'}}>
            <img src={useBaseUrl('/img/dotted-icons/government.svg')} alt="Constitutional Committee" style={{width: '80px', height: '80px'}} />
            <h3>{translate({id: 'governance.onboarding.cc.title', message: 'Constitutional Committee'})}</h3>
            <p className="black-text">
              {translate({id: 'governance.onboarding.cc.text', message: 'The Constitutional Committee ensures that governance proposals align with Cardano\'s constitution.'})}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GovernancePathsSection() {
  return (
    <div>
      <Divider text={translate({id: 'governance.divider.getInvolved', message: 'Get involved'})} id="get-involved" />
      <SpacerBox size="small" />

      {/* Delegate path */}
      <div id="delegate">
        <DottedImageWithText
          imageName="ada-upturned-hand"
          title={translate({id: 'governance.paths.delegate.title', message: 'Delegate your voting power'})}
          text={[
            translate({id: 'governance.paths.delegate.text', message: 'You already have voting power. Delegation lends your vote to a Delegated Representative (DRep) who votes on your behalf. Your ada never leaves your wallet, it costs nothing extra, and you can change your DRep at any time.'}),
          ]}
        />
        <div style={{paddingLeft: '100px', marginTop: '-0.5rem', marginBottom: '2rem'}}>
          <Link
            to="https://tempo.vote/dreps"
            className="button button--primary button--lg"
          >
            {translate({id: 'governance.paths.delegate.buttonText', message: 'Find a DRep'})}
          </Link>
        </div>
      </div>

      {/* Become a DRep path */}
      <div id="lead">
        <DottedImageWithText
          imageName="purpose"
          title={translate({id: 'governance.paths.lead.title', message: 'Become a DRep'})}
          text={[
            translate({id: 'governance.paths.lead.text', message: 'Represent your community and shape Cardano policy. DReps actively engage in governance, stay informed on proposals, and vote on behalf of those who delegate to them. A refundable deposit of 500 ada is required and will be returned upon retirement.'}),
          ]}
        />
        <div style={{paddingLeft: '100px', marginTop: '-0.5rem', marginBottom: '2rem'}}>
          <Link
            to="https://docs.gov.tools/about/what-is-cardano-govtool/govtool-functions/dreps/register-as-a-drep"
            className="button button--primary button--lg"
          >
            {translate({id: 'governance.paths.lead.buttonText', message: 'Register as a DRep'})}
          </Link>
        </div>
      </div>

      {/* Understand path */}
      <DottedImageWithText
        imageName="research"
        title={translate({id: 'governance.paths.understand.title', message: 'Learn how governance works'})}
        text={[
          translate({id: 'governance.paths.understand.text', message: 'New to Cardano governance? Read the constitution, explore governance action charts, or browse the governance tools to understand how proposals move from submission to enactment.'}),
        ]}
      />
      <div style={{paddingLeft: '100px', marginTop: '-0.5rem', marginBottom: '2rem'}}>
        <Link
          to="/constitution"
          className="button button--primary button--lg"
        >
          {translate({id: 'governance.paths.understand.buttonText', message: 'Read the Constitution'})}
        </Link>
        {' '}
        <Link
          to="/insights/governance-actions"
          className="button button--outline button--primary button--lg"
          style={{marginLeft: '0.5rem'}}
        >
          {translate({id: 'governance.paths.understand.buttonText2', message: 'Governance Action Charts'})}
        </Link>
      </div>
    </div>
  );
}

function ImpactTimeline() {
  return (
    <div>
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
    </div>
  );
}

function ToolsGrid() {
  return (
    <div>
      <Divider text={translate({id: 'governance.divider.tools', message: 'Governance tools'})} id="tools" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.tools.intro', message: 'Tools to help you participate in Cardano governance.'})}
      </p>
      <SpacerBox size="small" />
      <div className="row" style={{justifyContent: 'center'}}>
        <div className="col col--4">
          <DottedImageWithButton
            imageName="government"
            buttonLabel={translate({id: 'governance.tools.govtool', message: 'GovTool'})}
            buttonLink="https://gov.tools"
          />
          <p className="black-text" style={{textAlign: 'center', marginTop: '0.5rem'}}>
            {translate({id: 'governance.tools.govtool.description', message: 'Vote on proposals and register as a DRep'})}
          </p>
        </div>
        <div className="col col--4">
          <DottedImageWithButton
            imageName="people"
            buttonLabel={translate({id: 'governance.tools.tempo', message: 'Tempo'})}
            buttonLink="https://tempo.vote"
          />
          <p className="black-text" style={{textAlign: 'center', marginTop: '0.5rem'}}>
            {translate({id: 'governance.tools.tempo.description', message: 'Find and compare DReps'})}
          </p>
        </div>
        <div className="col col--4">
          <DottedImageWithButton
            imageName="chains"
            buttonLabel={translate({id: 'governance.tools.adastat', message: 'AdaStat'})}
            buttonLink="https://adastat.net/governances"
          />
          <p className="black-text" style={{textAlign: 'center', marginTop: '0.5rem'}}>
            {translate({id: 'governance.tools.adastat.description', message: 'Track all governance actions'})}
          </p>
        </div>
      </div>
      <SpacerBox size="small" />
      <div className="row" style={{justifyContent: 'center'}}>
        <div className="col col--4">
          <DottedImageWithButton
            imageName="technology"
            buttonLabel={translate({id: 'governance.tools.governancespace', message: 'Governance Space'})}
            buttonLink="https://governancespace.com"
          />
          <p className="black-text" style={{textAlign: 'center', marginTop: '0.5rem'}}>
            {translate({id: 'governance.tools.governancespace.description', message: 'Governance analytics and insights'})}
          </p>
        </div>
        <div className="col col--4">
          <DottedImageWithButton
            imageName="research"
            buttonLabel={translate({id: 'governance.tools.charts', message: 'Governance Charts'})}
            buttonLink="/insights/governance-actions"
          />
          <p className="black-text" style={{textAlign: 'center', marginTop: '0.5rem'}}>
            {translate({id: 'governance.tools.charts.description', message: 'Interactive visual process guides'})}
          </p>
        </div>
        <div className="col col--4">
          <DottedImageWithButton
            imageName="opportunity"
            buttonLabel={translate({id: 'governance.tools.constitution', message: 'Constitution'})}
            buttonLink="/constitution"
          />
          <p className="black-text" style={{textAlign: 'center', marginTop: '0.5rem'}}>
            {translate({id: 'governance.tools.constitution.description', message: 'Read the governing document'})}
          </p>
        </div>
      </div>
    </div>
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
        {/* Section 3: Governance Onboarding - How it works + Roles */}
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <GovernanceRolesSection />
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Section 3b: Get involved - Delegate / Lead / Understand */}
        <BoundaryBox>
          <GovernancePathsSection />
          <SpacerBox size="medium" />
        </BoundaryBox>

        {/* Section 5: Impact Timeline */}
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <ImpactTimeline />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Section 6: Blue Statement */}
        <BackgroundWrapper backgroundType={"solidBlue"}>
          <BoundaryBox>
            <GovernanceBlueSection />
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Section 8: Tools Grid */}
        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <ToolsGrid />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        {/* Section 10: Term Explainer */}
        <BoundaryBox>
          <TermExplainer category="governance" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
