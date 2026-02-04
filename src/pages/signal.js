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
import {translate} from '@docusaurus/Translate';

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
      title={translate({id: 'signal.layout.title', message: 'Signal your interest'})}
      description={translate({id: 'signal.layout.description', message: 'Get just the information you want'})}
    >
      <OpenGraphInfo pageName="Signal your interest" title={translate({id: 'signal.openGraph.title', message: 'Signal your interest'})} description={translate({id: 'signal.openGraph.description', message: 'Get just the information you want'})} />
      <SiteHero
        title={translate({id: 'signal.hero.title', message: 'Signal your interest'})}
        description={translate({id: 'signal.hero.description', message: 'Look at the available topics and get just the information you want'})}
        bannerType="starburst"
      />

      <BackgroundWrapper backgroundType={"zoom"}>
        <BoundaryBox>
          <TitleWithText
            title={translate({id: 'signal.topics.title', message: 'Available Topics'})}
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
