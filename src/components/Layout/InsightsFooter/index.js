import React from 'react';
import {translate} from '@docusaurus/Translate';

/**
 * Footer note for insights pages with the last update date and a live data hint.
 *
 * @param {object} props
 * @param {string} [props.lastUpdated] Date of the last data update. Without it only the live data hint shows.
 * @param {boolean} [props.liveData=true] Adds the hint that charts use real time data.
 */
export default function InsightsFooter({ lastUpdated, liveData = true }) {
  let text;
  if (!lastUpdated) {
    // Pages that only show live data have no fixed date to report
    text = translate({id: 'insights.footer.textLive', message: 'Charts are using real time data.'});
  } else if (liveData) {
    text = translate({id: 'insights.footer.text', message: 'Last updated: {lastUpdated}. Charts are using real time data.'}, {lastUpdated});
  } else {
    text = translate({id: 'insights.footer.textStatic', message: 'Last updated: {lastUpdated}.'}, {lastUpdated});
  }
  return (
    <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--ifm-toc-border-color)', paddingTop: '1rem', fontSize: '0.85rem', color: 'var(--ifm-color-content-secondary)' }}>
      <p>{text}</p>
    </footer>
  );
}
