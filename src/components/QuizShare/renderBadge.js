import {translate} from '@docusaurus/Translate';

// Canvas-based generator for the shareable quiz result badge (direction B,
// the score-card design). Framework-free on purpose: no React, no hooks,
// so it stays a plain function that can be called from anywhere a canvas
// is available and tested in isolation from the UI.
//
// The SVG mockup this mirrors cannot be rasterized directly: fonts inside a
// blob SVG do not resolve when drawn through an <img> onto a canvas, so
// every element here is drawn with the Canvas 2D API instead, matching the
// mockup's coordinates and proportions by hand.
//
// Colors below are literal hex values copied from the approved design file
// (b1-silver-quiz-result.svg / b2-gold.svg), not design tokens: this canvas
// produces an exported image, not themed UI, so it is exempt from the
// --site-* token rule that applies to on-page CSS.

const SIZE = 1080;
const BG = '#f7f9ff';
const BRAND_BLUE = '#0033ad';
const GREY_TEXT = '#5a6478';
const DOT_EMPTY_STROKE = '#b9c4dd';
const DIVIDER = '#d9dfec';
const TIER_INK = '#1b2333';

const TIER_GRADIENTS = {
  gold: ['#eccf6e', '#b8901f'],
  silver: ['#dde4ee', '#8e9aab'],
  bronze: ['#dda06e', '#8f5430'],
};

const LEFT = 80;
const RIGHT = 1000; // matches the divider's right end in the mockup

const STARBURST = {x: 80, y: 84, width: 86, height: 80};
const BRAND_TEXT = {x: 196, y: 140, size: 40, weight: 700};
const TITLE_TEXT = {x: 86, y: 252, size: 40, weight: 400, maxSize: 40, minSize: 24};
const SCORE_TEXT = {x: 74, y: 600, size: 360, weight: 900, spacing: -8, minSize: 160};
const DOTS = {startX: 106, y: 710, radius: 26, gap: 76, strokeWidth: 6};
const PILL = {x: 80, y: 800, height: 88, size: 44, weight: 900, spacing: 4, paddingX: 56};
const DIVIDER_Y = 952;
const FOOTER_TEXT = {y: 1010, size: 28, weight: 400};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

// Requests every weight the badge draws in. Without this, canvas silently
// falls back to a default system face instead of the self-hosted Chivo
// variable font, even after document.fonts.ready has resolved.
async function ensureFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return;
  await Promise.all([
    document.fonts.load(`${BRAND_TEXT.weight} ${BRAND_TEXT.size}px Chivo`),
    document.fonts.load(`${TITLE_TEXT.weight} ${TITLE_TEXT.size}px Chivo`),
    document.fonts.load(`${SCORE_TEXT.weight} ${SCORE_TEXT.size}px Chivo`),
    document.fonts.load(`${PILL.weight} ${PILL.size}px Chivo`),
    document.fonts.load(`${FOOTER_TEXT.weight} ${FOOTER_TEXT.size}px Chivo`),
  ]);
  await document.fonts.ready;
}

// Sums per-character advances instead of relying on the still-patchy
// CSS-Canvas letterSpacing property, so tracked text measures and draws
// consistently across browsers.
function trackedWidth(ctx, text, spacing) {
  const chars = [...text];
  const advance = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width, 0);
  return advance + spacing * Math.max(0, chars.length - 1);
}

function drawTrackedText(ctx, text, x, y, spacing) {
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
}

// Shrinks a font size until the text fits maxWidth, never going below
// minSize. Guards against long quiz titles or unexpectedly wide scores
// overflowing the fixed canvas.
function fitFontSize(ctx, text, {weight, size, minSize}, maxWidth, spacing = 0) {
  let current = size;
  while (current > minSize) {
    ctx.font = `${weight} ${current}px Chivo, sans-serif`;
    const width = spacing ? trackedWidth(ctx, text, spacing) : ctx.measureText(text).width;
    if (width <= maxWidth) return current;
    current -= 2;
  }
  ctx.font = `${weight} ${minSize}px Chivo, sans-serif`;
  return minSize;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
  }
  ctx.closePath();
}

