/**
 * Tiny assertion runner shared by the medusa test scripts. Keeps the plain
 * node style of the other test scripts, no framework: check() runs one case
 * and prints it, done() prints the summary line.
 */
function createChecker(label) {
  let passed = 0;

  function check(name, fn) {
    try {
      fn();
    } catch (err) {
      err.message = `FAIL: ${name}\n${err.message}`;
      throw err;
    }
    passed += 1;
    console.log(`  ok - ${name}`);
  }

  function done() {
    console.log(`\n${passed} ${label} tests passed`);
  }

  return { check, done };
}

module.exports = { createChecker };
