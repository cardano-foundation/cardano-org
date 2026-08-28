#!/usr/bin/env node
// Validates quiz source JSON files and checks that generated translate()
// modules are in sync with their sources. Runs as part of `yarn test`.
const fs = require('fs');
const path = require('path');
const { renderModule } = require('./generate-quiz-modules');

const QUIZ_DIR = path.join(__dirname, '..', 'src', 'data', 'quiz');
const GEN_DIR = path.join(QUIZ_DIR, 'generated');
const ALLOWED_SOURCE_HOSTS = [
  'cardano.org',
  'docs.cardano.org',
  'developers.cardano.org',
  'cips.cardano.org',
  'roadmap.cardano.org',
  'cardanofoundation.org',
];
const TYPOGRAPHIC_DASH = /[–—―]|&mdash;|&ndash;|&#8212;|&#8211;|&#x2014;|&#x2013;/i;
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const SLUG_RE = /^[a-z][a-z0-9-]*$/;

const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const files = fs.readdirSync(QUIZ_DIR).filter((f) => f.endsWith('.json'));
if (files.length === 0) fail('src/data/quiz', 'no quiz source files found');

for (const file of files) {
  let quiz;
  try {
    quiz = JSON.parse(fs.readFileSync(path.join(QUIZ_DIR, file), 'utf8'));
  } catch (e) {
    fail(file, `invalid JSON: ${e.message}`);
    continue;
  }
  const strings = [];

  if (!SLUG_RE.test(quiz.id || '')) fail(file, 'id must be a lowercase slug');
  if (`${quiz.id}.json` !== file) fail(file, 'id must match filename');
  if (!quiz.title) fail(file, 'missing title');
  if (!quiz.description) fail(file, 'missing description');
  if (!DIFFICULTIES.includes(quiz.difficulty)) fail(file, `difficulty must be one of ${DIFFICULTIES.join(', ')}`);
  if (!Number.isInteger(quiz.questionCount) || quiz.questionCount < 1) fail(file, 'questionCount must be a positive integer');
  if (!Array.isArray(quiz.questions)) { fail(file, 'questions must be an array'); continue; }
  if (quiz.questions.length < quiz.questionCount * 2) {
    fail(file, `pool of ${quiz.questions.length} is smaller than 2x questionCount (${quiz.questionCount})`);
  }
  strings.push(quiz.title, quiz.description);

  const questionIdRe = new RegExp(`^${quiz.id}-\\d+$`);
  const seenIds = new Set();
  const seenTexts = new Set();
  quiz.questions.forEach((q, i) => {
    const where = `question ${i + 1} (${q.id || 'no id'})`;
    if (!questionIdRe.test(q.id || '')) fail(file, `${where}: id must match ${quiz.id}-<number>`);
    if (seenIds.has(q.id)) fail(file, `${where}: duplicate id`);
    seenIds.add(q.id);
    if (!q.question) fail(file, `${where}: missing question text`);
    if (seenTexts.has(q.question)) fail(file, `${where}: duplicate question text`);
    seenTexts.add(q.question);
    if (!Array.isArray(q.options) || q.options.length < 3 || q.options.length > 4) {
      fail(file, `${where}: needs 3 to 4 options`);
    }
    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer >= (q.options || []).length) {
      fail(file, `${where}: correctAnswer out of range`);
    }
    if (!q.explanation || q.explanation.length < 30) fail(file, `${where}: explanation missing or too short`);
    let host = null;
    try { host = new URL(q.sourceUrl).hostname.replace(/^www\./, ''); } catch (e) { /* handled below */ }
    if (!host || !ALLOWED_SOURCE_HOSTS.includes(host)) fail(file, `${where}: sourceUrl missing or host not allowed (${q.sourceUrl})`);
    strings.push(q.question, q.explanation, ...(q.options || []));
  });

  for (const s of strings) {
    if (typeof s === 'string' && TYPOGRAPHIC_DASH.test(s)) fail(file, `typographic dash found in: "${s.slice(0, 60)}"`);
  }

  const genPath = path.join(GEN_DIR, `${quiz.id}.js`);
  if (!fs.existsSync(genPath)) {
    fail(file, 'generated module missing, run: yarn build-quiz');
  } else if (fs.readFileSync(genPath, 'utf8') !== renderModule(quiz)) {
    fail(file, 'generated module out of sync, run: yarn build-quiz');
  }
}

if (errors.length) {
  console.error(`check-quiz: ${errors.length} problem(s)`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`check-quiz: ${files.length} quiz file(s) OK`);
