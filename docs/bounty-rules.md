# ProofWorks — Bounty Rules: Appeal Fees & Staking

This document describes the appeal bond and worker staking rules introduced in [ProofWorks Phase 9](https://github.com/tommycet/proofworks-genlayer).

---

## Appeal Bond

Workers who wish to appeal a **REJECT** verdict must post an appeal bond before the appeal can be reviewed.

- **Bond amount:** 20% of the original task reward.
- **Purpose:** The bond prevents frivolous appeals by requiring the worker to put additional funds at risk.
- **Outcome:**
  - If the appeal is **upheld** (verdict changed to APPROVE): the bond is returned to the worker along with the task reward.
  - If the appeal is **denied** (verdict remains REJECT): the bond is forfeited and distributed according to the contract's fee rules.
- **Process:** After a REJECT verdict is finalized, the worker may call `appeal_task(task_id)` and fund it with the required bond amount. The task re-enters the evaluation phase for re-adjudication.

---

## Worker Staking

When a worker claims a task, the contract may require a stake to be locked as collateral.

- **Stake purpose:** The stake demonstrates commitment and prevents workers from claiming tasks and abandoning them.
- **Forfeiture condition:** If the worker's claim **expires** (the claim window closes) without the worker submitting a proof (PR URL), the stake is **forfeited**.
- **Return condition:** If the worker submits proof before the claim expires, the stake is returned upon task finalization, regardless of the verdict.
- **Stake amount:** Configured per task by the creator at task creation time. A stake of `0` means no staking is required for that task.

---

## Related

- Issue: [tommycet/proofworks-genlayer#4](https://github.com/tommycet/proofworks-genlayer/issues/4)
- Contract reference: See `README.md#contract-reference` for the escrow and finalization functions.
- Phase 9 changelog: See `CHANGELOG.md` for the full list of Phase 9 changes.
