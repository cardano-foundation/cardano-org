import React from 'react';
import {translate} from '@docusaurus/Translate';

function formatInsightsLastUpdated(value) {
  if (!value || value === 'Dynamic') return value;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;

  const date = new Date(parsed);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export default function InsightsFooter({ lastUpdated }) {
  const formattedLastUpdated = formatInsightsLastUpdated(lastUpdated);

  return (
    <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--ifm-toc-border-color)', paddingTop: '1rem', fontSize: '0.85rem', color: 'var(--ifm-color-content-secondary)' }}>
      <p>
        {translate(
          { id: 'insights.footer.text', message: 'Last updated: {lastUpdated}. Charts data is updated once an epoch.' },
          { lastUpdated: formattedLastUpdated },
        )}
      </p>
    </footer>
  );
}