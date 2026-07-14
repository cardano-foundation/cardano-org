import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./ai.module.css";

const SNIPPETS = {
  claude: {
    label: translate({ id: "ai.getStarted.tabClaude", message: "Claude Code (recommended)" }),
    code: `/plugin marketplace add cardano-foundation/cardano-dev-skills
/plugin install cardano-dev-skills@cardano-dev-skills`,
  },
  other: {
    label: translate({ id: "ai.getStarted.tabOther", message: "Codex / other agents" }),
    code: `git clone https://github.com/cardano-foundation/cardano-dev-skills.git
cd your-project
ln -s ../cardano-dev-skills/skills .agents/skills`,
  },
};

const PILLARS = [
  {
    num: "01",
    title: translate({ id: "ai.why.p1.title", message: "Trust & Security" }),
    items: [
      translate({ id: "ai.why.p1.item1", message: "Formal methods" }),
      translate({ id: "ai.why.p1.item2", message: "Secure smart contracts" }),
      translate({ id: "ai.why.p1.item3", message: "High assurance infrastructure" }),
    ],
    why: translate({
      id: "ai.why.p1.why",
      message: "Agents need infrastructure they can rely on when handling money and agreements.",
    }),
    ill: "trust",
  },
  {
    num: "02",
    title: translate({ id: "ai.why.p2.title", message: "Decentralized Identity" }),
    items: [
      translate({ id: "ai.why.p2.item1", message: "DIDs" }),
      translate({ id: "ai.why.p2.item2", message: "Verifiable Credentials" }),
      translate({ id: "ai.why.p2.item3", message: "Reputation & attestations" }),
    ],
    why: translate({
      id: "ai.why.p2.why",
      message:
        "Agents need to prove who they are, what they're allowed to do, and build reputation over time.",
    }),
    ill: "identity",
  },
  {
    num: "03",
    title: translate({ id: "ai.why.p3.title", message: "Native Assets & Tokenization" }),
    items: [
      translate({ id: "ai.why.p3.item1", message: "Native assets without smart contracts" }),
      translate({ id: "ai.why.p3.item2", message: "Tokenized money, RWAs, memberships, licenses" }),
      translate({ id: "ai.why.p3.item3", message: "Efficient asset transfers" }),
    ],
    why: translate({
      id: "ai.why.p3.why",
      message: "Agents need to own, exchange, and manage digital assets, not just send payments.",
    }),
    ill: "assets",
  },
  {
    num: "04",
    title: translate({ id: "ai.why.p4.title", message: "Predictable & Decentralized Infrastructure" }),
    items: [
      translate({ id: "ai.why.p4.item1", message: "eUTxO" }),
      translate({ id: "ai.why.p4.item2", message: "Predictable fees and execution" }),
      translate({ id: "ai.why.p4.item3", message: "Permissionless, censorship-resistant network" }),
    ],
    why: translate({
      id: "ai.why.p4.why",
      message:
        "Autonomous systems need infrastructure that's reliable, open, and economically predictable.",
    }),
    ill: "eutxo",
  },
];

const COMPARE_ROWS = [
  {
    name: translate({ id: "ai.x402.row1.name", message: "Normal Address Payments" }),
    desc: translate({
      id: "ai.x402.row1.desc",
      message: "A direct payment to a wallet address. The baseline every chain supports.",
    }),
    cols: [true, true, true],
  },
  {
    name: translate({ id: "ai.x402.row2.name", message: "Refunds" }),
    desc: translate({
      id: "ai.x402.row2.desc",
      message: "Nothing delivered? The escrowed payment goes back to the client automatically.",
    }),
    cols: [false, false, true],
  },
  {
    name: translate({ id: "ai.x402.row3.name", message: "Decision Logging" }),
    desc: translate({
      id: "ai.x402.row3.desc",
      message: "Payment decisions are recorded on-chain, decentralised and auditable.",
    }),
    cols: [false, false, true],
  },
];

const COMPARE_ROWS_EXTRA = [
  {
    name: translate({ id: "ai.x402.row4.name", message: "Discovery" }),
    desc: translate({
      id: "ai.x402.row4.desc",
      message:
        "A public registry of every agent: search by what they do, check their track record, and call them through the API.",
    }),
    cols: [false, false, true],
  },
  {
    name: translate({ id: "ai.x402.row5.name", message: "Identity" }),
    desc: translate({
      id: "ai.x402.row5.desc",
      message:
        "Every agent gets a decentralized ID and a reputation score, so you can verify who you are working with.",
    }),
    cols: [false, false, true],
  },
];

