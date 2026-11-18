import React, { useRef } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useHashTarget from "@site/src/utils/useHashTarget";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import { EXPLORER_TX_BASE } from "@site/src/utils/walletTx";
import styles from "./styles.module.css";

// The pieces of /roadmap: the line of protocol versions, then three stacked
// sections, each one box: planned hard forks, proposals not scheduled yet,
// and the hard forks already enacted.

const versionOf = (item) => item.meta[0].value.replace(/\.0$/, "");
const eraOf = (item) => item.era.replace(/ Era$/, "");
const completedId = (item) => `protocol-version-${versionOf(item)}`;

// Opens the element a link points at. The hash does it on the first click,
// this does it again when the element was closed by hand since.
const openTarget = (id) => () => {
  const target = document.getElementById(id);
  if (target) target.open = true;
};

/**
 * Every protocol version in order with its era, then the planned hard forks
 * that have a protocol version assigned. Each version links to its element
 * further down and opens it.
 *
 * @param {object} props
 * @param {Array<object>} props.history Result of getHardForkHistory(), newest first.
 * @param {Array<object>} props.upcoming Result of getHardForks(), next one first.
 */
export function VersionLine({ history, upcoming }) {
  const past = [...history].reverse();
  const ahead = upcoming.filter((fork) => fork.version !== null);
  const bands = [];
  for (const era of [...past.map(eraOf), ...ahead.map((fork) => fork.era)]) {
    const last = bands[bands.length - 1];
    if (last && last.era === era) last.span += 1;
    else bands.push({ era, span: 1 });
  }
  // The current version and the upcoming hard forks get wider columns,
  // because their labels are longer.
  const columns = {
    gridTemplateColumns: `repeat(${past.length - 1}, minmax(0, 2fr)) repeat(${ahead.length + 1}, minmax(0, 3fr))`,
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
              <Link className={styles.tickLink} to={`#${completedId(item)}`} onClick={openTarget(completedId(item))}>
                <b>
                  {versionOf(item)}
                  {current && <em>{translate({ id: "roadmap.line.now", message: "Now" })}</em>}
                </b>
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
        {ahead.map((fork, index) => (
          <li key={fork.key} className={clsx(styles.tick, styles.tickAhead)}>
            <Link className={styles.tickLink} to={`#${fork.key}`} onClick={openTarget(fork.key)}>
              <b>
                {fork.version}
                <em>
                  {index === 0
                    ? translate({ id: "roadmap.line.next", message: "Next" })
                    : translate({ id: "roadmap.line.planned", message: "Planned" })}
                </em>
              </b>
              <span>{fork.name}</span>
            </Link>
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
 * One titled section of the page. Its elements sit in one box.
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
      <div className={styles.box}>{children}</div>
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

// One cell of a grid: a name, an optional line under it, an optional figure
// under that, and an optional source link at the bottom.
function Row({ name, text, figure, source }) {
  return (
    <li className={styles.row}>
      <div>
        <span className={styles.rowName}>{name}</span>
        {text && <span className={styles.rowText}>{text}</span>}
        {figure && (
          <span className={styles.figure}>
            <b>
              {figure.value || (
                <>
                  {figure.from} <Arrow /> {figure.to}
                </>
              )}
            </b>
            {figure.label}
          </span>
        )}
      </div>
      {source && (
        <div className={styles.rowSource}>
          <Link to={source.href}>{source.label}</Link>
        </div>
      )}
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
// opens it. `dense` puts the name and the facts on one line in columns.
function Fold({ id, name, large, dense, facts, aside, children }) {
  const details = useRef(null);
  useHashTarget((hash) => {
    if (hash === id && details.current) details.current.open = true;
  });
  return (
    <details className={clsx(styles.fold, dense && styles.foldDense)} id={id} ref={details}>
      <summary>
        <div className={styles.foldHead}>
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
 * One planned hard fork. Closed, it shows its name, its protocol version,
 * its stage with one segment per step of the path, and how many changes it
 * has, or the name of its change when it has one. Open, it adds the path to
 * mainnet, a note with its sources, and a cell per change.
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
      ]}
      aside={
        <>
          <span className={styles.stage}>
            <span
              className={styles.progress}
              role="img"
              aria-label={translate(
                { id: "roadmap.fork.step", message: "Step {step} of {total}" },
                { step: reached + 1, total: STAGES.length },
              )}
            >
              {STAGES.map((stage, index) => (
                <span key={stage} className={clsx(index <= reached && styles.progressOn)} />
              ))}
            </span>
            <b>{stages[reached]}</b>
          </span>
          {changes.length === 1
            ? changes[0].name
            : translate({ id: "roadmap.fork.changes", message: "{count} changes" }, { count: changes.length })}
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
      <p className={styles.note}>{fork.note}</p>
      <p className={styles.sources}>
        {fork.sources.map((source, index) => (
          <React.Fragment key={source.href}>
            {index > 0 && <span className={styles.noteDot} aria-hidden="true" />}
            <Link to={source.href}>{source.label}</Link>
          </React.Fragment>
        ))}
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
      <p className={styles.note}>{parseMarkdownLikeText(group.note)}</p>
      <ul className={styles.rows}>
        {group.items.map((item) => (
          <Row key={item.key} {...item} />
        ))}
      </ul>
    </Fold>
  );
}

// The transaction ids of an enacted hard fork. Each id links to its page on
// the explorer. A value that is not an id stays plain text.
const TRANSACTION_ID = /^[0-9a-f]{64}$/;

function TransactionIds({ value }) {
  return value.split(", ").map((part, index) => (
    <React.Fragment key={part}>
      {index > 0 && ", "}
      {TRANSACTION_ID.test(part) ? <Link to={`${EXPLORER_TX_BASE}${part}`}>{part}</Link> : part}
    </React.Fragment>
  ));
}

/**
 * One enacted hard fork. Closed, it shows its name, protocol version, era
 * and date on one line. Open, it adds what it brought and where it is on
 * the chain, with each transaction id linked to the explorer.
 *
 * @param {object} props
 * @param {object} props.item Entry of getHardForkHistory().
 */
export function CompletedHardFork({ item }) {
  const [version, ...ids] = item.meta;
  return (
    <Fold
      id={completedId(item)}
      name={item.name}
      dense
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
            <dd>
              <TransactionIds value={id.value} />
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </Fold>
  );
}
