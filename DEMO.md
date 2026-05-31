# ProofWorks + GenLayer Demo

A step-by-step walkthrough of the ProofWorks autonomous AI jury system powered by GenLayer.

## Live Demo

Visit [proofworks-genlayer.vercel.app](https://proofworks-genlayer.vercel.app)

## Demo Flow

1. **Open the website** — Navigate to [proofworks-genlayer.vercel.app](https://proofworks-genlayer.vercel.app)

2. **Connect your wallet** — Click "Connect Wallet" and approve the connection in your wallet (MetaMask, WalletConnect, etc.)

3. **Create a new task** — Select a task type and fill in the task details (claim, evidence sources, parameters)

4. **Submit evidence** — Upload or link the evidence documents/URLs that support your task claim

5. **Run the AI Jury** — Click "Submit Task" to deploy it on GenLayer. The task is sent to Intelligent Contracts for AI-powered evaluation

6. **Wait for results** — The AI Jury analyzes the evidence and votes on the task outcome. Results appear in the task dashboard once processing is complete

7. **Claim reward** — If the verdict is in your favor, claim your reward directly from the dashboard

## Architecture

- **Frontend**: Next.js deployed on Vercel
- **Smart Contracts**: Solidity on GenLayer testnet
- **AI Jury**: GenLayer Intelligent Contracts for autonomous task evaluation
- **Storage**: On-chain evidence and verdicts
