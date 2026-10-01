import React, { Suspense, lazy, useEffect, useState } from "react";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

const TreasuryDonate = lazy(() => import(/* webpackChunkName: "treasury-donate" */ "@site/src/components/TreasuryDonate"));

const loadingTool = (
  <div style={{ textAlign: "center", padding: "3rem 0" }}>
    {translate({ id: "governance.treasury.loading", message: "Loading donation tool…" })}
  </div>
);

// The wallet form stays closed until someone asks for it. A link to #donate
// (glossary, /apps, the button on this page) opens it.
export default function DonateSection() {
  const [open, setOpen] = useState(() => window.location.hash === "#donate");

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#donate") setOpen(true);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (!open) {
    return (
      <div className={styles.donateClosed}>
        <p>
          {translate({
            id: "governance.treasury.donate.closedIntro",
            message: "Connect a wallet to send ada to the treasury with a treasury donation, for example to return unused funding.",
          })}
        </p>
        <button type="button" className="button button--primary" onClick={() => setOpen(true)}>
          {translate({ id: "governance.treasury.donate.open", message: "Open the donation tool" })}
        </button>
      </div>
    );
  }

  return (
    <Suspense fallback={loadingTool}>
      <TreasuryDonate />
    </Suspense>
  );
}
