# Bounty Rules

This document summarizes the Phase 9 bounty rules for appeal fees and worker staking in ProofWorks.

## Appeal bond

After a task has been evaluated, either the creator or the assigned worker can appeal the verdict before the task is finalized. Filing an appeal requires an appeal bond equal to 20% of the task reward.

In contract terms, the required appeal bond is calculated as:

```txt
appeal bond = task reward / 5
```

The appeal bond locks the case into the appealed state and opens the juror voting flow. If the appellant wins the appeal, the bond is returned to the appellant. If the appellant loses, the bond is distributed to the jurors.

## Worker staking

Creators can require a worker stake when creating a bounty. The required stake is expressed as a percentage of the task reward, and a worker must provide that stake when claiming the task.

In contract terms, the required worker stake is calculated as:

```txt
worker stake = task reward * required stake percent / 100
```

When the worker completes the bounty and the task is finalized, the worker stake is returned along with the worker payout.

## Claim expiry and stake forfeiture

If a claimed task reaches its claim expiry without a proof submission, the expired claim can be released. When that happens, the worker loses the locked stake and the task returns to the open state so another worker can claim it.

The forfeited stake is split between the task creator and the protocol treasury:

- 50% is paid to the task creator.
- The remaining 50% is paid to the treasury.

After the expired claim is released, the task has no assigned worker and no locked worker stake.
