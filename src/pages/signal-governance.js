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
const interestId = "governance";

  export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();

  const isValidInterest = Object.keys(contentMap).includes(interestId);
  const content = isValidInterest ? contentMap[interestId] : contentMap["governance"];
  const siteTitle = `${translate({id: 'signalGovernance.layout.title', message: 'Signal your interest in Governance'})} | ${siteConfig.title}`;

  return (
    <Layout
      title={siteTitle}
      description={translate({id: 'signalGovernance.layout.description', message: "We'll keep you updated on DReps, proposals and how to get involved."})}
    >
      <OpenGraphInfo pageName={content.openGraph} title={translate({id: 'signalGovernance.openGraph.title', message: 'Signal your interest in Governance'})} description={translate({id: 'signalGovernance.openGraph.description', message: "We'll keep you updated on DReps, proposals and how to get involved."})} />
      <SiteHero
        title={translate({id: 'signalGovernance.hero.title', message: 'Signal your interest in Governance'})}
        description={translate({id: 'signalGovernance.hero.description', message: "We'll keep you updated on DReps, proposals and how to get involved."})}
        bannerType={content.bannerType}
      />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <Divider text={translate({id: 'signalGovernance.divider.text', message: 'governance'})} />
          <MauticForm id={content.formId} />
        </BoundaryBox>
      </BackgroundWrapper>


    </Layout>
  );
}
