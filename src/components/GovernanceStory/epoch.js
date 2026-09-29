import { MAINNET_LAUNCH } from "@site/src/utils/mainnetAge";

// Epoch arithmetic for the governance story. Every mainnet epoch, Byron and
// Shelley alike, is exactly five days long, so epoch n starts n * 5 days after
// the genesis block. Everything here is computed locally, no network needed.

const GENESIS = MAINNET_LAUNCH.getTime();
const EPOCH_LENGTH_MS = 5 * 24 * 60 * 60 * 1000;

export function epochInfo(now = Date.now()) {
  const k = (now - GENESIS) / EPOCH_LENGTH_MS;
  const n = Math.floor(k);
  return {
    epoch: n,
    frac: k - n,
    end: GENESIS + (n + 1) * EPOCH_LENGTH_MS,
  };
}

export function epochStart(epoch) {
  return new Date(GENESIS + epoch * EPOCH_LENGTH_MS);
}

const pad = (n) => (n < 10 ? `0${n}` : String(n));

const UNITS = { d: "d", h: "h", m: "m", s: "s" };

// "3d 9h 12m 04s" or, short, "3d 9h 12m". Pass translated unit suffixes as
// `units` ({ d, h, m, s }); English abbreviations are the default.
export function countdown(ms, short = false, units = UNITS) {
  const u = { ...UNITS, ...units };
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const head = `${d ? `${d}${u.d} ` : ""}${h}${u.h} ${pad(m)}${u.m}`;
  return short ? head : `${head} ${pad(sec)}${u.s}`;
}
