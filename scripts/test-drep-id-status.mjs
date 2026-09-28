// Tests for the pasted DRep ID lookup in src/utils/cardano/drepIdStatus.mjs.
// Koios is faked, so nothing touches the network.
import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalDRepId, classifyDRepInfo, fetchDRepIdStatus } from '../src/utils/cardano/drepIdStatus.mjs';

// One credential hash in every spelling the tool accepts.
const HASH = '002e87e32c1735bef2af2825943a9c06714857d1fc19385b86e429a3';
const KEY = 'drep1ygqzaplr9stnt0hj4u5zt9p6nsr8zjzh687pjwzmsmjzngcdwm2a2';
const SCRIPT = 'drep1yvqzaplr9stnt0hj4u5zt9p6nsr8zjzh687pjwzmsmjzngcdutmad';
const CIP105_KEY = 'drep1qqhg0cevzu6mau409qjegw5uqec5s473lsvnskuxus56x0pvxhg';
const CIP105_SCRIPT = 'drep_script1qqhg0cevzu6mau409qjegw5uqec5s473lsvnskuxus56xqr3wtf';

function fakeApi({ list = [], info = [], infoError = null } = {}) {
  const calls = [];
  return {
    calls,
    get: async (path) => { calls.push(['get', path]); return { data: list }; },
    post: async (path, body) => {
      calls.push(['post', path, body]);
      if (infoError) throw infoError;
      return { data: info };
    },
  };
}

test('canonicalDRepId: every typed spelling becomes CIP-129 and keeps the credential type', () => {
  assert.equal(canonicalDRepId(KEY), KEY);
  assert.equal(canonicalDRepId(KEY.toUpperCase()), KEY);
  assert.equal(canonicalDRepId(SCRIPT), SCRIPT);
  assert.equal(canonicalDRepId(CIP105_KEY), KEY);
  assert.equal(canonicalDRepId(CIP105_SCRIPT), SCRIPT);
  assert.equal(canonicalDRepId(`22${HASH}`), KEY);
  assert.equal(canonicalDRepId(`23${HASH.toUpperCase()}`), SCRIPT);
});

test('canonicalDRepId: a bare hash has no type, malformed input has no ID', () => {
  assert.equal(canonicalDRepId(HASH), null);
  assert.equal(canonicalDRepId(`99${HASH}`), null);
  assert.equal(canonicalDRepId(HASH.slice(2)), null);
  assert.equal(canonicalDRepId(`${KEY.slice(0, -1)}3`), null);
  assert.equal(canonicalDRepId('stake1u98nnlkvkk23vtvf9273uq7cph5ww6u2yq2389psuqet90sv4xv9v'), null);
});

test('classifyDRepInfo: no row or a retired DRep means unregistered', () => {
  assert.deepEqual(classifyDRepInfo([]), { status: 'unregistered', drepId: null });
  assert.deepEqual(
    classifyDRepInfo([{ drep_id: KEY, drep_status: 'deregistered', active: false }]),
    { status: 'unregistered', drepId: null },
  );
});

test('classifyDRepInfo: registered DReps are active or inactive and keep the canonical ID', () => {
  assert.deepEqual(classifyDRepInfo([{ drep_id: KEY, drep_status: 'registered', active: true }]), { status: 'active', drepId: KEY });
  assert.deepEqual(classifyDRepInfo([{ drep_id: KEY, drep_status: 'registered', active: false }]), { status: 'inactive', drepId: KEY });
});

test('classifyDRepInfo: a body that is not an array is an error', () => {
  assert.throws(() => classifyDRepInfo(null));
  assert.throws(() => classifyDRepInfo({}));
});

test('fetchDRepIdStatus: typed IDs are looked up by their canonical form', async () => {
  const api = fakeApi({ info: [{ drep_id: SCRIPT, drep_status: 'registered', active: false }] });
  assert.deepEqual(await fetchDRepIdStatus(api, `23${HASH}`), { status: 'inactive', drepId: SCRIPT });
  assert.deepEqual(await fetchDRepIdStatus(api, CIP105_SCRIPT), { status: 'inactive', drepId: SCRIPT });
  assert.deepEqual(api.calls, [
    ['post', '/drep_info', { _drep_ids: [SCRIPT] }],
    ['post', '/drep_info', { _drep_ids: [SCRIPT] }],
  ]);
});

test('fetchDRepIdStatus: a bare hash resolves through drep_list when exactly one DRep matches', async () => {
  const api = fakeApi({ list: [{ drep_id: KEY }], info: [{ drep_id: KEY, drep_status: 'registered', active: true }] });
  assert.deepEqual(await fetchDRepIdStatus(api, HASH.toUpperCase()), { status: 'active', drepId: KEY });
  assert.deepEqual(api.calls[0], ['get', `/drep_list?hex=eq.${HASH}&select=drep_id`]);
  assert.deepEqual(api.calls[1], ['post', '/drep_info', { _drep_ids: [KEY] }]);
});

test('fetchDRepIdStatus: a bare hash with no match is unregistered, with two matches it stays unresolved', async () => {
  assert.deepEqual(await fetchDRepIdStatus(fakeApi({ list: [] }), HASH), { status: 'unregistered', drepId: null });
  const both = fakeApi({ list: [{ drep_id: KEY }, { drep_id: SCRIPT }] });
  assert.deepEqual(await fetchDRepIdStatus(both, HASH), { status: 'unknown', drepId: null });
  assert.equal(both.calls.length, 1);
});

test('fetchDRepIdStatus: malformed IDs are invalid without asking Koios', async () => {
  const api = fakeApi();
  const invalid = { status: 'invalid', drepId: null };
  assert.deepEqual(await fetchDRepIdStatus(api, `${KEY.slice(0, -1)}3`), invalid);
  assert.deepEqual(await fetchDRepIdStatus(api, 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy'), invalid);
  assert.deepEqual(await fetchDRepIdStatus(api, `99${HASH}`), invalid);
  assert.deepEqual(await fetchDRepIdStatus(api, HASH.slice(2)), invalid);
  assert.deepEqual(api.calls, []);
});

test('fetchDRepIdStatus: a broken drep_list body is an error, not an unregistered DRep', async () => {
  const api = { get: async () => ({ data: { message: 'oops' } }), post: async () => ({ data: [] }) };
  await assert.rejects(() => fetchDRepIdStatus(api, HASH), /drep_list/);
});

test('fetchDRepIdStatus: other failures propagate', async () => {
  const api = fakeApi({ infoError: new Error('timeout') });
  await assert.rejects(() => fetchDRepIdStatus(api, KEY), /timeout/);
});