// ---------------------------------------------------------------------------
// Animated pillar illustrations (pure SVG + CSS)
// ---------------------------------------------------------------------------

// 01: a shield assembled from pixels; a proof-check draws itself
const SHIELD_ROWS = [
  [0, 6],
  [0, 6],
  [0, 6],
  [0, 6],
  [1, 5],
  [2, 4],
  [3, 3],
];

function IllTrust() {
  const cell = 19;
  const size = 15;
  const x0 = (320 - 7 * cell) / 2;
  const y0 = 32;
  const pixels = [];
  SHIELD_ROWS.forEach((range, row) => {
    for (let col = range[0]; col <= range[1]; col += 1) {
      pixels.push({ x: x0 + col * cell, y: y0 + row * cell, d: (col + row * 1.6) * 0.14 });
    }
  });
  return (
    <svg viewBox="0 0 320 220" className={styles.ill} aria-hidden="true">
      {pixels.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={size}
          height={size}
          className={styles.shieldPix}
          style={{ animationDelay: `${p.d}s` }}
        />
      ))}
      <path d="M136 102 L156 122 L192 78" className={styles.proofCheck} />
    </svg>
  );
}

// 02: an agent passport being scanned, then verified
function IllIdentity() {
  return (
    <svg viewBox="0 0 320 220" className={styles.ill} aria-hidden="true">
      <rect x="70" y="48" width="180" height="130" rx="10" className={styles.idCard} />
      {/* pixel avatar */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) =>
          (r + c) % 2 === 0 ? (
            <rect
              key={`${r}-${c}`}
              x={88 + c * 12}
              y={66 + r * 12}
              width="10"
              height="10"
              className={styles.idAvatarPix}
            />
          ) : null
        )
      )}
      {/* credential lines */}
      <rect x="136" y="68" width="92" height="9" rx="2" className={styles.idShape} />
      <rect x="136" y="84" width="70" height="9" rx="2" className={styles.idShape} />
      <rect x="136" y="100" width="52" height="9" rx="2" className={styles.idShape} />
      <rect x="88" y="146" width="120" height="9" rx="2" className={styles.idShape} />
      {/* scan beam */}
      <rect x="70" y="48" width="180" height="26" rx="4" className={styles.scanBeam} />
      {/* verified badge */}
      <g className={styles.idBadge}>
        <circle cx="250" cy="48" r="17" fill="var(--ill-accent)" />
        <path
          d="M242 48 L248 54 L259 42"
          fill="none"
          stroke="#fff"
          strokeWidth="3.5"
          strokeLinecap="square"
        />
      </g>
    </svg>
  );
}

// pixel-block helper: a rows-by-cols grid of squares with checkered opacity
function PixBlock({ x, y, rows = 3, cols = 3, cell = 11, gap = 3, className, opacities }) {
  const rects = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const o = opacities ? opacities[(r * cols + c) % opacities.length] : (r + c) % 2 === 0 ? 0.85 : 0.4;
      rects.push(
        <rect
          key={`${r}-${c}`}
          x={x + c * (cell + gap)}
          y={y + r * (cell + gap)}
          width={cell}
          height={cell}
          className={className}
          style={{ opacity: o }}
        />
      );
    }
  }
  return <g>{rects}</g>;
}

// 03: native pixel tokens (money, assets, licenses) moving wallet to wallet
function IllAssets() {
  const rail = [];
  for (let x = 80; x <= 240; x += 16) {
    rail.push(<rect key={x} x={x} y={108.5} width="5" height="5" className={styles.railPix} />);
  }
  return (
    <svg viewBox="0 0 320 220" className={styles.ill} aria-hidden="true">
      <PixBlock x={26} y={92} className={styles.walletPix} />
      <PixBlock x={255} y={92} className={styles.walletPix} />
      {rail}
      {/* square token */}
      <rect
        x="65"
        y="104"
        width="14"
        height="14"
        className={styles.token}
        style={{ animationDelay: "0s" }}
      />
      {/* diamond token (rotated square inside a travelling group) */}
      <g className={`${styles.token} ${styles.tokenB}`} style={{ animationDelay: "1.4s" }}>
        <rect x="65" y="104" width="14" height="14" transform="rotate(45 72 111)" />
      </g>
      {/* 2x2 cluster token */}
      <g className={`${styles.token} ${styles.tokenC}`} style={{ animationDelay: "2.8s" }}>
        <rect x="65" y="104" width="6" height="6" />
        <rect x="73" y="104" width="6" height="6" />
        <rect x="65" y="112" width="6" height="6" />
        <rect x="73" y="112" width="6" height="6" />
      </g>
    </svg>
  );
}

