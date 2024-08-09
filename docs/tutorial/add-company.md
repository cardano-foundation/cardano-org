---
sidebar_position: 10
---

# Add your Company

Thank you for considering adding your company to [Companies Building on Cardano](https://cardano.org/partners#companies). 

## Requirements

Before making a pull request, please make sure that you fulfil all these requirements. 

### Company Requirements
- Add a registered company only and not a project. Projects can be added to the [Cardano Showcase](https://developers.cardano.org/showcase).
- That your company has a real product, service or tool that is listed on either [Cardano Showcase](https://developers.cardano.org/showcase) or [Builder Tools](https://developers.cardano.org/tools).
- Your product, service or tools needs to work today on Cardano mainnet, no coming soon, no preview, no promises, no token sales.
- The majority of your company's business model must relate to Cardano.

### Website Requirement
- Link to the company website and not to the product website. Examples: don't link to Flint wallet but to dcSpark. Don't link to CardanoScan but to Strica.
- Your company website has to have a stable domain name. (a random Netlify/Vercel domain is not allowed, no URL shortener, no app store links, or similar)
- Don't link to token pages. Example: don't link to World Mobile Token but to World Mobile. 
- If you have registered your product as a company or you have the same website for both, please link to a team or about Us page. Examples: entries of DripDropz LLC and jpg.store.

### Logo Requirements
- Have your company logo as SVG (Scalable Vector Graphics) file. In order to maintain a certain quality standard, no jpg, png or other formats are accepted.
- You need one that looks good on white background and one that looks good an dark background. (Light mode / dark mode)

### Pull Request requirements
- The GitHub account that adds the company must not be new.
- The GitHub account that adds the company must have a history/or already be known in the Cardano community.


## Changes for the actual pull request

To create a pull request that adds your company named `Amazing Company`:

- Fullfill all the above requirements.
- Copy your two logos (light and dark mode) to the folder `static/img/logos`. Name them `amazingcompany.svg` and `amazingcompany-dark.svg`.
- Make changes to the JSON file as shown below. The field `companyName` is optional. Use it only if your company logo does not include the company name already.

```jsx title="src/data/logosCompanies.json"
  {
    "imageName": "amazingcompany",
    "label": "Amazing Company is building on Cardano",
    "link": "https://link-to-amazing-company",
    "companyName": "Amazing Company"
  }
```