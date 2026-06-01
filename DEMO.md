# ProofWorks — Live Demo Walkthrough

This guide walks you through the complete ProofWorks demo flow at [https://proofworks-genlayer.vercel.app](https://proofworks-genlayer.vercel.app).

ProofWorks is a GenLayer escrow contract that pays out GitHub bounties when AI validators agree the work actually got done. The demo lets you play through all three roles — Creator, Worker, and Juror — using a burner wallet so no real funds are needed.

---

## Prerequisites

- A modern browser (Chrome, Firefox, Edge, Brave)
- No wallet required — the burner wallet panel handles everything
- ~5 minutes to complete the full flow

---

## Step-by-Step Walkthrough

### 1. Open the Demo

Navigate to **[https://proofworks-genlayer.vercel.app](https://proofworks-genlayer.vercel.app)**.

You'll see the main dashboard showing existing tasks, their statuses, and a role switcher on the right side. If your browser has an injected wallet (MetaMask, Rabby), it connects automatically. If not, the read-only view still works and you can use the burner wallet panel.

---

### 2. Connect or Use a Burner

Click the **"Connect Wallet"** button in the top-right corner, or open the **Burner Wallet** panel from the sidebar.

The burner wallet creates a disposable address pre-loaded with testnet GEN tokens. This lets you switch between Creator, Worker, and Juror roles without a real funded account. The burner panel shows your current balance and lets you switch roles with one click.

---

### 3. Switch to Creator Role & Create a Task

1. In the burner wallet panel, click **"Switch to Creator"**.
2. Click the **"Create Task"** button in the main interface.
3. Fill in the form:
   - **Title**: A short name for your task (e.g. "Add DEMO.md to the repo").
   - **Description**: What needs to be done.
   - **Acceptance Criteria**: Specific, checkable conditions (e.g. "A file named DEMO.md exists at the repo root").
   - **GitHub Issue URL**: Link to the GitHub issue describing the work.
   - **Reward**: Amount of GEN to escrow for the worker.
4. Click **"Create & Fund"**. The contract locks your GEN into escrow. The task now appears on the dashboard with status **Open**.

---

### 4. Switch to Worker Role & Claim the Task

1. In the burner wallet panel, click **"Switch to Worker"**.
2. Find your task in the dashboard (it should show as **Open**).
3. Click the task, then click **"Claim Task"**.
4. If the task requires a worker stake, the contract will lock that amount from your wallet.
5. The task status changes to **Claimed**. You are now the assigned worker.

---

### 5. Submit Proof (Pull Request)

1. Do the actual work described in the task (in a real scenario you'd open a PR on GitHub).
2. Back in the ProofWorks UI, click **"Submit Proof"** on your claimed task.
3. Paste the GitHub Pull Request URL into the input field.
4. Click **"Submit"**. The contract records your proof and triggers the AI jury.

---

### 6. AI Jury Evaluates the Work

Once proof is submitted, the GenLayer Intelligent Contract calls validators to evaluate whether the work meets the acceptance criteria:

1. Validators independently fetch the GitHub issue and PR.
2. Each validator runs an LLM against a structured prompt.
3. Through Optimistic Democracy consensus, the validators converge on a verdict.
4. The verdict is stored on-chain: **APPROVE**, **REJECT**, or **REQUEST_REVISION**.

This step takes a few minutes as the validators reach consensus. The task status updates to **Evaluating** while in progress.

---

### 7. Finalize the Task

When the jury reaches consensus:

1. Click **"Finalize Task"** on the task card.
2. The contract executes the payout logic based on the verdict:
   - **APPROVE** → Worker receives the escrowed GEN.
   - **REJECT** → Creator is refunded.
   - **REQUEST_REVISION** → Worker is prompted to revise and resubmit.
   - **Partial split** → If the work was partially satisfactory, funds are split proportionally.
3. The task status updates to its final state.

---

### 8. Explore as a Juror (Optional)

1. In the burner wallet panel, click **"Switch to Juror"**.
2. View pending evaluations in the dashboard.
3. While the demo uses GenLayer validators as the jury, the juror panel shows you the evaluation process, verdict details (score, reasoning, matched criteria), and consensus state.

---

## What You Just Did

- ✅ Created a funded task with acceptance criteria
- ✅ Claimed it as a worker
- ✅ Submitted proof of work via a GitHub PR
- ✅ Watched AI validators evaluate the submission
- ✅ Finalized the task for payout or refund

The entire flow runs on GenLayer testnet. No real money is involved, and the burner wallet makes it easy to replay with different roles.

---

## More Information

- **Repository**: [tommycet/proofworks-genlayer](https://github.com/tommycet/proofworks-genlayer)
- **Architecture Docs**: See `docs/architecture.md` for Mermaid diagrams
- **Contract Reference**: See `README.md#contract-reference`
