// One-shot migration: docs/glossary.md → glossary/<slug>.md per-term files.
// After this runs successfully, the per-term files become the source of truth.
// Do NOT re-run; subsequent edits live in the .md files directly.
//
// Usage: node scripts/migrate-glossary.js [--force]

const fs = require('fs');
const path = require('path');
const GithubSlugger = require('github-slugger');

const REPO_ROOT = path.join(__dirname, '..');
const SOURCE = path.join(REPO_ROOT, 'docs/glossary.md');
const TARGET_DIR = path.join(REPO_ROOT, 'glossary');

const FORCE = process.argv.includes('--force');

// Hand-curated category assignments by slug. The migration script writes
// `category:` into every term's frontmatter; editors can refine after.
const CATEGORY_BY_SLUG = {
  // tokens & assets
  'ada': 'tokens',
  'babel-fees': 'tokens',
  'djed': 'tokens',
  'mary': 'tokens',
  'native-token': 'tokens',
  'nft': 'tokens',
  'stablecoin': 'tokens',
  'usdm': 'tokens',
  // consensus & staking
  'delegation': 'consensus',
  'epoch': 'consensus',
  'ispo': 'consensus',
  'ouroboros': 'consensus',
  'pool-saturation': 'consensus',
  'proof-of-stake': 'consensus',
  'proof-of-work': 'consensus',
  'rewards': 'consensus',
  'slot': 'consensus',
  'slot-leader': 'consensus',
  'smash': 'consensus',
  'stake-pool': 'consensus',
  'vrf': 'consensus',
  // smart contracts
  'aiken': 'smart-contracts',
  'dapp': 'smart-contracts',
  'plutus-core': 'smart-contracts',
  'smart-contract': 'smart-contracts',
  'untyped-plutus-core-uplc': 'smart-contracts',
  // wallets & keys
  'bech32': 'wallets',
  'icarus': 'wallets',
  'spending-password': 'wallets',
  'wallet': 'wallets',
  // governance
  'cip': 'governance',
  'cip-1694': 'governance',
  'constitution': 'governance',
  'constitutional-committee': 'governance',
  'conway': 'governance',
  'drep': 'governance',
  'governance-action': 'governance',
  'governance-tools': 'governance',
  'project-catalyst': 'governance',
  'sanchonet': 'governance',
  'treasury': 'governance',
  'voltaire': 'governance',
  // network & protocol
  'allegra': 'network',
  'alonzo': 'network',
  'basho': 'network',
  'block': 'network',
  'bridge': 'network',
  'byron': 'network',
  'eclipse': 'network',
  'goguen': 'network',
  'hard-fork': 'network',
  'hydra': 'network',
  'jormungandr': 'network',
  'layer-1': 'network',
  'layer-2': 'network',
  'mainnet': 'network',
  'shelley': 'network',
  'sidechains': 'network',
  'soft-fork': 'network',
  'testnet': 'network',
  'tps': 'network',
  'vasil': 'network',
  // general blockchain / ecosystem
  'ama': 'general',
  'ambassador': 'general',
  'api': 'general',
  'cardano': 'general',
  'cardano-summit': 'general',
  'cbdc': 'general',
  'cex': 'general',
  'computation-layer': 'general',
  'developer-portal': 'general',
  'dex': 'general',
  'did': 'general',
  'dyor': 'general',
  'edinburgh-decentralisation-index-edi': 'general',
  'emurgo': 'general',
  'eutxo': 'general',
  'input-output': 'general',
  'intersect': 'general',
  'pragma': 'general',
  'scam': 'general',
  'style-guide': 'general',
  'the-cardano-foundation': 'general',
  'use-case': 'general',
  'utxo': 'general',
  'working-group': 'general',
};

const FEATURED = new Set([
  'ada',
  'cardano',
  'ouroboros',
  'stake-pool',
  'delegation',
  'wallet',
  'smart-contract',
  'utxo',
  'eutxo',
  'drep',
]);

