# Website

Welcome to the cardano.org website. We believe that this website should be managed by a collective and not a single entity. For this to be successful, the website relies on your contributions. 

## Requirements

[Node.js](https://nodejs.org/en/download/) version >= 18.0
[Yarn](https://yarnpkg.com/en/) version >= 1.22  
On macOS you also need Xcode and Command Line Tools.

# Installation

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. This will get you up and running:

## Clone the repo
```
git clone https://github.com/katomm/www-cardano-revamp.git &&  && yarn install  
```
  
## Navigate into the folder
```
cd www-cardano-revamp
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

To browse the documentation visit http://localhost:3000/docs/intro.

## Build

```
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. Always build the site once before firing a pull request as many additional checks are carried out.
