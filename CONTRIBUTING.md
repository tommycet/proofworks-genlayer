# Contributing to ProofWorks

Thank you for your interest in contributing to ProofWorks, a GenLayer escrow contract for GitHub bounty payouts.

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/tommycet/proofworks-genlayer.git
   cd proofworks-genlayer
   ```

2. **Install Python dependencies**

   The project requires Python 3.10 or later.

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the GenVM root**

   The contract tests run inside a GenLayer simulated environment. Run the setup script to create a local GenVM root:

   ```bash
   make setup-genvmroot
   ```

   This creates a `.genvmroot` directory at the repository root with the GenLayer runtime and test infrastructure.

4. **Install frontend dependencies** (optional, only needed for UI changes)

   ```bash
   make frontend-install
   ```

## Running the tests

The project uses pytest with GenLayer's direct-mode test runner. All tests live under `tests/direct/` and cover one contract phase per file.

Run the full test suite:

```bash
make test
```

This command runs `pytest -q` after ensuring the GenVM root is set up.

For a complete validation pass that also lints the contract and builds the frontend:

```bash
make validate-all
```

## Submitting a pull request

1. Fork this repository and create a feature branch from `main`.
2. Make your changes and ensure all tests pass with `make test`.
3. If you modified the Intelligent Contract (`contracts/proofworks_escrow.py`), run `make lint-contract` to verify it passes the GenVM linter.
4. Commit your changes with a clear, descriptive message.
5. Push your branch and open a pull request against the `main` branch of `tommycet/proofworks-genlayer`.
6. In the PR description, reference any related issues and describe what your changes do and why.
7. A maintainer will review your PR. CI checks (if configured) must pass before merging.
