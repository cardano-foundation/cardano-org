import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import * as echarts from 'echarts';
import axios from 'axios';
import { useHistory } from '@docusaurus/router';
import Link from "@docusaurus/Link";
import Heading from '@theme/Heading';

import { makeApiClient } from '@site/src/utils/insights/api';
import { parseApiError } from '@site/src/utils/insights/errors';
import { convertLovelacesToAda, toAdaIfMoney, LOVELACE_KEY } from '@site/src/utils/insights/numbers';
import { MIN_EPOCH, getEpochDate } from '@site/src/utils/insights/epochs';

// Layout components 
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import EpochNav from '@site/src/components/Layout/InsightsEpochNav';
import authors from '@site/src/data/authors.json';

// ────────────────────────────────────────────────────────────────────────────
//  Page Meta
// ────────────────────────────────────────────────────────────────────────────
export const meta = {
  pageName: 'supply',
  pageTitle: 'Cardano Supply Overview',
  pageDescription: 'Visual representation of ada supply distribution across key categories in the Cardano network.',
  title: 'Cardano Supply Overview',
  date: '', // set dynamically
  og: {
    title: 'Cardano Supply Distribution',
    description: 'Explore how ada is distributed across reserves, circulation, treasury, and rewards.'
  }, 
  tags: ['economics', 'staking'],
  indexed: true
};

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
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const apiRef = useRef(null);
  if (!apiRef.current && API_URL) apiRef.current = makeApiClient(API_URL);
  
  const location = useLocation();
  const initialUrlEpoch = new URLSearchParams(location.search).get('epoch');
  
  //const history = useHistory();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  // chain epoch data 
  const [currentEpochNo, setCurrentEpochNo] = useState(null);
  const [totalsCurr, setTotalsCurr] = useState(null);
  const [totalsPrev, setTotalsPrev] = useState(null);
  const [withdrawalsCurrRes, setWithdrawalsCurr] = useState([]);
  const [withdrawalsPrevRes, setWithdrawalsPrev] = useState([]);
  const [epochInfoPrev1, setEpochInfoPrev1] = useState(null);
  const [epochInfoPrev2, setEpochInfoPrev2] = useState(null);
  const [error, setError] = useState(null);  
  //const [withdrawalsCurr, setWithdrawalsCurr] = useState([]);

  const isPrimed = Boolean(totalsCurr && totalsPrev && epochInfoPrev1 && epochInfoPrev2);

  const lastScrollYRef = useRef(0);
  
  const fetchData = async () => {
    if (!API_URL) {
      setErrorInfo({ kind: 'config', title: 'Missing configuration', message: 'API URL is missing.' });
      return;
    }
    setIsLoading(true);
    setErrorInfo(null);
    const api = apiRef.current ?? makeApiClient(API_URL);
	
    try {
      // parse & validate current URL epoch
      const tipRes = await api.get('/tip');
      const tipEpoch = tipRes.data?.[0]?.epoch_no;
      setCurrentEpochNo(tipEpoch);
      const urlEpochNow = new URLSearchParams(window.location.search).get('epoch');
      const parsed = parseInt(urlEpochNow, 10);
      const validEpoch = urlEpochNow && !Number.isNaN(parsed) && parsed >= MIN_EPOCH ? parsed : null;
      if (urlEpochNow && (Number.isNaN(parsed) || parsed < MIN_EPOCH)) {
        setErrorInfo({ kind: 'input', title: 'Invalid epoch', message: `Epoch must be ≥ ${MIN_EPOCH}.` });
        setIsLoading(false);
        return;
      }
      const displayedEpoch = validEpoch ?? tipEpoch;

      // fetch epoch data in parallel (previous ones for delta calculations) 
      const [totalsCurrRes, totalsPrevRes, epochInfoPrev1Res, epochInfoPrev2Res] = await Promise.all([
        api.get(`/totals?_epoch_no=${displayedEpoch}`),
        api.get(`/totals?_epoch_no=${displayedEpoch - 1}`),
        api.get(`/epoch_info?_epoch_no=${displayedEpoch - 1}`),
        api.get(`/epoch_info?_epoch_no=${displayedEpoch - 2}`),
      ]);
      setTotalsCurr({ epoch_no: displayedEpoch, ...totalsCurrRes.data[0] });
      setTotalsPrev(totalsPrevRes.data[0]);
      setEpochInfoPrev1(epochInfoPrev1Res.data[0]);
      setEpochInfoPrev2(epochInfoPrev2Res.data[0]);

      // fetch treasury withdrawals (paged. rare. for example epoch 374)
      let withdrawals = [];
      let offset = 0;
      while (true) {
        const r = await api.get(
          `/treasury_withdrawals?select=epoch_no,amount&epoch_no=eq.${displayedEpoch}&offset=${offset}`
        );
        const page = r.data || [];
        withdrawals = withdrawals.concat(page);
        if (!page.length) break;
        offset += 1000;
      }
      setWithdrawalsCurr(withdrawals);
      // repeat for previous epoch to calculate the treasury growth or depletion 
      withdrawals = [];
      offset = 0;
      while (true) {
        const r = await api.get(
          `/treasury_withdrawals?select=epoch_no,amount&epoch_no=eq.${displayedEpoch-1}&offset=${offset}`
        );
        const page = r.data || [];
        withdrawals = withdrawals.concat(page);
        if (!page.length) break;
        offset += 1000;
      }
      setWithdrawalsPrev(withdrawals);
		
    } catch (err) {
      setErrorInfo(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  }

  // first mount: load (uses initialUrlEpoch via window.location since we read inside fetchData)
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL, initialUrlEpoch]); // initialUrlEpoch just to fire once with router-provided query

  // back/forward support (URL changes without router navigation)
  useEffect(() => {
    const onPop = () => fetchData();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore scroll AFTER new epoch data is committed
  useLayoutEffect(() => {
    if (!isPrimed) return;
    if (lastScrollYRef.current > 0) {
      window.scrollTo(0, lastScrollYRef.current);
      lastScrollYRef.current = 0;
    }
  }, [isPrimed, totalsCurr?.epoch_no]);

  // epoch nav handler: URL only (no router nav) + fetch, keep scroll
  const handleGoEpoch = (nextEpoch) => {
    lastScrollYRef.current = window.scrollY;
    window.history.pushState({}, '', `?epoch=${nextEpoch}`);
    fetchData();
  };

  // Error UI (mainly for API failures, like timeouts, network disconnections, or API side rate limits. see src/lib/insights/errors) 
  if (errorInfo && !isPrimed) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <div
          role="alert"
          style={{
            border: '1px solid var(--ifm-color-emphasis-300)',
            padding: '1rem',
            borderRadius: 8,
            background: 'var(--ifm-background-surface-color)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>{errorInfo.title}</h3>
          <p style={{ marginBottom: 8 }}>{errorInfo.message}</p>
          {errorInfo.extra && (
            <p style={{ margin: 0, color: '#666' }}>
              {errorInfo.extra}
            </p>
          )}
          {errorInfo.kind === 'input' && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#666' }}>
              Try appending <code>?epoch={MIN_EPOCH + 1}</code> to the URL.
            </p>
          )}
          <div style={{ marginTop: '0.75rem' }}>
            <button
              className="button button--primary button--sm"
              onClick={fetchData}
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? 'Retrying…' : 'Retry'}
            </button>
          </div>
        </div>
      </>
    );
  }

  // first load placeholder
  if (!isPrimed) {
    return <p>Preparing…</p>;
  }
 
  // derived data (load only now, not earlier!)
  const displayedEpoch = totalsCurr.epoch_no;
  const epochDate = getEpochDate(displayedEpoch);
  const isCurrentEpoch = currentEpochNo != null && displayedEpoch === currentEpochNo;

  // donut chart data
  const chartData = [
    { label: 'Circulation',        value: totalsCurr.circulation,      color: '#5470c6', show_in_donut: true,  context_info: 'Sum of all circulating UTxOs' },
    { label: 'Treasury',           value: totalsCurr.treasury,         color: '#91cc75', show_in_donut: true,  context_info: 'All ada currently in the treasury pot' },
    { label: 'Rewards',            value: totalsCurr.reward,           color: '#fac858', show_in_donut: true,  context_info: 'All unclaimed rewards' },
    { label: 'Deposits Stake',     value: totalsCurr.deposits_stake,   color: '#ee6666', show_in_donut: true,  context_info: 'Deposit pot for registered stake pools and staking accounts' },
    { label: 'Deposits DRep',      value: totalsCurr.deposits_drep,    color: '#73c0de', show_in_donut: true,  context_info: 'Deposit pot for registered DReps' },
    { label: 'Deposits Proposal',  value: totalsCurr.deposits_proposal,color: '#3ba272', show_in_donut: true,  context_info: 'Deposit pot for active governance actions' },
    { label: 'Fees',               value: totalsCurr.fees,             color: '#fc8452', show_in_donut: true,  context_info: 'Fees collected' },
    { label: 'Total Supply',       value: totalsCurr.supply,           color: '#999999', show_in_donut: false, context_info: 'All ada in circulation + unclaimed rewards + deposits + fees + treasury' },
    { label: 'Reserves',           value: totalsCurr.reserves,         color: '#9a60b4', show_in_donut: true,  context_info: 'Difference between maximum and total supply' },
  ];
  const maxSupply = chartData
    .filter((d) => d.show_in_donut)
    .reduce((sum, d) => sum + Number(d.value || 0), 0);

  chartData.push({
    label: 'Maximum supply',
    value: maxSupply,
    color: '#444444',
    show_in_donut: false,
    context_info:
      'The maximum amount of ada that can ever exist, based on the genesis block definition.'
  });

  // delta calculations for FACT section
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

  const pageTitle = `Cardano ada Supply Distribution – Epoch ${displayedEpoch} (${epochDate})`;
  const pageDescription = `Explore the Cardano ADA supply distribution for epoch ${displayedEpoch}. Understand how ADA is allocated across circulating supply, reserves, staking rewards, and the treasury. `
  const pageKeywords = `Cardano, ADA, supply distribution, staking rewards, Cardano treasury, Ouroboros protocol, Cardano blockchain, ADA rewards, Cardano supply insights`
  const canonicalUrl = `https://www.cardano.org.com/insights/supply${displayedEpoch ? `?epoch=${displayedEpoch}` : ''}`;

  const navStickyClass = 'epochNavSticky'; // CSS is in custom.css

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
		<meta name="twitter:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
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
            const base = `**Explore the complete Cardano ADA supply distribution for epoch ${displayedEpoch}, which began on ${epochDate} `;
            const ending = isCurrentEpoch
              ? 'and is still ongoing.**'
              : 'and lasted five days.**';
            return base + ending;
          })()
        ]}
        headingDot
      />

      <TitleWithText
        description={[
		  `This interactive insight helps you understand how the total ADA supply is allocated across key categories — from circulating supply and reserves to staking rewards and the treasury.`
        ]}
        headingDot
      />
      <TitleWithText
        description={[
		  `At the close of each 5-day epoch, the [Ouroboros protocol](/ouroboros) performs supply and reward calculations across all participating nodes. 
		  The resulting transfers distribute [staking rewards](/calculator) and allocate a portion to the Cardano treasury, supporting ongoing development and ecosystem growth.`
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
        <h3>Q: How did the values change compared to the previous Epoch?</h3>
        <p>
          A: At the start of epoch {displayedEpoch}, the Cardano Ouroboros protocol distributed the staking
          rewards for epoch {displayedEpoch - 2} and transaction fees collected in epoch {displayedEpoch - 1}.
          This transferred <strong>{convertLovelacesToAda(deltaReserves).toLocaleString()} ada</strong> from the
          reserves to the active supply, equivalent to a {percentOfReserves}% decrease in reserves and a&nbsp;
          {percentOfSupply}% increase in active supply.
        </p>

		{/* #############################  */}
        <h3>Q: How much ada was added to the treasury?</h3>
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
        <h3>Q: How many fees were collected and distributed?</h3>
        <p>
          {isCurrentEpoch
            ? (
              <>A: In the currently running epoch,&nbsp;
                <strong>{convertLovelacesToAda(totalsCurr.fees).toLocaleString()} ada</strong> in transaction fees
				have been paid so far. </>
            )
            : (
              <>A: In epoch {displayedEpoch}, a total of <strong>{convertLovelacesToAda(totalsCurr.fees).toLocaleString()} ada</strong> in transaction fees was collected for a distribution next epoch.&nbsp;</>
            )
          }
		  <strong>{convertLovelacesToAda(epochInfoPrev2.fees).toLocaleString()} ada</strong> from epoch {displayedEpoch - 1} was distributed as rewards and treasury extension.&nbsp;
		  These fees came from { (epochInfoPrev2.tx_count).toLocaleString() } transactions, averaging {(averageTxFee / 1_000_000).toFixed(2)} ada per transaction, and accounted for {percentFeesOfDeltaReserves}% of the total rewards distributed
        </p>

		{/* #############################  */}
        <h3>Q: Were there withdrawals from the treasury in epoch {displayedEpoch}?</h3>
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
        <h3>Q: Where can I learn more about the Cardano Mainnet reward calculation?</h3>
        <p>
            The reward calculation is based on the <Link href="https://github.com/IntersectMBO/cardano-ledger?tab=readme-ov-file#cardano-ledger">ledger specification</Link>. 
            Further information can be found in the <Link href="https://cardano-scaling.github.io/cardano-blueprint/ledger/index.html">Cardano Blueprint</Link> documentation. 
			
            There is an independent <Link href="https://github.com/cardano-foundation/cf-java-rewards-calculation/blob/main/README.md">Java implementation</Link> with many explanations, 
			as well as a <Link href="https://cardanofoundation.org/academy/course/staking-rewards-calculation">training course from Cardano Academy</Link> on calculating staking rewards.
            
            
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
