// localStorage keys and validators for the get-started page. Validation runs
// on load so hand-edited or stale values fall back to the initial state.
export const ACCOUNT_KEY = 'cardano-get-started-account';
export const LOCAL_KEY = 'cardano-get-started-local';
// Key of the retired StepCard wizard, removed on first visit of the new page.
export const LEGACY_STEP_KEY = 'cardano-get-started-step';

import { isValidStakeAddress, isValidBaseAddress } from '../cardano/bech32.mjs';

export const OWNERSHIP = ['wallet-confirmed', 'unverified'];

// Full validation on load: checksum, hrp, network and type, so a hand-edited
// or truncated value never reaches the chain query.
export function isValidAccount(v) {
  return (
    !!v &&
    typeof v === 'object' &&
    isValidStakeAddress(v.stakeAddress) &&
    (v.baseAddress === null || v.baseAddress === undefined || isValidBaseAddress(v.baseAddress)) &&
    OWNERSHIP.includes(v.ownership) &&
    typeof v.savedAt === 'string' &&
    !Number.isNaN(Date.parse(v.savedAt))
  );
}

export function emptyLocal() {
  return { walletInstalled: false, phrasePracticePassed: false };
}

export function isValidLocal(v) {
  return (
    !!v &&
    typeof v === 'object' &&
    typeof v.walletInstalled === 'boolean' &&
    typeof v.phrasePracticePassed === 'boolean'
  );
}
