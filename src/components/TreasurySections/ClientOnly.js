import React, { Suspense } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

// Client-only island for the lazy treasury sections. One fallback serves SSR
// and the lazy chunk, and its height keeps the layout steady while live data
// loads.
export default function ClientOnly({ minHeight, children }) {
  const fallback = <div style={{ minHeight }} />;
  return <BrowserOnly fallback={fallback}>{() => <Suspense fallback={fallback}>{children}</Suspense>}</BrowserOnly>;
}
