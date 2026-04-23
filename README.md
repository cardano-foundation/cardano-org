[![Netlify Status](https://api.netlify.com/api/v1/badges/8cf7b954-67c1-4533-b3b5-fa74f47286a4/deploy-status)](https://app.netlify.com/sites/new-cardano-org-staging/deploys)

# Website

Welcome to the cardano.org website. We believe that this website should be managed by a collective and not a single entity. For this to be successful, the website relies on your contributions.  

cardano.org follows an incremental evolution model. This repository avoids full rebuild projects, agency-led redesigns, or “start from scratch” initiatives unless there is a demonstrated, documented and reviewed technical need. Improvements should be made through small, reviewable, continuously shipped changes.

## Contribution boundaries

Suitable contributions include:  
- Content fixes, clarity, translations (once established), link hygiene. 
- UI/UX improvements that follow existing design tokens. 
- Component or navigation improvements backed by discussion. 
- Docs, accessibility, performance and “paper cut” improvements. 

Not suitable (without prior discussion):
- Visual redesigns, rebranding, theme changes
- Moving to a new framework or build system
- Agency-style proposals for large paid revamps
- Large content reshuffles without information architecture discussion

### Issue claim workflow
1.	Comment “I’d like to work on this”
2.	Wait for maintainer assignment
3.	If inactive for 21 days, issue becomes unassigned


### Start here
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [AGENTS.md](AGENTS.md) – Onboarding & Guardrails for AI agents
- [docs/](https://cardano.org/docs/) for content
- [Discussions](https://github.com/cardano-foundation/cardano-org/discussions) for idea-level conversations


# Installation

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. This will get you up and running:

## Requirements

- [Node.js](https://nodejs.org/en/download/) version >= 20.19 (see `.nvmrc` for exact version)
- [Yarn](https://yarnpkg.com/en/) version >= 1.22
- On macOS you also need Xcode and Command Line Tools.

## Clone the repo
```
git clone https://github.com/cardano-foundation/cardano-org.git
```
  
## Navigate into the folder
```
cd cardano-org
```

## Install all dependencies
```
yarn install
```

## Start local development

```
yarn start
```

This command starts a local development server and opens up a browser window to http://localhost:3000. Most changes are reflected live without having to restart the server.

To browse the documentation visit http://localhost:3000/docs/.

## Build

```
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. Always build the site once before firing a pull request as many additional checks are carried out.

## Network testing
```
yarn start --host 0.0.0.0
```
With this command you are making it listen on all network interfaces (IP addresses) of your computer. This includes the local loopback interface (127.0.0.1 or localhost) and any other network interfaces that can connect your computer to a local network or the internet. Great for testing the site with different devices on your local network.

## Internationalization (i18n)

The site supports multiple locales: English (default), Japanese (`ja`), and German (`de`).

### Testing a specific locale in development

The dev server only serves one locale at a time. To test a specific locale:

```bash
yarn start --locale ja   # Japanese
yarn start --locale de   # German
```

This serves the locale at `http://localhost:3000/` (without a locale prefix).

### Testing multi-locale URL structure

The `/ja/` and `/de/` URL prefixes only work in production builds. To test the full structure:

```bash
yarn build && yarn serve
```

Then access:
- `http://localhost:3000/` - English
- `http://localhost:3000/ja/` - Japanese
- `http://localhost:3000/de/` - German
