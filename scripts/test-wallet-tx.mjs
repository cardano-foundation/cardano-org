// Tests for the stake delegation helpers in src/utils/cardano/wallet.js and
// the error classification in src/utils/walletTx.js. The CIP-30 wallet and
// the Evolution SDK are faked, so nothing touches the network or loads WASM.
import test from 'node:test';
import assert from 'node:assert/strict';
import { delegateStake, rewardAddressesBech32 } from '../src/utils/cardano/wallet.js';
import { classifyError, DelegationGuardError } from '../src/utils/walletTx.js';

const NUTS_BECH32 = 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy';
const STAKE_A_HEX = 'e14f39feccb595162d892abd1e03d80de8e76b8a2015139430e032b2be';
const STAKE_A = 'stake1u98nnlkvkk23vtvf9273uq7cph5ww6u2yq2389psuqet90sv4xv9v';
const STAKE_B_HEX = `e1${'00'.repeat(28)}`;
const STAKE_B = 'stake1uyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq28lj8u';

function fakeApi({ networkId = 1, rewards = [STAKE_A_HEX], signTx, submitTx } = {}) {
  return {
    calls: [],
    async getNetworkId() { this.calls.push('getNetworkId'); return networkId; },
    async getRewardAddresses() { this.calls.push('getRewardAddresses'); return rewards; },
    async signTx(tx, partial) { this.calls.push(['signTx', partial]); return signTx ? signTx(tx) : 'witness'; },
    async submitTx(tx) { this.calls.push('submitTx'); return submitTx ? submitTx(tx) : 'txhash'; },
  };
}

// Records which builder operation ran and hands back opaque tokens.
function fakeSdk(log) {
  const builder = {
    registerAndDelegateTo(p) { log.push(['registerAndDelegateTo', p]); return builder; },
    delegateToPool(p) { log.push(['delegateToPool', p]); return builder; },
    attachMetadata(p) { log.push(['attachMetadata', p.label]); return builder; },
    async build() { return { async toTransaction() { return { tag: 'tx' }; } }; },
  };
  const client = { withKoios() { return client; }, withCip30() { return client; }, newTx() { return builder; } };
  return {
    Client: { make() { return client; } },
    mainnet: {},
    RewardAccount: { fromHex(hex) { return { stakeCredential: `cred:${hex}` }; } },
    PoolKeyHash: { fromBech32(id) { return `pkh:${id}`; } },
    Transaction: {
      toCBORHex(tx) { return `cbor:${tx.tag}`; },
      addVKeyWitnessesHex(tx, w) { return `${tx}+${w}`; },
    },
  };
}

const noSdk = async () => { throw new Error('sdk must not load'); };
const base = (over = {}) => ({
  poolId: NUTS_BECH32, stakeAddress: STAKE_A, registrationStatus: 'registered', koiosUrl: 'https://koios.test', ...over,
});

async function rejection(promise) {
  try { await promise; } catch (err) { return err; }
  throw new Error('expected a rejection');
}

test('rewardAddressesBech32 maps every address without the SDK', async () => {
  const out = await rewardAddressesBech32(fakeApi({ rewards: [STAKE_A_HEX, STAKE_B_HEX] }));
  assert.deepEqual(out, [{ hex: STAKE_A_HEX, bech32: STAKE_A }, { hex: STAKE_B_HEX, bech32: STAKE_B }]);
  assert.deepEqual(await rewardAddressesBech32(fakeApi({ rewards: [] })), []);
});

test('rewardAddressesBech32 throws on undecodable input instead of dropping it', async () => {
  await assert.rejects(rewardAddressesBech32(fakeApi({ rewards: ['zz'] })), /reward address/i);
  await assert.rejects(rewardAddressesBech32(fakeApi({ rewards: 'nope' })), /reward address/i);
});

test('delegateStake refuses an unknown registration status before touching the wallet', async () => {
  const api = fakeApi();
  const err = await rejection(delegateStake({ api, ...base({ registrationStatus: 'unknown' }), loadSdk: noSdk }));
  assert.ok(err instanceof DelegationGuardError);
  assert.equal(err.code, 'statusUnknown');
  assert.deepEqual(api.calls, []);
});

