import React, { useState, useEffect, useMemo, useRef } from 'react';
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import * as echarts from 'echarts';

import SiteHero from "@site/src/components/Layout/SiteHero";
import { makeApiClient } from '@site/src/utils/insights/api';
import { dateToEpoch } from '@site/src/utils/insights/epochs';
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import Divider from "@site/src/components/Layout/Divider";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import CtaOneColumn from "@site/src/components/Layout/CtaOneColumn";

import { Showcases, Tags } from "@site/src/data/apps";
import appStats from "@site/src/data/tx-stats.json";
import appStats73 from "@site/src/data/tx-stats-73epochs.json";

import styles from "./leaderboard.module.css";

const CIP20_LABEL = 674;

// Helper to format numbers with commas
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

// Helper to format numbers in shortened form (e.g., 164K)
function formatShortNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

// Helper to find app details from apps.js by matching statsLabel or normalized title
function findAppDetails(statEntry) {
  return Showcases.find(app =>
    app.statsLabel === statEntry.label ||
    app.title.toLowerCase().replace(/\s+/g, '').replace(/-/g, '') === statEntry.label.replace(/-/g, '')
  );
}

// Get the image source, handling both require() objects and string URLs
function getIconSrc(app) {
  if (!app?.icon) return null;
  if (typeof app.icon === 'string') return app.icon;
  if (typeof app.icon === 'object') return app.icon.default || app.icon.src || null;
  return null;
}

// Map app labels to display-friendly category names
function getCategoryForApp(app) {
  if (!app) return 'Not Listed';
  const tags = app.tags || [];
  if (tags.includes('dex')) return 'DEX';
  if (tags.includes('lending')) return 'Lending';
  if (tags.includes('marketplace')) return 'Marketplace';
  if (tags.includes('oracle')) return 'Oracle';
  if (tags.includes('stablecoin')) return 'Stablecoin';
  if (tags.includes('wallet')) return 'Wallet';
  if (tags.includes('game')) return 'Gaming';
  if (tags.includes('governance')) return 'Governance';
  if (tags.includes('bridge')) return 'Bridge';
  if (tags.includes('minting')) return 'Minting';
  return 'Other';
}

// Metadata label info: maps numeric labels to display names and existing categories
const metadataInfo = {
  674:   { name: 'CIP-20 Tx Messages',       category: null },
  721:   { name: 'CIP-25 NFT Minting',       category: 'Minting' },
  1226:  { name: 'Oracle Metadata',           category: 'Oracle' },
  61284: { name: 'Catalyst Registration',     category: 'Governance', group: 'catalyst' },
  61285: { name: 'Catalyst Witness',          category: 'Governance', group: 'catalyst' },
  61286: { name: 'Catalyst Deregistration',   category: 'Governance', group: 'catalyst' },
  87:    { name: 'Milkomeda Protocol',        category: 'Bridge',     group: 'milkomeda' },
  88:    { name: 'Milkomeda Sidechain',       category: 'Bridge',     group: 'milkomeda' },
  94:    { name: 'SPO On-chain Polls',        category: 'Governance' },
  777:   { name: 'CIP-27 Royalties',          category: 'Minting' },
  1694:  { name: 'Voltaire Governance',       category: 'Governance' },
  123:   { name: 'Shareslake Bridge',         category: 'Bridge' },
  1854:  { name: 'CIP-146 Multi-sig',         category: null },
  22:    { name: 'Clarity DAO',               category: 'Governance' },
  867:   { name: 'CIP-88 Token Policy',       category: null },
  1447:  { name: 'Reeve On-chain Records',    category: null },
  3692:  { name: 'CIP-149 DRep Compensation', category: 'Governance' },
  620:   { name: 'Seedtrace Supply Chain',    category: null },
  839:   { name: 'Agora Proposals',           category: 'Governance' },
  888:   { name: 'Finitum Bridge',            category: 'Bridge' },
  21325: { name: 'PRISM DID Registry',        category: null },
  1967:  { name: 'nut.link Oracle Registry',  category: 'Oracle' },
  1968:  { name: 'nut.link Oracle Data',      category: 'Oracle' },
  1668:  { name: 'Begin dApp Ratings',        category: 'Wallet' },
  1904:  { name: 'Supply Chain Verification', category: null },
};

const metadataGroups = {
  catalyst:  { name: 'Catalyst Voting',   category: 'Governance' },
  milkomeda: { name: 'Milkomeda Bridge',  category: 'Bridge' },
};

