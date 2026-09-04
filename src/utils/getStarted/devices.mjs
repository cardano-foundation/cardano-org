// Device detection for the wallet picker. Runs only in the browser after
// mount, the server render passes `null` and gets every pick.
// Known limitation: iPadOS 13+ reports itself as a Mac and lands on desktop.
export function detectDevice(userAgent) {
  const ua = typeof userAgent === 'string' ? userAgent : '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

const PLATFORMS_FOR = {
  ios: ['ios'],
  android: ['android'],
  desktop: ['browser', 'desktop'],
};

export function pickWalletsForDevice(wallets, device, limit = 3) {
  const picks = wallets.filter((w) => w.maintainerPick && w.walletFeatures);
  const platforms = PLATFORMS_FOR[device];
  const matching = platforms
    ? picks.filter((w) => w.walletFeatures.platforms.some((p) => platforms.includes(p)))
    : picks;
  return matching.slice(0, limit);
}
