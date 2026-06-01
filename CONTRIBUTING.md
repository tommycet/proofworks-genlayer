# Contributing to ProofWorks

ProofWorks is a GenLayer escrow contract that pays out GitHub bounties when AI validators agree the work actually got done. We welcome contributions from the community, whether you're fixing bugs, adding features, improving documentation, or reporting issues.

## Setup

### Prerequisites

- **Python 3.10+** — for running tests and the contract linter
- **Node.js 18+** and **npm** — for the frontend and deployment scripts
- **A GenLayer-compatible wallet** — for deploying to Studionet or Bradbury testnets

### Clone and install

```bash
git clone https://github.com/tommycet/proofworks-genlayer.git
cd proofworks-genlayer

# Install Python dependencies
pip install -r requirements.txt

# Install root-level JS dependencies (for deployment scripts)
npm install

# Install frontend dependencies
npm --prefix frontend install
```

### Environment setup

For deployment, you'll need a private key with test GEN on the target network:

```bash
# For Studionet (recommended for testing)
export PRIVATE_KEY=0x...

# For Bradbury testnet
export PRIVATE_KEY=0x...
```

**Warning:** Always use a disposable burner key. Never use a funded mainnet key with these scripts.

## Running the tests

The Makefile wraps the full test workflow, including SDK pinning:

```bash
# Run the full test suite (pins GenVM SDK, then runs pytest)
make test
```

You should see `89 passed` in about 3.6 seconds on a clean clone.

### Additional make targets

| Command | What it does |
|---|---|
| `make test` | Run the full pytest suite (89 tests) |
| `make lint-contract` | Lint the GenVM contract with `genvm-lint` |
| `make frontend-install` | Install frontend npm dependencies |
| `make frontend-build` | Build the frontend for production |
| `make validate-all` | Run tests + linter + frontend build |

### Running specific test files

All tests live in the `tests/` directory and are organized by phase:

| File | Covers |
|---|---|
| `test_phase1_task_lifecycle.py` | create, claim, submit, cancel, basic getters |
| `test_phase2_adjudication.py` | mocked LLM verdicts, validator function, malformed output rejection |
| `test_phase3_github_evidence.py` | URL parsing, evidence shaping, GitHub API call mocks |
| `test_phase4_escrow_finalization.py` | payout, refund, partial split, finalization safety checks |
| `test_phase6_issue_pr_revision.py` | issue-to-PR matching, same-repo enforcement, revision loop |
| `test_phase7_reputation_manifest_expiry.py` | reputation counters, agent task manifests, claim expiry |
| `test_phase8_milestones.py` | multi-milestone tasks and per-milestone finalization |
| `test_phase9_future_features.py` | staking, appeals, juror voting, flagging window, team splits, tips |

Run a single file with:

```bash
pytest tests/test_phase1_task_lifecycle.py -v
```

### Running the frontend locally

```bash
npm --prefix frontend run dev
```

The dev server defaults to the Studionet contract address. Override it with `VITE_CONTRACT_ADDRESS=0x...` if you deployed your own.

## Submitting a pull request

1. **Fork the repository** and create a feature branch from `main`.
2. **Make your changes.** Keep them focused — one concern per PR.
3. **Run the tests** with `make test` to make sure nothing is broken.
4. **Update documentation** if your change affects how the project is used or deployed.
5. **Open a pull request** against the `main` branch with a clear description of:
   - What the change does and why
   - Any relevant issue numbers (e.g., `Closes #26`)
   - Testing you've done

### PR guidelines

- Write clear, descriptive commit messages.
- Keep PRs small and focused. If a change touches contracts, frontend, and tests, consider splitting into separate PRs.
- For contract changes, include lint results (`make lint-contract`).
- For frontend changes, verify the production build passes (`make frontend-build`).
- Mark the PR as a draft if it's still in progress, and ready for review when it's complete.

### Code of conduct

Be respectful and constructive in all interactions. We're building in public and we value every contribution.