// 04: eUTxO, pixel inputs to pixel transaction to pixel outputs on a steady beat
const EDGE_TRAILS = [
  [[79, 75], [94, 82], [109, 89], [124, 96]],
  [[79, 147], [94, 140], [109, 133], [124, 126]],
  [[208, 97], [220, 90], [232, 83], [244, 76]],
  [[208, 125], [220, 132], [232, 139], [244, 146]],
];

function IllEutxo() {
  return (
    <svg viewBox="0 0 320 220" className={styles.ill} aria-hidden="true">
      {EDGE_TRAILS.map((trail, t) =>
        trail.map(([x, y]) => (
          <rect key={`${t}-${x}`} x={x} y={y} width="5" height="5" className={styles.edgePix} />
        ))
      )}
      {/* inputs: solid pixel clusters */}
      <PixBlock x={32} y={52} rows={2} cols={2} cell={13} className={styles.uPixIn} opacities={[0.9, 0.55, 0.55, 0.9]} />
      <PixBlock x={32} y={140} rows={2} cols={2} cell={13} className={styles.uPixIn} opacities={[0.55, 0.9, 0.9, 0.55]} />
      {/* the transaction: a 3x3 pixel cluster with a solid core */}
      <g className={styles.txNode}>
        <PixBlock
          x={146}
          y={89}
          rows={3}
          cols={3}
          cell={13}
          className={styles.txPix}
          opacities={[0.45, 0.65, 0.45, 0.65, 1, 0.65, 0.45, 0.65, 0.45]}
        />
      </g>
      {/* outputs: faint pixel clusters, the new UTXOs */}
      <PixBlock x={258} y={52} rows={2} cols={2} cell={13} className={styles.uPixOut} opacities={[1]} />
      <PixBlock x={258} y={140} rows={2} cols={2} cell={13} className={styles.uPixOut} opacities={[1]} />
      {/* moving pixel pulses */}
      <rect x="60" y="62" width="8" height="8" className={`${styles.utxoDot} ${styles.dotInA}`} />
      <rect x="60" y="150" width="8" height="8" className={`${styles.utxoDot} ${styles.dotInB}`} />
      <rect x="189" y="106" width="8" height="8" className={`${styles.utxoDot} ${styles.dotOutA}`} />
      <rect x="189" y="108" width="8" height="8" className={`${styles.utxoDot} ${styles.dotOutB}`} />
    </svg>
  );
}

const ILLUSTRATIONS = {
  trust: IllTrust,
  identity: IllIdentity,
  assets: IllAssets,
  eutxo: IllEutxo,
};

// ---------------------------------------------------------------------------
// Animated pixel field
// ---------------------------------------------------------------------------

const PIXEL_COLORS = [
  [255, 255, 255],
  [255, 255, 255],
  [210, 218, 235],
  [160, 172, 195],
];

