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

// use id parameter for the different forms, make sure to have a valid one
// note: this can't be set by an URL parameter because at the time Docusaurus renders
//       the open graph preview, URL parameter is null.
const interestId = "operator";

  export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();

  const isValidInterest = Object.keys(contentMap).includes(interestId);
  const content = isValidInterest ? contentMap[interestId] : contentMap["operator"];
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
          <Divider text={isValidInterest ? interestId : 'operator'} />
          <MauticForm id={content.formId} />
        </BoundaryBox>
      </BackgroundWrapper>

       
    </Layout>
  );
}
