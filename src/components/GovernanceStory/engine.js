// Canvas engine for the governance story.
//
// One pool of particles is re-targeted into a new picture ("scene") whenever
// the reader scrolls into another chapter. Colors come from the site's design
// tokens and follow the light and dark theme; every string it draws comes from
// labels.js so it can be translated. Browser only: create it in an effect.
//
// DOM contract (all inside `root`):
//   [data-scene]       a chapter; its value names the scene to show
//   [data-anchor]      optional element inside a chapter that triggers it
//   [data-story-card]  a chapter card; used to keep the picture clear of text

import { DEFAULT_SEATS, storyCounts } from "@site/src/data/governanceStory";

// Enough particles for the busiest scene (your vote, about 2,330 dots wide).
const N = 2400;
// Site breakpoints: 996px is the primary one (navbar collapse), 768px tablet.
const BP_WIDE = 996;
const BP_NARROW = 768;
const TAU = Math.PI * 2;

const PALETTE = [
  ["brand", "--ifm-color-primary"],
  ["drep", "--site-role-drep"],
  ["spo", "--site-role-pool"],
  ["cc", "--site-role-committee"],
  ["fund", "--site-role-funding"],
  ["yes", "--site-vote-yes"],
  ["no", "--site-vote-no"],
  ["abstain", "--site-vote-abstain"],
  ["pmuted", "--ifm-color-emphasis-400"],
  ["ink", "--ifm-color-emphasis-900"],
  ["ink2", "--ifm-color-emphasis-800"],
  ["muted", "--ifm-color-emphasis-700"],
  ["bg", "--ifm-background-color"],
];
const K = {};
PALETTE.forEach((d, i) => {
  K[d[0]] = i;
});

function rnd(i, k) {
  const x = Math.sin(i * 127.1 + k * 311.7 + 0.5) * 43758.5453;
  return x - Math.floor(x);
}
function phyllo(k, n, cx, cy, rad) {
  const r = rad * Math.sqrt((k + 0.5) / n);
  const th = k * 2.399963;
  return [cx + r * Math.cos(th), cy + r * Math.sin(th)];
}
function bez(t, a, c, b) {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
}
function L(t, x, y, o) {
  return { t, x, y, ...o };
}
function fill(str, vars) {
  return str.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
}
function parseRgb(s) {
  const m = String(s || "").match(/[\d.]+/g);
  if (!m || m.length < 3) return null;
  const a = m.length > 3 ? +m[3] : 1;
  return a === 0 ? null : [+m[0], +m[1], +m[2]];
}

/* ---------- shapes ---------- */

// A key with its bow centered on (bx, by); (ux, uy) points from the bow to the tip.
function keyPts(n, bx, by, ux, uy, len, rb, w) {
  const pts = [];
  const nx = -uy;
  const ny = ux;
  const nR = Math.floor(n * 0.42);
  const nSh = Math.floor(n * 0.33);
  const nT = n - nR - nSh;
  for (let k = 0; k < nR; k++) {
    const th = (k / nR) * TAU;
    const rr = rb * (k % 2 ? 0.62 : 1);
    pts.push([bx + Math.cos(th) * rr, by + Math.sin(th) * rr]);
  }
  const hs = Math.ceil(nSh / 2);
  for (let k = 0; k < nSh; k++) {
    const lane = k % 2;
    const u = Math.floor(k / 2) / Math.max(1, hs - 1);
    const s = rb + u * (len - rb);
    const off = (lane - 0.5) * w;
    pts.push([bx + ux * s + nx * off, by + uy * s + ny * off]);
  }
  const teeth = [
    [0.64, 0.85],
    [0.79, 0.5],
    [0.93, 1],
  ];
  const per = Math.floor(nT / 3);
  for (let j = 0; j < 3; j++) {
    const cnt = j === 2 ? nT - 2 * per : per;
    const hc = Math.ceil(cnt / 2);
    for (let k = 0; k < cnt; k++) {
      const ln = k % 2;
      const u2 = Math.floor(k / 2) / Math.max(1, hc - 1);
      const s2 = teeth[j][0] * len + (ln - 0.5) * w * 0.9;
      const off2 = w / 2 + u2 * teeth[j][1] * rb * 0.9;
      pts.push([bx + ux * s2 + nx * off2, by + uy * s2 + ny * off2]);
    }
  }
  return pts;
}

// A document with its top-left corner at (x, y): an outline, then text lines.
// The third value is 1 for text dots.
function docPts(n, x, y, w, h, nLines) {
  const pts = [];
  const nO = Math.floor(n * 0.6);
  const per = 2 * (w + h);
  for (let k = 0; k < nO; k++) {
    const d = (k / nO) * per;
    if (d < w) pts.push([x + d, y, 0]);
    else if (d < w + h) pts.push([x + w, y + d - w, 0]);
    else if (d < 2 * w + h) pts.push([x + w - (d - w - h), y + h, 0]);
    else pts.push([x, y + h - (d - 2 * w - h), 0]);
  }
  const nT = n - nO;
  const perLine = Math.floor(nT / nLines);
  for (let l = 0; l < nLines; l++) {
    const cnt = l === nLines - 1 ? nT - perLine * (nLines - 1) : perLine;
    const lf = l === 0 ? 0.6 : l === nLines - 1 ? 0.5 : 0.9;
    const ly = y + h * (0.2 + (l * 0.6) / Math.max(1, nLines - 1));
    for (let k = 0; k < cnt; k++) pts.push([x + w * 0.18 + (k / Math.max(1, cnt - 1)) * w * 0.64 * lf, ly, 1]);
  }
  return pts;
}

// A rectangle centered on the origin, as n dots spaced evenly along its edge.
// Corners are rounded with radius rad; 0 keeps them square.
function roundRectPts(n, w, h, rad) {
  const a = w / 2 - rad;
  const b = h / 2 - rad;
  const q = (TAU / 4) * rad;
  const ang = (s) => (rad ? s / rad : 0);
  // Clockwise from the left end of the top edge: edge, corner, edge, corner...
  const segs = [
    [2 * a, (s) => [-a + s, -h / 2]],
    [q, (s) => [a + rad * Math.sin(ang(s)), -b - rad * Math.cos(ang(s))]],
    [2 * b, (s) => [w / 2, -b + s]],
    [q, (s) => [a + rad * Math.cos(ang(s)), b + rad * Math.sin(ang(s))]],
    [2 * a, (s) => [a - s, h / 2]],
    [q, (s) => [-a - rad * Math.sin(ang(s)), b + rad * Math.cos(ang(s))]],
    [2 * b, (s) => [-w / 2, b - s]],
    [q, (s) => [-a - rad * Math.cos(ang(s)), -b - rad * Math.sin(ang(s))]],
  ];
  const per = segs.reduce((sum, g) => sum + g[0], 0);
  const pts = [];
  let g = 0;
  let start = 0;
  for (let k = 0; k < n; k++) {
    const d = (k / n) * per;
    while (g < segs.length - 1 && d > start + segs[g][0]) {
      start += segs[g][0];
      g++;
    }
    pts.push(segs[g][1](d - start));
  }
  return pts;
}

