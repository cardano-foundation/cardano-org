// Where a planned hard fork stands on mainnet, worked out from Koios data.
//
// A hard fork is enacted through a HardForkInitiation governance action that
// names the protocol version it moves to. Anyone can submit such an action,
// so an action counts only when its version equals the hard fork's target.
// The functions here are pure: the page fetches, these decide.

// The newest epoch_params row: mainnet's protocol version and the share of
// DRep and stake pool stake a hard fork initiation needs.
export function normalizeParams(rows) {
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row || typeof row.protocol_major !== 'number') return null;
  return {
    epoch: row.epoch_no,
    major: row.protocol_major,
    minor: row.protocol_minor,
    drepThreshold: row.dvt_hard_fork_initiation,
    poolThreshold: row.pvt_hard_fork_initiation,
  };
}

function actionState(row) {
  if (row.enacted_epoch != null) return 'enacted';
  if (row.ratified_epoch != null) return 'ratified';
  if (row.expired_epoch != null || row.dropped_epoch != null) return 'closed';
  return 'open';
}

// proposal_list rows of type HardForkInitiation, reduced to what the page
// reads. Rows without a target version are dropped.
export function normalizeActions(rows) {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => ({
      id: row.proposal_id,
      major: row.proposal_description?.contents?.[1]?.major,
      state: actionState(row),
      proposedEpoch: row.proposed_epoch,
      ratifiedEpoch: row.ratified_epoch,
      enactedEpoch: row.enacted_epoch,
      expiration: row.expiration,
    }))
    .filter((action) => typeof action.id === 'string' && typeof action.major === 'number');
}

const STATE_RANK = { enacted: 3, ratified: 2, open: 1 };

// The action that decides a hard fork to `major`: an enacted one before a
// ratified one before an open one, the newest first within a state. Expired
// and dropped actions never count.
export function findAction(actions, major) {
  if (typeof major !== 'number') return null;
  const candidates = actions.filter((action) => action.major === major && action.state !== 'closed');
  candidates.sort(
    (a, b) => STATE_RANK[b.state] - STATE_RANK[a.state] || b.proposedEpoch - a.proposedEpoch,
  );
  return candidates[0] || null;
}

// The stage to show for a hard fork. The chain wins once it says something:
// mainnet already runs the target version, or an action to that version is
// enacted, ratified or open. Otherwise the stage typed in the data stands.
// A ratified action takes effect at the next epoch boundary.
export function deriveStage({ editorStage, target, params, action }) {
  if (typeof target !== 'number') return { stage: editorStage, fromChain: false };
  if ((params && params.major >= target) || action?.state === 'enacted') {
    return { stage: 'live', fromChain: true };
  }
  if (action?.state === 'ratified') {
    return { stage: 'scheduled', fromChain: true, actionId: action.id, epoch: action.ratifiedEpoch + 1 };
  }
  if (action?.state === 'open') {
    return { stage: 'vote', fromChain: true, actionId: action.id, expiration: action.expiration };
  }
  return { stage: editorStage, fromChain: false };
}

// The one row proposal_voting_summary returns for an action.
export function normalizeVotes(rows) {
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row || typeof row.drep_yes_pct !== 'number' || typeof row.pool_yes_pct !== 'number') return null;
  return {
    drepYesPct: row.drep_yes_pct,
    poolYesPct: row.pool_yes_pct,
    committeeYes: row.committee_yes_votes_cast,
    committeeNo: row.committee_no_votes_cast,
  };
}
