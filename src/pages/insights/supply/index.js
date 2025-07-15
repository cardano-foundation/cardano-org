import React, { useState, useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import Head from '@docusaurus/Head';
import axios from 'axios';
import * as echarts from 'echarts';
import authors from '@site/src/data/authors.json';
import { useLocation } from '@docusaurus/router';

// ────────────────────────────────────────────────────────────────────────────
//  Meta Setup
// ────────────────────────────────────────────────────────────────────────────
const meta = {
  pageTitle: 'Cardano Supply Overview | cardano.org',
  pageDescription:
    'Visual representation of ada supply distribution across key categories in the Cardano network.',
  title: 'Cardano Supply Overview',
  date: '', // set dynamically
  author: authors?.['cf'],
  og: {
    pageName: 'supply',
    title: 'Cardano Supply Distribution | cardano.org',
    description: 'Explore how ada is distributed across reserves, circulation, treasury, and rewards.'
  }
};

// ────────────────────────────────────────────────────────────────────────────
//  Helper Functions & Constants
// ────────────────────────────────────────────────────────────────────────────
const MIN_EPOCH = 209;

const convertLovelacesToAda = (lovelaces) => Math.round(lovelaces / 1_000_000);

function getEpochDate(epoch) {
  const startEpoch = MIN_EPOCH;
  const startDate = new Date('2020-08-03T21:44:00Z');
  const offsetEpochs = epoch - startEpoch;
  const msPerEpoch = 5 * 24 * 60 * 60 * 1000;
  return new Date(startDate.getTime() + offsetEpochs * msPerEpoch)
    .toISOString()
    .split('T')[0];
}

// ────────────────────────────────────────────────────────────────────────────
//  Donut Chart Component (ECharts)
// ────────────────────────────────────────────────────────────────────────────
function DonutChartEcharts({ chartData }) {
  const chartRef = useRef(null);
  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const seriesData = chartData.filter(d => d.show_in_donut) .map(d => ({ name:  d.label, value: convertLovelacesToAda(d.value), itemStyle: { color: d.color }, context_info: d.context_info }));
    chart.setOption({
      tooltip: { trigger: 'item', formatter: params => { const { name, value, percent, data } = params; return ` ${name}: ${value.toLocaleString()} ADA (${percent}%)<br/>` + `${data.context_info}`; } },
      series: [
        {
          name: 'ada supply',
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
            position: 'outside',
            formatter: ({ data }) => `${data.name}: ${data.value.toLocaleString()} ada`
          },
          emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
          labelLine: { show: true },
          data: seriesData
        }
      ]
    });
    return () => chart.dispose();
  }, [chartData]);

  return <div ref={chartRef} style={{ height: '400px', width: '100%' }} />;
}

