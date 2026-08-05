export const convertLovelacesToAda = (lovelaces) => Math.round(Number(lovelaces) / 1_000_000);

// Format an ada amount for display, abbreviating large values (e.g. 1.2B ada).
export function formatAdaValue(value) {
  if (value == null) return "...";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B ada`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ada`;
  return `${Math.round(value).toLocaleString()} ada`;
}

export const isNumberish = (v) => v !== null && v !== '' && !Number.isNaN(Number(v));
export const toNumber = (v) => (isNumberish(v) ? Number(v) : NaN);

// Heuristic: keys that represent monetary lovelace fields
export const LOVELACE_KEY = /(fee|fees|treasury|reward|reserves?|supply|deposit|circulation)/i;

export function toAdaIfMoney(key, v) {
  const n = toNumber(v);
  if (!Number.isFinite(n)) return v;
  return LOVELACE_KEY.test(key) ? Math.round(n / 1_000_000) : n;
}

// Koios returns `withdrawal` on a TreasuryWithdrawals proposal as an array of
// {amount, stake_address} objects, one entry per recipient. Sum them up to
// get the total payout in lovelace.
export function sumWithdrawalAmounts(withdrawal) {
  if (!Array.isArray(withdrawal)) return 0;
  return withdrawal.reduce((sum, w) => {
    const n = Number(w?.amount);
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);
}
