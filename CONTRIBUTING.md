# Contributing to ProofWorks

Thanks for your interest in contributing! This guide explains how to set up your environment, run the tests, and submit a pull request.

## Setup

### Prerequisites

- **Python 3.10+** with `pip`
- **Node.js 18+** with `npm`
- **Git**

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tommycet/proofworks-genlayer.git
   cd proofworks-genlayer
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Install Node dependencies (needed for scripts and frontend):

   ```bash
   npm install
   npm --prefix frontend install
   ```

4. Set up the GenLayer VM root (required before running tests or the linter):

   ```bash
   make setup-genvmroot
   ```

5. (Optional) Copy `.env.example` to `.env` and fill in values if you need to deploy to a testnet:

   ```bash
   cp .env.example .env
   ```

### Using Dev Containers

If you use VS Code with the Dev Containers extension, open the repo in a container. The `postCreateCommand` in `.devcontainer/devcontainer.json` handles all dependency installation automatically.

## Running the tests

Run the full test suite with:

```bash
make test
```

This runs `pytest -q` against the `tests/` directory. The `setup-genvmroot` target is executed automatically before tests if the `.genvmroot` directory does not exist.

To run a specific test file:

```bash
pytest tests/test_escrow.py -q
```

To run the contract linter:

```bash
make lint
```

To run everything (tests, linter, frontend build):

```bash
make validate-all
```

## Submitting a pull request

1. **Fork** the repository and create a branch from `main`:

   ```bash
   git checkout -b my-feature
   ```

2. Make your changes. Keep commits focused and well-described.

3. Make sure all tests pass:

   ```bash
   make test
   ```

4. If you modified the contract (`contracts/`), also run the linter:

   ```bash
   make lint
   ```

5. Push your branch and open a pull request against `main`.

6. In your PR description, explain **what** you changed and **why**. Reference any related issues (e.g., `Closes #26`).

7. Wait for CI checks and a maintainer review. If changes are requested, push additional commits to the same branch.

### PR guidelines

- Keep PRs small and focused on one change.
- Write clear commit messages.
- Add or update tests if your change affects behavior.
- Do not commit `.env` files or private keys.
