//
// Snapshots Conway treasury donations per epoch for /governance/treasury.
//
// Koios fills totals.treasury_donation only on the single-epoch call
// /totals?_epoch_no=N. Bulk and range queries return null for it. So this
// script walks the epochs one by one, starting after the last checked
// epoch in the snapshot, and stops at the last completed epoch.
//
// Run manually alongside the tx-stats update: `yarn update-treasury-donations`.
// Any failure aborts before writing, and the file is replaced atomically, so
// the next run resumes where the snapshot ends and no epoch is skipped.
//
import { readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import axios from 'axios';
import { parseLovelace } from '../src/utils/cardano/lovelace.mjs';

export const FIRST_DONATION_EPOCH = 507;
const API_URL = process.env.CARDANO_ORG_API_URL || 'https://data.cardano.org/k/api/v1';
const OUT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/treasury-donations.json');

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Epochs still to check. The running epoch is excluded because donations
// can still arrive in it.
export function planRange(snapshot, currentEpoch) {
  const toEpoch = currentEpoch - 1;
  const fromEpoch = Number.isInteger(snapshot?.updatedEpoch) ? snapshot.updatedEpoch + 1 : FIRST_DONATION_EPOCH;
  return fromEpoch > toEpoch ? null : { fromEpoch, toEpoch };
}

async function fetchDonation(getJson, epoch, attempts, sleep) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const rows = await getJson(`/totals?_epoch_no=${epoch}&select=epoch_no,treasury_donation`);
      const row = Array.isArray(rows) ? rows.find((r) => r?.epoch_no === epoch) : null;
      const value = parseLovelace(row?.treasury_donation);
      if (value === null) {
        throw new Error(`no usable treasury_donation (${JSON.stringify(row?.treasury_donation)})`);
      }
      return value;
    } catch (err) {
      lastError = err;
      if (attempt < attempts) await sleep(500 * attempt);
    }
  }
  throw new Error(`epoch ${epoch}: ${lastError?.message || 'unknown error'}`);
}

export async function collectDonations({ getJson, fromEpoch, toEpoch, attempts = 3, sleep = defaultSleep }) {
  const found = [];
  for (let epoch = fromEpoch; epoch <= toEpoch; epoch += 1) {
    const lovelace = await fetchDonation(getJson, epoch, attempts, sleep);
    if (lovelace > 0n) found.push({ epoch, lovelace: lovelace.toString() });
  }
  return found;
}

export function mergeSnapshot(snapshot, found, toEpoch) {
  const byEpoch = new Map((snapshot?.epochs || []).map((e) => [e.epoch, e]));
  for (const e of found) byEpoch.set(e.epoch, e);
  const epochs = [...byEpoch.values()].sort((a, b) => a.epoch - b.epoch);
  return { updatedEpoch: toEpoch, epochs };
}

export async function runUpdate({ getJson, readSnapshot, writeSnapshot, sleep = defaultSleep }) {
  const snapshot = await readSnapshot();
  const tip = await getJson('/tip');
  const currentEpoch = tip?.[0]?.epoch_no;
  if (!Number.isInteger(currentEpoch)) throw new Error('could not read the current epoch from /tip');
  const range = planRange(snapshot, currentEpoch);
  if (!range) return { status: 'current', snapshot };
  const found = await collectDonations({ getJson, ...range, sleep });
  const next = mergeSnapshot(snapshot, found, range.toEpoch);
  await writeSnapshot(next);
  return { status: 'written', snapshot: next };
}

async function readSnapshotFile() {
  try {
    return JSON.parse(await readFile(OUT_PATH, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

// Write next to the target, then rename, so a failed write never leaves a
// truncated snapshot behind.
async function writeSnapshotFile(next) {
  const tmp = `${OUT_PATH}.tmp`;
  await writeFile(tmp, `${JSON.stringify(next, null, 2)}\n`);
  await rename(tmp, OUT_PATH);
}

async function main() {
  const api = axios.create({
    baseURL: API_URL,
    timeout: 20_000,
    validateStatus: (s) => s >= 200 && s < 300,
    // Same proxy workaround as scripts/fetch-drep-avatars.js: gzip responses
    // can arrive truncated over HTTP/1.1, identity avoids the ECONNRESET.
    headers: { 'Accept-Encoding': 'identity' },
  });
  const getJson = async (p) => (await api.get(p)).data;
  const result = await runUpdate({ getJson, readSnapshot: readSnapshotFile, writeSnapshot: writeSnapshotFile });
  if (result.status === 'current') {
    console.log(`Snapshot already covers epoch ${result.snapshot.updatedEpoch}, nothing to do.`);
  } else {
    console.log(`Wrote ${result.snapshot.epochs.length} donation epochs up to epoch ${result.snapshot.updatedEpoch}.`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(`Aborted, snapshot unchanged: ${err.message}`);
    process.exit(1);
  });
}