// ────────────────────────────────────────────────────────────────────────────
//  Main Page Content
// ────────────────────────────────────────────────────────────────────────────
function PageContent() {
  const {
    siteConfig: { customFields }
  } = useDocusaurusContext();
  const location = useLocation();
  const urlEpoch = new URLSearchParams(location.search).get('epoch');

  const API_URL = customFields.CARDANO_ORG_API_URL;
  const API_KEY = customFields.CARDANO_ORG_API_KEY;

  const [totalsCurr, setTotalsCurr] = useState(null);
  const [totalsPrev, setTotalsPrev] = useState(null);
  const [withdrawalsCurrRes, setWithdrawalsCurr] = useState([]);
  const [epochInfo, setEpochInfo] = useState(null);
  const [error, setError] = useState(null);
  const [showDonut, setShowDonut] = useState(true);

  useEffect(() => {
    if (!API_URL || !API_KEY) {
      setError('API URL or API Key is missing!');
      return;
    }
    async function fetchData() {
      try {
        // determine if page URL requests a specific and valid epoch
        const parsedEpoch = parseInt(urlEpoch, 10);
        const validEpoch = urlEpoch && !isNaN(parsedEpoch) && parsedEpoch >= MIN_EPOCH ? parsedEpoch : null;
        if (urlEpoch && (isNaN(parsedEpoch) || parsedEpoch < MIN_EPOCH)) {
          setError(`Epoch must be ≥ ${MIN_EPOCH}.`);
          return;
        }
        // set the subject epoch to either the URL requested one, or query the current epoch from the network
        const epoch_no =
          validEpoch ||
          (await axios.get(`${API_URL}/tip`, { headers: { Authorization: `Bearer ${API_KEY}` } })).data[0]
            .epoch_no;
            // query epoch data from current/requested and preceeding epochs

            const totalsCurrRes = await axios.get(
          `${API_URL}/totals${epoch_no ? `?_epoch_no=${epoch_no}` : ''}`,
          { headers: { Authorization: `Bearer ${API_KEY}` } }
        );
        setTotalsCurr({ epoch_no, ...totalsCurrRes.data[0] });

        const totalsPrevRes = await axios.get(
          `${API_URL}/totals${epoch_no ? `?_epoch_no=${epoch_no - 1}` : ''}`,
          { headers: { Authorization: `Bearer ${API_KEY}` } }
        );
        setTotalsPrev(totalsPrevRes.data[0]);

        const epochInfoRes = await axios.get(
          `${API_URL}/epoch_info?_epoch_no=${epoch_no - 2}`,
          { headers: { Authorization: `Bearer ${API_KEY}` } }
        );
        setEpochInfo(epochInfoRes.data[0]);

        let withdrawalsCurr = [];
        let offset = 0;
        let page;
        do {
          const resp = await axios.get(
            `${API_URL}/treasury_withdrawals${epoch_no ? `?select=epoch_no,amount&epoch_no=eq.${epoch_no}&` : '?'}offset=${offset}`,
            { headers: { Authorization: `Bearer ${API_KEY}` } }
          );
          page = resp.data;
          withdrawalsCurr = withdrawalsCurr.concat(page);
          offset += 1000;
        } while (page.length > 0);
        setWithdrawalsCurr(withdrawalsCurr);

      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, [API_URL, API_KEY, urlEpoch]);

  // without epoch's data we can't proceed
  if (error) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <p>Error: {error}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Try appending <code>?epoch={MIN_EPOCH + 1}</code> to the URL.
        </p>
      </>
    );
  }
  if ( !totalsCurr || !totalsPrev || !epochInfo) return <p>Loading...</p>;

  // Prepare chartData
  const chartData = [
    { label: 'Circulation', value: totalsCurr.circulation, color: '#5470c6', show_in_donut: true, context_info: 'Sum of all circulating UTxO`s' },
    { label: 'Treasury', value: totalsCurr.treasury, color: '#91cc75', show_in_donut: true, context_info: 'All ada currently allocated to the treasury pot.' },
    { label: 'Rewards', value: totalsCurr.reward, color: '#fac858', show_in_donut: true, context_info: 'All unclaimed Rewards' },
    { label: 'Deposits Stake', value: totalsCurr.deposits_stake, color: '#ee6666', show_in_donut: true, context_info: 'Deposit pot for all currently registered Stake pools and all Staking Accounts.' },
    { label: 'Deposits DRep', value: totalsCurr.deposits_drep, color: '#73c0de', show_in_donut: true, context_info: 'Deposit pot for all currently registered DRep`s' },
    { label: 'Deposits Proposal', value: totalsCurr.deposits_proposal, color: '#3ba272', show_in_donut: true, context_info: 'Deposit pot for all currently active Governance actions.' },
    { label: 'Fees', value: totalsCurr.fees, color: '#fc8452', show_in_donut: true, context_info: 'The amount of ada collected in the fee pot.' },
    { label: 'Total Supply', value: totalsCurr.supply, color: '#999999', show_in_donut: false, context_info: 'All ada currently in circulation, unclaimed rewards, all deposits, fees and the treasury.' },
    { label: 'Reserves', value: totalsCurr.reserves, color: '#9a60b4', show_in_donut: true, context_info: 'The remaining difference between maximum and total Supply' }
  ];
  const maxSupply = chartData.filter((d) => d.show_in_donut).reduce((sum, d) => sum + parseInt(d.value), 0);
  chartData.push({ label: 'Maximum supply', value: maxSupply, color: '#444444', show_in_donut: false, context_info: 'The maximum amount of ada that can ever exist, based on the genesis block definition.' });

  const epochDate = getEpochDate(totalsCurr.epoch_no);

  // total delta calculations
  const deltaReserves = totalsPrev.reserves - totalsCurr.reserves;
  let percentOfReserves = ((deltaReserves / totalsCurr.reserves) * 100).toFixed(2);
  const deltaSupply = totalsCurr.supply - totalsPrev.supply;
  let percentOfSupply = ((deltaSupply / totalsCurr.supply) * 100).toFixed(2);
  const deltaTreasury = totalsCurr.treasury - totalsPrev.treasury;
  let percentOfTreasury = ((deltaTreasury / totalsCurr.treasury) * 100).toFixed(2);
  let percentFeesOfDeltaReserves = ((epochInfo.fees / deltaReserves) * 100).toFixed(2);
  let averageTxFee = (epochInfo.fees / epochInfo.tx_count).toFixed(0) 
  const totalTreasuryWithdrawals = withdrawalsCurrRes.reduce((sum, w) => sum + parseInt(w.amount, 10), 0 );


  return (
    <>  
      <Head>
        <title>{`Cardano Supply – Epoch ${totalsCurr.epoch_no} (${epochDate})`}</title>
        <meta property="og:title" content={`Cardano Supply – Epoch ${totalsCurr.epoch_no} (${epochDate})`} />
        <meta
          property="og:description"
          content={`ada supply distribution for epoch ${totalsCurr.epoch_no}, started on ${epochDate}`} />
      </Head>

      <TitleWithText
        description={[
          /* description based on URL epoch parameter */
          (urlEpoch ?
            // For custom epochs, past data
            `This Cardano insight page visualizes the complete ada supply distribution for **epoch ${totalsCurr.epoch_no}** which started on **${epochDate}**. It shows how the total supply was distributed across all categories at that time.` :
            // Default for live data
            `This Cardano insight page visualizes the complete ada supply distribution for **epoch ${totalsCurr.epoch_no}** which started on **${epochDate}**. It shows how the total supply is currently distributed across all categories.`
          )
        ]}
        headingDot
      />

      {/* donut/table Toggle Switch */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '1rem 0'  }}>
        <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>Donut / Table view</span>
        <label           style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
          <input type="checkbox" checked={!showDonut} onChange={() => setShowDonut(!showDonut)} style={{ opacity: 0, width: 0, height: 0 }} />
          <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: showDonut ? '#ccc' : '#2196F3', transition: '.4s', borderRadius: '24px' }} />
          <span style={{ position: 'absolute', height: '18px', width: '18px', left: showDonut ? '4px' : '28px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%'  }} />
        </label>
      </div>

      {/* Conditional Render donut or table */}
      {showDonut ? (
        <DonutChartEcharts chartData={chartData} />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: '0.8em' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', textAlign: 'right' }}>Category</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>ada</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>%</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((d) => {
                const pct = ((d.value / maxSupply) * 100).toFixed(2);
                const boldStyle = !d.show_in_donut ? { fontWeight: 'bold' } : {};
                return (
                  <tr key={d.label} style={{ borderBottom: '1px solid #dee2e6', ...boldStyle }}>
                    <td style={{ padding: '8px', textAlign: 'left', ...boldStyle }}>{d.label}</td>
                    <td style={{ padding: '8px', textAlign: 'right', ...boldStyle }}>{convertLovelacesToAda(d.value).toLocaleString()} ada</td>
                    <td style={{ padding: '8px', textAlign: 'right', ...boldStyle }}>{pct}%</td>
                    <td style={{ padding: '8px', textAlign: 'left', fontWeight: 'normal'}}>{d.context_info}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>FAQ</h3>
        <p><strong>Q: How did the values change compared to the previous Epoch?</strong></p>
        <p>
          A: At the start of epoch {totalsCurr.epoch_no}, the Cardano Ouroboros protocol distributed the staking rewards for epoch {totalsCurr.epoch_no - 2} and all transaction fees collected in Epoch {totalsCurr.epoch_no - 1}. 
          This transfered <strong>{convertLovelacesToAda(deltaReserves).toLocaleString()} ada</strong> from the reserves to the active supply, equivalent to a {percentOfReserves} % decrease in reserves and a {percentOfSupply} % increase in active supply compared to the last Epoch.
        </p>

        <p><strong>Q: How much ada was added to the treasury ?</strong></p>
        <p>
          A: From the Epoch {totalsCurr.epoch_no} reward distribution, <strong>{convertLovelacesToAda(deltaTreasury).toLocaleString()} ada</strong> was allocated to the treasury, representing a {percentOfTreasury} % increase compared to the last Epoch.
        </p>

        <p><strong>Q: How many fees were collected in Epoch {totalsCurr.epoch_no}?</strong></p>
        <p>
          A: A total of <strong>{convertLovelacesToAda(epochInfo.fees).toLocaleString()} ada</strong> were paid across {epochInfo.tx_count} transactions at an average fee of {(averageTxFee / 1_000_000).toFixed(2)} ada, contributing {percentFeesOfDeltaReserves} % of the total rewards distributed in this Epoch. 
        </p>
        
        <p><strong>Q: Were there withdrawals from the treasury in epoch {totalsCurr.epoch_no}?</strong></p>
        <p>
        {withdrawalsCurrRes.length === 0 ? (
            `A: There were no treasury withdrawals during this Epoch`
          ) : withdrawalsCurrRes.length === 1 ? (
            `A: There was 1 treasury withdrawal totaling ${convertLovelacesToAda(totalTreasuryWithdrawals).toLocaleString()} ada.`
          ) : (
            `A: There were ${withdrawalsCurrRes.length} treasury withdrawals totaling ${convertLovelacesToAda(
              totalTreasuryWithdrawals
            ).toLocaleString()} ada.`
          )}
        </p>
       </div> 

      {/* Footer inside PageContent */}
      <InsightsFooter lastUpdated={`${epochDate} (epoch ${totalsCurr.epoch_no})`} epoch={totalsCurr.epoch_no} />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  Page Wrapper
// ────────────────────────────────────────────────────────────────────────────
export default function SupplyPage() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo {...meta.og} />
      <PageContent />
    </InsightsLayout>
  );
}
