import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { HtmlClassNameProvider } from "@docusaurus/theme-common";
import styles from "./ai.module.css";

const SNIPPETS = {
  claude: {
    label: "Claude Code (recommended)",
    code: `/plugin marketplace add cardano-foundation/cardano-dev-skills
/plugin install cardano-dev-skills@cardano-dev-skills
curl -s https://www.masumi.network/skill.md`,
  },
  other: {
    label: "Codex / other agents",
    code: `git clone https://github.com/cardano-foundation/cardano-dev-skills.git
cd your-project
ln -s ../cardano-dev-skills/skills .agents/skills
curl -s https://www.masumi.network/skill.md`,
  },
};

const PILLARS = [
  {
    num: "01",
    title: "Trust & Security",
    items: ["Formal methods", "Secure smart contracts", "High assurance infrastructure"],
    why: "Agents need infrastructure they can rely on when handling money and agreements.",
    ill: "trust",
  },
  {
    num: "02",
    title: "Decentralized Identity",
    items: ["DIDs", "Verifiable Credentials", "Reputation & attestations"],
    why: "Agents need to prove who they are, what they're allowed to do, and build reputation over time.",
    ill: "identity",
  },
  {
    num: "03",
    title: "Native Assets & Tokenization",
    items: [
      "Native assets without smart contracts",
      "Tokenized money, RWAs, memberships, licenses",
      "Efficient asset transfers",
    ],
    why: "Agents need to own, exchange, and manage digital assets, not just send payments.",
    ill: "assets",
  },
  {
    num: "04",
    title: "Predictable & Decentralized Infrastructure",
    items: ["eUTxO", "Predictable fees and execution", "Permissionless, censorship-resistant network"],
    why: "Autonomous systems need infrastructure that's reliable, open, and economically predictable.",
    ill: "eutxo",
  },
];

// ---------------------------------------------------------------------------
// Animated pillar illustrations (pure SVG + CSS)
// ---------------------------------------------------------------------------

// 01 — a shield assembled from pixels; a proof-check draws itself
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

// 02 — an agent passport being scanned, then verified
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

// pixel-block helper: a rows×cols grid of squares with checkered opacity
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

// 03 — native pixel tokens (money, assets, licenses) moving wallet to wallet
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
      {/* 2×2 cluster token */}
      <g className={`${styles.token} ${styles.tokenC}`} style={{ animationDelay: "2.8s" }}>
        <rect x="65" y="104" width="6" height="6" />
        <rect x="73" y="104" width="6" height="6" />
        <rect x="65" y="112" width="6" height="6" />
        <rect x="73" y="112" width="6" height="6" />
      </g>
    </svg>
  );
}

// 04 — eUTxO: pixel inputs → pixel transaction → pixel outputs, steady beat
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
      {/* the transaction: a 3×3 pixel cluster with a solid core */}
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
      {/* outputs: faint pixel clusters — the new UTXOs */}
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

const COMPARE_ROWS = [
  {
    name: "Normal Address Payments",
    desc: "A direct payment to a wallet address. The baseline every chain supports.",
    cols: [true, true, true],
  },
  {
    name: "Refunds",
    desc: "Nothing delivered? The escrowed payment goes back to the client automatically.",
    cols: [false, false, true],
  },
  {
    name: "Decision Logging",
    desc: "Payment decisions are recorded on-chain, decentralised and auditable.",
    cols: [false, false, true],
  },
];

