import React, { useState, useEffect } from 'react'; 
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import OpenGraphImage from "@site/src/components/Layout/OpenGraphImage";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import axios from 'axios';

// convert Lovelaces to ada and round to the nearest full ada
const convertLovelacesToAda = (lovelaces) => {
  return Math.round(lovelaces / 1_000_000).toLocaleString();
};

const NetworkStats = () => {
  // API URL, see docusaurus.config.js for details
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.REACT_APP_API_URL;
  const API_KEY = customFields.REACT_APP_API_KEY;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Make sure the environment variables are loaded
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

  // Render the values in ada or an error message if available
  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : data !== null ? (
        <div>
          <TitleWithText title={`Supply (Epoch ${data.epoch_no})`} 
            description={[
              `**Circulation:** ${convertLovelacesToAda(data.circulation)} ada`,
              `**Treasury:** ${convertLovelacesToAda(data.treasury)} ada`,
              `**Rewards:** ${convertLovelacesToAda(data.reward)} ada`,
              `**Total Supply:** ${convertLovelacesToAda(data.supply)} ada`,
              `**Reserves:** ${convertLovelacesToAda(data.reserves)} ada`,
              `**Fees Pot:** ${convertLovelacesToAda(data.fees)} ada`,
              `**Deposits Stake:** ${convertLovelacesToAda(data.deposits_stake)} ada`,
              `**Deposits DRep:** ${convertLovelacesToAda(data.deposits_drep)} ada`,
              `**Deposits Proposal:** ${convertLovelacesToAda(data.deposits_proposal)} ada`
            ]}
            headingDot={true} 
          /> 

        </div>
      ) : (
        <p>Loading...</p>
      )}
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

