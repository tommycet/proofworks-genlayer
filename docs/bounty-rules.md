# Bounty Rules — Appeal Fees and Staking

This document describes the economic rules governing appeals and worker staking in ProofWorks.

## Appeal Bond

When a worker wishes to dispute or appeal a task result, they must post an **appeal bond**.

- **Bond amount:** 20% of the task reward.
- The bond is posted in the same token used for the task reward.
- If the appeal is successful, the bond is returned to the appellant.
- If the appeal is unsuccessful, the bond is forfeited and distributed to the counterparty or protocol treasury.

**Example:** For a task with a reward of 100 tokens, the appeal bond would be 20 tokens.

## Worker Staking and Claim Expiry

Workers are required to stake tokens when claiming a task. This stake serves as a commitment to complete the work within the required timeframe.

- **Stake requirement:** Workers must deposit a stake before claiming a task.
- **Stake forfeiture:** If a worker's claim **expires without proof submission**, the worker's stake is **forfeited** in its entirety.
- Forfeited stake funds are redistributed according to the protocol's economic policy (e.g., to the task creator, protocol treasury, or reward pool).

**Key rule:** Always submit proof before the claim deadline to avoid losing your stake.

## Summary

| Event                        | Outcome                          |
|------------------------------|----------------------------------|
| Appeal filed                 | 20% of task reward posted as bond |
| Appeal successful            | Bond returned to appellant       |
| Appeal unsuccessful          | Bond forfeited                   |
| Claim expires, no proof      | Worker stake forfeited           |