// A check mark about h wide, centered on the origin. Dots sit pitch apart
// along the stroke, in three lanes side by side so the line reads bold.
function checkPts(h, pitch) {
  const pts = [];
  const a = [-0.5 * h, 0];
  const b = [-0.14 * h, 0.38 * h];
  const c = [0.52 * h, -0.46 * h];
  [
    [a, b],
    [b, c],
  ].forEach(([p, q]) => {
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const nx = (p[1] - q[1]) / len;
    const ny = (q[0] - p[0]) / len;
    const n = Math.max(2, Math.round(len / pitch) + 1);
    for (let lane = -1; lane <= 1; lane++) {
      for (let k = 0; k < n; k++) {
        const u = k / (n - 1);
        pts.push([p[0] + (q[0] - p[0]) * u + nx * lane * pitch * 0.6, p[1] + (q[1] - p[1]) * u + ny * lane * pitch * 0.6]);
      }
    }
  });
  return pts;
}

/* ---------- personas: dot art for the three groups ---------- */
// Drawn in design units on a dot grid with pitch pu; the engine scales them.
// Each point is [x, y, kind]. Kinds: f figure, o object, l status light,
// c crowd, k voting card.

const inEllipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
// Fills snap to one lattice so neighbouring shapes line up dot for dot.
function uGrid(pts, kind, x0, y0, x1, y1, pu, inside) {
  for (let y = Math.ceil(y0 / pu) * pu; y <= y1; y += pu) {
    for (let x = Math.ceil(x0 / pu) * pu; x <= x1; x += pu) if (inside(x, y)) pts.push([x, y, kind]);
  }
}
function uLine(pts, kind, a, b, pu) {
  const n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / pu) + 1);
  for (let k = 0; k < n; k++) {
    const u = k / (n - 1);
    pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, kind]);
  }
}
function uRect(pts, kind, x0, y0, x1, y1, pu) {
  uLine(pts, kind, [x0, y0], [x1, y0], pu);
  uLine(pts, kind, [x1, y0 + pu], [x1, y1], pu);
  uLine(pts, kind, [x1 - pu, y1], [x0, y1], pu);
  uLine(pts, kind, [x0, y1 - pu], [x0, y0 + pu], pu);
}
function uDisc(pts, kind, cx, cy, rad, pu) {
  const before = pts.length;
  uGrid(pts, kind, cx - rad, cy - rad, cx + rad, cy + rad, pu, (x, y) => inEllipse(x, y, cx, cy, rad, rad));
  if (pts.length === before) pts.push([cx, cy, kind]);
}
function uCircle(pts, kind, cx, cy, rad, pu) {
  const n = Math.max(6, Math.round((TAU * rad) / pu));
  for (let k = 0; k < n; k++) pts.push([cx + Math.cos((k / n) * TAU) * rad, cy + Math.sin((k / n) * TAU) * rad, kind]);
}

// The Constitutional Committee: a panel of members behind one bench, with the
// constitution's seal on its front. 130 by 80 units.
function benchPts(seats, pu) {
  const pts = [];
  const sp = Math.min(17, 118 / seats);
  const hr = Math.min(6, sp * 0.36);
  for (let j = 0; j < seats; j++) {
    const fx = 65 + (j - (seats - 1) / 2) * sp;
    uDisc(pts, "f", fx, 17, hr, pu);
    uGrid(pts, "f", fx - sp / 2, 24, fx + sp / 2, 38.5, pu, (x, y) => inEllipse(x, y, fx, 39, sp * 0.42, 15));
  }
  uLine(pts, "f", [-2, 40], [132, 40], pu);
  uRect(pts, "o", 3, 42.5, 127, 80, pu);
  uCircle(pts, "f", 65, 61, 7, pu);
  uDisc(pts, "f", 65, 61, 2.4, pu);
  return pts;
}

// A DRep: one person at a lectern raising a voting card, with the people who
// delegated to them seated on both sides. 100 by 100 units.
function drepPts(pu) {
  const pts = [];
  for (let side = -1; side <= 1; side += 2) {
    for (let row = 0; row < 2; row++) {
      for (let k = 0; k < 3; k++) {
        const x = 50 + side * (31 + k * 9 + row * 4.5);
        const y = 74 + row * 13;
        pts.push([x, y, "c"], [x - 2.6, y + 4, "c"], [x, y + 3.2, "c"], [x + 2.6, y + 4, "c"]);
      }
    }
  }
  uDisc(pts, "f", 50, 24, 8.5, pu);
  uGrid(pts, "f", 33, 34, 67, 60, pu, (x, y) => (y < 41 ? inEllipse(x, y, 50, 41, 15, 7) : Math.abs(x - 50) <= 15 - (y - 41) * 0.12));
  [-1.1, 1.1].forEach((d) => {
    uLine(pts, "f", [37 + d, 40], [28 + d, 26], pu);
    uLine(pts, "f", [28 + d, 26], [26 + d, 9], pu);
  });
  uGrid(pts, "k", 18, -7, 34, 8, pu, () => true);
  uLine(pts, "o", [28, 60], [72, 60], pu);
  uLine(pts, "o", [30, 62], [35, 96], pu);
  uLine(pts, "o", [70, 62], [65, 96], pu);
  uLine(pts, "o", [35, 96], [65, 96], pu);
  return pts;
}

// A stake pool operator: a person behind a laptop, cabled to the server rack
// that runs their node. 100 by 100 units.
function poolPts(pu) {
  const pts = [];
  uRect(pts, "o", 56, 4, 94, 96, pu);
  for (let s = 0; s < 6; s++) {
    const y = 8 + s * 14.6;
    uLine(pts, "o", [60, y + 9], [78, y + 9], pu);
    pts.push([85, y + 5.5, "l"], [90, y + 5.5, "l"]);
  }
  uDisc(pts, "f", 25, 36, 8.5, pu);
  uGrid(pts, "f", 4, 47, 46, 74, pu, (x, y) => inEllipse(x, y, 25, 76, 21, 28) && !(x > 5 && x < 45 && y > 59));
  uRect(pts, "o", 6, 61, 44, 83, pu);
  uDisc(pts, "f", 25, 72, 2.4, pu);
  uLine(pts, "o", [0, 85], [50, 85], pu);
  uLine(pts, "o", [45, 77], [55, 77], pu);
  return pts;
}

