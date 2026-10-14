import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import useAccountabilityStats from "@site/src/components/AccountabilityStats/useAccountabilityStats";
import { storyCounts } from "@site/src/data/governanceStory";
import { epochInfo, countdown } from "./epoch";
import { getCanvasLabels, getTimeUnits } from "./labels";
import { createStoryEngine } from "./engine";
import VoteMatrix from "./VoteMatrix";
import CountSimulator from "./CountSimulator";
import RoleFinder from "./RoleFinder";
import styles from "./styles.module.css";

// Scrollytelling explainer of Cardano's on-chain governance. A canvas behind
// the chapter cards redraws itself as each chapter scrolls into view; three
// interactive modules sit between the chapters. See
// docs/get-involved/components/governance-story.md.

// Re-renders once a second after mount; null during SSR and hydration.
function useNow() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);
  return now;
}

function EpochPill() {
  const now = useNow();
  const E = now ? epochInfo(now) : null;
  return (
    <span
      className={styles.epochPill}
      title={translate({
        id: "governance.howItWorks.bar.epochTitle",
        message: "Live, computed from the mainnet epoch schedule",
      })}
    >
      <i className={styles.pulse} aria-hidden="true" />
      <span>
        <Translate id="governance.howItWorks.bar.epoch" values={{ epoch: <b>{E ? E.epoch : "…"}</b> }}>
          {"Epoch {epoch}"}
        </Translate>
      </span>
      <span className={styles.pillCountdown}>{E ? countdown(E.end - now, true, getTimeUnits()) : ""}</span>
    </span>
  );
}

function Chapter({ id, scene, num, name, children }) {
  return (
    <section id={id} className={styles.step} data-scene={scene}>
      <BoundaryBox>
        <div className={styles.card} data-anchor="" data-story-card="">
          <p className={styles.eyebrow}>
            {num && <b>{num}</b>}
            {name}
          </p>
          {children}
        </div>
      </BoundaryBox>
    </section>
  );
}

function Module({ id, kicker, kickerLabel, title, lede, children }) {
  return (
    <section id={id} className={styles.module} data-scene="dim">
      <BoundaryBox>
        <header className={styles.modHead}>
          <p className={styles.eyebrow}>
            <b>{kicker}</b>
            {kickerLabel}
          </p>
          <h2>{title}</h2>
          {lede && <p className={styles.lede}>{lede}</p>}
        </header>
        {children}
      </BoundaryBox>
    </section>
  );
}

const G = ({ to, children }) => <Link to={to}>{children}</Link>;

// Keeps what a reader types readable: digits, one decimal point, grouping.
function cleanAda(raw) {
  const s = String(raw).replace(/[^\d.]/g, "");
  const parts = s.split(".");
  return {
    ip: (parts[0] || "").replace(/^0+(?=\d)/, "").slice(0, 11) || "0",
    fp: (parts[1] || "").slice(0, 6),
  };
}
const commas = (x) => x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
function ownership(raw) {
  const c = cleanAda(raw);
  return {
    ada: commas(c.ip) + (c.fp ? `.${c.fp}` : ""),
    votes: commas(`${c.ip}${`${c.fp}000000`.slice(0, 6)}`.replace(/^0+(?=\d)/, "")),
  };
}

