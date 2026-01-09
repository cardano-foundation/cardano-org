import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import * as echarts from 'echarts';
import Link from "@docusaurus/Link";
import Heading from '@theme/Heading';

import { makeApiClient } from '@site/src/utils/insights/api';
import { parseApiError } from '@site/src/utils/insights/errors';
import { convertLovelacesToAda } from '@site/src/utils/insights/numbers';
import { MIN_EPOCH, GOVERNANCE_EPOCH_THRESHOLD, getEpochDate } from '@site/src/utils/insights/epochs';
import './summary.css';

// ────────────────────────────────────────────────────────────────────────────
//  Cookie utilities
// ────────────────────────────────────────────────────────────────────────────
const COOKIE_NAME = 'supply_summary_epoch_range';
const COOKIE_EXPIRY_DAYS = 1;

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Layout components 
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';

// ────────────────────────────────────────────────────────────────────────────
//  Page Meta
// ────────────────────────────────────────────────────────────────────────────
export const meta = {
  pageName: 'supply-summary',
  pageTitle: 'Cardano Supply Summary',
  pageDescription: 'Historical analysis of Cardano ada supply distribution across reserves, rewards, treasury, and deposits.',
  title: 'Cardano Supply Summary',
  date: '',
  og: {
    title: 'Cardano Supply Summary',
    description: 'Explore historical trends in Cardano supply distribution, reserves, rewards, treasury, and deposits.'
  }, 
  tags: ['economics', 'staking', 'treasury'],
  indexed: true
};