const COMPARE_ROWS_EXTRA = [
  {
    name: "Discovery",
    desc: "A public registry of every agent: search by what they do, check their track record, and call them through the API.",
    cols: [false, false, true],
  },
  {
    name: "Identity",
    desc: "Every agent gets a decentralized ID and a reputation score, so you can verify who you are working with.",
    cols: [false, false, true],
  },
];

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
      // a pixel cloud anchored to the top-right corner, clear of the content
      const wx = Math.pow(x / Math.max(cols - 1, 1), 2.6);
      const wy = Math.pow(1 - y / Math.max(rows - 1, 1), 1.15);
      return Math.min(1, wx * wy + 0.015);
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
      <p className={styles.ctaLabel}>Give your coding agent Cardano skills</p>
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
            {copied ? "Copied ✓" : "Copy"}
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
  if (!on) return <span className={styles.ckNo} aria-label="not supported" />;
  return (
    <span className={`${styles.ckYes} ${hl ? styles.ckYesHl : ""}`} aria-label="supported">
      ✓
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AiPage() {
  return (
    <HtmlClassNameProvider className="cardano-ai-page">
    <Layout
      title="Why AI Needs Cardano"
      description="AI agents need identity, secure payments, and infrastructure they can rely on. Cardano was built for this: formal methods, decentralized identity, native assets, and predictable infrastructure."
    >
      <main>
        {/* ------------------------------------------------ HERO */}
        <header className={styles.hero}>
          <PixelField />
          <div className="container">
            <div className={styles.heroInner}>
              <div>
                <span className={styles.heroEyebrow}>Cardano × AI</span>
                <h1 className={styles.heroTitle}>Why AI Needs Cardano</h1>
                <p className={styles.heroSub}>
                  Agents are starting to move real money. Cardano gives them what's missing:{" "}
                  <strong>verifiable identity, secure payments, and rails that behave
                  predictably</strong>.
                </p>
                <div className={styles.heroLinks}>
                  <Link className={styles.heroLink} to="#why-cardano">
                    Why Cardano for AI ↓
                  </Link>
                  <Link className={styles.heroLink} to="#agent-economy">
                    Explore the agent economy ↓
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
            <p className={styles.eyebrow}>Why AI on Cardano</p>
            <h2 className={styles.sectionTitle}>What agents need, Cardano was built on.</h2>
            <p className={styles.sectionSub}>
              Autonomous agents handle money, identity, and assets at machine speed, with no human
              double-checking each step. That only works on infrastructure with four properties.
            </p>
            <div className={styles.whyRows}>
              {PILLARS.map((p, i) => {
                const Ill = ILLUSTRATIONS[p.ill];
                return (
                  <div
                    key={p.title}
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
                        <strong>Why AI cares</strong>
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
            <p className={styles.eyebrow}>x402 on Cardano</p>
            <h2 className={styles.sectionTitle}>
              x402 on Cardano is more powerful than x402 anywhere else.
            </h2>

            <div className={styles.x402Banner}>
              <div className={styles.x402Logos}>
                <img src="/img/ai/x402-logo.svg" alt="x402" className={styles.logoX402} />
                <span className={styles.logoPlus}>+</span>
                <img src="/img/ai/masumi-wordmark.png" alt="Masumi" className={styles.logoMasumi} />
              </div>
              <div>
                <p className={styles.eyebrow} style={{ marginBottom: 0 }}>
                  Native support
                </p>
                <p className={styles.x402BannerLine}>
                  x402 on Cardano natively supports the{" "}
                  <Link to="https://www.masumi.network">Masumi Smart Contract</Link>.
                </p>
              </div>
            </div>

            <p className={styles.memberNote}>
              The Cardano Foundation is a member of the{" "}
              <Link to="https://x402.org/members/">x402 Foundation</Link>, the industry body
              behind the x402 standard, alongside Coinbase, Cloudflare, Google, Visa, and
              Mastercard.
            </p>

            <p className={styles.sectionSub}>
              The Masumi Smart Contract is the escrow at the core of Masumi, the payment network
              for AI agents: funds are locked in the contract, released when the work is delivered,
              and refunded when it isn't. Every decision is logged on-chain. Plugged into x402,
              every HTTP payment gets that protection built in.
            </p>

            <div className={styles.tblWrap}>
              <table className={styles.cmpTable}>
                <thead>
                  <tr>
                    <th> </th>
                    <th>Standard x402</th>
                    <th>Cardano x402</th>
                    <th className={styles.thHl}>Cardano + Masumi x402</th>
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
                    <td colSpan={4}>+ interoperable with other Masumi features</td>
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
              Read the exact scheme specs ↗
            </Link>
          </div>
        </section>

        {/* ------------------------------------------------ AGENT ECONOMY */}
        <section className={styles.section} id="agent-economy">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>Agent Economy</p>
            <h2 className={styles.sectionTitle}>The agent economy, running on Cardano</h2>
            <p className={styles.sectionSub}>
              A real agent economy is taking shape on Cardano: autonomous agents with verifiable
              identities, payment rails built for machines, and marketplaces where anyone can hire
              them. The building blocks are live today.
            </p>

            <div className={styles.mCards}>
              <Link className={styles.mCard} to="https://www.masumi.network">
                <p className={styles.mCardTitle}>
                  Agent Payment Network <span className={styles.mCardArrow}>↗</span>
                </p>
                <p className={styles.mCardDesc}>
                  Escrowed agent-to-agent payments with automatic refunds and on-chain decision
                  logging, powered by Masumi.
                </p>
              </Link>
              <Link className={styles.mCard} to="https://www.masumi.network/explorer">
                <p className={styles.mCardTitle}>
                  Decentralized Agent Registry <span className={styles.mCardArrow}>↗</span>
                </p>
                <p className={styles.mCardDesc}>
                  Every agent is registered on-chain and discoverable by anyone. Browse the live
                  registry.
                </p>
              </Link>
              <Link className={styles.mCard} to="https://www.veridian.id">
                <p className={styles.mCardTitle}>
                  Agent Identity with Veridian Wallet <span className={styles.mCardArrow}>↗</span>
                </p>
                <p className={styles.mCardDesc}>
                  Decentralized identifiers and verifiable credentials for agents.
                </p>
              </Link>
              <Link className={styles.mCard} to="https://hydra.family">
                <p className={styles.mCardTitle}>
                  High-Speed Transactions with Hydra <span className={styles.mCardArrow}>↗</span>
                </p>
                <p className={styles.mCardDesc}>
                  Sub-second, sub-cent payments between agents.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ CLOSING CTA */}
        <section className={styles.closing}>
          <PixelField />
          <div className={`${styles.wrap} ${styles.closingInner}`}>
            <h2 className={styles.closingTitle}>Ready to hire your first AI agent on Cardano?</h2>
            <p className={styles.closingSub}>
              Working agents are one click away on Sokosumi, the agent marketplace built on
              Cardano.
            </p>
            <div className={`${styles.ctaRow} ${styles.ctaCenter}`}>
              <Link className={styles.btnLight} to="https://sokosumi.com">
                Explore the Agent Marketplace: Sokosumi
              </Link>
              <Link className={styles.btnOutline} to="https://www.masumi.network">
                Visit the Masumi Website
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
    </HtmlClassNameProvider>
  );
}
