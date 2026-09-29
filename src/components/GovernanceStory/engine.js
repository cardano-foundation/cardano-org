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

import { epochInfo, epochStart, countdown } from "./epoch";
import { SNAPSHOT, storyCounts } from "@site/src/data/governanceStory";

// Enough particles for one dot per DRep, stake pool and committee seat, plus
// the animated flows in the election scenes.
const N = 3900;
// Site breakpoints: 996px is the primary one (navbar collapse), 768px tablet.
const BP_WIDE = 996;
const BP_NARROW = 768;
const TAU = Math.PI * 2;

const PALETTE = [
  ["brand", "--ifm-color-primary"],
  ["drep", "--site-role-drep"],
  ["spo", "--site-role-pool"],
  ["cc", "--site-role-committee"],
  ["cct", "--site-role-committee-text"],
  ["fund", "--site-role-funding"],
  ["fundt", "--site-role-funding-text"],
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
// Small text uses the higher-contrast variant of a role color.
const TEXT_KEY = { cc: "cct", fund: "fundt" };

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

// A padlock with its body centered on (cx, cy). Parts: b body, h keyhole, s shackle.
function lockPts(n, cx, cy, bw, bh) {
  const pts = [];
  const nS = Math.floor(n * 0.27);
  const nH = Math.floor(n * 0.12);
  const nB = n - nS - nH;
  const top = cy - bh / 2;
  const kx = cx;
  const ky = cy - bh * 0.08;
  const kr = bw * 0.085;
  const g = Math.sqrt((bw * bh) / (nB * 1.2));
  const cand = [];
  for (let y = top + g / 2; y < cy + bh / 2; y += g) {
    for (let x = cx - bw / 2 + g / 2; x < cx + bw / 2; x += g) {
      const hole =
        Math.hypot(x - kx, y - ky) < kr * 1.6 || (Math.abs(x - kx) < kr * 0.9 && y > ky && y < ky + bh * 0.34);
      if (!hole) cand.push([x, y, "b"]);
    }
  }
  for (let k = 0; k < nB; k++) pts.push(cand[Math.floor((k * cand.length) / nB)] || [cx, cy, "b"]);
  const nc = Math.floor(nH * 0.6);
  const ns = nH - nc;
  const hs = Math.ceil(ns / 2);
  for (let k = 0; k < nc; k++) {
    const th = (k / nc) * TAU;
    pts.push([kx + Math.cos(th) * kr, ky + Math.sin(th) * kr, "h"]);
  }
  for (let k = 0; k < ns; k++) {
    const ln = k % 2;
    const u = Math.floor(k / 2) / Math.max(1, hs - 1);
    pts.push([kx + (ln - 0.5) * kr * 0.9, ky + kr + u * bh * 0.2, "h"]);
  }
  const rs = bw * 0.3;
  const legH = bh * 0.34;
  const thk = bw * 0.07;
  const Lp = legH * 2 + Math.PI * rs;
  const hh = Math.ceil(nS / 2);
  for (let k = 0; k < nS; k++) {
    const lane = k % 2;
    const d = (Math.floor(k / 2) / Math.max(1, hh - 1)) * Lp;
    let sx;
    let sy;
    let nx;
    let ny;
    if (d < legH) {
      sx = cx - rs;
      sy = top - d;
      nx = -1;
      ny = 0;
    } else if (d < legH + Math.PI * rs) {
      const a = Math.PI + (d - legH) / rs;
      sx = cx + Math.cos(a) * rs;
      sy = top - legH + Math.sin(a) * rs;
      nx = Math.cos(a);
      ny = Math.sin(a);
    } else {
      sx = cx + rs;
      sy = top - legH + (d - legH - Math.PI * rs);
      nx = 1;
      ny = 0;
    }
    pts.push([sx + nx * (lane - 0.5) * thk, sy + ny * (lane - 0.5) * thk, "s"]);
  }
  return pts;
}

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

// Concentric rings with pitch p, filled from radius r0 outward.
function ringPts(n, r0, p, cx, cy) {
  const pts = [];
  let rad = r0;
  let left = n;
  while (left > 0) {
    const cap = Math.max(6, Math.floor((TAU * rad) / p));
    const k = Math.min(cap, left);
    const off = rnd(Math.round(rad * 10), 3) * TAU;
    for (let j = 0; j < k; j++) {
      const th = off + (j / k) * TAU;
      pts.push([cx + Math.cos(th) * rad, cy + Math.sin(th) * rad]);
    }
    left -= k;
    rad += p;
  }
  return { pts, inner: r0, outer: rad - p };
}

export function createStoryEngine({ root, stage, canvas, labels, locale, getOwn, getLive, onChapter }) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {}, refresh() {} };
  const doc = document.documentElement;
  const numFmt = new Intl.NumberFormat(locale);
  const decFmt = [1, 2].map((d) => new Intl.NumberFormat(locale, { minimumFractionDigits: d, maximumFractionDigits: d }));
  const dec = (v, d) => decFmt[d - 1].format(v);
  const dayFmt = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" });
  const dateFmt = new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

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
  function faintRest(from, r, k) {
    let shown = 0;
    for (let i = from; i < N; i++) {
      if (shown++ < k) scatter(i, r, "pmuted", 0.1, 1);
      else hide(i);
    }
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
  const fmtDay = (d) => dayFmt.format(d);
  const upper = (s) => s.toLocaleUpperCase(locale);

  /* ---------- layout ---------- */
  let topInset = 104;
  let cardRight = 0;
  let boxRight = 0;
  let originX = 0;
  function measure() {
    const sr = stage.getBoundingClientRect();
    originX = sr.left;
    const navbar = document.querySelector(".navbar");
    const bar = root.querySelector("[data-story-bar]");
    topInset = (navbar ? navbar.offsetHeight : 60) + (bar ? bar.offsetHeight : 44);
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

  // The live epoch dial
  S.clock = (o) => {
    const { r, wide, E } = o;
    const NB = Math.min(N, 1300);
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    const m = wide ? Math.min(r.w, r.h) : Math.min(r.w * 0.92, r.h);
    const radii = [0.46, 0.39, 0.32].map((v) => v * m);
    const sum = radii[0] + radii[1] + radii[2];
    const lit = wide ? 0.95 : 0.85;
    const dimA = wide ? 0.32 : 0.3;
    let i = 0;
    let n0 = 0;
    for (let j = 0; j < 3; j++) {
      const n = j === 2 ? NB - i : Math.round((NB * radii[j]) / sum);
      if (j === 0) n0 = n;
      for (let k = 0; k < n; k++, i++) {
        const f = k / n;
        const th = -Math.PI / 2 + f * TAU;
        const rr = radii[j] + (rnd(i, 3) - 0.5) * m * 0.012;
        const on = f <= E.frac;
        T(i, cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, on ? "brand" : "pmuted", on ? lit : dimA, on ? 2.1 : 1.5);
      }
    }
    hideFrom(i);
    const ci = Math.min(n0 - 1, Math.floor(E.frac * n0));
    ts[ci] = wide ? 5 : 4;
    ta[ci] = 1;
    const out = [];
    const left = E.end - Date.now();
    if (wide) {
      out.push(L(lab.epoch, cx, cy - m * 0.12, { f: "mono", s: 11, c: "muted", a: "center", ls: 2.5 }));
      out.push(L(String(E.epoch), cx, cy + m * 0.045, { f: "num", s: Math.round(m * 0.17), c: "ink", a: "center" }));
      out.push(L(countdown(left, false, lab.units), cx, cy + m * 0.12, { f: "mono", s: 13, c: "ink", a: "center" }));
      out.push(L(lab.untilCount, cx, cy + m * 0.165, { f: "mono", s: 10, c: "muted", a: "center", ls: 1.6 }));
      out.push(L(lab.epochDays, cx, cy + radii[0] + 34, { f: "mono", s: 10, c: "muted", a: "center", ls: 1.6 }));
    } else if (m > 170) {
      out.push(L(lab.epoch, cx, cy - m * 0.1, { f: "mono", s: 9.5, c: "muted", a: "center", ls: 2 }));
      out.push(L(String(E.epoch), cx, cy + m * 0.06, { f: "num", s: Math.round(m * 0.18), c: "ink", a: "center" }));
      out.push(L(countdown(left, true, lab.units), cx, cy + m * 0.15, { f: "mono", s: 10.5, c: "ink2", a: "center" }));
    }
    return { labels: out };
  };

  // 01: seven keys around one lock, everyone else held outside
  S.keys = (o) => {
    const { r } = o;
    const G = Math.min(r.w, r.h * 0.88) / 2;
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h * 0.46;
    const bodyY = cy + 0.1 * G;
    let i = 0;
    lockPts(520, cx, bodyY, 0.34 * G, 0.28 * G).forEach((p) => {
      T(i++, p[0], p[1], p[2] === "h" ? "ink" : "brand", p[2] === "b" ? 0.8 : 1, 1.4);
    });
    for (let j = 0; j < 7; j++) {
      const th = -Math.PI / 2 + (j * TAU) / 7;
      const bx = cx + Math.cos(th) * 0.74 * G;
      const by = cy + Math.sin(th) * 0.74 * G;
      keyPts(150, bx, by, -Math.cos(th), -Math.sin(th), 0.34 * G, 0.09 * G, 0.032 * G).forEach((p) => {
        T(i++, p[0], p[1], "ink", 0.9, 1.4);
      });
    }
    for (let k = 0; k < 760 && i < N; k++, i++) {
      const a = k * 2.399963;
      const rad = G * (0.93 + rnd(i, 6) * 0.11);
      T(i, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, "pmuted", 0.4, 1.2);
    }
    hideFrom(i);
    return {
      labels: [
        L(lab.protocolUpgrades, cx, bodyY + 0.14 * G + 20, { f: "mono", s: 10, c: "brand", a: "center", ls: 1.6, w: 600, bg: true }),
        L(lab.everyoneElse, cx + G * 0.7, cy - G * 0.74, { f: "mono", s: 10, c: "muted", a: "center", ls: 1.8, bg: true }),
        L(lab.genesisKeys, cx, r.y + r.h - 24, { f: "mono", s: 12, c: "ink", a: "center", ls: 2.5, w: 600, bg: true }),
        L(lab.genesisKeysNote, cx, r.y + r.h - 4, { f: "sans", s: 13, c: "ink2", a: "center", bg: true }),
      ],
    };
  };

  // 02 and 03: the governance wheel. Committee, DReps and stake pools inside;
  // the seven action types around them, lit once they went live.
  const ARC_EPOCH = [507, 507, 507, 537, 537, 537, 537];
  S.wheel = (o, stageName) => {
    const { r } = o;
    const narrow = W <= BP_NARROW;
    const out = [];
    const lines = [];
    let i = 0;
    const R = Math.min(r.w, r.h) / 2;
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h * 0.52;
    const sp = Math.max(3.6, R * 0.014);
    const live = stageName === "chang" ? 507 : 537;
    const dOn = stageName === "plomin";
    const z = narrow ? 1 : 1.16;
    const ring = (rad, key, a, s) => {
      const n = Math.floor((TAU * rad) / sp);
      const off = rnd(Math.round(rad), 7) * 6.28;
      for (let m = 0; m < n; m++, i++) {
        const th = off + (m / n) * TAU;
        T(i, cx + Math.cos(th) * rad, cy + Math.sin(th) * rad, key, a, s);
      }
    };
    T(i++, cx, cy, "cc", 1, narrow ? 2.4 : 3);
    for (let k = 0; k < 6; k++, i++) {
      const ca = -Math.PI / 2 + (k * Math.PI) / 3;
      T(i, cx + Math.cos(ca) * R * 0.05 * z, cy + Math.sin(ca) * R * 0.05 * z, "cc", 1, narrow ? 2.4 : 3);
    }
    ring(R * 0.17 * z, "drep", dOn ? 0.95 : 0.28, dOn ? 1.6 : 1.1);
    ring(R * 0.205 * z, "drep", dOn ? 0.95 : 0.28, dOn ? 1.6 : 1.1);
    ring(R * 0.29 * z, "spo", 0.9, 1.5);
    ring(R * 0.325 * z, "spo", 0.9, 1.5);
    ring(R * 0.36 * z, "spo", 0.9, 1.5);
    const slice = TAU / 7;
    const gap = 0.075;
    const radii = narrow ? [R * 0.47, R * 0.51, R * 0.55] : [R * 0.565, R * 0.61, R * 0.655];
    const Rl = narrow ? R * 0.64 : R * 0.74;
    const tight = narrow || r.w < 640;
    lab.arcs.forEach((arc, ak) => {
      const a0 = -Math.PI / 2 + ak * slice + gap / 2;
      const a1 = a0 + slice - gap;
      const on = ARC_EPOCH[ak] <= live;
      radii.forEach((rad) => {
        const n = Math.max(2, Math.floor(((a1 - a0) * rad) / sp));
        for (let q = 0; q < n; q++, i++) {
          const th = a0 + (q / (n - 1)) * (a1 - a0);
          T(i, cx + Math.cos(th) * rad, cy + Math.sin(th) * rad, on ? "ink" : "pmuted", on ? 0.85 : 0.3, on ? 1.7 : 1.2);
        }
      });
      const mA = (a0 + a1) / 2;
      const cs = Math.cos(mA);
      const sn = Math.sin(mA);
      out.push(
        L(tight ? arc[1] : arc[0], cx + cs * Rl, cy + sn * Rl + 4 + (sn > 0.6 ? 8 : 0), {
          f: "sans",
          s: narrow ? 10.5 : 12.5,
          c: on ? "ink" : "muted",
          w: on ? 600 : 400,
          a: cs > 0.25 ? "left" : cs < -0.25 ? "right" : "center",
        })
      );
    });
    hideFrom(i);
    const ep = dOn ? 537 : 507;
    out.push(L(dOn ? lab.plomin : lab.chang, r.x, r.y + 14, { f: "mono", s: 12, c: "ink", ls: 2.2, w: 600 }));
    out.push(
      L(upper(`${dateFmt.format(epochStart(ep))} · ${fill(lab.epochNumber, { epoch: ep })}`), r.x, r.y + 30, {
        f: "mono",
        s: 9.5,
        c: "muted",
        ls: 1.2,
      })
    );
    out.push(
      L(dOn ? lab.plominLive : lab.changLive, r.x + r.w, r.y + 14, {
        f: "mono",
        s: narrow ? 9.5 : 11,
        c: "brand",
        a: "right",
        ls: 1.4,
        w: 600,
      })
    );
    const items = dOn
      ? [
          ["cc", 1, lab.legendCommittee],
          ["spo", 1, lab.legendPools],
          ["drep", 1, lab.legendDreps],
        ]
      : [
          ["cc", 1, lab.legendInterim],
          ["spo", 1, lab.legendPools],
          ["drep", 0.35, lab.legendDrepsWaiting],
        ];
    let ly = r.y + r.h - (narrow ? 22 : 8);
    let lx = r.x;
    items.forEach((it, n) => {
      const lo = { f: "sans", s: narrow ? 10.5 : 12, c: it[1] < 1 ? "muted" : "ink2" };
      if (narrow && n === 2) {
        ly += 16;
        lx = r.x;
      }
      lines.push({ dot: true, x1: lx + 4, y1: ly - 4, c: it[0], o: it[1] });
      out.push(L(it[2], lx + 13, ly, lo));
      lx += textW(it[2], lo) + 34;
    });
    return { labels: out, lines, center: [cx, cy, R * 0.66] };
  };

  // 04: your ada stays put; at each epoch boundary its weight is counted with your DRep
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

  // 05: two independent delegations
  S.two = (o) => {
    const { r, t, m } = o;
    const NB = Math.min(N, 1400);
    const w0 = [r.x + r.w * 0.14, r.y + r.h * 0.5];
    const pc = [r.x + r.w * 0.8, r.y + r.h * 0.22];
    const dc = [r.x + r.w * 0.8, r.y + r.h * 0.72];
    const c1 = [r.x + r.w * 0.46, r.y + r.h * 0.08];
    const c2 = [r.x + r.w * 0.46, r.y + r.h * 0.92];
    const rw = m * 0.1;
    const rp = m * 0.115;
    const n = [0.16, 0.13, 0.22, 0.13, 0.22].map((f) => Math.floor(f * NB));
    const spd = reduce ? 0 : 0.00009;
    let i = 0;
    for (let k = 0; k < n[0]; k++, i++) {
      const p = phyllo(k, n[0], w0[0], w0[1], rw);
      T(i, p[0], p[1], "ink2", 0.9, 1.7);
    }
    for (let k = 0; k < n[1]; k++, i++) {
      const tt = (rnd(i, 3) + t * spd * (0.7 + rnd(i, 4) * 0.6)) % 1;
      const p = bez(tt, w0, c1, pc);
      const j = (rnd(i, 5) - 0.5) * m * 0.035;
      T(i, p[0] + j, p[1] + j, "ink2", 0.8, 1.4, "spo", tt);
    }
    for (let k = 0; k < n[2]; k++, i++) {
      const p = phyllo(k, n[2], pc[0], pc[1], rp);
      T(i, p[0], p[1], "spo", 0.95, 1.7);
    }
    for (let k = 0; k < n[3]; k++, i++) {
      const tt = (rnd(i, 3) + t * spd * (0.7 + rnd(i, 4) * 0.6)) % 1;
      const p = bez(tt, w0, c2, dc);
      const j = (rnd(i, 5) - 0.5) * m * 0.035;
      T(i, p[0] + j, p[1] - j, "ink2", 0.8, 1.4, "drep", tt);
    }
    for (let k = 0; k < n[4]; k++, i++) {
      const p = phyllo(k, n[4], dc[0], dc[1], rp);
      T(i, p[0], p[1], "drep", 0.95, 1.7);
    }
    for (; i < NB; i++) scatter(i, r, "pmuted", 0.12, 1.1);
    hideFrom(i);
    const narrow = W <= BP_NARROW;
    return {
      labels: [
        L(lab.yourWallet, w0[0], w0[1] + rw + 22, { f: "mono", s: 11, c: "ink", a: "center", ls: 1.6, w: 600, bg: true }),
        L(lab.stakePool, pc[0], pc[1] + rp + 22, { f: "mono", s: 11, c: "spo", a: "center", ls: 1.6, w: 600 }),
        L(lab.securityRewards, pc[0], pc[1] + rp + 40, { f: "sans", s: 12, c: "ink2", a: "center" }),
        L(lab.drep, dc[0], dc[1] + rp + 22, { f: "mono", s: 11, c: "drep", a: "center", ls: 1.6, w: 600 }),
        L(lab.yourVoice, dc[0], dc[1] + rp + 40, { f: "sans", s: 12, c: "ink2", a: "center" }),
        L(
          lab.sameAda,
          narrow ? r.x + r.w / 2 : r.x + r.w * 0.47,
          narrow ? r.y + r.h - 2 : r.y + r.h * 0.5 + 4,
          { f: "sans", s: 12, c: "muted", a: "center", bg: true }
        ),
      ],
    };
  };

  // 06 to 08: three circles, one dot per member. Committee at the core, DReps
  // around it, stake pools around both. Live counts replace the snapshot when
  // the site's data service answers.
  const counts = () => storyCounts((getLive && getLive()) || {});
  S.rings = (o) => {
    const { r, wide, t } = o;
    const v = o.variant || "";
    const out = [];
    const lines = [];
    let i = 0;
    const cnt = counts();
    const Rmax = wide ? Math.min(r.w * 0.36, r.h * 0.44) : Math.min(r.w * 0.5, r.h * 0.36);
    const unitD = ringPts(cnt.dreps, 3.2, 1, 0, 0);
    const unitS = ringPts(cnt.pools, unitD.outer + 2, 1, 0, 0);
    const p = Rmax / (unitS.outer + 1);
    const cx = wide ? r.x + Rmax + 8 : r.x + r.w / 2;
    const cy = wide ? r.y + r.h * 0.53 : r.y + r.h * 0.56;
    const ds = Math.max(0.9, Math.min(2.4, p * 0.3));
    const el = v === "elect";
    const rm = v === "remove";
    const focus = el || rm;
    const nC = cnt.committee;
    const cRad = p * Math.max(1.1, (nC - 1) / 5.5);
    const ccPts = [[cx, cy]];
    for (let k = 0; k < nC - 1; k++) {
      const a = -Math.PI / 2 + (k * TAU) / (nC - 1);
      ccPts.push([cx + Math.cos(a) * cRad, cy + Math.sin(a) * cRad]);
    }
    const dr = ringPts(cnt.dreps, p * 3.2, p, cx, cy);
    const sp = ringPts(cnt.pools, dr.outer + p * 2, p, cx, cy);
    dr.pts.forEach((q) => {
      T(i++, q[0], q[1], "drep", focus ? 0.3 : 0.95, ds);
    });
    sp.pts.forEach((q) => {
      T(i++, q[0], q[1], "spo", focus ? 0.24 : 0.85, ds);
    });
    const pulse = reduce ? 0.5 : Math.sin(t * 0.004) * 0.5 + 0.5;
    ccPts.forEach((q, j) => {
      if (rm) {
        const aa = -1.0 + j * 0.1;
        const rr = sp.outer + p * (2.6 + (j % 2) * 1.3);
        T(i++, cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr, "pmuted", 0.7, ds * 1.3);
      } else {
        T(i++, q[0], q[1], "cc", 1, el ? ds * (1.3 + pulse * 0.7) : ds * 1.15);
      }
    });
    if (focus) {
      const spd = reduce ? 0 : 0.00022;
      for (let k = 0; k < 420 && i < N; k++, i++) {
        const fromD = k % 3 === 0;
        const a0 = rnd(k, 61) * TAU;
        const r0 = fromD
          ? dr.inner + rnd(k, 62) * (dr.outer - dr.inner)
          : sp.inner + rnd(k, 62) * (sp.outer - sp.inner);
        const tt = reduce ? rnd(k, 63) : (rnd(k, 63) + t * spd * (0.8 + rnd(k, 64) * 0.4)) % 1;
        const e = tt * tt;
        const rr2 = r0 + (p * 1.8 - r0) * e;
        const a2 = a0 + e * 0.35;
        T(
          i,
          cx + Math.cos(a2) * rr2,
          cy + Math.sin(a2) * rr2,
          fromD ? "drep" : "spo",
          0.95 * (1 - Math.max(0, tt - 0.8) * 5),
          Math.max(1.6, ds * 1.05),
          el ? "cc" : "no",
          el ? e : Math.min(1, tt * 2.2)
        );
      }
    }
    hideFrom(i);
    lines.push({ circle: true, x1: cx, y1: cy, rad: cRad + p * 1.1, c: rm ? "no" : "cc", dash: [3, 4], o: rm ? 0.95 : 0.6, w: rm ? 1.6 : 1 });
    lines.push({ circle: true, x1: cx, y1: cy, rad: dr.outer + p, c: "drep", dash: [3, 5], o: focus ? 0.3 : 0.5 });
    lines.push({ circle: true, x1: cx, y1: cy, rad: sp.outer + p, c: "spo", dash: [3, 5], o: focus ? 0.3 : 0.5 });
    const ccSub = el ? lab.votedIn : rm ? lab.removed : fill(lab.committeeMembers, { count: numFmt.format(nC) });
    const drSub = fill(lab.drepsActive, { count: numFmt.format(cnt.dreps) });
    const spSub = fill(lab.poolsWithStake, { count: numFmt.format(cnt.pools) });
    if (wide) {
      const lx = cx + Rmax + 26;
      const rows = [
        [cy - 70, lab.committee, ccSub, rm ? "muted" : "cc", cRad + p * 1.1],
        [cy, lab.dreps, drSub, "drep", dr.outer + p],
        [cy + 70, lab.stakePools, spSub, "spo", sp.outer + p],
      ];
      rows.forEach((rw) => {
        const ang = Math.atan2(rw[0] - 4 - cy, lx - cx);
        const ex = cx + Math.cos(ang) * rw[4];
        const ey = cy + Math.sin(ang) * rw[4];
        lines.push({ x1: lx - 8, y1: rw[0] - 4, x2: ex, y2: ey, c: rw[3], dash: [2, 3], o: 0.6 });
        lines.push({ dot: true, x1: ex, y1: ey, c: rw[3], o: 0.9 });
        out.push(L(rw[1], lx, rw[0], { f: "mono", s: 11, c: rw[3], ls: 1.8, w: 600 }));
        out.push(L(rw[2], lx, rw[0] + 17, { f: "sans", s: 12.5, c: "ink2" }));
      });
      if (!focus) out.push(L(lab.oneDotOneMember, lx, cy + Rmax - 4, { f: "mono", s: 9.5, c: "muted", ls: 1.4 }));
    } else if (!focus) {
      out.push(L(`${lab.committee} · ${upper(ccSub)}`, r.x, r.y + 12, { f: "mono", s: 10, c: "cc", ls: 1.2, w: 600 }));
      out.push(L(`${lab.dreps} · ${upper(drSub)}`, r.x, r.y + 28, { f: "mono", s: 10, c: "drep", ls: 1.2, w: 600 }));
      out.push(L(`${lab.stakePools} · ${numFmt.format(cnt.pools)}`, r.x, r.y + 44, { f: "mono", s: 10, c: "spo", ls: 1.2, w: 600 }));
      out.push(L(lab.oneDotOneMember, r.x + r.w, r.y + 12, { f: "mono", s: 9, c: "muted", a: "right", ls: 1.2 }));
    }
    if (focus) {
      out.push(L(el ? lab.updateCommittee : lab.noConfidence, r.x, r.y + 12, { f: "mono", s: 11, c: el ? "cc" : "no", ls: 2, w: 600 }));
      out.push(L(el ? lab.updateCommitteeNote : lab.noConfidenceNote, r.x, r.y + 30, { f: "sans", s: wide ? 13 : 11.5, c: "ink2" }));
    }
    if (rm) {
      out.push(L(lab.noCommittee, cx, cy + 4, { f: "mono", s: 9.5, c: "no", a: "center", ls: 1.2, w: 600, bg: true }));
      out.push(
        L(lab.removedCaps, cx + Math.cos(-0.7) * (sp.outer + p * 4.2) + 10, cy + Math.sin(-0.7) * (sp.outer + p * 4.2) - 6, {
          f: "mono",
          s: 9.5,
          c: "muted",
          ls: 1.4,
          w: 600,
        })
      );
    }
    return { labels: out, lines, center: [cx, cy, sp.outer] };
  };

  // 09: where the voting power sits (ledger snapshot)
  S.power = (o) => {
    const { r } = o;
    const P = SNAPSHOT.power;
    const data = [
      ["drep", P.activeDreps, 0.95],
      ["drep", P.inactiveDreps, 0.28],
      ["no", P.alwaysNoConfidence, 0.9],
      ["abstain", P.alwaysAbstain, 0.8],
    ];
    const total = P.total;
    const cnts = data.map((d) => Math.round((N * d[1]) / total));
    cnts[3] += N - cnts.reduce((a, b) => a + b, 0);
    const narrow = W <= BP_NARROW;
    const stack = narrow || r.w * 0.32 < 185;
    const yT = r.y + (narrow ? 12 : r.h * 0.07);
    const yBig = yT + (narrow ? 30 : 40);
    const yLab = yBig + (narrow ? 22 : 34);
    const y0 = yLab + (stack ? 26 : 12);
    const gh = Math.min(r.h * 0.54, r.y + r.h - 48 - y0);
    const R = Math.max(8, Math.round(Math.sqrt((N * gh) / r.w)));
    const cols = Math.ceil(N / R);
    const cell = Math.min(r.w / cols, gh / R);
    const x0 = r.x + (r.w - cols * cell) / 2;
    let i = 0;
    const starts = [];
    data.forEach((d, j) => {
      starts.push(i);
      for (let k = 0; k < cnts[j]; k++, i++) {
        const c = Math.floor(i / R);
        const rw = i % R;
        T(i, x0 + (c + 0.5) * cell, y0 + (rw + 0.5) * cell, d[0], d[2], Math.max(0.9, cell * 0.34));
      }
    });
    const xA = x0 + Math.floor(starts[3] / R) * cell;
    const big = { f: "num", s: narrow ? 28 : 40, c: "ink" };
    const bigText = fill(lab.billions, { amount: dec(total, 2) });
    return {
      labels: [
        L(lab.delegatedForGovernance, x0, yT, { f: "mono", s: 11, c: "muted", ls: 1.6 }),
        L(bigText, x0, yBig, big),
        L(fill(lab.perDot, { amount: dec((total * 1000) / N, 1) }), x0 + textW(bigText, big) + 14, yBig - 3, {
          f: "sans",
          s: 12,
          c: "muted",
        }),
        L(lab.activeDreps, x0, yLab, { f: "mono", s: 11, c: "drep", ls: 1.2, w: 600 }),
        L(lab.alwaysAbstain, stack ? x0 : xA, stack ? yLab + 14 : yLab, { f: "mono", s: 11, c: "muted", ls: 1.2, w: 600 }),
        L(lab.theseDecide, x0, y0 + R * cell + 22, { f: "sans", s: 12, c: "drep", w: 600 }),
        L(lab.powerRest, x0, y0 + R * cell + 40, { f: "sans", s: 12, c: "muted" }),
      ],
    };
  };

  // 10: a governance action document with its deposit seal
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

  // 11: how No and silence behave. The August 2026 treasury withdrawal, DRep vote.
  S.tally = (o) => {
    const { r } = o;
    const narrow = W <= BP_NARROW;
    const out = [];
    const lines = [];
    let i = 0;
    const V = SNAPSHOT.tally;
    const tot = V.yes + V.no + V.noConfidence + V.silent + V.abstain + V.alwaysAbstain;
    const cntd = V.yes + V.no + V.noConfidence + V.silent;
    const nC = Math.round((N * cntd) / tot);
    const ny = Math.round((N * V.yes) / tot);
    const nn = Math.max(1, Math.round((N * V.no) / tot));
    const nnc = Math.round((N * V.noConfidence) / tot);
    const nA = N - nC;
    const nab = Math.round((N * V.abstain) / tot);
    const R = narrow ? 10 : 12;
    const cols = Math.ceil(nC / R);
    const cell = Math.min(r.w / cols, (r.h * 0.2) / R);
    const R2 = Math.ceil(nA / cols);
    const gw = cols * cell;
    const x0 = r.x + (r.w - gw) / 2;
    const yC = r.y + r.h * 0.2;
    const bh = R * cell;
    const yA = yC + bh + (narrow ? 78 : 88);
    const ds = Math.max(0.9, cell * 0.34);
    for (let b = 0; b < nC; b++, i++) {
      const key = b < ny ? "yes" : "no";
      const a = b < ny ? 0.95 : b < ny + nn ? 0.95 : b < ny + nn + nnc ? 0.7 : 0.36;
      T(i, x0 + (Math.floor(b / R) + 0.5) * cell, yC + ((b % R) + 0.5) * cell, key, a, ds);
    }
    for (let b = 0; b < nA; b++, i++) {
      T(i, x0 + (Math.floor(b / R2) + 0.5) * cell, yA + ((b % R2) + 0.5) * cell, "abstain", b < nab ? 0.85 : 0.5, ds);
    }
    const xt = x0 + ((0.67 * nC) / R) * cell;
    const xr = x0 + (ny / R) * cell;
    const yB = yC + bh;
    lines.push({ x1: xt, y1: yC - 12, x2: xt, y2: yB + 6, c: "ink", o: 0.9, w: 1.6 });
    lines.push({ x1: xr, y1: yB + 5, x2: x0 + gw, y2: yB + 5, c: "no", o: 0.8, w: 1.4 });
    out.push(L(narrow ? lab.tallyTitleShort : lab.tallyTitle, x0, r.y + r.h * 0.04, { f: "mono", s: 10, c: "muted", ls: 0.6 }));
    out.push(L(lab.tallyYesShare, x0, yC - 22, { f: "num", s: narrow ? 22 : 30, c: "yes", w: 400 }));
    out.push(L(lab.tallyNeeded, xt, yC - 18, { f: "mono", s: 10, c: "ink", a: "center", ls: 1.2, w: 600, bg: true }));
    out.push(L(lab.tallyCounted, x0 + gw, yC - (narrow ? 34 : 38), { f: "mono", s: 10, c: "muted", a: "right", ls: 1.2 }));
    out.push(L(lab.tallyYes, x0, yB + 20, { f: "mono", s: 10.5, c: "yes", w: 600 }));
    out.push(L(lab.tallyCountsAsNo, x0 + gw, yB + 20, { f: "mono", s: 10.5, c: "no", a: "right", w: 600 }));
    if (narrow) {
      out.push(L(lab.tallyNoPartsShort, x0 + gw, yB + 35, { f: "sans", s: 10.5, c: "ink2", a: "right" }));
      out.push(L(lab.tallySilent, x0 + gw, yB + 50, { f: "sans", s: 10.5, c: "no", a: "right", w: 600 }));
    } else {
      const so = { f: "sans", s: 12, c: "no", a: "right", w: 600 };
      out.push(L(lab.tallyNoParts, x0 + gw - textW(lab.tallySilent, so) - 6, yB + 37, { f: "sans", s: 12, c: "ink2", a: "right" }));
      out.push(L(lab.tallySilent, x0 + gw, yB + 37, so));
    }
    out.push(L(lab.tallyLeftOut, x0, yA - 10, { f: "mono", s: 10.5, c: "muted", ls: 1.2, w: 600 }));
    const yE = yA + R2 * cell;
    out.push(L(lab.tallyAbstainParts, x0, yE + 18, { f: "sans", s: narrow ? 10.5 : 12, c: "muted" }));
    if (narrow) {
      out.push(L(lab.tallyInsight1, x0, yE + 40, { f: "sans", s: 11.5, c: "ink", w: 600 }));
      out.push(L(lab.tallyInsight2, x0, yE + 56, { f: "sans", s: 11.5, c: "ink", w: 600 }));
    } else {
      out.push(L(lab.tallyInsight, x0, yE + 46, { f: "sans", s: 13.5, c: "ink", w: 600 }));
    }
    return { labels: out, lines };
  };

  // 12: the next epochs, live
  S.timeline = (o) => {
    const { r, E } = o;
    const narrow = W <= BP_NARROW;
    const cols = 8;
    const colw = r.w / cols;
    const per = Math.min(Math.floor(N * 0.1), narrow ? 72 : 150);
    const gx = narrow ? 4 : 6;
    const gy = Math.ceil(per / gx);
    const bh = r.h * 0.44;
    const cell = Math.min((colw * 0.62) / gx, bh / gy);
    const yTop = r.y + r.h * 0.24;
    let i = 0;
    const out = [];
    const lines = [];
    for (let c = 0; c < cols; c++) {
      const cxc = r.x + colw * (c + 0.5);
      const x0 = cxc - (gx * cell) / 2;
      const key = c === 0 ? "brand" : c <= 6 ? "drep" : "pmuted";
      const a = c === 0 ? 1 : c <= 6 ? 0.92 - (c - 1) * 0.07 : 0.35;
      for (let k = 0; k < per; k++, i++) {
        T(i, x0 + ((k % gx) + 0.5) * cell, yTop + bh - (Math.floor(k / gx) + 0.5) * cell, key, a, Math.max(1.1, cell * 0.32));
      }
      out.push(L(String(E.epoch + c), cxc, yTop + bh + 22, { f: "mono", s: 11, c: c === 0 ? "brand" : "ink", a: "center", w: c === 0 ? 600 : 500 }));
      out.push(L(fmtDay(epochStart(E.epoch + c)), cxc, yTop + bh + 38, { f: "mono", s: 9.5, c: "muted", a: "center" }));
    }
    faintRest(i, r, 200);
    const bx1 = r.x + colw + 6;
    const bx2 = r.x + colw * 7 - 6;
    const by = yTop - 22;
    lines.push({ x1: bx1, y1: by, x2: bx2, y2: by, c: "drep", o: 0.8 });
    lines.push({ x1: bx1, y1: by, x2: bx1, y2: by + 8, c: "drep", o: 0.8 });
    lines.push({ x1: bx2, y1: by, x2: bx2, y2: by + 8, c: "drep", o: 0.8 });
    out.push(L(narrow ? lab.moreEpochsShort : lab.moreEpochs, (bx1 + bx2) / 2, by - 8, { f: "mono", s: 10, c: "drep", a: "center", ls: 1.4, w: 600 }));
    out.push(L(lab.now, r.x + colw * 0.5, yTop - 10, { f: "mono", s: 10, c: "brand", a: "center", ls: 1.6, w: 600 }));
    out.push(L(lab.expired, r.x + colw * 7.5, yTop - 10, { f: "mono", s: 9.5, c: "muted", a: "center", ls: 1.2 }));
    out.push(L(lab.ratifiedEnacted, r.x + r.w / 2, r.y + r.h * 0.95, { f: "sans", s: 12.5, c: "ink2", a: "center" }));
    return { labels: out, lines };
  };

  // 13: the constitution's ten tenets
  S.tenets = (o) => {
    const { r, m, wide } = o;
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h * 0.48;
    const R1 = m * (wide ? 0.32 : 0.27);
    const R0 = m * 0.075;
    const nCore = Math.min(Math.floor(N * 0.2), 380);
    const per = Math.min(Math.floor(N * 0.065), 90);
    let i = 0;
    const out = [];
    for (let k = 0; k < nCore; k++, i++) {
      const p = phyllo(k, nCore, cx, cy, R0);
      T(i, p[0], p[1], "brand", 0.95, 1.5);
    }
    for (let s = 0; s < 10; s++) {
      const th = -Math.PI / 2 + (s * Math.PI) / 5;
      const cs = Math.cos(th);
      const sn = Math.sin(th);
      const half = Math.ceil(per / 2);
      for (let k = 0; k < per; k++, i++) {
        const lane = k % 2;
        const u = Math.floor(k / 2) / Math.max(1, half - 1);
        const rad = R0 * 1.5 + u * (R1 - R0 * 1.5);
        const off = (lane - 0.5) * m * 0.014;
        T(i, cx + cs * rad - sn * off, cy + sn * rad + cs * off, "brand", 0.95 - u * 0.35, 1.5);
      }
      const lr = R1 + 16;
      out.push(
        L(wide && r.w >= 560 ? lab.tenets[s][0] : lab.tenets[s][1], cx + cs * lr, cy + sn * lr + 4 + (sn > 0.5 ? 8 : 0), {
          f: "sans",
          s: wide ? 12.5 : 11,
          c: "ink2",
          a: cs > 0.25 ? "left" : cs < -0.25 ? "right" : "center",
          w: 500,
        })
      );
    }
    faintRest(i, r, 160);
    out.push(L(lab.tenetsCaption, cx, Math.min(r.y + r.h - 4, cy + R1 + 58), { f: "mono", s: 10, c: "muted", a: "center", ls: 1.6 }));
    return { labels: out };
  };

  // 14: treasury flows
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
    const balance = fill(lab.treasuryBalance, { amount: dec(counts().treasury / 1e9, 2) });
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

  // 15: the three groups in motion around you
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
    clock: { fn: S.clock, dyn: true },
    keys: { fn: S.keys },
    chang: { fn: (o) => S.wheel(o, "chang"), grow: true, noGrowFrom: "plomin", labelDelay: 1300 },
    plomin: { fn: (o) => S.wheel(o, "plomin"), spin: -Math.PI / 2 + (3 * TAU) / 7 },
    weight: { fn: S.weight, dyn: true },
    two: { fn: S.two, dyn: true },
    rings: { fn: S.rings, grow: true, labelDelay: 1500 },
    elect: { fn: (o) => S.rings({ ...o, variant: "elect" }), dyn: true },
    remove: { fn: (o) => S.rings({ ...o, variant: "remove" }), dyn: true },
    power: { fn: S.power },
    proposal: { fn: S.proposal },
    tally: { fn: S.tally },
    timeline: { fn: S.timeline },
    tenets: { fn: S.tenets },
    treasury: { fn: S.treasury, dyn: true },
    finale: { fn: S.finale, dyn: true },
    dim: { fn: S.dim, dyn: true },
  };

  let scene = "clock";
  let sceneAt = performance.now();
  let built = { labels: [] };
  function build(name, now) {
    const r = regionFor(name);
    return SCENES[name].fn({ r, m: Math.min(r.w, r.h), t: now, wide: W > BP_WIDE, E: epochInfo() }) || {};
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
  function colorOf(key, text) {
    const k = text && TEXT_KEY[key] ? TEXT_KEY[key] : key;
    return C[K[k]] || C[K.ink];
  }
  function drawLabel(l, a) {
    if (!l.t || a <= 0) return;
    ctx.globalAlpha = a * (l.o == null ? 1 : l.o);
    ctx.font = fontOf(l);
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${l.ls || 0}px`;
    const tw = ctx.measureText(l.t).width;
    let x = l.a === "center" ? l.x - tw / 2 : l.a === "right" ? l.x - tw : l.x;
    x = Math.max(10, Math.min(W - 10 - tw, x));
    if (l.bg) {
      const s = l.s || 11;
      const bgc = C[K.bg];
      ctx.fillStyle = `rgba(${bgc[0]},${bgc[1]},${bgc[2]},0.86)`;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - 7, l.y - s * 1.05, tw + 14, s * 1.6, 3);
      else ctx.rect(x - 7, l.y - s * 1.05, tw + 14, s * 1.6);
      ctx.fill();
    }
    ctx.fillStyle = rgb(colorOf(l.c || "ink", true));
    ctx.fillText(l.t, x, l.y);
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
