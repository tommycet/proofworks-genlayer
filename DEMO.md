# ProofWorks Live Demo Walkthrough

Use the hosted demo at https://proofworks-genlayer.vercel.app to walk through
the full escrow flow in a browser.

1. Open https://proofworks-genlayer.vercel.app and wait for the task docket and
   escrow summary to load.
2. Connect an injected wallet, or click **Use free burners** to run the demo
   without a funded account. Burner mode lets you switch between Creator,
   Worker, and Juror roles.
3. As the Creator, create a small task in the **Create escrow case** panel. For a
   smoke test, use text-submission evidence and an acceptance criterion such as
   `The proof text must say done`.
4. Switch to the Worker burner role, select the new task, and claim it if
   needed.
5. Submit proof for the task. For the smoke test, enter `done` as the proof text.
6. Click **Run AI jury** so the GenLayer adjudication flow evaluates the task
   evidence against the acceptance criteria.
7. Review the verdict panel. A successful smoke test should show an approval
   decision, a high score, and a 100% payout.
8. Click **Finalize payout** to complete the case. The UI waits for finalization
   before showing the task as paid and updating the escrow summary.

For a GitHub-based demo, create a task with GitHub PR evidence, submit a public
pull request URL as proof, run the AI jury, and finalize after the verdict is
approved.
