import React from 'react';
import {translate} from '@docusaurus/Translate';
import InsightsLayout from '@site/src/components/Layout/InsightsLayout';
import OpenGraphInfo from '@site/src/components/Layout/OpenGraphInfo';
import TitleWithText from '@site/src/components/Layout/TitleWithText';
import EcosystemMap from '@site/src/components/EcosystemMap';

export const meta = {
  pageName: 'ecosystem-map',
  pageTitle: translate({id: 'insightsEcosystemMap.meta.pageTitle', message: 'Cardano Ecosystem Map'}),
  pageDescription: translate({id: 'insightsEcosystemMap.meta.pageDescription', message: 'An auto-generated, shareable map of the Cardano ecosystem — all apps grouped by category.'}),
  title: translate({id: 'insightsEcosystemMap.meta.title', message: 'Cardano Ecosystem Map'}),
  og: {
    title: translate({id: 'insightsEcosystemMap.og.title', message: 'Cardano Ecosystem Map'}),
    description: translate({id: 'insightsEcosystemMap.og.description', message: 'Explore the full Cardano ecosystem — DeFi, Consumer, Infrastructure, Tools, and Governance apps in one shareable map.'}),
  },
  tags: ['ecosystem'],
  indexed: true,
};

export default function EcosystemMapPage() {
  return (
    <InsightsLayout meta={meta}>
      <OpenGraphInfo {...meta.og} />
      <TitleWithText
        description={[
          '**A visual overview of the Cardano ecosystem.** All apps from cardano.org/apps, grouped by category and sorted by on-chain activity. Download the map as a PNG to share.',
        ]}
        headingDot
      />
      <EcosystemMap />
    </InsightsLayout>
  );
}
