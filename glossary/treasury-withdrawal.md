---
title: Treasury Withdrawal
slug: treasury-withdrawal
short: A CIP-1694 governance action that proposes taking funds out of the on-chain treasury and paying them to a specified stake address.
category: governance
aliases: ["Treasury Withdrawal Action"]
link: /governance
mentalModel: "The on-chain spend mechanism for the community piggy bank. Anyone can propose taking ada out of the treasury and routing it to a stake address; DReps and the Constitutional Committee vote, and if it passes, the protocol pays out directly with no intermediary holding the money."
related: [governance-action, treasury, net-change-limit, drep, cip-1694, project-catalyst, plomin]
---

A governance action type that proposes withdrawing ada from the Cardano treasury and paying it out to a specified stake address. Treasury withdrawals require successful DRep and Constitutional Committee votes (the action does not need stake pool ratification).

The Plomin hard fork was the first to enable treasury withdrawals on mainnet. In the long run they replace Project Catalyst's off-chain funding pipeline with a fully on-chain mechanism that the community can approve or reject directly.
