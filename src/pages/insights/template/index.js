import React, { useState, useEffect, useRef } from 'react';
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import Head from '@docusaurus/Head';
import axios from 'axios';
import * as echarts from 'echarts';
import authors from '@site/src/data/authors.json';
import { useLocation } from '@docusaurus/router';

// 🔹 Export meta so the indexer (mod.meta) can read it, even though indexed=false
export const meta = {
  pageName: 'template',
  pageTitle: 'Insights Template | cardano.org',
  pageDescription: 'Insights Template',
  title: 'This is just an insights template',
  date: '2025-03-17',
  og: {
    title: 'This is just an insights template | Cardano.org',
    description: 'Detailed description for open graph pages, and more.'
  },
  tags: ['governance'],
  indexed: false
};

// 🔹 Minimal ECharts (no d3 dependency)
export function ExampleDonutChart() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          { name: 'A', value: 30 },
          { name: 'B', value: 70 },
        ],
      }],
    });
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, []);
  return <div style={{width: 300, height: 300}} ref={ref} />;
}

function PageContent() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const location = useLocation();
  const search = location?.search ?? '';

  const API_URL = customFields.CARDANO_ORG_API_URL;
  const API_KEY = customFields.CARDANO_ORG_API_KEY;

  const [error, setError] = useState(null);

  const pageTitle = meta.pageTitle;
  const pageDescription = meta.pageDescription;
  const pageKeywords = 'Cardano, Insights, Template'; // define or remove
  const canonicalUrl = `https://www.cardano.org/insights/${meta.pageName}`;

  // insert custom data fetching logic here (e.g., API calls, hooks, etc.)

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:logo" content="img/cardano-logo-blue.svg" />
        <meta property="og:image" content={`/img/insights/${meta.pageName}.png`} />
        <meta property="og:url" content={`${canonicalUrl}${search}`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`/img/insights/${meta.pageName}.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": pageTitle,
          "description": pageDescription,
          "url": canonicalUrl
        })}</script>
      </Head>

      <p>
        You don't need to use TitleWithText or similar components—plain HTML is fine.
        For internal links use: <Link to="/where-to-get-ada">where to get ada?</Link>
      </p>

      <p>
        For external links use: <Link href="https://developers.cardano.org">developers.cardano.org</Link>
      </p>

      <ExampleDonutChart />

      <InsightsFooter lastUpdated={meta.date} />
    </>
  );
}

export default function InsightsTemplate() {
  return (
    <InsightsLayout meta={meta}>
      {/* 🔹 Correct prop — pageName lives at the top level of meta */}
      <OpenGraphInfo
        pageName={meta.pageName}
        title={meta.og.title}
        description={meta.og.description}
      />
      <PageContent />
    </InsightsLayout>
  );
}
