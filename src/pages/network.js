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
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Blockfrost id, see docusaurus.config.js for details
  const { siteConfig: {customFields}} = useDocusaurusContext();
  const PROJECT_ID = customFields.REACT_APP_BLOCKFROST_APP_PROJECT_ID;

  useEffect(() => {
    // Make sure the environment variable is loaded
    if (!PROJECT_ID) {
      setError('Blockfrost API key is missing!');
      return;
    }

    // API request to Blockfrost
    axios.get('https://cardano-mainnet.blockfrost.io/api/v0/network', {
      headers: {
        'project_id': PROJECT_ID
      }
    })
    .then((response) => {
      setData(response.data);  // Set the data in state
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setError(error.message);  // Set the error message in case of failure
    });
  }, []);

  // Render the values in ada or an error message if available
  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : data !== null ? (
        <div>
          <TitleWithText title="Supply" 
            description={[
              `**Max:** ${convertLovelacesToAda(data.supply.max)} ada`,
              `**Total:** ${convertLovelacesToAda(data.supply.total)} ada`,
              `**Circulating:** ${convertLovelacesToAda(data.supply.circulating)} ada`,      `**Locked:** ${convertLovelacesToAda(data.supply.locked)} ada`,
              `**Treasury:** ${convertLovelacesToAda(data.supply.treasury)} ada`,
              `**Reserves:** ${convertLovelacesToAda(data.supply.reserves)} ada`
            ]}
            headingDot={true} 
          /> 

          <TitleWithText title="Stake" 
            description={[
              `**Live:** ${convertLovelacesToAda(data.stake.live)} ada`,
              `**Active:** ${convertLovelacesToAda(data.stake.active)} ada`
            ]}
            headingDot={false} 
          /> 
          
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};


function HomepageHeader() {
  const { siteTitle } = "useDocusaurusContext()"; // Ensure this works as needed for Docusaurus
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