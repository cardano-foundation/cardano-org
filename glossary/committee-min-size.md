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

The parameter is one of the security-critical protocol parameters, so changing it requires DRep, SPO, and Constitutional Committee approval (all three bodies) through an ordinary protocol parameter governance action.

If the active committee size ever drops below `committeeMinSize`, the on-chain state is treated as a state of no-confidence until enough new members are confirmed via a committee-update governance action.
