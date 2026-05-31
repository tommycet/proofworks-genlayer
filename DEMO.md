# ProofWorks Live Demo

Live demo: https://proofworks-genlayer.vercel.app

This walkthrough shows the shortest happy path through the ProofWorks GenLayer escrow flow.

1. Open https://proofworks-genlayer.vercel.app in a browser.
   The docket and escrow summary are readable without a wallet, so you can inspect existing cases first.

2. Connect a wallet or use a burner account.
   Use the wallet button if you have an injected wallet available, or choose the burner flow and switch between Creator and Worker roles for a local smoke test.

3. Create a task.
   As Creator, open the create-case form and enter a small task such as:
   - Title: `Frontend smoke oath`
   - Description: `Test the ProofWorks demo flow.`
   - Acceptance criteria: `The proof text must say done.`
   - Evidence type: `TEXT_SUBMISSION`
   - Reward: `1`
   Then submit the task and wait for the transaction to be accepted.

4. Submit proof.
   Switch to the Worker role, select the new task from the docket, and submit `done` as the proof text. The case should move from open or claimed state into submitted state.

5. Run the AI jury.
   Select the submitted task and run the AI jury/evaluation action. When the transaction is accepted, the verdict panel should show the decision, score, payout percentage, confidence, and reason.

6. Finalize the case.
   If the verdict approves the proof, click the finalize action. The UI waits for finalization because the payout/refund transfer happens only after the finalize transaction reaches the finalized state.

7. Review the result.
   After finalization, the task should show a paid or finalized status, the active escrow summary should update, and the submitted proof plus verdict should remain visible in the task detail panel.

For a GitHub PR demo instead of a text submission, create a case with GitHub PR evidence, submit a public pull request URL as proof, then run the same AI jury and finalization steps.