// ────────────────────────────────────────────────────────────────────────────
//  Line Chart Component (ECharts)
// ────────────────────────────────────────────────────────────────────────────
function LineChartEcharts({ chartData, title, yAxisName = 'ada', hasSecondYAxis = false, yAxisMin, yAxisMax }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

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

  const option = useMemo(() => {
    if (!chartData || !chartData.series || !chartData.series.length) return null;

    // Determine if we need dual y-axis
    const needsDualAxis = hasSecondYAxis || chartData.series.some(s => s.yAxisIndex === 1);
    
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
        name: '%',
        nameTextStyle: { color: rightAxisColor },
        position: 'right',
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: rightAxisColor } },
        axisLabel: { 
          color: rightAxisColor,
          formatter: (value) => `${value.toFixed(1)}%`
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
          let result = `Epoch ${epoch} (${epochDate})<br/>`;
          params.forEach(param => {
            if (param.value == null) return; // Skip null values
            const value = param.seriesName.includes('%') 
              ? `${param.value.toFixed(2)}%` 
              : `${param.value.toLocaleString()} ${yAxisName}`;
            result += `${param.marker}${param.seriesName}: ${value}<br/>`;
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
      series: chartData.series.map(s => ({
        name: s.name,
        type: s.type || 'line',
        data: s.data,
        smooth: s.type === 'bar' ? false : true,
        itemStyle: { color: s.color },
        yAxisIndex: s.yAxisIndex || 0
      }))
    };
  }, [chartData, isDark, yAxisName, hasSecondYAxis]);

  useEffect(() => {
    if (!chartInstanceRef.current || !option) return;
    chartInstanceRef.current.setOption(option, { notMerge: false, lazyUpdate: true });
    
    // Add click handler to navigate to epoch detail page
    const handleChartClick = (params) => {
      if (params.componentType === 'series' && params.dataIndex !== undefined) {
        const epoch = chartData.epochs[params.dataIndex];
        if (epoch) {
          window.location.href = `/insights/supply?epoch=${epoch}`;
        }
      }
    };
    
    chartInstanceRef.current.on('click', handleChartClick);
    
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.off('click', handleChartClick);
      }
    };
  }, [option, chartData]);

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
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);
  const [currentEpochNo, setCurrentEpochNo] = useState(null);
  const [startEpoch, setStartEpoch] = useState(MIN_EPOCH + 1);
  const [endEpoch, setEndEpoch] = useState(null);
  const [epochData, setEpochData] = useState([]); // Filtered data for selected range
  const [allEpochData, setAllEpochData] = useState({}); // All loaded epoch data (cache)
  const [allWithdrawalsData, setAllWithdrawalsData] = useState({}); // All withdrawals (cache)
  const [sliderStart, setSliderStart] = useState(0);
  const [sliderEnd, setSliderEnd] = useState(100);
  const startHandleRef = useRef(null);
  const endHandleRef = useRef(null);
  const sliderContainerRef = useRef(null);

  // Save epoch selection to cookie whenever it changes
  useEffect(() => {
    if (startEpoch && endEpoch && currentEpochNo) {
      const rangeData = JSON.stringify({ startEpoch, endEpoch });
      setCookie(COOKIE_NAME, rangeData, COOKIE_EXPIRY_DAYS);
    }
  }, [startEpoch, endEpoch, currentEpochNo]);

  // Fetch current epoch on mount and load saved epoch selection from cookie
  useEffect(() => {
    const fetchCurrentEpoch = async () => {
      if (!API_URL) return;
      try {
        const api = apiRef.current ?? makeApiClient(API_URL);
        const tipRes = await api.get('/tip');
        const tipEpoch = tipRes.data?.[0]?.epoch_no;
        setCurrentEpochNo(tipEpoch);
        if (tipEpoch) {
          // Try to load saved epoch selection from cookie
          const savedRange = getCookie(COOKIE_NAME);
          let startEpochValue, endEpochValue;
          
          if (savedRange) {
            try {
              const parsed = JSON.parse(savedRange);
              // Validate the saved values are within valid range
              if (parsed.startEpoch >= MIN_EPOCH + 1 && 
                  parsed.endEpoch <= tipEpoch && 
                  parsed.startEpoch < parsed.endEpoch) {
                startEpochValue = parsed.startEpoch;
                endEpochValue = parsed.endEpoch;
              }
            } catch (e) {
              // Invalid cookie, use defaults
              console.warn('Invalid cookie data, using defaults');
            }
          }
          
          // Use defaults if no valid cookie found
          if (!startEpochValue || !endEpochValue) {
            startEpochValue = Math.max(MIN_EPOCH + 1, tipEpoch - 99);
            endEpochValue = tipEpoch;
          }
          
          setStartEpoch(startEpochValue);
          setEndEpoch(endEpochValue);
          
          // Set slider positions (0-100 scale)
          const maxEpochs = tipEpoch - MIN_EPOCH;
          setSliderStart(((startEpochValue - MIN_EPOCH - 1) / maxEpochs) * 100);
          setSliderEnd(((endEpochValue - MIN_EPOCH - 1) / maxEpochs) * 100);
        }
      } catch (err) {
        console.warn('Failed to fetch current epoch:', err);
      }
    };
    fetchCurrentEpoch();
  }, [API_URL]);

  // Fetch ALL epoch data once on initial load
  const fetchAllEpochData = async () => {
    if (!API_URL || !currentEpochNo) return;
    
    setIsLoading(true);
    setIsInitialLoad(true);
    setErrorInfo(null);
    const api = apiRef.current ?? makeApiClient(API_URL);
    
    try {
      const minEpoch = MIN_EPOCH + 1;
      const maxEpoch = currentEpochNo;
      
      console.log(`Fetching all epoch data from ${minEpoch} to ${maxEpoch}...`);
      
      // Fetch all totals (no filter - returns all epochs)
      const allTotals = {};
      
      try {
        const totalsRes = await api.get('/totals');
        totalsRes.data.forEach(item => {
          if (item.epoch_no) {
            allTotals[item.epoch_no] = item;
          }
        });
        console.log(`Fetched all totals (${totalsRes.data.length} epochs)`);
      } catch (err) {
        console.warn('Error fetching totals:', err);
      }
      
      setAllEpochData(allTotals);
      
      // Fetch all withdrawals
      const allWithdrawals = {};
      
      // Load legacy withdrawals from static pre-generated file
      try {
        const legacyWithdrawalsRes = await fetch('https://data.cardano.org/static/treasury-withdrawals-legacy.json');
        if (legacyWithdrawalsRes.ok) {
          const legacyData = await legacyWithdrawalsRes.json();
          legacyData.forEach(item => {
            if (item.epoch_no && item.totalAmount) {
              allWithdrawals[item.epoch_no] = parseInt(item.totalAmount, 10);
            }
          });
          console.log('Loaded legacy withdrawals from static file');
        } else {
          console.warn('Failed to load legacy withdrawals static file');
        }
      } catch (err) {
        console.warn('Error loading legacy withdrawals static file:', err);
      }
      
      // Governance withdrawals (epochs >= 571) - fetch all without epoch filter
      // Use the same query structure as the working version in index.js
      try {
        const withdrawalsRes = await api.get(
          `/proposal_list?proposal_type=eq.TreasuryWithdrawals&enacted_epoch=not.is.null&select=proposal_id,proposal_index,proposal_type,enacted_epoch,withdrawal-%3Eamount`
        );
        withdrawalsRes.data.forEach(item => {
          const epoch = item.enacted_epoch;
          if (epoch && epoch >= GOVERNANCE_EPOCH_THRESHOLD) {
            if (!allWithdrawals[epoch]) allWithdrawals[epoch] = 0;
            const amount = item.amount != null ? Number(item.amount) : 0;
            allWithdrawals[epoch] += isNaN(amount) ? 0 : amount;
          }
        });
        console.log('Fetched governance withdrawals');
      } catch (err) {
        console.warn('Error fetching governance withdrawals:', err);
      }
      
      // Initialize withdrawals to 0 for epochs without withdrawals
      for (let epoch = minEpoch; epoch <= maxEpoch; epoch++) {
        if (!(epoch in allWithdrawals)) {
          allWithdrawals[epoch] = 0;
        }
      }
      
      setAllWithdrawalsData(allWithdrawals);
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
          totals: allEpochData[epoch]
        });
      }
    }
    
    return filtered.sort((a, b) => a.epoch - b.epoch);
  }, [startEpoch, endEpoch, allEpochData]);

  // Update filtered data when filter changes
  useEffect(() => {
    setEpochData(filterEpochData);
  }, [filterEpochData]);

  // Fetch all data on initial load (only once)
  useEffect(() => {
    if (currentEpochNo && Object.keys(allEpochData).length === 0 && !isLoading && isInitialLoad) {
      fetchAllEpochData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEpochNo]);

  // Get withdrawals for filtered epochs
  const withdrawalsData = useMemo(() => {
    const filtered = {};
    epochData.forEach(item => {
      filtered[item.epoch] = allWithdrawalsData[item.epoch] || 0;
    });
    return filtered;
  }, [epochData, allWithdrawalsData]);

  // Prepare chart data
  const reservesChartData = useMemo(() => {
    if (!epochData.length) return null;
    return {
      epochs: epochData.map(d => d.epoch),
      series: [{
        name: 'Reserves',
        data: epochData.map(d => convertLovelacesToAda(d.totals?.reserves || 0)),
        color: '#9a60b4'
      }]
    };
  }, [epochData]);

  const rewardsChartData = useMemo(() => {
    if (!epochData.length || epochData.length < 2) return null;
    // Calculate distributed rewards (delta reserves)
    // Start from index 1 since we need previous epoch to calculate delta
    const distributedRewards = [];
    const epochs = [];
    for (let i = 1; i < epochData.length; i++) {
      const prevReserves = epochData[i - 1].totals?.reserves || 0;
      const currReserves = epochData[i].totals?.reserves || 0;
      distributedRewards.push(convertLovelacesToAda(prevReserves - currReserves));
      epochs.push(epochData[i].epoch);
    }
    
    return {
      epochs: epochs,
      series: [{
        name: 'Distributed Rewards',
        data: distributedRewards,
        color: '#fac858'
      }]
    };
  }, [epochData]);

  const treasuryChartData = useMemo(() => {
    if (!epochData.length || epochData.length < 2) return null;
    
    // Calculate treasury amounts (all epochs)
    const treasuryAmounts = epochData.map(d => convertLovelacesToAda(d.totals?.treasury || 0));
    
    // Calculate treasury withdrawals (all epochs, in ada)
    const treasuryWithdrawals = epochData.map(d => {
      const withdrawals = withdrawalsData[d.epoch] || 0;
      return convertLovelacesToAda(withdrawals);
    });
    
    // Calculate treasury percentages (starting from epoch 1, since we need previous epoch)
    // First epoch gets null so it doesn't display
    const treasuryPercentages = [null];
    
    // Calculate treasury additions and percentages per epoch
    for (let i = 1; i < epochData.length; i++) {
      const epoch = epochData[i].epoch;
      const prevTreasury = epochData[i - 1].totals?.treasury || 0;
      const currTreasury = epochData[i].totals?.treasury || 0;
      
      // For legacy epochs (< 571), withdrawals reported for epoch X affect treasury in epoch X+1
      // For governance epochs (>= 571), withdrawals affect the same epoch
      // Use allWithdrawalsData to access previous epoch's withdrawal even if it's outside the selected range
      const withdrawals = epoch < GOVERNANCE_EPOCH_THRESHOLD
        ? (allWithdrawalsData[epoch - 1] || 0)  // Legacy: use withdrawal from previous epoch
        : (withdrawalsData[epoch] || 0);       // Governance: use withdrawal from current epoch
      
      // Calculate distributed rewards (delta reserves) in lovelace
      const prevReserves = epochData[i - 1].totals?.reserves || 0;
      const currReserves = epochData[i].totals?.reserves || 0;
      const distributedRewards = prevReserves - currReserves; // in lovelace
      
      // Treasury additions from rewards = net change + withdrawals
      // This gives us the gross amount that went INTO treasury from rewards
      const treasuryDelta = currTreasury - prevTreasury; // net change in lovelace
      const treasuryAdditionsFromRewards = treasuryDelta + withdrawals; // gross additions in lovelace
      
      // Calculate percentage: (treasury additions from rewards / distributed rewards) * 100
      // This shows what % of rewards went into treasury (excluding withdrawals)
      const percentage = distributedRewards > 0 && treasuryAdditionsFromRewards > 0 
        ? (treasuryAdditionsFromRewards / distributedRewards) * 100 
        : 0;
      treasuryPercentages.push(Math.max(0, Math.min(100, percentage))); // Clamp between 0-100
    }
    
    return {
      epochs: epochData.map(d => d.epoch),
      series: [
        {
          name: 'Treasury',
          data: treasuryAmounts,
          color: '#91cc75',
          yAxisIndex: 0,
          type: 'line'
        },
        {
          name: 'Treasury Withdrawals',
          data: treasuryWithdrawals,
          color: '#ee6666',
          yAxisIndex: 0,
          type: 'bar'
        },
        {
          name: 'Treasury % of Rewards',
          data: treasuryPercentages,
          color: '#73c0de',
          yAxisIndex: 1,
          type: 'line'
        }
      ]
    };
  }, [epochData, withdrawalsData, allWithdrawalsData]);

  const depositsChartData = useMemo(() => {
    if (!epochData.length) return null;
    const stakeDeposits = epochData.map(d => convertLovelacesToAda(d.totals?.deposits_stake || 0));
    const drepDeposits = epochData.map(d => convertLovelacesToAda(d.totals?.deposits_drep || 0));
    const proposalDeposits = epochData.map(d => convertLovelacesToAda(d.totals?.deposits_proposal || 0));
    
    return {
      epochs: epochData.map(d => d.epoch),
      series: [
        { name: 'Stake Deposits', data: stakeDeposits, color: '#ee6666' },
        { name: 'DRep Deposits', data: drepDeposits, color: '#73c0de' },
        { name: 'Proposal Deposits', data: proposalDeposits, color: '#3ba272' }
      ]
    };
  }, [epochData]);

  // Calculate summary statistics
  const reservesStats = useMemo(() => {
    if (!epochData.length) return null;
    const first = epochData[0].totals?.reserves || 0;
    const last = epochData[epochData.length - 1].totals?.reserves || 0;
    const delta = last - first;
    const percentChange = first > 0 ? ((delta / first) * 100).toFixed(2) : '0.00';
    return { first, last, delta, percentChange };
  }, [epochData]);

  const treasuryStats = useMemo(() => {
    if (!epochData.length) return null;
    const first = epochData[0].totals?.treasury || 0;
    const last = epochData[epochData.length - 1].totals?.treasury || 0;
    const delta = last - first;
    const percentChange = first > 0 ? ((delta / first) * 100).toFixed(2) : '0.00';
    
    // Calculate total withdrawals and additions
    let totalWithdrawals = 0;
    let totalAdditions = 0;
    for (let i = 1; i < epochData.length; i++) {
      const epoch = epochData[i].epoch;
      
      // For legacy epochs (< 571), withdrawals reported for epoch X affect treasury in epoch X+1
      // For governance epochs (>= 571), withdrawals affect the same epoch
      // Use allWithdrawalsData to access previous epoch's withdrawal even if it's outside the selected range
      const withdrawals = epoch < GOVERNANCE_EPOCH_THRESHOLD
        ? (allWithdrawalsData[epoch - 1] || 0)  // Legacy: use withdrawal from previous epoch
        : (allWithdrawalsData[epoch] || 0);       // Governance: use withdrawal from current epoch
      
      // Sum withdrawals that occurred in the selected range
      // (The offset only affects ratio calculations, not the total sum)
      totalWithdrawals += allWithdrawalsData[epoch] || 0;
      
      const prevTreasury = epochData[i - 1].totals?.treasury || 0;
      const currTreasury = epochData[i].totals?.treasury || 0;
      const treasuryDelta = currTreasury - prevTreasury;
      if (treasuryDelta > 0) {
        totalAdditions += treasuryDelta + withdrawals;
      }
    }
    
    return { first, last, delta, percentChange, totalWithdrawals, totalAdditions };
  }, [epochData, withdrawalsData, allWithdrawalsData]);

  const depositsStats = useMemo(() => {
    if (!epochData.length) return null;
    const last = epochData[epochData.length - 1].totals || {};
    // Ensure values are numbers before adding
    const stake = Number(last.deposits_stake || 0);
    const drep = Number(last.deposits_drep || 0);
    const proposal = Number(last.deposits_proposal || 0);
    return {
      stake: stake,
      drep: drep,
      proposal: proposal,
      total: stake + drep + proposal
    };
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

      <TitleWithText
        description={[
          `**Explore historical trends in Cardano ada supply distribution** across reserves, rewards, treasury, and deposits. Select an epoch range to analyze how these key metrics evolved over time.`
        ]}
        headingDot
      />

      {/* Epoch Selection */}
      <div style={{ margin: '2rem 0', padding: '1.5rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Select Epoch Range</h3>
        {currentEpochNo && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>Start: </span>
                  <strong style={{ fontSize: '1.1rem' }}>Epoch {startEpoch}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '0.5rem' }}>
                    ({getEpochDate(startEpoch)})
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>End: </span>
                  <strong style={{ fontSize: '1.1rem' }}>Epoch {endEpoch}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '0.5rem' }}>
                    ({getEpochDate(endEpoch)})
                  </span>
                </div>
              </div>
              <div ref={sliderContainerRef} style={{ position: 'relative', height: '50px', marginBottom: '0.5rem', padding: '15px 0' }}>
                {/* Track background */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'var(--ifm-color-emphasis-300)',
                  transform: 'translateY(-50%)',
                  borderRadius: '3px'
                }} />
                {/* Active range highlight */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${sliderStart}%`,
                  width: `${sliderEnd - sliderStart}%`,
                  height: '6px',
                  background: 'var(--ifm-color-primary)',
                  transform: 'translateY(-50%)',
                  borderRadius: '3px'
                }} />
                {/* Start handle - full width for proper thumb positioning */}
                <input
                  ref={startHandleRef}
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={sliderStart}
                  onChange={(e) => {
                    const newStart = parseFloat(e.target.value);
                    if (newStart < sliderEnd - 0.5) {
                      setSliderStart(newStart);
                      const maxEpochs = currentEpochNo - MIN_EPOCH;
                      const newEpoch = Math.round(MIN_EPOCH + 1 + (newStart / 100) * maxEpochs);
                      setStartEpoch(Math.max(MIN_EPOCH + 1, Math.min(newEpoch, endEpoch - 1)));
                    }
                  }}
                  className="dual-range-slider"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    width: '100%',
                    height: '20px',
                    margin: 0,
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    zIndex: 2
                  }}
                />
                {/* End handle - full width for proper thumb positioning */}
                <input
                  ref={endHandleRef}
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={sliderEnd}
                  onChange={(e) => {
                    const newEnd = parseFloat(e.target.value);
                    if (newEnd > sliderStart + 0.5) {
                      setSliderEnd(newEnd);
                      const maxEpochs = currentEpochNo - MIN_EPOCH;
                      const newEpoch = Math.round(MIN_EPOCH + 1 + (newEnd / 100) * maxEpochs);
                      setEndEpoch(Math.min(currentEpochNo, Math.max(newEpoch, startEpoch + 1)));
                    }
                  }}
                  className="dual-range-slider"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    width: '100%',
                    height: '20px',
                    margin: 0,
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    zIndex: 3
                  }}
                />
                {/* Click zone for start handle - left portion */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    width: `${Math.min((sliderStart + sliderEnd) / 2 + 10, 100)}%`,
                    height: '20px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    zIndex: 4
                  }}
                  onMouseDown={(e) => {
                    if (!sliderContainerRef.current) return;
                    const containerRect = sliderContainerRef.current.getBoundingClientRect();
                    const x = e.clientX - containerRect.left;
                    const globalPercent = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
                    const maxEpochs = currentEpochNo - MIN_EPOCH;
                    const newEpoch = Math.round(MIN_EPOCH + 1 + (globalPercent / 100) * maxEpochs);
                    const clampedEpoch = Math.max(MIN_EPOCH + 1, Math.min(newEpoch, endEpoch - 1));
                    const newPercent = ((clampedEpoch - MIN_EPOCH - 1) / maxEpochs) * 100;
                    if (newPercent < sliderEnd - 0.5) {
                      setSliderStart(newPercent);
                      setStartEpoch(clampedEpoch);
                    }
                    // Allow dragging
                    const handleMouseMove = (moveEvent) => {
                      if (!sliderContainerRef.current) return;
                      const moveContainerRect = sliderContainerRef.current.getBoundingClientRect();
                      const moveX = moveEvent.clientX - moveContainerRect.left;
                      const moveGlobalPercent = Math.max(0, Math.min(100, (moveX / moveContainerRect.width) * 100));
                      const moveEpoch = Math.round(MIN_EPOCH + 1 + (moveGlobalPercent / 100) * maxEpochs);
                      const moveClampedEpoch = Math.max(MIN_EPOCH + 1, Math.min(moveEpoch, endEpoch - 1));
                      const moveNewPercent = ((moveClampedEpoch - MIN_EPOCH - 1) / maxEpochs) * 100;
                      if (moveNewPercent < sliderEnd - 0.5) {
                        setSliderStart(moveNewPercent);
                        setStartEpoch(moveClampedEpoch);
                      }
                    };
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
                {/* Click zone for end handle - right portion */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${Math.max((sliderStart + sliderEnd) / 2 - 10, 0)}%`,
                    width: `${100 - Math.max((sliderStart + sliderEnd) / 2 - 10, 0)}%`,
                    height: '20px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    zIndex: 4
                  }}
                  onMouseDown={(e) => {
                    if (!sliderContainerRef.current) return;
                    const containerRect = sliderContainerRef.current.getBoundingClientRect();
                    const x = e.clientX - containerRect.left;
                    const globalPercent = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
                    const maxEpochs = currentEpochNo - MIN_EPOCH;
                    const newEpoch = Math.round(MIN_EPOCH + 1 + (globalPercent / 100) * maxEpochs);
                    const clampedEpoch = Math.min(currentEpochNo, Math.max(newEpoch, startEpoch + 1));
                    const newPercent = ((clampedEpoch - MIN_EPOCH - 1) / maxEpochs) * 100;
                    if (newPercent > sliderStart + 0.5) {
                      setSliderEnd(newPercent);
                      setEndEpoch(clampedEpoch);
                    }
                    // Allow dragging
                    const handleMouseMove = (moveEvent) => {
                      if (!sliderContainerRef.current) return;
                      const moveContainerRect = sliderContainerRef.current.getBoundingClientRect();
                      const moveX = moveEvent.clientX - moveContainerRect.left;
                      const moveGlobalPercent = Math.max(0, Math.min(100, (moveX / moveContainerRect.width) * 100));
                      const moveEpoch = Math.round(MIN_EPOCH + 1 + (moveGlobalPercent / 100) * maxEpochs);
                      const moveClampedEpoch = Math.min(currentEpochNo, Math.max(moveEpoch, startEpoch + 1));
                      const moveNewPercent = ((moveClampedEpoch - MIN_EPOCH - 1) / maxEpochs) * 100;
                      if (moveNewPercent > sliderStart + 0.5) {
                        setSliderEnd(moveNewPercent);
                        setEndEpoch(moveClampedEpoch);
                      }
                    };
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                <span>Epoch {MIN_EPOCH + 1}</span>
                <span>Epoch {currentEpochNo}</span>
              </div>
            </div>
            {isLoading && (
              <p style={{ margin: 0, color: '#666' }}>
                {isInitialLoad ? 'Loading all epoch data (this may take a moment)...' : 'Loading data...'}
              </p>
            )}
            {!isLoading && Object.keys(allEpochData).length > 0 && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                Loaded {Object.keys(allEpochData).length} epochs. Adjust the slider to filter the range.
              </p>
            )}
          </>
        )}
        {!currentEpochNo && <p>Loading current epoch...</p>}
      </div>

      {/* Table of Contents */}
      {epochData.length > 0 && (
        <div style={{ margin: '2rem 0' }}>
          <Heading as="h2">Contents</Heading>
          <ul>
            <li><Link href="#reserves">Reserves Evolution</Link></li>
            <li><Link href="#rewards">Distributed Rewards</Link></li>
            <li><Link href="#treasury">Treasury Evolution</Link></li>
            <li><Link href="#deposits">Deposits</Link></li>
          </ul>
        </div>
      )}

      {/* Reserves Section */}
      {epochData.length > 0 && (
        <section id="reserves" style={{ marginTop: '3rem', scrollMarginTop: '2rem' }}>
          <Heading as="h2">Reserves Evolution</Heading>
          <p>
            The Cardano reserves represent the difference between the maximum supply (45 billion ada) and the total supply in circulation. 
            Reserves were originally defined in the <Link href="/genesis">genesis block</Link> and are gradually released through the reward mechanism, where a portion of each epoch's rewards comes from the reserves.
          </p>
          <p>
            Over time, reserves decrease as ada is distributed to stakeholders through staking rewards. This chart shows how the reserves 
            have evolved (degraded) across the selected epoch range.
          </p>
          {reservesChartData && <LineChartEcharts chartData={reservesChartData} title="Reserves" />}
          {reservesStats && epochData.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p>
                <strong>Summary:</strong> Between Epoch <strong>{startEpoch}</strong> ({getEpochDate(startEpoch)}) and Epoch <strong>{endEpoch}</strong> ({getEpochDate(endEpoch)}){' '}
                Reserves {reservesStats.delta < 0 ? 'decreased' : 'increased'} from <strong>{convertLovelacesToAda(reservesStats.first).toLocaleString()} ada</strong>{' '}
                to <strong>{convertLovelacesToAda(reservesStats.last).toLocaleString()} ada</strong>,{' '}
                a change of <strong>{convertLovelacesToAda(Math.abs(reservesStats.delta)).toLocaleString()} ada</strong>{' '}
                ({reservesStats.delta < 0 ? '-' : '+'}{Math.abs(parseFloat(reservesStats.percentChange))}%).
              </p>
              <p style={{ marginTop: '1rem' }}>
                <strong>Epoch 606:</strong> In January 2026 the Cardano Mainnet has distributed 50% of the reserves.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Rewards Section */}
      {epochData.length > 0 && (
        <section id="rewards" style={{ marginTop: '3rem', scrollMarginTop: '2rem' }}>
          <Heading as="h2">Distributed Rewards</Heading>
          <p>
            Distributed rewards are composed of two sources: ada taken from the reserves and transaction fees paid by users. 
            These rewards are distributed to various participants in the Cardano ecosystem.
          </p>
          <p>The reward distribution includes:</p>
          <ul>
            <li><strong>a)</strong> Staking rewards to users who delegate their ada</li>
            <li><strong>b)</strong> Margin and fixed fees to Stake Pool Operators (SPOs) for operating the network infrastructure</li>
            <li><strong>c)</strong> A taxation portion that goes to the common treasury to support ecosystem development</li>
          </ul>
          {rewardsChartData && <LineChartEcharts chartData={rewardsChartData} title="Distributed Rewards" yAxisMin={0} yAxisMax={25000000} />}
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            <em>Note: Detailed breakdown of rewards distribution to users, SPOs, and treasury requires additional data queries.</em>
          </p>
        </section>
      )}

      {/* Treasury Section */}
      {epochData.length > 0 && (
        <section id="treasury" style={{ marginTop: '3rem', scrollMarginTop: '2rem' }}>
          <Heading as="h2">Treasury Evolution</Heading>
          <p>
            The Cardano treasury grows from the taxation portion of each epoch's reward distribution. This cut ensures ongoing 
            funding for ecosystem development, research, and community initiatives.
          </p>
          <p>
            The treasury can also shrink when treasury withdrawals are enacted through governance actions. These withdrawals 
            fund approved proposals and initiatives that benefit the Cardano ecosystem.
          </p>
          {treasuryChartData && <LineChartEcharts chartData={treasuryChartData} title="Treasury" hasSecondYAxis={true} />}
          {treasuryStats && epochData.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p>
                <strong>Summary:</strong> Between Epoch <strong>{startEpoch}</strong> ({getEpochDate(startEpoch)}) and Epoch <strong>{endEpoch}</strong> ({getEpochDate(endEpoch)}){' '}
                Treasury {treasuryStats.delta < 0 ? 'decreased' : 'increased'} from <strong>{convertLovelacesToAda(treasuryStats.first).toLocaleString()} ada</strong>{' '}
                to <strong>{convertLovelacesToAda(treasuryStats.last).toLocaleString()} ada</strong>,{' '}
                a change of <strong>{convertLovelacesToAda(Math.abs(treasuryStats.delta)).toLocaleString()} ada</strong>{' '}
                ({treasuryStats.delta < 0 ? '-' : '+'}{Math.abs(parseFloat(treasuryStats.percentChange))}%).
              </p>
              <p>
                Total additions: <strong>{convertLovelacesToAda(treasuryStats.totalAdditions).toLocaleString()} ada</strong> | 
                Total withdrawals: <strong>{convertLovelacesToAda(treasuryStats.totalWithdrawals).toLocaleString()} ada</strong>
              </p>
            </div>
          )}
        </section>
      )}

      {/* Deposits Section */}
      {epochData.length > 0 && (
        <section id="deposits" style={{ marginTop: '3rem', scrollMarginTop: '2rem' }}>
          <Heading as="h2">Deposits</Heading>
          <p>
            Cardano requires various types of deposits to ensure network security and governance participation. Users register 
            their wallets with a staking key deposit (currently 2 ada per key), Stake Pool Operators register pools with a 
            500 ada deposit, and DReps must also place a deposit to participate in governance.
          </p>
          <p>
            Additionally, governance action deposits (currently 100,000 ada per action) are required when submitting governance 
            proposals. Deposits are also returned when the GA expires. At no point are GA deposits lost. The proposer always receives them back after the action expires or enacts.
          </p>
          <p>
            Stake pool pledge is a separate mechanism where pool operators commit their own ada to their pools. For detailed 
            information about pledge, see the dedicated pledge page (coming soon).
          </p>
          {depositsChartData && <LineChartEcharts chartData={depositsChartData} title="Deposits" />}
          {depositsStats && (
            <div style={{ marginTop: '1rem' }}>
              <p>
                <strong>Current Total Deposits:</strong> <strong>{convertLovelacesToAda(depositsStats.total).toLocaleString()} ada</strong>
              </p>
              <ul>
                <li>Stake Deposits: {convertLovelacesToAda(depositsStats.stake).toLocaleString()} ada</li>
                <li>DRep Deposits: {convertLovelacesToAda(depositsStats.drep).toLocaleString()} ada</li>
                <li>Proposal Deposits: {convertLovelacesToAda(depositsStats.proposal).toLocaleString()} ada</li>
              </ul>
            </div>
          )}
        </section>
      )}

      <InsightsFooter lastUpdated="Dynamic" />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  Page wrapper
// ────────────────────────────────────────────────────────────────────────────
export default function SupplySummaryPage() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo {...meta.og} />
      <PageContent />
    </InsightsLayout>
  );
}