const ALIASES = {
  'ada': ['Ada', 'ADA'],
  'ama': ['Ask Me Anything'],
  'api': ['Application Programming Interface'],
  'cbdc': ['Central Bank Digital Currency'],
  'cex': ['Centralized Exchange'],
  'cip': ['Cardano Improvement Proposal'],
  'dapp': ['DApp', 'Decentralized Application'],
  'dex': ['Decentralized Exchange'],
  'did': ['Decentralized Identifier'],
  'drep': ['Delegated Representative'],
  'dyor': ['Do Your Own Research'],
  'edinburgh-decentralisation-index-edi': ['EDI', 'Edinburgh Decentralisation Index'],
  'eutxo': ['eUTxO', 'Extended UTxO'],
  'ispo': ['Initial Stake Pool Offering'],
  'jormungandr': ['Jörmungandr'],
  'nft': ['Non-Fungible Token'],
  'smash': ['Stakepool Metadata Aggregation Server'],
  'tps': ['Transactions per second'],
  'untyped-plutus-core-uplc': ['UPLC'],
  'utxo': ['UTxO', 'Unspent Transaction Output'],
  'vrf': ['Verifiable Random Function'],
};

// Mental models: only added where there is a clear, safe analogy.
// Kept short. Editor can extend.
const MENTAL_MODELS = {
  'ada': "The fuel of the Cardano network: it pays for transactions, rewards delegators, and represents stake in the system.",
  'utxo': "Think of each UTxO as a digital banknote. You can't spend half a $20 bill; you hand over the whole note and receive change back as a new note.",
  'eutxo': "Like a UTxO that can carry a small contract: rules about how the note is allowed to be spent travel with the note itself.",
  'stake-pool': "A node that other ada holders 'follow'. The more stake follows it, the more often it gets a turn to add blocks to the chain.",
  'delegation': "Like loaning out the influence of your ada without giving up the ada itself; you keep custody, the pool gets the chance to produce blocks on your behalf.",
  'epoch': "Cardano's 'week': five days during which the stake snapshot is frozen and rewards are calculated.",
  'slot': "One tick of the Cardano clock. Most ticks pass without a block, but on average every ~20 seconds one is lucky enough to produce one.",
  'hard-fork': "Like upgrading an operating system: after the upgrade, only nodes running the new version can keep talking to the network.",
  'drep': "A voter you delegate your governance power to, similar to electing a representative in parliament.",
  'smart-contract': "Code that lives on the blockchain and enforces a deal automatically: no escrow, no judge, no take-backs.",
};