function PixelField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const CELL = 18;
    const SIZE = 12;
    let cols = 0;
    let rows = 0;
    let cells = [];
    let raf = 0;

    const weight = (x, y) => {
      // denser toward the top-right, sparse where the headline sits
      const wx = Math.pow(x / Math.max(cols - 1, 1), 2.2);
      const wy = 1 - 0.55 * (y / Math.max(rows - 1, 1));
      return Math.min(1, wx * wy + 0.03);
    };

    const initCells = () => {
      cells = [];
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const w = weight(x, y);
          cells.push({
            x,
            y,
            w,
            color: PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)],
            alpha: Math.random() < w ? Math.random() * 0.5 * w : 0,
            target: 0,
            speed: 0.008 + Math.random() * 0.02,
          });
        }
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      initCells();
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      for (const c of cells) {
        if (c.alpha <= 0.004 && c.target === 0) continue;
        const [r, g, b] = c.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(c.alpha, 0)})`;
        ctx.fillRect(c.x * CELL, c.y * CELL, SIZE, SIZE);
      }
    };

    const tick = () => {
      // retarget a handful of cells each frame
      for (let i = 0; i < Math.max(2, Math.floor(cells.length / 220)); i += 1) {
        const c = cells[Math.floor(Math.random() * cells.length)];
        if (!c) continue;
        c.target = Math.random() < c.w ? Math.random() * 0.75 * c.w : 0;
      }
      for (const c of cells) {
        c.alpha += (c.target - c.alpha) * c.speed * 4;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.pixelCanvas} aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Compact copy widget (the hero CTA)
// ---------------------------------------------------------------------------

function CopyCta() {
  const [tab, setTab] = useState("claude");
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    const done = () => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SNIPPETS[tab].code).then(done, done);
    } else {
      done();
    }
  };

  return (
    <div className={styles.ctaCol} id="get-started">
      <p className={styles.ctaLabel}>
        <Translate id="ai.getStarted.label">Give your coding agent Cardano skills</Translate>
      </p>
      <div className={styles.snipBox}>
        <div className={styles.snipHead}>
          <div className={styles.snipTabs} role="tablist">
            {Object.entries(SNIPPETS).map(([key, s]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className={`${styles.snipTab} ${tab === key ? styles.snipTabActive : ""}`}
                onClick={() => {
                  setTab(key);
                  setCopied(false);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`${styles.snipCopy} ${copied ? styles.snipCopyDone : ""}`}
            onClick={copy}
          >
            {copied
              ? translate({ id: "ai.getStarted.copied", message: "Copied ✓" })
              : translate({ id: "ai.getStarted.copy", message: "Copy" })}
          </button>
        </div>
        <div className={styles.snipBodies}>
          {Object.entries(SNIPPETS).map(([key, s]) => (
            <div
              key={key}
              className={`${styles.snipBody} ${tab === key ? "" : styles.snipBodyHidden}`}
              aria-hidden={tab !== key}
            >
              {s.code.split("\n").map((line, i) => (
                <span key={i} className={styles.snipLine}>
                  <span className={styles.snipPrompt}>{key === "claude" ? "❯ " : "$ "}</span>
                  {line}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Mark({ on, hl }) {
  if (!on) {
    return (
      <span
        className={styles.ckNo}
        aria-label={translate({ id: "ai.x402.notSupported", message: "not supported" })}
      />
    );
  }
  return (
    <span
      className={`${styles.ckYes} ${hl ? styles.ckYesHl : ""}`}
      aria-label={translate({ id: "ai.x402.supported", message: "supported" })}
    >
      ✓
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AiPage() {
  const x402Logo = useBaseUrl("/img/ai/x402-logo.svg");
  const masumiLogo = useBaseUrl("/img/ai/masumi-wordmark.png");

  return (
    <Layout
      title={translate({ id: "ai.meta.title", message: "Why AI Needs Cardano" })}
      description={translate({
        id: "ai.meta.description",
        message:
          "AI agents need identity, secure payments, and infrastructure they can rely on. Cardano was built for this: formal methods, decentralized identity, native assets, and predictable infrastructure.",
      })}
    >
      <main>
        {/* ------------------------------------------------ HERO */}
        <header className={styles.hero}>
          <PixelField />
          <div className="container">
            <div className={styles.heroInner}>
              <div>
                <span className={styles.heroEyebrow}>
                  <Translate id="ai.hero.eyebrow">Cardano × AI</Translate>
                </span>
                <h1 className={styles.heroTitle}>
                  <Translate id="ai.hero.title">Why AI Needs Cardano</Translate>
                </h1>
                <p className={styles.heroSub}>
                  <Translate id="ai.hero.subLead">
                    Agents are starting to move real money. Cardano gives them what's missing:
                  </Translate>{" "}
                  <strong>
                    <Translate id="ai.hero.subStrong">
                      verifiable identity, secure payments, and rails that behave predictably
                    </Translate>
                  </strong>
                  .
                </p>
                <div className={styles.heroLinks}>
                  <Link className={styles.heroLink} to="#why-cardano">
                    <Translate id="ai.hero.linkWhy">Why Cardano for AI</Translate>
                  </Link>
                  <Link className={styles.heroLink} to="#agent-economy">
                    <Translate id="ai.hero.linkEconomy">Explore the agent economy</Translate>
                  </Link>
                </div>
              </div>
              <CopyCta />
            </div>
          </div>
        </header>

        {/* ------------------------------------------------ WHY AI ON CARDANO */}
        <section className={styles.section} id="why-cardano">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>
              <Translate id="ai.why.eyebrow">Why AI on Cardano</Translate>
            </p>
            <h2 className={styles.sectionTitle}>
              <Translate id="ai.why.title">What agents need, Cardano was built on.</Translate>
            </h2>
            <p className={styles.sectionSub}>
              <Translate id="ai.why.sub">
                Autonomous agents handle money, identity, and assets at machine speed, with no human
                double-checking each step. That only works on infrastructure with four properties.
              </Translate>
            </p>
            <div className={styles.whyRows}>
              {PILLARS.map((p, i) => {
                const Ill = ILLUSTRATIONS[p.ill];
                return (
                  <div
                    key={p.num}
                    className={`${styles.whyRow} ${i % 2 === 1 ? styles.whyRowFlip : ""}`}
                  >
                    <div className={styles.illPanel}>
                      <Ill />
                    </div>
                    <div>
                      <p className={styles.whyNum}>{p.num}</p>
                      <h3 className={styles.whyTitle}>{p.title}</h3>
                      <ul className={styles.whyList}>
                        {p.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className={styles.whyCares}>
                        <strong>
                          <Translate id="ai.why.caresLabel">Why AI cares</Translate>
                        </strong>
                        {p.why}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ X402 ON CARDANO */}
        <section className={styles.section} id="x402">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>
              <Translate id="ai.x402.eyebrow">x402 on Cardano</Translate>
            </p>
            <h2 className={styles.sectionTitle}>
              <Translate id="ai.x402.title">
                x402 on Cardano is more powerful than x402 anywhere else.
              </Translate>
            </h2>

            <div className={styles.x402Banner}>
              <div className={styles.x402Logos}>
                <img src={x402Logo} alt="x402" className={styles.logoX402} />
                <span className={styles.logoPlus}>+</span>
                <img src={masumiLogo} alt="Masumi" className={styles.logoMasumi} />
              </div>
              <div>
                <p className={styles.eyebrow} style={{ marginBottom: 0 }}>
                  <Translate id="ai.x402.native">Native support</Translate>
                </p>
                <p className={styles.x402BannerLine}>
                  <Translate id="ai.x402.bannerLead">
                    x402 on Cardano natively supports the
                  </Translate>{" "}
                  <Link to="https://github.com/x402-foundation/x402/blob/main/specs/schemes/exact/scheme_exact_cardano.md">
                    <Translate id="ai.x402.bannerLink">Masumi Smart Contract</Translate>
                  </Link>
                  .
                </p>
              </div>
            </div>

            <p className={styles.memberNote}>
              <Translate id="ai.x402.memberLead">The Cardano Foundation is a member of the</Translate>{" "}
              <Link to="https://x402.org/members/">
                <Translate id="ai.x402.memberLink">x402 Foundation</Translate>
              </Link>
              <Translate id="ai.x402.memberRest">
                , the industry body behind the x402 standard, alongside Coinbase, Cloudflare,
                Google, Visa, and Mastercard.
              </Translate>
            </p>

            <p className={styles.sectionSub}>
              <Translate id="ai.x402.escrow1">
                The Masumi Smart Contract is the escrow at the core of the payment standard for AI
                agents on Cardano: funds are locked in the contract, released when the work is
                delivered, and refunded when it isn't. Every decision is logged on-chain.
              </Translate>
            </p>
            <p className={styles.sectionSub}>
              <Translate id="ai.x402.escrow2">
                It is an open standard, not a product: a plain escrow contract with no fees and no
                owner, specified as part of the official x402 scheme for Cardano. Plugged into x402,
                every HTTP payment gets that protection built in.
              </Translate>
            </p>

            <div className={styles.tblWrap}>
              <table className={styles.cmpTable}>
                <thead>
                  <tr>
                    <th> </th>
                    <th>
                      <Translate id="ai.x402.colStandard">Standard x402</Translate>
                    </th>
                    <th>
                      <Translate id="ai.x402.colCardano">Cardano x402</Translate>
                    </th>
                    <th className={styles.thHl}>
                      <Translate id="ai.x402.colMasumi">Cardano + Masumi x402</Translate>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.name}>
                      <td>
                        <span className={styles.featName}>{row.name}</span>
                        <span className={styles.featDesc}>{row.desc}</span>
                      </td>
                      {row.cols.map((on, i) => (
                        <td key={i} className={i === 2 ? styles.hlCol : ""}>
                          <Mark on={on} hl={i === 2} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className={styles.rowDivider}>
                    <td colSpan={4}>
                      <Translate id="ai.x402.divider">
                        + interoperable with other Masumi features
                      </Translate>
                    </td>
                  </tr>
                  {COMPARE_ROWS_EXTRA.map((row) => (
                    <tr key={row.name}>
                      <td>
                        <span className={styles.featName}>{row.name}</span>
                        <span className={styles.featDesc}>{row.desc}</span>
                      </td>
                      {row.cols.map((on, i) => (
                        <td key={i} className={i === 2 ? styles.hlCol : ""}>
                          <Mark on={on} hl={i === 2} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Link
              className={styles.specsLink}
              to="https://github.com/x402-foundation/x402/blob/main/specs/schemes/exact/scheme_exact_cardano.md"
            >
              <Translate id="ai.x402.specs">Read the exact scheme specs</Translate>
            </Link>
          </div>
        </section>

        {/* ------------------------------------------------ AGENT ECONOMY */}
        <section className={styles.section} id="agent-economy">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>
              <Translate id="ai.economy.eyebrow">Agent Economy</Translate>
            </p>
            <h2 className={styles.sectionTitle}>
              <Translate id="ai.economy.title">The agent economy, running on Cardano</Translate>
            </h2>
            <p className={styles.sectionSub}>
              <Translate id="ai.economy.sub">
                A real agent economy is taking shape on Cardano: autonomous agents with verifiable
                identities, payment rails built for machines, and marketplaces where anyone can hire
                them. The building blocks are live today.
              </Translate>
            </p>

            <div className={styles.mCards}>
              <Link className={styles.mCard} to="https://docs.masumi.network">
                <p className={styles.mCardTitle}>
                  <Translate id="ai.economy.card1.title">Agent Payment Network</Translate>
                </p>
                <p className={styles.mCardDesc}>
                  <Translate id="ai.economy.card1.desc">
                    Escrowed agent-to-agent payments with automatic refunds and on-chain decision
                    logging, based on the open Masumi standard.
                  </Translate>
                </p>
              </Link>
              <Link className={styles.mCard} to="https://www.masumi.network/explorer">
                <p className={styles.mCardTitle}>
                  <Translate id="ai.economy.card2.title">Decentralized Agent Registry</Translate>
                </p>
                <p className={styles.mCardDesc}>
                  <Translate id="ai.economy.card2.desc">
                    Every agent is registered on-chain and discoverable by anyone. Browse the live
                    registry.
                  </Translate>
                </p>
              </Link>
              <Link className={styles.mCard} to="https://www.veridian.id">
                <p className={styles.mCardTitle}>
                  <Translate id="ai.economy.card3.title">Agent Identity with Veridian Wallet</Translate>
                </p>
                <p className={styles.mCardDesc}>
                  <Translate id="ai.economy.card3.desc">
                    Decentralized identifiers and verifiable credentials for agents.
                  </Translate>
                </p>
              </Link>
              <Link className={styles.mCard} to="https://hydra.family">
                <p className={styles.mCardTitle}>
                  <Translate id="ai.economy.card4.title">High-Speed Transactions with Hydra</Translate>
                </p>
                <p className={styles.mCardDesc}>
                  <Translate id="ai.economy.card4.desc">
                    Sub-second, sub-cent payments between agents.
                  </Translate>
                </p>
              </Link>
            </div>

            <p className={styles.mNote}>
              <Translate
                id="ai.economy.example"
                values={{
                  sokosumi: <Link to="https://sokosumi.com">Sokosumi</Link>,
                }}
              >
                {"Live today: anyone can hire working agents on marketplaces like {sokosumi}."}
              </Translate>
            </p>
          </div>
        </section>

        {/* ------------------------------------------------ CLOSING CTA */}
        <section className={styles.closing}>
          <PixelField />
          <div className={`${styles.wrap} ${styles.closingInner}`}>
            <h2 className={styles.closingTitle}>
              <Translate id="ai.closing.title">Ready to build the agent economy?</Translate>
            </h2>
            <p className={styles.closingSub}>
              <Translate id="ai.closing.sub">
                The standards are open, the rails are live, and your agent can join today.
              </Translate>
            </p>
            <div className={`${styles.ctaRow} ${styles.ctaCenter}`}>
              <Link className={styles.btnLight} to="https://developers.cardano.org">
                <Translate id="ai.closing.build">Start building</Translate>
              </Link>
              <Link className={styles.btnOutline} to="#get-started">
                <Translate id="ai.closing.skills">Give your agent Cardano skills</Translate>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
