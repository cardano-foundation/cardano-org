import React, { useEffect } from "react";
import HubSpotConfig from "@site/hubspot.config";
import "./hs.css";

const SCRIPT_SRC = "https://js.hsforms.net/forms/shell.js";

// HubSpot's script, loaded once per page view and shared by every form.
let hubspotReady = null;
function loadHubSpot() {
  if (!hubspotReady) {
    hubspotReady = new Promise((resolve, reject) => {
      if (window.hbspt) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.addEventListener("load", resolve);
      script.addEventListener("error", () => {
        // Let a later mount try again.
        hubspotReady = null;
        reject();
      });
      document.body.appendChild(script);
    });
  }
  return hubspotReady;
}

/**
 * Embedded HubSpot form. HubSpot's script renders the form into an empty div
 * after the page has loaded. The form ids live in `hubspot.config.js`.
 *
 * @param {object} props
 * @param {string} props.form Key of the form in `hubspot.config.js`, for example "contactForm".
 * @param {string} [props.className] Extra class on the outer div.
 */
export default function HubSpotForm({ form, className }) {
  const { formId, portalId, region, id } = HubSpotConfig[form];

  useEffect(() => {
    let active = true;
    loadHubSpot()
      .then(() => {
        if (active) window.hbspt.forms.create({ region, portalId, formId, target: `#${id}` });
      })
      .catch(() => {
        // HubSpot is blocked or offline, the div stays empty.
      });
    return () => {
      active = false;
    };
  }, [formId, portalId, region, id]);

  return (
    <div className={className}>
      <div id={id} />
    </div>
  );
}
