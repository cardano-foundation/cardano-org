import React from 'react';
import {translate} from '@docusaurus/Translate';

export default function InsightsFooter({ lastUpdated }) {
  return (
    <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--ifm-toc-border-color)', paddingTop: '1rem', fontSize: '0.85rem', color: 'var(--ifm-color-content-secondary)' }}>
      <p>{translate({id: 'insights.footer.text', message: 'Last updated: {lastUpdated}. Charts are using real time data.'}).replace('{lastUpdated}', lastUpdated)}</p>
    </footer>
  );
}