// Related-term cross-references. Keys/values are slugs.
// Conservative: each direction is independent; redundant links are fine.
const RELATED = {
  'ada': ['cardano', 'delegation', 'stake-pool'],
  'aiken': ['smart-contract', 'plutus-core', 'untyped-plutus-core-uplc'],
  'allegra': ['hard-fork', 'mary', 'native-token'],
  'alonzo': ['hard-fork', 'smart-contract', 'plutus-core'],
  'babel-fees': ['eutxo', 'native-token', 'stake-pool'],
  'basho': ['hydra', 'shelley', 'goguen'],
  'bech32': ['wallet'],
  'block': ['ouroboros', 'slot', 'slot-leader'],
  'byron': ['shelley', 'ada'],
  'cardano': ['ada', 'ouroboros', 'eutxo'],
  'cip': ['cip-1694', 'governance-action'],
  'cip-1694': ['drep', 'constitutional-committee', 'conway', 'governance-action'],
  'computation-layer': ['smart-contract', 'eutxo'],
  'constitution': ['constitutional-committee', 'cip-1694'],
  'constitutional-committee': ['drep', 'cip-1694', 'governance-action'],
  'conway': ['hard-fork', 'cip-1694', 'voltaire'],
  'dapp': ['smart-contract', 'wallet'],
  'delegation': ['stake-pool', 'rewards', 'epoch'],
  'dex': ['cex', 'wallet'],
  'djed': ['stablecoin', 'usdm'],
  'drep': ['cip-1694', 'governance-action', 'constitutional-committee'],
  'eclipse': ['ouroboros'],
  'edinburgh-decentralisation-index-edi': ['ouroboros'],
  'epoch': ['slot', 'rewards', 'delegation'],
  'eutxo': ['utxo', 'smart-contract', 'native-token'],
  'goguen': ['smart-contract', 'plutus-core', 'native-token'],
  'governance-action': ['drep', 'constitutional-committee', 'cip-1694', 'treasury'],
  'governance-tools': ['drep', 'cip-1694'],
  'hard-fork': ['soft-fork', 'allegra', 'alonzo', 'mary', 'vasil', 'conway'],
  'hydra': ['layer-2'],
  'icarus': ['wallet'],
  'ispo': ['stake-pool', 'delegation'],
  'jormungandr': ['ouroboros', 'project-catalyst'],
  'layer-1': ['layer-2'],
  'layer-2': ['layer-1', 'hydra'],
  'mainnet': ['testnet'],
  'mary': ['hard-fork', 'native-token'],
  'native-token': ['mary', 'nft', 'eutxo'],
  'nft': ['native-token'],
  'ouroboros': ['slot', 'slot-leader', 'vrf', 'stake-pool', 'proof-of-stake'],
  'plutus-core': ['untyped-plutus-core-uplc', 'aiken', 'smart-contract'],
  'pool-saturation': ['stake-pool', 'delegation', 'rewards'],
  'project-catalyst': ['treasury', 'governance-action'],
  'proof-of-stake': ['ouroboros', 'proof-of-work', 'stake-pool'],
  'proof-of-work': ['proof-of-stake', 'ouroboros'],
  'rewards': ['delegation', 'epoch', 'stake-pool'],
  'sanchonet': ['testnet', 'cip-1694', 'drep'],
  'shelley': ['byron', 'goguen', 'delegation'],
  'sidechains': ['bridge', 'layer-2'],
  'slot': ['epoch', 'slot-leader', 'block'],
  'slot-leader': ['ouroboros', 'stake-pool', 'vrf'],
  'smart-contract': ['plutus-core', 'aiken', 'eutxo'],
  'soft-fork': ['hard-fork'],
  'stake-pool': ['delegation', 'slot-leader', 'pool-saturation', 'rewards'],
  'stablecoin': ['djed', 'usdm'],
  'testnet': ['mainnet', 'sanchonet'],
  'treasury': ['project-catalyst', 'governance-action'],
  'untyped-plutus-core-uplc': ['plutus-core', 'aiken', 'smart-contract'],
  'usdm': ['stablecoin', 'djed'],
  'utxo': ['eutxo'],
  'vasil': ['hard-fork', 'smart-contract'],
  'voltaire': ['cip-1694', 'drep', 'governance-action'],
  'vrf': ['ouroboros', 'slot-leader'],
  'wallet': ['bech32', 'spending-password'],
};

// Override slug for terms where the auto-generated slug is bad
// (e.g. non-Latin chars, overly long, or just less natural).
const SLUG_OVERRIDES = {
  'jörmungandr': 'jormungandr',
};

function firstSentence(text) {
  const cleaned = text.trim()
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [label](url) -> label
    .replace(/`([^`]+)`/g, '$1');               // strip inline code ticks
  // Match up through the first terminator (.!?) that is followed by whitespace +
  // a capital letter (i.e. an actual sentence break), or end-of-string. This
  // avoids splitting on periods inside domains like developers.cardano.org.
  const match = cleaned.match(/^([\s\S]+?[.!?])(?=\s+[A-Z]|\s*$)/);
  return match ? match[1].trim() : cleaned.split('\n')[0].trim();
}

function yamlScalar(value) {
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  const s = String(value);
  if (s === '' || /[:#&*!|>'"%@`{}\[\],]/.test(s) || /^\s|\s$/.test(s) || s.includes('\n')) {
    return JSON.stringify(s);  // YAML accepts JSON-style double-quoted strings
  }
  return s;
}

