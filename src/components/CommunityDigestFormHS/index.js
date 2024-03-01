import React, { useEffect } from "react";
import "./hs.css"; // Importing the HubSpot CSS globally
import HubSpotConfig from "@site/hubspot.config";
 
const CommunityDigestForm = () => {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/shell.js'
    document.body.appendChild(script)

    // Load event listener for the script
    script.addEventListener('load', () => {
       // Check if the HubSpot forms namespace exists
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: HubSpotConfig.digestForm.region, 
          portalId: HubSpotConfig.digestForm.portalId, 
          formId: HubSpotConfig.digestForm.formId, 
          target: HubSpotConfig.digestForm.target, 
        })
      }
    })

    // Cleanup function to remove the script element
    return () => {
      // To keep things clean this will remove the script from the body when the component unmounts
      document.body.removeChild(script);
    };
  }, []); // The empty array ensures this effect runs once on mount and cleanup runs on unmount

  return (
    <div>
      <div id='digestForm'> {/* This is where the HubSpot form will be injected */} </div>
    </div>
  )
}

export default CommunityDigestForm

