import React from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from "@theme/Layout";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import Divider from "@site/src/components/Layout/Divider";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import MauticForm  from "@site/src/components/MauticForm";

// map interestIds to Mautic forms
import contentMap from '../data/signal-contentmap.js';

  export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();

  // use id parameter for the different forms, make sure to have a valid one
  const interestId = new URLSearchParams(location.search).get('id');
  const isValidInterest = Object.keys(contentMap).includes(interestId);
  const content = isValidInterest ? contentMap[interestId] : contentMap["governance"];
  const siteTitle = `${content.title} | ${siteConfig.title}`;

  return (
    <Layout
      title={siteTitle}
      description={content.description}
    >
      <OpenGraphInfo pageName={content.openGraph} title={content.title} description={content.description} />
      <SiteHero
        title={content.title}
        description={content.description}
        bannerType={content.bannerType}
      />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <Divider text={isValidInterest ? interestId : 'governance'} />
          <MauticForm id={content.formId} />
        </BoundaryBox>
      </BackgroundWrapper>

       
    </Layout>
  );
}
