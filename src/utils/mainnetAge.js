// Cardano's genesis block (Byron, epoch 0) was produced on 23 September 2017
// at 21:44:51 UTC, the chain's system start. Anniversaries count from here.
export const MAINNET_LAUNCH = new Date(Date.UTC(2017, 8, 23, 21, 44, 51));

// Full years since the genesis block, evaluated at build time so copy like
// "N years, never halted" stays correct without manual updates.
export function yearsSinceMainnetLaunch(now = new Date()) {
  let years = now.getUTCFullYear() - MAINNET_LAUNCH.getUTCFullYear();
  const anniversary = new Date(MAINNET_LAUNCH);
  anniversary.setUTCFullYear(now.getUTCFullYear());
  if (now < anniversary) years -= 1;
  return years;
}