export default function GovernanceStory() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const live = useAccountabilityStats();
  const [chapter, setChapter] = useState(0);
  const [adaInput, setAdaInput] = useState("1,000");
  const own = useMemo(() => ownership(adaInput), [adaInput]);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const liveRef = useRef(live);
  const ownRef = useRef(own);

  const num = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const num2 = useMemo(() => new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [locale]);
  // Live figures, or null until data.cardano.org answers. A missing figure is
  // left out of the text rather than replaced with a number that goes stale.
  const counts = storyCounts(live);

  useEffect(() => {
    ownRef.current = own;
  }, [own]);

  useEffect(() => {
    liveRef.current = live;
    engineRef.current?.refresh();
  }, [live]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !canvasRef.current || !stageRef.current) return undefined;
    const engine = createStoryEngine({
      root,
      stage: stageRef.current,
      canvas: canvasRef.current,
      labels: getCanvasLabels(),
      locale,
      getOwn: () => ownRef.current,
      getLive: () => liveRef.current,
      onChapter: setChapter,
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [locale]);

  const chapters = [
    { id: "your-vote", name: translate({ id: "governance.howItWorks.chapter.yourVote", message: "Your vote" }) },
    { id: "three-groups", name: translate({ id: "governance.howItWorks.chapter.threeGroups", message: "Three groups" }) },
    { id: "proposals", name: translate({ id: "governance.howItWorks.chapter.proposals", message: "Proposals" }) },
    { id: "who-votes", name: translate({ id: "governance.howItWorks.chapter.whoVotes", message: "Who votes" }) },
    { id: "run-the-count", name: translate({ id: "governance.howItWorks.chapter.runTheCount", message: "Run the count" }) },
    { id: "constitution", name: translate({ id: "governance.howItWorks.chapter.constitution", message: "Constitution" }) },
    { id: "treasury", name: translate({ id: "governance.howItWorks.chapter.treasury", message: "Treasury" }) },
    { id: "your-move", name: translate({ id: "governance.howItWorks.chapter.yourMove", message: "Your move" }) },
    { id: "your-part", name: translate({ id: "governance.howItWorks.chapter.yourPart", message: "Your part" }) },
  ];
  const ch = Object.fromEntries(chapters.map((c) => [c.id, c.name]));

  return (
    <div ref={rootRef} className={styles.story}>
      <div className={styles.chrome}>
        <div className={styles.bar} data-story-bar="">
          <span className={styles.barTitle}>
            {translate({ id: "governance.howItWorks.bar.title", message: "How Cardano decides" })}
          </span>
          <span className={styles.barChapter}>
            {chapters[chapter]?.name}
          </span>
          <EpochPill />
          <i className={styles.progress} aria-hidden="true" />
        </div>
        <nav className={styles.dots} aria-label={translate({ id: "governance.howItWorks.dots.label", message: "Chapters" })}>
          {chapters.map((c, i) => (
            <a key={c.id} href={`#${c.id}`} aria-current={i === chapter ? "true" : undefined} aria-label={c.name}>
              <span aria-hidden="true">{c.name}</span>
            </a>
          ))}
        </nav>
      </div>

      <div ref={stageRef} className={styles.stage} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>

      <div className={styles.steps}>
        <Chapter id="your-vote" scene="weight" num="01" name={ch["your-vote"]}>
          <h2>{translate({ id: "governance.howItWorks.yourVote.title", message: "Every ada is a vote. Yours." })}</h2>
          <p>
            <Translate
              id="governance.howItWorks.yourVote.p1"
              values={{
                lovelace: (
                  <G to="/glossary/lovelace">
                    {translate({ id: "governance.howItWorks.yourVote.p1.lovelace", message: "One lovelace" })}
                  </G>
                ),
              }}
            >
              {"Your voting power is everything under your stake key: the ada in your wallet plus unclaimed staking rewards. {lovelace}, one vote."}
            </Translate>
          </p>
          <div className={styles.own}>
            <label className={styles.fieldLabel} htmlFor="gs-my-ada">
              {translate({ id: "governance.howItWorks.yourVote.inputLabel", message: "How much ada do you hold?" })}
            </label>
            <div className={styles.ownRow}>
              <input
                id="gs-my-ada"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={adaInput}
                aria-describedby="gs-my-votes"
                onChange={(e) => setAdaInput(e.target.value)}
                onBlur={() => setAdaInput(own.ada)}
              />
              <span>ada</span>
            </div>
            <p className={styles.ownOut} id="gs-my-votes">
              <Translate id="governance.howItWorks.yourVote.votes" values={{ votes: <b>{own.votes}</b> }}>
                {"That is {votes} votes."}
              </Translate>
            </p>
          </div>
          <p>
            <Translate
              id="governance.howItWorks.yourVote.p2"
              values={{
                snapshot: (
                  <G to="/glossary/stake-snapshot">
                    {translate({ id: "governance.howItWorks.yourVote.p2.snapshot", message: "takes a snapshot" })}
                  </G>
                ),
              }}
            >
              {"Nothing moves. At every epoch boundary the ledger {snapshot} of your balance and adds its weight to the DRep you chose. Spend ada and your weight drops at the next snapshot."}
            </Translate>
          </p>
          <p className={styles.small}>
            {translate({
              id: "governance.howItWorks.yourVote.notDelegated",
              message: "Ada that is not delegated for governance is not counted. Pick a DRep, Always Abstain, or Always No Confidence.",
            })}
          </p>
        </Chapter>

        <Chapter id="three-groups" scene="groups" num="02" name={ch["three-groups"]}>
          <h2>{translate({ id: "governance.howItWorks.groups.title", message: "Three groups. None decides alone." })}</h2>
          <dl className={styles.groups}>
            <div>
              <i className={styles.swCommittee} aria-hidden="true" />
              <dt>
                <G to="/glossary/constitutional-committee">
                  {translate({ id: "governance.howItWorks.groups.cc", message: "Constitutional Committee" })}
                </G>
              </dt>
              <dd>
                {translate({
                  id: "governance.howItWorks.groups.ccElected",
                  message: "An elected panel. Members ask one question: does this follow the constitution? One member, one vote.",
                })}
                {counts.committee != null && (
                  <>
                    {" "}
                    {translate(
                      { id: "governance.howItWorks.groups.ccSeated", message: "{count} members are seated." },
                      { count: num.format(counts.committee) }
                    )}
                  </>
                )}
              </dd>
            </div>
            <div>
              <i className={styles.swDrep} aria-hidden="true" />
              <dt>
                <G to="/glossary/drep">{translate({ id: "governance.howItWorks.groups.dreps", message: "DReps" })}</G>
              </dt>
              <dd>
                {translate({
                  id: "governance.howItWorks.groups.drepsVote",
                  message: "Delegated Representatives. They vote on every type of action, weighted by the ada delegated to them.",
                })}
                {counts.dreps != null && (
                  <>
                    {" "}
                    {translate(
                      { id: "governance.howItWorks.groups.drepsActive", message: "{count} are active." },
                      { count: num.format(counts.dreps) }
                    )}
                  </>
                )}
              </dd>
            </div>
            <div>
              <i className={styles.swPool} aria-hidden="true" />
              <dt>{translate({ id: "governance.howItWorks.groups.pools", message: "Stake pool operators" })}</dt>
              <dd>
                {translate({
                  id: "governance.howItWorks.groups.poolsRun",
                  message:
                    "They run the network, so they vote on hard forks, security-relevant parameter changes, committee updates, and motions of no confidence. Their votes are weighted by the stake in their pools.",
                })}
              </dd>
            </div>
          </dl>
          <p className={styles.small}>
            {translate({
              id: "governance.howItWorks.groups.note",
              message: "Every binding action needs a yes from at least two of the three groups. No group can pass one alone.",
            })}
          </p>
        </Chapter>

        <Chapter id="proposals" scene="proposal" num="03" name={ch.proposals}>
          <h2>{translate({ id: "governance.howItWorks.proposals.title", message: "Anyone can propose." })}</h2>
          <p>
            <Translate
              id="governance.howItWorks.proposals.p1"
              values={{
                action: (
                  <G to="/glossary/governance-action">
                    {translate({ id: "governance.howItWorks.proposals.p1.action", message: "governance action" })}
                  </G>
                ),
              }}
            >
              {"Any ada holder can submit a {action}. It carries a 100,000 ada deposit, returned when voting ends, pass or fail."}
            </Translate>
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.proposals.anchor",
              message: "Each action links to a public document and records its hash on-chain, so any later change to the text can be detected.",
            })}
          </p>
          <p>
            <Translate
              id="governance.howItWorks.timing.p1"
              values={{
                lifetime: (
                  <G to="/glossary/governance-action-lifetime">
                    {translate({ id: "governance.howItWorks.timing.p1.lifetime", message: "six epochs" })}
                  </G>
                ),
              }}
            >
              {"Votes are tallied at every epoch boundary, once every five days. An action has {lifetime} after it is submitted, about 30 days, to reach its thresholds."}
            </Translate>{" "}
            {translate({
              id: "governance.howItWorks.timing.p2",
              message: "Once ratified, it is enacted at the next boundary. If time runs out, it expires. Either way, the deposit goes back.",
            })}
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.proposals.p3",
              message: "There are seven kinds of action, and each needs a different mix of votes.",
            })}
          </p>
        </Chapter>

        <Module
          id="who-votes"
          kicker={translate({ id: "governance.howItWorks.interactive", message: "Interactive" })}
          kickerLabel={translate({ id: "governance.howItWorks.matrix.kicker", message: "Seven kinds of action" })}
          title={translate({ id: "governance.howItWorks.matrix.title", message: "Who votes on what" })}
          lede={translate({
            id: "governance.howItWorks.matrix.lede",
            message: "Each action type needs its own mix of approvals. Pick one to see who votes and how much support it needs.",
          })}
        >
          <VoteMatrix />
          <p className={styles.legendNote}>
            {translate({
              id: "governance.howItWorks.matrix.legend",
              message: "DRep and stake pool thresholds are shares of voting stake. The committee votes one member, one vote, and needs two thirds.",
            })}
          </p>
        </Module>

        <Module
          id="run-the-count"
          kicker={translate({ id: "governance.howItWorks.interactive", message: "Interactive" })}
          kickerLabel={translate({ id: "governance.howItWorks.sim.kicker", message: "Replay real votes" })}
          title={translate({ id: "governance.howItWorks.sim.title", message: "Run the count" })}
          lede={translate({
            id: "governance.howItWorks.sim.ledeRules",
            message:
              "Yes has to reach the threshold as a share of the stake that counts. When an active DRep stays silent, their stake counts as No. Abstain takes stake out of the count. Load a real vote from the ledger, then change it to see the rules at work.",
          })}
        >
          <CountSimulator />
        </Module>

        <Chapter id="constitution" scene="scale" num="04" name={ch.constitution}>
          <h2>{translate({ id: "governance.howItWorks.constitution.titleFollow", message: "Every action has to follow the constitution." })}</h2>
          <p>
            {translate({
              id: "governance.howItWorks.constitution.check",
              message:
                "The Constitutional Committee checks actions against it and votes No on any it finds unconstitutional. It votes on every type of action except committee updates and motions of no confidence.",
            })}
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.constitution.code",
              message:
                "Some rules run as code. A guardrails script checks every parameter change and treasury withdrawal when it is submitted. If the action breaks one of the limits the script encodes, the ledger rejects it before any vote.",
            })}
          </p>
          <p>
            <Translate
              id="governance.howItWorks.constitution.change"
              values={{
                tenets: (
                  <G to="/constitution">{translate({ id: "governance.howItWorks.constitution.p2.tenets", message: "ten tenets" })}</G>
                ),
              }}
            >
              {"Its first article sets out {tenets}. Changing the constitution takes 75% of DRep stake and two thirds of the committee."}
            </Translate>
          </p>
          <blockquote className={styles.quote}>
            {translate({
              id: "governance.howItWorks.constitution.quote",
              message:
                "“Cardano is a decentralized ecosystem of blockchain technology, smart contracts, and community governance, committed to improving economic, political, and social systems for everyone, everywhere.”",
            })}
            <cite>{translate({ id: "governance.howItWorks.constitution.cite", message: "Cardano Constitution, Preamble" })}</cite>
          </blockquote>
        </Chapter>

        <Chapter id="treasury" scene="treasury" num="05" name={ch.treasury}>
          <h2>{translate({ id: "governance.howItWorks.treasury.titleVote", message: "A treasury spent only by vote." })}</h2>
          <p>
            <Translate
              id="governance.howItWorks.treasury.funded"
              values={{
                cut: (
                  <G to="/glossary/treasury-cut">
                    {translate({ id: "governance.howItWorks.treasury.p1.cut", message: "20% of the rewards" })}
                  </G>
                ),
              }}
            >
              {"Every epoch, {cut} flows into the treasury."}
            </Translate>
            {counts.treasury != null && (
              <>
                {" "}
                {translate(
                  { id: "governance.howItWorks.treasury.balance", message: "It holds {amount} billion ada today." },
                  { amount: num2.format(counts.treasury / 1e9) }
                )}
              </>
            )}
          </p>
          <p>
            <Translate
              id="governance.howItWorks.treasury.rules"
              values={{
                ncl: (
                  <G to="/glossary/net-change-limit">
                    {translate({ id: "governance.howItWorks.treasury.ncl", message: "net change limit" })}
                  </G>
                ),
                withdrawal: (
                  <G to="/glossary/treasury-withdrawal">
                    {translate({ id: "governance.howItWorks.treasury.withdrawal", message: "treasury withdrawal" })}
                  </G>
                ),
              }}
            >
              {"Ada leaves the treasury only through a {withdrawal}. Each one needs 67% of active DRep stake and two thirds of the committee, must stay within the {ncl}, and must follow the constitution's treasury rules."}
            </Translate>
          </p>
        </Chapter>

        <Chapter id="your-move" scene="finale" num="06" name={ch["your-move"]}>
          <h2>{translate({ id: "governance.howItWorks.yourMove.titleCount", message: "Make your ada count." })}</h2>
          <p>
            {translate({
              id: "governance.howItWorks.yourMove.delegate",
              message: "Governance decisions are made every epoch, with or without your vote. Delegating takes one transaction, and you can change it at any time.",
            })}
          </p>
          <a className="button button--primary" href="#your-part">
            {translate({ id: "governance.howItWorks.yourMove.cta", message: "Find your part" })}
          </a>
        </Chapter>

        <Module
          id="your-part"
          kicker={ch["your-move"]}
          kickerLabel={translate({ id: "governance.howItWorks.roles.kicker", message: "Five ways in" })}
          title={translate({ id: "governance.howItWorks.roles.title", message: "How much time do you have?" })}
        >
          <RoleFinder />
        </Module>
      </div>
    </div>
  );
}

