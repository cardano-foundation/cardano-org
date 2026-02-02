import React from 'react';
import Layout from '@theme/Layout';
import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import SiteHero from '@site/src/components/Layout/SiteHero';
import SpacerBox from '@site/src/components/Layout/SpacerBox';

export default function InsightsLayout({ meta, children }) {
  return (
    <Layout title={meta.pageTitle} description={meta.pageDescription}>
      <SiteHero
        title={meta.title}
        description={meta.pageDescription}
        bannerType={meta.bannerType || 'braidBlue'}
      />
      <main>
        <BackgroundWrapper backgroundType="zoom">
          <BoundaryBox>
            {children}
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>
      </main>
    </Layout>
  );
}