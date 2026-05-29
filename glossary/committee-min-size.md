---
title: Committee Minimum Size
slug: committee-min-size
short: The protocol parameter that sets the minimum number of seated Constitutional Committee members required for the committee to be operational; below this floor, any governance action that needs committee approval stalls until the seats are refilled.
category: governance
level: advanced
aliases: ["committeeMinSize"]
mentalModel: "A quorum floor on the Constitutional Committee. The committee can only vote as long as it has enough seated members; if seats fall below the floor, every action that needs committee approval is on hold until new members are confirmed."
related: [constitutional-committee, voting-thresholds, governance-action, cip-1694]
---

`committeeMinSize` belongs to the governance group of protocol parameters. Changing it requires ratification by the Constitutional Committee and DReps through a protocol-parameter governance action; stake pool operators do not vote on it, because it is not one of the security-relevant parameters.

If the number of active committee members ever drops below `committeeMinSize`, the Constitutional Committee becomes unable to ratify governance actions, so any action that needs its approval stalls until enough new members are confirmed via a committee-update governance action. This is distinct from a state of no-confidence, which is reached only through a successful no-confidence governance action.
