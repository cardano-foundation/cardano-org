---
title: Programmable Token
slug: programmable-token
short: "A native token that can only change owner when a script approves the transfer, so the issuer can enforce rules like allowlists, transfer limits, or freezes on the token's transfers. CIP-113 is the proposed standard for them on Cardano."
category: tokens
level: intermediate
aliases: ["CIP-113", "Programmable Tokens", "Smart Token"]
mentalModel: "A native token with a rulebook attached. It still lives in the ledger like any other token, but it is always held by a shared smart contract, and every move has to pass the token's rules before the ledger accepts it."
related: [native-token, stablecoin, smart-contract, stake-address, cip]
sources:
  - title: "CIP-113: Programmable token-like assets (proposal)"
    url: "https://github.com/cardano-foundation/CIPs/pull/444"
  - title: "CIP-113 reference implementation"
    url: "https://github.com/cardano-foundation/cip113-programmable-tokens"
---

An ordinary [native token](/glossary/native-token/) follows whoever controls the address it sits at, and its issuer has no say in where it goes next. That is a problem for regulated assets such as stablecoins or tokenized securities. Depending on the asset and the jurisdiction, their issuers may need to limit transfers to verified holders, block sanctioned addresses, or freeze funds on a court order. CIP-113 describes how to add such rules using features Cardano already has, without a hard fork.

Within one CIP-113 deployment, all programmable tokens are held by the same payment script. Each holder's address combines that script with the holder's own credential in the stake part of the address, so the owner can be a key holder or a smart contract. An on-chain registry lists each programmable token together with the scripts that govern it. When a holder sends a programmable token, the token's registered transfer check has to pass, usually a script and in some cases a required signature.

Actions by third parties, such as a seizure, follow a separate script that the token's registry entry also names. Together with the rules for minting and burning, and optional shared state such as a pause flag, these token-specific scripts form the token's substandard. CIP-113 does not define a universal token administrator. The "freeze and seize" substandard, for example, lets authorized parties put holders on an on-chain denylist, which blocks transfers from and to them, and seize the tokens that denylisted holders keep. Another substandard might only allow third-party actions that can never reduce a holder's balance. In the reference implementation the issuer can also, depending on how the token was registered, swap the transfer and third-party scripts later, and the new rules apply to all existing holders. On top of that, the draft gives each deployment an upgrade authority, such as a key, a multisig, or a governance mechanism, that can replace the shared validation logic for every token in it. Before holding a programmable token, check its current rules, who can change them, and who controls upgrades.

Wallets need dedicated support to show these tokens, because they sit at the derived script address rather than at the holder's usual address. CIP-113 is still a proposal under review in the CIP process. It incorporates an earlier proposal, CIP-143, and the Cardano Foundation maintains an open-source reference implementation with on-chain contracts written in [Aiken](/glossary/aiken/).
