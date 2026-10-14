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
    // Chapter 01: your ada as voting weight
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

    // Chapter 02: three groups around a proposal
    committee: translate({ id: "governance.howItWorks.canvas.committee", message: "COMMITTEE" }),
    committeeMembers: translate({ id: "governance.howItWorks.canvas.committeeMembers", message: "{count} members" }),
    oneMemberOneVote: translate({ id: "governance.howItWorks.canvas.oneMemberOneVote", message: "one member, one vote" }),
    dreps: translate({ id: "governance.howItWorks.canvas.dreps", message: "DREPS" }),
    drepsActive: translate({ id: "governance.howItWorks.canvas.drepsActive", message: "{count} active" }),
    weightedByAda: translate({ id: "governance.howItWorks.canvas.weightedByAda", message: "weighted by delegated ada" }),
    stakePools: translate({ id: "governance.howItWorks.canvas.stakePools", message: "STAKE POOLS" }),
    weightedByStake: translate({ id: "governance.howItWorks.canvas.weightedByStake", message: "weighted by pool stake" }),
    governanceAction: translate({ id: "governance.howItWorks.canvas.governanceAction", message: "GOVERNANCE ACTION" }),

    // Chapter 03: governance action
    adaDeposit: translate({ id: "governance.howItWorks.canvas.adaDeposit", message: "ada deposit" }),
    anchor: translate({ id: "governance.howItWorks.canvas.anchor", message: "anchor: document URL + hash" }),

    // Chapter 04: the balance
    proposal: translate({ id: "governance.howItWorks.canvas.proposal", message: "PROPOSAL" }),
    constitution: translate({ id: "governance.howItWorks.canvas.constitution", message: "CONSTITUTION" }),
    constitutionalCommittee: translate({ id: "governance.howItWorks.canvas.constitutionalCommittee", message: "CONSTITUTIONAL COMMITTEE" }),
    scaleNote: translate({ id: "governance.howItWorks.canvas.scaleNote", message: "checks actions against the constitution" }),
    inBalance: translate({ id: "governance.howItWorks.canvas.inBalance", message: "IN BALANCE WITH THE CONSTITUTION" }),

    // Chapter 05: treasury
    epochRewards: translate({ id: "governance.howItWorks.canvas.epochRewards", message: "EPOCH REWARDS" }),
    fromReserves: translate({ id: "governance.howItWorks.canvas.fromReserves", message: "from reserves and fees" }),
    toPools: translate({ id: "governance.howItWorks.canvas.toPools", message: "80% · POOLS AND DELEGATORS" }),
    toPoolsShort: translate({ id: "governance.howItWorks.canvas.toPoolsShort", message: "80% · POOLS" }),
    toTreasury: translate({ id: "governance.howItWorks.canvas.toTreasuryShare", message: "20% · TO THE TREASURY" }),
    toTreasuryShort: translate({ id: "governance.howItWorks.canvas.toTreasuryShort", message: "20% · treasury" }),
    treasury: translate({ id: "governance.howItWorks.canvas.treasury", message: "TREASURY" }),
    treasuryBalance: translate({ id: "governance.howItWorks.canvas.treasuryBalance", message: "{amount} billion ada" }),
    withdrawals: translate({ id: "governance.howItWorks.canvas.withdrawals", message: "WITHDRAWALS" }),
    withdrawalsNote: translate({ id: "governance.howItWorks.canvas.withdrawalsVote", message: "each one approved on-chain by vote" }),
    withdrawalsNoteShort: translate({ id: "governance.howItWorks.canvas.withdrawalsVoteShort", message: "approved by vote" }),

    // Chapter 06
    you: translate({ id: "governance.howItWorks.canvas.you", message: "YOU" }),
  };
}
