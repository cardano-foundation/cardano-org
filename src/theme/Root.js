import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import useBaseUrl from '@docusaurus/useBaseUrl';

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
  // Locale-aware base for the glossary tree: '/glossary/' in EN, '/de/glossary/'
  // in DE, etc. Using useBaseUrl keeps shared links between locales intact.
  const glossaryBase = useBaseUrl('/glossary/');

  useEffect(() => {
    if (!glossaryData || !glossaryData.redirectMap) return;
    if (!location.hash) return;
    const path = location.pathname.replace(/\/+$/, '');
    const isLegacy = /(^|\/)(docs\/)?glossary$/.test(path);
    if (!isLegacy) return;
    let anchor;
    try {
      anchor = decodeURIComponent(location.hash.replace(/^#/, ''));
    } catch {
      // Malformed percent-encoding in the URL fragment; bail rather than
      // crashing the React tree on every page (this effect is mounted globally).
      return;
    }
    // macOS often produces NFD-encoded URLs (composed chars split into base +
    // combining marks). The redirect map keys are NFC; normalize before lookup.
    anchor = anchor.normalize('NFC');
    const slug = glossaryData.redirectMap[anchor];
    if (slug) {
      history.replace(`${glossaryBase}${slug}`);
    }
  }, [history, location, glossaryData, glossaryBase]);

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