export async function renderBadgePng({
  quizTitle,
  results,
  score,
  total,
  tierKey,
  tierLabel,
  dateLabel,
  starburstUrl,
}) {
  await ensureFontsReady();
  const starburst = await loadImage(starburstUrl);

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // Background.
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Mark plus wordmark, top left.
  ctx.drawImage(starburst, STARBURST.x, STARBURST.y, STARBURST.width, STARBURST.height);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = BRAND_BLUE;
  ctx.font = `${BRAND_TEXT.weight} ${BRAND_TEXT.size}px Chivo, sans-serif`;
  ctx.fillText(
    translate({id: 'quiz.share.badge.brand', message: 'Cardano Quiz'}),
    BRAND_TEXT.x,
    BRAND_TEXT.y,
  );

  // Quiz title, shrinking to fit a single line if it runs long.
  ctx.fillStyle = GREY_TEXT;
  const titleMaxWidth = RIGHT - TITLE_TEXT.x;
  fitFontSize(ctx, quizTitle, TITLE_TEXT, titleMaxWidth);
  ctx.fillText(quizTitle, TITLE_TEXT.x, TITLE_TEXT.y);

  // Score, huge, tracked negative letter-spacing, shrinking if it ever
  // overflows (double-digit totals are not in today's data, but this keeps
  // the badge safe if a longer quiz is added later).
  const scoreString = `${score}/${total}`;
  const scoreMaxWidth = RIGHT - SCORE_TEXT.x;
  ctx.fillStyle = BRAND_BLUE;
  const scoreSize = fitFontSize(ctx, scoreString, SCORE_TEXT, scoreMaxWidth, SCORE_TEXT.spacing);
  ctx.font = `${SCORE_TEXT.weight} ${scoreSize}px Chivo, sans-serif`;
  drawTrackedText(ctx, scoreString, SCORE_TEXT.x, SCORE_TEXT.y, SCORE_TEXT.spacing);

  // Dot row, one per question, filled for correct, outlined for wrong, in
  // the order the questions were answered.
  for (let i = 0; i < total; i += 1) {
    const cx = DOTS.startX + i * DOTS.gap;
    ctx.beginPath();
    ctx.arc(cx, DOTS.y, DOTS.radius, 0, Math.PI * 2);
    if (results[i]) {
      ctx.fillStyle = BRAND_BLUE;
      ctx.fill();
    } else {
      ctx.strokeStyle = DOT_EMPTY_STROKE;
      ctx.lineWidth = DOTS.strokeWidth;
      ctx.stroke();
    }
  }

  // Tier pill with a metal gradient, sized to the tier word.
  const pillLabel = tierLabel.toUpperCase();
  ctx.font = `${PILL.weight} ${PILL.size}px Chivo, sans-serif`;
  const labelWidth = trackedWidth(ctx, pillLabel, PILL.spacing);
  const pillWidth = labelWidth + PILL.paddingX * 2;
  const [gradientStart, gradientEnd] = TIER_GRADIENTS[tierKey] || TIER_GRADIENTS.bronze;
  const gradient = ctx.createLinearGradient(0, PILL.y, 0, PILL.y + PILL.height);
  gradient.addColorStop(0, gradientStart);
  gradient.addColorStop(1, gradientEnd);
  drawRoundedRect(ctx, PILL.x, PILL.y, pillWidth, PILL.height, PILL.height / 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.fillStyle = TIER_INK;
  ctx.textBaseline = 'middle';
  drawTrackedText(
    ctx,
    pillLabel,
    PILL.x + (pillWidth - labelWidth) / 2,
    PILL.y + PILL.height / 2,
    PILL.spacing,
  );
  ctx.textBaseline = 'alphabetic';

  // Divider.
  ctx.strokeStyle = DIVIDER;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(LEFT, DIVIDER_Y);
  ctx.lineTo(RIGHT, DIVIDER_Y);
  ctx.stroke();

  // Footer: self-test note bottom left, date bottom right.
  ctx.fillStyle = GREY_TEXT;
  ctx.font = `${FOOTER_TEXT.weight} ${FOOTER_TEXT.size}px Chivo, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(
    translate({id: 'quiz.share.badge.footer', message: 'Self-test · cardano.org/quiz'}),
    LEFT,
    FOOTER_TEXT.y,
  );
  ctx.textAlign = 'right';
  ctx.fillText(dateLabel, RIGHT, FOOTER_TEXT.y);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob returned null'));
    }, 'image/png');
  });
}
