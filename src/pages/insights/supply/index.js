import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import InsightsFooter from '@site/src/components/Layout/InsightsFooter';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import Head from '@docusaurus/Head';
import axios from 'axios';
import authors from '@site/src/data/authors.json';
import { useLocation } from '@docusaurus/router';

// ────────────────────────────────────────────────────────────────────────────
//  Meta Setup
// ────────────────────────────────────────────────────────────────────────────
const meta = {
  pageTitle: 'Cardano Treasury Withdrawls Overview | cardano.org',
  pageDescription:
    'A list of all historic treasury withdrawals.',
  title: 'Cardano Treasury Withdrawls Overview',
  date: '', // set dynamically
  author: authors?.['cf'],
  og: {
    pageName: 'treasury-withdrawals',
    title: 'Cardano Treasury Withdrawls | cardano.org',
    description: 'Explore when Cardano Treasury withdrawals happened.'
  }
};

// ────────────────────────────────────────────────────────────────────────────
//  Helper Functions & Constants
// ────────────────────────────────────────────────────────────────────────────
const MIN_EPOCH = 209;
const PAGE_SIZE = 1000;  // number of records per page
const MAX_PAGES = 5;     // maximum pages to fetch initially

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

  const [withdrawalsCurrRes, setWithdrawalsCurr] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!API_URL || !API_KEY) {
      setError('API URL or API Key is missing!');
      return;
    }
    async function fetchData() {
      try {
        let withdrawalsCurr = [];

        // Fetch up to MAX_PAGES pages, breaking early if empty
        for (let i = 0; i < MAX_PAGES; i++) {
          const offset = i * PAGE_SIZE;
          const resp = await axios.get(
            `${API_URL}/treasury_withdrawals${urlEpoch ?
              `?select=epoch_no,amount,tx_hash&order=epoch_no.asc&epoch_no=eq.${urlEpoch}&` :
              '?'}offset=${offset}`,
            { headers: { Authorization: `Bearer ${API_KEY}` } }
          );
          const page = resp.data;
          if (!page.length) break;
          withdrawalsCurr = withdrawalsCurr.concat(page);
        }

        setWithdrawalsCurr(withdrawalsCurr);
      } catch (err) {
        setError(err.message);
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
      </>
    );
  }
  if (!withdrawalsCurrRes.length) return <p>Loading...</p>;

  return (
    <>  
      <Head>
        <title>{`Cardano historic Treasury Withdrawals`}</title>
        <meta property="og:title" content={`Cardano historic Treasury Withdrawals`} />
        <meta
          property="og:description"
          content={`A list of all historic treasury withdrawals from Cardano Mainnet`} />
      </Head>

      <TitleWithText
        description={[
            `This Cardano insight page lists all historic treasury withdrawals from Cardano Mainnet so far`
        ]}
        headingDot
      />

      {(() => {
        const grouped = withdrawalsCurrRes.reduce((acc, w) => {
          const epoch = w.epoch_no;
          if (!acc[epoch]) acc[epoch] = [];
          acc[epoch].push(w);
          return acc;
        }, {});
        const epochs = Object.keys(grouped).sort((a, b) => a - b);
        const lastEpoch = epochs.length > 0 ? parseInt(epochs[epochs.length - 1], 10) : null;
        const epochDate = lastEpoch ? getEpochDate(lastEpoch) : '';
        return (
          <>
            {epochs.map(epoch => {
              const items = grouped[epoch];
              const count = items.length;
              const sum = items.reduce((total, w) => total + w.amount, 0);
              return (
                <details key={epoch} style={{ marginBottom: '1rem' }}>
                  <summary style={{ cursor: 'pointer' }}>
                    <Link to={`/insights/supply?epoch=${epoch}`}>
                      Epoch {epoch}
                    </Link>: {count} withdrawal{count !== 1 ? 's' : ''}, {convertLovelacesToAda(sum).toLocaleString()} ADA
                  </summary>
                  {count > 1 && (
                    <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                      {items.map(w => (
                        <li key={w.tx_hash}>
                          TX: <Link to={`https://explorer.cardano.org/en/transaction?id=${w.tx_hash}`} target="_blank" rel="noopener noreferrer">
                            {w.tx_hash}
                          </Link> – {convertLovelacesToAda(w.amount).toLocaleString()} ADA
                        </li>
                      ))}
                    </ul>
                  )}
                </details>
              );
            })}
            <InsightsFooter lastUpdated={`${epochDate} (epoch ${lastEpoch})`} epoch={lastEpoch} />
          </>
        );
      })()}

    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  Page Wrapper
// ────────────────────────────────────────────────────────────────────────────
export default function WithdrawalPage() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo {...meta.og} />
      <PageContent />
    </InsightsLayout>
  );
}
