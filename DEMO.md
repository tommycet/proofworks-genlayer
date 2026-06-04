# ProofWorks Demo Walkthrough

Welcome to the ProofWorks demo! This guide provides a step-by-step walkthrough of the platform's core workflow using the live demo.

You can access the live demo here: [https://proofworks-genlayer.vercel.app](https://proofworks-genlayer.vercel.app)

---

## Step-by-Step Demo Walkthrough

### 1. Open the Demo Site
Visit the live application in your browser at [https://proofworks-genlayer.vercel.app](https://proofworks-genlayer.vercel.app) and wait for the dashboard and escrow summary to load.

### 2. Connect or Use a Burner
Connect an injected wallet (like MetaMask) or click **"Use free burners"** to run the demo without a funded account. Burner mode allows you to easily switch roles between Creator, Worker, and Juror. Keep the **"Creator"** burner selected to begin.

### 3. Create a Task
Under the **"Create escrow case"** panel, create a simple text-based task:
- **Title**: `Smoke test proof`
- **Description**: `Submit proof that says done.`
- **Acceptance Criteria**: `The proof text must say done.`
- **Evidence Type**: `TEXT`
- **Reward**: `1`
    
Click **"Seal new case"** and wait for the transaction to be accepted.

### 4. Submit Proof
Select the newly opened case from the list. Switch your burner role to **"Worker"**, enter the word `done` in the **"Proof text"** field, and click **"Submit evidence"**.

### 5. Run AI Jury
When the case status changes to `SUBMITTED`, click **"Run AI jury"** to trigger the GenLayer Intelligent Contracts to evaluate the submitted proof.

### 6. Review the Verdict
Once the processing is complete, check the verdict panel. For this smoke test, the expected result is an approved verdict with a 100% payout based on the criteria.

### 7. Finalize
Click **"Finalize payout"** and wait for finalization. The case will move to `PAID`, the active escrow amount will decrease, and the payout summary will update on-chain.