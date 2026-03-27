import { SortedShowcases } from "../data/apps";

// Extract wallet entries that have walletFeatures defined
export function getWallets(showcases = SortedShowcases) {
  return showcases.filter(
    (app) => app.tags.includes("wallet") && app.walletFeatures
  );
}

// Filter wallets by selected criteria
// Platforms: OR logic (wallet available on ANY selected platform)
// Features: AND logic (wallet must support ALL selected features)
// Custody, type, open source: exact match
export function filterWallets(wallets, { platforms = [], features = [], custody = null, type = null, openSource = null }) {
  return wallets.filter((wallet) => {
    const wf = wallet.walletFeatures;

    if (platforms.length > 0 && !platforms.some((p) => wf.platforms.includes(p))) {
      return false;
    }

    if (features.length > 0 && !features.every((f) => wf.features.includes(f))) {
      return false;
    }

    if (custody && wf.custody !== custody) {
      return false;
    }

    if (type && wf.type !== type) {
      return false;
    }

    if (openSource === true && !wallet.tags.includes("opensource")) {
      return false;
    }

    return true;
  });
}

// Filter wallets for beginner mode
// Mobile: wallets with easy-setup feature + mobile platforms
// Desktop: favorite wallets + browser/desktop platforms
export function getBeginnerWallets(wallets, platform) {
  if (platform === "mobile") {
    return wallets.filter((w) => {
      const wf = w.walletFeatures;
      return (
        wf.features.includes("easy-setup") &&
        wf.platforms.some((p) => p === "ios" || p === "android")
      );
    });
  }
  if (platform === "desktop") {
    return wallets.filter((w) => {
      const wf = w.walletFeatures;
      return (
        w.tags.includes("favorite") &&
        wf.platforms.some((p) => p === "browser" || p === "desktop")
      );
    });
  }
  return wallets;
}
