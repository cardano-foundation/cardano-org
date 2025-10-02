import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import * as echarts from 'echarts';
import axios from 'axios';
import { useHistory } from '@docusaurus/router';
import Link from "@docusaurus/Link";
import Heading from '@theme/Heading';

// Layout components 
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import EpochNav from '@site/src/components/Layout/InsightsEpochNav';
import authors from '@site/src/data/authors.json';

// ────────────────────────────────────────────────────────────────────────────
//  Meta
// ────────────────────────────────────────────────────────────────────────────
const meta = {
  pageTitle: 'Cardano Supply Overview',
  pageDescription:
    'Visual representation of ada supply distribution across key categories in the Cardano network.',
  title: 'Cardano Supply Overview',
  date: '', // set dynamically
  author: authors?.['cf'],
  og: {
    pageName: 'supply',
    title: 'Cardano Supply Distribution',
    description:
      'Explore how ada is distributed across reserves, circulation, treasury, and rewards.'
  }
};

// ────────────────────────────────────────────────────────────────────────────
//  Helpers & constants
// ────────────────────────────────────────────────────────────────────────────
const MIN_EPOCH = 209;
const convertLovelacesToAda = (lovelaces) => Math.round(lovelaces / 1_000_000);

function getEpochDate(epoch) {
  const startEpoch = MIN_EPOCH; // Byron→Shelley transition (approx.)
  const startDate = new Date('2020-08-03T21:44:00Z');
  const msPerEpoch = 5 * 24 * 60 * 60 * 1000;
  const offsetEpochs = epoch - startEpoch;
  return new Date(startDate.getTime() + offsetEpochs * msPerEpoch)
    .toISOString()
    .split('T')[0];
}