// Sources and notes on the figures, shown after the story.
export function GovernanceStorySources() {
  return (
    <div className={styles.sources}>
      <div>
        <h2 className={styles.fieldLabel}>
          {translate({ id: "governance.howItWorks.sources.aboutTitle", message: "About the numbers" })}
        </h2>
        <p>
          {translate({
            id: "governance.howItWorks.sources.aboutLive",
            message:
              "The number of active DReps, the committee size, and the treasury balance load live from data.cardano.org. If they cannot load, the page leaves them out. The epoch number in the bar is computed from the mainnet schedule. Vote results are dated and quote the ledger's own ratification tallies.",
          })}
        </p>
        <p>
          {translate({
            id: "governance.howItWorks.sources.fineprintParams",
            message:
              "Thresholds, deposits, and time limits are the protocol parameters in force in October 2026. Stake pools can set how their silence counts through their reward account; on hard forks, silence always counts as No.",
          })}
        </p>
      </div>
      <div>
        <h2 className={styles.fieldLabel}>{translate({ id: "governance.howItWorks.sources.sourcesTitle", message: "Sources" })}</h2>
        <ul>
          <li>
            <Link to="https://cips.cardano.org/cip/CIP-1694">
              {translate({ id: "governance.howItWorks.sources.cip1694", message: "CIP-1694: on-chain governance" })}
            </Link>
          </li>
          <li>
            <Link to="/constitution">{translate({ id: "governance.howItWorks.sources.constitution", message: "Cardano Constitution" })}</Link>
          </li>
        </ul>
      </div>
      <div>
        <h2 className={styles.fieldLabel}>{translate({ id: "governance.howItWorks.sources.liveTitle", message: "Live figures" })}</h2>
        <ul>
          <li>
            <Link to="/insights/governance-actions">
              {translate({ id: "governance.howItWorks.sources.charts", message: "Governance action charts" })}
            </Link>
          </li>
          <li>
            <Link to="/governance/accountability">
              {translate({ id: "governance.howItWorks.sources.accountability", message: "Governance accountability" })}
            </Link>
          </li>
          <li>
            <Link to="/apps?tags=governance">
              {translate({ id: "governance.howItWorks.sources.apps", message: "Governance apps" })}
            </Link>
          </li>
          <li>
            <Link to="/glossary/drep">{translate({ id: "governance.howItWorks.sources.glossary", message: "Glossary: DRep" })}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
