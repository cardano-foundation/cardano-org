// Status of a pasted DRep ID that is not in the searchable pool of active,
// named DReps. Since protocol version 10 the ledger rejects vote delegation
// to a DRep that was never registered or has retired, so the tool has to
// tell these apart from DReps that only lack metadata.
//
// Koios drep_info returns no row for an ID that was never registered and
// drep_status "deregistered" for a retired DRep. Every lookup resolves to
// { status, drepId } with status 'active', 'inactive', 'unregistered',
// 'invalid' or 'unknown'. drepId is the canonical CIP-129 ID, the only form
// the wallet SDK accepts. Network failures throw.
import { decodeBech32, encodeBech32, wordsToBytes } from './bech32.mjs';

// CIP-129 header bytes. CIP-105 IDs carry no header, the prefix tells the type.
const KEY_HEADER = 0x22;
const SCRIPT_HEADER = 0x23;
const HEADERS = new Set([KEY_HEADER, SCRIPT_HEADER]);
const CREDENTIAL_BYTES = 28;
const HASH_HEX = /^[0-9a-f]{56}$/i;

const INVALID = { status: 'invalid', drepId: null };
const UNREGISTERED = { status: 'unregistered', drepId: null };
const UNKNOWN = { status: 'unknown', drepId: null };

function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.slice(i, i + 2), 16));
  return bytes;
}

function withHeader(bytes) {
  if (bytes.length !== CREDENTIAL_BYTES + 1 || !HEADERS.has(bytes[0])) return null;
  return encodeBech32('drep', bytes);
}

// The CIP-129 bech32 form of a typed DRep ID (CIP-129 bech32, CIP-105 bech32
// or CIP-129 hex), or null. A bare 28-byte hash has no type and yields null.
export function canonicalDRepId(id) {
  if (typeof id !== 'string') return null;
  if (/^[0-9a-f]+$/i.test(id)) {
    return id.length === (CREDENTIAL_BYTES + 1) * 2 ? withHeader(hexToBytes(id)) : null;
  }
  const decoded = decodeBech32(id);
  if (!decoded) return null;
  const bytes = wordsToBytes(decoded.words);
  if (!Array.isArray(bytes)) return null;
  if (decoded.hrp === 'drep') {
    if (bytes.length === CREDENTIAL_BYTES) return withHeader([KEY_HEADER, ...bytes]);
    return withHeader(bytes);
  }
  if (decoded.hrp === 'drep_script' && bytes.length === CREDENTIAL_BYTES) {
    return withHeader([SCRIPT_HEADER, ...bytes]);
  }
  return null;
}

export function classifyDRepInfo(rows) {
  if (!Array.isArray(rows)) throw new Error('drep_info returned no array');
  const row = rows[0];
  if (!row || row.drep_status !== 'registered' || !row.drep_id) return UNREGISTERED;
  return { status: row.active ? 'active' : 'inactive', drepId: row.drep_id };
}

export async function fetchDRepIdStatus(api, id) {
  let lookupId = canonicalDRepId(id);
  if (!lookupId && HASH_HEX.test(id)) {
    // A bare hash does not say whether it is a key or a script, so ask Koios
    // which registered DRep carries it. More than one match stays unresolved.
    const res = await api.get(`/drep_list?hex=eq.${id.toLowerCase()}&select=drep_id`);
    const rows = res.data;
    if (!Array.isArray(rows)) throw new Error('drep_list returned no array');
    if (rows.length === 0) return UNREGISTERED;
    if (rows.length > 1) return UNKNOWN;
    lookupId = rows[0].drep_id;
  }
  // Checked locally, the Koios proxy answers a broken checksum with a 500.
  if (!lookupId) return INVALID;
  const res = await api.post('/drep_info', { _drep_ids: [lookupId] });
  return classifyDRepInfo(res.data);
}
