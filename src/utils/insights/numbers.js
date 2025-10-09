export const convertLovelacesToAda = (lovelaces) => Math.round(Number(lovelaces) / 1_000_000);

export const isNumberish = (v) => v !== null && v !== '' && !Number.isNaN(Number(v));
export const toNumber = (v) => (isNumberish(v) ? Number(v) : NaN);

// Heuristic: keys that represent monetary lovelace fields
export const LOVELACE_KEY = /(fee|fees|treasury|reward|reserves?|supply|deposit|circulation)/i;

export function toAdaIfMoney(key, v) {
  const n = toNumber(v);
  if (!Number.isFinite(n)) return v;
  return LOVELACE_KEY.test(key) ? Math.round(n / 1_000_000) : n;
}
