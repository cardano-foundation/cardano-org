import React, { useEffect, useState, useRef } from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import { useHistory } from '@docusaurus/router';
import Link from "@docusaurus/Link";
import Heading from '@theme/Heading';
import {translate} from '@docusaurus/Translate';

// Layout components 
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import GovernanceCharts from "@site/src/components/GovernanceCharts";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import authors from '@site/src/data/authors.json';

// ────────────────────────────────────────────────────────────────────────────
//  Page Meta
// ────────────────────────────────────────────────────────────────────────────
export const meta = {
  pageName: 'governance-actions',
  pageTitle: translate({id: 'insightsGovernance.meta.pageTitle', message: 'Cardano Governance Action Charts'}),
  pageDescription: translate({id: 'insightsGovernance.meta.pageDescription', message: 'Visual representation of Cardano Governance Action process flows.'}),
  title: translate({id: 'insightsGovernance.meta.title', message: 'Cardano Governance Actions'}),
  date: '2025-04-09',
  og: {
    title: translate({id: 'insightsGovernance.og.title', message: 'Cardano Governance Actions'}),
    description: translate({id: 'insightsGovernance.og.description', message: 'Explore the Cardano Governance Action flow logic.'})
  },
  tags: ['governance'],
  indexed: true
};

// ────────────────────────────────────────────────────────────────────────────
//  Main page content
// ────────────────────────────────────────────────────────────────────────────
function PageContent() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const location = useLocation();
  const history = useHistory();

  const SEPARATOR = '_'; // readable URL-Separator (don't change without implementing a backward compatible handling for URLs in the wild)
  const searchParams = new URLSearchParams(location.search);
  // Parse initial selections from URL
  const initialCategory = searchParams.get('category') || null;
  const initialParameters = (searchParams.get('parameter') || '')
    .split(SEPARATOR)
    .map(s => s.trim())
    .filter(Boolean);

  // Build query string deterministically from selection
  const buildSearchFromSelection = ({ category, parameters }) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (parameters && parameters.length) {
      // stable and de-duplicated
      const normalized = Array.from(new Set(parameters)).sort();
      params.set('parameter', normalized.join(SEPARATOR));
    }
    const s = params.toString();
    return s ? `?${s}` : '';
  };
  
  // Canonical URL (optional: keep parameters for shareability)
  const pageTitle = translate({id: 'insightsGovernance.page.title', message: 'Cardano Governance Action Charts'});
  const pageDescription = translate({id: 'insightsGovernance.page.description', message: 'Explore the Cardano Governance Action Flows in a visual chart visualization'});
  const pageKeywords = translate({id: 'insightsGovernance.page.keywords', message: 'Cardano, governance, action, DRep, SPO, voting, threshold'});
  const canonicalUrlBase = `https://www.cardano.org/insights/governance-actions`;
  const canonicalUrl = canonicalUrlBase;
  
  // Push selection back to URL (without scroll jump or page reload)
  const handleSelectionChange = ({ category, parameters }) => {
    const nextSearch = buildSearchFromSelection({ category, parameters });
    // update only if different
    if (nextSearch === (location.search || '')) return;
    history.replace(`${location.pathname}${nextSearch}${location.hash || ''}`);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:logo" content="img/cardano-logo-blue.svg" />
        <meta property="og:image" content={`/img/insights/${meta.pageName}.png`} />
        <meta property="og:url" content={`https://www.cardano.org/insights/${meta.pageName}${location.search || ''}`} />
		<meta name="twitter:title" content={pageTitle} />
		<meta name="twitter:description" content={pageDescription} />
		<meta name="twitter:image" content={`/img/insights/${meta.pageName}.png`} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:url" content={`https://www.cardano.org/insights/${meta.pageName}`} />
        <link rel="canonical" href={`https://www.cardano.org/insights/${meta.pageName}`} />
        <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "${pageTitle}",
          "description": "${pageDescription}",
          "url": "${canonicalUrl}"
        }
        `}</script>
      </Head>

      <TitleWithText
        description={[
          translate({id: 'insightsGovernance.intro.paragraph1', message: '**Governance Actions Insights** visualizes the seven Cardano governance action types as flowcharts. Each chart shows the lifecycle (submission → ratification → enactment), who votes (DReps, SPOs, Constitutional Committee) and the thresholds. Most actions require approval from **at least two of the three** bodies; some require **all three**. For definitions and full thresholds, see the [Developer Portal: Governance Actions](https://developers.cardano.org/docs/governance/cardano-governance/governance-actions/).'}),
          translate({id: 'insightsGovernance.intro.paragraph2', message: 'Pick a **category** (General, Info Actions, Protocol Parameter Changes, Critical Parameter Changes), then choose a **chart**. Follow the nodes; **purple boxes** indicate thresholds and enactment order. You can **download** the diagram or simply **share the URL**, the address bar updates to the chart you\'re viewing. For the formal basis, see the **Cardano Constitution – Appendix I: Guardrails** [constitution](/constitution).'}),
          translate({id: 'insightsGovernance.intro.paragraph3', message: 'For **Protocol Parameter Changes**, the charts separate routine updates (typically **DReps + CC**) from **security-critical parameters**, which also need **SPO approval**, i.e., all three bodies. Appendix I lists the critical parameters and their permitted ranges/scope.'})
        ]}
        headingDot
      />

      <BoundaryBox>
        <Divider text={translate({id: 'insightsGovernance.divider.charts', message: 'Governance Action Charts'})} id="charts" />
        <GovernanceCharts
          initialCategory={initialCategory}
          initialParameters={initialParameters}
          onSelectionChange={handleSelectionChange}
		  urlSignature={location.search || ''}
        />
        <SpacerBox size="medium" />
      </BoundaryBox>

      <InsightsFooter lastUpdated={meta.date} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  Page wrapper
// ────────────────────────────────────────────────────────────────────────────
export default function SupplyPage() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo {...meta.og} />
      <PageContent />
    </InsightsLayout>
  );
}
