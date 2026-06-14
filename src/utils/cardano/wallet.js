// Lightweight CIP-30 wallet helpers backed by the Evolution SDK.
//
// The SDK (and its WASM) is imported dynamically so it only loads in the
// browser the moment it is actually needed. This keeps the initial bundle
// small and the modules out of the server-side render.

let evolutionPromise;

// Memoized dynamic import of the Evolution SDK.
export function loadEvolution() {
  if (!evolutionPromise) {
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
    .build();

  const unsignedTx = Transaction.toCBORHex(await built.toTransaction());
  const witnessSet = await api.signTx(unsignedTx, false);
  const signedTx = Transaction.addVKeyWitnessesHex(unsignedTx, witnessSet);
  return api.submitTx(signedTx);
}
