// src/pages/insights/index.js
// Auto-discovers insight pages under /src/pages/insights/** and renders cards
// Supports MDX front matter and JS/TSX exported `meta` object
// Each page image is expected at /img/insights/${meta.pageName}.png

import React, {useMemo, useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import SpacerBox from "@site/src/components/Layout/SpacerBox";

// Discover all MD/MDX/JS/TSX pages under /insights (Webpack)
const req = require.context('./', true, /\.(md|mdx|js|jsx|ts|tsx)$/);
const modules = Object.fromEntries(req.keys().map((key) => [key, req(key)]));

function toPermalink(filePath) {
  const cleaned = filePath
    .replace(/^\.\//, '')
    .replace(/\.(md|mdx|js|jsx|ts|tsx)$/, '')
    .replace(/index$/, '');
  const slug = cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
  return `/insights/${slug}`;
}

function extractMeta(entry) {
  const [filePath, mod] = entry;
  const fm = mod?.frontMatter ?? mod?.attributes ?? null;
  const jsMeta = mod?.insightMeta ?? mod?.meta ?? null;

  const title = jsMeta?.pageTitle ?? jsMeta?.title ?? fm?.title ?? 'Untitled insight';
  const description = jsMeta?.pageDescription ?? jsMeta?.description ?? fm?.description ?? '';
  const dateStr = jsMeta?.date ?? fm?.date ?? null;
  const dateMs = dateStr ? Date.parse(dateStr) : NaN;

  let imagePath = jsMeta?.og?.image ?? jsMeta?.image ?? fm?.image ?? null;
  if (!imagePath && jsMeta?.pageName) {
    imagePath = `/img/insights/${jsMeta.pageName}.png`;
  }

  const tags = (jsMeta?.tags ?? fm?.tags ?? []).map(String);
  const indexed = Boolean(jsMeta?.indexed ?? fm?.indexed ?? false);
  const permalinkPath = toPermalink(filePath);

  if (permalinkPath === '/insights' || permalinkPath === '/insights/') return null;

  return {
    key: filePath,
    title,
    description,
    imagePath,
    tags,
    indexed,
    permalinkPath,
    dateStr,
    dateMs,
  };
}

function uniqueTags(items) {
  const set = new Set();
  items.forEach(i => i?.tags?.forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function InsightCard({item}) {
  const imageUrl = item.imagePath ? useBaseUrl(item.imagePath) : null;
  return (
    <article className="insight-row insight-grid">
      <div className="insight-title-wrap">
        <h2 className="insight-title">
          <Link to={item.permalinkPath}>{item.title}</Link>
        </h2>
      </div>
      {imageUrl && (
        <Link to={item.permalinkPath} className="insight-thumb" aria-label={`Open ${item.title}`}>
          <img src={imageUrl} alt="" />
        </Link>
      )}
      {item.tags?.length > 0 && (
        <div className="insight-tags">
          {item.tags.map((t) => (
            <span key={t} className="insight-tag">{t}</span>
          ))}
        </div>
      )}
      {item.description && <p className="insight-desc">{item.description}</p>}
      <div className="insight-cta">
        <Link className="insight-link" to={item.permalinkPath}>Open insight →</Link>
      </div>
    </article>
  );
}

export default function InsightsIndex() {
  const allItems = useMemo(() => {
    const entries = Object.entries(modules);
    const cards = entries.map(extractMeta).filter(Boolean).filter((i) => i.indexed);
    const key = (x) => (Number.isFinite(x.dateMs) ? x.dateMs : -Infinity);
    return cards.sort((a, b) => key(b) - key(a) || a.title.localeCompare(b.title));
  }, []);

  const allTags = useMemo(() => uniqueTags(allItems), [allItems]);
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState(new Set());
  const [page, setPage] = useState(0);
  const PER_PAGE = 5;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter((item) => {
      const matchesQuery = !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));
      const matchesTags = activeTags.size === 0 || item.tags.some(t => activeTags.has(t));
      return matchesQuery && matchesTags;
    });
  }, [allItems, query, activeTags]);

  useEffect(() => { setPage(0); }, [query, activeTags]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const start = page * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);

  function toggleTag(tag) {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  }

  return (
    <Layout
      title="Insights"
      description="Explore interactive Cardano insights across governance, staking, consensus, economics, and more."
    >
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
            <p className="text-base opacity-80">
              Insight pages present specific Cardano topics neutrally, connect you to deeper resources, and are powered by on‑chain or regularly refreshed data. Each page explains the subject with clear sentences and visual charts—built for the wider Cardano community to understand a topic better.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="search"
              placeholder="Search insights..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border rounded-xl px-3 py-2 w-72 max-w-full"
              aria-label="Search insights"
            />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const active = activeTags.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full border text-sm transition ${active ? 'bg-gray-200' : 'bg-transparent'}`}
                  aria-pressed={active}
                >
                  {tag}
                </button>
              );
            })}
            {activeTags.size > 0 && (
              <button
                onClick={() => setActiveTags(new Set())}
                className="px-3 py-1 rounded-full border text-sm"
              >
                Clear
              </button>
            )}
          </div>
        )}

        <div className="insights-list">
          {pageItems.map((item) => (
            <InsightCard key={item.key} item={item} />
          ))}
        </div>

        {filtered.length > PER_PAGE && (
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-3 py-1 rounded-full border text-sm"
              disabled={page === 0}
              aria-label="Previous page"
            >
              ← Prev
            </button>
            <div className="text-sm opacity-80">
              Page {page + 1} of {totalPages}
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="px-3 py-1 rounded-full border text-sm"
              disabled={page >= totalPages - 1}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="opacity-70 mt-8">No insights matched your filters.</p>
        )}
        <SpacerBox size="medium" />
      </main>
    </Layout>
  );
}
