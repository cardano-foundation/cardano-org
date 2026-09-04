// Lovelace amounts arrive from Koios as decimal strings. The total ada supply
// (45 billion ada, 4.5e16 lovelace) exceeds Number.MAX_SAFE_INTEGER, so every
// arithmetic step here stays in BigInt.
const LOVELACE_PER_ADA = 1000000n;
const CENT_DIVISOR = 10000n;

// Only a non-negative decimal integer (string, bigint or safe integer) is a
// lovelace amount. Anything else is null so callers keep "unknown" instead
// of rendering a corrupt value as zero.
export function parseLovelace(value) {
  if (typeof value === 'bigint') return value >= 0n ? value : null;
  if (typeof value === 'number') return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : null;
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!/^[0-9]+$/.test(text)) return null;
  return BigInt(text);
}

export function isPositiveLovelace(value) {
  const n = parseLovelace(value);
  return n !== null && n > 0n;
}

// Whole ada with thousands separators, then two truncated decimals.
export function formatAda(value, locale = 'en') {
  const n = parseLovelace(value) ?? 0n;
  const whole = n / LOVELACE_PER_ADA;
  const cents = (n % LOVELACE_PER_ADA) / CENT_DIVISOR;
  const parts = new Intl.NumberFormat(locale).formatToParts(1.5);
  const decimal = parts.find((p) => p.type === 'decimal')?.value ?? '.';
  return `${new Intl.NumberFormat(locale).format(whole)}${decimal}${String(cents).padStart(2, '0')}`;
}

// Whole ada with grouping and no fraction (pool fees, deposits). null for
// anything parseLovelace rejects so callers can show "unknown".
export function formatAdaWhole(value, locale = 'en') {
  const n = parseLovelace(value);
  if (n === null) return null;
  return new Intl.NumberFormat(locale).format(n / LOVELACE_PER_ADA);
}

// "6.63M" style for stake-sized values, whole ada below 10k. Arithmetic
// stays in BigInt, only the final short mantissa becomes a Number.
export function formatAdaCompact(value, locale = 'en') {
  const n = parseLovelace(value);
  if (n === null) return null;
  const ada = n / LOVELACE_PER_ADA;
  const twoDigits = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (ada >= 1000000000n) return `${twoDigits.format(Number(ada / 10000000n) / 100)}B`;
  if (ada >= 1000000n) return `${twoDigits.format(Number(ada / 10000n) / 100)}M`;
  if (ada >= 10000n) return `${new Intl.NumberFormat(locale).format(Math.round(Number(ada) / 1000))}k`;
  return new Intl.NumberFormat(locale).format(ada);
}
