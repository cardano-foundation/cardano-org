import impactData from "@site/src/data/ambassadorsImpact.json";

const FALLBACK = "Other";

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
