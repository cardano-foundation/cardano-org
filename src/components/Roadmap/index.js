import React, { useRef } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useHashTarget from "@site/src/utils/useHashTarget";
import styles from "./styles.module.css";

// The pieces of /roadmap: the line of protocol versions, then three stacked
// sections: planned hard forks, proposals not scheduled yet, and the hard
// forks already enacted.

const versionOf = (item) => item.meta[0].value.replace(/\.0$/, "");
const eraOf = (item) => item.era.replace(/ Era$/, "");

/**
 * Every protocol version in order with its era, then the hard forks being
 * built.
 *
 * @param {object} props
 * @param {Array<object>} props.history Result of getHardForkHistory(), newest first.
 * @param {Array<object>} props.upcoming Result of getHardForks(), next one first.
 */
export function VersionLine({ history, upcoming }) {
  const past = [...history].reverse();
  const bands = [];
  for (const era of [...past.map(eraOf), ...upcoming.map((fork) => fork.era)]) {
    const last = bands[bands.length - 1];
    if (last && last.era === era) last.span += 1;
    else bands.push({ era, span: 1 });
  }
  // The current version and the upcoming hard forks get wider columns,
  // because their labels are longer.
  const columns = {
    gridTemplateColumns: `repeat(${past.length - 1}, minmax(0, 2fr)) repeat(${upcoming.length + 1}, minmax(0, 3fr))`,
  };
  return (
    <div className={styles.line}>
      <div className={styles.bands} style={columns} aria-hidden="true">
        {bands.map((band, index) => (
          <span
            key={band.era}
            className={clsx(index === bands.length - 1 && styles.bandAhead)}
            style={{ gridColumn: `span ${band.span}` }}
          >
            {band.era}
          </span>
        ))}
      </div>
      <ol className={styles.ticks} style={columns}>
        {past.map((item, index) => {
          const current = index === past.length - 1;
          return (
            <li key={item.epoch} className={clsx(styles.tick, current && styles.tickNow)}>
              <b>
                {versionOf(item)}
                {current && <em>{translate({ id: "roadmap.line.now", message: "Now" })}</em>}
              </b>
              <span>{item.name}</span>
            </li>
          );
        })}
        {upcoming.map((fork, index) => (
          <li key={fork.key} className={clsx(styles.tick, styles.tickAhead)}>
            <b>
              {fork.version}
              <em>
                {index === 0
                  ? translate({ id: "roadmap.line.next", message: "Next" })
                  : translate({ id: "roadmap.line.planned", message: "Planned" })}
              </em>
            </b>
            <span>{fork.name}</span>
          </li>
        ))}
      </ol>
      <p className={styles.lineMore}>
        <Link to="#completed">
          {translate({ id: "roadmap.line.earlier", message: "{count} earlier hard forks" }, { count: past.length - 1 })}
        </Link>
      </p>
    </div>
  );
}

/**
 * One titled section of the page.
 *
 * @param {object} props
 * @param {string} props.id Anchor of the section.
 * @param {string} props.title Section title, already translated.
 * @param {React.ReactNode} props.children Content of the section.
 */
