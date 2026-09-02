// Shared helpers for the wallet transaction flows (DRepDelegate, TreasuryDonate).
// Pure, UI- and i18n-neutral: address formatting, error normalization, and the
// constants both flows use to talk to Mainnet and link to the explorer.

export const EXPECTED_NETWORK_ID = 1; // mainnet
export const EXPLORER_TX_BASE = "https://explorer.cardano.org/transaction/";

export function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 12)}…${addr.slice(-8)}`;
}

// Flatten an unknown thrown value (Error, CIP-30 object, string) into one string.
export function stringifyError(err) {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message || err.toString();
  const parts = [];
  if (err.message) parts.push(String(err.message));
  if (err.info) parts.push(String(err.info));
  if (err.code != null) parts.push(`code=${err.code}`);
  if (!parts.length) {
    try { return JSON.stringify(err); } catch { return String(err); }
  }
  return parts.join(" · ");
}

// Classify an error for user-facing messaging. The stakeNotRegistered case only
// arises in the delegation flow; its message never matches in the treasury flow,
// so this stays safe to share.
export function classifyError(err) {
  const msg = stringifyError(err);
  if (/StakeKeyNotRegistered|StakeNotRegistered/i.test(msg)) return "stakeNotRegistered";
  // CIP-30 signTx throws code 2 for UserDeclined; submitTx code 2 means Failure.
  // Only classify as cancel when the message corroborates it.
  if (/user\s*(declined|rejected|cancel)|declined\s*by\s*user|rejected\s*by\s*user/i.test(msg)) {
    return "userCancelled";
  }
  return "generic";
}
