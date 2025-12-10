---
sidebar_position: 2
---
 
# Local copy

Thank you for considering to contribute to cardano.org. To contribute, you must first install it locally. We have chosen Docusaurus, a modern static website generator, as the underlying software.

## What you'll need

- [Node.js](https://nodejs.org/en/download/) version >= 18.0 (which can be checked by running `node -v`). You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a single machine installed.
- [Yarn](https://yarnpkg.com/en/) version >= 1.22 (which can be checked by running `yarn --version`). Yarn is a performant package manager for JavaScript and replaces the `npm` client. It is not strictly necessary but highly encouraged.
- On macOS you also need Xcode and Command Line Tools.

## Local development

To get a local development environment, clone the repository, navigate into the `cardano-org` folder, install dependencies, and start the development server. Most changes are reflected live without having to restart the server. By default, a browser window will open at `http://localhost:3000`.

```sh
git clone --depth 1 https://github.com/cardano-foundation/cardano-org.git
cd cardano-org
yarn install
yarn start
```

Open `docs/index.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes http://localhost:3000/docs/ in the moment you save your file.

## Folder structure

The site is structured as follows. (See the [Folder structure rundown](#folder-structure-rundown) below for details)

```sh
cardano-org
├── blog
│   ├── 2024-02-14-plutus-v3-on-testnet
│   ├── ...
│   └── authors.yml
├── build
│   └── ...
├── docs
│   ├── index.md (this page)
│   └── ...
├── src
│   ├── components
│   │   └── ...
│   ├── css
│   │   └── custom.css
│   ├── data
│   │   ├── ambassadorsData.json
│   │   ├── delegationFAQ.json
│   │   ├── logosCompanies.json
│   │   ├── logosEntities.json
│   │   ├── operationFAQ.json
│   │   ├── pineappleFAQ.json
│   │   └── termsForTermExplainer.json
│   └── pages
│       ├── ambassadors.js
│       ├── brand-assets.js
│       ├── calculator.js
│       ├── community-code-of-conduct.js
│       └── ...
├── static
│   ├── downloads
│   └── img
├── docusaurus.config.js
├── package.json
├── README.md
├── sidebars.js
└── yarn.lock
```

### Folder structure rundown

- `/blog/` - Contains the Markdown files for the news section.
- `/docs/` - Contains the Markdown files for the documentation of the components (like this page). Customize the order of the docs sidebar in `sidebars.js`.
- `/src/` - Non-documentation files like pages, custom React components, data and css files.
  - `/src/data/ambassadorsData.json` - Ambassador data for https://cardano.org/ambassadors/.
  - `/src/data/delegationFAQ.json` - FAQ data for https://cardano.org/stake-pool-delegation/.
  - `/src/data/logosCompanies.json` - Company data for https://cardano.org/entities/.
  - `/src/data/logosEntities.json` - Entitiy data for https://cardano.org/entities.
  - `/src/data/operationFAQ.json` - FAQ data for https://cardano.org/stake-pool-operation/.
  - `/src/data/pineappleFAQ.json` - example FAQ data for the [FAQ section tutorial](/docs/tutorial/faq-component).
  - `/src/data/termsForTermExplainer.json` - data for the TermExplainer component.
  - `/src/pages` - Any files within this directory will be converted into a website page.
- `/static/` - Static directory. Any contents inside here will be copied into the root of the final `build` directory.
  - `/static/archive` - Genesis distribution content that we want to preserve. Data was downloaded from static.iohk.io.
  - `/static/downloads` - Content that needs to be distributed, e.g. media packs.
  - `/static/img` - All kinds of images. To highlight a few: `authors` are logos for `authors.yml`, `logos` are entity and company logos, `og` are open graph images.
- `/docusaurus.config.js` - A config file containing the site configuration.
- `/package.json` - A Docusaurus website is a React app. You can install and use any npm packages you like in them.
- `/sidebar.js` - Used by the documentation to specify the order of documents in the sidebar.


## Known problems that may arise
We list here problems you may run into when running cardano.org locally.

### Minimum Node.js version not met 
**Problem:** `yarn start` throws the error `[ERROR] Minimum Node.js version not met :(`.  
**Solution:** use the node version listed below [requirements](#requirements). If you have different node versions installed for different projects, `nvm` is a neat tool to deal with it. You can switch versions with for example `nvm use 18`.

## Other questions
Various other questions and answers.

### Anything I can do to make sure my pull request will not break on the staging/production server?
Yes, please always do a `yarn build` before submitting a pull request. It will find many more issues than `yarn start`.

### Do we have editorial guidelines?
Yes, we adhere to these [editorial guidelines](/docs/glossary).
 