export function Section({ id, title, children }) {
  return (
    <section className={styles.section} id={id}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 10" role="img" aria-label={translate({ id: "roadmap.figure.to", message: "to" })}>
      <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// One row of a list: a name with an optional line under it, an optional
// figure, and an optional source link.
function Row({ name, text, figure, source }) {
  return (
    <li className={styles.row}>
      <div>
        <span className={styles.rowName}>{name}</span>
        {text && <span className={styles.rowText}>{text}</span>}
      </div>
      <div>
        {figure && (
          <>
            <span className={styles.figure}>
              {figure.value || (
                <>
                  {figure.from} <Arrow /> {figure.to}
                </>
              )}
            </span>
            <span className={styles.figureLabel}>{figure.label}</span>
          </>
        )}
      </div>
      <div className={styles.rowSource}>{source && <Link to={source.href}>{source.label}</Link>}</div>
    </li>
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

// One element that opens on click. Closed, it shows a name, a line of facts
// and a short aside. Open, it adds its content. A link to `/roadmap#<id>`
// opens it.
function Fold({ id, name, large, facts, aside, children }) {
  const details = useRef(null);
  useHashTarget((hash) => {
    if (hash === id && details.current) details.current.open = true;
  });
  return (
    <details className={styles.fold} id={id} ref={details}>
      <summary>
        <div>
          <h3 className={clsx(styles.foldName, large && styles.foldNameLarge)}>{name}</h3>
          <ul className={styles.foldFacts}>
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
        <div className={styles.foldAside}>{aside}</div>
      </summary>
      <div className={styles.foldBody}>{children}</div>
    </details>
  );
}

const countOf = (count, one, many) => (count === 1 ? one : many);

/**
 * One planned hard fork. Closed, it shows its name, its facts, its stage
 * and how many changes it has. Open, it adds the path to mainnet and a row
 * per change.
 *
 * @param {object} props
 * @param {object} props.fork Entry of getHardForks().
 * @param {Array<object>} props.changes Result of getChanges(fork.key).
 */
export function HardFork({ fork, changes }) {
  const stages = stageLabels();
  const reached = STAGES.indexOf(fork.stage);
  return (
    <Fold
      id={fork.key}
      name={fork.name}
      large
      facts={[
        fork.version === null
          ? translate({ id: "roadmap.fork.versionOpen", message: "Protocol version not assigned yet" })
          : translate({ id: "roadmap.fork.version", message: "Protocol version {version}" }, { version: fork.version }),
        fork.eraNote,
        fork.target,
      ]}
      aside={
        <>
          <b>{stages[reached]}</b>
          {countOf(
            changes.length,
            translate({ id: "roadmap.fork.change", message: "1 change" }),
            translate({ id: "roadmap.fork.changes", message: "{count} changes" }, { count: changes.length }),
          )}
        </>
      }
    >
      <ol className={styles.path}>
        {stages.map((label, index) => (
          <li
            key={label}
            className={clsx(index < reached && styles.pathDone, index === reached && styles.pathNow)}
            aria-current={index === reached ? "step" : undefined}
          >
            {label}
          </li>
        ))}
      </ol>
      <p className={styles.note}>
        {fork.stageNote}{" "}
        <Link to={fork.stageSource}>{translate({ id: "roadmap.path.source", message: "Hard fork working group minutes" })}</Link>
      </p>
      <ul className={styles.rows}>
        {changes.map((change) => (
          <Row key={change.key} {...change} />
        ))}
      </ul>
    </Fold>
  );
}

/**
 * One group of proposals that have no hard fork.
 *
 * @param {object} props
 * @param {object} props.group Entry of getUnscheduled().
 */
export function ProposalGroup({ group }) {
  return (
    <Fold
      id={group.key}
      name={group.name}
      facts={[]}
      aside={countOf(
        group.items.length,
        translate({ id: "roadmap.unscheduled.proposal", message: "1 proposal" }),
        translate({ id: "roadmap.unscheduled.proposals", message: "{count} proposals" }, { count: group.items.length }),
      )}
    >
      <p className={styles.note}>
        {group.note} <Link to={group.planUrl}>{translate({ id: "roadmap.source.intersect", message: "Intersect plan" })}</Link>
      </p>
      <ul className={styles.rows}>
        {group.items.map((item) => (
          <Row key={item.key} {...item} />
        ))}
      </ul>
    </Fold>
  );
}

/**
 * One enacted hard fork. Closed, it shows its name, protocol version, era
 * and date. Open, it adds what it brought and where it is on the chain.
 *
 * @param {object} props
 * @param {object} props.item Entry of getHardForkHistory().
 */
export function CompletedHardFork({ item }) {
  const [version, ...ids] = item.meta;
  return (
    <Fold
      id={`protocol-version-${versionOf(item)}`}
      name={item.name}
      facts={[
        translate({ id: "roadmap.fork.version", message: "Protocol version {version}" }, { version: versionOf(item) }),
        item.era,
      ]}
      aside={item.date}
    >
      <p className={styles.note}>{item.description}</p>
      <dl className={styles.facts}>
        <dt>{item.epochLabel}</dt>
        <dd>{item.epoch}</dd>
        <dt>{version.label}</dt>
        <dd>{version.value}</dd>
        {ids.map((id) => (
          <React.Fragment key={id.label}>
            <dt>{id.label}</dt>
            <dd>{id.value}</dd>
          </React.Fragment>
        ))}
      </dl>
    </Fold>
  );
}
