import React, { Suspense } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

// Client-only island for the lazy treasury sections. One fallback serves SSR
// and the lazy chunk, and its height keeps the layout steady while live data
// loads.
/**
 * Renders its children in the browser only, behind a placeholder of fixed height.
 *
 * @param {object} props
 * @param {string|number} [props.minHeight] Minimum height of the placeholder.
 * @param {React.ReactNode} props.children Content rendered on the client.
 */
export default function ClientOnly({ minHeight, children }) {
  const fallback = <div style={{ minHeight }} />;
  return <BrowserOnly fallback={fallback}>{() => <Suspense fallback={fallback}>{children}</Suspense>}</BrowserOnly>;
}
