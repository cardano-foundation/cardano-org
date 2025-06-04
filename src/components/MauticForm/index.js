import clsx from "clsx";
import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemedImage from "@theme/ThemedImage"; 

//
// This component:
// generates a mautic form based on the id

import { useEffect } from "react";

function MauticForm({ id }) {
  useEffect(() => {
    const existing = document.querySelector(`script[src*="form/generate.js?id=${id}"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.src = `https://hey.cardano.org/form/generate.js?id=${id}`;
      script.type = "text/javascript";
      script.async = true;
      document.getElementById(`mautic-form-container-${id}`)?.appendChild(script);
    }
  }, [id]);

  return <div id={`mautic-form-container-${id}`} style={{ marginTop: "2rem" }} />;
}

export default MauticForm;