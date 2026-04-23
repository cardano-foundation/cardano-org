#!/usr/bin/env node

// Fetches translation progress from Crowdin API and writes it to
// src/data/translation-progress.json for use on the /translations page.
//
// Usage:
//   CROWDIN_PROJECT_ID=xxx CROWDIN_PERSONAL_TOKEN=xxx node scripts/fetch-crowdin-progress.js

const fs = require("fs");
const path = require("path");

const PROJECT_ID = process.env.CROWDIN_PROJECT_ID;
const TOKEN = process.env.CROWDIN_PERSONAL_TOKEN;
const OUTPUT = path.join(__dirname, "..", "src", "data", "translation-progress.json");

if (!PROJECT_ID || !TOKEN) {
  console.error("Missing CROWDIN_PROJECT_ID or CROWDIN_PERSONAL_TOKEN env vars");
  process.exit(1);
}

async function fetchProgress() {
  const url = `https://api.crowdin.com/api/v2/projects/${PROJECT_ID}/languages/progress?limit=100`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Crowdin API error ${res.status}: ${body}`);
    process.exit(1);
  }

  const json = await res.json();

  const languages = json.data.map((entry) => {
    const d = entry.data;
    return {
      id: d.languageId,
      name: d.language?.name || d.languageId,
      translationProgress: d.translationProgress,
      approvalProgress: d.approvalProgress,
      words: d.words,
      phrases: d.phrases,
    };
  });

  // Sort by translation progress descending
  languages.sort((a, b) => b.translationProgress - a.translationProgress);

  const output = {
    lastUpdated: new Date().toISOString(),
    languages,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + "\n");
  console.log(`Wrote ${languages.length} languages to ${OUTPUT}`);
}

fetchProgress();
