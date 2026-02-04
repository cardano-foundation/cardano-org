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
import {translate} from '@docusaurus/Translate';

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
  const siteTitle = `${translate({id: 'signalOperator.layout.title', message: 'Signal your interest in Stake Pool Operations'})} | ${siteConfig.title}`;

  return (
    <Layout
      title={siteTitle}
      description={translate({id: 'signalOperator.layout.description', message: 'Stay informed about everything related to running a Stake Pool and technical updates.'})}
    >
      <OpenGraphInfo pageName={content.openGraph} title={translate({id: 'signalOperator.openGraph.title', message: 'Signal your interest in Stake Pool Operations'})} description={translate({id: 'signalOperator.openGraph.description', message: 'Stay informed about everything related to running a Stake Pool and technical updates.'})} />
      <SiteHero
        title={translate({id: 'signalOperator.hero.title', message: 'Signal your interest in Stake Pool Operations'})}
        description={translate({id: 'signalOperator.hero.description', message: 'Stay informed about everything related to running a Stake Pool and technical updates.'})}
        bannerType={content.bannerType}
      />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <Divider text={translate({id: 'signalOperator.divider.text', message: 'operator'})} />
          <MauticForm id={content.formId} />
        </BoundaryBox>
      </BackgroundWrapper>


    </Layout>
  );
}
