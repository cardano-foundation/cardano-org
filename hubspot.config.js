// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

// Configuration for HubSpot Form
const HubSpotConfig = {

  //  the form on http://localhost:3000/contact
  contactForm: {
    portalId: '7759219',
    formId: '87e356e8-908d-4d11-93ba-ecdcd8227c4f',
    region: 'na1',
    target: '#hubspotForm'
  },

  //  the form on http://localhost:3000/newsletter
  digestForm: {
    portalId: '7759219',
    formId: '1442ccc2-e49a-47d0-98a4-65292f88bf68',
    region: 'na1',
    target: '#digestForm'
  }
};

export default HubSpotConfig;
