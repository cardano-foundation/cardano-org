---
sidebar_position: 3
title: Add your Company
description: Add your company to the Cardano ecosystem listing on cardano.org. Required fields, logo guidelines, and submission process.
---

## Add your Company

Thank you for considering adding your company, association or collaboration to [Entities Building on Cardano](https://cardano.org/entities).

## Requirements

Before making a pull request, please make sure that you fulfill all these requirements. 

### Requirements of your company, association or collaboration 
- You can only add a registered company, an association, or a collaboration. By "collaboration" we mean open source collaborations such as the **Koios Team** or the **Guild Operators**. 
- You cannot add a product, service or tool. These can be added to the [Cardano Applications](/apps). 
- Your company/association/collaboration qualifies through **one** of the two paths below.

#### Path 1: Listed product, service or tool
- Ensure that your company/association/collaboration has a product, service or tool that is listed on either [Cardano Applications](/apps) or [Builder Tools](https://developers.cardano.org/tools).
- Your product, service, or tool needs to work today on Cardano mainnet, no coming soon, no preview, no promises, no token sales.

#### Path 2: Core development
This path is for companies that work on Cardano itself (node, consensus, network, ledger, Plutus, formal specifications) and therefore have no product of their own on [Cardano Applications](/apps) or [Builder Tools](https://developers.cardano.org/tools). Every claim must be publicly verifiable. You need to meet at least one of these criteria:

- **Maintainer of a core repository:** at least one person working for your company is listed as a maintainer in the `CODEOWNERS` or `MAINTAINERS` file of a core repository, for example in [IntersectMBO](https://github.com/IntersectMBO) (`cardano-node`, `ouroboros-consensus`, `ouroboros-network`, `cardano-ledger`, `plutus`, `cardano-api`, `cardano-cli`, `cardano-base`, `formal-ledger-specifications`). For each maintainer you provide two links: the line in `CODEOWNERS` or `MAINTAINERS` that names the person, and a public source for the affiliation (the company field on the GitHub profile, public membership in your GitHub organization, or a team page on your company website that names the person). Commit email addresses do not count as proof of affiliation.
- **Vendor of an enacted treasury withdrawal:** your company is named as the vendor of a treasury withdrawal that was enacted on chain for core development work. You link the governance action via `https://explorer.cardano.org/governance-action/<gov action id>`.

Membership in Intersect or any other organization alone does not qualify.

The links you provide go into the `evidence` field and are shown publicly in your entry, so that every visitor can check why your company is listed. We review entries listed through path 2 once a year. If a maintainer leaves the `CODEOWNERS` or `MAINTAINERS` file, or the funded work has ended and no new evidence exists, the entry is removed.

### Website Requirement
- Link to the company/association/collaboration website and not to the product website. Examples: don't link to **Flint Wallet** but to **dcSpark**. Don't link to **CardanoScan** but to **Strica**.
- Your company/association/collaboration website has to have a stable domain name. (a random Netlify/Vercel domain is not allowed, no URL shortener, no app store links, or similar)
- Don't link to token pages. Example: don't link to **World Mobile Token** but to **World Mobile**. 
- If you have registered your product as a company/association/collaboration or you have the same website for both, please link to a team or about Us page. Examples: entries of **DripDropz** and **jpg.store**.

### Logo Requirements
- Have your company/association/collaboration logo as SVG (Scalable Vector Graphics) file. In order to maintain a certain quality standard, no jpg, png or other formats are accepted.
- You need one that looks good on white background and one that looks good a dark background. (Light mode / dark mode)
- Avoid a transparent border around the logo otherwise it will be displayed too small.
- If you specify a size in the SVG file, do not go below 600x600.

### Pull Request requirements
- The GitHub account that adds the company must not be new.
- The GitHub account that adds the company must have a history/or already be known in the Cardano community.


## Changes for the actual pull request

To create a pull request that adds your company named `Amazing Company`:

- Fulfill all the above requirements.
- Copy your two logos (light and dark mode) to the folder `static/img/logos`. Name them `amazingcompany.svg` and `amazingcompany-dark.svg`.
- Make changes to the JSON file as shown below. 
- The field `showCompanyName` can be set to true if your company logo does not already include the company name. The name of the company is then displayed under the logo. Example: TxPipe and DripDropz. 
- The field `knownFor` must be set to at least one product/service or tool that is listed on either [Cardano Applications](/apps) or [Builder Tools](https://developers.cardano.org/tools).

```jsx title="src/data/logosCompanies.json"
  {
    "companyName": "Amazing Company",
    "imageName": "amazingcompany",
    "link": "https://link-to-amazing-company",
    "knownFor": "product, service or tool",
    "showCompanyName": false
  },
```

### Entries through path 2 (core development)

- Set `knownFor` to the concrete components your company works on, for example `"Ouroboros consensus, ledger conformance testing"`. No slogans.
- Set `category` to `"Core development"`.
- Add the field `evidence` with one to three links that prove the criteria from path 2. Each link has a short `label` and a `url`.

```jsx title="src/data/logosCompanies.json"
  {
    "companyName": "Amazing Company",
    "imageName": "amazingcompany",
    "link": "https://link-to-amazing-company",
    "knownFor": "Ouroboros consensus",
    "category": "Core development",
    "evidence": [
      {
        "label": "Treasury withdrawal for core development",
        "url": "https://explorer.cardano.org/governance-action/gov_action1..."
      },
      {
        "label": "Maintainer of ouroboros-consensus",
        "url": "https://github.com/IntersectMBO/ouroboros-consensus/blob/main/CODEOWNERS"
      }
    ],
    "showCompanyName": false
  },
```