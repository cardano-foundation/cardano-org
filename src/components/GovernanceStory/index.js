import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import useAccountabilityStats from "@site/src/components/AccountabilityStats/useAccountabilityStats";
import { SNAPSHOT, storyCounts } from "@site/src/data/governanceStory";
import { epochInfo, countdown } from "./epoch";
import { getCanvasLabels, getTimeUnits } from "./labels";
import { createStoryEngine } from "./engine";
import VoteMatrix from "./VoteMatrix";
import CountSimulator from "./CountSimulator";
import GuardrailCheck from "./GuardrailCheck";
import RoleFinder from "./RoleFinder";
import styles from "./styles.module.css";

// Scrollytelling explainer of Cardano's on-chain governance. A canvas behind
// the chapter cards redraws itself as each chapter scrolls into view; four
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

function LiveEpochLine() {
  const now = useNow();
  const E = now ? epochInfo(now) : null;
  return (
    <p className={styles.live}>
      <span>
        <Translate
          id="governance.howItWorks.start.live"
          values={{ epoch: <b>{E ? E.epoch : "…"}</b>, countdown: <b>{E ? countdown(E.end - now, false, getTimeUnits()) : "…"}</b> }}
        >
          {"Epoch {epoch} ends in {countdown}."}
        </Translate>
      </span>
      <span className={styles.liveNote}>
        {translate({ id: "governance.howItWorks.start.liveNote", message: "Then the ledger tallies every open proposal." })}
      </span>
    </p>
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
  const counts = storyCounts(live);
  const drepCount = counts.dreps;
  const treasuryB = (counts.treasury / 1e9).toFixed(2);

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
    { id: "now", name: translate({ id: "governance.howItWorks.start.eyebrow", message: "Live" }) },
    { id: "before", name: translate({ id: "governance.howItWorks.chapter.before", message: "Before" }) },
    { id: "chang", name: translate({ id: "governance.howItWorks.chapter.chang", message: "Chang" }) },
    { id: "plomin", name: translate({ id: "governance.howItWorks.chapter.plomin", message: "Plomin" }) },
    { id: "your-vote", name: translate({ id: "governance.howItWorks.chapter.yourVote", message: "Your vote" }) },
    { id: "two-jobs", name: translate({ id: "governance.howItWorks.chapter.twoJobs", message: "Two jobs" }) },
    { id: "three-groups", name: translate({ id: "governance.howItWorks.chapter.threeGroups", message: "Three groups" }) },
    { id: "elect", name: translate({ id: "governance.howItWorks.chapter.elect", message: "Elect" }) },
    { id: "remove", name: translate({ id: "governance.howItWorks.chapter.remove", message: "Remove" }) },
    { id: "voting-power", name: translate({ id: "governance.howItWorks.chapter.votingPower", message: "Voting power" }) },
    { id: "proposals", name: translate({ id: "governance.howItWorks.chapter.proposals", message: "Proposals" }) },
    { id: "who-votes", name: translate({ id: "governance.howItWorks.chapter.whoVotes", message: "Who votes" }) },
    { id: "counting", name: translate({ id: "governance.howItWorks.chapter.counting", message: "Counting" }) },
    { id: "run-the-count", name: translate({ id: "governance.howItWorks.chapter.runTheCount", message: "Run the count" }) },
    { id: "timing", name: translate({ id: "governance.howItWorks.chapter.timing", message: "Timing" }) },
    { id: "constitution", name: translate({ id: "governance.howItWorks.chapter.constitution", message: "Constitution" }) },
    { id: "guardrails", name: translate({ id: "governance.howItWorks.chapter.guardrails", message: "Guardrails" }) },
    { id: "treasury", name: translate({ id: "governance.howItWorks.chapter.treasury", message: "Treasury" }) },
    { id: "your-move", name: translate({ id: "governance.howItWorks.chapter.yourMove", message: "Your move" }) },
    { id: "your-part", name: translate({ id: "governance.howItWorks.chapter.yourPart", message: "Your part" }) },
  ];
  const ch = Object.fromEntries(chapters.map((c) => [c.id, c.name]));
  const snapshotStamp = translate(
    { id: "governance.howItWorks.stamp.snapshot", message: "Ledger snapshot · epoch {epoch}" },
    { epoch: SNAPSHOT.epoch }
  );

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
        <Chapter id="now" scene="clock" name={translate({ id: "governance.howItWorks.start.eyebrow", message: "Live" })}>
          <h2>{translate({ id: "governance.howItWorks.start.title", message: "Every five days, Cardano counts the votes." })}</h2>
          <p>
            {translate({
              id: "governance.howItWorks.start.p1",
              message:
                "No single company decides what Cardano becomes. Ada holders, stake pool operators, and an elected Constitutional Committee do, on-chain, under a constitution the community wrote.",
            })}
          </p>
          <LiveEpochLine />
        </Chapter>

        <Chapter id="before" scene="keys" num="01" name={ch.before}>
          <h2>{translate({ id: "governance.howItWorks.before.title", message: "It used to take seven keys." })}</h2>
          <p>
            <Translate
              id="governance.howItWorks.before.p1"
              values={{
                keys: (
                  <G to="/glossary/genesis-keys">
                    {translate({ id: "governance.howItWorks.before.p1.keys", message: "seven genesis keys" })}
                  </G>
                ),
              }}
            >
              {"For Cardano's first years, protocol upgrades needed signatures from {keys} held by the founding entities."}
            </Translate>
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.before.p2",
              message: "That kept a young network safe. It also meant a few organizations held the switch.",
            })}
          </p>
        </Chapter>

        <Chapter id="chang" scene="chang" num="02" name={ch.chang}>
          <h2>{translate({ id: "governance.howItWorks.chang.title", message: "Chang put governance on-chain." })}</h2>
          <p>
            <Translate
              id="governance.howItWorks.chang.p1"
              values={{
                actions: (
                  <G to="/glossary/governance-action">
                    {translate({ id: "governance.howItWorks.chang.p1.actions", message: "Governance actions" })}
                  </G>
                ),
                chang: (
                  <G to="/glossary/chang">
                    {translate({ id: "governance.howItWorks.chang.p1.chang", message: "Chang hard fork" })}
                  </G>
                ),
              }}
            >
              {"{actions} did not exist before September 1, 2024. The {chang} introduced them and opened a careful first phase, with three of the seven types live."}
            </Translate>
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.chang.p2",
              message:
                "An interim Constitutional Committee and stake pool operators could approve parameter changes and hard forks, and anyone could post an info action. DReps could register and collect delegations, but their votes did not count yet. Treasury withdrawals stayed locked.",
            })}
          </p>
          <p className={styles.fact}>
            {translate({
              id: "governance.howItWorks.chang.fact",
              message: "By the time Plomin arrived, 956 DReps had registered and more than 109,000 stake addresses had delegated to them.",
            })}
          </p>
        </Chapter>

        <Chapter id="plomin" scene="plomin" num="03" name={ch.plomin}>
          <h2>{translate({ id: "governance.howItWorks.plomin.title", message: "Plomin gave DReps the vote." })}</h2>
          <p>
            <Translate
              id="governance.howItWorks.plomin.p1"
              values={{
                plomin: (
                  <G to="/glossary/plomin">
                    {translate({ id: "governance.howItWorks.plomin.p1.plomin", message: "Plomin hard fork" })}
                  </G>
                ),
              }}
            >
              {"The {plomin} on January 29, 2025, ended the first phase. From that epoch on, DRep votes counted."}
            </Translate>
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.plomin.p2",
              message:
                "Four more kinds of action opened at the same time: treasury withdrawals, a new constitution, committee updates, and motions of no confidence. Through their DReps, ada holders now had a say in all of it.",
            })}
          </p>
          <p className={styles.fact}>
            {translate({
              id: "governance.howItWorks.plomin.fact",
              message: "Within three weeks, DReps ratified Cardano's first community-written constitution.",
            })}
          </p>
        </Chapter>

        <Chapter id="your-vote" scene="weight" num="04" name={ch["your-vote"]}>
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
              id: "governance.howItWorks.yourVote.small",
              message: "Ada that is not delegated counts for nothing. Pick a DRep, Always Abstain, or Always No Confidence.",
            })}
          </p>
        </Chapter>

        <Chapter id="two-jobs" scene="two" num="05" name={ch["two-jobs"]}>
          <h2>{translate({ id: "governance.howItWorks.twoJobs.title", message: "Same ada, two jobs." })}</h2>
          <p>
            {translate({
              id: "governance.howItWorks.twoJobs.p1",
              message:
                "Delegating to a stake pool helps secure the network and earns rewards. Delegating to a DRep lends your voting power to a representative.",
            })}
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.twoJobs.p2",
              message:
                "The two choices are independent. Your ada never leaves your wallet, it is never locked, and you can change either choice at any time.",
            })}
          </p>
          <p className={styles.fact}>
            {translate({
              id: "governance.howItWorks.twoJobs.fact",
              message: "Since 2024, more than 375,000 stake addresses have delegated their vote.",
            })}
          </p>
        </Chapter>

        <Chapter id="three-groups" scene="rings" num="06" name={ch["three-groups"]}>
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
                  id: "governance.howItWorks.groups.ccText",
                  message: "At the core. Members ask one question: does this follow the constitution? One member, one vote.",
                })}
              </dd>
            </div>
            <div>
              <i className={styles.swDrep} aria-hidden="true" />
              <dt>
                <G to="/glossary/drep">{translate({ id: "governance.howItWorks.groups.dreps", message: "DReps" })}</G>
              </dt>
              <dd>
                {translate(
                  {
                    id: "governance.howItWorks.groups.drepsText",
                    message:
                      "Delegated Representatives. They vote on every type of action, weighted by the ada delegated to them. {count} are active.",
                  },
                  { count: num.format(drepCount) }
                )}
              </dd>
            </div>
            <div>
              <i className={styles.swPool} aria-hidden="true" />
              <dt>{translate({ id: "governance.howItWorks.groups.pools", message: "Stake pool operators" })}</dt>
              <dd>
                {translate(
                  {
                    id: "governance.howItWorks.groups.poolsText",
                    message:
                      "They run the network, so they vote on hard forks, security-relevant settings, and the committee. {count} pools hold stake.",
                  },
                  { count: num.format(SNAPSHOT.poolsWithStake) }
                )}
              </dd>
            </div>
          </dl>
          <p className={styles.small}>
            {translate({ id: "governance.howItWorks.groups.small", message: "In the picture, every dot is one member." })}
          </p>
          <span className={styles.stamp}>
            {translate({ id: "governance.howItWorks.groups.stamp", message: "More than 36,000 on-chain votes since 2024" })}
          </span>
        </Chapter>

        <Chapter id="elect" scene="elect" num="07" name={ch.elect}>
          <h2>{translate({ id: "governance.howItWorks.elect.title", message: "Who checks the checkers?" })}</h2>
          <p>
            {translate({
              id: "governance.howItWorks.elect.p1",
              message:
                "DReps and stake pools do. They vote committee members in with an update committee action, which needs 67% of DRep stake and 51% of pool stake. The committee gets no vote on its own seats.",
            })}
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.elect.p2",
              message:
                "Members serve fixed terms of at most 146 epochs, about two years. The latest election, ratified in September 2026, filled four seats.",
            })}
          </p>
        </Chapter>

        <Chapter id="remove" scene="remove" num="08" name={ch.remove}>
          <h2>{translate({ id: "governance.howItWorks.remove.title", message: "And they can vote it out." })}</h2>
          <p>
            {translate({
              id: "governance.howItWorks.remove.p1",
              message: "A motion of no confidence removes the whole committee. It needs the same majorities: 67% of DRep stake and 51% of pool stake.",
            })}
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.remove.p2",
              message:
                "Until a new committee is elected, nothing that needs the committee's approval can pass. Electing the new one then takes 60% of DRep stake instead of 67%.",
            })}
          </p>
          <p className={styles.fact}>
            {translate({
              id: "governance.howItWorks.remove.fact",
              message: "No such motion has been proposed so far. The committee answers to the people who can remove it.",
            })}
          </p>
        </Chapter>

        <Chapter id="voting-power" scene="power" num="09" name={ch["voting-power"]}>
          <h2>{translate({ id: "governance.howItWorks.power.title", message: "Where the voting power sits." })}</h2>
          <p>
            {translate({
              id: "governance.howItWorks.power.p1",
              message:
                "In total, 15.7 billion ada is delegated for governance. About two thirds of it sits with Always Abstain, a setting that never counts toward a decision.",
            })}
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.power.p2",
              message:
                "That leaves decisions to the 5.1 billion ada behind 330 active DReps. So each delegation weighs more than you might expect. One million ada is about 0.02% of the deciding vote.",
            })}
          </p>
          <p className={styles.small}>
            <Translate
              id="governance.howItWorks.power.small"
              values={{
                inactive: (
                  <G to="/glossary/drep-activity-period">
                    {translate({ id: "governance.howItWorks.power.small.inactive", message: "become inactive" })}
                  </G>
                ),
              }}
            >
              {"DReps who stay silent for 20 epochs, about 100 days, {inactive}. Their stake stops counting until they return."}
            </Translate>
          </p>
          <span className={styles.stamp}>{snapshotStamp}</span>
        </Chapter>

        <Chapter id="proposals" scene="proposal" num="10" name={ch.proposals}>
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
              id: "governance.howItWorks.proposals.p2",
              message: "Each action links to a public document and records its hash, so the text cannot change once voting starts.",
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

        <Chapter id="counting" scene="tally" num="11" name={ch.counting}>
          <h2>{translate({ id: "governance.howItWorks.counting.title", message: "How the count works." })}</h2>
          <p className={styles.formula}>
            {translate({ id: "governance.howItWorks.counting.formula", message: "Yes ÷ (Yes + No + No Confidence + Silent)" })}
          </p>
          <ol className={styles.rules}>
            <li>
              <span>
                <Translate
                  id="governance.howItWorks.counting.r1"
                  values={{
                    lead: (
                      <b>{translate({ id: "governance.howItWorks.counting.r1.lead", message: "Yes has to reach the threshold," })}</b>
                    ),
                    thresholds: (
                      <G to="/glossary/voting-thresholds">
                        {translate({ id: "governance.howItWorks.counting.r1.threshold", message: "share of the stake that counts" })}
                      </G>
                    ),
                  }}
                >
                  {"{lead} as a {thresholds}."}
                </Translate>
              </span>
            </li>
            <li>
              <span>
                <Translate
                  id="governance.howItWorks.counting.r2"
                  values={{ lead: <b>{translate({ id: "governance.howItWorks.counting.r2.lead", message: "No counts against." })}</b> }}
                >
                  {"{lead} So does stake delegated to Always No Confidence, on every action except a motion of no confidence."}
                </Translate>
              </span>
            </li>
            <li>
              <span>
                <Translate
                  id="governance.howItWorks.counting.r3"
                  values={{ lead: <b>{translate({ id: "governance.howItWorks.counting.r3.lead", message: "Silence counts as No." })}</b> }}
                >
                  {"{lead} When an active DRep does not vote, all the stake delegated to them lands on the No side."}
                </Translate>
              </span>
            </li>
            <li>
              <span>
                <Translate
                  id="governance.howItWorks.counting.r4"
                  values={{ lead: <b>{translate({ id: "governance.howItWorks.counting.r4.lead", message: "Abstain leaves the count." })}</b> }}
                >
                  {"{lead} An Abstain vote, or a delegation to Always Abstain, takes that stake out of the math."}
                </Translate>
              </span>
            </li>
            <li>
              <span>
                <Translate
                  id="governance.howItWorks.counting.r5"
                  values={{ lead: <b>{translate({ id: "governance.howItWorks.counting.r5.lead", message: "Inactive DReps drop out." })}</b> }}
                >
                  {"{lead} After 20 epochs without voting, their stake stops counting until they vote again."}
                </Translate>
              </span>
            </li>
          </ol>
          <p>
            {translate({
              id: "governance.howItWorks.counting.example",
              message:
                "In August 2026, a 103,000 ada treasury withdrawal reached 65.2% and needed 67%. Only 55 million ada voted No. Active DReps who stayed silent held 1.35 billion. Had they abstained, it would have passed with 93.7%.",
            })}
          </p>
        </Chapter>

        <Module
          id="run-the-count"
          kicker={translate({ id: "governance.howItWorks.interactive", message: "Interactive" })}
          kickerLabel={translate({ id: "governance.howItWorks.sim.kicker", message: "Replay real votes" })}
          title={translate({ id: "governance.howItWorks.sim.title", message: "Run the count" })}
          lede={translate({
            id: "governance.howItWorks.sim.lede",
            message:
              "Load a real vote from the ledger, then change it. Move the sliders, flip committee seats, or switch the action type. The verdict follows the ledger's rules.",
          })}
        >
          <CountSimulator />
        </Module>

        <Chapter id="timing" scene="timeline" num="12" name={ch.timing}>
          <h2>{translate({ id: "governance.howItWorks.timing.title", message: "The ledger keeps time." })}</h2>
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
            </Translate>
          </p>
          <p>
            {translate({
              id: "governance.howItWorks.timing.p2",
              message: "Once ratified, it is enacted at the next boundary. If time runs out, it expires. Either way, the deposit goes back.",
            })}
          </p>
          <p className={styles.fact}>
            {translate({
              id: "governance.howItWorks.timing.fact",
              message: "van Rossem was submitted on June 16, 2026, ratified on July 13, and live on July 18.",
            })}
          </p>
          <span className={styles.stamp}>
            {translate({ id: "governance.howItWorks.timing.stamp", message: "Live · epochs from today" })}
          </span>
        </Chapter>

        <Chapter id="constitution" scene="tenets" num="13" name={ch.constitution}>
          <h2>{translate({ id: "governance.howItWorks.constitution.title", message: "A rulebook the community wrote." })}</h2>
          <p>
            {translate({
              id: "governance.howItWorks.constitution.p1",
              message:
                "About 1,400 people in 50 countries shaped the first draft. Sixty-three elected delegates approved it at conventions in Buenos Aires and Nairobi.",
            })}
          </p>
          <p>
            <Translate
              id="governance.howItWorks.constitution.p2"
              values={{
                tenets: (
                  <G to="/constitution">{translate({ id: "governance.howItWorks.constitution.p2.tenets", message: "ten tenets" })}</G>
                ),
              }}
            >
              {"DReps ratified it on-chain in February 2025, then approved an update in January 2026 with 79.9% of DRep stake. It opens with {tenets}."}
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

        <Module
          id="guardrails"
          kicker={translate({ id: "governance.howItWorks.interactive", message: "Interactive" })}
          kickerLabel={translate({ id: "governance.howItWorks.rail.kicker", message: "Guardrails TC-01 and TC-02" })}
          title={translate({ id: "governance.howItWorks.rail.title", message: "Some rules run as code." })}
          lede={translate({
            id: "governance.howItWorks.rail.lede",
            message:
              "The constitution comes with a guardrails script. It checks every parameter change and treasury withdrawal the moment it is submitted. Break a hard limit and the ledger rejects the proposal before anyone votes.",
          })}
        >
          <GuardrailCheck />
        </Module>

        <Chapter id="treasury" scene="treasury" num="14" name={ch.treasury}>
          <h2>{translate({ id: "governance.howItWorks.treasury.title", message: "A treasury that answers to holders." })}</h2>
          <p>
            <Translate
              id="governance.howItWorks.treasury.p1"
              values={{
                cut: (
                  <G to="/glossary/treasury-cut">
                    {translate({ id: "governance.howItWorks.treasury.p1.cut", message: "20% of the rewards" })}
                  </G>
                ),
                amount: treasuryB,
              }}
            >
              {"Every epoch, {cut} flows into the treasury, about 3.7 million ada every five days. It holds {amount} billion ada today."}
            </Translate>
          </p>
          <p>
            <Translate
              id="governance.howItWorks.treasury.p2"
              values={{
                withdrawals: (
                  <G to="/glossary/treasury-withdrawal">
                    {translate({ id: "governance.howItWorks.treasury.p2.withdrawals", message: "70 withdrawals" })}
                  </G>
                ),
              }}
            >
              {"Since mid-2025, DReps and the committee have approved {withdrawals} worth about 804 million ada. Each needs 67% of active DRep stake and two thirds of the committee, and must follow the constitution's rules on spending limits, audits, and oversight."}
            </Translate>
          </p>
          <span className={styles.stamp}>{snapshotStamp}</span>
        </Chapter>

        <Chapter id="your-move" scene="finale" num="15" name={ch["your-move"]}>
          <h2>{translate({ id: "governance.howItWorks.yourMove.title", message: "Your ada is already in the room." })}</h2>
          <p>
            {translate({
              id: "governance.howItWorks.yourMove.p1",
              message: "Governance runs every epoch, whether you take part or not. The only choice is whose judgment your ada carries.",
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
          {translate(
            {
              id: "governance.howItWorks.sources.about",
              message:
                "Vote results, voting power, counts of DReps, delegations, and votes, and treasury figures come from the Cardano ledger at epoch {epoch} (September 16, 2026) unless marked live. Vote results are the ledger's own ratification tallies. The epoch clock and the timing strip are computed from the mainnet schedule. The number of active DReps, the committee size, and the treasury balance load live from data.cardano.org when available. The drafting history of the constitution comes from Intersect.",
            },
            { epoch: SNAPSHOT.epoch }
          )}
        </p>
        <p>
          {translate({
            id: "governance.howItWorks.sources.fineprint",
            message:
              "Thresholds reflect protocol parameters at the snapshot epoch. Stake pools can set how their silence counts through their reward account; on hard forks, silence always counts as No.",
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
          <li>
            <Link to="https://www.intersectmbo.org/news/cardanos-delegate-endorsed-constitution-now-on-chain-for-dreps-and-the-icc-to-consider">
              {translate({ id: "governance.howItWorks.sources.intersect", message: "Intersect: the delegate-endorsed constitution" })}
            </Link>
          </li>
          <li>
            <Link to="/hardforks">{translate({ id: "governance.howItWorks.sources.hardforks", message: "Cardano hard forks" })}</Link>
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
