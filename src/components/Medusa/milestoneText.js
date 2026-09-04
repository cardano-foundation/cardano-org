import { translate } from '@docusaurus/Translate';

// Display texts per milestone key. Kept apart from src/data/medusa/milestones.js
// so the data file stays importable in Node tests.
export function milestoneText(key) {
  switch (key) {
    case 'repoStart':
      return {
        name: translate({ id: 'medusa.milestone.repoStart.name', message: 'Repository created' }),
        description: translate({ id: 'medusa.milestone.repoStart.description', message: 'The ledger rules start life as cardano-ledger-specs, with the Byron rules and the first Shelley drafts.' }),
      };
    case 'shelley':
      return {
        name: translate({ id: 'medusa.milestone.shelley.name', message: 'Shelley hard fork' }),
        description: translate({ id: 'medusa.milestone.shelley.description', message: 'Stake pools and delegation arrive, block production moves to the community.' }),
      };
    case 'allegra':
      return {
        name: translate({ id: 'medusa.milestone.allegra.name', message: 'Allegra hard fork' }),
        description: translate({ id: 'medusa.milestone.allegra.description', message: 'Token locking and validity intervals, the groundwork for smart contracts.' }),
      };
    case 'mary':
      return {
        name: translate({ id: 'medusa.milestone.mary.name', message: 'Mary hard fork' }),
        description: translate({ id: 'medusa.milestone.mary.description', message: 'Native multi-asset support, tokens on the ledger without smart contracts.' }),
      };
    case 'restructure':
      return {
        name: translate({ id: 'medusa.milestone.restructure.name', message: 'Repository restructured' }),
        description: translate({ id: 'medusa.milestone.restructure.description', message: 'The code moves into the eras and libs layout still used today, most files change their place.' }),
      };
    case 'alonzo':
      return {
        name: translate({ id: 'medusa.milestone.alonzo.name', message: 'Alonzo hard fork' }),
        description: translate({ id: 'medusa.milestone.alonzo.description', message: 'Plutus smart contracts go live on mainnet.' }),
      };
    case 'vasil':
      return {
        name: translate({ id: 'medusa.milestone.vasil.name', message: 'Vasil hard fork' }),
        description: translate({ id: 'medusa.milestone.vasil.description', message: 'The Babbage era brings reference inputs, inline datums and reference scripts.' }),
      };
    case 'chang':
      return {
        name: translate({ id: 'medusa.milestone.chang.name', message: 'Chang hard fork' }),
        description: translate({ id: 'medusa.milestone.chang.description', message: 'The Conway era opens and on-chain governance begins.' }),
      };
    case 'plomin':
      return {
        name: translate({ id: 'medusa.milestone.plomin.name', message: 'Plomin hard fork' }),
        description: translate({ id: 'medusa.milestone.plomin.description', message: 'Full on-chain governance: DRep voting, treasury withdrawals and constitutional changes.' }),
      };
    case 'vanRossem':
      return {
        name: translate({ id: 'medusa.milestone.vanRossem.name', message: 'van Rossem hard fork' }),
        description: translate({ id: 'medusa.milestone.vanRossem.description', message: 'The latest Conway era upgrade, see the hard forks page for details.' }),
      };
    default:
      return { name: key, description: '' };
  }
}
