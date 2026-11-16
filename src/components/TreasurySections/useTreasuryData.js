import useKoiosResource from "./useKoiosResource";
import { normalizeTotals, normalizeWithdrawals } from "@site/src/utils/insights/treasuryMath.mjs";

// Module-level so the hook dependencies stay stable between renders.
const hasEnoughEpochs = (points) => points.length >= 3;
// An empty list cannot be told apart from a missing response, and the
// governance era always has withdrawals, so empty counts as unusable.
const hasWithdrawals = (list) => list.length > 0;

export function useTreasuryTotals() {
  return useKoiosResource({
    cacheKey: "cardano-treasury-totals-v1",
    path: "/totals?select=epoch_no,treasury,reserves,fees&order=epoch_no.asc",
    normalize: normalizeTotals,
    isUsable: hasEnoughEpochs,
  });
}

export function useTreasuryWithdrawals() {
  return useKoiosResource({
    cacheKey: "cardano-treasury-withdrawals-v1",
    // Koios returns up to 1000 rows by default, far above the 70 enacted withdrawals of 2026.
    path: "/proposal_list?proposal_type=eq.TreasuryWithdrawals&enacted_epoch=not.is.null&select=proposal_id,enacted_epoch,meta_json-%3Ebody-%3Etitle,withdrawal&order=enacted_epoch.desc",
    normalize: normalizeWithdrawals,
    isUsable: hasWithdrawals,
  });
}
