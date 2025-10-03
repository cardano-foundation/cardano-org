import React from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import TitleWithText from "@site/src/components/Layout/TitleWithText";

// map interestIds to Mautic forms
import contentMap from '../data/signal-contentmap.js';

  export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();

  // use id parameter for the different forms, make sure to have a valid one
  //const interestId = new URLSearchParams(location.search).get('id');
  //const isValidInterest = Object.keys(contentMap).includes(interestId);
  //const content = isValidInterest ? contentMap[interestId] : contentMap["governance"];
  //const siteTitle = `${content.title} | ${siteConfig.title}`;

  return (
    <Layout
      title="Signal your interest"
      description="Get just the information you want"
    >
      <OpenGraphInfo pageName="Signal your interest" title="Signal your interest" description="Get just the information you want" />
      <SiteHero
        title="Signal your interest"
        description="Look at the available topics and get just the information you want"
        bannerType="starburst"
      />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <TitleWithText
            title="Available Topics"
            description={Object.values(contentMap).map(item => ({
              list: [`**[${item.title}](${item.openGraph})** – ${item.description}`],
            }))}
            titleType="black"
            headingDot={true}
          />
        </BoundaryBox>
      </BackgroundWrapper>

       
    </Layout>
  );
}
