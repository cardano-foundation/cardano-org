import React, { useEffect, useMemo, useState } from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import EChart from '@site/src/components/Layout/EChart';
import Link from "@docusaurus/Link";
import Heading from '@theme/Heading';
import Divider from "@site/src/components/Layout/Divider";
import { translate } from '@docusaurus/Translate';

import { makeApiClient } from '@site/src/utils/insights/api';
import { parseApiError } from '@site/src/utils/insights/errors';
import { convertLovelacesToAda } from '@site/src/utils/insights/numbers';
import { MIN_EPOCH, getEpochDate } from '@site/src/utils/insights/epochs';
import EpochRangeSlider, { useEpochRange } from '@site/src/components/Layout/EpochRangeSlider';

// Layout components
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';

// Cookie that remembers the selected epoch range on this page.
const COOKIE_NAME = 'transactions_summary_epoch_range';

// ────────────────────────────────────────────────────────────────────────────
//  Page Meta
// ────────────────────────────────────────────────────────────────────────────
export const meta = {
  pageName: 'transaction-trends',
  pageTitle: translate({ id: 'insightsTransactions.meta.pageTitle', message: 'Cardano Transaction Trends' }),
  pageDescription: translate({ id: 'insightsTransactions.meta.pageDescription', message: 'Historical analysis of Cardano transaction counts, fees, and block production across epochs.' }),
  title: translate({ id: 'insightsTransactions.meta.title', message: 'Cardano Transaction Trends' }),
  date: '',
  og: {
    title: translate({ id: 'insightsTransactions.og.title', message: 'Cardano Transaction Trends' }),
    description: translate({ id: 'insightsTransactions.og.description', message: 'Explore historical trends in Cardano transactions, fees collected, and block production over time.' })
  },
  tags: ['transactions', 'fees', 'blocks'],
  indexed: true
};

