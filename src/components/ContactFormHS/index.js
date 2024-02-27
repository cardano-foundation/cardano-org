import React, { useEffect } from "react";
import "./hs.css"; // Importing the HubSpot CSS globally

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
          region: 'na1',
          portalId: '7759219',
          formId: '87e356e8-908d-4d11-93ba-ecdcd8227c4f',
          target: '#hubspotForm'
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

