---
title: Voting Thresholds
slug: voting-thresholds
short: The set of protocol parameters that define what percentage of votes is required from each governance body (DReps, SPOs) to ratify each governance action type.
category: governance
level: advanced
link: /insights/governance-actions
aliases: ["DRep Thresholds", "SPO Thresholds", "dvt", "pvt"]
mentalModel: "The vote-count rules that decide whether each kind of governance action passes. Different action types have different bars; some only need DRep approval, some need both DRep and SPO approval, some additionally need the Constitutional Committee."
related: [governance-action, drep, constitutional-committee, cip-1694, drep-activity-period, governance-action-lifetime]
---

CIP-1694 splits the voting thresholds into two families of protocol parameters: `dvt*` for DRep thresholds and `pvt*` for SPO (stake pool operator) thresholds. The applicable subset depends on the action type, and several action types also require Constitutional Committee approval on top of the DRep/SPO votes.

### DRep voting thresholds (`dvt*`)

| Parameter | Applies to |
| --- | --- |
| `dvtMotionNoConfidence` | Motion of no confidence in the Constitutional Committee |
| `dvtCommitteeNormal` | Updating committee members or thresholds in a state of confidence |
| `dvtCommitteeNoConfidence` | Updating committee members or thresholds while in no-confidence |
| `dvtUpdateToConstitution` | Adopting a new constitution or guardrails script |
| `dvtHardForkInitiation` | Initiating a hard fork |
| `dvtPPNetworkGroup` | Changing network protocol parameters |
| `dvtPPEconomicGroup` | Changing economic protocol parameters |
| `dvtPPTechnicalGroup` | Changing technical protocol parameters |
| `dvtPPGovGroup` | Changing governance protocol parameters |
| `dvtTreasuryWithdrawal` | Approving a treasury withdrawal |

### SPO voting thresholds (`pvt*`)

| Parameter | Applies to |
| --- | --- |
| `pvtMotionNoConfidence` | Motion of no confidence in the Constitutional Committee |
| `pvtCommitteeNormal` | Updating committee members or thresholds in a state of confidence |
| `pvtCommitteeNoConfidence` | Updating committee members or thresholds while in no-confidence |
| `pvtHardForkInitiation` | Initiating a hard fork |
| `pvtPPSecurityGroup` | Changing any security-relevant protocol parameter |

The [governance action insights page](/insights/governance-actions) visualises which thresholds apply to each action type and how the three bodies (DReps, SPOs, Constitutional Committee) interact in the ratification flow.