test('delegateStake refuses the wrong network', async () => {
  const err = await rejection(delegateStake({ api: fakeApi({ networkId: 0 }), ...base(), loadSdk: noSdk }));
  assert.equal(classifyError(err), 'wrongNetwork');
});

test('delegateStake refuses when the chosen stake address is gone', async () => {
  const gone = await rejection(delegateStake({ api: fakeApi({ rewards: [STAKE_B_HEX] }), ...base(), loadSdk: noSdk }));
  assert.equal(gone.code, 'accountChanged');
  const none = await rejection(delegateStake({ api: fakeApi({ rewards: [] }), ...base(), loadSdk: noSdk }));
  assert.equal(none.code, 'noRewardAddress');
});

test('delegateStake picks the chosen address among several and uses the plain certificate', async () => {
  const log = [];
  const api = fakeApi({ rewards: [STAKE_B_HEX, STAKE_A_HEX] });
  const hash = await delegateStake({ api, ...base(), loadSdk: async () => fakeSdk(log) });
  assert.equal(hash, 'txhash');
  assert.deepEqual(log[0], ['delegateToPool', { stakeCredential: `cred:${STAKE_A_HEX}`, poolKeyHash: `pkh:${NUTS_BECH32}` }]);
  assert.deepEqual(log[1], ['attachMetadata', 674n]);
  assert.deepEqual(api.calls.slice(-2), [['signTx', false], 'submitTx']);
});

test('delegateStake registers and delegates in one go for a new stake key', async () => {
  const log = [];
  await delegateStake({ api: fakeApi(), ...base({ registrationStatus: 'unregistered' }), loadSdk: async () => fakeSdk(log) });
  assert.equal(log[0][0], 'registerAndDelegateTo');
});

test('delegateStake surfaces a sign cancel and a submit failure as classified errors', async () => {
  const cancel = await rejection(delegateStake({
    api: fakeApi({ signTx: () => { throw { code: 2, info: 'User declined to sign the transaction' }; } }),
    ...base(), loadSdk: async () => fakeSdk([]),
  }));
  assert.equal(classifyError(cancel), 'userCancelled');
  const submit = await rejection(delegateStake({
    api: fakeApi({ submitTx: () => { throw { code: 2, info: 'StakeKeyRegisteredDELEG' }; } }),
    ...base({ registrationStatus: 'unregistered' }), loadSdk: async () => fakeSdk([]),
  }));
  assert.equal(classifyError(submit), 'stakeKeyAlreadyRegistered');
});

test('classifyError keeps the existing DRep and treasury classifications', () => {
  assert.equal(classifyError(new Error('StakeKeyNotRegisteredDELEG')), 'stakeNotRegistered');
  assert.equal(classifyError(new Error('StakeNotRegistered')), 'stakeNotRegistered');
  assert.equal(classifyError({ code: 2, info: 'user declined' }), 'userCancelled');
  assert.equal(classifyError('Rejected by user'), 'userCancelled');
  assert.equal(classifyError(new Error('Transaction rejected by user')), 'userCancelled');
  assert.equal(classifyError(new Error('Failed to fetch')), 'generic');
  assert.equal(classifyError({ code: 2, info: 'Failure' }), 'generic');
  assert.equal(classifyError(null), 'generic');
});

test('classifyError adds insufficient funds, already registered and guard codes', () => {
  assert.equal(classifyError(new Error('InputsExhaustedError: not enough lovelace')), 'insufficientFunds');
  assert.equal(classifyError(new Error('UTxO balance insufficient')), 'insufficientFunds');
  assert.equal(classifyError(new Error('StakeKeyRegisteredDELEG')), 'stakeKeyAlreadyRegistered');
  assert.equal(classifyError(new DelegationGuardError('statusUnknown', 'x')), 'statusUnknown');
});
