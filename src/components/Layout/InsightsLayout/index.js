import React from 'react';
import Layout from '@theme/Layout';
import InsightsHeader from '@site/src/components/Layout/InsightsHeader';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import SiteHero from '@site/src/components/Layout/SiteHero';
import SpacerBox from '@site/src/components/Layout/SpacerBox';

export default function InsightsLayout({ meta, children }) {
  return (
    <Layout title={meta.pageTitle} description={meta.pageDescription}>
      <OpenGraphInfo pageName="network" />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            {/* Insight header */}
            <InsightsHeader 
              title={meta.title} 
              date={meta.date} 
              author={meta.author} 
            />
            {/* Page content */}
            {children}
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}