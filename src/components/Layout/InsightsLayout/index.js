import React from 'react';
import Layout from '@theme/Layout';
import BackgroundWrapper from '@site/src/components/Layout/BackgroundWrapper';
import BoundaryBox from '@site/src/components/Layout/BoundaryBox';
import SiteHero from '@site/src/components/Layout/SiteHero';
import SpacerBox from '@site/src/components/Layout/SpacerBox';

/**
 * Page shell for insights pages with a hero, a background, and a content box.
 *
 * @param {object} props
 * @param {object} props.meta Page data: `pageTitle`, `pageDescription`, `title`, and an optional `bannerType` (falls back to "braidBlue").
 * @param {React.ReactNode} [props.children] Page content inside the content box.
 */
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