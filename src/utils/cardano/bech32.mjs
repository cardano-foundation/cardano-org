// Minimal bech32 (BIP-173) decoder for validating stored addresses without
// loading the Evolution SDK. Cardano addresses exceed the 90-character limit
// of the spec, so only a generous upper bound is enforced.
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
