// Tests for the hard fork status rule in src/utils/cardano/hardForkStatus.mjs.
// The rows are real Koios responses recorded at mainnet epoch 668 (Preprod
// for the expired action), so nothing touches the network.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveStage,
  findAction,
  normalizeActions,
  normalizeParams,
  normalizeVotes,
} from '../src/utils/cardano/hardForkStatus.mjs';

const PARAMS_ROWS = [
  { epoch_no: 668, protocol_major: 11, protocol_minor: 0, dvt_hard_fork_initiation: 0.6, pvt_hard_fork_initiation: 0.51 },
];

// van Rossem (to version 11) and Plomin (to version 10), both enacted.
const VAN_ROSSEM = {
  proposal_id: 'gov_action1lh2x3kjucjkggvwu6l3txggkvmrnhs3flpv8j35lvlcan4gax3xsq3cxfjc',
  proposed_epoch: 637,
  ratified_epoch: 643,
  enacted_epoch: 644,
  expired_epoch: null,
  dropped_epoch: null,
  expiration: 644,
  proposal_description: {
    tag: 'HardForkInitiation',
    contents: [{ txId: '0b19476e40bbbb5e1e8ce153523762e2b6859e7ecacbaf06eae0ee6a447e79b9', govActionIx: 0 }, { major: 11, minor: 0 }],
  },
};
const PLOMIN = {
  proposal_id: 'gov_action1pvv5wmjqhwa4u85vu9f4ydmzu2mgt8n7et967ph2urhx53r70xusqnmm525',
  proposed_epoch: 529,
  ratified_epoch: 536,
  enacted_epoch: 537,
  expired_epoch: null,
  dropped_epoch: null,
  expiration: 536,
  proposal_description: { tag: 'HardForkInitiation', contents: [null, { major: 10, minor: 0 }] },
};
const ACTION_ROWS = [VAN_ROSSEM, PLOMIN];

// A Preprod action that ran out of time without being ratified.
const EXPIRED = {
  proposal_id: 'gov_action1uhfg3dwws8ptqja63dwnmxnf4jdq0p2yqghapmqj87jhzlt0y0cqqauysd8',
  proposed_epoch: 317,
  ratified_epoch: null,
  enacted_epoch: null,
  expired_epoch: 324,
  dropped_epoch: 325,
  expiration: 324,
  proposal_description: {
    tag: 'HardForkInitiation',
    contents: [{ txId: '79fb4bac13dfc272a53357309f70bc8c60f1950137b24585b850147251ff2554', govActionIx: 0 }, { major: 11, minor: 1 }],
  },
};

const VOTE_ROWS = [{ drep_yes_pct: 77.85, pool_yes_pct: 53.02, committee_yes_votes_cast: 7, committee_no_votes_cast: 0 }];

// The van Rossem action as it stood earlier in its life.
const whileOpen = { ...VAN_ROSSEM, ratified_epoch: null, enacted_epoch: null };
const whileRatified = { ...VAN_ROSSEM, enacted_epoch: null };

const params = normalizeParams(PARAMS_ROWS);
const before = { ...params, major: 10 };

function stageFor(rows, { target = 11, mainnet = before } = {}) {
  return deriveStage({
    editorStage: 'preprod',
    target,
    params: mainnet,
    action: findAction(normalizeActions(rows), target),
  });
}

test('normalizeParams: reads version and thresholds, rejects anything else', () => {
  assert.deepEqual(params, { epoch: 668, major: 11, minor: 0, drepThreshold: 0.6, poolThreshold: 0.51 });
  assert.equal(normalizeParams(null), null);
  assert.equal(normalizeParams([]), null);
  assert.equal(normalizeParams([{ epoch_no: 668 }]), null);
});

test('normalizeActions: reads the target version and the state of each action', () => {
  const actions = normalizeActions([...ACTION_ROWS, EXPIRED]);
  assert.deepEqual(actions.map((a) => [a.major, a.state]), [[11, 'enacted'], [10, 'enacted'], [11, 'closed']]);
  assert.deepEqual(normalizeActions(null), []);
  assert.deepEqual(normalizeActions([{ proposal_id: 'x', proposal_description: {} }]), []);
});

test('no action to the target version: the typed stage stands', () => {
  assert.deepEqual(stageFor(ACTION_ROWS, { target: 12, mainnet: params }), { stage: 'preprod', fromChain: false });
});

test('an expired action does not count', () => {
  assert.deepEqual(stageFor([EXPIRED]), { stage: 'preprod', fromChain: false });
});

test('an action to another version does not count', () => {
  assert.deepEqual(stageFor([PLOMIN]), { stage: 'preprod', fromChain: false });
});

test('an open action: up for vote, with the last epoch to vote', () => {
  assert.deepEqual(stageFor([whileOpen]), { stage: 'vote', fromChain: true, actionId: VAN_ROSSEM.proposal_id, expiration: 644 });
});

test('a ratified action: scheduled for the epoch after ratification', () => {
  const scheduled = stageFor([whileRatified]);
  assert.deepEqual(scheduled, { stage: 'scheduled', fromChain: true, actionId: VAN_ROSSEM.proposal_id, epoch: 644 });
  // Both enacted actions took effect one epoch after they were ratified.
  for (const row of ACTION_ROWS) assert.equal(row.enacted_epoch, row.ratified_epoch + 1);
});

test('an enacted action or mainnet at the target version: live', () => {
  assert.deepEqual(stageFor(ACTION_ROWS), { stage: 'live', fromChain: true });
  assert.deepEqual(stageFor([], { mainnet: params }), { stage: 'live', fromChain: true });
});

test('an open action wins over an expired one to the same version', () => {
  const expiredSameVersion = { ...EXPIRED, proposal_description: VAN_ROSSEM.proposal_description };
  assert.equal(stageFor([expiredSameVersion, whileOpen]).stage, 'vote');
});

test('a hard fork without a target version is never overridden', () => {
  assert.deepEqual(stageFor(ACTION_ROWS, { target: null }), { stage: 'preprod', fromChain: false });
});

test('missing chain data: the typed stage stands', () => {
  assert.deepEqual(deriveStage({ editorStage: 'devnet', target: 12, params: null, action: null }), { stage: 'devnet', fromChain: false });
});

test('normalizeVotes: reads the yes shares and the committee count', () => {
  assert.deepEqual(normalizeVotes(VOTE_ROWS), { drepYesPct: 77.85, poolYesPct: 53.02, committeeYes: 7, committeeNo: 0 });
  assert.equal(normalizeVotes(null), null);
  assert.equal(normalizeVotes([{}]), null);
});
