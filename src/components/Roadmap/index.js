import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { parseMarkdownLikeText } from "@site/src/utils/textUtils";
import { EXPLORER_TX_BASE } from "@site/src/utils/walletTx";
import styles from "./styles.module.css";

// The pieces of /roadmap: the line of protocol versions, then two stacked
// sections, each one box: upcoming hard forks and the hard forks already
// enacted.

export const versionOf = (item) => item.meta[0].value.replace(/\.0$/, "");
const eraOf = (item) => item.era.replace(/ Era$/, "");
const completedId = (item) => `protocol-version-${versionOf(item)}`;

/**
 * Opens the entry with this id. The page passes it to useHashTarget, so a
 * link to `/roadmap#<id>` opens its entry. The line of protocol versions
 * calls it on a click, which reopens an entry that was closed by hand.
 *
 * @param {string|null} id Id of a hard fork's entry.
 */
export function openEntry(id) {
  const entry = id && document.getElementById(id);
  if (entry instanceof HTMLDetailsElement) entry.open = true;
}

/**
 * Every protocol version in order with its era, then the upcoming hard forks
 * that have a protocol version. Each version links to its entry further down
 * and opens it.
 *
 * @param {object} props
 * @param {Array<object>} props.history Result of getHardForkHistory(), newest first.
 * @param {Array<object>} props.upcoming Result of getHardForks(), next one first.
 */
export function VersionLine({ history, upcoming }) {
  const past = [...history].reverse();
  const ahead = upcoming.filter((fork) => fork.version !== null);
  // One band per era. An era that no enacted hard fork belongs to has not
  // started, and its band is drawn as upcoming.
  const bands = [];
  const addToBand = (era, notStarted) => {
    const last = bands[bands.length - 1];
    if (last && last.era === era) last.span += 1;
    else bands.push({ era, span: 1, notStarted });
  };
  past.forEach((item) => addToBand(eraOf(item), false));
  ahead.forEach((fork) => addToBand(fork.era, true));
  // The current version and the upcoming hard forks get wider columns,
  // because their labels are longer.
  const columns = {
    gridTemplateColumns: `repeat(${past.length - 1}, minmax(0, 2fr)) repeat(${ahead.length + 1}, minmax(0, 3fr))`,
  };
  return (
    <div className={styles.line}>
      <div className={styles.bands} style={columns} aria-hidden="true">
        {bands.map((band) => (
          <span key={band.era} className={clsx(band.notStarted && styles.bandAhead)} style={{ gridColumn: `span ${band.span}` }}>
            {band.era}
          </span>
        ))}
      </div>
      <ol className={styles.ticks} style={columns}>
        {past.map((item, index) => {
          const current = index === past.length - 1;
          return (
            <li key={item.epoch} className={clsx(styles.tick, current && styles.tickNow)}>
              <Link className={styles.tickLink} to={`#${completedId(item)}`} onClick={() => openEntry(completedId(item))}>
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
            <Link className={styles.tickLink} to={`#${fork.key}`} onClick={() => openEntry(fork.key)}>
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
          {translate({ id: "roadmap.line.earlier", message: "Earlier hard forks" })}
        </Link>
      </p>
    </div>
  );
}

/**
 * One titled section of the page. Its entries sit in one box.
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

// One cell of a grid: a name, its text, and the source link at the bottom.
function Row({ name, text, source }) {
  return (
    <li className={styles.row}>
      <div>
        <span className={styles.rowName}>{name}</span>
        <span className={styles.rowText}>{text}</span>
      </div>
      <div className={styles.rowSource}>
        <Link to={source.href}>{source.label}</Link>
      </div>
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

// One entry that opens on click. Closed, it shows a name, a line of facts
// and a short aside. Open, it adds its content. `dense` sets the name smaller
// and puts it on one line with the facts, in columns.
function Fold({ id, name, dense, facts, aside, children }) {
  return (
    <details className={clsx(styles.fold, dense && styles.foldDense)} id={id}>
      <summary>
        <div className={styles.foldHead}>
          <h3 className={clsx(styles.foldName, !dense && styles.foldNameLarge)}>{name}</h3>
          {facts.length > 0 && (
            <ul className={styles.foldFacts}>
              {facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.foldAside}>{aside}</div>
      </summary>
      <div className={styles.foldBody}>{children}</div>
    </details>
  );
}

/**
 * One upcoming hard fork. Closed, it shows its name, its protocol version
 * when it has one, its stage with one segment per step of the path, and how
 * many changes it has, or the name of its change when it has one. Open, it
 * adds the path to mainnet, a note that links to its sources, and a cell per
 * change.
 *
 * @param {object} props
 * @param {object} props.fork Entry of getHardForks().
 */
export function HardFork({ fork }) {
  const { changes } = fork;
  const stages = stageLabels();
  const reached = STAGES.indexOf(fork.stage);
  return (
    <Fold
      id={fork.key}
      name={fork.name}
      facts={
        fork.version === null
          ? []
          : [translate({ id: "roadmap.fork.version", message: "Protocol version {version}" }, { version: fork.version })]
      }
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
      <p className={styles.note}>{parseMarkdownLikeText(fork.note)}</p>
      <ul className={styles.rows}>
        {changes.map((change) => (
          <Row key={change.key} name={change.name} text={change.text} source={change.source} />
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
      {index > 0 && <span className={styles.txSeparator}>, </span>}
      {TRANSACTION_ID.test(part) ? (
        <Link className={styles.txId} to={`${EXPLORER_TX_BASE}${part}`}>
          {part}
        </Link>
      ) : (
        part
      )}
    </React.Fragment>
  ));
}

/**
 * One enacted hard fork. Closed, it shows its name, protocol version, era
 * and date on one line. Open, it adds what it brought, a cell per change
 * when its changes are listed, and where it is on the chain, with each
 * transaction id linked to the explorer.
 *
 * @param {object} props
 * @param {object} props.item Entry of getHardForkHistory().
 * @param {Array<object>} [props.changes] Its entry of getCompletedChanges().
 */
export function CompletedHardFork({ item, changes = [] }) {
  // The first entry is the protocol version, which the closed line shows.
  const ids = item.meta.slice(1);
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
      {changes.length > 0 && (
        <ul className={styles.rows}>
          {changes.map((change) => (
            <Row key={change.key} name={change.name} text={change.text} source={change.source} />
          ))}
        </ul>
      )}
      <dl className={styles.facts}>
        <dt>{item.epochLabel}</dt>
        <dd>{item.epoch}</dd>
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
