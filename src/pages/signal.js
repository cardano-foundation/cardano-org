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

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();

  // map interestIds to Mautic forms
  const contentMap = {
    governance: {
      title: 'Signal your interest in Governance',
      formId: 5,
      description: 'We’ll keep you updated on DReps, proposals and how to get involved.',
      bannerType: 'fluidBlue',
    },
  };

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
      <OpenGraphInfo pageName="singal" />
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
