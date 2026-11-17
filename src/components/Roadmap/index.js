import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

// The pieces of /roadmap: the line of protocol versions, a panel for the
// next hard fork, and a slim block for each hard fork after it.

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 10" role="img" aria-label={translate({ id: "roadmap.figure.to", message: "to" })}>
      <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Figure({ figure }) {
  return (
    <p className={styles.figure}>
      <b>
        {figure.value || (
          <>
            {figure.from} <Arrow /> {figure.to}
          </>
        )}
      </b>
      <span>{figure.label}</span>
    </p>
  );
}

// One change: its name, what it does, and the proposal it rests on.
function Upgrade({ upgrade }) {
  return (
    <div className={styles.upgrade}>
      {upgrade.figure && <Figure figure={upgrade.figure} />}
      <h3 className={styles.upgradeName}>{upgrade.name}</h3>
      <p className={styles.upgradeText}>{upgrade.text}</p>
      <p className={styles.upgradeMeta}>
        {upgrade.source && <Link to={upgrade.source.href}>{upgrade.source.label}</Link>}
        {upgrade.note && <span className={styles.note}>{upgrade.note}</span>}
      </p>
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
  // The last column holds the next hard fork, whose name is longer.
  const columns = { gridTemplateColumns: `repeat(${ticks.length}, minmax(0, 1fr)) minmax(0, 1.5fr)` };
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
              <b>
                {versionOf(item)}
                {current && <em>{translate({ id: "roadmap.line.now", message: "Now" })}</em>}
              </b>
              <span>{item.name}</span>
              <span className={styles.tickYear}>{yearOf(item)}</span>
            </li>
          );
        })}
        <li className={clsx(styles.tick, styles.tickNext)}>
          <b>
            {next.version}
            <em>{translate({ id: "roadmap.line.next", message: "Next" })}</em>
          </b>
          <span>{next.name}</span>
          <span className={styles.tickYear}>{translate({ id: "roadmap.line.noDate", message: "No date yet" })}</span>
        </li>
      </ol>
    </div>
  );
}

// The path of a hard fork to the Cardano mainnet, in order.
const STAGES = ["development", "devnet", "preview", "preprod", "vote", "mainnet"];

function stageLabels() {
  return [
    translate({ id: "roadmap.stage.development", message: "In development" }),
    translate({ id: "roadmap.stage.devnet", message: "Developer testnet" }),
    translate({ id: "roadmap.stage.preview", message: "Preview testnet" }),
    translate({ id: "roadmap.stage.preprod", message: "Preprod testnet" }),
    translate({ id: "roadmap.stage.vote", message: "On-chain vote" }),
    translate({ id: "roadmap.stage.mainnet", message: "Mainnet" }),
  ];
}

function Path({ fork }) {
  const reached = STAGES.indexOf(fork.stage);
  return (
    <>
      <ol className={styles.path}>
        {stageLabels().map((label, index) => (
          <li
            key={label}
            className={clsx(index < reached && styles.pathDone, index === reached && styles.pathNow)}
            aria-current={index === reached ? "step" : undefined}
          >
            {label}
          </li>
        ))}
      </ol>
      <p className={styles.pathSource}>
        <Link to={fork.stageSource}>{translate({ id: "roadmap.path.source", message: "Hard fork working group minutes" })}</Link>
      </p>
    </>
  );
}

/**
 * The next hard fork: the version step, how far along it is, and what it changes.
 *
 * @param {object} props
 * @param {object} props.fork First entry of getHardForks().
 * @param {Array<object>} props.upgrades Result of getUpgrades(fork.key).
 * @param {Array<object>} props.smallerChanges Result of getSmallerChanges(fork.key).
 * @param {object} props.latest First entry of getHardForkHistory().
 */
export function NextHardFork({ fork, upgrades, smallerChanges, latest }) {
  return (
    <section className={styles.panel} id={fork.key}>
      <div>
        <p className={styles.step}>
          {versionOf(latest)} <Arrow /> {fork.version}
        </p>
        <h2 className={styles.panelTitle}>{fork.name}</h2>
        <p className={styles.panelSummary}>{fork.summary}</p>
        <Path fork={fork} />
      </div>
      <div>
        <div className={styles.upgrades}>
          {upgrades.map((upgrade) => (
            <Upgrade key={upgrade.key} upgrade={upgrade} />
          ))}
        </div>
        <h3 className={styles.smallerTitle}>{translate({ id: "roadmap.smaller.title", message: "Also in this hard fork" })}</h3>
        <ul className={styles.smaller}>
          {smallerChanges.map((change) => (
            <li key={change.key}>
              <b>{change.name}</b>
              {change.source && <Link to={change.source.href}>{change.source.label}</Link>}
              <span>{change.text}</span>
            </li>
          ))}
        </ul>
        <p className={styles.plan}>
          <Link to={fork.planUrl}>{translate({ id: "roadmap.plan.link", message: "Full scope in Intersect's hard fork plan" })}</Link>
        </p>
      </div>
    </section>
  );
}

/**
 * A hard fork after the next one.
 *
 * @param {object} props
 * @param {object} props.fork Later entry of getHardForks().
 * @param {Array<object>} props.upgrades Result of getUpgrades(fork.key).
 */
export function LaterHardFork({ fork, upgrades }) {
  return (
    <section className={styles.later} id={fork.key}>
      <div>
        <h2 className={styles.laterTitle}>{fork.name}</h2>
        <p className={styles.panelSummary}>{fork.summary}</p>
      </div>
      <div className={styles.upgrades}>
        {upgrades.map((upgrade) => (
          <Upgrade key={upgrade.key} upgrade={upgrade} />
        ))}
      </div>
    </section>
  );
}
