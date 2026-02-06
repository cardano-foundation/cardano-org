export const MIN_EPOCH = 209;
export const GOVERNANCE_EPOCH_THRESHOLD = 571;

export function dateToEpoch(dateStr) {
  const startEpoch = MIN_EPOCH;
  const startDate = new Date('2020-08-03T21:44:00Z');
  const msPerEpoch = 5 * 24 * 60 * 60 * 1000; // 5 days
  const targetDate = new Date(dateStr);
  const msDiff = targetDate.getTime() - startDate.getTime();
  return startEpoch + Math.floor(msDiff / msPerEpoch);
}

export function getEpochDate(epoch) {
  const startEpoch = MIN_EPOCH;
  const startDate = new Date('2020-08-03T21:44:00Z');
  const msPerEpoch = 5 * 24 * 60 * 60 * 1000;
  const offsetEpochs = epoch - startEpoch;
  return new Date(startDate.getTime() + offsetEpochs * msPerEpoch)
    .toISOString()
    .split('T')[0];
}