// ────────────────────────────────────────────────────────────────────────────
//  Donut chart (ECharts) — init once, update via setOption
// ────────────────────────────────────────────────────────────────────────────
function DonutChartEcharts({ chartData }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // init once
  useEffect(() => {
    if (!chartRef.current) return;
    chartInstanceRef.current = echarts.init(chartRef.current);
    const handleResize = () => chartInstanceRef.current && chartInstanceRef.current.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  // mobile detection
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const option = useMemo(() => {
    if (!chartData || !chartData.length) return null;

    const seriesData = chartData
      .filter((d) => d.show_in_donut)
      .map((d) => ({
        name: d.label,
        value: convertLovelacesToAda(d.value),
        itemStyle: { color: d.color },
        context_info: d.context_info
      }));

    const totalValue = seriesData.reduce((sum, it) => sum + it.value, 0);

    const legendConfig = isMobile
      ? {
          show: true,
          orient: 'horizontal',
          bottom: 10,
          left: 'center',
          textStyle: { color: isDark ? '#fff' : '#000' },
          data: seriesData.map((i) => i.name),
          formatter: (name) => {
            const item = seriesData.find((i) => i.name === name);
            const percent = item ? ((item.value / totalValue) * 100).toFixed(2) : '0.00';
            return `${name}: ${item?.value.toLocaleString()} ADA (${percent}%)`;
          }
        }
      : { show: false };

    return {
      tooltip: {
        show: !isMobile,
        trigger: 'item',
        formatter: (params) => {
          const { name, value, percent, data } = params;
          return `${name}: ${value.toLocaleString()} ADA (${percent}%)<br/>${data.context_info}`;
        }
      },
      legend: legendConfig,
      series: [
        {
          name: 'ada supply',
          type: 'pie',
          radius: ['45%', '70%'],
          center: isMobile ? ['50%', '30%'] : ['50%', '50%'],
          avoidLabelOverlap: true,
          label: {
            show: !isMobile,
            position: 'outside',
            formatter: ({ data }) => `${data.name}: ${data.value.toLocaleString()} ada`,
            textStyle: { color: isDark ? '#fff' : '#000' }
          },
          emphasis: { label: { show: !isMobile, fontSize: 16, fontWeight: 'bold' } },
          labelLine: { show: !isMobile },
          data: seriesData
        }
      ]
    };
  }, [chartData, isDark, isMobile]);

  useEffect(() => {
    if (!chartInstanceRef.current || !option) return;
    chartInstanceRef.current.setOption(option, { notMerge: false, lazyUpdate: true });
  }, [option]);

  return <div ref={chartRef} style={{ height: '400px', width: '100%' }} />;
}

// ────────────────────────────────────────────────────────────────────────────
//  Main page content
// ────────────────────────────────────────────────────────────────────────────
function PageContent() {
  const history = useHistory();
  
  const handleGoEpoch = (nextEpoch) => {
    const y = window.scrollY;                 // keep current scroll
    history.push(`?epoch=${nextEpoch}`);      // update router location
    requestAnimationFrame(() => window.scrollTo(0, y)); // restore scroll
  };

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
  const [withdrawalsPrevRes, setWithdrawalsPrev] = useState([]);
  const [epochInfoPrev1, setEpochInfoPrev1] = useState(null);
  const [epochInfoPrev2, setEpochInfoPrev2] = useState(null);
  const [currentEpochNo, setCurrentEpochNo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!API_URL || !API_KEY) {
      setError('API URL or API Key is missing!');
      return;
    }

    async function fetchData() {
      try {
        // 1) fetch current tip epoch
        const tipRes = await axios.get(`${API_URL}/tip`, {
          headers: { Authorization: `Bearer ${API_KEY}` }
        });
        const tipEpoch = tipRes.data?.[0]?.epoch_no;
        setCurrentEpochNo(tipEpoch);

        // 2) parse URL epoch
        const parsedEpoch = parseInt(urlEpoch, 10);
        const validEpoch = urlEpoch && !isNaN(parsedEpoch) && parsedEpoch >= MIN_EPOCH ? parsedEpoch : null;
        if (urlEpoch && (isNaN(parsedEpoch) || parsedEpoch < MIN_EPOCH)) {
          setError(`Epoch must be ≥ ${MIN_EPOCH}.`);
          return;
        }

        // 3) choose displayed epoch
        const displayedEpoch = validEpoch ?? tipEpoch;

        // 4) fetch data for displayed epoch
        const totalsCurrRes = await axios.get(`${API_URL}/totals?_epoch_no=${displayedEpoch}`, { headers: { Authorization: `Bearer ${API_KEY}` } });
        setTotalsCurr({ epoch_no: displayedEpoch, ...totalsCurrRes.data[0] });

        const totalsPrevRes = await axios.get(`${API_URL}/totals?_epoch_no=${displayedEpoch - 1}`, { headers: { Authorization: `Bearer ${API_KEY}` } });
        setTotalsPrev({ epoch_no: displayedEpoch-1, ...totalsPrevRes.data[0] });

        const epochInfoPrev1Res = await axios.get(`${API_URL}/epoch_info?_epoch_no=${displayedEpoch - 1}`, { headers: { Authorization: `Bearer ${API_KEY}` } });
        setEpochInfoPrev1(epochInfoPrev1Res.data[0]);

        const epochInfoPrev2Res = await axios.get(`${API_URL}/epoch_info?_epoch_no=${displayedEpoch - 2}`, { headers: { Authorization: `Bearer ${API_KEY}` } });
        setEpochInfoPrev2(epochInfoPrev2Res.data[0]);

        // withdrawals (paginated) => FAQ 
        let withdrawals = [];
        let offset = 0;
        let page;
        do {
          const resp = await axios.get(`${API_URL}/treasury_withdrawals?select=epoch_no,amount&epoch_no=eq.${displayedEpoch}&offset=${offset}`, { headers: { Authorization: `Bearer ${API_KEY}` } });
          page = resp.data || [];
          withdrawals = withdrawals.concat(page);
          offset += 1000;
        } while (page.length > 0);
        setWithdrawalsCurr(withdrawals);
		
		// repeat for previous epoch to calculate the treasury growth or depletion 
        withdrawals = [];
        offset = 0;
        do {
          const resp = await axios.get(`${API_URL}/treasury_withdrawals?select=epoch_no,amount&epoch_no=eq.${displayedEpoch-1}&offset=${offset}`, { headers: { Authorization: `Bearer ${API_KEY}` } });
          page = resp.data || [];
          withdrawals = withdrawals.concat(page);
          offset += 1000;
        } while (page.length > 0);
        setWithdrawalsPrev(withdrawals);
		
      } catch (e) {
        setError(e.message);
      }
    }

    fetchData();
  }, [API_URL, API_KEY, urlEpoch]);

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
  if (!totalsCurr || !totalsPrev || !epochInfoPrev1 || !epochInfoPrev2) return <p>Loading...</p>;

  // chart/table data
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
  const maxSupply = chartData
    .filter((d) => d.show_in_donut)
    .reduce((sum, d) => sum + parseInt(d.value, 10), 0);
  chartData.push({
    label: 'Maximum supply',
    value: maxSupply,
    color: '#444444',
    show_in_donut: false,
    context_info:
      'The maximum amount of ada that can ever exist, based on the genesis block definition.'
  });

  const displayedEpoch = totalsCurr.epoch_no;
  const epochDate = getEpochDate(displayedEpoch);
  const isCurrentEpoch = currentEpochNo != null && displayedEpoch === currentEpochNo;

  // deltas for FAQ
  const deltaReserves = totalsPrev.reserves - totalsCurr.reserves;
  const percentOfReserves = ((deltaReserves / totalsCurr.reserves) * 100).toFixed(2);
  const deltaSupply = totalsCurr.supply - totalsPrev.supply;
  const percentOfSupply = ((deltaSupply / totalsCurr.supply) * 100).toFixed(2);
  const deltaTreasury = totalsCurr.treasury - totalsPrev.treasury;
  const percentOfTreasury = ((deltaTreasury / totalsCurr.treasury) * 100).toFixed(2);
  const percentOfDeltaReserves = ((deltaTreasury / deltaReserves) * 100).toFixed(2);
  const percentFeesOfDeltaReserves = ((totalsPrev.fees / deltaReserves) * 100).toFixed(2);
  const averageTxFee = (epochInfoPrev1.fees / epochInfoPrev1.tx_count).toFixed(0);
  const totalTreasuryWithdrawalsCurr = withdrawalsCurrRes.reduce((sum, w) => sum + parseInt(w.amount, 10),0);
  const totalTreasuryWithdrawalsPrev = withdrawalsPrevRes.reduce((sum, w) => sum + parseInt(w.amount, 10),0);
  
  const netTreasuryChange = deltaTreasury; // can be negative
  const grossTreasuryAdded = totalTreasuryWithdrawalsPrev + deltaTreasury; // rewards+fees inflow
  const netTreasuryChangeAbs = Math.abs(netTreasuryChange);
  const percentTreasuryChangeAbs = Math.abs(parseFloat(percentOfTreasury)).toFixed(2);

  const pageTitle = `Cardano Supply – Epoch ${displayedEpoch} (${epochDate})`;
  const pageDescription = `ADA supply distribution for epoch ${displayedEpoch}, started on ${epochDate}.`;
  const canonicalUrl = `https://yourdomain.com/insights/supply${urlEpoch ? `?epoch=${displayedEpoch}` : ''}`;

  const navStickyClass = 'epochNavSticky'; // CSS is in custom.css

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta property="og:description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "${pageTitle}",
          "description": "${pageDescription}",
          "url": "${canonicalUrl}",
          "author": { "@type": "Organization", "name": "YourOrgName" },
          "publisher": { "@type": "Organization", "name": "YourOrgName" }
        }
        `}</script>
      </Head>

      <div className={navStickyClass}>
        <EpochNav
          displayedEpoch={displayedEpoch}
          currentEpochNo={currentEpochNo}
          minEpoch={MIN_EPOCH+1}
          onGoEpoch={handleGoEpoch}
        />
      </div>

      <TitleWithText
        description={[
          (() => {
            const base = `This insight page visualizes the complete Cardano ada supply distribution for **epoch ${displayedEpoch}** which started on **${epochDate}**. It shows how the total supply `;
            const ending = isCurrentEpoch
              ? 'is currently distributed across all categories.'
              : 'was distributed across all categories at that time.';
            return base + ending;
          })()
        ]}
        headingDot
      />

      <TitleWithText
        description={[
          `At the end of each 5-day epoch, the [Ouroboros protocol](/ouroboros), which has performed the corresponding matching calculations on all participating nodes, 
		  executes the transfer of the resulting amounts. This includes the payment of [staking rewards](/calculator), part of which is diverted to fill the development treasury.`
        ]}
        headingDot
      />

      <div aria-label="ADA supply donut chart" role="img">
        <DonutChartEcharts chartData={chartData} />
      </div>

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
                  <td style={{ padding: '8px', textAlign: 'right', ...boldStyle }}>
                    {convertLovelacesToAda(d.value).toLocaleString()} ada
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', ...boldStyle }}>{pct}%</td>
                  <td style={{ padding: '8px', textAlign: 'left', fontWeight: 'normal' }}>{d.context_info}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: '2rem' }}>
		<Heading as="h2" id="facts">Epoch {displayedEpoch} facts:</Heading>


		{/* #############################  */}
        <p>
          <strong>Q: How did the values change compared to the previous Epoch?</strong>
        </p>
        <p>
          A: At the start of epoch {displayedEpoch}, the Cardano Ouroboros protocol distributed the staking
          rewards for epoch {displayedEpoch - 2} and transaction fees collected in epoch {displayedEpoch - 1}.
          This transferred <strong>{convertLovelacesToAda(deltaReserves).toLocaleString()} ada</strong> from the
          reserves to the active supply, equivalent to a {percentOfReserves}% decrease in reserves and a&nbsp;
          {percentOfSupply}% increase in active supply.
        </p>

		{/* #############################  */}
        <p>
          <strong>Q: How much ada was added to the treasury?</strong>
        </p>
        <p>
          {netTreasuryChange > 0 ? (
            <>
              A: A total of <strong>{convertLovelacesToAda(netTreasuryChange).toLocaleString()} ada</strong>&nbsp; 
			  — { percentOfDeltaReserves }% of the overal staking rewards — was allocated to the treasury, 
			  marking a {percentOfTreasury}% increase compared to the previous epoch.
            </>
          ) : netTreasuryChange === 0 ? (
            <>
              A: There was <strong>no net change</strong> to the treasury in this epoch.&nbsp;
              {totalTreasuryWithdrawalsCurr > 0 ? (
                <>
                  <strong>{convertLovelacesToAda(totalTreasuryWithdrawalsCurr).toLocaleString()} ada</strong> were withdrawn and an equal
                  amount was added from rewards/fees.
                </>
              ) : (
                <>No additions or withdrawals were recorded.</>
              )}
            </>
          ) : (
            <>
			  A: In epoch {displayedEpoch}, rewards and fees contributed <strong>{convertLovelacesToAda(grossTreasuryAdded).toLocaleString()} ada</strong> to the treasury. 
			  However, withdrawals of <strong>{convertLovelacesToAda(totalTreasuryWithdrawalsPrev).toLocaleString()} ada</strong> from the previous epoch outweighed this amount, 
			  resulting in a net decrease of  <strong>{convertLovelacesToAda(netTreasuryChangeAbs).toLocaleString()} ada</strong> (-{percentTreasuryChangeAbs}%) compared to the previous epoch.
            </>
          )}
        </p>

		{/* #############################  */}
        <p>
          <strong>Q: How many fees were collected and distributed?</strong>
        </p>
        <p>
          {isCurrentEpoch
            ? (
              <>A: In the currently running epoch,&nbsp;
                <strong>{convertLovelacesToAda(totalsCurr.fees).toLocaleString()} ada</strong> in transaction fees
				have been <strong>paid</strong> so far.</>
            )
            : (
              <>A: In epoch {displayedEpoch}, a total of <strong>{convertLovelacesToAda(totalsCurr.fees).toLocaleString()} ada</strong> in transaction fees was collected for a distribution next epoch.&nbsp;</>
            )
          }
		  <strong>{convertLovelacesToAda(epochInfoPrev2.fees).toLocaleString()} ada</strong> from epoch {displayedEpoch - 1} was distributed as rewards and treasury extension.&nbsp;
		  These fees came from { (epochInfoPrev2.tx_count).toLocaleString() } transactions, averaging {(averageTxFee / 1_000_000).toFixed(2)} ada per transaction, and accounted for {percentFeesOfDeltaReserves}% of the total rewards distributed
        </p>

		{/* #############################  */}
        <p>
          <strong>Q: Were there withdrawals from the treasury in epoch {displayedEpoch}?</strong>
        </p>
        <p>
          {withdrawalsCurrRes.length === 0
            ? `A: There were no treasury withdrawals during this epoch.`
            : withdrawalsCurrRes.length === 1
            ? `A: There was 1 treasury withdrawal totaling ${convertLovelacesToAda(totalTreasuryWithdrawalsCurr).toLocaleString()} ada.`
            : `A: There were ${withdrawalsCurrRes.length} treasury withdrawals totaling ${convertLovelacesToAda(
                totalTreasuryWithdrawalsCurr
              ).toLocaleString()} ada.`}
        </p>
        
		{/* #############################  */}
        <p>
          <strong>Q: Where can I learn more about the Cardano Mainnet reward calculation??</strong>
        </p>
        <p>
            The reward calculation is based on the <Link href="https://github.com/IntersectMBO/cardano-ledger?tab=readme-ov-file#cardano-ledger">ledger specification</Link>. 
            Further information can be found in the <Link href="https://cardano-scaling.github.io/cardano-blueprint/ledger/index.html">Cardano Blueprint</Link> documentation. 
			
            There is an independent <Link href="https://github.com/cardano-foundation/cf-java-rewards-calculation/blob/main/README.md">Java implementation</Link> with many explanations.
            
            
        </p>
        
        
      </div>

      <InsightsFooter lastUpdated={`${epochDate} (epoch ${displayedEpoch})`} epoch={displayedEpoch} />
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