// ────────────────────────────────────────────────────────────────────────────
//  Line Chart Component (ECharts)
// ────────────────────────────────────────────────────────────────────────────
function LineChartEcharts({ chartData, title, yAxisName = '', hasSecondYAxis = false, yAxisMin, yAxisMax, currentEpoch }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const option = useMemo(() => {
    if (!chartData || !chartData.series || !chartData.series.length) return null;

    // Determine if we need dual y-axis
    const needsDualAxis = hasSecondYAxis || chartData.series.some(s => s.yAxisIndex === 1);

    // Check if current epoch is in the data range
    const hasCurrentEpoch = currentEpoch && chartData.epochs.includes(currentEpoch);
    const currentEpochIndex = hasCurrentEpoch ? chartData.epochs.indexOf(currentEpoch) : -1;

    // Get colors from series for axis coloring
    const leftAxisColor = chartData.series.find(s => s.yAxisIndex === 0 || !s.yAxisIndex)?.color || (isDark ? '#fff' : '#000');
    const rightAxisColor = chartData.series.find(s => s.yAxisIndex === 1)?.color || (isDark ? '#fff' : '#000');

    const yAxisConfig = needsDualAxis ? [
      {
        type: 'value',
        name: yAxisName,
        nameTextStyle: { color: leftAxisColor },
        position: 'left',
        axisLine: { lineStyle: { color: leftAxisColor } },
        axisLabel: {
          color: leftAxisColor,
          formatter: (value) => value.toLocaleString()
        }
      },
      {
        type: 'value',
        name: 'ada',
        nameTextStyle: { color: rightAxisColor },
        position: 'right',
        axisLine: { lineStyle: { color: rightAxisColor } },
        axisLabel: {
          color: rightAxisColor,
          formatter: (value) => value.toLocaleString()
        }
      }
    ] : [{
      type: 'value',
      name: yAxisName,
      nameTextStyle: { color: leftAxisColor },
      axisLine: { lineStyle: { color: leftAxisColor } },
      axisLabel: {
        color: leftAxisColor,
        formatter: (value) => value.toLocaleString()
      },
      ...(yAxisMin !== undefined && { min: yAxisMin }),
      ...(yAxisMax !== undefined && { max: yAxisMax })
    }];

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const epoch = params[0].axisValue;
          const epochDate = getEpochDate(epoch);
          const isCurrentEpoch = epoch === currentEpoch;
          let result = `Epoch ${epoch} (${epochDate})${isCurrentEpoch ? ' <strong style="color: #ffa500;">[In Progress]</strong>' : ''}<br/>`;
          params.forEach(param => {
            if (param.value == null) return;
            const value = param.value.toLocaleString();
            const unit = param.seriesName.includes('Fee') ? ' ada' : '';
            result += `${param.marker}${param.seriesName}: ${value}${unit}${isCurrentEpoch ? ' (partial)' : ''}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: chartData.series.map(s => s.name),
        textStyle: { color: isDark ? '#fff' : '#000' },
        top: 10
      },
      grid: {
        left: '3%',
        right: needsDualAxis ? '8%' : '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.epochs,
        name: 'Epoch',
        nameTextStyle: { color: isDark ? '#fff' : '#000' },
        axisLabel: {
          color: isDark ? '#fff' : '#000',
          formatter: (value) => {
            const date = getEpochDate(value);
            return `${value}\n${date}`;
          }
        }
      },
      yAxis: yAxisConfig,
      series: chartData.series.map(s => {
        // Create data array with special styling for current epoch
        const styledData = s.data.map((value, index) => {
          if (hasCurrentEpoch && index === currentEpochIndex) {
            return {
              value: value,
              itemStyle: {
                color: '#ffa500', // Orange for in-progress
                borderColor: s.color,
                borderWidth: 2,
                borderType: 'dashed'
              },
              symbol: 'circle',
              symbolSize: 10
            };
          }
          return value;
        });

        return {
          name: s.name,
          type: s.type || 'line',
          data: styledData,
          smooth: s.type === 'bar' ? false : true,
          itemStyle: { color: s.color },
          yAxisIndex: s.yAxisIndex || 0,
          // Add markPoint for current epoch
          ...(hasCurrentEpoch && {
            markPoint: {
              data: [{
                name: 'In Progress',
                coord: [currentEpochIndex, s.data[currentEpochIndex]],
                symbol: 'pin',
                symbolSize: 30,
                itemStyle: { color: '#ffa500' },
                label: {
                  show: true,
                  formatter: '!',
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#fff'
                }
              }],
              // Only show markPoint on first series to avoid duplicates
              silent: true
            }
          })
        };
      })
    };
  }, [chartData, isDark, yAxisName, hasSecondYAxis, currentEpoch, yAxisMin, yAxisMax]);

  // A click on a data point opens that epoch's supply page.
  const onEvents = {
    click: (params) => {
      if (params.componentType === 'series' && params.dataIndex !== undefined) {
        const epoch = chartData.epochs[params.dataIndex];
        if (epoch) {
          window.location.href = `/insights/supply?epoch=${epoch}`;
        }
      }
    },
  };

  return <EChart option={option} notMerge={false} lazyUpdate onEvents={onEvents} height={400} style={{ cursor: 'pointer' }} />;
}

// ────────────────────────────────────────────────────────────────────────────
//  Main page content
// ────────────────────────────────────────────────────────────────────────────
function PageContent() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  // Create the API client once via a lazy initializer instead of writing a
  // ref during render.
  const [apiClient] = useState(() => (API_URL ? makeApiClient(API_URL) : null));

  const location = useLocation();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);
  const [currentEpochNo, setCurrentEpochNo] = useState(null);
  // Selected epoch range, kept in a cookie per page.
  const [range, setRange] = useEpochRange({ cookieName: COOKIE_NAME, min: MIN_EPOCH + 1, max: currentEpochNo });
  const startEpoch = range?.start ?? MIN_EPOCH + 1;
  const endEpoch = range?.end;
  const [allEpochData, setAllEpochData] = useState({}); // All loaded epoch data (cache)

  // Fetch current epoch on mount
  useEffect(() => {
    const fetchCurrentEpoch = async () => {
      if (!API_URL) return;
      try {
        const api = apiClient ?? makeApiClient(API_URL);
        const tipRes = await api.get('/tip');
        const tipEpoch = tipRes.data?.[0]?.epoch_no;
        setCurrentEpochNo(tipEpoch);
      } catch (err) {
        console.warn('Failed to fetch current epoch:', err);
      }
    };
    fetchCurrentEpoch();
  }, [API_URL, apiClient]);

  // Fetch ALL epoch data once on initial load
  const fetchAllEpochData = async () => {
    if (!API_URL || !currentEpochNo) return;

    setIsLoading(true);
    setIsInitialLoad(true);
    setErrorInfo(null);
    const api = apiClient ?? makeApiClient(API_URL);

    try {
      const minEpoch = MIN_EPOCH + 1;
      const maxEpoch = currentEpochNo;

      console.log(`Fetching epoch data from ${minEpoch} to ${maxEpoch}...`);

      // epoch_info: tx_count, blk_count; 
      // totals: accurate fees from totals endpoint (fee pool snapshot)
      const allInfo = {};

      const [epochInfoResult, totalsResult] = await Promise.allSettled([
        api.get('/epoch_info'),
        api.get('/totals?order=epoch_no.asc'),
      ]);

      if (epochInfoResult.status === 'fulfilled') {
        epochInfoResult.value.data.forEach(item => {
          if (item.epoch_no) {
            allInfo[item.epoch_no] = item;
          }
        });
        console.log(`Fetched epoch info (${epochInfoResult.value.data.length} epochs)`);
      } else {
        console.warn('Error fetching epoch info:', epochInfoResult.reason);
      }

      if (totalsResult.status === 'fulfilled') {
        let feesMerged = 0;
        totalsResult.value.data.forEach(item => {
          if (item.epoch_no && allInfo[item.epoch_no] && item.fees != null) {
            allInfo[item.epoch_no].fees = item.fees;
            feesMerged++;
          }
        });
        console.log(`Merged fees from totals (${feesMerged} epochs)`);
      } else {
        console.warn('Error fetching totals:', totalsResult.reason);
      }

      if (Object.keys(allInfo).length === 0) {
        throw epochInfoResult.status === 'rejected'
          ? epochInfoResult.reason
          : new Error('No epoch data available');
      }

      setAllEpochData(allInfo);
      console.log('All epoch data loaded successfully');

    } catch (err) {
      setErrorInfo(parseApiError(err));
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Filter cached data when epoch range changes
  const filterEpochData = useMemo(() => {
    if (!startEpoch || !endEpoch || Object.keys(allEpochData).length === 0) {
      return [];
    }

    const filtered = [];
    for (let epoch = startEpoch; epoch <= endEpoch; epoch++) {
      if (allEpochData[epoch]) {
        filtered.push({
          epoch: epoch,
          info: allEpochData[epoch]
        });
      }
    }

    return filtered.sort((a, b) => a.epoch - b.epoch);
  }, [startEpoch, endEpoch, allEpochData]);

  // Filtered data for the selected range; derived directly from the memo.
  const epochData = filterEpochData;

  // Fetch all data on initial load (only once)
  useEffect(() => {
    if (currentEpochNo && Object.keys(allEpochData).length === 0 && !isLoading && isInitialLoad) {
      // Trigger the one-time full data fetch once the current epoch is known.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAllEpochData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEpochNo]);

  // Prepare chart data - Transaction Count
  const txCountChartData = useMemo(() => {
    if (!epochData.length) return null;
    return {
      epochs: epochData.map(d => d.epoch),
      series: [{
        name: 'Transactions',
        data: epochData.map(d => Number(d.info?.tx_count || 0)),
        color: '#5470c6'
      }]
    };
  }, [epochData]);

  // Prepare chart data - Transaction Fees
  const feesChartData = useMemo(() => {
    if (!epochData.length) return null;
    return {
      epochs: epochData.map(d => d.epoch),
      series: [{
        name: 'Fees Collected',
        data: epochData.map(d => convertLovelacesToAda(d.info?.fees || 0)),
        color: '#91cc75'
      }]
    };
  }, [epochData]);

  // Prepare chart data - Block Count
  const blockCountChartData = useMemo(() => {
    if (!epochData.length) return null;
    return {
      epochs: epochData.map(d => d.epoch),
      series: [{
        name: 'Blocks',
        data: epochData.map(d => Number(d.info?.blk_count || 0)),
        color: '#fac858'
      }]
    };
  }, [epochData]);

  // Prepare chart data - Transactions & Fees combined
  const txAndFeesChartData = useMemo(() => {
    if (!epochData.length) return null;
    return {
      epochs: epochData.map(d => d.epoch),
      series: [
        {
          name: 'Transactions',
          data: epochData.map(d => Number(d.info?.tx_count || 0)),
          color: '#5470c6',
          yAxisIndex: 0
        },
        {
          name: 'Fees (ada)',
          data: epochData.map(d => convertLovelacesToAda(d.info?.fees || 0)),
          color: '#91cc75',
          yAxisIndex: 1
        }
      ]
    };
  }, [epochData]);

  // Prepare chart data - Average Fee per Transaction
  // Note: Don't use convertLovelacesToAda here as it rounds to whole numbers
  // Average fees are typically ~0.1-0.3 ada, so we need decimal precision
  const avgFeeChartData = useMemo(() => {
    if (!epochData.length) return null;
    return {
      epochs: epochData.map(d => d.epoch),
      series: [{
        name: 'Avg Fee per Tx',
        data: epochData.map(d => {
          const txCount = Number(d.info?.tx_count || 0);
          const fees = Number(d.info?.fees || 0);
          if (txCount === 0) return 0;
          // Convert lovelaces to ada without rounding (1 ada = 1,000,000 lovelaces)
          return (fees / txCount) / 1_000_000;
        }),
        color: '#ee6666'
      }]
    };
  }, [epochData]);

  // Calculate summary statistics
  const txStats = useMemo(() => {
    if (!epochData.length) return null;
    const txCounts = epochData.map(d => Number(d.info?.tx_count || 0));
    const totalTx = txCounts.reduce((a, b) => a + b, 0);
    const avgTx = Math.round(totalTx / txCounts.length);
    const maxTx = Math.max(...txCounts);
    const minTx = Math.min(...txCounts);
    const maxEpoch = epochData.find(d => Number(d.info?.tx_count || 0) === maxTx)?.epoch;
    const minEpoch = epochData.find(d => Number(d.info?.tx_count || 0) === minTx)?.epoch;
    return { totalTx, avgTx, maxTx, minTx, maxEpoch, minEpoch };
  }, [epochData]);

  const feesStats = useMemo(() => {
    if (!epochData.length) return null;
    const fees = epochData.map(d => Number(d.info?.fees || 0));
    const totalFees = fees.reduce((a, b) => a + b, 0);
    const avgFees = Math.round(totalFees / fees.length);
    const maxFees = Math.max(...fees);
    const minFees = Math.min(...fees);
    const maxEpoch = epochData.find(d => Number(d.info?.fees || 0) === maxFees)?.epoch;
    const minEpoch = epochData.find(d => Number(d.info?.fees || 0) === minFees)?.epoch;
    return { totalFees, avgFees, maxFees, minFees, maxEpoch, minEpoch };
  }, [epochData]);

  const blockStats = useMemo(() => {
    if (!epochData.length) return null;
    const blocks = epochData.map(d => Number(d.info?.blk_count || 0));
    const totalBlocks = blocks.reduce((a, b) => a + b, 0);
    const avgBlocks = Math.round(totalBlocks / blocks.length);
    const maxBlocks = Math.max(...blocks);
    const minBlocks = Math.min(...blocks);
    return { totalBlocks, avgBlocks, maxBlocks, minBlocks };
  }, [epochData]);

  const avgFeeStats = useMemo(() => {
    if (!epochData.length) return null;
    const avgFees = epochData.map(d => {
      const txCount = Number(d.info?.tx_count || 0);
      const fees = Number(d.info?.fees || 0);
      if (txCount === 0) return 0;
      return fees / txCount; // in lovelace
    });
    const overallAvg = avgFees.reduce((a, b) => a + b, 0) / avgFees.length;
    const maxAvgFee = Math.max(...avgFees);
    const minAvgFee = Math.min(...avgFees.filter(f => f > 0)); // exclude zeros
    const maxEpoch = epochData.find(d => {
      const txCount = Number(d.info?.tx_count || 0);
      const fees = Number(d.info?.fees || 0);
      return txCount > 0 && fees / txCount === maxAvgFee;
    })?.epoch;
    const minEpoch = epochData.find(d => {
      const txCount = Number(d.info?.tx_count || 0);
      const fees = Number(d.info?.fees || 0);
      return txCount > 0 && fees / txCount === minAvgFee;
    })?.epoch;
    return { overallAvg, maxAvgFee, minAvgFee, maxEpoch, minEpoch };
  }, [epochData]);

  if (errorInfo && !epochData.length) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <div role="alert" style={{ border: '1px solid var(--ifm-color-emphasis-300)', padding: '1rem', borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>{errorInfo.title}</h3>
          <p>{errorInfo.message}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{meta.pageTitle}</title>
        <meta name="description" content={meta.pageDescription} />
      </Head>

      <TitleWithText headingLevel={2}
        description={[
          translate({ id: 'insightsTransactions.intro.description', message: '**Explore historical trends in Cardano transactions** including transaction counts, fees collected, and block production. Select an epoch range to analyze how network activity evolved over time.' })
        ]}
        headingDot
      />

      {/* Epoch Selection */}
      <EpochRangeSlider
        title={translate({ id: 'insightsTransactions.epochSelect.title', message: 'Select Epoch Range' })}
        min={MIN_EPOCH + 1}
        max={currentEpochNo}
        start={range?.start}
        end={range?.end}
        onChange={setRange}
        startLabel={translate({ id: 'insightsTransactions.epochSelect.start', message: 'Start:' })}
        endLabel={translate({ id: 'insightsTransactions.epochSelect.end', message: 'End:' })}
        epochLabel={translate({ id: 'insightsTransactions.epochSelect.epoch', message: 'Epoch' })}
      >
        {currentEpochNo && (
          <>
            {isLoading && (
              <p style={{ margin: 0, color: '#666' }}>
                {isInitialLoad ? translate({ id: 'insightsTransactions.loading.initial', message: 'Loading all epoch data (this may take a moment)...' }) : translate({ id: 'insightsTransactions.loading.data', message: 'Loading data...' })}
              </p>
            )}
            {!isLoading && Object.keys(allEpochData).length > 0 && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                {translate({ id: 'insightsTransactions.loading.loaded', message: 'Loaded {count} epochs. Adjust the slider to filter the range.' }, { count: Object.keys(allEpochData).length })}
              </p>
            )}
          </>
        )}
        {!currentEpochNo && <p>{translate({ id: 'insightsTransactions.loading.currentEpoch', message: 'Loading current epoch...' })}</p>}
      </EpochRangeSlider>

      {/* Current Epoch Notice */}
      {epochData.length > 0 && endEpoch === currentEpochNo && (
        <div style={{
          margin: '1rem 0',
          padding: '1rem',
          backgroundColor: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid #ffa500',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>&#9888;</span>
          <div>
            <strong style={{ color: '#ffa500' }}>{translate({ id: 'insightsTransactions.notice.inProgressTitle', message: 'Current Epoch In Progress' })}</strong>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
              {translate({ id: 'insightsTransactions.notice.inProgressDescription', message: 'Epoch {epoch} is currently in progress. Data for this epoch is incomplete and will appear lower than completed epochs. The final values will be available once the epoch ends. In-progress data points are marked with an orange indicator on the charts.' }, { epoch: currentEpochNo })}
            </p>
          </div>
        </div>
      )}

      {/* Table of Contents */}
      {epochData.length > 0 && (
        <div style={{ margin: '2rem 0' }}>
          <Heading as="h2">{translate({ id: 'insightsTransactions.toc.title', message: 'Contents' })}</Heading>
          <ul>
            <li><Link href="#transactions">{translate({ id: 'insightsTransactions.toc.transactions', message: 'Transaction Volume' })}</Link></li>
            <li><Link href="#fees">{translate({ id: 'insightsTransactions.toc.fees', message: 'Transaction Fees' })}</Link></li>
            <li><Link href="#avg-fee">{translate({ id: 'insightsTransactions.toc.avgFee', message: 'Average Fee per Transaction' })}</Link></li>
            <li><Link href="#blocks">{translate({ id: 'insightsTransactions.toc.blocks', message: 'Block Production' })}</Link></li>
            <li><Link href="#combined">{translate({ id: 'insightsTransactions.toc.combined', message: 'Transactions & Fees Combined' })}</Link></li>
          </ul>
        </div>
      )}

      {/* Transaction Count Section */}
      {epochData.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <Divider text={translate({ id: 'insightsTransactions.transactions.divider', message: 'Transaction Volume' })} id="transactions" />
          <p>
            Transaction volume measures the total number of transactions processed by the Cardano network each epoch.
            Higher transaction counts indicate increased network utilization, which can result from various activities
            including ada transfers, smart contract interactions, NFT minting, and governance actions.
          </p>
          {txCountChartData && <LineChartEcharts chartData={txCountChartData} title="Transactions" yAxisName="transactions" currentEpoch={currentEpochNo} />}
          {txStats && (
            <div style={{ marginTop: '1rem' }}>
              <p>
                <strong>Summary:</strong> Between Epoch <strong>{startEpoch}</strong> ({getEpochDate(startEpoch)}) and Epoch <strong>{endEpoch}</strong> ({getEpochDate(endEpoch)}),{' '}
                the network processed <strong>{txStats.totalTx.toLocaleString()}</strong> transactions in total.
              </p>
              <ul>
                <li>Average transactions per epoch: <strong>{txStats.avgTx.toLocaleString()}</strong></li>
                <li>Peak: <strong>{txStats.maxTx.toLocaleString()}</strong> transactions (Epoch {txStats.maxEpoch})</li>
                <li>Lowest: <strong>{txStats.minTx.toLocaleString()}</strong> transactions (Epoch {txStats.minEpoch})</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Fees Section */}
      {epochData.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <Divider text={translate({ id: 'insightsTransactions.fees.divider', message: 'Transaction Fees' })} id="fees" />
          <p>
            Transaction fees are paid by users to have their transactions included in blocks. On Cardano, fees are
            calculated deterministically based on transaction size and complexity. These fees contribute to the
            rewards distributed to stake pool operators and delegators, helping secure the network.
          </p>
          {feesChartData && <LineChartEcharts chartData={feesChartData} title="Fees" yAxisName="ada" currentEpoch={currentEpochNo} />}
          {feesStats && (
            <div style={{ marginTop: '1rem' }}>
              <p>
                <strong>Summary:</strong> Between Epoch <strong>{startEpoch}</strong> ({getEpochDate(startEpoch)}) and Epoch <strong>{endEpoch}</strong> ({getEpochDate(endEpoch)}),{' '}
                the network collected <strong>{convertLovelacesToAda(feesStats.totalFees).toLocaleString()} ada</strong> in transaction fees.
              </p>
              <ul>
                <li>Average fees per epoch: <strong>{convertLovelacesToAda(feesStats.avgFees).toLocaleString()} ada</strong></li>
                <li>Peak: <strong>{convertLovelacesToAda(feesStats.maxFees).toLocaleString()} ada</strong> (Epoch {feesStats.maxEpoch})</li>
                <li>Lowest: <strong>{convertLovelacesToAda(feesStats.minFees).toLocaleString()} ada</strong> (Epoch {feesStats.minEpoch})</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Average Fee per Transaction Section */}
      {epochData.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <Divider text={translate({ id: 'insightsTransactions.avgFee.divider', message: 'Average Fee per Transaction' })} id="avg-fee" />
          <p>
            The average fee per transaction shows how much users pay on average for each transaction.
            This metric helps identify fee trends independent of transaction volume. Lower average fees
            can indicate simpler transactions or protocol optimizations, while higher fees may reflect
            more complex smart contract interactions.
          </p>
          {avgFeeChartData && <LineChartEcharts chartData={avgFeeChartData} title="Avg Fee" yAxisName="ada" currentEpoch={currentEpochNo} />}
          {avgFeeStats && (
            <div style={{ marginTop: '1rem' }}>
              <p>
                <strong>Summary:</strong> Between Epoch <strong>{startEpoch}</strong> ({getEpochDate(startEpoch)}) and Epoch <strong>{endEpoch}</strong> ({getEpochDate(endEpoch)}),{' '}
                the average fee per transaction was <strong>{(avgFeeStats.overallAvg / 1_000_000).toFixed(6)} ada</strong>.
              </p>
              <ul>
                <li>Highest average: <strong>{(avgFeeStats.maxAvgFee / 1_000_000).toFixed(6)} ada</strong> (Epoch {avgFeeStats.maxEpoch})</li>
                <li>Lowest average: <strong>{(avgFeeStats.minAvgFee / 1_000_000).toFixed(6)} ada</strong> (Epoch {avgFeeStats.minEpoch})</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Block Count Section */}
      {epochData.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <Divider text={translate({ id: 'insightsTransactions.blocks.divider', message: 'Block Production' })} id="blocks" />
          <p>
            Blocks are produced by stake pools every 20 seconds on average (one slot leader per slot). Each epoch
            consists of 432,000 slots (5 days), though not every slot results in a block due to the probabilistic
            nature of slot leader selection and network conditions.
          </p>
          {blockCountChartData && <LineChartEcharts chartData={blockCountChartData} title="Blocks" yAxisName="blocks" currentEpoch={currentEpochNo} />}
          {blockStats && (
            <div style={{ marginTop: '1rem' }}>
              <p>
                <strong>Summary:</strong> Between Epoch <strong>{startEpoch}</strong> ({getEpochDate(startEpoch)}) and Epoch <strong>{endEpoch}</strong> ({getEpochDate(endEpoch)}),{' '}
                the network produced <strong>{blockStats.totalBlocks.toLocaleString()}</strong> blocks.
              </p>
              <ul>
                <li>Average blocks per epoch: <strong>{blockStats.avgBlocks.toLocaleString()}</strong></li>
                <li>Peak: <strong>{blockStats.maxBlocks.toLocaleString()}</strong> blocks</li>
                <li>Lowest: <strong>{blockStats.minBlocks.toLocaleString()}</strong> blocks</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Combined Chart Section */}
      {epochData.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <Divider text={translate({ id: 'insightsTransactions.combined.divider', message: 'Transactions & Fees Combined' })} id="combined" />
          <p>
            This chart shows transaction volume and fees collected together, allowing you to observe the relationship
            between network activity and fee collection. Generally, higher transaction volumes correlate with higher
            fee collection, though the relationship can vary based on transaction complexity.
          </p>
          {txAndFeesChartData && <LineChartEcharts chartData={txAndFeesChartData} title="Transactions & Fees" yAxisName="transactions" hasSecondYAxis={true} currentEpoch={currentEpochNo} />}
        </div>
      )}

      <InsightsFooter />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  Page wrapper
// ────────────────────────────────────────────────────────────────────────────
export default function TransactionsSummaryPage() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo {...meta.og} />
      <PageContent />
    </InsightsLayout>
  );
}
