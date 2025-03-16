import React, { useState, useEffect, useRef } from 'react'; 
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import axios from 'axios';
import * as d3 from 'd3';

// convert Lovelaces to ada and round to the nearest full ada
const convertLovelacesToAda = (lovelaces) => {
  return Math.round(lovelaces / 1_000_000);
};

const DonutChart = ({ data }) => {
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
      .range(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.value);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const arcs = svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.label))
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.7);
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px")
          .style("display", "inline-block")
          .html(`<strong>${d.data.label}</strong><br/>${d.data.value.toLocaleString()} ada`);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
        d3.select("#tooltip").style("display", "none");
      });

    // Summe berechnen
    const total = data.reduce((sum, d) => sum + d.value, 0);

    // Text in die Mitte
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(`${total.toLocaleString()} ada`);

    // Legende
    const legend = d3.select(legendRef.current);
    legend.selectAll("*").remove();
    const items = legend.selectAll("legend-item")
      .data(data)
      .enter()
      .append("div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-bottom", "4px");

    items.append("div")
      .style("width", "12px")
      .style("height", "12px")
      .style("background-color", d => color(d.label))
      .style("margin-right", "6px");

    items.append("span")
      .text(d => `${d.label}: ${d.value.toLocaleString()} ada`);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data]);

  return (
    <div>
      <svg ref={ref}></svg>
      <div ref={legendRef} style={{ marginTop: "1rem" }}></div>
      <div id="tooltip" style={{ position: 'absolute', display: 'none', backgroundColor: 'white', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', pointerEvents: 'none', fontSize: '0.85rem' }}></div>
    </div>
  );
};

const NetworkStats = () => {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.REACT_APP_API_URL;
  const API_KEY = customFields.REACT_APP_API_KEY;

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

  return (
    <div>
      <TitleWithText title={`Supply`}  description={[`This is how the supply is made up for **epoch ${data.epoch_no}**. Hover on segments for details.`]} headingDot={true} />
      <DonutChart data={chartData} />
    </div>
  );
};

function HomepageHeader() {
  return (
    <SiteHero
      title="Network Data"
      description="Cardano mainnet network stats"
      bannerType="zoom"
    />
  );
}

export default function Home() {
  return (
    <Layout
      title="Cardano Network | cardano.org"
      description="Network Data"
    >
      <OpenGraphImage pageName="network" />
      <HomepageHeader />
      <main>
        <BoundaryBox>
          <BackgroundWrapper backgroundType="zoom">
            <NetworkStats />
            <SpacerBox size="medium" />
          </BackgroundWrapper>
        </BoundaryBox>
      </main>
    </Layout>
  );
}
