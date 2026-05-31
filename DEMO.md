# ProofWorks Demo Flow

Live demo: https://proofworks-genlayer.vercel.app

1. Open the live demo and wait for the task board, action panel, and transaction console to load.
2. Use the free burner wallet controls if you do not have an injected wallet. Start as `Creator` when creating a bounty, then switch to `Worker` for claim and proof submission.
3. In the creator action panel, create a task with a title, description, acceptance criteria, reward, and optional worker stake. The task should appear on the board after the transaction is accepted.
4. Switch to the worker burner, select the new task, and claim it. If the task requires a stake, the claim action locks the required worker collateral.
5. Submit proof for the claimed task. For GitHub evidence, paste the pull request URL; for text evidence, describe the completed work in the proof text field.
6. Run the AI jury. GenLayer validators fetch the task evidence, produce a structured verdict, and store the decision, payout percent, confidence, and reason on-chain.
7. If the verdict needs a revision, update the proof and resubmit it, then run the AI jury again.
8. Finalize the task once the verdict is payable. The frontend waits for finalization before showing the payout/refund path as complete.

For appeal testing, switch into a juror burner role after an appeal opens, cast the required juror votes, and then finalize according to the jury outcome.
