import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { ACTION_RULES, getActionNames, getPresets } from "@site/src/data/governanceStory";
import styles from "./styles.module.css";

const NEXT = { Y: "N", N: "A", A: "D", D: "Y" };
const SIM_ACTIONS = ["hardfork", "treasury", "param", "paramgov", "constitution", "committee", "noconf"];

// [yes, no, silent, abstain] stake -> slider shares in percent
function toShares(arr) {
  const tot = arr[0] + arr[1] + arr[2] + arr[3];
  return { y: (arr[0] / tot) * 100, n: (arr[1] / tot) * 100, a: (arr[3] / tot) * 100 };
}

function stateFromPreset(p) {
  return {
    preset: p.id,
    action: p.action,
    sec: p.sec,
    drep: toShares(p.drep),
    spo: p.spo ? toShares(p.spo) : { y: 45, n: 15, a: 10 },
    cc: p.cc.split(""),
  };
}

function StakeGroup({ id, title, colorVar, need, shares, onShare, pct }) {
  if (need == null) {
    return (
      <article className={clsx(styles.house, styles.houseOff)} style={{ "--gs-house": colorVar }}>
        <header>
          <h3>{title}</h3>
        </header>
        <p className={styles.offMsg}>
          {translate({ id: "governance.howItWorks.sim.offAction", message: "Does not vote on this action." })}
        </p>
      </article>
    );
  }
  const silent = Math.max(0, 100 - shares.y - shares.n - shares.a);
  const counted = 100 - shares.a;
  const approval = counted > 0.0001 ? shares.y / counted : 0;
  const ok = counted > 0.0001 && approval >= need - 1e-9;
  const sliders = [
    ["y", translate({ id: "governance.howItWorks.sim.yes", message: "Yes" }), "var(--site-vote-yes)"],
    ["n", translate({ id: "governance.howItWorks.sim.no", message: "No" }), "var(--site-vote-no)"],
    ["a", translate({ id: "governance.howItWorks.sim.abstain", message: "Abstain" }), "var(--site-vote-abstain)"],
  ];
  return (
    <article className={styles.house} style={{ "--gs-house": colorVar }}>
      <header>
        <h3>{title}</h3>
        <span className={styles.need}>
          {translate({ id: "governance.howItWorks.sim.needs", message: "needs" })} <b>{Math.round(need * 100)}%</b>
        </span>
      </header>
      <div className={styles.stack} aria-hidden="true">
        <i className={styles.stackYes} style={{ width: `${shares.y}%` }} />
        <i className={styles.stackNo} style={{ width: `${shares.n}%` }} />
        <i className={styles.stackSilent} style={{ width: `${silent}%` }} />
        <i className={styles.stackAbstain} style={{ width: `${shares.a}%` }} />
      </div>
      <div className={styles.sliders}>
        {sliders.map(([w, label, color]) => (
          <div className={styles.slider} key={w}>
            <label htmlFor={`gs-${id}-${w}`}>
              <i style={{ background: color }} aria-hidden="true" />
              {label}
            </label>
            <output htmlFor={`gs-${id}-${w}`}>{pct(shares[w] / 100)}</output>
            <input
              type="range"
              id={`gs-${id}-${w}`}
              min="0"
              max="100"
              step="0.1"
              value={shares[w].toFixed(1)}
              onChange={(e) => onShare(w, +e.target.value)}
            />
          </div>
        ))}
        <p className={styles.silent}>
          <i aria-hidden="true" />
          {translate({ id: "governance.howItWorks.sim.silent", message: "Silent" })} <b>{pct(silent / 100)}</b>
          <span>{translate({ id: "governance.howItWorks.sim.countsAsNo", message: "counts as No" })}</span>
        </p>
      </div>
      <div className={styles.meter}>
        <div className={styles.meterTrack}>
          <i className={styles.meterFill} style={{ width: `${approval * 100}%` }} />
          <i className={styles.meterTick} style={{ left: `${need * 100}%` }} />
        </div>
        <div className={styles.meterRead}>
          <span>
            <b className={styles.meterValue}>{counted > 0.0001 ? pct(approval) : translate({ id: "governance.howItWorks.sim.notApplicable", message: "n/a" })}</b>
            <span className={styles.meterCaption}>
              {translate({ id: "governance.howItWorks.sim.yesOfCounted", message: "yes of counted stake" })}
            </span>
          </span>
          <span className={clsx(styles.pill, ok ? styles.pillOk : styles.pillBad)}>
            {ok
              ? translate({ id: "governance.howItWorks.sim.clears", message: "Clears" })
              : translate({ id: "governance.howItWorks.sim.short", message: "Short" })}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function CountSimulator() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const presets = useMemo(() => getPresets(), []);
  const names = useMemo(() => getActionNames(), []);
  const [st, setSt] = useState(() => stateFromPreset(presets[0]));

  const pctFmt = useMemo(
    () => new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    [locale]
  );
  const pct = (v) => pctFmt.format(v);
  const list = (items) => {
    try {
      return new Intl.ListFormat(locale, { type: "conjunction" }).format(items);
    } catch (e) {
      return items.join(", ");
    }
  };

  const rule = ACTION_RULES[st.action];
  const spoNeed = rule.spo === "sec" ? (st.sec ? 0.51 : null) : rule.spo;
  const preset = presets.find((p) => p.id === st.preset);

  const custom = (patch) => setSt((s) => ({ ...s, ...patch(s), preset: null }));
  const setShare = (group) => (w, val) =>
    custom((s) => {
      const h = { ...s[group], [w]: val };
      const others = ["y", "n", "a"].filter((k) => k !== w);
      const over = h.y + h.n + h.a - 100;
      if (over > 0) {
        const o = h[others[0]] + h[others[1]];
        others.forEach((k) => {
          h[k] = o > 0 ? Math.max(0, h[k] - (over * h[k]) / o) : 0;
        });
      }
      return { [group]: h };
    });

  // Verdict
  const fails = [];
  const drepCounted = 100 - st.drep.a;
  const drepAppr = drepCounted > 0.0001 ? st.drep.y / drepCounted : 0;
  if (!(drepCounted > 0.0001 && drepAppr >= rule.drep - 1e-9)) fails.push({ name: "drep", val: drepAppr, need: rule.drep });
  if (spoNeed != null) {
    const c = 100 - st.spo.a;
    const a = c > 0.0001 ? st.spo.y / c : 0;
    if (!(c > 0.0001 && a >= spoNeed - 1e-9)) fails.push({ name: "spo", val: a, need: spoNeed });
  }
  const ccYes = st.cc.filter((v) => v === "Y").length;
  const ccDen = st.cc.length - st.cc.filter((v) => v === "A").length;
  const ccRatio = ccDen > 0 ? ccYes / ccDen : 0;
  const ccOk = ccDen > 0 && ccRatio >= 2 / 3 - 1e-9;
  if (rule.cc && !ccOk) fails.push({ name: "cc" });

  const groupLabel = {
    drep: translate({ id: "governance.howItWorks.group.dreps", message: "DReps" }),
    spo: translate({ id: "governance.howItWorks.group.pools", message: "Stake pools" }),
  };
  const why = fails.map((f) =>
    f.name === "cc"
      ? translate(
          { id: "governance.howItWorks.sim.failCommittee", message: "the committee ({yes} of {den}, needs two thirds)" },
          { yes: ccYes, den: ccDen }
        )
      : translate(
          { id: "governance.howItWorks.sim.failGroup", message: "{group} ({value}, needs {need})" },
          { group: groupLabel[f.name], value: pct(f.val), need: `${Math.round(f.need * 100)}%` }
        )
  );
  const vName = {
    Y: translate({ id: "governance.howItWorks.sim.yes", message: "Yes" }),
    N: translate({ id: "governance.howItWorks.sim.no", message: "No" }),
    A: translate({ id: "governance.howItWorks.sim.abstain", message: "Abstain" }),
    D: translate({ id: "governance.howItWorks.sim.silent", message: "Silent" }),
  };

  return (
    <div className={styles.sim}>
      <div className={styles.simSide}>
        <div className={styles.field}>
          <span className={styles.fieldLabel} id="gs-presets-label">
            {translate({ id: "governance.howItWorks.sim.realVotes", message: "Real votes" })}
          </span>
          <div className={styles.presets} role="group" aria-labelledby="gs-presets-label">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={styles.chip}
                aria-pressed={st.preset === p.id}
                onClick={() => setSt(stateFromPreset(p))}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <p className={styles.note} aria-live="polite">
          <b>
            {preset
              ? translate({ id: "governance.howItWorks.fromLedger", message: "From the ledger" })
              : translate({ id: "governance.howItWorks.sim.yourScenario", message: "Your scenario" })}
          </b>
          {preset
            ? preset.note
            : translate({
                id: "governance.howItWorks.sim.customNote",
                message: "You changed the vote. Pick a real vote above to reset it.",
              })}
        </p>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="gs-sim-action">
            {translate({ id: "governance.howItWorks.sim.actionType", message: "Action type" })}
          </label>
          <select id="gs-sim-action" className={styles.select} value={st.action} onChange={(e) => custom(() => ({ action: e.target.value }))}>
            {SIM_ACTIONS.map((k) => (
              <option key={k} value={k}>
                {names[k]}
              </option>
            ))}
          </select>
        </div>
        {rule.spo === "sec" && (
          <label className={styles.check}>
            <input type="checkbox" checked={st.sec} onChange={(e) => custom(() => ({ sec: e.target.checked }))} />
            <span>
              {translate({
                id: "governance.howItWorks.sim.security",
                message: "Changes a security-relevant setting, so stake pools vote too",
              })}
            </span>
          </label>
        )}
      </div>

      <div className={styles.simMain}>
        <div className={styles.houses}>
          <StakeGroup id="drep" title={groupLabel.drep} colorVar="var(--site-role-drep)" need={rule.drep} shares={st.drep} onShare={setShare("drep")} pct={pct} />
          <StakeGroup id="spo" title={groupLabel.spo} colorVar="var(--site-role-pool)" need={spoNeed} shares={st.spo} onShare={setShare("spo")} pct={pct} />
          <article className={clsx(styles.house, !rule.cc && styles.houseOff)} style={{ "--gs-house": "var(--site-role-committee)" }}>
            <header>
              <h3>{translate({ id: "governance.howItWorks.group.committee", message: "Committee" })}</h3>
              {rule.cc && (
                <span className={styles.need}>
                  {translate({ id: "governance.howItWorks.sim.needs", message: "needs" })} <b>2/3</b>
                </span>
              )}
            </header>
            {rule.cc ? (
              <>
                <div className={styles.seats}>
                  {st.cc.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      className={clsx(styles.seat, styles[`seat${v}`])}
                      aria-label={translate(
                        {
                          id: "governance.howItWorks.sim.seatLabel",
                          message: "Committee member {n}: {vote}. Activate to change.",
                        },
                        { n: i + 1, vote: vName[v] }
                      )}
                      onClick={() =>
                        custom((s) => {
                          const cc = s.cc.slice();
                          cc[i] = NEXT[cc[i]];
                          return { cc };
                        })
                      }
                    >
                      {v === "D" ? "·" : vName[v].charAt(0)}
                    </button>
                  ))}
                </div>
                <p className={styles.seatHelp}>
                  {translate({
                    id: "governance.howItWorks.sim.seatHelp",
                    message: "Tap a seat to cycle its vote: Yes, No, Abstain, Silent.",
                  })}
                </p>
                <div className={styles.meter}>
                  <div className={styles.meterTrack}>
                    <i className={styles.meterFill} style={{ width: `${ccRatio * 100}%` }} />
                    <i className={styles.meterTick} style={{ left: "66.67%" }} />
                  </div>
                  <div className={styles.meterRead}>
                    <span>
                      <b className={styles.meterValue}>
                        {translate({ id: "governance.howItWorks.sim.seatRatio", message: "{yes} of {den}" }, { yes: ccYes, den: ccDen })}
                      </b>
                      <span className={styles.meterCaption}>
                        {translate({ id: "governance.howItWorks.sim.ofCountedSeats", message: "of counted seats" })}
                      </span>
                    </span>
                    <span className={clsx(styles.pill, ccOk ? styles.pillOk : styles.pillBad)}>
                      {ccOk
                        ? translate({ id: "governance.howItWorks.sim.clears", message: "Clears" })
                        : translate({ id: "governance.howItWorks.sim.short", message: "Short" })}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className={styles.offMsg}>
                {translate({
                  id: "governance.howItWorks.sim.offCommittee",
                  message: "Does not vote on this action. The committee has no say over its own membership.",
                })}
              </p>
            )}
          </article>
        </div>
        <span className={styles.srOnly} aria-live="polite">
          {fails.length
            ? translate({ id: "governance.howItWorks.sim.notRatified", message: "Not ratified" })
            : translate({ id: "governance.howItWorks.sim.ratified", message: "Ratified" })}
        </span>
        <div className={clsx(styles.verdict, fails.length ? styles.verdictFail : styles.verdictPass)}>
          <span className={styles.verdictSig}>
            {fails.length
              ? translate({ id: "governance.howItWorks.sim.notRatified", message: "Not ratified" })
              : translate({ id: "governance.howItWorks.sim.ratified", message: "Ratified" })}
          </span>
          <p>
            {fails.length
              ? translate(
                  {
                    id: "governance.howItWorks.sim.failText",
                    message: "Falling short: {why}. If nothing changes within six epochs, the action expires and the deposit goes back.",
                  },
                  { why: list(why) }
                )
              : translate({
                  id: "governance.howItWorks.sim.passText",
                  message:
                    "Every group that votes on this action cleared its threshold. The ledger ratifies it at the next epoch boundary and enacts it one epoch later.",
                })}
          </p>
        </div>
      </div>
    </div>
  );
}
