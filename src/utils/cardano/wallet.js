// Lightweight CIP-30 wallet helpers backed by the Evolution SDK.
//
// The SDK (and its WASM) is imported dynamically so it only loads in the
// browser the moment it is actually needed. This keeps the initial bundle
// small and the modules out of the server-side render.

let evolutionPromise;

// The SDK's HTTP layer (@effect/platform) adds tracing headers (traceparent, b3)
// to every request. They aren't CORS-safelisted, so the browser preflights them
// and the Koios proxy (which allows only Content-Type) rejects it, breaking all
// SDK Koios calls with "Failed to fetch". We can't disable propagation on the
// SDK's internal client, so we strip these headers at global fetch; they carry
// no client-side meaning, so removing them is safe.
const TRACING_HEADERS = [
  "traceparent",
  "tracestate",
  "b3",
  "x-b3-traceid",
  "x-b3-spanid",
  "x-b3-sampled",
  "x-b3-parentspanid",
];
let fetchPatched = false;

function stripTracingHeadersFromGlobalFetch() {
  if (fetchPatched) return;
  if (typeof globalThis === "undefined" || typeof globalThis.fetch !== "function") return;
  const originalFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = (input, init) => {
    try {
      if (typeof Request !== "undefined" && input instanceof Request) {
        const headers = new Headers(input.headers);
        let changed = false;
        for (const name of TRACING_HEADERS) {
          if (headers.has(name)) { headers.delete(name); changed = true; }
        }
        if (changed) input = new Request(input, { headers });
      } else if (init && init.headers) {
        const headers = new Headers(init.headers);
        for (const name of TRACING_HEADERS) headers.delete(name);
        init = { ...init, headers };
      }
    } catch {
      // Never let header cleanup break a request; fall through to the original.
    }
    return originalFetch(input, init);
  };
  fetchPatched = true;
}

// Memoized dynamic import of the Evolution SDK.
export function loadEvolution() {
  if (!evolutionPromise) {
    stripTracingHeadersFromGlobalFetch();
    evolutionPromise = import("@evolution-sdk/evolution");
  }
  return evolutionPromise;
}

// Keys on window.cardano that are not wallet providers.
const CIP30_RESERVED = new Set([
  "enable",
  "isEnabled",
  "apiVersion",
  "name",
  "icon",
  "supportedExtensions",
]);

// Detect installed CIP-30 wallets by scanning window.cardano.
// Extensions inject themselves with a short delay, so we wait briefly first.
export async function detectWallets() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const cardano = typeof window !== "undefined" ? window.cardano : undefined;
  if (!cardano) return [];

  const wallets = [];
  for (const key of Object.getOwnPropertyNames(cardano)) {
    if (CIP30_RESERVED.has(key)) continue;
    const provider = cardano[key];
    if (provider && typeof provider === "object" && typeof provider.enable === "function") {
      wallets.push({
        id: key,
        name: provider.name || key,
        icon: provider.icon || "",
      });
    }
  }
  return wallets;
}

// Enable a wallet and return its raw CIP-30 API object.
export async function enableWallet(walletId) {
  const cardano = typeof window !== "undefined" ? window.cardano : undefined;
  if (!cardano?.[walletId]) {
    throw new Error(`Wallet "${walletId}" not found`);
  }
  return cardano[walletId].enable();
}

// CIP-30 returns hex-encoded addresses; convert the wallet's first address to bech32.
// Unused addresses are only fetched as a fallback for wallets with no history.
export async function firstAddressBech32(api) {
  const used = await api.getUsedAddresses();
  const hex = used?.[0] || (await api.getUnusedAddresses())?.[0];
  if (!hex) return null;

  const { Address } = await loadEvolution();
  return Address.toBech32(Address.fromHex(hex));
}

// Convert the wallet's first reward address (hex) to a bech32 stake address.
export async function firstRewardAddressBech32(api) {
  const rewards = await api.getRewardAddresses();
  const hex = rewards?.[0];
  if (!hex) return null;

  const { RewardAccount } = await loadEvolution();
  return RewardAccount.toBech32(RewardAccount.fromHex(hex));
}

// CIP-20 transaction message (metadata label 674) that tags every transaction
// cardano.org builds with its origin. The value follows the CIP-20 shape
// { "msg": [<lines>] }, where each line is a string of at most 64 bytes.
const CIP20_MSG_LABEL = 674n;
function cardanoOrgMessage() {
  return new Map([["msg", ["cardano.org"]]]);
}

