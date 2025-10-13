import React, { useEffect, useState, useRef } from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import { useHistory } from '@docusaurus/router';
import Link from "@docusaurus/Link";
import Heading from '@theme/Heading';

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
const meta = {
  pageTitle: 'Cardano Governance Action Charts',
  pageDescription:
    'Visual representation of Cardano Governance Action process flows.',
  title: 'Cardano Governance Actions',
  date: '2025-06-01', 
  author: authors?.['cf'],
  og: {
    pageName: 'governance-actions',
    title: 'Cardano Governance Actions',
    description:
      'Explore the Cardano Governance Action flow logic.'
  }
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
  const pageTitle = `Cardano Governance Action Charts`;
  const pageDescription = `Explore the Cardano Governance Action Flows in a visual chart visualization`;
  const pageKeywords = `Cardano, governance, action, DRep, SPO, voting, threshold`;
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
        <meta property="og:image" content="/img/insights/governancen-actions_og.png" />
        <meta property="og:url" content={`https://www.cardano.org/insights/governance-actions${location.search || ''}`} />
        <link rel="canonical" href="https://www.cardano.org/insights/governance-actions" />
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
          `This interactive insight helps you understand the different Cardano governance action types, their flows, conditions, and relations. `
        ]}
        headingDot
      />

      <BoundaryBox>
        <Divider text="Governance Action Charts" id="charts" />
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
