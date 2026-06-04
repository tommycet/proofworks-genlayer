# Contributing to ProofWorks

Thanks for taking the time to look at this. The project is small enough that one good PR can move it forward visibly.

## Setup

Clone the repo and install everything from the project root:

```bash
pip install -r requirements.txt
npm install
npm --prefix frontend install
```

A working Python 3.11+ and Node 20+ environment is assumed.

## Running the tests

The contract suite uses `pytest` via `genlayer-test` direct mode and runs in about four seconds:

```bash
make test
```

You should see `89 passed`. If you see SDK loader errors, make sure `scripts/setup_genvmroot.py` ran successfully (the `make test` target invokes it for you).

To lint the contract against the GenVM static checker:

```bash
make lint-contract
```

## Submitting a pull request

1. Open or claim an issue first so we can agree on the scope.
2. Branch from `main` and keep the PR focused on one logical change.
3. Make sure `make test` and `make lint-contract` both pass locally.
4. Reference the issue in the PR body with a closing keyword (`Closes #123`).
5. Open the PR from a branch on this same repository so the contract's same-repo check passes.

For larger changes, the `spec.md` (in the repository's earlier history) and `docs/architecture.md` give context on how the contract is structured.
