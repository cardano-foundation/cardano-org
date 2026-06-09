import impactData from "@site/src/data/ambassadorsImpact.json";

const FALLBACK = "Other";
export const PLACEHOLDER = "SOON...";

export function present(value) {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed.length > 0 && trimmed !== PLACEHOLDER;
}

export function getLanguageForCountry(country) {
  if (!country) return FALLBACK;
  return impactData.countryToLanguage?.[country] || FALLBACK;
}

export function deriveAvailableLanguages(ambassadors) {
  const set = new Set();
  ambassadors.forEach((a) => set.add(getLanguageForCountry(a.country)));
  return Array.from(set).sort((a, b) => {
    if (a === FALLBACK) return 1;
    if (b === FALLBACK) return -1;
    return a.localeCompare(b);
  });
}

export function ambassadorContributions(ambassador) {
  return (ambassador.areasOfContribution || "")
    .split(",")
    .map((s) => s.trim())
    .filter(present);
}

export function deriveAvailableContributions(ambassadors) {
  const set = new Set();
  ambassadors.forEach((a) => ambassadorContributions(a).forEach((v) => set.add(v)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