export function createStoryEngine({ root, stage, canvas, labels, locale, getOwn, getLive, onChapter }) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {}, refresh() {} };
  const doc = document.documentElement;
  const numFmt = new Intl.NumberFormat(locale);
  const decFmt = [1, 2].map((d) => new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d }));
  const dec = (v, d) => decFmt[d - 1].format(v);

  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = mqReduce.matches;
  const onReduce = (e) => {
    reduce = e.matches;
  };
  if (mqReduce.addEventListener) mqReduce.addEventListener("change", onReduce);

  let W = stage.clientWidth || window.innerWidth;
  let H = stage.clientHeight || window.innerHeight;
  let DPR = 1;

  /* ---------- colors and fonts from the site theme ---------- */
  let C = PALETTE.map(() => [128, 128, 128]);
  let isDark = false;
  const FF = { mono: "monospace", sans: "sans-serif" };
  const probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;visibility:hidden";
  root.appendChild(probe);

  function readTheme() {
    isDark = doc.getAttribute("data-theme") === "dark";
    C = PALETTE.map((d) => {
      probe.style.color = `var(${d[1]})`;
      return parseRgb(getComputedStyle(probe).color);
    });
    if (!C[K.bg]) C[K.bg] = parseRgb(getComputedStyle(document.body).backgroundColor) || (isDark ? [27, 27, 29] : [255, 255, 255]);
    C = C.map((c) => c || [128, 128, 128]);
    const rs = getComputedStyle(doc);
    FF.mono = rs.getPropertyValue("--ifm-font-family-monospace").trim() || "monospace";
    FF.sans = getComputedStyle(document.body).fontFamily || "sans-serif";
  }
  readTheme();

  /* ---------- particles ---------- */
  const px = new Float32Array(N);
  const py = new Float32Array(N);
  const pa = new Float32Array(N);
  const ps = new Float32Array(N);
  const pr = new Float32Array(N);
  const pg = new Float32Array(N);
  const pb = new Float32Array(N);
  const tx = new Float32Array(N);
  const ty = new Float32Array(N);
  const ta = new Float32Array(N);
  const ts = new Float32Array(N);
  const tm = new Float32Array(N);
  const tk = new Uint8Array(N);
  const tk2 = new Uint8Array(N);
  const delay = new Float32Array(N);
  const seed = new Float32Array(N);
  const ltx = new Float32Array(N);
  const lty = new Float32Array(N);
  {
    const c = C[K.pmuted];
    for (let i = 0; i < N; i++) {
      seed[i] = rnd(i, 41);
      px[i] = rnd(i, 42) * W;
      py[i] = rnd(i, 43) * H;
      ps[i] = 1;
      pr[i] = c[0];
      pg[i] = c[1];
      pb[i] = c[2];
    }
  }

  function T(i, x, y, key, a, s, key2, m) {
    tx[i] = x;
    ty[i] = y;
    tk[i] = K[key];
    tk2[i] = key2 ? K[key2] : K[key];
    tm[i] = m || 0;
    ta[i] = a;
    ts[i] = s;
  }
  function hide(i) {
    T(i, px[i], py[i], "pmuted", 0, 1);
  }
  function hideFrom(from) {
    for (let i = from; i < N; i++) hide(i);
  }
  function scatter(i, r, key, a, s) {
    T(i, r.x + rnd(i, 11) * r.w, r.y + rnd(i, 12) * r.h, key, a, s);
  }
  function fontOf(l) {
    const w = l.w || (l.f === "num" ? 300 : 500);
    return `${w} ${l.s || 11}px ${l.f === "mono" || !l.f ? FF.mono : FF.sans}`;
  }
  function textW(t, o) {
    ctx.font = fontOf(o);
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${o.ls || 0}px`;
    const w = ctx.measureText(t).width;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
    return w;
  }

  /* ---------- layout ---------- */
  let topInset = 44;
  let cardRight = 0;
  let boxRight = 0;
  let originX = 0;
  function measure() {
    const sr = stage.getBoundingClientRect();
    originX = sr.left;
    // Only the chapter bar covers the stage; the site navbar scrolls away.
    const bar = root.querySelector("[data-story-bar]");
    topInset = bar ? bar.offsetHeight : 44;
    const card = root.querySelector("[data-story-card]");
    if (card) {
      cardRight = card.getBoundingClientRect().right - originX;
      const box = card.parentElement;
      boxRight = box ? box.getBoundingClientRect().right - originX : W;
    } else {
      cardRight = 0;
      boxRight = W;
    }
  }
  function regionFor(name) {
    const top = topInset;
    if (name === "dim") return { x: 0, y: 0, w: W, h: H };
    if (W > BP_WIDE) {
      const x = Math.max(W * 0.44, cardRight + 28);
      const xr = Math.min(W * 0.97 - 34, boxRight + 8);
      return { x, y: top + 14, w: xr - x, h: H - top - 58 };
    }
    return { x: 16, y: top + 4, w: W - 32, h: Math.max(260, Math.min(H * 0.46, H - top - 220)) };
  }

  /* ---------- scenes ---------- */
  const S = {};
  const lab = labels;

  // 01: your ada stays put; at each epoch boundary its weight is counted with your DRep
  S.weight = (o) => {
    const { r, t } = o;
    const narrow = W <= BP_NARROW;
    const out = [];
    let i = 0;
    const wx = r.x + r.w * 0.02;
    const wy = r.y + r.h * 0.26;
    const ww = r.w * 0.42;
    const wh = r.h * 0.34;
    const nO = narrow ? 110 : 170;
    const per = 2 * (ww + wh);
    for (let k = 0; k < nO; k++, i++) {
      const d = (k / nO) * per;
      let x;
      let y;
      if (d < ww) {
        x = wx + d;
        y = wy;
      } else if (d < ww + wh) {
        x = wx + ww;
        y = wy + d - ww;
      } else if (d < 2 * ww + wh) {
        x = wx + ww - (d - ww - wh);
        y = wy + wh;
      } else {
        x = wx;
        y = wy + wh - (d - 2 * ww - wh);
      }
      T(i, x, y, "ink2", 0.45, 1.1);
    }
    const coins = [
      [0.27, 0.5, 600, "ink2"],
      [0.66, 0.3, 250, "ink2"],
      [0.66, 0.76, 100, "ink2"],
      [0.9, 0.52, 50, "spo"],
    ];
    const nCoin = narrow ? 300 : 520;
    const unit = (Math.min(ww, wh) * 0.3) / Math.sqrt(600);
    const cp = [];
    coins.forEach((c) => {
      const n = Math.round((nCoin * c[2]) / 1000);
      const ccx = wx + ww * c[0];
      const ccy = wy + wh * c[1];
      const rad = unit * Math.sqrt(c[2]);
      for (let q = 0; q < n; q++) {
        const p = phyllo(q, n, ccx, ccy, rad);
        cp.push([p[0], p[1], c[3]]);
      }
    });
    const cycle = 7000;
    const ph = reduce ? 0.75 : (t % cycle) / cycle;
    const flash = ph < 0.12 ? 1 - ph / 0.12 : 0;
    cp.forEach((p) => {
      T(i++, p[0], p[1], p[2], 0.8 + flash * 0.2, 1.45 + flash * 0.9);
    });
    const rb = Math.max(7, wh * 0.06);
    const ky = wy + wh + rb + 18;
    keyPts(narrow ? 80 : 120, wx + rb, ky, 1, 0, ww * 0.34, rb, rb * 0.36).forEach((p) => {
      T(i++, p[0], p[1], "ink", 0.9, 1.2);
    });
    const nOther = narrow ? 460 : 1000;
    const colX = r.x + r.w * 0.82;
    const cw = r.w * 0.17;
    const base = wy + wh + r.h * 0.12;
    const avail = base - (r.y + 46);
    const pitch = Math.max(2.6, Math.min(7, cw / 12, Math.sqrt((cw * avail) / (nOther * 1.1))));
    const gc = Math.max(6, Math.floor(cw / pitch));
    const gx0 = colX - (gc * pitch) / 2;
    for (let k = 0; k < nOther; k++, i++) {
      T(i, gx0 + ((k % gc) + 0.5) * pitch, base - (Math.floor(k / gc) + 0.5) * pitch, "drep", 0.3, pitch * 0.3);
    }
    const oTop = base - Math.ceil(nOther / gc) * pitch;
    const gTop = oTop - pitch;
    cp.forEach((p, q) => {
      const sx = gx0 + ((q % gc) + 0.5) * pitch;
      const sy = oTop - 0.5 * pitch;
      const st = 0.13 + (q / cp.length) * 0.22;
      let u = Math.max(0, Math.min(1, (ph - st) / 0.3));
      let e = u * u * (3 - 2 * u);
      let a = ph > 0.9 ? Math.max(0, 1 - (ph - 0.9) / 0.1) : 0.95;
      if (reduce) {
        u = 1;
        e = 1;
        a = 0.95;
      }
      const b = bez(e, [p[0], p[1]], [(p[0] + sx) / 2, Math.min(p[1], sy) - r.h * 0.16], [sx, sy]);
      T(i++, b[0], b[1], p[2], u > 0 ? a : 0, pitch * (0.34 + (1 - e) * 0.1), "drep", e);
    });
    hideFrom(i);
    const own = (getOwn && getOwn()) || { ada: "1,000", votes: "1,000,000,000" };
    const snap = !reduce && ph < 0.13;
    out.push(
      L(snap ? lab.snapshot : lab.weightCounted, r.x + r.w / 2, r.y + 12, {
        f: "mono",
        s: 10.5,
        c: snap ? "brand" : "drep",
        a: "center",
        ls: 1.8,
        w: 600,
        bg: true,
      })
    );
    out.push(L(lab.yourWallet, wx, wy - 12, { f: "mono", s: 11, c: "ink", ls: 1.8, w: 600 }));
    out.push(L(lab.rewards, wx + ww * 0.9, wy + wh * 0.52 + unit * Math.sqrt(50) + 14, { f: "mono", s: 9.5, c: "spo", a: "center" }));
    out.push(
      L(narrow ? lab.stakeKeyShort : lab.stakeKey, wx + 2 * rb + ww * 0.34 + 8, ky + 4, {
        f: "mono",
        s: narrow ? 9.5 : 10.5,
        c: "ink",
        ls: 1.4,
        w: 600,
      })
    );
    out.push(L(narrow ? lab.adaStaysShort : lab.adaStays, wx, ky + rb + 22, { f: "sans", s: narrow ? 11 : 12.5, c: "ink2" }));
    out.push(L(lab.yourDrep, colX, gTop - 12, { f: "mono", s: 11, c: "drep", a: "center", ls: 1.8, w: 600 }));
    out.push(L(lab.yourWeight, gx0 - 8, oTop - pitch * 0.5 + 4, { f: "sans", s: narrow ? 10.5 : 12, c: "drep", a: "right", w: 600 }));
    out.push(L(narrow ? lab.others : lab.otherDelegators, gx0 - 8, (oTop + base) / 2 + 4, { f: "sans", s: narrow ? 10.5 : 12, c: "muted", a: "right" }));
    out.push(L(lab.notToScale, colX, base + 16, { f: "mono", s: 9, c: "muted", a: "center", ls: 1.2 }));
    out.push(
      L(fill(lab.adaEqualsVotes, own), r.x + r.w / 2, r.y + r.h - 6, {
        f: "mono",
        s: narrow ? 10 : 11.5,
        c: "ink",
        a: "center",
        ls: 0.6,
        w: 600,
      })
    );
    return { labels: out };
  };

  // 02: three groups around one proposal, each drawn as a persona: the
  // committee's bench at the top, a DRep and a stake pool operator at the base.
  // Votes flow from each group to the action.
  const counts = () => storyCounts((getLive && getLive()) || {});
  S.groups = (o) => {
    const { r, t, m } = o;
    const narrow = W <= BP_NARROW;
    const out = [];
    const lines = [];
    let i = 0;
    const cnt = counts();
    const cx = r.x + r.w / 2;
    const hw = Math.min(r.w * 0.34, r.h * 0.38);
    const top = [cx, r.y + r.h * 0.24];
    const bl = [cx - hw, r.y + r.h * 0.68];
    const br = [cx + hw, r.y + r.h * 0.68];
    const mid = [cx, (top[1] + bl[1] + br[1]) / 3];
    const nC = cnt.committee || DEFAULT_SEATS;

    // Personas: one design unit is u pixels, dots sit p pixels apart
    const u = Math.min(m * 0.003, (hw * 1.1) / 100);
    const pu = (narrow ? 2.7 : 3.9) / u;
    const ds = narrow ? 1.2 : 1.5;
    const blink = (k) => (reduce ? 0.9 : Math.sin(t * 0.004 + rnd(k, 71) * TAU) > 0.2 ? 1 : 0.25);
    const draw = (pts, at, ox, oy, key) => {
      pts.forEach((q, k) => {
        const x = at[0] + (q[0] - ox) * u;
        const y = at[1] + (q[1] - oy) * u;
        if (q[2] === "f") T(i++, x, y, key, 0.95, ds);
        else if (q[2] === "o") T(i++, x, y, key, 0.55, ds * 0.85);
        else if (q[2] === "l") T(i++, x, y, key, blink(k), ds * 1.3);
        else if (q[2] === "c") T(i++, x, y, key, 0.4, ds * 1.35);
        else T(i++, x, y, key, 1, ds);
      });
    };
    draw(benchPts(nC, pu), top, 65, 40, "cc");
    draw(drepPts(pu), bl, 50, 50, "drep");
    draw(poolPts(pu), br, 50, 50, "spo");

    // The governance action in the middle
    const dw = m * 0.085;
    const dh = dw * 1.3;
    docPts(narrow ? 56 : 76, mid[0] - dw / 2, mid[1] - dh / 2, dw, dh, 4).forEach((p) => {
      T(i++, p[0], p[1], "brand", p[2] ? 0.6 : 0.95, p[2] ? 1.2 : 1.5);
    });

    // Votes flowing in along each edge
    const edges = [
      [top, 44 * u, "cc"],
      [bl, 62 * u, "drep"],
      [br, 62 * u, "spo"],
    ];
    const spd = reduce ? 0 : 0.00016;
    const perEdge = narrow ? 18 : 28;
    edges.forEach((e) => {
      const [p0, r0, key] = e;
      const ang = Math.atan2(mid[1] - p0[1], mid[0] - p0[0]);
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      // Leave a margin around the glyph, larger along its longer side
      const stop = Math.hypot(dw * 0.5 * ca, dh * 0.5 * sa) + 10;
      const len = Math.hypot(mid[0] - p0[0], mid[1] - p0[1]);
      const a = [p0[0] + ca * r0, p0[1] + sa * r0];
      const b = [mid[0] - ca * stop, mid[1] - sa * stop];
      lines.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1], c: key, dash: [3, 5], o: 0.45 });
      if (len < r0 + stop + 12) return;
      for (let k = 0; k < perEdge; k++, i++) {
        const tt = (rnd(i, 3) + t * spd * (0.8 + rnd(i, 4) * 0.4)) % 1;
        T(i, a[0] + (b[0] - a[0]) * tt, a[1] + (b[1] - a[1]) * tt, key, 0.95 * Math.sin(Math.PI * tt), 1.8, "brand", tt * tt);
      }
    });
    hideFrom(i);

    const nameO = { f: "mono", s: narrow ? 10 : 11, ls: 1.8, w: 600, a: "center" };
    const subO = { f: "sans", s: narrow ? 10.5 : 12.5, c: "ink2", a: "center" };
    const benchTop = top[1] - 40 * u;
    out.push(L(lab.committee, top[0], benchTop - (narrow ? 26 : 32), { ...nameO, c: "cc" }));
    // Counts appear only when they load live; the rule is always shown.
    const ccLine = cnt.committee ? `${fill(lab.committeeMembers, { count: numFmt.format(cnt.committee) })} · ${lab.oneMemberOneVote}` : lab.oneMemberOneVote;
    out.push(L(ccLine, top[0], benchTop - (narrow ? 10 : 14), subO));
    const base = [
      [bl, lab.dreps, cnt.dreps ? fill(lab.drepsActive, { count: numFmt.format(cnt.dreps) }) : null, lab.weightedByAda, "drep"],
      [br, lab.stakePools, null, lab.weightedByStake, "spo"],
    ];
    base.forEach((b) => {
      const y = b[0][1] + 50 * u + (narrow ? 20 : 24);
      const step = narrow ? 15 : 18;
      out.push(L(b[1], b[0][0], y, { ...nameO, c: b[4] }));
      if (b[2]) out.push(L(b[2], b[0][0], y + step, subO));
      out.push(L(b[3], b[0][0], y + (b[2] ? (narrow ? 29 : 35) : step), { ...subO, c: b[2] ? "muted" : "ink2" }));
    });
    out.push(L(lab.governanceAction, mid[0], mid[1] + dh / 2 + 20, { f: "mono", s: narrow ? 9 : 10, c: "brand", a: "center", ls: 1.4, w: 600, bg: true }));
    return { labels: out, lines, center: [mid[0], mid[1], Math.hypot(hw, bl[1] - mid[1]) + 50 * u] };
  };

  // 04: a stamp. A governance action comes in, the committee checks it line by
  // line, and its stamp comes down: constitutional. The check has two possible
  // outcomes, so the picture ends on a verdict.
  S.stamp = (o) => {
    const { r, t } = o;
    const narrow = W <= BP_NARROW;
    const out = [];
    let i = 0;

    // Plays once from the moment the chapter comes into view: the action forms
    // off to the left and slides in, a scan line passes down the page, then
    // the stamp comes down and leaves a ripple. Scrolling back to the chapter
    // replays it.
    const el = reduce ? Infinity : t - sceneAt;
    const slideAt = 900;
    const slideMs = 500;
    const scanAt = 1550;
    const scanMs = 1500;
    const stampAt = 3250;
    const slamMs = 260;
    const rippleMs = 560;

    // The action, with room for one label above it and two below
    const above = narrow ? 24 : 30;
    const below = narrow ? 52 : 64;
    const dw = Math.min(r.w * (narrow ? 0.58 : 0.46), (r.h - above - below) / 1.3);
    const dh = dw * 1.3;
    const dx0 = r.x + (r.w - dw) / 2;
    const su = Math.min(1, Math.max(0, (el - slideAt) / slideMs));
    const dx = dx0 - (1 - su * su * (3 - 2 * su)) * dw * 0.45;
    const dy = r.y + above + (r.h - above - below - dh) / 2;
    const pitch = narrow ? 3.2 : 3.8;
    roundRectPts(Math.round((2 * (dw + dh)) / pitch), dw, dh, 0).forEach((p) => {
      T(i++, dx + dw / 2 + p[0], dy + dh / 2 + p[1], "brand", 0.85, 1.5);
    });

    // A title and five lines of text fill the top half; each line lights up
    // as the scan line passes it. The stamp lands in the space below.
    const u = (el - scanAt) / scanMs;
    const scanning = u > 0 && u < 1;
    const sy = dy + dh * (0.03 + 0.95 * Math.min(1, Math.max(0, u)));
    [
      [0.12, 0.5, "ink", 0.9, 2.1],
      [0.23, 0.92, "ink2", 0.5, 1.3],
      [0.3, 0.86, "ink2", 0.5, 1.3],
      [0.37, 0.9, "ink2", 0.5, 1.3],
      [0.44, 0.82, "ink2", 0.5, 1.3],
      [0.51, 0.56, "ink2", 0.5, 1.3],
    ].forEach(([fy, lf, key, a, s]) => {
      const ly = dy + dh * fy;
      const lw = dw * 0.8 * lf;
      const n = Math.round(lw / (pitch * 0.8));
      const hit = scanning ? Math.max(0, 1 - Math.abs(sy - ly) / (dh * 0.06)) : 0;
      for (let k = 0; k < n; k++) {
        T(i++, dx + dw * 0.1 + (k / Math.max(1, n - 1)) * lw, ly, key, a + hit * 0.45, s + hit * 0.5, "cc", hit);
      }
    });
    const sa = scanning ? Math.min(1, u * 10, (1 - u) * 5) : 0;
    const nBar = Math.round((dw * 1.1) / (pitch * 0.8));
    [
      [0, 0.95, 1.6],
      [-3, 0.4, 1.3],
      [-6, 0.18, 1.2],
      [-9, 0.07, 1.1],
    ].forEach(([off, a, s]) => {
      for (let k = 0; k < nBar; k++) T(i++, dx - dw * 0.05 + (k / Math.max(1, nBar - 1)) * dw * 1.1, sy + off, "cc", a * sa, s);
    });

    // The stamp: a double border around a check and the verdict, set at an
    // angle. Long translations shrink the type so the stamp stays on the page.
    const fo = { f: "mono", s: narrow ? 11.5 : 15, ls: narrow ? 1.6 : 2.4, w: 700 };
    const fit = Math.min(1, (dw * 0.94) / (fo.s * 3.9 + textW(lab.constitutional, fo)));
    const fs = fo.s * fit;
    const ls = fo.ls * fit;
    const tw = textW(lab.constitutional, { ...fo, s: fs, ls });
    const cs = fs * 1.25;
    const gap = fs * 0.75;
    const sw = Math.max(dw * 0.5, fs * 1.9 + cs + gap + tw);
    const sh = fs * 2.9;
    const left = -(cs + gap + tw) / 2;
    const rot = -0.12;
    const v = (el - stampAt) / slamMs;
    const sc = v <= 0 ? 1.6 : v >= 1 ? 1 : 1 + 0.6 * (1 - v * v);
    const on = v > 0 ? 1 : 0;
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    const scx = dx + dw / 2;
    const scy = dy + dh * 0.78;
    const at = (lx, ly) => [scx + (lx * cr - ly * sr) * sc, scy + (lx * sr + ly * cr) * sc];
    // Uneven ink: a few dots print faint
    const ink = (k) => (rnd(k, 61) > 0.86 ? 0.45 : 0.95);
    const ins = fs * 0.32;
    [
      [roundRectPts(Math.round((2 * (sw + sh)) / (pitch * 0.75)), sw, sh, fs * 0.4), 0, 1, 1.7],
      [roundRectPts(Math.round((2 * (sw + sh - 4 * ins)) / (pitch * 0.85)), sw - 2 * ins, sh - 2 * ins, fs * 0.22), 0, 0.8, 1.1],
      [checkPts(cs, narrow ? 1.9 : 2.2), left + cs / 2, 1, 1.5],
    ].forEach(([pts, ox, a, s], j) => {
      pts.forEach((p, k) => {
        const q = at(ox + p[0], p[1]);
        T(i++, q[0], q[1], "cc", on * a * ink(k + j * 500), s);
      });
    });
    const w = (el - stampAt - slamMs) / rippleMs;
    const ripple = w > 0 && w < 1;
    const grow = (ripple ? w : 0) * fs * 1.6;
    roundRectPts(Math.round((2 * (sw + sh)) / (pitch * 1.2)), sw + 2 * grow, sh + 2 * grow, fs * 0.4 + grow).forEach((p) => {
      const q = at(p[0], p[1]);
      T(i++, q[0], q[1], "cc", ripple ? 0.8 * (1 - w) : 0, 1.3);
    });
    hideFrom(i);

    const tq = at(left + cs + gap + tw / 2, fs * 0.36);
    out.push(L(lab.constitutional, tq[0], tq[1], { f: "mono", s: fs * sc, ls: ls * sc, w: 700, c: "cc", a: "center", rot, o: Math.min(1, Math.max(0, v * 1.5)) }));
    out.push(L(lab.governanceAction, dx, dy - 14, { f: "mono", s: 11, c: "ink", ls: 2, w: 600 }));
    const cx = r.x + r.w / 2;
    out.push(L(lab.constitutionalCommittee, cx, dy + dh + (narrow ? 24 : 30), { f: "mono", s: narrow ? 10 : 11, ls: 1.6, w: 600, a: "center", c: "cc" }));
    out.push(L(lab.checkNote, cx, dy + dh + (narrow ? 40 : 48), { f: "sans", s: narrow ? 10.5 : 12.5, c: "ink2", a: "center" }));
    return { labels: out };
  };

  // 03: a governance action document with its deposit seal
  S.proposal = (o) => {
    const { r } = o;
    const NB = Math.min(N, 1400);
    const dw = Math.min(r.w * 0.46, r.h * 0.6);
    const dh = Math.min(dw * 1.32, r.h * 0.8);
    const dx = r.x + (r.w - dw) / 2 - dw * 0.1;
    const dy = r.y + (r.h - dh) / 2;
    const per = Math.floor(NB * 0.22);
    const txt = Math.floor(NB * 0.44);
    const seal = Math.floor(NB * 0.16);
    let i = 0;
    const P = 2 * (dw + dh);
    for (let k = 0; k < per; k++, i++) {
      const d = (k / per) * P;
      let x;
      let y;
      if (d < dw) {
        x = dx + d;
        y = dy;
      } else if (d < dw + dh) {
        x = dx + dw;
        y = dy + d - dw;
      } else if (d < 2 * dw + dh) {
        x = dx + dw - (d - dw - dh);
        y = dy + dh;
      } else {
        x = dx;
        y = dy + dh - (d - 2 * dw - dh);
      }
      T(i, x, y, "brand", 0.85, 1.5);
    }
    const nL = 11;
    const perLine = Math.floor(txt / nL);
    for (let l = 0; l < nL; l++) {
      const lf = l === 0 ? 0.55 : l % 4 === 3 ? 0.58 : 0.84 + rnd(l, 9) * 0.1;
      const ly = dy + dh * 0.12 + l * ((dh * 0.62) / (nL - 1)) + (l > 0 ? dh * 0.03 : 0);
      for (let k = 0; k < perLine; k++, i++) {
        T(i, dx + dw * 0.1 + (k / (perLine - 1)) * dw * 0.78 * lf, ly, l === 0 ? "ink" : "ink2", l === 0 ? 0.9 : 0.5, l === 0 ? 2.1 : 1.3);
      }
    }
    const scx = dx + dw * 0.96;
    const scy = dy + dh * 0.88;
    const sr = dw * 0.2;
    const no = Math.floor(seal * 0.62);
    for (let k = 0; k < seal; k++, i++) {
      const outer = k < no;
      const nk = outer ? no : seal - no;
      const kk = outer ? k : k - no;
      const th = (kk / nk) * TAU;
      T(i, scx + Math.cos(th) * sr * (outer ? 1 : 0.8), scy + Math.sin(th) * sr * (outer ? 1 : 0.8), "brand", 0.95, 1.6);
    }
    for (; i < NB; i++) scatter(i, r, "pmuted", 0.1, 1);
    hideFrom(i);
    return {
      labels: [
        L(lab.governanceAction, dx, dy - 14, { f: "mono", s: 11, c: "ink", ls: 2, w: 600 }),
        L(numFmt.format(100000), scx, scy + 2, { f: "mono", s: W <= BP_NARROW ? 11 : 13, c: "brand", a: "center", w: 600, bg: true }),
        L(lab.adaDeposit, scx, scy + 19, { f: "mono", s: 9, c: "brand", a: "center", bg: true }),
        L(lab.anchor, dx, dy + dh + 24, { f: "mono", s: 10.5, c: "muted" }),
      ],
    };
  };

  // 05: treasury flows
  S.treasury = (o) => {
    const { r, t, m } = o;
    const spd = reduce ? 0 : 0.00008;
    const NB = Math.min(N, 1600);
    const band = { x: r.x + r.w * 0.2, y: r.y + r.h * 0.07, w: r.w * 0.48, h: r.h * 0.1 };
    const src = [band.x + band.w * 0.5, band.y + band.h + 4];
    const stk = [r.x + r.w * 0.08, r.y + r.h * 0.44];
    const bs = { cx: r.x + r.w * 0.44, cy: r.y + r.h * 0.56, rx: r.w * 0.2, ry: r.h * 0.26 };
    const sinks = [0, 1, 2, 3, 4].map((j) => [r.x + r.w * 0.93, r.y + r.h * (0.38 + j * 0.11)]);
    const f = [0.14, 0.12, 0.08, 0.05, 0.41, 0.1, 0.1].map((x) => Math.floor(x * NB));
    let i = 0;
    const cols = Math.ceil(Math.sqrt((f[0] * band.w) / band.h));
    const rows = Math.ceil(f[0] / cols);
    for (let k = 0; k < f[0]; k++, i++) {
      T(i, band.x + ((k % cols) + 0.5) * (band.w / cols), band.y + (Math.floor(k / cols) + 0.5) * (band.h / rows), "pmuted", 0.75, 1.4);
    }
    for (let k = 0; k < f[1]; k++, i++) {
      const tt = (rnd(i, 3) + t * spd * (0.7 + rnd(i, 4) * 0.6)) % 1;
      const p = bez(tt, src, [stk[0] + r.w * 0.06, band.y + band.h * 1.3], stk);
      T(i, p[0] + (rnd(i, 5) - 0.5) * m * 0.03, p[1], "pmuted", 0.8, 1.3, "spo", tt);
    }
    for (let k = 0; k < f[2]; k++, i++) {
      const p = phyllo(k, f[2], stk[0], stk[1], m * 0.065);
      T(i, p[0], p[1], "spo", 0.9, 1.6);
    }
    for (let k = 0; k < f[3]; k++, i++) {
      const tt = (rnd(i, 3) + t * spd * 0.8 * (0.7 + rnd(i, 4) * 0.6)) % 1;
      const p = bez(tt, src, [src[0] + 4, (src[1] + bs.cy) / 2], [bs.cx, bs.cy - 6]);
      T(i, p[0] + (rnd(i, 5) - 0.5) * 6, p[1], "pmuted", 0.9, 1.5, "brand", tt);
    }
    for (let k = 0; k < f[4]; k++, i++) {
      const th = k * 2.399963;
      const rr = Math.sqrt((k + 0.5) / f[4]);
      T(i, bs.cx + Math.cos(th) * rr * bs.rx, bs.cy + Math.abs(Math.sin(th)) * rr * bs.ry, "brand", 0.9, 1.6);
    }
    for (let k = 0; k < f[5]; k++, i++) {
      const j = k % 5;
      const tt = (rnd(i, 3) + t * spd * (0.7 + rnd(i, 4) * 0.6)) % 1;
      const p = bez(tt, [bs.cx + bs.rx * 0.85, bs.cy + bs.ry * 0.12], [r.x + r.w * 0.76, sinks[j][1] - r.h * 0.03], sinks[j]);
      T(i, p[0], p[1] + (rnd(i, 5) - 0.5) * 4, "brand", 0.8, 1.3, "fund", tt);
    }
    const ps5 = Math.floor(f[6] / 5);
    for (let k = 0; k < f[6]; k++, i++) {
      const jn = Math.min(4, Math.floor(k / ps5));
      const p = phyllo(k - jn * ps5, ps5, sinks[jn][0], sinks[jn][1], m * 0.03);
      T(i, p[0], p[1], "fund", 0.95, 1.5);
    }
    for (; i < NB; i++) scatter(i, r, "pmuted", 0.07, 1);
    hideFrom(i);
    const narrow = W <= BP_NARROW || r.w < 560;
    const head = { f: "mono", s: 10.5, c: "ink", ls: 1.6, w: 600 };
    const live = counts().treasury;
    const balance = live ? fill(lab.treasuryBalance, { amount: dec(live / 1e9, 2) }) : "";
    return {
      labels: [
        L(lab.epochRewards, band.x, band.y - 12, head),
        L(narrow ? "" : lab.fromReserves, band.x + textW(lab.epochRewards, head) + 10, band.y - 12, { f: "sans", s: 11.5, c: "muted" }),
        L(narrow ? lab.toPoolsShort : lab.toPools, stk[0], stk[1] + m * 0.065 + 20, { f: "mono", s: 10, c: "spo", a: "center", ls: 1.2, w: 600 }),
        L(narrow ? lab.toTreasuryShort : lab.toTreasury, src[0] + 12, (src[1] + bs.cy) / 2, { f: "mono", s: 10, c: "brand", ls: 0.4, w: 600, bg: true }),
        L(lab.treasury, bs.cx, bs.cy + bs.ry + 24, { f: "mono", s: 11, c: "ink", a: "center", ls: 2, w: 600 }),
        L(balance, bs.cx, bs.cy + bs.ry + 42, { f: "sans", s: 12.5, c: "ink2", a: "center" }),
        L(lab.withdrawals, r.x + r.w, sinks[0][1] - m * 0.03 - (narrow ? 16 : 14), { f: "mono", s: 10.5, c: "fund", a: "right", ls: 1.4, w: 600 }),
        L(narrow ? lab.withdrawalsNoteShort : lab.withdrawalsNote, r.x + r.w, sinks[4][1] + m * 0.03 + 22, { f: "sans", s: narrow ? 10.5 : 12, c: "ink2", a: "right" }),
      ],
    };
  };

  // 06: the three groups in motion around you
  S.finale = (o) => {
    const { r, t, m } = o;
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    const NB = Math.min(N, 1600);
    const rings = [0.075, 0.145, 0.215, 0.285, 0.355, 0.425].map((v) => v * m);
    const keys = ["cc", "drep", "spo", "drep", "spo", "cc"];
    const sum = rings.reduce((a, b) => a + b, 0);
    T(0, cx, cy, "ink", 1, 7);
    let i = 1;
    for (let j = 0; j < rings.length; j++) {
      const n = j === rings.length - 1 ? NB - i : Math.round(((NB - 1) * rings[j]) / sum);
      const rot = (reduce ? 0 : t * 0.000035) * (j % 2 ? 1 : -1) * (1 + j * 0.12);
      for (let k = 0; k < n; k++, i++) {
        const th = rot + (k / n) * TAU;
        T(i, cx + Math.cos(th) * rings[j], cy + Math.sin(th) * rings[j], keys[j], 0.9 - j * 0.08, 1.7);
      }
    }
    hideFrom(i);
    return { labels: [L(lab.you, cx, cy + 22, { f: "mono", s: 10, c: "ink", a: "center", ls: 2, w: 600 })] };
  };

  // Interactive modules: a quiet drift behind them
  S.dim = (o) => {
    const { t } = o;
    const NB = Math.min(N, 1200);
    let i;
    for (i = 0; i < NB; i++) {
      const dx = reduce ? 0 : Math.sin(t * 0.00015 + i) * 14;
      const dy = reduce ? 0 : Math.cos(t * 0.00012 + i * 1.3) * 14;
      T(i, rnd(i, 21) * W + dx, rnd(i, 22) * H + dy, "pmuted", 0.2, 1.2);
    }
    hideFrom(i);
    return {};
  };

  const SCENES = {
    weight: { fn: S.weight, dyn: true },
    groups: { fn: S.groups, dyn: true, grow: true, labelDelay: 1300 },
    proposal: { fn: S.proposal },
    stamp: { fn: S.stamp, dyn: true, labelDelay: 1300 },
    treasury: { fn: S.treasury, dyn: true },
    finale: { fn: S.finale, dyn: true },
    dim: { fn: S.dim, dyn: true },
  };

  let scene = "weight";
  let sceneAt = performance.now();
  let built = { labels: [] };
  function build(name, now) {
    const r = regionFor(name);
    return SCENES[name].fn({ r, m: Math.min(r.w, r.h), t: now, wide: W > BP_WIDE }) || {};
  }
  function setScene(name) {
    if (!SCENES[name] || name === scene) return;
    const prev = scene;
    scene = name;
    sceneAt = performance.now();
    const def = SCENES[name];
    for (let i = 0; i < N; i++) delay[i] = reduce ? 0 : rnd(i, 31) * 380;
    built = build(name, sceneAt);
    if (!reduce && def.grow && built.center && def.noGrowFrom !== prev) {
      const c = built.center;
      for (let i = 0; i < N; i++) {
        if (ta[i] < 0.01) continue;
        const d = Math.hypot(tx[i] - c[0], ty[i] - c[1]);
        px[i] = c[0] + (rnd(i, 51) - 0.5) * 4;
        py[i] = c[1] + (rnd(i, 52) - 0.5) * 4;
        pa[i] = 0;
        delay[i] = 60 + Math.pow(Math.min(1, d / c[2]), 0.85) * 1500;
      }
    }
    if (!reduce && def.spin != null && built.center) {
      const c = built.center;
      for (let i = 0; i < N; i++) {
        const ang = Math.atan2(ty[i] - c[1], tx[i] - c[0]);
        delay[i] = ((((ang - def.spin) % TAU) + TAU) % TAU) / TAU * 1300;
      }
    }
  }

  function resize() {
    W = stage.clientWidth || window.innerWidth;
    H = stage.clientHeight || window.innerHeight;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    measure();
    built = build(scene, performance.now());
  }

  /* ---------- drawing ---------- */
  const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
  function colorOf(key) {
    return C[K[key]] || C[K.ink];
  }
  function drawLabel(l, a) {
    if (!l.t || a <= 0) return;
    ctx.globalAlpha = a * (l.o == null ? 1 : l.o);
    ctx.font = fontOf(l);
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${l.ls || 0}px`;
    const tw = ctx.measureText(l.t).width;
    let x = l.a === "center" ? l.x - tw / 2 : l.a === "right" ? l.x - tw : l.x;
    x = Math.max(10, Math.min(W - 10 - tw, x));
    // A label with `rot` turns about the middle of its baseline
    if (l.rot) {
      ctx.save();
      ctx.translate(x + tw / 2, l.y);
      ctx.rotate(l.rot);
      ctx.translate(-x - tw / 2, -l.y);
    }
    if (l.bg) {
      const s = l.s || 11;
      const bgc = C[K.bg];
      ctx.fillStyle = `rgba(${bgc[0]},${bgc[1]},${bgc[2]},0.86)`;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - 7, l.y - s * 1.05, tw + 14, s * 1.6, 3);
      else ctx.rect(x - 7, l.y - s * 1.05, tw + 14, s * 1.6);
      ctx.fill();
    }
    ctx.fillStyle = rgb(colorOf(l.c || "ink"));
    ctx.fillText(l.t, x, l.y);
    if (l.rot) ctx.restore();
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  }
  function drawLine(l, a) {
    ctx.globalAlpha = a * (l.o == null ? 0.7 : l.o);
    const col = rgb(colorOf(l.c));
    if (l.dot) {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(l.x1, l.y1, 4, 0, TAU);
      ctx.fill();
      return;
    }
    ctx.strokeStyle = col;
    ctx.lineWidth = l.w || (l.circle ? 1 : 1.2);
    ctx.setLineDash(l.dash || []);
    ctx.beginPath();
    if (l.circle) ctx.arc(l.x1, l.y1, l.rad, 0, TAU);
    else {
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  let raf = 0;
  let running = false;
  let lastNow = 0;
  function frame(now) {
    raf = 0;
    if (!running) return;
    const def = SCENES[scene];
    const fdt = lastNow ? Math.min(6, Math.max(0.25, (now - lastNow) / 16.667)) : 1;
    lastNow = now;
    if (def.dyn) built = build(scene, now);
    const el = now - sceneAt;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = isDark ? "lighter" : "source-over";
    const k = reduce ? 1 : 1 - Math.pow(1 - (def.dyn && el > 1200 ? 0.2 : 0.075), fdt);
    const kc = reduce ? 1 : 1 - Math.pow(0.92, fdt);
    const jt = now * 0.0012;
    const jamp = reduce ? 0 : 0.55;
    for (let i = 0; i < N; i++) {
      if (def.dyn && el > 1400 && Math.abs(tx[i] - ltx[i]) + Math.abs(ty[i] - lty[i]) > 40) {
        px[i] = tx[i];
        py[i] = ty[i];
        pa[i] = 0;
      }
      ltx[i] = tx[i];
      lty[i] = ty[i];
      if (el >= delay[i]) {
        px[i] += (tx[i] - px[i]) * k;
        py[i] += (ty[i] - py[i]) * k;
        ps[i] += (ts[i] - ps[i]) * kc;
        pa[i] += (ta[i] - pa[i]) * kc;
        const c1 = C[tk[i]];
        const c2 = C[tk2[i]];
        const m = tm[i];
        pr[i] += (c1[0] + (c2[0] - c1[0]) * m - pr[i]) * kc;
        pg[i] += (c1[1] + (c2[1] - c1[1]) * m - pg[i]) * kc;
        pb[i] += (c1[2] + (c2[2] - c1[2]) * m - pb[i]) * kc;
      }
      if (pa[i] < 0.01) continue;
      ctx.globalAlpha = pa[i] > 1 ? 1 : pa[i];
      ctx.fillStyle = `rgb(${pr[i] | 0},${pg[i] | 0},${pb[i] | 0})`;
      ctx.beginPath();
      ctx.arc(
        px[i] + Math.sin(jt + seed[i] * TAU) * jamp,
        py[i] + Math.cos(jt * 0.9 + seed[i] * TAU) * jamp,
        ps[i] > 0.3 ? ps[i] : 0.3,
        0,
        TAU
      );
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    const la = reduce ? 1 : Math.min(1, Math.max(0, (el - (def.labelDelay || 380)) / 480));
    if (built.lines) built.lines.forEach((l) => drawLine(l, la));
    if (built.labels) built.labels.forEach((l) => drawLabel(l, la));
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true;
    lastNow = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /* ---------- scroll: which chapter is active ---------- */
  const triggers = Array.from(root.querySelectorAll("[data-scene]"));
  let current = -1;
  function anchorTop(el) {
    const a = el.querySelector("[data-anchor]");
    return (a || el).getBoundingClientRect().top;
  }
  function onScroll() {
    const VH = window.innerHeight;
    const line = VH * (W > BP_WIDE ? 0.56 : 0.74);
    let idx = 0;
    for (let i = 0; i < triggers.length; i++) if (anchorTop(triggers[i]) < line) idx = i;
    const el = triggers[idx];
    if (el) setScene(el.getAttribute("data-scene"));
    if (idx !== current) {
      current = idx;
      if (onChapter) onChapter(idx);
    }
    const rr = root.getBoundingClientRect();
    const prog = rr.height > 0 ? Math.min(1, Math.max(0, (VH * 0.5 - rr.top) / rr.height)) : 0;
    root.style.setProperty("--story-progress", prog.toFixed(4));
  }
  let ticking = false;
  const onScrollEvt = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      onScroll();
    });
  };
  const onResize = () => {
    if (stage.clientWidth !== W || stage.clientHeight !== H) resize();
    else measure();
    onScroll();
  };
  window.addEventListener("scroll", onScrollEvt, { passive: true });
  window.addEventListener("resize", onResize);

  const themeObs = new MutationObserver(readTheme);
  themeObs.observe(doc, { attributes: true, attributeFilter: ["data-theme"] });

  // Only animate while the story is on screen.
  let io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(root);
  } else {
    start();
  }

  let destroyed = false;
  resize();
  onScroll();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (destroyed) return;
      readTheme();
      measure();
      built = build(scene, performance.now());
    });
  }

  return {
    refresh() {
      if (destroyed) return;
      measure();
      built = build(scene, performance.now());
    },
    destroy() {
      destroyed = true;
      stop();
      window.removeEventListener("scroll", onScrollEvt);
      window.removeEventListener("resize", onResize);
      if (mqReduce.removeEventListener) mqReduce.removeEventListener("change", onReduce);
      themeObs.disconnect();
      if (io) io.disconnect();
      probe.remove();
    },
  };
}