// Map the UI's delegation target to an Evolution SDK DRep.
// DRep IDs follow CIP-129 (bech32 "drep1..." or hex); the two protocol
// options map to the AlwaysAbstain / AlwaysNoConfidence variants.
async function toDRep(target) {
  const { DRep, Schema } = await loadEvolution();
  if ("alwaysAbstain" in target) return DRep.alwaysAbstain();
  if ("alwaysNoConfidence" in target) return DRep.alwaysNoConfidence();
  const id = target.dRepId;
  return id.startsWith("drep")
    ? Schema.decodeSync(DRep.FromBech32)(id)
    : Schema.decodeSync(DRep.FromHex)(id);
}

// Build, sign (via the connected wallet) and submit a vote-delegation
// transaction. Coin selection and change come from the wallet; Koios
// supplies the protocol parameters. Returns the submitted tx hash.
export async function delegateVote({ api, target, koiosUrl }) {
  const { Client, mainnet, RewardAccount, Transaction } = await loadEvolution();

  const rewards = await api.getRewardAddresses();
  if (!rewards?.length) {
    throw new Error("Wallet did not return a reward address.");
  }
  const stakeCredential = RewardAccount.fromHex(rewards[0]).stakeCredential;
  const drep = await toDRep(target);

  const client = Client.make(mainnet)
    .withKoios({ baseUrl: koiosUrl })
    .withCip30(api);
  const built = await client
    .newTx()
    .delegateToDRep({ stakeCredential, drep })
    .attachMetadata({ label: CIP20_MSG_LABEL, metadata: cardanoOrgMessage() })
    .build();

  const unsignedTx = Transaction.toCBORHex(await built.toTransaction());
  const witnessSet = await api.signTx(unsignedTx, false);
  const signedTx = Transaction.addVKeyWitnessesHex(unsignedTx, witnessSet);
  return api.submitTx(signedTx);
}

// Bech32-encode a decoded output address, tolerating exotic address types.
function tryAddressBech32(Address, address) {
  try {
    return Address.toBech32(address);
  } catch {
    return null;
  }
}

// Build, sign and submit a Conway treasury donation transaction. The builder
// has no treasury-donation op, so we pay the amount to ourselves to make coin
// selection reserve the funds and compute fee/change, then rewrite the body:
// drop that self-payment output and carry the same lovelace as the Conway
// donation instead (with currentTreasuryValue, which the ledger requires to
// match the treasury at submission). Returns the submitted tx hash.
export async function donateToTreasury({ api, amountLovelace, currentTreasuryValue, koiosUrl }) {
  const { Client, mainnet, Transaction, Address, Assets } = await loadEvolution();

  const donation = BigInt(amountLovelace);
  if (donation <= 0n) {
    throw new Error("Donation amount must be greater than zero.");
  }

  const ownAddress = await firstAddressBech32(api);
  if (!ownAddress) {
    throw new Error("Wallet did not return a usable address.");
  }

  const client = Client.make(mainnet)
    .withKoios({ baseUrl: koiosUrl })
    .withCip30(api);
  // autoMinUtxo:false keeps the output at exactly `donation` lovelace so the
  // body rewrite below can match and drop it (a bumped output wouldn't match).
  const built = await client
    .newTx()
    .payToAddress({
      address: Address.fromBech32(ownAddress),
      assets: Assets.fromLovelace(donation),
      autoMinUtxo: false,
    })
    .attachMetadata({ label: CIP20_MSG_LABEL, metadata: cardanoOrgMessage() })
    .build();

  const tx = await built.toTransaction();
  const body = tx.body;

  let removed = false;
  const keptOutputs = [];
  for (const output of body.outputs) {
    const assets = output.assets;
    const isSelfPayment =
      !removed &&
      assets != null &&
      assets.multiAsset === undefined &&
      assets.lovelace === donation &&
      tryAddressBech32(Address, output.address) === ownAddress;
    if (isSelfPayment) {
      removed = true;
      continue;
    }
    keptOutputs.push(output);
  }
  if (!removed) {
    throw new Error("Could not locate the temporary self-payment output for the treasury donation.");
  }

  // The SDK's body/output objects are plain mutable instances; mutate in place
  // rather than reconstructing the tagged classes.
  body.outputs = keptOutputs;
  body.currentTreasuryValue = BigInt(currentTreasuryValue);
  body.donation = donation;

  const unsignedTx = Transaction.toCBORHex(tx);
  const witnessSet = await api.signTx(unsignedTx, false);
  const signedTx = Transaction.addVKeyWitnessesHex(unsignedTx, witnessSet);
  return api.submitTx(signedTx);
}
