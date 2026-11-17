import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { useHardForkStatus, useHardForkVotes } from "./useHardForkStatus";
import styles from "./styles.module.css";

// The pieces of /roadmap: the line of protocol versions, a panel for the
// next hard fork, and a slim row for each hard fork after it.

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 10" role="img" aria-label={translate({ id: "roadmap.metric.to", message: "to" })}>
      <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Metric({ metric, className }) {
  return (
    <>
      <span className={clsx(styles.figure, className)}>
        {metric.value || (
          <>
            {metric.from} <Arrow /> {metric.to}
          </>
        )}
      </span>
      <span className={styles.figureLabel}>{metric.label}</span>
    </>
  );
}

function UpgradeText({ upgrade }) {
  return (
    <div>
      <Link className={styles.upgradeName} to={upgrade.href}>
        {upgrade.name}
      </Link>
      <span className={styles.upgradeSubtitle}>{upgrade.subtitle}</span>
    </div>
  );
}

const versionOf = (item) => item.meta[0].value.replace(/\.0$/, "");
const yearOf = (item) => item.date.slice(-4);
const eraOf = (item) => item.era.replace(/ Era$/, "");

/**
 * Every protocol version in order, with its era, then the next hard fork.
 *
 * @param {object} props
 * @param {Array<object>} props.history Result of getHardForkHistory(), newest first.
 * @param {object} props.next First entry of getHardForks().
 */
export function VersionLine({ history, next }) {
  const ticks = [...history].reverse();
  const bands = [];
  for (const item of ticks) {
    const last = bands[bands.length - 1];
    if (last && last.era === eraOf(item)) last.span += 1;
    else bands.push({ era: eraOf(item), span: 1 });
  }
  const columns = { gridTemplateColumns: `repeat(${ticks.length + 1}, minmax(0, 1fr))` };
  return (
    <div className={styles.line}>
      <div className={styles.bands} style={columns} aria-hidden="true">
        {bands.map((band) => (
          <span key={band.era} style={{ gridColumn: `span ${band.span}` }}>
            {band.era}
          </span>
        ))}
        <span className={styles.bandNext}>{next.era}</span>
      </div>
      <ol className={styles.ticks} style={columns}>
        {ticks.map((item, index) => {
          const current = index === ticks.length - 1;
          return (
            <li key={item.epoch} className={clsx(styles.tick, current && styles.tickNow)}>
              <span className={styles.tickFlag}>{current && translate({ id: "roadmap.line.now", message: "Now" })}</span>
              <b>{versionOf(item)}</b>
              <span>{item.name}</span>
              <span className={styles.tickYear}>{yearOf(item)}</span>
            </li>
          );
        })}
        <li className={clsx(styles.tick, styles.tickNext)}>
          <span className={styles.tickFlag}>{translate({ id: "roadmap.line.next", message: "Next" })}</span>
          <b>{next.version}</b>
          <span>{next.name}</span>
          <span className={styles.tickYear}>{translate({ id: "roadmap.line.voteSets", message: "Vote sets the date" })}</span>
        </li>
      </ol>
    </div>
  );
}

// The path of a hard fork to mainnet. A typed stage or the chain says how
// far along it is.
const RAIL_INDEX = { development: 0, devnet: 1, preview: 2, preprod: 3, vote: 4, scheduled: 4, live: 5 };

function railSteps() {
  return [
    translate({ id: "roadmap.rail.development", message: "In development" }),
    translate({ id: "roadmap.rail.devnet", message: "Developer testnet" }),
    translate({ id: "roadmap.rail.preview", message: "Preview" }),
    translate({ id: "roadmap.rail.preprod", message: "Preprod" }),
    translate({ id: "roadmap.rail.vote", message: "On-chain vote" }),
    translate({ id: "roadmap.rail.mainnet", message: "Mainnet" }),
  ];
}

const percent = (share) => `${Math.round(share * 100)}%`;

