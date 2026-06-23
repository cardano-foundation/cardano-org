import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import * as echarts from 'echarts';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import { translate } from '@docusaurus/Translate';

import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import Divider from '@site/src/components/Layout/Divider';
import EpochRangeSlider from '@site/src/components/Insights/EpochRangeSlider';

import { makeApiClient } from '@site/src/utils/insights/api';
import { MIN_EPOCH, getEpochDate } from '@site/src/utils/insights/epochs';
import { parseMarkdownLikeText } from '@site/src/utils/textUtils';
import {
  PLEDGE_CHANGES_URL,
  LOG_PLEDGE_FLOOR,
  INDIVIDUAL_PLEDGE_Y_MAX,
  buildPledgeChangeSegments,
  buildPledgeDistribution,
  collectPoolPledgesAtEpoch,
  computeEligibleTotalsByEpoch,
  computePledgeChangeStats,
  filterPoolsByPledgeFulfillment,
  filterPoolsForPledgeRange,
  mergePledgeDistributions,
} from '@site/src/utils/insights/stakepools';

import './index.css';

export const meta = {
  pageName: 'stakepools-pledge',
  pageTitle: translate({
    id: 'insightsStakepools.meta.pageTitle',
    message: 'Cardano Stake Pool Pledge',
  }),
  pageDescription: translate({
    id: 'insightsStakepools.meta.pageDescription',
    message: 'How operator pledges change over time and what they mean for delegator rewards.',
  }),
  title: translate({
    id: 'insightsStakepools.meta.title',
    message: 'Stake Pool Pledge',
  }),
  date: '',
  og: {
    title: translate({
      id: 'insightsStakepools.og.title',
      message: 'Cardano Stake Pool Pledge',
    }),
    description: translate({
      id: 'insightsStakepools.og.description',
      message: 'Track stake pool operator pledges across epochs and see how fulfillment affects delegator rewards.',
    }),
  },
  tags: ['staking'],
  indexed: true,
};

function formatGeneratedAt(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }) + ' UTC';
  } catch {
    return iso;
  }
}

