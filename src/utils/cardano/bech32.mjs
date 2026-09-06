// Minimal bech32 (BIP-173) decoder and encoder for validating stored
// addresses without loading the Evolution SDK. Cardano addresses exceed the
// 90-character limit of the spec, so only a generous upper bound is enforced.
const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
const MAINNET = 1;

function polymod(values) {
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i += 1) {
      if ((top >>> i) & 1) chk ^= GENERATOR[i];
    }
  }
  return chk >>> 0;
}

function hrpExpand(hrp) {
  const out = [];
  for (const c of hrp) out.push(c.charCodeAt(0) >>> 5);
  out.push(0);
  for (const c of hrp) out.push(c.charCodeAt(0) & 31);
  return out;
}

export function decodeBech32(str) {
  if (typeof str !== 'string' || str.length < 8 || str.length > 130) return null;
  const lower = str.toLowerCase();
  if (str !== lower && str !== str.toUpperCase()) return null;
  const pos = lower.lastIndexOf('1');
  if (pos < 1 || pos + 7 > lower.length) return null;
  const hrp = lower.slice(0, pos);
  const data = [];
  for (const c of lower.slice(pos + 1)) {
    const v = CHARSET.indexOf(c);
    if (v === -1) return null;
    data.push(v);
  }
  if (polymod([...hrpExpand(hrp), ...data]) !== 1) return null;
  return { hrp, words: data.slice(0, -6) };
}

// The first byte of a Shelley address: type in the high nibble, network in the low nibble.
function headerByte(words) {
  return ((words[0] << 3) | (words[1] >> 2)) & 0xff;
}

export function isValidStakeAddress(str) {
  const decoded = decodeBech32(str);
  if (!decoded || decoded.hrp !== 'stake' || decoded.words.length !== 47) return false;
  const header = headerByte(decoded.words);
  const type = header >> 4;
  return (type === 0xe || type === 0xf) && (header & 0x0f) === MAINNET;
}

export function isValidBaseAddress(str) {
  const decoded = decodeBech32(str);
  if (!decoded || decoded.hrp !== 'addr' || decoded.words.length < 47) return false;
  const header = headerByte(decoded.words);
  return (header >> 4) <= 7 && (header & 0x0f) === MAINNET;
}

const POOL_HRP = 'pool';
const POOL_HASH_BYTES = 28;

function convertBits(data, from, to, pad) {
  let acc = 0;
  let bits = 0;
  const out = [];
  const maxv = (1 << to) - 1;
  for (const value of data) {
    acc = (acc << from) | value;
    bits += from;
    while (bits >= to) {
      bits -= to;
      out.push((acc >>> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) out.push((acc << (to - bits)) & maxv);
  } else if (bits >= from || ((acc << (to - bits)) & maxv)) {
    return null;
  }
  return out;
}

export function encodeBech32(hrp, bytes) {
  const data = convertBits(bytes, 8, 5, true);
  const mod = polymod([...hrpExpand(hrp), ...data, 0, 0, 0, 0, 0, 0]) ^ 1;
  const checksum = [];
  for (let p = 0; p < 6; p += 1) checksum.push((mod >>> (5 * (5 - p))) & 31);
  return `${hrp}1${[...data, ...checksum].map((i) => CHARSET[i]).join('')}`;
}

// The 5-bit words from decodeBech32 back to bytes, null when the padding
// bits are not zero.
export function wordsToBytes(words) {
  return convertBits(words, 5, 8, false);
}

function hexToBytes(hex, length) {
  if (typeof hex !== 'string' || hex.length !== length * 2 || !/^[0-9a-fA-F]+$/.test(hex)) return null;
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.slice(i, i + 2), 16));
  return bytes;
}

// A bech32 pool id: hrp "pool" over a 28-byte key hash with a valid checksum.
export function isValidPoolId(str) {
  const decoded = decodeBech32(str);
  if (!decoded || decoded.hrp !== POOL_HRP) return false;
  const bytes = wordsToBytes(decoded.words);
  return Array.isArray(bytes) && bytes.length === POOL_HASH_BYTES;
}

// The 28-byte key hash of a bech32 pool id as lowercase hex, null when the
// id is not a valid pool id. PoolTool addresses pools by this hex form.
export function poolIdToHex(str) {
  const decoded = decodeBech32(str);
  if (!decoded || decoded.hrp !== POOL_HRP) return null;
  const bytes = wordsToBytes(decoded.words);
  if (!Array.isArray(bytes) || bytes.length !== POOL_HASH_BYTES) return null;
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function poolIdFromHex(hex) {
  const bytes = hexToBytes(hex, POOL_HASH_BYTES);
  return bytes ? encodeBech32(POOL_HRP, bytes) : null;
}

// CIP-30 getRewardAddresses() returns 29-byte hex: one header byte (type
// nibble 0xe key or 0xf script, network nibble 0 testnet or 1 mainnet) plus
// the 28-byte credential hash. Only those two header types are reward
// addresses, anything else is rejected.
export function rewardAddressFromHex(hex) {
  const bytes = hexToBytes(hex, POOL_HASH_BYTES + 1);
  if (!bytes) return null;
  const type = bytes[0] >>> 4;
  const network = bytes[0] & 0x0f;
  if ((type !== 0xe && type !== 0xf) || (network !== 0 && network !== MAINNET)) return null;
  return encodeBech32(network === MAINNET ? 'stake' : 'stake_test', bytes);
}
