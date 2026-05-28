---
title: Redeemer
slug: redeemer
short: Data supplied by the spending transaction that tells a smart contract what action is being attempted.
category: smart-contracts
mentalModel: "The action you announce when trying to spend a contract-locked UTxO: 'I want to do X.' The script either nods or refuses."
related: [datum, eutxo, smart-contract]
---

Data supplied by the transaction that tries to spend a smart-contract-locked output. The redeemer answers the question "what is this transaction trying to do?", while the datum answers "what state is currently attached to this output?". The script evaluates both together and either authorizes or rejects the spend.
