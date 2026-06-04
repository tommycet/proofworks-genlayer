# Bounty Rules

ProofWorks uses escrow rules to keep both creators and workers accountable during a bounty lifecycle. This page documents the Phase 9 appeal fee and worker staking behavior.

## Appeal Fees

When a party appeals a verdict, the appellant must post an appeal bond equal to **20% of the task reward**.

For example, a task with a 1,000 GEN reward requires a 200 GEN appeal bond. If the posted value is lower than 20% of the reward, the appeal is rejected before it can enter juror voting.

After the three jurors resolve the appeal:

- If the appellant wins, the appeal bond is returned to the appellant.
- If the appellant loses, the appeal bond is distributed to the jurors.

## Worker Staking

Creators can configure a required worker stake as a percentage of the task reward. When a worker claims a task with a required stake, the worker must lock that stake at claim time.

The worker stake is returned with the payout when the worker completes the task and the bounty is finalized successfully.

If the claim expires without a proof submission, the worker stake is **forfeited**. The forfeited stake is split between the creator and the treasury when `release_expired_claim` frees the stale claim.

This makes stale claims costly while allowing anyone to reopen expired work for another worker.