// Vote shares against what a hard fork initiation needs. Renders nothing
// until the shares arrive, so a slow or failed request leaves no gap.
function Votes({ status }) {
  const votes = useHardForkVotes(status.actionId);
  if (votes.status !== "ready") return null;
  const { drepYesPct, poolYesPct, committeeYes, committeeNo } = votes.data;
  return (
    <ul className={styles.votes}>
      <li>
        {translate(
          { id: "roadmap.votes.dreps", message: "DReps: {yes}% yes, {needed} needed" },
          { yes: drepYesPct, needed: percent(status.thresholds.drepThreshold) },
        )}
      </li>
      <li>
        {translate(
          { id: "roadmap.votes.pools", message: "Stake pools: {yes}% yes, {needed} needed" },
          { yes: poolYesPct, needed: percent(status.thresholds.poolThreshold) },
        )}
      </li>
      <li>
        {translate(
          { id: "roadmap.votes.committee", message: "Constitutional Committee: {yes} yes, {no} no" },
          { yes: committeeYes, no: committeeNo },
        )}
      </li>
    </ul>
  );
}

// What the chain says once it says something, and until then that the vote
// decides the date.
function mainnetNote(status) {
  if (status.stage === "live") return translate({ id: "roadmap.fork.note.live", message: "Live on mainnet" });
  if (status.stage === "scheduled") {
    return translate({ id: "roadmap.fork.note.scheduled", message: "Takes effect at epoch {epoch}" }, { epoch: status.epoch });
  }
  if (status.stage === "vote") {
    return translate({ id: "roadmap.fork.note.vote", message: "Vote open through epoch {epoch}" }, { epoch: status.expiration });
  }
  return translate({ id: "roadmap.fork.note.date", message: "Mainnet date set by on-chain vote" });
}

/**
 * The next hard fork: the version step, how far along it is, and its upgrades.
 *
 * @param {object} props
 * @param {object} props.fork First entry of getHardForks().
 * @param {Array<object>} props.upgrades Result of getUpgrades(fork.key).
 * @param {object} props.latest First entry of getHardForkHistory().
 */
export function NextHardFork({ fork, upgrades, latest }) {
  const status = useHardForkStatus(fork);
  const reached = RAIL_INDEX[status.stage];
  return (
    <section className={styles.panel} id={fork.key}>
      <div>
        <p className={styles.step}>
          {versionOf(latest)} <Arrow /> {fork.version}
        </p>
        <h2 className={styles.panelTitle}>{fork.name}</h2>
        <p className={styles.panelMeta}>{fork.target}</p>
        <p className={styles.panelMeta}>{mainnetNote(status)}</p>
        <ol className={styles.rail}>
          {railSteps().map((label, index) => (
            <li key={label} className={clsx(index <= reached && styles.railOn)}>
              {label}
            </li>
          ))}
        </ol>
        {status.actionId && <Votes status={status} />}
      </div>
      <div>
        <div className={styles.tiles}>
          {upgrades.map((upgrade) => (
            <div className={styles.tile} key={upgrade.key}>
              <Metric metric={upgrade.metric} className={styles.figureLarge} />
              <UpgradeText upgrade={upgrade} />
              {upgrade.note && !status.fromChain && <span className={styles.tileNote}>{upgrade.note}</span>}
            </div>
          ))}
        </div>
        <p className={styles.scope}>
          {fork.scopeNote} <Link to={fork.scopeUrl}>{translate({ id: "roadmap.fork.scopeLink", message: "Full scope on Intersect" })}</Link>
        </p>
      </div>
    </section>
  );
}

/**
 * A hard fork after the next one, on one slim row per upgrade.
 *
 * @param {object} props
 * @param {object} props.fork Later entry of getHardForks().
 * @param {Array<object>} props.upgrades Result of getUpgrades(fork.key).
 */
export function LaterHardFork({ fork, upgrades }) {
  return (
    <section className={styles.later} id={fork.key}>
      <div>
        <h2 className={styles.laterTitle}>{translate({ id: "roadmap.later.title", message: "Then: {name}" }, { name: fork.name })}</h2>
        <p className={styles.panelMeta}>{fork.target}</p>
      </div>
      {upgrades.map((upgrade) => (
        <React.Fragment key={upgrade.key}>
          <div>
            <Metric metric={upgrade.metric} />
          </div>
          <UpgradeText upgrade={upgrade} />
        </React.Fragment>
      ))}
    </section>
  );
}
