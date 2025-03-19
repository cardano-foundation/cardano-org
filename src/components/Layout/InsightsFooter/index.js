import React from 'react';

export default function InsightsFooter({ lastUpdated }) {
  return (
    <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--ifm-toc-border-color)', paddingTop: '1rem', fontSize: '0.85rem', color: 'var(--ifm-color-content-secondary)' }}>
      <p>Last updated: {lastUpdated}. Charts are using real time data.</p>
    </footer>
  );
}