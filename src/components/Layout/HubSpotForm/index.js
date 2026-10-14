import React, { useEffect } from "react";
import "./hs.css";

const SCRIPT_SRC = "https://js.hsforms.net/forms/shell.js";

/**
 * Embedded HubSpot form. HubSpot's script renders the form into an empty div
 * after the page has loaded. The form ids live in `hubspot.config.js`.
 *
 * @param {object} props
 * @param {string} props.formId HubSpot form id.
 * @param {string} props.portalId HubSpot portal id.
 * @param {string} props.region HubSpot region, for example "na1".
 * @param {string} props.id Id of the div the form renders into. Unique on the page and a valid CSS identifier.
 * @param {string} [props.className] Extra class on the outer div.
 */
export default function HubSpotForm({ formId, portalId, region, id, className }) {
  useEffect(() => {
    let active = true;
    const create = () => {
      if (active && window.hbspt) {
        window.hbspt.forms.create({ region, portalId, formId, target: `#${id}` });
      }
    };

    // The script is already there after a visit to another form page.
    if (window.hbspt) {
      create();
      return () => {
        active = false;
      };
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.addEventListener("load", create);
    document.body.appendChild(script);
    return () => {
      active = false;
      script.removeEventListener("load", create);
      script.remove();
    };
  }, [formId, portalId, region, id]);

  return (
    <div className={className}>
      <div id={id} />
    </div>
  );
}