function PledgeChangesChart({
  flatSegments,
  deltaSegments,
  eligibleTotalsSeries,
  epochFrom,
  epochTo,
  useLog,
  selectedEpoch,
  onEpochSelect,
  pledgeView,
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const onEpochSelectRef = useRef(onEpochSelect);
  const epochBoundsRef = useRef({ from: epochFrom, to: epochTo });

  useEffect(() => {
    onEpochSelectRef.current = onEpochSelect;
    epochBoundsRef.current = { from: epochFrom, to: epochTo };
  }, [onEpochSelect, epochFrom, epochTo]);

  const selectEpochFromChart = useCallback((chart, pixelX, pixelY) => {
    const pixel = [pixelX, pixelY];
    if (!chart.containPixel({ gridIndex: 0 }, pixel)) return;

    const converted = chart.convertFromPixel({ gridIndex: 0 }, pixel);
    const epochValue = Array.isArray(converted) ? converted[0] : converted;
    if (epochValue == null || Number.isNaN(epochValue)) return;

    const epoch = Math.round(epochValue);
    const { from, to } = epochBoundsRef.current;
    if (epoch >= from && epoch <= to) {
      onEpochSelectRef.current?.(epoch);
    }
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const handleGridClick = (e) => {
      selectEpochFromChart(chart, e.offsetX, e.offsetY);
    };

    const handleSeriesClick = (params) => {
      if (params.componentType !== 'series') return;
      const value = params.value;
      const epochValue = Array.isArray(value) ? value[0] : value;
      if (epochValue == null || Number.isNaN(epochValue)) return;

      const epoch = Math.round(epochValue);
      const { from, to } = epochBoundsRef.current;
      if (epoch >= from && epoch <= to) {
        onEpochSelectRef.current?.(epoch);
      }
    };

    chart.getZr().on('click', handleGridClick);
    chart.on('click', handleSeriesClick);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.getZr().off('click', handleGridClick);
      chart.off('click', handleSeriesClick);
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [selectEpochFromChart]);

  const option = useMemo(() => {
    const showTotals = pledgeView === 'fulfilled';
    const hasData =
      flatSegments.length > 0 ||
      deltaSegments.length > 0 ||
      (showTotals && eligibleTotalsSeries.length > 0);
    if (!hasData) return null;

    const upSegments = deltaSegments.filter((s) => s.direction === 'up');
    const downSegments = deltaSegments.filter((s) => s.direction === 'down');
    const labelColor = isDark ? '#fff' : '#000';
    const activeAxisColor = '#1565C0';
    const promisedAxisColor = '#00838F';
    const isUnfulfilledView = pledgeView === 'unfulfilled';
    const totalActiveLegend = translate({
      id: 'insightsStakepools.chart.legendTotalActive',
      message: 'Total pledge active',
    });
    const totalPromisedLegend = translate({
      id: 'insightsStakepools.chart.legendTotalPromised',
      message: 'Total promised (eligible)',
    });
    const upLegend = translate({
      id: 'insightsStakepools.chart.legendUp',
      message: 'Promised increase',
    });
    const downLegend = translate({
      id: 'insightsStakepools.chart.legendDown',
      message: 'Promised decrease',
    });
    const flatLegend = isUnfulfilledView
      ? translate({
        id: 'insightsStakepools.chart.legendFlatUnder',
        message: 'Promised (under-pledged)',
      })
      : translate({
        id: 'insightsStakepools.chart.legendFlat',
        message: 'Promised (fulfilled)',
      });

    const legendItems = [
      ...(showTotals ? [totalActiveLegend, totalPromisedLegend] : []),
      upLegend,
      downLegend,
      flatLegend,
    ];

    const yAxes = [
      {
        type: useLog ? 'log' : 'value',
        name: translate({ id: 'insightsStakepools.chart.pledgeAxis', message: 'Pool pledge (ADA)' }),
        logBase: 10,
        min: useLog ? LOG_PLEDGE_FLOOR : 0,
        max: useLog ? INDIVIDUAL_PLEDGE_Y_MAX : INDIVIDUAL_PLEDGE_Y_MAX,
        nameTextStyle: { color: labelColor },
        axisLine: { lineStyle: { color: labelColor } },
        axisLabel: {
          color: labelColor,
          formatter: (v) => Number(v).toLocaleString(),
        },
      },
    ];

    if (showTotals) {
      yAxes.push({
        type: 'value',
        name: translate({
          id: 'insightsStakepools.chart.totalPledgeAxis',
          message: 'Eligible totals (ADA)',
        }),
        position: 'right',
        nameTextStyle: { color: activeAxisColor },
        axisLine: { lineStyle: { color: activeAxisColor } },
        axisLabel: {
          color: activeAxisColor,
          formatter: (v) => Number(v).toLocaleString(),
        },
        splitLine: { show: false },
      });
    }

    const series = [
      {
        name: flatLegend,
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        yAxisIndex: 0,
        polyline: false,
        silent: true,
        data: flatSegments.map((s) => ({ coords: s.coords })),
        lineStyle: isUnfulfilledView
          ? { color: 'rgba(211, 47, 47, 0.1)', width: 1 }
          : {
            color: isDark ? '#aaa' : '#888',
            width: 1,
            opacity: 0.12,
          },
        z: 1,
      },
      {
        name: upLegend,
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        yAxisIndex: 0,
        polyline: false,
        silent: true,
        data: upSegments.map((s) => ({ coords: s.coords })),
        lineStyle: { color: 'rgba(46, 125, 50, 0.6)', width: 2 },
        z: 2,
      },
      {
        name: downLegend,
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        yAxisIndex: 0,
        polyline: false,
        silent: true,
        data: downSegments.map((s) => ({ coords: s.coords })),
        lineStyle: { color: 'rgba(255, 152, 0, 0.75)', width: 2 },
        z: 2,
      },
    ];

    if (showTotals) {
      series.push(
        {
          name: totalActiveLegend,
          type: 'line',
          yAxisIndex: 1,
          data: eligibleTotalsSeries.map((d) => [d.epoch, d.totalActiveAda]),
          lineStyle: { type: 'dotted', color: activeAxisColor, width: 2.5 },
          itemStyle: { color: activeAxisColor },
          showSymbol: false,
          triggerLineEvent: true,
          z: 10,
          markLine: selectedEpoch != null ? {
            silent: true,
            symbol: 'none',
            lineStyle: { color: '#5470c6', type: 'solid', width: 2 },
            data: [{ xAxis: selectedEpoch }],
          } : undefined,
        },
        {
          name: totalPromisedLegend,
          type: 'line',
          yAxisIndex: 1,
          data: eligibleTotalsSeries.map((d) => [d.epoch, d.totalPromisedAda]),
          lineStyle: { type: 'dashed', color: promisedAxisColor, width: 2 },
          itemStyle: { color: promisedAxisColor },
          showSymbol: false,
          triggerLineEvent: true,
          z: 9,
        },
      );
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: (params) => {
          const epoch = params[0]?.value?.[0];
          if (epoch == null) return '';
          const row = showTotals ? eligibleTotalsSeries.find((d) => d.epoch === epoch) : null;
          const lines = [`Epoch ${epoch} (${getEpochDate(epoch)})`];
          if (row) {
            lines.push(`Total pledge active: ${row.totalActiveAda.toLocaleString()} ADA`);
            lines.push(`Total promised (eligible): ${row.totalPromisedAda.toLocaleString()} ADA`);
          }
          lines.push(translate({
            id: 'insightsStakepools.chart.clickToSelect',
            message: 'Click to select epoch',
          }));
          return lines.join('<br/>');
        },
      },
      legend: {
        data: legendItems,
        textStyle: { color: labelColor },
        top: 0,
      },
      grid: {
        left: '3%',
        right: showTotals ? '10%' : '3%',
        bottom: '3%',
        top: 72,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: translate({ id: 'insightsStakepools.chart.epochAxis', message: 'Epoch' }),
        min: epochFrom,
        max: epochTo,
        nameTextStyle: { color: labelColor },
        axisLabel: {
          color: labelColor,
          formatter: (value) => `${value}\n${getEpochDate(value)}`,
        },
      },
      yAxis: yAxes,
      series,
    };
  }, [
    flatSegments,
    deltaSegments,
    eligibleTotalsSeries,
    epochFrom,
    epochTo,
    useLog,
    isDark,
    selectedEpoch,
    pledgeView,
  ]);

  useEffect(() => {
    if (!chartInstanceRef.current || !option) return;
    chartInstanceRef.current.setOption(option, { notMerge: true });
  }, [option]);

  return <div ref={chartRef} className="stakepools-pledge-chart stakepools-pledge-chart--clickable" />;
}

function PledgeDistributionChart({ mergedRows, currentEpoch, compareEpoch, useLog }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstanceRef.current = echarts.init(chartRef.current);
    const handleResize = () => chartInstanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  const hasCompare = compareEpoch != null;
  const chartHeight = Math.max(280, mergedRows.length * (hasCompare ? 44 : 32) + 96);

  const option = useMemo(() => {
    if (!mergedRows.length || currentEpoch == null) return null;

    const labelColor = isDark ? '#fff' : '#000';
    const greyBar = isDark ? '#757575' : '#9e9e9e';
    const blueBar = '#5470c6';
    const bucketLabels = mergedRows.map((r) => r.label);
    const currentCounts = mergedRows.map((r) => r.currentCount);
    const compareCounts = mergedRows.map((r) => r.compareCount);
    const totalCurrent = currentCounts.reduce((sum, n) => sum + n, 0);
    const currentSeriesName = translate(
      { id: 'insightsStakepools.distribution.seriesCurrent', message: 'Epoch {epoch}' },
      { epoch: currentEpoch },
    );
    const compareSeriesName = compareEpoch != null
      ? translate(
        { id: 'insightsStakepools.distribution.seriesCompare', message: 'Epoch {epoch}' },
        { epoch: compareEpoch },
      )
      : null;

    const titleText = compareEpoch != null
      ? translate(
        {
          id: 'insightsStakepools.distribution.titleCompare',
          message: 'Pledge distribution, Epoch {current} vs {compare}',
        },
        { current: currentEpoch, compare: compareEpoch, currentDate: getEpochDate(currentEpoch), compareDate: getEpochDate(compareEpoch) },
      )
      : translate(
        {
          id: 'insightsStakepools.distribution.title',
          message: 'Pledge distribution, Epoch {epoch} ({date})',
        },
        { epoch: currentEpoch, date: getEpochDate(currentEpoch) },
      );

    return {
      title: {
        text: titleText,
        subtext: translate(
          {
            id: 'insightsStakepools.distribution.subtitle',
            message: '{count} pools · {bucketMode} buckets',
          },
          {
            count: totalCurrent.toLocaleString(),
            bucketMode: useLog
              ? translate({ id: 'insightsStakepools.distribution.logBuckets', message: 'log-scale' })
              : translate({ id: 'insightsStakepools.distribution.linearBuckets', message: '5M ADA' }),
          },
        ),
        textStyle: { color: labelColor, fontSize: 14 },
        subtextStyle: { color: isDark ? '#aaa' : '#666', fontSize: 12 },
        left: 0,
      },
      legend: hasCompare ? {
        data: [compareSeriesName, currentSeriesName],
        textStyle: { color: labelColor },
        top: 48,
      } : undefined,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          if (!params?.length) return '';
          const poolsLabel = translate({ id: 'insightsStakepools.distribution.poolsLabel', message: 'pools' });
          let result = `${params[0].name}<br/>`;
          params.forEach((p) => {
            if (p.value == null) return;
            result += `${p.marker}${p.seriesName}: ${Number(p.value).toLocaleString()} ${poolsLabel}<br/>`;
          });
          return result;
        },
      },
      grid: { left: '3%', right: '6%', bottom: '3%', top: hasCompare ? 88 : 64, containLabel: true },
      xAxis: {
        type: 'value',
        name: translate({ id: 'insightsStakepools.distribution.xAxis', message: 'Pools' }),
        nameTextStyle: { color: labelColor },
        axisLabel: { color: labelColor },
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        data: bucketLabels,
        name: translate({ id: 'insightsStakepools.distribution.yAxis', message: 'Pledge (ADA)' }),
        nameTextStyle: { color: labelColor },
        axisLabel: { color: labelColor, width: 96, overflow: 'truncate' },
      },
      series: hasCompare
        ? [
          {
            name: compareSeriesName,
            type: 'bar',
            data: compareCounts,
            itemStyle: { color: greyBar },
            barMaxWidth: 22,
          },
          {
            name: currentSeriesName,
            type: 'bar',
            data: currentCounts,
            itemStyle: { color: blueBar },
            barMaxWidth: 22,
          },
        ]
        : [
          {
            name: currentSeriesName,
            type: 'bar',
            data: currentCounts,
            itemStyle: { color: blueBar },
            barMaxWidth: 28,
          },
        ],
    };
  }, [mergedRows, currentEpoch, compareEpoch, useLog, isDark, hasCompare]);

  useEffect(() => {
    if (!chartInstanceRef.current || !option) return;
    chartInstanceRef.current.setOption(option, { notMerge: true });
    chartInstanceRef.current.resize();
  }, [option, chartHeight]);

  if (!mergedRows.length || currentEpoch == null) {
    return (
      <p className="stakepools-distribution-empty">
        {translate({
          id: 'insightsStakepools.distribution.empty',
          message: 'Click an epoch in the chart above to see how pools are distributed across pledge sizes.',
        })}
      </p>
    );
  }

  return (
    <div
      ref={chartRef}
      className="stakepools-distribution-chart"
      style={{ height: chartHeight }}
    />
  );
}

