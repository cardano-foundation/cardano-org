import { Showcases, Categories } from "./apps";

// Leaderboard display info for tracked projects that are NOT in the apps directory.
//
// The transaction leaderboard (/apps/leaderboard) shows every project whose transactions
// are attributed on-chain. Projects without an entry in apps.js appear there as a gray
// "Not Listed" row with no logo and no link. This file lets such a project add a logo,
// a category, and a link to its official website, for example B2B or enterprise
// solutions without a public app, their own chains or protocols, and bridges.
//
// - apps.js comes first: if your project fits the apps directory, add it there instead.
// - Only for entries tracked via script hashes or the CIP-20 message allowlist (the
//   `appStats` array in src/data/tx-stats.json). Metadata label rows are not covered,
//   they get a logo and link only from an apps.js entry that sets `metadataLabel`.
// - An entry here changes how an already tracked project is displayed. It does not add
//   the project to the leaderboard.
// - Projects removed from the apps directory under the curation policy do not get an
//   entry here. Their transactions keep counting as a "Not Listed" row.
// - Entries are accepted and may be removed at the maintainers' discretion.
// See docs/get-involved/tx-rankings.md for the full rules.
//
// KEY: the exact `label` of the project's entry in the `appStats` array of
// src/data/tx-stats.json (or tx-stats-73epochs.json)
//
// FIELDS (all optional):
// - icon: square logo stored in /static/img/app-icons/, referenced as "/img/app-icons/<file>".
//   SVG, or PNG/WebP of at least 128x128 px. Without it the row shows a letter badge.
// - category: a category id from `Categories` in apps.js (e.g. "bridge", "notary").
//   Without it the row shows "Not Listed".
// - website: the project's official website as an absolute http(s) URL. No affiliate,
//   referral, or campaign links. Without it the row is not clickable.
//
// Example:
//   "example-protocol": {
//     icon: "/img/app-icons/example-protocol.svg",
//     category: "bridge",
//     website: "https://example.org",
//   },

export const UnlistedApps = {
  "fms-by-trivolve": {
    icon: "/img/app-icons/trivolve.jpg",
    category: "notary",
    website: "https://trivolvetech.com",
  },
  "midnight": {
    icon: "/img/app-icons/midnight.svg",
    category: "distribution",
    website: "https://midnight.network",
  },
  "5am.earth": {
    icon: "/img/app-icons/5am-earth.svg",
    category: "identity",
    website: "https://5am.earth",
  },
  "usdcx-bridge": {
    icon: "/img/stablecoins/usdcx.png",
    category: "bridge",
    website: "https://usdcx.iog.io/bridge",
  },
};

// True for a parseable absolute http(s) URL with a host and no surrounding whitespace.
export function isAbsoluteHttpUrl(value) {
  if (typeof value !== "string" || value !== value.trim()) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname !== "";
  } catch {
    return false;
  }
}

// The Showcase an appStats label belongs to, matched by statsLabel or normalized title.
// Shared by the leaderboard and the validation below so both agree on "already listed".
export function findListedShowcase(label, showcases = Showcases) {
  const normalized = label.replace(/-/g, "");
  return showcases.find(
    (app) =>
      app.statsLabel === label ||
      app.title.toLowerCase().replace(/\s+/g, "").replace(/-/g, "") === normalized
  );
}

const ALLOWED_FIELDS = new Set(["icon", "category", "website"]);

// Throws on the first invalid entry so a broken submission fails the build.
export function validateUnlistedApp(key, entry, showcases = Showcases) {
  const fail = (message) => {
    throw new Error(`leaderboard-unlisted.js "${key}": ${message}`);
  };
  if (key.startsWith("metadata-")) fail("metadata label rows are not covered by this file");
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) fail("entry must be an object");
  for (const field of Object.keys(entry)) {
    if (!ALLOWED_FIELDS.has(field)) fail(`unknown field "${field}"`);
  }
  if (entry.icon !== undefined && (typeof entry.icon !== "string" || !entry.icon.startsWith("/img/"))) {
    fail(`icon must be a path starting with "/img/", got ${JSON.stringify(entry.icon)}`);
  }
  if (entry.category !== undefined && !Categories[entry.category]) {
    fail(`unknown category ${JSON.stringify(entry.category)}, use an id from Categories in apps.js`);
  }
  if (entry.website !== undefined && !isAbsoluteHttpUrl(entry.website)) {
    fail(`website must be an absolute http(s) URL, got ${JSON.stringify(entry.website)}`);
  }
  const listed = findListedShowcase(key, showcases);
  if (listed) fail(`already listed in apps.js as "${listed.title}", remove this entry`);
}

Object.entries(UnlistedApps).forEach(([key, entry]) => validateUnlistedApp(key, entry));
