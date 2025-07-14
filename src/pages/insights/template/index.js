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

const meta = {
  pageTitle: 'Insights Template | cardano.org',
  pageDescription: 'Insights Template',
  title: 'This is just a insights template',
  date: '2025-03-17',
  author: authors?.['cf'],
  og: {
    pageName: 'network',
    title: 'This is just a insights template | Cardano.org',
    description: 'Detailed description for open graph pages, and more.'
  }
};

export function ExampleDonutChart() {
  const ref = useRef();

  useEffect(() => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const data = [
      { label: 'A', value: 30 },
      { label: 'B', value: 70 }
    ];

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(['#1f77b4', '#ff7f0e']);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);

    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .style('stroke', 'white')
      .style('stroke-width', '2px');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Donut Chart');
  }, []);

  return <svg ref={ref}></svg>;
}

function PageContent() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlEpoch = queryParams.get('epoch');

  const API_URL = customFields.CARDANO_ORG_API_URL;
  const API_KEY = customFields.CARDANO_ORG_API_KEY;

  const [error, setError] = useState(null);

  // insert custom data fetching logic here (e.g., API calls, hooks, etc.)

  return (
    <>
      <p>You don't need to use TitleWithText or similar components, you can use normal html here. But remember to use always the Link component. For internal links use: <Link to="/where-to-get-ada">where to get ada?</Link></p>

      <p>For external links use: <Link href="https://developers.cardano.org">developers.cardano.org</Link></p>

      <ExampleDonutChart />

      <InsightsFooter lastUpdated={meta.date} />
    </>
  );
}

export default function InsightsTemplate() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo 
        pageName={meta.og.pageName}
        title={meta.og.title}
        description={meta.og.description}
      />
      <PageContent />
    </InsightsLayout>
  );
}
