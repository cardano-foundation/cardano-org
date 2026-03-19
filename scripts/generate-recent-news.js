//
// Generates recentNews.json from blog post frontmatter for use on the homepage
// and other pages. Similar to generate-authors-json.js but for news data.
// Command: yarn run build-news
//

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const blogDir = path.join(__dirname, '../blog');
const outputPath = path.join(__dirname, '../src/data/recentNews.json');
const authorsPath = path.join(__dirname, '../blog/authors.yml');

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
    authors: resolveAuthors(frontmatter.authors),
    tags: frontmatter.tags || [],
  });
}

fs.writeFileSync(outputPath, JSON.stringify(recentNews, null, 2));
console.log(`✅ Generated recentNews.json with ${recentNews.length} posts`);
