import React, { useState, useEffect, useRef } from 'react';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import axios from 'axios';
import * as d3 from 'd3';
import authors from '@site/src/data/authors.json';

const formattedDate = new Date('2025-03-17').toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Meta data for the page, including Open Graph info
const meta = {
  pageTitle: 'Cardano Network | cardano.org',
  pageDescription: 'Network Data',
  title: 'Cardano Supply Breakdown',
  date: formattedDate,
  author: authors?.['cf'],
  og: {
    pageName: 'network',
    title: 'Cardano Supply Breakdown | Cardano.org',
    description: 'Detailed ada supply breakdown across reserves, circulation, treasury, and more.'
  }
};

const convertLovelacesToAda = (lovelaces) => {
  return Math.round(lovelaces / 1_000_000);
};

function DonutChart({ data }) {
  const ref = useRef();
  const legendRef = useRef();

  useEffect(() => {
    if (!data) return;
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
        '#0033AD',
        '#1B5E20',
        '#f44336',
        '#0288D1',
        '#FFB300',
        '#7B1FA2',
        '#E64A19',
        '#388E3C'
      ]);

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

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
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t));
        };
      });

    const total = data.reduce((sum, d) => sum + d.value, 0);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1)
      .text(`${total.toLocaleString()} ada`);

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

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data]);

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
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const API_KEY = customFields.CARDANO_ORG_API_KEY;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!API_URL || !API_KEY) {
      setError('API URL or API Key is missing!');
      return;
    }

    const fetchSupplyData = async () => {
      const response = await axios({
        method: 'get',
        url: '/totals',
        baseURL: API_URL,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return response.data[0];
    };

    const fetchEpoch = async () => {
      const response = await axios({
        method: 'get',
        url: '/tip',
        baseURL: API_URL,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return response.data[0].epoch_no;
    };

    const fetchData = async () => {
      try {
        const [totals, epoch] = await Promise.all([
          fetchSupplyData(),
          fetchEpoch()
        ]);
        setData({ ...totals, epoch_no: epoch });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, [API_URL, API_KEY]);

  if (error) return <p>Error: {error}</p>;
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

  // Example to generate text out of legend
  const legendDescription = `In epoch ${data.epoch_no}, ` + chartData
  .map(d => `${d.label} is ${d.value.toLocaleString()} ada`)
  .join(', ') + '.';

  return (
    <>
      <TitleWithText
        description={[`This chart visualizes the complete ada supply distribution for **epoch ${data.epoch_no}**. It shows how the total maximum supply of **45 billion ada** is currently allocated across circulation, reserves, treasury, staking deposits, and other components. Hover over each segment to explore individual values in detail.`]}
        headingDot={true}
      />
      <DonutChart data={chartData} />

      <p style={{ marginTop: '1.5rem' }}>
        {legendDescription}
      </p>

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