function yamlList(values) {
  return `[${values.map(yamlScalar).join(', ')}]`;
}

function buildFrontmatter(term) {
  const lines = [];
  lines.push(`title: ${yamlScalar(term.title)}`);
  lines.push(`slug: ${term.slug}`);
  lines.push(`short: ${yamlScalar(term.short)}`);
  lines.push(`category: ${term.category}`);
  if (term.aliases && term.aliases.length) {
    lines.push(`aliases: ${yamlList(term.aliases)}`);
  }
  if (term.featured) lines.push('featured: true');
  if (term.mentalModel) lines.push(`mentalModel: ${yamlScalar(term.mentalModel)}`);
  if (term.related && term.related.length) {
    lines.push(`related: ${yamlList(term.related)}`);
  }
  return `---\n${lines.join('\n')}\n---`;
}

function parseGlossary(content) {
  const noFm = content.replace(/^---[\s\S]*?---\n/, '');
  const sections = [];
  let current = null;
  for (const line of noFm.split('\n')) {
    if (/^##\s+[A-Z]\s*$/.test(line)) {
      if (current) sections.push(current);
      current = null;
      continue;
    }
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      if (current) sections.push(current);
      current = { title: h3[1], bodyLines: [] };
      continue;
    }
    if (current) current.bodyLines.push(line);
  }
  if (current) sections.push(current);
  return sections.map(s => ({
    title: s.title,
    body: s.bodyLines.join('\n').trim().replace(/\n{3,}/g, '\n\n'),
  }));
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`);
    process.exit(1);
  }

  if (fs.existsSync(TARGET_DIR) && !FORCE) {
    const existing = fs.readdirSync(TARGET_DIR).filter(f => f.endsWith('.md'));
    if (existing.length > 0) {
      console.error(`Target ${TARGET_DIR} already contains ${existing.length} .md files.`);
      console.error('Refusing to clobber. Re-run with --force to overwrite.');
      process.exit(1);
    }
  }

  const content = fs.readFileSync(SOURCE, 'utf8');
  const parsed = parseGlossary(content);
  console.log(`Parsed ${parsed.length} terms from ${SOURCE}`);

  const slugger = new GithubSlugger();
  slugger.reset();

  const terms = parsed.map(t => {
    const rawSlug = slugger.slug(t.title);
    const slug = SLUG_OVERRIDES[rawSlug] || rawSlug;
    return {
      title: t.title,
      slug,
      rawSlug,
      short: firstSentence(t.body),
      body: t.body,
      category: CATEGORY_BY_SLUG[slug] || 'general',
      featured: FEATURED.has(slug),
      aliases: ALIASES[slug],
      mentalModel: MENTAL_MODELS[slug],
      related: RELATED[slug],
    };
  });

  if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });

  for (const term of terms) {
    const filepath = path.join(TARGET_DIR, `${term.slug}.md`);
    const content = `${buildFrontmatter(term)}\n\n${term.body}\n`;
    fs.writeFileSync(filepath, content);
  }

  const counts = terms.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  console.log(`\nWrote ${terms.length} term files to ${TARGET_DIR}`);
  console.log('\nCategory distribution:');
  for (const [cat, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(20)} ${n}`);
  }

  const missing = terms.filter(t => !CATEGORY_BY_SLUG[t.slug]);
  if (missing.length > 0) {
    console.log(`\nWarning: ${missing.length} terms fell back to 'general' (no explicit category):`);
    for (const t of missing) console.log(`  - ${t.slug} (${t.title})`);
  }
}

main();
