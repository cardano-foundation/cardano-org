---
title: Governance Action Lifetime
slug: governance-action-lifetime
short: The protocol parameter that caps how many epochs a governance action can stay open for votes before it expires unresolved.
category: governance
level: intermediate
aliases: ["govActionLifetime"]
mentalModel: "An expiry date on every governance action. If a proposal does not collect the required votes before the deadline, it lapses and has to be resubmitted to try again."
related: [governance-action, drep, cip-1694, voting-thresholds]
---

If a governance action expires, the action's submission deposit is returned to the proposer. The lifetime exists so the protocol does not accumulate an open backlog of stale proposals waiting indefinitely for votes that may never arrive.