// Merge metadata entries that share a group into single combined rows
function mergeMetadataGroups(entries) {
  const grouped = {};
  const ungrouped = [];

  entries.forEach(entry => {
    const originalLabel = Number(entry.label.replace('metadata-', ''));
    const info = metadataInfo[originalLabel];
    if (info?.group) {
      const groupKey = info.group;
      if (!grouped[groupKey]) {
        const groupInfo = metadataGroups[groupKey];
        grouped[groupKey] = {
          label: `metadata-group-${groupKey}`,
          displayName: groupInfo.name,
          txCount: 0,
          isMetadata: true,
          metadataCategory: groupInfo.category,
        };
      }
      grouped[groupKey].txCount = Math.max(grouped[groupKey].txCount, entry.txCount);
    } else {
      ungrouped.push(entry);
    }
  });

  return [...ungrouped, ...Object.values(grouped)];
}

// Normalize a metadataLabelStats entry into the same shape as appStats entries
function normalizeMetadataEntry(entry) {
  const info = metadataInfo[entry.label];
  const displayName = info?.name
    || (entry.description ? entry.description.split(' - ')[0] : `Label ${entry.label}`);
  return {
    label: `metadata-${entry.label}`,
    displayName,
    txCount: entry.txCount,
    isMetadata: true,
    metadataCategory: info?.category || null,
  };
}

// Get category for any entry (app or metadata)
function getCategoryForEntry(statEntry, appDetails) {
  if (statEntry.isMetadata) return statEntry.metadataCategory || 'Not Listed';
  return getCategoryForApp(appDetails);
}

// Define category colors
const categoryColors = {
  'DEX': '#3D5AFE',
  'Lending': '#9E1C1C',
  'Marketplace': '#E53935',
  'Oracle': '#1E88E5',
  'Stablecoin': '#FF1744',
  'Wallet': '#7BC8A6',
  'Gaming': '#008080',
  'Governance': '#673AB7',
  'Bridge': '#FFC107',
  'Minting': '#42A5F5',
  'Not Listed': '#757575'
};

// Horizontal Bar Chart Component for Top Apps
function TopAppsChart({ data }) {
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
    if (!data || !data.length) return null;

    // Top 10 apps
    const topApps = data.slice(0, 10);
    const categories = topApps.map(d => d.displayName);
    const values = topApps.map(d => d.txCount);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const idx = params[0].dataIndex;
          const app = topApps[topApps.length - 1 - idx];
          const appDetails = findAppDetails(app);
          const category = getCategoryForEntry(app, appDetails);
          return `<strong>${app.displayName}</strong><br/>` +
                 `Transactions: ${formatNumber(app.txCount)}<br/>` +
                 `Category: ${category}`;
        }
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: isDark ? '#fff' : '#000',
          formatter: (value) => formatShortNumber(value)
        }
      },
      yAxis: {
        type: 'category',
        data: categories.reverse(),
        axisLabel: {
          color: isDark ? '#fff' : '#000',
          fontSize: 12
        }
      },
      series: [{
        type: 'bar',
        data: values.reverse().map((value, idx) => {
          const realIdx = topApps.length - 1 - idx;
          const entry = topApps[realIdx];
          const appDetails = findAppDetails(entry);
          const category = getCategoryForEntry(entry, appDetails);
          return {
            value,
            itemStyle: {
              color: categoryColors[category] || '#3D5AFE',
              borderRadius: [0, 4, 4, 0]
            }
          };
        }),
        label: {
          show: true,
          position: 'right',
          formatter: (params) => formatShortNumber(params.value),
          color: isDark ? '#fff' : '#000'
        }
      }]
    };
  }, [data, isDark]);

  useEffect(() => {
    if (!chartInstanceRef.current || !option) return;
    chartInstanceRef.current.setOption(option, { notMerge: true });
  }, [option]);

  return <div ref={chartRef} style={{ height: '400px', width: '100%' }} />;
}

