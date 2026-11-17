import useIsBrowser from "@docusaurus/useIsBrowser";
import useKoiosResource from "@site/src/components/TreasurySections/useKoiosResource";
import {
  deriveStage,
  findAction,
  normalizeActions,
  normalizeParams,
  normalizeVotes,
} from "@site/src/utils/cardano/hardForkStatus.mjs";

const PARAMS_PATH =
  "/epoch_params?limit=1&order=epoch_no.desc&select=epoch_no,protocol_major,protocol_minor,dvt_hard_fork_initiation,pvt_hard_fork_initiation";
// Mainnet has had two of these since 2025, far below the 1000-row default.
const ACTIONS_PATH =
  "/proposal_list?proposal_type=eq.HardForkInitiation&select=proposal_id,proposed_epoch,ratified_epoch,enacted_epoch,expired_epoch,dropped_epoch,expiration,proposal_description";

// Module-level so the hook dependencies stay stable between renders.
const hasParams = (params) => params !== null;
// Plomin and van Rossem are always in the list, so empty means a bad response.
const hasActions = (actions) => actions.length > 0;
const hasVotes = (votes) => votes !== null;

// The stage of a hard fork: the one typed in the data until mainnet says
// otherwise. The typed stage also renders on the server, on the first client
// render, while loading and on error, so the page never waits for the chain.
export function useHardForkStatus(fork) {
  const isBrowser = useIsBrowser();
  const params = useKoiosResource({
    cacheKey: "cardano-hard-fork-params-v1",
    path: PARAMS_PATH,
    normalize: normalizeParams,
    isUsable: hasParams,
  });
  const actions = useKoiosResource({
    cacheKey: "cardano-hard-fork-actions-v1",
    path: ACTIONS_PATH,
    normalize: normalizeActions,
    isUsable: hasActions,
  });
  if (!isBrowser) return { stage: fork.stage, fromChain: false };
  const status = deriveStage({
    editorStage: fork.stage,
    target: fork.version,
    params: params.data,
    action: findAction(actions.data || [], fork.version),
  });
  return { ...status, thresholds: params.data };
}

// Vote shares of one governance action. Mounted only once an action exists.
export function useHardForkVotes(actionId) {
  return useKoiosResource({
    cacheKey: `cardano-hard-fork-votes-v1-${actionId}`,
    path: `/proposal_voting_summary?_proposal_id=${actionId}&select=drep_yes_pct,pool_yes_pct,committee_yes_votes_cast,committee_no_votes_cast`,
    normalize: normalizeVotes,
    isUsable: hasVotes,
  });
}
