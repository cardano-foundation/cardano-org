// Pure address parsing for the get-started page. The Evolution SDK is passed
// in instead of imported so the browser can keep loading it lazily via
// loadEvolution() while node tests import it directly.
const MAINNET = 1;

export function parseCardanoAddress(input, sdk) {
  const text = typeof input === 'string' ? input.trim() : '';
  if (!text) return { error: 'empty' };
  const lower = text.toLowerCase();

  if (lower.startsWith('addr_test1') || lower.startsWith('stake_test1')) {
    return { error: 'testnet' };
  }

  if (lower.startsWith('stake1')) {
    let account;
    try {
      account = sdk.RewardAccount.fromBech32(text);
    } catch (e) {
      return { error: 'invalid' };
    }
    if (account.networkId !== MAINNET) return { error: 'testnet' };
    return { kind: 'stake', stakeAddress: sdk.RewardAccount.toBech32(account) };
  }

  if (!lower.startsWith('addr1')) return { error: 'invalid' };

  // getAddressDetails returns undefined for anything it cannot parse.
  const details = sdk.Address.getAddressDetails(text);
  if (!details) return { error: 'invalid' };
  if (details.networkId !== MAINNET) return { error: 'testnet' };
  const stakeCredential = details.type === 'Base' ? sdk.Address.getStakingCredential(text) : undefined;
  if (!stakeCredential) return { error: 'noStake' };

  const stakeAddress = sdk.RewardAccount.toBech32(
    new sdk.RewardAccount.RewardAccount({ networkId: MAINNET, stakeCredential }),
  );
  return { kind: 'base', stakeAddress, baseAddress: details.address.bech32 };
}

export function shortenAddress(addr) {
  if (typeof addr !== 'string' || addr.length <= 20) return addr;
  return `${addr.slice(0, 10)}…${addr.slice(-6)}`;
}
