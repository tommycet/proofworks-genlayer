# ProofWorks Demo Walkthrough

Live demo: https://proofworks-genlayer.vercel.app

1. Open the live demo in a browser. The docket and escrow summary can be viewed without a wallet.
2. Connect an injected Studionet wallet, or click `Use free burners` and keep the `Creator` burner selected.
3. In `Create escrow case`, create a simple text case:
   - Title: `Smoke test proof`
   - Description: `Submit proof that says done.`
   - Acceptance criteria: `The proof text must say done.`
   - Evidence: `TEXT`
   - Reward: `1`
   Then click `Seal new case` and wait for the transaction to be accepted.
4. Select the new open case, switch the burner role to `Worker`, enter `done` in `Proof text`, and click `Submit evidence`.
5. When the case status is `SUBMITTED`, click `Run AI jury` to ask GenLayer validators to evaluate the submitted proof.
6. Review the verdict panel. For the smoke case, the expected result is an approved verdict with a 100% payout.
7. Click `Finalize payout` and wait for finalization. The case should move to `PAID`, the active escrow should decrease, and the payout/refund summary should update.
8. To try a GitHub-backed case, create another case with `Evidence` set to `GITHUB_PR`, add GitHub issue-style acceptance criteria, and submit a public pull request URL as proof before running the same AI jury and finalize flow.