// Pie Chart Component for Category Distribution
function CategoryPieChart({ data }) {
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
    if (!data || !data.length) return null;

    // Aggregate by category
    const categoryStats = {};
    data.forEach(entry => {
      const appDetails = findAppDetails(entry);
      const category = getCategoryForEntry(entry, appDetails);
      categoryStats[category] = (categoryStats[category] || 0) + entry.txCount;
    });

    // Convert to array and sort
    const pieData = Object.entries(categoryStats)
      .map(([name, value]) => ({
        name,
        value,
        itemStyle: { color: categoryColors[name] || '#757575' }
      }))
      .sort((a, b) => b.value - a.value);

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return `<strong>${params.name}</strong><br/>` +
                 `${formatNumber(params.value)} transactions<br/>` +
                 `${params.percent.toFixed(1)}% of tracked`;
        }
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: { color: isDark ? '#fff' : '#000' }
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: isDark ? '#1a1a1a' : '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: pieData
      }]
    };
  }, [data, isDark]);

  useEffect(() => {
    if (!chartInstanceRef.current || !option) return;
    chartInstanceRef.current.setOption(option, { notMerge: true });
  }, [option]);

  return <div ref={chartRef} style={{ height: '350px', width: '100%' }} />;
}

// App Row Component for the leaderboard list
function AppRow({ app, rank, appDetails }) {
  const iconSrc = getIconSrc(appDetails);
  const initial = app.displayName.charAt(0).toUpperCase();
  const category = getCategoryForEntry(app, appDetails);
  const isTop3 = rank <= 3;

  return (
    <div className={styles.appRow}>
      <div className={`${styles.rankBadge} ${isTop3 ? styles.top3 : ''}`}>
        {rank}
      </div>
      <div className={styles.appInfo}>
        {iconSrc ? (
          <img src={iconSrc} alt={app.displayName} className={styles.appIcon} />
        ) : (
          <div className={styles.appIconPlaceholder}>{initial}</div>
        )}
        <div className={styles.appDetails}>
          <h4 className={styles.appName}>{app.displayName}</h4>
          <span
            className={styles.categoryTag}
            style={{ backgroundColor: categoryColors[category] + '20', color: categoryColors[category] }}
          >
            {category}
          </span>
        </div>
      </div>
      <div className={styles.txCount}>
        <span className={styles.txValue}>{formatNumber(app.txCount)}</span>
        <span className={styles.txLabel}>transactions</span>
      </div>
      {appDetails?.website && (
        <a
          href={appDetails.website}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.visitLink}
        >
          Visit
        </a>
      )}
    </div>
  );
}

// Category Card Component
function CategoryCard({ category, txCount, totalTx, appCount }) {
  const percentage = ((txCount / totalTx) * 100).toFixed(1);
  const tagSlug = category.toLowerCase().replace(/\s+/g, '-');

  // Map display category names to app.js tag names
  const tagMap = {
    'dex': 'dex',
    'lending': 'lending',
    'marketplace': 'marketplace',
    'oracle': 'oracle',
    'stablecoin': 'stablecoin',
    'wallet': 'wallet',
    'gaming': 'game',
    'governance': 'governance',
    'bridge': 'bridge',
    'minting': 'minting',
    'not-listed': ''
  };

  const linkTag = tagSlug in tagMap ? tagMap[tagSlug] : tagSlug;

  return (
    <div
      className={styles.categoryCard}
      style={{ borderLeftColor: categoryColors[category] }}
    >
      <div className={styles.categoryHeader}>
        <h4 className={styles.categoryName}>{category}</h4>
        <span className={styles.categoryPercent}>{percentage}%</span>
      </div>
      <div className={styles.categoryStats}>
        <span className={styles.categoryTx}>{formatNumber(txCount)} tx</span>
      </div>
      {linkTag && (
        <Link to={`/apps?tags=${linkTag}`} className={styles.categoryLink}>
          View {category} apps
        </Link>
      )}
    </div>
  );
}

