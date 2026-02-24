#!/usr/bin/env node

// Fetches top translation contributors from Crowdin Reports API and writes
// them to src/data/top-translators.json for use on the /translations page.
//
// Usage:
//   CROWDIN_PROJECT_ID=xxx CROWDIN_PERSONAL_TOKEN=xxx node scripts/fetch-crowdin-contributors.js

const fs = require("fs");
const path = require("path");

const PROJECT_ID = process.env.CROWDIN_PROJECT_ID;
const TOKEN = process.env.CROWDIN_PERSONAL_TOKEN;
const OUTPUT = path.join(__dirname, "..", "src", "data", "top-translators.json");

const API_BASE = `https://api.crowdin.com/api/v2/projects/${PROJECT_ID}`;
const HEADERS = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40;

if (!PROJECT_ID || !TOKEN) {
  console.error("Missing CROWDIN_PROJECT_ID or CROWDIN_PERSONAL_TOKEN env vars");
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateReport() {
  const res = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      name: "top-members",
      schema: {
        unit: "words",
        format: "json",
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Failed to generate report (${res.status}): ${body}`);
    process.exit(1);
  }

  const json = await res.json();
  return json.data.identifier;
}

async function pollReport(reportId) {
  for (let i = 0; i < MAX_POLLS; i++) {
    const res = await fetch(`${API_BASE}/reports/${reportId}`, {
      headers: HEADERS,
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Failed to check report status (${res.status}): ${body}`);
      process.exit(1);
    }

    const json = await res.json();
    const status = json.data.status;

    if (status === "finished") {
      return reportId;
    }

    console.log(`Report status: ${status} – waiting…`);
    await sleep(POLL_INTERVAL_MS);
  }

  console.error("Report generation timed out");
  process.exit(1);
}

async function getDownloadUrl(reportId) {
  const res = await fetch(`${API_BASE}/reports/${reportId}/download`, {
    headers: HEADERS,
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Failed to get download URL (${res.status}): ${body}`);
    process.exit(1);
  }

  const json = await res.json();
  return json.data.url;
}

async function downloadReport(url) {
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`Failed to download report (${res.status})`);
    process.exit(1);
  }

  return res.json();
}

async function main() {
  console.log("Generating top-members report…");
  const reportId = await generateReport();
  console.log(`Report ID: ${reportId}`);

  console.log("Waiting for report to finish…");
  await pollReport(reportId);

  console.log("Downloading report…");
  const downloadUrl = await getDownloadUrl(reportId);
  const raw = await downloadReport(downloadUrl);

  // Crowdin wraps the report in { data: [...] } — unwrap if needed
  const members = Array.isArray(raw) ? raw : Array.isArray(raw.data) ? raw.data : [];

  if (members.length === 0) {
    console.warn("Warning: report contained no member entries. Response keys:", Object.keys(raw));
  }

  // Exclude bot/org accounts from the leaderboard
  const EXCLUDED_USERS = ["cardanofoundation"];

  const contributors = members
    .filter((member) => (member.translated || 0) > 0)
    .filter((member) => {
      const username = member.user?.username || "";
      return !EXCLUDED_USERS.includes(username.toLowerCase());
    })
    .sort((a, b) => b.translated - a.translated)
    .slice(0, 10)
    .map((member, i) => ({
      rank: i + 1,
      user: member.user?.fullName || member.user?.username || "Unknown",
      avatarUrl: member.user?.avatarUrl || null,
      languages: (member.languages || []).map((l) => l.name || l.id),
      translated: member.translated || 0,
      approved: member.approved || 0,
    }));

  const output = {
    lastUpdated: new Date().toISOString(),
    contributors,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + "\n");
  console.log(`Wrote ${contributors.length} contributors to ${OUTPUT}`);
}

main();
