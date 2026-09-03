// Cardano mainnet (Byron) started producing blocks on 29 September 2017.
export const MAINNET_LAUNCH = new Date(Date.UTC(2017, 8, 29));

// Full years since mainnet launch, evaluated at build time so copy like
// "N years, never halted" stays correct without manual updates.
export function yearsSinceMainnetLaunch(now = new Date()) {
  let years = now.getUTCFullYear() - MAINNET_LAUNCH.getUTCFullYear();
  const beforeAnniversary =
    now.getUTCMonth() < MAINNET_LAUNCH.getUTCMonth() ||
    (now.getUTCMonth() === MAINNET_LAUNCH.getUTCMonth() && now.getUTCDate() < MAINNET_LAUNCH.getUTCDate());
  if (beforeAnniversary) years -= 1;
  return years;
}
