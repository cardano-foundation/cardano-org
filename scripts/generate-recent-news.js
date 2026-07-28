//
// Generates recentNews.json from blog post frontmatter for use on the homepage
// and other pages. Similar to generate-authors-json.js but for news data.
// Command: yarn run build-news
//

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const sharp = require('sharp');

const blogDir = path.join(__dirname, '../blog');
const outputPath = path.join(__dirname, '../src/data/recentNews.json');
const authorsPath = path.join(__dirname, '../blog/authors.yml');
const thumbsDir = path.join(__dirname, '../static/img/news-thumbs');
const thumbsPublicBase = '/img/news-thumbs';

// Load authors for resolving author keys
const authorsYaml = fs.readFileSync(authorsPath, 'utf8');
const authors = yaml.load(authorsYaml);

// Get blog directories sorted by date descending
const dirs = fs
  .readdirSync(blogDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{4}-\d{2}-\d{2}-/.test(d.name))
  .map((d) => d.name)
  .sort()
  .reverse();

// Extract first paragraph from markdown content (after frontmatter)
function extractDescription(content) {
  // Remove frontmatter
  const parts = content.split('---');
  if (parts.length < 3) return '';
  const body = parts.slice(2).join('---').trim();

  // Find first non-empty paragraph (skip images, HTML blocks, empty lines)
  const lines = body.split('\n');
  let paragraph = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (paragraph) break;
      continue;
    }
    // Skip images, HTML tags, and markdown links that are standalone
    if (trimmed.startsWith('![') || trimmed.startsWith('<') || trimmed.startsWith(':::')) continue;
    paragraph += (paragraph ? ' ' : '') + trimmed;
  }

  // Strip markdown formatting
  return paragraph
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // **bold** -> bold
    .replace(/\*([^*]+)\*/g, '$1') // *italic* -> italic
    .replace(/`([^`]+)`/g, '$1'); // `code` -> code
}

// Find the post banner image and, for in-post files, emit a downscaled WebP
// thumbnail under static/. Returns a web URL usable as a card thumbnail, or
// null when the post has no usable image (component falls back to default).
async function resolveThumbnail(dir, content, slug) {
  // Body after frontmatter
  const parts = content.split('---');
  const body = parts.length >= 3 ? parts.slice(2).join('---') : content;

  // First inline markdown image, e.g. ![alt](./banner.webp "title")
  const imgMatch = body.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (!imgMatch) return null;

  // Drop an optional title after the URL, and any surrounding whitespace
  const rawUrl = imgMatch[1].trim().split(/\s+/)[0];

  // Remote or already-public paths can be used as-is
  if (/^https?:\/\//.test(rawUrl)) return rawUrl;
  if (rawUrl.startsWith('/')) return rawUrl;

  // In-post relative asset: resolve on disk and emit a small WebP thumbnail
  const rel = rawUrl.replace(/^\.\//, '');
  const srcPath = path.join(blogDir, dir, rel);
  if (!fs.existsSync(srcPath)) return null;

  const destName = `${slug}.webp`;
  await sharp(srcPath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(thumbsDir, destName));
  return `${thumbsPublicBase}/${destName}`;
}

// Resolve author keys to name + imageUrl
function resolveAuthors(authorKeys) {
  if (!authorKeys) return [];
  const keys = Array.isArray(authorKeys) ? authorKeys : [authorKeys];
  return keys
    .filter((key) => authors[key])
    .map((key) => ({
      name: authors[key].name,
      imageUrl: authors[key].image_url,
    }));
}

async function main() {
  // Start from a clean thumbnails directory so stale banners don't linger
  fs.rmSync(thumbsDir, { recursive: true, force: true });
  fs.mkdirSync(thumbsDir, { recursive: true });

  const recentNews = [];

  for (const dir of dirs) {
    if (recentNews.length >= 6) break;

    const indexPath = path.join(blogDir, dir, 'index.md');
    if (!fs.existsSync(indexPath)) continue;

    const content = fs.readFileSync(indexPath, 'utf8');

    // Parse frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;

    const frontmatter = yaml.load(fmMatch[1]);

    // Extract date from directory name
    const dateMatch = dir.match(/^(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) continue;

    const slug = frontmatter.slug || dir;
    const description = frontmatter.description || extractDescription(content);

    recentNews.push({
      title: frontmatter.title,
      permalink: `/news/${slug}`,
      date: dateMatch[1],
      description,
      image: await resolveThumbnail(dir, content, slug),
      authors: resolveAuthors(frontmatter.authors),
      tags: frontmatter.tags || [],
    });
  }

  fs.writeFileSync(outputPath, JSON.stringify(recentNews, null, 2));
  console.log(`✅ Generated recentNews.json with ${recentNews.length} posts`);
}

main();
