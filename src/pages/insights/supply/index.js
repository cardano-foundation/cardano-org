import React, { useState, useEffect, useRef } from 'react';
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import Head from '@docusaurus/Head';
import axios from 'axios';
import * as d3 from 'd3';
import authors from '@site/src/data/authors.json';
import { useLocation } from '@docusaurus/router';

// static meta data
const meta = {
  pageTitle: 'Cardano Network | cardano.org',
  pageDescription: 'Network Data',
  title: 'Cardano Supply Breakdown',
  date: '2025-03-17',
  author: authors?.['cf'],
  og: {
    pageName: 'network',
    title: 'Cardano Supply Breakdown | Cardano.org',
    description: 'Detailed ada supply breakdown across reserves, circulation, treasury, and more.'
  }
};

// convert lovelaces to ada
const convertLovelacesToAda = (lovelaces) => Math.round(lovelaces / 1_000_000);

// minimum valid epoch (before epoch 209 everything is byron)
const MIN_EPOCH = 209;

function DonutChart({ data, rawData }) {
  const ref = useRef();
  const legendRef = useRef();

  useEffect(() => {
    if (!data || !rawData) return;
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range([
        '#0033AD', '#1B5E20', '#f44336', '#0288D1', '#FFB300', '#7B1FA2', '#E64A19', '#388E3C'
      ]);

    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);

    const arcGroups = svg.selectAll("g")
      .data(pie(data))
      .enter()
      .append("g")
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.7);
        d3.select("#tooltip")
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px")
          .style("display", "inline-block")
          .html(`<strong>${d.data.label}</strong><br/>${d.data.value.toLocaleString()} ada`);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
        d3.select("#tooltip").style("display", "none");
      });

    arcGroups.append("path")
      .attr("fill", d => color(d.data.label))
      .transition().duration(1000)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) { return arc(i(t)); };
      });

      const totalAda = Object.values(rawData).reduce((sum, v) => sum + convertLovelacesToAda(v), 0);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .transition().delay(1000).duration(500)
      .style("opacity", 1)
      .text(`${totalAda.toLocaleString()} ada`);

    const legend = d3.select(legendRef.current);
    legend.selectAll("*").remove();
    const items = legend.selectAll("legend-item")
      .data(data)
      .enter()
      .append("div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "flex-end")
      .style("margin-bottom", "4px");

    items.append("div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "flex-start")
      .style("gap", "0.5rem")
      .style("width", "280px")
      .each(function (d) {
        const container = d3.select(this);
        container.append("div")
          .style("width", "12px")
          .style("height", "12px")
          .style("background-color", color(d.label))
          .style("border-radius", "2px");
        container.append("span")
          .style("flex", "1")
          .style("text-align", "right")
          .text(`${d.label}: ${d.value.toLocaleString()} ada`);
      });

    return () => { d3.select(ref.current).selectAll("*").remove(); };
  }, [data, rawData]);

  return (
    <div>
      <svg ref={ref}></svg>
      <div ref={legendRef} style={{ marginTop: "1rem" }}></div>
      <div id="tooltip" style={{ position: 'absolute', display: 'none', backgroundColor: 'white', color: '#000', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', pointerEvents: 'none', fontSize: '0.85rem' }}></div>
    </div>
  );
}

function PageContent() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  // great example how to get URL params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlEpoch = queryParams.get('epoch');

  const API_URL = customFields.CARDANO_ORG_API_URL;
  const API_KEY = customFields.CARDANO_ORG_API_KEY;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // fetch the latest epoch from the tip endpoint
  const fetchEpoch = async () => {
    const response = await axios.get(`${API_URL}/tip`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    return response.data[0].epoch_no;
  };

  // fetch ada supply breakdown from Koios
  const fetchSupplyData = async (epoch_no) => {
    const url = epoch_no ? `${API_URL}/totals?_epoch_no=${epoch_no}` : `${API_URL}/totals`;
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    return response.data[0];
  };

  // decide on epoch (URL param or latest) and fetch supply data
  useEffect(() => {
    if (!API_URL || !API_KEY) {
      setError('API URL or API Key is missing!');
      return;
    }

    const fetchData = async () => {
      try {
        const parsedEpoch = parseInt(urlEpoch, 10);
        const safeEpoch = urlEpoch && !isNaN(parsedEpoch) && parsedEpoch >= MIN_EPOCH ? parsedEpoch : null;

        if (urlEpoch && (isNaN(parsedEpoch) || parsedEpoch < MIN_EPOCH)) {
          setError(`Epoch must be a number and ${MIN_EPOCH} or higher.`);
          return;
        }

        const epoch_no = safeEpoch || await fetchEpoch();
        const totals = await fetchSupplyData(epoch_no);
        setData({ ...totals, epoch_no: parseInt(epoch_no, 10) });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, [API_URL, API_KEY, urlEpoch]);

  // if this produces an error, we want to let the user know, also set noindex meta tag
  // basically a good advice if you create many pages based on parameters.
  if (error) {
    return (
      <>
        <Head><meta name="robots" content="noindex" /></Head>
        <p>Error: {error}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Try appending <code>?epoch={MIN_EPOCH + 1}</code> to the URL for an example.
        </p>
      </>
    );
  }

  if (!data) return <p>Loading...</p>;

  const chartData = [
    { label: "Circulation", value: convertLovelacesToAda(data.circulation) },
    { label: "Treasury", value: convertLovelacesToAda(data.treasury) },
    { label: "Rewards", value: convertLovelacesToAda(data.reward) },
    { label: "Reserves", value: convertLovelacesToAda(data.reserves) },
    { label: "Fees", value: convertLovelacesToAda(data.fees) },
    { label: "Deposits Stake", value: convertLovelacesToAda(data.deposits_stake) },
    { label: "Deposits DRep", value: convertLovelacesToAda(data.deposits_drep) },
    { label: "Deposits Proposal", value: convertLovelacesToAda(data.deposits_proposal) }
  ];

  const legendDescription = `In epoch ${data.epoch_no}, ` + chartData
    .map(d => `${d.label} is ${d.value.toLocaleString()} ada`)
    .join(', ') + '.';

  return (
    <>
      <TitleWithText description={[`This chart visualizes the complete ada supply distribution for **epoch ${data.epoch_no}**. It shows how the total maximum supply of **45 billion ada** is currently allocated across circulation, reserves, treasury, staking deposits, and other components. Hover over each segment to explore individual values in detail.`]} headingDot={true} />

      <p>You don't need to use TitleWithText or similar components, you can use normal html here. But remember to use always the Link component. For internal links use: <Link to="/where-to-get-ada">where to get ada?</Link></p>

      <p>For external links use:<Link href="https://developers.cardano.org">developers.cardano.org</Link></p>

      <DonutChart data={chartData} rawData={{
        circulation: data.circulation,
        treasury: data.treasury,
        reward: data.reward,
        reserves: data.reserves,
        fees: data.fees,
        deposits_stake: data.deposits_stake,
        deposits_drep: data.deposits_drep,
        deposits_proposal: data.deposits_proposal
      }} />

      <p style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>{legendDescription}</p>
      <InsightsFooter lastUpdated={meta.date} />
    </>
  );
}

export default function InsightsPage() {
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
 