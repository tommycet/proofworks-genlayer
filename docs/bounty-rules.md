# Bounty Rules — Appeal Fees and Worker Staking

This document describes the appeal and staking mechanics introduced in ProofWorks Phase 9.

## Appeal Bond

When a worker disputes a bounty verdict, an **appeal bond** is required.

- The appeal bond is **20% of the task reward**.
- The bond is locked at the time the appeal is filed.
- If the appeal is **upheld** (the worker wins), the bond is returned in full.
- If the appeal is **rejected** (the original verdict stands), the bond is forfeited and distributed to the original task creator.

## Worker Staking

Workers must stake GEN tokens when claiming a bounty task.

- The worker stake is **forfeited if the claim expires without a proof submission**.
- This ensures workers only claim tasks they intend to complete.
- The stake is returned when the worker submits a valid proof or when the bounty is resolved.

## Summary

| Action | Amount | Outcome |
|--------|--------|---------|
| File appeal | 20% of reward | Bond locked; returned if upheld, forfeited if rejected |
| Claim task | Worker stake | Locked until proof submission or resolution |
| Expire without proof | Worker stake | Forfeited |
