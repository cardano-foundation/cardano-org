// Twelve words that are deliberately NOT in the BIP39 list. A valid BIP39
// phrase always derives a real wallet that someone could fund and drain, so
// the demo must be visibly fake. As a side effect the words teach the
// Cardano eras and a few protocol names. A unit test guards the invariant.
export const DEMO_PHRASE = [
  'byron', 'shelley', 'goguen', 'basho', 'voltaire', 'ouroboros',
  'lovelace', 'plutus', 'hydra', 'mithril', 'conway', 'epoch',
];

function shuffle(items, random) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Builds the "which is word N?" rounds wallets use to verify a backup.
// `random` is injectable so tests are deterministic.
export function makeExercise(random = Math.random, rounds = 3) {
  const positions = shuffle(DEMO_PHRASE.map((_, i) => i), random).slice(0, rounds);
  return positions.map((index) => {
    const correct = DEMO_PHRASE[index];
    const others = shuffle(DEMO_PHRASE.filter((_, i) => i !== index), random).slice(0, 3);
    const options = shuffle([correct, ...others], random);
    return { position: index + 1, options, answer: options.indexOf(correct) };
  });
}