// Main Leaderboard Page
export default function LeaderboardPage() {
  const { siteConfig } = useDocusaurusContext();
  const API_URL = siteConfig.customFields.CARDANO_ORG_API_URL;

  const [period, setPeriod] = useState('30d');
  const [showCip20, setShowCip20] = useState(false);
  const activeStats = period === '30d' ? appStats : appStats73;
  const appStatsData = activeStats.appStats;
  const metadataLabelStats = activeStats.metadataLabelStats;
  const metadata = activeStats.metadata;

  const [coverageData, setCoverageData] = useState(null);
  const [coverageLoading, setCoverageLoading] = useState(true);

  // Merge app stats with verified metadata label stats
  const unifiedData = useMemo(() => {
    const verifiedMetadata = metadataLabelStats
      .filter(entry => entry.verified)
      .filter(entry => showCip20 || entry.label !== CIP20_LABEL)
      .map(normalizeMetadataEntry);
    const merged = mergeMetadataGroups(verifiedMetadata);
    return [...appStatsData, ...merged]
      .sort((a, b) => b.txCount - a.txCount);
  }, [appStatsData, metadataLabelStats, showCip20]);

  // Calculate totals and aggregations
  const totalTrackedTx = useMemo(() => {
    return unifiedData.reduce((sum, app) => sum + app.txCount, 0);
  }, [unifiedData]);

  // Get top 10 apps
  const topApps = useMemo(() => {
    return unifiedData.slice(0, 10);
  }, [unifiedData]);

  // Get rising apps (ranks 11-20)
  const risingApps = useMemo(() => {
    return unifiedData.slice(10, 20);
  }, [unifiedData]);

  // Calculate category stats
  const categoryStats = useMemo(() => {
    const stats = {};
    unifiedData.forEach(entry => {
      const appDetails = findAppDetails(entry);
      const category = getCategoryForEntry(entry, appDetails);
      if (!stats[category]) {
        stats[category] = { txCount: 0, appCount: 0 };
      }
      stats[category].txCount += entry.txCount;
      stats[category].appCount += 1;
    });
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.txCount - a.txCount);
  }, [unifiedData]);

  // Count apps with statsLabel in apps.js
  const trackedAppsInAppsJs = useMemo(() => {
    return Showcases.filter(app => app.statsLabel).length;
  }, []);

  const totalAppsInAppsJs = Showcases.length;

  // Format reporting window dates
  const reportingStart = metadata.reportingWindow?.start
    ? new Date(metadata.reportingWindow.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';
  const reportingEnd = metadata.reportingWindow?.end
    ? new Date(metadata.reportingWindow.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  // Fetch network coverage data
  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const startEpoch = dateToEpoch(metadata.reportingWindow.start);
        const endEpoch = dateToEpoch(metadata.reportingWindow.end);

        const api = makeApiClient(API_URL);
        const response = await api.get('/epoch_info');

        const totalNetworkTx = response.data
          .filter(e => e.epoch_no >= startEpoch && e.epoch_no <= endEpoch)
          .reduce((sum, e) => sum + Number(e.tx_count || 0), 0);

        setCoverageData({
          totalNetworkTx,
          coveragePercent: (totalTrackedTx / totalNetworkTx) * 100
        });
      } catch (err) {
        console.error('Failed to fetch network coverage:', err);
      } finally {
        setCoverageLoading(false);
      }
    };

    fetchCoverage();
  }, [API_URL, metadata.reportingWindow, totalTrackedTx]);

  return (
    <Layout
      title="App Leaderboard | cardano.org"
      description="See which apps are driving Cardano transactions. Explore the top apps by transaction volume and discover hot categories."
    >
      <OpenGraphInfo pageName="apps-leaderboard" />
      <SiteHero
        title="App Leaderboard"
        description={["See which apps are driving Cardano transactions"]}
        bannerType="fluidBlue"
      />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <div className={styles.periodToggle}>
              <button
                className={`${styles.periodButton} ${period === '30d' ? styles.periodButtonActive : ''}`}
                onClick={() => setPeriod('30d')}
              >
                30 Days
              </button>
              <button
                className={`${styles.periodButton} ${period === '365d' ? styles.periodButtonActive : ''}`}
                onClick={() => setPeriod('365d')}
              >
                1 Year
              </button>
            </div>

            <label className={styles.cip20Toggle}>
              <input
                type="checkbox"
                checked={showCip20}
                onChange={(e) => setShowCip20(e.target.checked)}
              />
              Include unattributed CIP-20 messages
            </label>

            {/* Stats Summary */}
            <div className={styles.statsSummary}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{formatNumber(totalTrackedTx)}</span>
                <span className={styles.statLabel}>Tracked Transactions</span>
                <span className={styles.statPeriod}>{period === '30d' ? 'Last 30 days' : 'Last 1 year'}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{unifiedData.length}</span>
                <span className={styles.statLabel}>Tracked Apps</span>
                <span className={styles.statPeriod}>On-chain identifiable</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{categoryStats.length}</span>
                <span className={styles.statLabel}>Categories</span>
                <span className={styles.statPeriod}>Active on-chain</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {coverageLoading ? '--' : coverageData ? `${coverageData.coveragePercent.toFixed(1)}%` : '--'}
                </span>
                <span className={styles.statLabel}>Network Coverage</span>
                <span className={styles.statPeriod}>
                  {coverageData
                    ? `${formatNumber(totalTrackedTx)} of ${formatNumber(coverageData.totalNetworkTx)} tx`
                    : coverageLoading ? 'Loading...' : 'Unable to load'
                  }
                </span>
              </div>
            </div>

            <p className={styles.updateNote}>
              Data period: {reportingStart} - {reportingEnd} (Epoch {metadata.chainEpoch})
            </p>

            <SpacerBox size="small" />

            {/* Top Apps Section */}
            <Divider text="Top Apps by Transaction Volume" id="top-apps" />
            <TitleWithText
              description={[
                `The top 10 apps by transaction count over the last ${period === '30d' ? '30 days' : 'year'}. Bars are colored by category.`
              ]}
              headingDot={false}
            />

            <TopAppsChart data={unifiedData} />

            <SpacerBox size="small" />

            {/* Top Apps List */}
            <div className={styles.appList}>
              {topApps.map((app, idx) => (
                <AppRow
                  key={app.label}
                  app={app}
                  rank={idx + 1}
                  appDetails={findAppDetails(app)}
                />
              ))}
            </div>

            <SpacerBox size="medium" />

            {/* Hot Categories Section */}
            <Divider text="Hot Categories" id="categories" />
            <TitleWithText
              description={[
                "Transaction distribution across app categories."
              ]}
              headingDot={false}
            />

            <CategoryPieChart data={unifiedData} />

            <SpacerBox size="small" />

            {/* Category Cards */}
            <div className={styles.categoryGrid}>
              {categoryStats.slice(0, 6).map(cat => (
                <CategoryCard
                  key={cat.name}
                  category={cat.name}
                  txCount={cat.txCount}
                  totalTx={totalTrackedTx}
                  appCount={cat.appCount}
                />
              ))}
            </div>

            <SpacerBox size="medium" />

            {/* Rising Apps Section */}
            <Divider text="Rising Apps" id="rising" />
            <TitleWithText
              description={[
                "Apps ranked 11-20 by transaction volume. These apps show activity and could be ones to watch."
              ]}
              headingDot={false}
            />

            <div className={styles.appList}>
              {risingApps.map((app, idx) => (
                <AppRow
                  key={app.label}
                  app={app}
                  rank={idx + 11}
                  appDetails={findAppDetails(app)}
                />
              ))}
            </div>

            <SpacerBox size="medium" />

            {/* Coverage Stats & CTA */}
            <Divider text="Transaction Tracking" id="tracking" />

            <div className={styles.coverageSection}>
              <div className={styles.coverageStats}>
                <h3>Coverage Status</h3>
                {coverageData && (
                  <p>
                    During this reporting period, the Cardano network processed{' '}
                    <strong>{formatNumber(coverageData.totalNetworkTx)}</strong> total transactions.
                    The {unifiedData.length} tracked entries account for{' '}
                    <strong>{formatNumber(totalTrackedTx)}</strong> transactions
                    ({coverageData.coveragePercent.toFixed(1)}% of network activity).
                  </p>
                )}
                <p>
                  Currently <strong>{trackedAppsInAppsJs} of {totalAppsInAppsJs}</strong> apps listed
                  on cardano.org have transaction tracking enabled via <code>statsLabel</code>.
                </p>
                <p>
                  This leaderboard only tracks transactions that are identifiable on-chain through
                  known smart contract addresses or metadata patterns. Many network transactions
                  (simple transfers, staking operations, untracked apps) are not attributed to
                  specific applications.
                </p>
              </div>
              <div className={styles.coverageCta}>
                <h3>Get Your App Tracked</h3>
                <p>
                  If your app's transactions aren't being tracked, you may need to make them
                  identifiable on-chain. Learn how to set up tracking for your application.
                </p>
                <p>
                  Once enabled, your app will appear on this leaderboard and gain visibility
                  across the Cardano ecosystem. Tracking is open to all projects building on Cardano.
                </p>
                <Link
                  to="/docs/get-involved/tx-rankings/"
                  className="button button--primary button--lg"
                >
                  Transaction Rankings Guide
                </Link>
                <p style={{ marginTop: '1rem' }}>
                  You can also explore network-wide <Link to="/insights/transactions/">transaction trends</Link>.
                </p>
              </div>
            </div>
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"gradientDark"}>
          <BoundaryBox>
            <CtaOneColumn
              title="Explore the full directory of Cardano applications, filter by category, and discover new projects."
              buttonLabel="Browse Apps Directory"
              buttonLink="/apps/"
            />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}
