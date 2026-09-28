import { translate } from "@docusaurus/Translate";

// Suffixes for the epoch countdown ("3d 9h 12m 04s").
export function getTimeUnits() {
  return {
    d: translate({ id: "governance.howItWorks.unit.days", message: "d", description: "Abbreviation for days in a countdown" }),
    h: translate({ id: "governance.howItWorks.unit.hours", message: "h", description: "Abbreviation for hours in a countdown" }),
    m: translate({ id: "governance.howItWorks.unit.minutes", message: "m", description: "Abbreviation for minutes in a countdown" }),
    s: translate({ id: "governance.howItWorks.unit.seconds", message: "s", description: "Abbreviation for seconds in a countdown" }),
  };
}

// Every string the canvas draws. Kept as static translate() calls so
// `yarn write-translations` can extract them for Crowdin. Placeholders in
// curly braces ({count}, {ada}, ...) are filled in by the engine.
export function getCanvasLabels() {
  return {
    // Live epoch dial
    epoch: translate({ id: "governance.howItWorks.canvas.epoch", message: "EPOCH" }),
    untilCount: translate({ id: "governance.howItWorks.canvas.untilCount", message: "UNTIL THE NEXT COUNT" }),
    epochDays: translate({ id: "governance.howItWorks.canvas.epochDays", message: "ONE EPOCH = FIVE DAYS" }),
    units: getTimeUnits(),
    billions: translate({ id: "governance.howItWorks.canvas.billions", message: "{amount}B" }),

    // Chapter 01: genesis keys
    protocolUpgrades: translate({ id: "governance.howItWorks.canvas.protocolUpgrades", message: "PROTOCOL UPGRADES" }),
    everyoneElse: translate({ id: "governance.howItWorks.canvas.everyoneElse", message: "EVERYONE ELSE" }),
    genesisKeys: translate({ id: "governance.howItWorks.canvas.genesisKeys", message: "SEVEN GENESIS KEYS" }),
    genesisKeysNote: translate({ id: "governance.howItWorks.canvas.genesisKeysNote", message: "Every protocol upgrade needed their signatures" }),

    // Chapters 02 and 03: the governance wheel
    chang: translate({ id: "governance.howItWorks.canvas.chang", message: "CHANG" }),
    plomin: translate({ id: "governance.howItWorks.canvas.plomin", message: "PLOMIN" }),
    changLive: translate({ id: "governance.howItWorks.canvas.changLive", message: "THREE OF SEVEN ACTION TYPES LIVE" }),
    plominLive: translate({ id: "governance.howItWorks.canvas.plominLive", message: "SEVEN OF SEVEN ACTION TYPES LIVE" }),
    epochNumber: translate({ id: "governance.howItWorks.canvas.epochNumber", message: "EPOCH {epoch}" }),
    arcs: [
      [translate({ id: "governance.howItWorks.canvas.arc.parameters", message: "Parameter changes" }), translate({ id: "governance.howItWorks.canvas.arc.parameters.short", message: "Parameters" })],
      [translate({ id: "governance.howItWorks.canvas.arc.hardForks", message: "Hard forks" }), translate({ id: "governance.howItWorks.canvas.arc.hardForks.short", message: "Hard forks" })],
      [translate({ id: "governance.howItWorks.canvas.arc.info", message: "Info actions" }), translate({ id: "governance.howItWorks.canvas.arc.info.short", message: "Info" })],
      [translate({ id: "governance.howItWorks.canvas.arc.treasury", message: "Treasury withdrawals" }), translate({ id: "governance.howItWorks.canvas.arc.treasury.short", message: "Treasury" })],
      [translate({ id: "governance.howItWorks.canvas.arc.constitution", message: "New constitution" }), translate({ id: "governance.howItWorks.canvas.arc.constitution.short", message: "Constitution" })],
      [translate({ id: "governance.howItWorks.canvas.arc.committee", message: "Committee updates" }), translate({ id: "governance.howItWorks.canvas.arc.committee.short", message: "Committee" })],
      [translate({ id: "governance.howItWorks.canvas.arc.noConfidence", message: "No confidence" }), translate({ id: "governance.howItWorks.canvas.arc.noConfidence.short", message: "No confidence" })],
    ],
    legendInterim: translate({ id: "governance.howItWorks.canvas.legendInterim", message: "Interim committee" }),
    legendCommittee: translate({ id: "governance.howItWorks.canvas.legendCommittee", message: "Committee" }),
    legendPools: translate({ id: "governance.howItWorks.canvas.legendPools", message: "Stake pools" }),
    legendDrepsWaiting: translate({ id: "governance.howItWorks.canvas.legendDrepsWaiting", message: "DReps: votes not counted yet" }),
    legendDreps: translate({ id: "governance.howItWorks.canvas.legendDreps", message: "DReps" }),

    // Chapter 04: your ada as voting weight
    snapshot: translate({ id: "governance.howItWorks.canvas.snapshot", message: "EPOCH BOUNDARY · SNAPSHOT" }),
    weightCounted: translate({ id: "governance.howItWorks.canvas.weightCounted", message: "WEIGHT COUNTED WITH YOUR DREP" }),
    yourWallet: translate({ id: "governance.howItWorks.canvas.yourWallet", message: "YOUR WALLET" }),
    rewards: translate({ id: "governance.howItWorks.canvas.rewards", message: "rewards" }),
    stakeKey: translate({ id: "governance.howItWorks.canvas.stakeKey", message: "YOUR STAKE KEY" }),
    stakeKeyShort: translate({ id: "governance.howItWorks.canvas.stakeKeyShort", message: "STAKE KEY" }),
    adaStays: translate({ id: "governance.howItWorks.canvas.adaStays", message: "Your ada stays here. Nothing is locked." }),
    adaStaysShort: translate({ id: "governance.howItWorks.canvas.adaStaysShort", message: "Your ada stays here" }),
    yourDrep: translate({ id: "governance.howItWorks.canvas.yourDrep", message: "YOUR DREP" }),
    yourWeight: translate({ id: "governance.howItWorks.canvas.yourWeight", message: "+ your weight" }),
    otherDelegators: translate({ id: "governance.howItWorks.canvas.otherDelegators", message: "other delegators" }),
    others: translate({ id: "governance.howItWorks.canvas.others", message: "others" }),
    notToScale: translate({ id: "governance.howItWorks.canvas.notToScale", message: "not to scale" }),
    adaEqualsVotes: translate({ id: "governance.howItWorks.canvas.adaEqualsVotes", message: "{ada} ada = {votes} votes" }),

    // Chapter 05: two delegations
    stakePool: translate({ id: "governance.howItWorks.canvas.stakePool", message: "STAKE POOL" }),
    securityRewards: translate({ id: "governance.howItWorks.canvas.securityRewards", message: "security and rewards" }),
    drep: translate({ id: "governance.howItWorks.canvas.drep", message: "DREP" }),
    yourVoice: translate({ id: "governance.howItWorks.canvas.yourVoice", message: "your voice" }),
    sameAda: translate({ id: "governance.howItWorks.canvas.sameAda", message: "Same ada, two choices" }),

    // Chapters 06 to 08: three circles
    committee: translate({ id: "governance.howItWorks.canvas.committee", message: "COMMITTEE" }),
    committeeMembers: translate({ id: "governance.howItWorks.canvas.committeeMembers", message: "{count} members" }),
    votedIn: translate({ id: "governance.howItWorks.canvas.votedIn", message: "voted in" }),
    removed: translate({ id: "governance.howItWorks.canvas.removed", message: "removed" }),
    dreps: translate({ id: "governance.howItWorks.canvas.dreps", message: "DREPS" }),
    drepsActive: translate({ id: "governance.howItWorks.canvas.drepsActive", message: "{count} active" }),
    stakePools: translate({ id: "governance.howItWorks.canvas.stakePools", message: "STAKE POOLS" }),
    poolsWithStake: translate({ id: "governance.howItWorks.canvas.poolsWithStake", message: "{count} with stake" }),
    oneDotOneMember: translate({ id: "governance.howItWorks.canvas.oneDotOneMember", message: "ONE DOT = ONE MEMBER" }),
    updateCommittee: translate({ id: "governance.howItWorks.canvas.updateCommittee", message: "UPDATE COMMITTEE" }),
    updateCommitteeNote: translate({ id: "governance.howItWorks.canvas.updateCommitteeNote", message: "DReps 67% and stake pools 51% vote members in" }),
    noConfidence: translate({ id: "governance.howItWorks.canvas.noConfidence", message: "NO CONFIDENCE" }),
    noConfidenceNote: translate({ id: "governance.howItWorks.canvas.noConfidenceNote", message: "DReps 67% and stake pools 51% vote the committee out" }),
    noCommittee: translate({ id: "governance.howItWorks.canvas.noCommittee", message: "NO COMMITTEE" }),
    removedCaps: translate({ id: "governance.howItWorks.canvas.removedCaps", message: "REMOVED" }),

    // Chapter 09: voting power
    delegatedForGovernance: translate({ id: "governance.howItWorks.canvas.delegatedForGovernance", message: "Ada delegated for governance" }),
    perDot: translate({ id: "governance.howItWorks.canvas.perDot", message: "one dot ≈ {amount} million ada" }),
    activeDreps: translate({ id: "governance.howItWorks.canvas.activeDreps", message: "5.10B · ACTIVE DREPS" }),
    alwaysAbstain: translate({ id: "governance.howItWorks.canvas.alwaysAbstain", message: "10.30B · ALWAYS ABSTAIN" }),
    theseDecide: translate({ id: "governance.howItWorks.canvas.theseDecide", message: "These decide" }),
    powerRest: translate({ id: "governance.howItWorks.canvas.powerRest", message: "0.20B inactive DReps · 0.14B Always No Confidence" }),

    // Chapter 10: governance action
    governanceAction: translate({ id: "governance.howItWorks.canvas.governanceAction", message: "GOVERNANCE ACTION" }),
    adaDeposit: translate({ id: "governance.howItWorks.canvas.adaDeposit", message: "ada deposit" }),
    anchor: translate({ id: "governance.howItWorks.canvas.anchor", message: "anchor: document URL + hash" }),

    // Chapter 11: counting
    tallyTitle: translate({ id: "governance.howItWorks.canvas.tallyTitle", message: "103,000 ada treasury withdrawal · August 2026 · DRep vote" }),
    tallyTitleShort: translate({ id: "governance.howItWorks.canvas.tallyTitleShort", message: "103,000 ada withdrawal · August 2026" }),
    tallyYesShare: translate({ id: "governance.howItWorks.canvas.tallyYesShare", message: "65.2% yes" }),
    tallyNeeded: translate({ id: "governance.howItWorks.canvas.tallyNeeded", message: "67% NEEDED" }),
    tallyCounted: translate({ id: "governance.howItWorks.canvas.tallyCounted", message: "COUNTED · 4.43B" }),
    tallyYes: translate({ id: "governance.howItWorks.canvas.tallyYes", message: "YES 2.89B" }),
    tallyCountsAsNo: translate({ id: "governance.howItWorks.canvas.tallyCountsAsNo", message: "COUNTS AS NO · 1.54B" }),
    tallyNoParts: translate({ id: "governance.howItWorks.canvas.tallyNoParts", message: "voted No 0.05B · Always No Confidence 0.14B ·" }),
    tallyNoPartsShort: translate({ id: "governance.howItWorks.canvas.tallyNoPartsShort", message: "voted No 0.05B · No Confidence 0.14B" }),
    tallySilent: translate({ id: "governance.howItWorks.canvas.tallySilent", message: "silent DReps 1.35B" }),
    tallyLeftOut: translate({ id: "governance.howItWorks.canvas.tallyLeftOut", message: "LEFT OUT OF THE COUNT · 11.11B" }),
    tallyAbstainParts: translate({ id: "governance.howItWorks.canvas.tallyAbstainParts", message: "voted Abstain 0.81B · Always Abstain 10.30B" }),
    tallyInsight: translate({ id: "governance.howItWorks.canvas.tallyInsight", message: "Had the silent DReps abstained, it would have passed with 93.7% yes." }),
    tallyInsight1: translate({ id: "governance.howItWorks.canvas.tallyInsight1", message: "Had the silent DReps abstained:" }),
    tallyInsight2: translate({ id: "governance.howItWorks.canvas.tallyInsight2", message: "93.7% yes. It would have passed." }),

    // Chapter 12: timing
    moreEpochs: translate({ id: "governance.howItWorks.canvas.moreEpochs", message: "UP TO SIX MORE EPOCHS TO PASS" }),
    moreEpochsShort: translate({ id: "governance.howItWorks.canvas.moreEpochsShort", message: "UP TO SIX MORE EPOCHS" }),
    now: translate({ id: "governance.howItWorks.canvas.now", message: "NOW" }),
    expired: translate({ id: "governance.howItWorks.canvas.expired", message: "EXPIRED" }),
    ratifiedEnacted: translate({ id: "governance.howItWorks.canvas.ratifiedEnacted", message: "Ratified at a boundary, enacted at the next" }),

    // Chapter 13: ten tenets
    tenets: [
      [translate({ id: "governance.howItWorks.canvas.tenet.1", message: "Transaction processing" }), translate({ id: "governance.howItWorks.canvas.tenet.1.short", message: "Transactions" })],
      [translate({ id: "governance.howItWorks.canvas.tenet.2", message: "Cost predictability" }), translate({ id: "governance.howItWorks.canvas.tenet.2.short", message: "Costs" })],
      [translate({ id: "governance.howItWorks.canvas.tenet.3", message: "Developer freedom" }), translate({ id: "governance.howItWorks.canvas.tenet.3.short", message: "Dev freedom" })],
      [translate({ id: "governance.howItWorks.canvas.tenet.4", message: "Fair contribution" }), translate({ id: "governance.howItWorks.canvas.tenet.4.short", message: "Contribution" })],
      [translate({ id: "governance.howItWorks.canvas.tenet.5", message: "User autonomy" }), translate({ id: "governance.howItWorks.canvas.tenet.5.short", message: "Autonomy" })],
      [translate({ id: "governance.howItWorks.canvas.tenet.6", message: "Interoperability" }), translate({ id: "governance.howItWorks.canvas.tenet.6.short", message: "Interop" })],
      [translate({ id: "governance.howItWorks.canvas.tenet.7", message: "Value preservation" }), translate({ id: "governance.howItWorks.canvas.tenet.7.short", message: "Value" })],
      [translate({ id: "governance.howItWorks.canvas.tenet.8", message: "Resource efficiency" }), translate({ id: "governance.howItWorks.canvas.tenet.8.short", message: "Efficiency" })],
      [translate({ id: "governance.howItWorks.canvas.tenet.9", message: "Fair treatment" }), translate({ id: "governance.howItWorks.canvas.tenet.9.short", message: "Fairness" })],
      [translate({ id: "governance.howItWorks.canvas.tenet.10", message: "Monetary stability" }), translate({ id: "governance.howItWorks.canvas.tenet.10.short", message: "Stability" })],
    ],
    tenetsCaption: translate({ id: "governance.howItWorks.canvas.tenetsCaption", message: "TEN TENETS · ENACTED EPOCH 609" }),

    // Chapter 14: treasury
    epochRewards: translate({ id: "governance.howItWorks.canvas.epochRewards", message: "EPOCH REWARDS" }),
    fromReserves: translate({ id: "governance.howItWorks.canvas.fromReserves", message: "from reserves and fees" }),
    toPools: translate({ id: "governance.howItWorks.canvas.toPools", message: "80% · POOLS AND DELEGATORS" }),
    toPoolsShort: translate({ id: "governance.howItWorks.canvas.toPoolsShort", message: "80% · POOLS" }),
    toTreasury: translate({ id: "governance.howItWorks.canvas.toTreasury", message: "20% · about 3.7 million ada per epoch" }),
    toTreasuryShort: translate({ id: "governance.howItWorks.canvas.toTreasuryShort", message: "20% · treasury" }),
    treasury: translate({ id: "governance.howItWorks.canvas.treasury", message: "TREASURY" }),
    treasuryBalance: translate({ id: "governance.howItWorks.canvas.treasuryBalance", message: "{amount} billion ada" }),
    withdrawals: translate({ id: "governance.howItWorks.canvas.withdrawals", message: "WITHDRAWALS" }),
    withdrawalsNote: translate({ id: "governance.howItWorks.canvas.withdrawalsNote", message: "70 approved · about 804 million ada" }),
    withdrawalsNoteShort: translate({ id: "governance.howItWorks.canvas.withdrawalsNoteShort", message: "70 approved" }),

    // Chapter 15
    you: translate({ id: "governance.howItWorks.canvas.you", message: "YOU" }),
  };
}
