# Bounty rules

This page documents the Phase 9 bounty rules around appeals and worker staking.

## Appeal bond

Appealing a verdict requires an appeal bond equal to 20% of the task reward.

- Formula: `appeal bond = reward * 20%`
- Example: a task with a reward of `1000` requires an appeal bond of `200`

The bond is posted when `appeal_verdict(task_id)` is called.

## Worker stake

Some tasks require a worker stake when they are claimed. The required stake is derived from the task's `required_stake_percent`.

- Formula: `worker stake = reward * required_stake_percent / 100`
- If `required_stake_percent` is `0`, no worker stake is required

If a worker claims a task and the claim later expires without a proof submission, the worker stake is forfeited.

On forfeiture, the current Phase 9 behavior splits the locked stake between the creator and the treasury instead of returning it to the worker.
