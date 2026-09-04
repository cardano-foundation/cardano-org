/**
 * Tests for src/components/Medusa/groups.js, the path to era mapping shared
 * by the data script and the legend. Run with `node`, no framework.
 */
const assert = require('node:assert');

async function main() {
  const { GROUPS, ERA_KEYS, groupForPath, groupIndex, groupColor } =
    await import('../src/components/Medusa/groups.js');

  let passed = 0;
  const check = (name, fn) => {
    try {
      fn();
    } catch (err) {
      err.message = `FAIL: ${name}\n${err.message}`;
      throw err;
    }
    passed += 1;
    console.log(`  ok - ${name}`);
  };

  check('era segment anywhere in the path wins', () => {
    assert.strictEqual(groupForPath('eras/shelley/impl/src/Cardano/Ledger/Shelley.hs'), 'shelley');
    assert.strictEqual(groupForPath('shelley/chain-and-ledger/executable-spec/src/STS.hs'), 'shelley');
    assert.strictEqual(groupForPath('byron/ledger/impl/src/Cardano/Chain/Block.hs'), 'byron');
    assert.strictEqual(groupForPath('eras/conway/impl/cddl-files/conway.cddl'), 'conway');
  });

  check('first era segment wins when several appear', () => {
    assert.strictEqual(groupForPath('eras/alonzo/test-suite/golden/babbage.json'), 'alonzo');
  });

  check('matching is case insensitive and exact per segment', () => {
    assert.strictEqual(groupForPath('eras/Shelley/README.md'), 'shelley');
    assert.strictEqual(groupForPath('libs/cardano-ledger-shelley-test/src/Foo.hs'), 'libs');
  });

  check('shelley-ma maps to mary', () => {
    assert.strictEqual(groupForPath('eras/shelley-ma/impl/src/Cardano/Ledger/ShelleyMA.hs'), 'mary');
  });

  check('non era paths group by top level directory', () => {
    assert.strictEqual(groupForPath('libs/cardano-ledger-core/src/Cardano/Ledger/Core.hs'), 'libs');
    assert.strictEqual(groupForPath('docs/adr/0001.md'), 'docs');
    assert.strictEqual(groupForPath('.github/workflows/ci.yml'), 'other');
    assert.strictEqual(groupForPath('nix/default.nix'), 'other');
    assert.strictEqual(groupForPath('README.md'), 'other');
    assert.strictEqual(groupForPath('/'), 'other');
  });

  check('GROUPS lists eras first, then libs, docs, other', () => {
    assert.deepStrictEqual(GROUPS.map((g) => g.key), [...ERA_KEYS, 'libs', 'docs', 'other']);
    assert.deepStrictEqual(ERA_KEYS, ['byron', 'shelley', 'allegra', 'mary', 'alonzo', 'babbage', 'conway', 'dickson']);
  });

  check('groupIndex and groupColor are consistent with GROUPS', () => {
    GROUPS.forEach((g, i) => {
      assert.strictEqual(groupIndex(g.key), i);
      assert.match(groupColor(g.key), /^#[0-9a-f]{6}$/);
    });
    assert.strictEqual(groupIndex('nope'), groupIndex('other'));
  });

  console.log(`\n${passed} medusa groups tests passed`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
