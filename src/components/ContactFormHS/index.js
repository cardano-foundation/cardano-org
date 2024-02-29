import React, { useEffect } from "react";
import "./hs.css"; // Importing the HubSpot CSS globally
import HubSpotConfig from "@site/hubspot.config";

const ContactFormHS = () => {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/shell.js';
    document.body.appendChild(script); // Append the script to the body

    // Load event listener for the script
    script.addEventListener('load', () => {
      // Check if the HubSpot forms namespace exists
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: HubSpotConfig.contactForm.region, 
          portalId: HubSpotConfig.contactForm.portalId, 
          formId: HubSpotConfig.contactForm.formId, 
          target: HubSpotConfig.contactForm.target, 
        });
      }
    });

    // Cleanup function to remove the script element
    return () => {
      // To keep things clean this will remove the script from the body when the component unmounts
      document.body.removeChild(script);
    };
  }, []); // The empty array ensures this effect runs once on mount and cleanup runs on unmount

  // Render the div that will hold the HubSpot form
  return (
    <div>
      <div id='hubspotForm'> {/* This is where the HubSpot form will be injected */} </div>
    </div>
  );
}

export default ContactFormHS;

