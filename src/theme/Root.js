import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';

// Redirects deep-links from the old single-page glossary
// (/docs/glossary#<anchor>) to the new per-term URLs (/glossary/<slug>).
//
// The static @docusaurus/plugin-client-redirects rewrites /docs/glossary →
// /glossary but cannot route on the URL fragment (it carries the hash to
// the new path verbatim via window.location.href, landing the user at
// /glossary/#anchor). This effect catches both the original /docs/glossary
// hit and the post-redirect /glossary landing, and rewrites the URL to
// /glossary/<slug> using the slug map exposed by the glossary-routes plugin.
function GlossaryHashRedirect() {
  const history = useHistory();
  const location = useLocation();
  const glossaryData = usePluginData('glossary-routes');

  useEffect(() => {
    if (!glossaryData || !glossaryData.redirectMap) return;
    if (!location.hash) return;
    const path = location.pathname.replace(/\/+$/, '');
    const isLegacy = /(^|\/)(docs\/)?glossary$/.test(path);
    if (!isLegacy) return;
    const anchor = decodeURIComponent(location.hash.replace(/^#/, ''));
    const slug = glossaryData.redirectMap[anchor];
    if (slug) {
      history.replace(`/glossary/${slug}`);
    }
  }, [history, location, glossaryData]);

  return null;
}

export default function Root({ children }) {
  return (
    <>
      <GlossaryHashRedirect />
      {children}
    </>
  );
}
