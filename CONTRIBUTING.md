# Contributing to ProofWorks GenLayer

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tommycet/proofworks-genlayer.git
   cd proofworks-genlayer
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the GenVM environment setup:**
   ```bash
   make setup-genvmroot
   ```

4. **Install frontend dependencies (optional, for UI development):**
   ```bash
   make frontend-install
   ```

## Running the tests

Run the full test suite with:

```bash
make test
```

This executes `pytest -q` after initializing the GenVM environment. For linting smart contracts:

```bash
make lint-contract
```

To validate everything (tests, lint, frontend build):

```bash
make validate-all
```

## Submitting a pull request

1. **Fork the repository** and create a feature branch from `main`.
2. **Make your changes** — follow existing code style and conventions.
3. **Run the tests** with `make test` to ensure nothing is broken.
4. **Commit** with a clear, descriptive message (e.g., `feat: add escrow expiration check`).
5. **Push** your branch and open a pull request against `tommycet/proofworks-genlayer:main`.
6. **Describe your changes** in the PR body — include what you changed, why, and any relevant issue references.

PRs are reviewed on a rolling basis. Ensure all CI checks pass before requesting review.