function PageContent() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;

  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);
  const [pledgeData, setPledgeData] = useState(null);
  const [currentEpochNo, setCurrentEpochNo] = useState(null);

  const [startEpoch, setStartEpoch] = useState(null);
  const [endEpoch, setEndEpoch] = useState(null);
  const [minPledge, setMinPledge] = useState(0);
  const [maxPledge, setMaxPledge] = useState('');
  const [useLog, setUseLog] = useState(true);
  const [pledgeView, setPledgeView] = useState('fulfilled');
  const [selectedEpoch, setSelectedEpoch] = useState(null);
  const [compareEpoch, setCompareEpoch] = useState(null);

  useEffect(() => {
    const fetchTip = async () => {
      if (!API_URL) return;
      try {
        const api = makeApiClient(API_URL);
        const tipRes = await api.get('/tip');
        setCurrentEpochNo(tipRes.data?.[0]?.epoch_no ?? null);
      } catch (err) {
        console.warn('Failed to fetch current epoch:', err);
      }
    };
    fetchTip();
  }, [API_URL]);

  useEffect(() => {
    const loadPledgeData = async () => {
      setIsLoading(true);
      setErrorInfo(null);
      try {
        const response = await fetch(PLEDGE_CHANGES_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setPledgeData(data);

        const dataMin = data.meta?.first_epoch ?? MIN_EPOCH + 1;
        const dataMax = data.meta?.last_epoch ?? dataMin;
        setStartEpoch(dataMin);
        setEndEpoch(dataMax);
        setSelectedEpoch(dataMax);
      } catch (err) {
        setErrorInfo({
          title: translate({
            id: 'insightsStakepools.error.loadTitle',
            message: 'Could not load pledge data',
          }),
          message: err?.message || translate({
            id: 'insightsStakepools.error.loadMessage',
            message: 'The pledge changes dataset is unavailable.',
          }),
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadPledgeData();
  }, []);

  const dataMinEpoch = pledgeData?.meta?.first_epoch ?? MIN_EPOCH + 1;
  const dataMaxEpoch = pledgeData?.meta?.last_epoch ?? currentEpochNo ?? dataMinEpoch;
  const maxPledgeValue = maxPledge === '' ? null : Number(maxPledge);

  const segmentOptions = useMemo(() => {
    if (!pledgeData?.pools || startEpoch == null || endEpoch == null) return null;
    return {
      epochFrom: startEpoch,
      epochTo: endEpoch,
      minPledge,
      maxPledge: maxPledgeValue,
      extendToEpoch: Math.min(pledgeData.meta?.last_epoch ?? endEpoch, endEpoch),
      useLog,
    };
  }, [pledgeData, startEpoch, endEpoch, minPledge, maxPledgeValue, useLog]);

  const filteredPools = useMemo(() => {
    if (!pledgeData?.pools || !segmentOptions) return {};
    const inRange = filterPoolsForPledgeRange(pledgeData.pools, segmentOptions);
    return filterPoolsByPledgeFulfillment(
      inRange,
      segmentOptions.epochFrom,
      segmentOptions.epochTo,
      pledgeView,
    );
  }, [pledgeData, segmentOptions, pledgeView]);

  const { flatSegments, deltaSegments } = useMemo(() => {
    if (!segmentOptions) {
      return { flatSegments: [], deltaSegments: [] };
    }
    return buildPledgeChangeSegments(filteredPools, segmentOptions);
  }, [filteredPools, segmentOptions]);

  const eligibleTotalsSeries = useMemo(() => {
    if (!pledgeData?.pools || startEpoch == null || endEpoch == null) return [];
    return computeEligibleTotalsByEpoch(pledgeData.pools, startEpoch, endEpoch);
  }, [pledgeData, startEpoch, endEpoch]);

  const stats = useMemo(() => {
    if (!filteredPools || startEpoch == null || endEpoch == null) return null;
    return computePledgeChangeStats(
      filteredPools,
      startEpoch,
      endEpoch,
      minPledge,
      maxPledgeValue,
    );
  }, [filteredPools, startEpoch, endEpoch, minPledge, maxPledgeValue]);

  const distributionBuckets = useMemo(() => {
    if (!pledgeData?.pools || selectedEpoch == null) return [];
    const pledges = collectPoolPledgesAtEpoch(
      pledgeData.pools,
      selectedEpoch,
      true,
      minPledge,
      maxPledgeValue,
      pledgeView,
    );
    return buildPledgeDistribution(pledges, useLog);
  }, [pledgeData, selectedEpoch, useLog, minPledge, maxPledgeValue, pledgeView]);

  const compareBuckets = useMemo(() => {
    if (!pledgeData?.pools || compareEpoch == null) return [];
    const pledges = collectPoolPledgesAtEpoch(
      pledgeData.pools,
      compareEpoch,
      true,
      minPledge,
      maxPledgeValue,
      pledgeView,
    );
    return buildPledgeDistribution(pledges, useLog);
  }, [pledgeData, compareEpoch, useLog, minPledge, maxPledgeValue, pledgeView]);

  const mergedDistribution = useMemo(() => {
    if (!distributionBuckets.length && !compareBuckets.length) return [];
    return mergePledgeDistributions(distributionBuckets, compareBuckets, useLog);
  }, [distributionBuckets, compareBuckets, useLog]);

  const handleEpochRangeChange = useCallback((start, end) => {
    setStartEpoch(start);
    setEndEpoch(end);
    setSelectedEpoch((prev) => {
      if (prev == null || prev < start || prev > end) return end;
      return prev;
    });
    setCompareEpoch((prev) => {
      if (prev == null || prev < start || prev > end) return null;
      return prev;
    });
  }, []);

  const handleEpochSelect = useCallback((epoch) => {
    setSelectedEpoch((prev) => {
      if (prev === epoch) return prev;
      if (prev != null) setCompareEpoch(prev);
      return epoch;
    });
  }, []);

  if (errorInfo && !pledgeData) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <div role="alert" className="stakepools-alert">
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
          translate({
            id: 'insightsStakepools.intro.description',
            message:
              '**Explore stake pool operator pledges** on Cardano: how much ada pool owners commit from their own wallets, and how that shapes rewards for delegators. See the [pledge](/glossary/pledge) and [stake pool](/glossary/stake-pool) glossary entries for background.',
          }),
        ]}
        headingDot
      />

      {pledgeData?.meta && (
        <p className="stakepools-freshness">
          {translate(
            {
              id: 'insightsStakepools.freshness',
              message:
                'Data as of {generatedAt}. Covers epochs {firstEpoch}-{lastEpoch} ({poolCount} pools with promised pledge changes, {activeChangeCount} pledge-active events). Pledge-active changes omit moves below {activeMinDelta} ADA.',
            },
            {
              generatedAt: formatGeneratedAt(pledgeData.meta.generated_at),
              firstEpoch: pledgeData.meta.first_epoch,
              lastEpoch: pledgeData.meta.last_epoch,
              poolCount: pledgeData.meta.pool_count?.toLocaleString() ?? 'n/a',
              activeChangeCount: pledgeData.meta.pledge_active_change_count?.toLocaleString() ?? 'n/a',
              activeMinDelta: pledgeData.meta.filters?.pledge_active_min_delta_ada?.toLocaleString() ?? '10,000',
            },
          )}
        </p>
      )}

      <div className="stakepools-controls">
        <h3 style={{ marginTop: 0 }}>
          {translate({ id: 'insightsStakepools.controls.title', message: 'Chart filters' })}
        </h3>

        {startEpoch != null && endEpoch != null && (
          <EpochRangeSlider
            minEpoch={dataMinEpoch}
            maxEpoch={dataMaxEpoch}
            startEpoch={startEpoch}
            endEpoch={endEpoch}
            onChange={handleEpochRangeChange}
          />
        )}

        <div className="stakepools-filter-row">
          <label className="stakepools-filter-field">
            <span>{translate({ id: 'insightsStakepools.filter.minPledge', message: 'Min pledge (ADA)' })}</span>
            <input
              type="number"
              min="0"
              value={minPledge}
              onChange={(e) => setMinPledge(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>
          <label className="stakepools-filter-field">
            <span>{translate({ id: 'insightsStakepools.filter.maxPledge', message: 'Max pledge (ADA)' })}</span>
            <input
              type="number"
              min="0"
              placeholder={translate({ id: 'insightsStakepools.filter.noMax', message: 'No max' })}
              value={maxPledge}
              onChange={(e) => setMaxPledge(e.target.value)}
            />
          </label>
          <label className="stakepools-filter-field stakepools-log-toggle">
            <span>{translate({ id: 'insightsStakepools.filter.pledgeView', message: 'Pool pledge status' })}</span>
            <div className="stakepools-toggle-group">
              <button
                type="button"
                className={`button button--sm${pledgeView === 'fulfilled' ? ' button--primary' : ' button--secondary'}`}
                onClick={() => setPledgeView('fulfilled')}
                title={translate({
                  id: 'insightsStakepools.filter.fulfilledTitle',
                  message: 'Pools where pledge active ≥ promised for the whole selected epoch range',
                })}
              >
                {translate({ id: 'insightsStakepools.filter.fulfilled', message: 'Fulfilled' })}
              </button>
              <button
                type="button"
                className={`button button--sm${pledgeView === 'unfulfilled' ? ' button--primary' : ' button--secondary'}`}
                onClick={() => setPledgeView('unfulfilled')}
                title={translate({
                  id: 'insightsStakepools.filter.unfulfilledTitle',
                  message: 'Pools under-pledged in at least one epoch of the selected range',
                })}
              >
                {translate({ id: 'insightsStakepools.filter.unfulfilled', message: 'Under-pledged' })}
              </button>
            </div>
          </label>
          <label className="stakepools-filter-field stakepools-log-toggle">
            <span>{translate({ id: 'insightsStakepools.filter.yScale', message: 'Y-axis scale' })}</span>
            <div className="stakepools-toggle-group">
              <button
                type="button"
                className={`button button--sm${!useLog ? ' button--primary' : ' button--secondary'}`}
                onClick={() => setUseLog(false)}
                title={translate({
                  id: 'insightsStakepools.filter.linearTitle',
                  message: 'Linear scale',
                })}
              >
                {translate({ id: 'insightsStakepools.filter.linear', message: 'Linear' })}
              </button>
              <button
                type="button"
                className={`button button--sm${useLog ? ' button--primary' : ' button--secondary'}`}
                onClick={() => setUseLog(true)}
                title={translate({
                  id: 'insightsStakepools.filter.logTitle',
                  message: 'Log scale: values at or below 0 ADA are shown at 1 ADA',
                })}
              >
                {translate({ id: 'insightsStakepools.filter.log', message: 'Log' })}
              </button>
            </div>
          </label>
        </div>

        {useLog && (
          <p className="stakepools-log-note">
            {translate({
              id: 'insightsStakepools.filter.logNote',
              message:
                'Log scale (left axis): pledge values at or below 0 ADA are displayed at 1 ADA so they remain visible on the chart.',
            })}
          </p>
        )}

        {isLoading && (
          <p className="stakepools-loading">
            {translate({ id: 'insightsStakepools.loading', message: 'Loading pledge data…' })}
          </p>
        )}
      </div>

      {!isLoading && pledgeData && (
        <>
          <div style={{ marginTop: '2rem' }}>
            <Heading as="h2">
              {translate({ id: 'insightsStakepools.toc.title', message: 'Contents' })}
            </Heading>
            <ul>
              <li>
                <Link href="#pledge-changes">
                  {translate({ id: 'insightsStakepools.toc.pledge', message: 'Pledge changes' })}
                </Link>
              </li>
              <li>
                <Link href="#pledge-distribution">
                  {translate({ id: 'insightsStakepools.toc.distribution', message: 'Pledge distribution' })}
                </Link>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <Divider
              text={translate({ id: 'insightsStakepools.pledge.divider', message: 'Pledge changes' })}
              id="pledge-changes"
            />
            <p>
              {parseMarkdownLikeText(translate({
                id: 'insightsStakepools.pledge.description1',
                message:
                  'When a pool owner registers a stake pool, one of the parameters they set is their **pledge**: ada from their own wallet committed to that pool. Their wallet must always hold at least that amount. If it does not, the pool earns no staking rewards for its delegators until the balance is restored.',
              }))}
            </p>
            <p>
              {parseMarkdownLikeText(translate({
                id: 'insightsStakepools.pledge.description2',
                message:
                  'The pledge amount also shapes economics for delegators. The more ada an operator can promise and keep in their wallet, the higher the relative rewards for everyone who stakes with that pool. A fully pledged pool can deliver roughly 30% more rewards than one with a very small pledge. The [a0 parameter](/glossary/a0) defines how this trade-off works.',
              }))}
            </p>
            <p>
              {translate({
                id: 'insightsStakepools.pledge.description3',
                message:
                  'Green and orange vertical segments mark pledge increases and decreases. In the fulfilled view, grey horizontal lines show stable pledge levels; the dotted blue and dashed teal lines on the right sum wallet balances and declared pledges across reward-eligible pools. Switch to Under-pledged to inspect pools that miss their promise; horizontal lines appear in light red instead of grey.',
              })}
            </p>

            <PledgeChangesChart
              flatSegments={flatSegments}
              deltaSegments={deltaSegments}
              eligibleTotalsSeries={eligibleTotalsSeries}
              epochFrom={startEpoch}
              epochTo={endEpoch}
              useLog={useLog}
              selectedEpoch={selectedEpoch}
              onEpochSelect={handleEpochSelect}
              pledgeView={pledgeView}
            />

            {stats && pledgeView === 'fulfilled' && (() => {
              const delta = stats.totalPledgeDelta;
              const deltaPhrase = delta > 0
                ? translate(
                  { id: 'insightsStakepools.summary.deltaUp', message: 'increased by {amount} ADA' },
                  { amount: delta.toLocaleString() },
                )
                : delta < 0
                  ? translate(
                    { id: 'insightsStakepools.summary.deltaDown', message: 'decreased by {amount} ADA' },
                    { amount: Math.abs(delta).toLocaleString() },
                  )
                  : translate({ id: 'insightsStakepools.summary.deltaFlat', message: 'did not change' });
              return (
                <div className="stakepools-summary">
                  <p>
                    {translate(
                      {
                        id: 'insightsStakepools.summary.delta',
                        message:
                          'Between Epoch {start} ({startDate}) and Epoch {end} ({endDate}), total pledge active among eligible pools {deltaPhrase} ({changeCount} promised-pledge change events across {poolCount} pools: {up} increases and {down} decreases).',
                      },
                      {
                        start: startEpoch,
                        startDate: getEpochDate(startEpoch),
                        end: endEpoch,
                        endDate: getEpochDate(endEpoch),
                        deltaPhrase,
                        changeCount: stats.changeCount.toLocaleString(),
                        poolCount: stats.poolCount.toLocaleString(),
                        up: stats.upCount.toLocaleString(),
                        down: stats.downCount.toLocaleString(),
                      },
                    )}
                  </p>
                </div>
              );
            })()}

            <Divider
              text={translate({ id: 'insightsStakepools.distribution.divider', message: 'Pledge distribution' })}
              id="pledge-distribution"
            />
            <p>
              {translate({
                id: 'insightsStakepools.distribution.compareHint',
                message:
                  'Click an epoch in the chart above to view its distribution here. Click a second epoch to compare both side by side in the chart below (grey and blue bars).',
              })}
            </p>
            <p>
              {translate({
                id: 'insightsStakepools.distribution.description',
                message:
                  'Horizontal bars show how many pools fall into each pledge size band. Bucket widths follow the Y-axis mode above: 5 million ADA steps in linear view, powers of ten in log view.',
              })}
            </p>
            <PledgeDistributionChart
                mergedRows={mergedDistribution}
                currentEpoch={selectedEpoch}
                compareEpoch={compareEpoch}
                useLog={useLog}
              />
          </div>
        </>
      )}

      <InsightsFooter lastUpdated={pledgeData?.meta?.generated_at || 'Dynamic'} />
    </>
  );
}

export default function StakePoolPledgeInsightsPage() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo
        pageName={meta.pageName}
        title={meta.og.title}
        description={meta.og.description}
      />
      <PageContent />
    </InsightsLayout>
  );
}
